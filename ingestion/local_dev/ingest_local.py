#!/usr/bin/env python3
"""
Local-dev ingestion: NCTB textbook PDF -> OCR (surya) -> chunks -> local
Ollama embeddings (bge-m3) -> userspace Postgres.

Same pipeline shape as ../ingest.py (the production path against Supabase +
Gemini), swapped to what's actually runnable in a no-root, no-GPU, no-API-key
sandbox:

  - OCR: surya (the same engine marker.pdf uses under the hood) instead of a
    VLM, since no vision-capable Ollama model or Gemini API key is available
    here. These are printed textbook pages, not handwriting, so base OCR
    without LLM correction is adequate — the transcription-fidelity concern
    from docs/review §3 is specifically about handwritten *student answers*,
    not machine-typeset curriculum source material.
  - Embeddings: Ollama bge-m3 (local, free, no API key) instead of
    gemini-embedding-001 — this is literally one of the two finalists
    docs/review §7.2 named for benchmarking, so using it here isn't a
    downgrade, it's the other real candidate.
  - Storage: userspace Postgres, double precision[] column instead of
    pgvector (see schema.sql for why).

Usage:
    python ingest_local.py --pdf ../textbooks/physics_en.pdf \
        --subject-code SSC-PHY --language en --chapter-no 3 \
        --page-start 45 --page-end 52
"""

from __future__ import annotations

import argparse
import hashlib
import sys
import time
from pathlib import Path

import requests
from PIL import Image

sys.path.insert(0, str(Path(__file__).parent))
from db import get_conn  # noqa: E402

OLLAMA_URL = "http://localhost:11434"
EMBED_MODEL = "bge-m3"


def sha256_of_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def pdf_pages_to_images(pdf_path: Path, page_start: int, page_end: int, dpi: int = 150):
    import pymupdf

    doc = pymupdf.open(pdf_path)
    images = []
    for i in range(page_start, min(page_end + 1, len(doc))):
        pix = doc[i].get_pixmap(dpi=dpi)
        img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        images.append((i, img))
    return images


def ocr_images_with_surya(images: list[tuple[int, Image.Image]]) -> list[tuple[int, str]]:
    """Runs Surya's detection+recognition OCR pipeline. Bengali and English
    are both in Surya's supported-language set; no --langs hint needed
    (matches the marker fix in docs/review §1.1 — that flag doesn't exist)."""
    from surya.foundation import FoundationPredictor
    from surya.recognition import RecognitionPredictor
    from surya.detection import DetectionPredictor

    foundation = FoundationPredictor()
    recognition_predictor = RecognitionPredictor(foundation)
    detection_predictor = DetectionPredictor()

    results = []
    for page_no, img in images:
        t0 = time.time()
        predictions = recognition_predictor([img], det_predictor=detection_predictor)
        text = "\n".join(line.text for line in predictions[0].text_lines)
        print(f"  page {page_no}: {len(text)} chars OCR'd in {time.time()-t0:.1f}s")
        results.append((page_no, text))
    return results


def embed_text(text: str) -> list[float]:
    resp = requests.post(f"{OLLAMA_URL}/api/embed", json={"model": EMBED_MODEL, "input": text}, timeout=120)
    resp.raise_for_status()
    return resp.json()["embeddings"][0]


def chunk_page_text(text: str, max_chars: int = 1500) -> list[str]:
    """Simple paragraph-aware chunking — good enough for a vertical slice;
    production ingestion (ingest.py) uses marker's own chunk boundaries."""
    paras = [p.strip() for p in text.split("\n") if p.strip()]
    chunks, current = [], ""
    for p in paras:
        if len(current) + len(p) > max_chars and current:
            chunks.append(current)
            current = p
        else:
            current = f"{current}\n{p}" if current else p
    if current:
        chunks.append(current)
    return chunks


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--pdf", required=True, type=Path)
    parser.add_argument("--subject-code", required=True)
    parser.add_argument("--language", required=True, choices=["bn", "en"])
    parser.add_argument("--chapter-no", required=True, type=int)
    parser.add_argument("--page-start", required=True, type=int)
    parser.add_argument("--page-end", required=True, type=int)
    args = parser.parse_args()

    checksum = sha256_of_file(args.pdf)
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("select id from subjects where code = %s", (args.subject_code,))
    subject_id = cur.fetchone()[0]

    cur.execute(
        "select id from curriculum_versions where subject_id=%s and language_tag=%s and is_active",
        (subject_id, args.language),
    )
    curriculum_version_id = cur.fetchone()[0]

    cur.execute(
        "select id from chapters where subject_id=%s and chapter_no=%s", (subject_id, args.chapter_no)
    )
    row = cur.fetchone()
    if not row:
        print(f"No chapter row for {args.subject_code} chapter {args.chapter_no}", file=sys.stderr)
        sys.exit(1)
    chapter_id = row[0]

    cur.execute(
        """insert into ingestion_jobs (subject_id, curriculum_version_id, source_pdf_path,
             source_pdf_checksum, page_range_start, page_range_end, status)
           values (%s,%s,%s,%s,%s,%s,'RUNNING')
           on conflict (source_pdf_checksum, page_range_start, page_range_end)
           do update set status='RUNNING', attempt_count = ingestion_jobs.attempt_count + 1
           returning id""",
        (subject_id, curriculum_version_id, str(args.pdf), checksum, args.page_start, args.page_end),
    )
    job_id = cur.fetchone()[0]
    conn.commit()

    try:
        print(f"Rendering pages {args.page_start}-{args.page_end} from {args.pdf.name}...")
        images = pdf_pages_to_images(args.pdf, args.page_start, args.page_end)

        print(f"Running Surya OCR on {len(images)} pages...")
        page_texts = ocr_images_with_surya(images)

        produced = 0
        chunk_idx = 0
        for page_no, text in page_texts:
            for chunk_text in chunk_page_text(text):
                if len(chunk_text.strip()) < 20:
                    continue

                embedding = embed_text(chunk_text)

                cur.execute(
                    """insert into curriculum_chunks
                         (chapter_id, curriculum_version_id, content_chunk, source_book_page_ref, chunk_index)
                       values (%s,%s,%s,%s,%s) returning id""",
                    (chapter_id, curriculum_version_id, chunk_text, str(page_no), chunk_idx),
                )
                chunk_id = cur.fetchone()[0]

                cur.execute(
                    """insert into chunk_embeddings (chunk_id, model_name, model_version, dims, embedding)
                       values (%s,%s,%s,%s,%s)""",
                    (chunk_id, EMBED_MODEL, "ollama-latest", len(embedding), embedding),
                )
                produced += 1
                chunk_idx += 1

        cur.execute(
            "update ingestion_jobs set status='DONE', chunks_produced=%s, completed_at=now() where id=%s",
            (produced, job_id),
        )
        conn.commit()
        print(f"[done] {produced} chunks ingested from pages {args.page_start}-{args.page_end}")

    except Exception as exc:
        conn.rollback()
        cur.execute(
            "update ingestion_jobs set status='FAILED', error_detail=%s where id=%s",
            (str(exc)[:2000], job_id),
        )
        conn.commit()
        raise
    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    main()
