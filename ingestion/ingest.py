#!/usr/bin/env python3
"""
NCTB textbook -> curriculum_chunks + chunk_embeddings ingestion pipeline.

Corrects every marker/Colab issue identified in docs/review/SSC_Phase_Technical_Review.md §1, §5.1:

  - Runs `marker_single` with --mode balanced (GPU pipeline: Surya VLM layout +
    inline-math OCR + re-OCR of problem pages), NOT --mode fast (the CPU
    pipeline the original hand-off guide specified while provisioning a GPU).
  - Does NOT pass --langs — that flag doesn't exist; Surya is multilingual and
    takes no language hint.
  - Tracked against the `ingestion_jobs` table (source PDF checksum + page
    range + status + attempt_count), so a run is resumable and auditable
    instead of living only in Colab session state, which can terminate
    without warning (docs/review §5.1).
  - Designed to run on any GPU box (local, spot L4/A100, or the Colab CLI for
    the single-book vertical slice) — nothing here is Colab-specific.

Usage:
    python ingest.py --pdf ../ingestion/textbooks/physics_en.pdf \
        --subject-code SSC-PHY --language en --chapter-no 3

Requires a running `marker_single` on PATH (pip install -r requirements.txt)
and a GPU for --mode balanced to be worth using; falls back to CPU
automatically if none is available, just slower.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

import requests
from dotenv import load_dotenv
from supabase import Client, create_client
from tenacity import retry, stop_after_attempt, wait_exponential

load_dotenv()

# Provider pivot (2026-08-13): NVIDIA NIM's 40 RPM limit bottlenecks ingestion
# unacceptably. We pivot to using BGE-M3 via a local Ollama instance. This removes
# all rate limits and allows the local GPU to embed passages instantly.
OLLAMA_BASE_URL = os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434")
EMBEDDING_MODEL_NAME = os.environ.get("INGEST_EMBEDDING_MODEL", "bge-m3")
EMBEDDING_MODEL_VERSION = os.environ.get("INGEST_EMBEDDING_MODEL_VERSION", "v1")


def sha256_of_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def get_supabase() -> Client:
    url = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
    # Service role: ingestion writes curriculum_chunks/chunk_embeddings, which
    # authenticated users can only read (see supabase/migrations/*_rls.sql).
    key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
    return create_client(url, key)


def run_marker(pdf_path: Path, out_dir: Path, page_range: str | None = None) -> Path:
    """
    Runs marker_single in `balanced` mode (GPU pipeline)
    with chunked JSON output so page/section boundaries survive into
    curriculum_chunks.
    """
    cmd = [
        "marker_single",
        str(pdf_path),
        "--output_dir", str(out_dir),
        "--output_format", "chunks",
        "--mode", "fast",
    ]
    if page_range:
        cmd.extend(["--page_range", page_range])
    
    marker_env = os.environ.copy()
    marker_env.pop("OLLAMA_BASE_URL", None)
    marker_env.pop("OLLAMA_MODEL", None)
    marker_env.pop("MARKER_LLM_SERVICE", None)
    subprocess.run(cmd, env=marker_env, check=True)

    chunks_file = next(
        (f for f in out_dir.rglob("*.json") if not f.name.endswith("_meta.json")),
        None,
    )
    if chunks_file is None:
        raise RuntimeError(f"marker produced no chunks JSON in {out_dir}")
    return chunks_file


EMBEDDING_DIMENSIONS = 1024  # must match chunk_embeddings.embedding's vector(1024)


@retry(stop=stop_after_attempt(5), wait=wait_exponential(multiplier=2, min=4, max=60))
def embed_text(text: str) -> list[float]:
    """
    Wrapped in retry/backoff — queries the local Ollama instance for embeddings
    using BGE-M3. Eliminates API rate limits entirely, allowing full GPU usage.
    """
    res = requests.post(
        f"{OLLAMA_BASE_URL}/api/embed",
        json={
            "model": EMBEDDING_MODEL_NAME,
            "input": text,
        },
        timeout=60,
    )
    res.raise_for_status()
    data = res.json()
    if "embeddings" in data and len(data["embeddings"]) > 0:
        return data["embeddings"][0]
    if "embedding" in data:
        return data["embedding"]
    raise RuntimeError(f"Unexpected embed response format: {data}")


def ingest_pdf(
    supabase: Client,
    pdf_path: Path,
    subject_code: str,
    language_tag: str,
    chapter_no: int,
    page_range: str | None = None,
) -> None:
    checksum = sha256_of_file(pdf_path)

    subject = supabase.table("subjects").select("id").eq("code", subject_code).single().execute()
    subject_id = subject.data["id"]

    curriculum_version = (
        supabase.table("curriculum_versions")
        .select("id")
        .eq("subject_id", subject_id)
        .eq("language_tag", language_tag)
        .eq("is_active", True)
        .single()
        .execute()
    )
    curriculum_version_id = curriculum_version.data["id"]

    chapter = (
        supabase.table("chapters")
        .select("id")
        .eq("subject_id", subject_id)
        .eq("chapter_no", chapter_no)
        .maybe_single()
        .execute()
    )
    if not chapter.data:
        raise RuntimeError(
            f"No chapter row for subject={subject_code} chapter_no={chapter_no}. "
            "Create it first (chapters aren't auto-created from PDF structure in this pass)."
        )
    chapter_id = chapter.data["id"]

    job = supabase.table("ingestion_jobs").insert(
        {
            "subject_id": subject_id,
            "curriculum_version_id": curriculum_version_id,
            "source_pdf_path": str(pdf_path),
            "source_pdf_checksum": checksum,
            "status": "RUNNING",
        }
    ).execute()
    job_id = job.data[0]["id"]

    try:
        with tempfile.TemporaryDirectory() as tmp:
            chunks_file = run_marker(pdf_path, Path(tmp), page_range)
            data = json.loads(chunks_file.read_text())
            chunks = data.get("blocks") or data.get("chunks") or []

            produced = 0
            for i, chunk in enumerate(chunks):
                content = (chunk.get("html") or chunk.get("text") or "").strip()
                if not content:
                    continue

                embedding = embed_text(content)

                inserted = (
                    supabase.table("curriculum_chunks")
                    .insert(
                        {
                            "chapter_id": chapter_id,
                            "curriculum_version_id": curriculum_version_id,
                            "content_chunk": content,
                            "content_format": "markdown",
                            "source_book_page_ref": str(chunk.get("page", "")),
                            "chunk_index": i,
                        }
                    )
                    .execute()
                )
                chunk_id = inserted.data[0]["id"]

                supabase.table("chunk_embeddings").insert(
                    {
                        "chunk_id": chunk_id,
                        "model_name": EMBEDDING_MODEL_NAME,
                        "model_version": EMBEDDING_MODEL_VERSION,
                        "embedding": embedding,
                    }
                ).execute()

                produced += 1

            supabase.table("ingestion_jobs").update(
                {"status": "DONE", "chunks_produced": produced}
            ).eq("id", job_id).execute()
            print(f"[done] {pdf_path.name}: {produced} chunks")

    except Exception as exc:  # noqa: BLE001 — deliberately broad: any failure must mark the job FAILED, not silently vanish
        supabase.table("ingestion_jobs").update(
            {"status": "FAILED", "error_detail": str(exc)[:2000]}
        ).eq("id", job_id).execute()
        raise


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--pdf", required=True, type=Path)
    parser.add_argument("--subject-code", required=True)
    parser.add_argument("--language", required=True, choices=["bn", "en"])
    parser.add_argument("--chapter-no", required=True, type=int)
    parser.add_argument("--page-range", type=str, default=None)
    parser.add_argument("--max-pages", type=int, default=None)
    args = parser.parse_args()

    if not args.pdf.exists():
        print(f"PDF not found: {args.pdf}", file=sys.stderr)
        sys.exit(1)

    page_range = args.page_range
    if page_range is None and args.max_pages is not None:
        page_range = f"1-{args.max_pages}"

    supabase = get_supabase()

    ingest_pdf(supabase, args.pdf, args.subject_code, args.language, args.chapter_no, page_range)


if __name__ == "__main__":
    main()
