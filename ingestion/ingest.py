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

from dotenv import load_dotenv
from supabase import Client, create_client
from tenacity import retry, stop_after_attempt, wait_exponential

load_dotenv()

EMBEDDING_MODEL_NAME = os.environ.get("INGEST_EMBEDDING_MODEL", "gemini-embedding-001")
EMBEDDING_MODEL_VERSION = os.environ.get("INGEST_EMBEDDING_MODEL_VERSION", "001")


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


def run_marker(pdf_path: Path, out_dir: Path) -> Path:
    """
    Runs marker_single in `balanced` mode (GPU pipeline — see module docstring)
    with chunked JSON output so page/section boundaries survive into
    curriculum_chunks. No --langs flag: Surya is multilingual by default.
    """
    cmd = [
        "marker_single",
        str(pdf_path),
        "--output_dir", str(out_dir),
        "--output_format", "chunks",
        "--mode", "balanced",
        "--use_llm",
        "--llm_service", "marker.services.ollama.OllamaService",
        "--ollama_base_url", os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434"),
        # llava (the original hand-off guide's pick) is a 2023-era model and
        # weak on Bengali/scientific notation (docs/review §1.3) — Qwen3-VL is
        # the current pick for multilingual OCR quality.
        "--ollama_model", os.environ.get("OLLAMA_MODEL", "qwen3-vl"),
    ]
    subprocess.run(cmd, check=True)

    chunks_file = next(out_dir.rglob("*.json"), None)
    if chunks_file is None:
        raise RuntimeError(f"marker produced no chunks JSON in {out_dir}")
    return chunks_file


EMBEDDING_DIMENSIONS = 1024  # must match chunk_embeddings.embedding's vector(1024)


@retry(stop=stop_after_attempt(5), wait=wait_exponential(multiplier=2, min=4, max=60))
def embed_text(client, text: str) -> list[float]:
    """
    Wrapped in retry/backoff — embedding API rate limits are the real
    throughput ceiling for ingestion, not GPU time (docs/review §5.4).

    gemini-embedding-001 defaults to 3072 dims; output_dimensionality trims it
    via Matryoshka truncation to match the schema. BGE-M3 (self-hostable,
    native 1024-dim, explicit Bengali coverage) is the other finalist from
    docs/review §7.2 — benchmark both against a real Bangla retrieval set
    before locking this in; swapping later means a new (model_name,
    model_version) row, not a migration, by design.
    """
    result = client.models.embed_content(
        model=EMBEDDING_MODEL_NAME,
        contents=text,
        config={"output_dimensionality": EMBEDDING_DIMENSIONS},
    )
    return result.embeddings[0].values


def ingest_pdf(
    supabase: Client,
    pdf_path: Path,
    subject_code: str,
    language_tag: str,
    chapter_no: int,
    genai_client,
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

    # Resumability: skip if this exact (checksum, page-range) already ran.
    existing_job = (
        supabase.table("ingestion_jobs")
        .select("id, status")
        .eq("source_pdf_checksum", checksum)
        .maybe_single()
        .execute()
    )
    if existing_job.data and existing_job.data["status"] == "DONE":
        print(f"[skip] {pdf_path.name} already ingested (job {existing_job.data['id']})")
        return

    job = supabase.table("ingestion_jobs").upsert(
        {
            "subject_id": subject_id,
            "curriculum_version_id": curriculum_version_id,
            "source_pdf_path": str(pdf_path),
            "source_pdf_checksum": checksum,
            "status": "RUNNING",
        },
        on_conflict="source_pdf_checksum,page_range_start,page_range_end",
    ).execute()
    job_id = job.data[0]["id"]

    try:
        with tempfile.TemporaryDirectory() as tmp:
            chunks_file = run_marker(pdf_path, Path(tmp))
            chunks = json.loads(chunks_file.read_text())["chunks"]

            produced = 0
            for i, chunk in enumerate(chunks):
                content = chunk.get("text", "").strip()
                if not content:
                    continue

                embedding = embed_text(genai_client, content)

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
    args = parser.parse_args()

    if not args.pdf.exists():
        print(f"PDF not found: {args.pdf}", file=sys.stderr)
        sys.exit(1)

    from google import genai

    genai_client = genai.Client(api_key=os.environ["GOOGLE_GENAI_API_KEY"])
    supabase = get_supabase()

    ingest_pdf(supabase, args.pdf, args.subject_code, args.language, args.chapter_no, genai_client)


if __name__ == "__main__":
    main()
