#!/usr/bin/env python3
"""
OCR a page range with surya (cached models), chunk paragraph-aware, embed
each chunk locally via Ollama bge-m3, and emit a SQL file of INSERT
statements (curriculum_chunks + chunk_embeddings) ready to apply against the
real Supabase project via the MCP execute_sql tool — no direct DB
credentials needed on this machine.
"""
import json
import sys
import time
from pathlib import Path

import pymupdf
import requests
from PIL import Image
from surya.detection import DetectionPredictor
from surya.recognition import RecognitionPredictor

OLLAMA_URL = "http://localhost:11434"
EMBED_MODEL = "bge-m3"

PDF_PATH = Path(__file__).parent.parent / "textbooks" / "physics_en.pdf"
PAGE_START = 42  # 0-indexed; printed page ~43
PAGE_END = 47
CHAPTER_ID = "cda52e59-7cc7-42ce-9cce-c2af330194d0"  # Force and Motion, from seed
CURRICULUM_VERSION_ID_QUERY = (
    "(select cv.id from curriculum_versions cv join subjects s on s.id=cv.subject_id "
    "where s.code='SSC-PHY' and cv.language_tag='en' and cv.is_active limit 1)"
)


def embed_text(text: str) -> list[float]:
    resp = requests.post(f"{OLLAMA_URL}/api/embed", json={"model": EMBED_MODEL, "input": text}, timeout=120)
    resp.raise_for_status()
    return resp.json()["embeddings"][0]


def chunk_page_text(text: str, max_chars: int = 1200) -> list[str]:
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
    return [c for c in chunks if len(c.strip()) >= 20]


def sql_escape(s: str) -> str:
    return s.replace("'", "''")


def main():
    doc = pymupdf.open(PDF_PATH)
    det = DetectionPredictor()
    rec = RecognitionPredictor()

    all_rows = []
    chunk_idx = 0

    for page_no in range(PAGE_START, PAGE_END + 1):
        pix = doc[page_no].get_pixmap(dpi=150)
        img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)

        t0 = time.time()
        results = rec([img], det_predictor=det)
        text = "\n".join(line.text for line in results[0].text_lines)
        print(f"page {page_no}: {len(text)} chars OCR'd in {time.time()-t0:.1f}s", file=sys.stderr, flush=True)

        for chunk_text in chunk_page_text(text):
            embedding = embed_text(chunk_text)
            all_rows.append(
                {
                    "page_no": page_no,
                    "chunk_index": chunk_idx,
                    "content_chunk": chunk_text,
                    "embedding": embedding,
                }
            )
            chunk_idx += 1

    print(f"Produced {len(all_rows)} chunks total.", file=sys.stderr)

    sql_lines = []
    for row in all_rows:
        emb_literal = "[" + ",".join(f"{v:.8f}" for v in row["embedding"]) + "]"
        sql_lines.append(
            f"""with new_chunk as (
  insert into public.curriculum_chunks
    (chapter_id, curriculum_version_id, content_chunk, content_format, source_book_page_ref, chunk_index)
  values
    ('{CHAPTER_ID}', {CURRICULUM_VERSION_ID_QUERY}, '{sql_escape(row["content_chunk"])}', 'markdown', '{row["page_no"]}', {row["chunk_index"]})
  returning id
)
insert into public.chunk_embeddings (chunk_id, model_name, model_version, embedding)
select id, 'bge-m3', 'ollama-latest', '{emb_literal}'::extensions.vector(1024) from new_chunk;"""
        )

    out_path = Path(__file__).parent / "insert_chunks.sql"
    out_path.write_text("\n\n".join(sql_lines))
    print(f"Wrote {out_path} ({len(sql_lines)} statements)", file=sys.stderr)

    # Also dump raw text for inspection
    Path(__file__).parent.joinpath("ocr_output.json").write_text(
        json.dumps(all_rows, ensure_ascii=False, indent=2)
    )


if __name__ == "__main__":
    main()
