#!/usr/bin/env python3
"""
Ingests extracted Gemini 3.5 Flash JSON chunks and cropped figures into Supabase.
Features:
- Uploads figure crops to 'curriculum-assets/{subject}/{lang}/' Supabase storage bucket
- Cleanses stale chunks and stacked embeddings for the specified curriculum version
- Inserts structured curriculum_chunks (with correct chunk_type and diagram_image_urls)
- Generates 1024-dim Matryoshka embeddings with gemini-embedding-2
- Persists embeddings into chunk_embeddings with ON CONFLICT DO UPDATE
"""

import os
import sys
import json
import time
import argparse
import re
from pathlib import Path
from typing import Dict, Any, List, Optional

from dotenv import load_dotenv
from supabase import create_client
from google import genai
from google.genai import types

REPO_ROOT = Path(__file__).resolve().parent.parent
INGESTION_DIR = Path(__file__).resolve().parent
ENV_LOCAL = REPO_ROOT / "web" / ".env.local"
ENV_INGEST = INGESTION_DIR / ".env"

if ENV_LOCAL.exists():
    load_dotenv(ENV_LOCAL)
if ENV_INGEST.exists():
    load_dotenv(ENV_INGEST)

SB_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SB_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
GEMINI_KEY = os.environ.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY_SECONDARY")

if not SB_URL or not SB_KEY or not GEMINI_KEY:
    print("Error: Missing credentials in environment (SUPABASE or GEMINI).")
    sys.exit(1)

supabase = create_client(SB_URL, SB_KEY)

# Collect active API keys for rotation
API_KEYS = []
for k in ["GEMINI_API_KEY_SECONDARY", "GEMINI_API_KEY"]:
    val = os.getenv(k)
    if val and val not in API_KEYS and not val.startswith("your-"):
        API_KEYS.append(val)

if not API_KEYS:
    print("Error: No valid Gemini API keys found.")
    sys.exit(1)

_current_key_idx = 0

def get_ai_client():
    global _current_key_idx
    return genai.Client(api_key=API_KEYS[_current_key_idx])

def rotate_key():
    global _current_key_idx
    if len(API_KEYS) > 1:
        _current_key_idx = (_current_key_idx + 1) % len(API_KEYS)
        print(f"Rotated embedding client to Key {_current_key_idx}...")

ai_client = get_ai_client()

# Storage Bucket and CDN prefix
BUCKET_NAME = "curriculum-assets"
CDN_BASE = f"{SB_URL}/storage/v1/object/public/{BUCKET_NAME}"

EMBED_MODEL_NAME = "gemini-embedding-2"
EMBED_MODEL_VERSION = "v1"
EMBED_DIM = 1024

def upload_crop_to_storage(local_path: Path, storage_path: str) -> str:
    """Uploads local image crop to Supabase Storage and returns public CDN URL."""
    with open(local_path, "rb") as f:
        file_bytes = f.read()

    try:
        supabase.storage.from_(BUCKET_NAME).upload(
            path=storage_path,
            file=file_bytes,
            file_options={"content-type": "image/png", "upsert": "true"}
        )
    except Exception as e:
        # Ignore already exists / upsert errors
        pass

    return f"{CDN_BASE}/{storage_path}"

def generate_embedding(text: str) -> List[float]:
    """Generates 1024-dim Matryoshka embedding using gemini-embedding-2 with key rotation."""
    for attempt in range(len(API_KEYS) * 4):
        client = get_ai_client()
        try:
            resp = client.models.embed_content(
                model=EMBED_MODEL_NAME,
                contents=text,
                config=types.EmbedContentConfig(output_dimensionality=EMBED_DIM)
            )
            if resp.embeddings and len(resp.embeddings) > 0 and resp.embeddings[0].values:
                return list(resp.embeddings[0].values)
        except Exception as e:
            err_msg = str(e)
            print(f"Embedding attempt {attempt+1} failed: {err_msg[:100]}...")
            if "429" in err_msg or "RESOURCE_EXHAUSTED" in err_msg:
                rotate_key()
                # Check for explicit retry delay
                delay = 2.0
                m = re.search(r"retry in (\d+(?:\.\d+)?)s", err_msg)
                if m:
                    delay = min(float(m.group(1)), 30.0)
                time.sleep(delay)
            else:
                rotate_key()
                time.sleep(2)
    raise RuntimeError(f"Failed to generate embedding for text: {text[:50]}...")

def main():
    parser = argparse.ArgumentParser(description="Ingest extracted chunks and embeddings into Supabase")
    parser.add_argument("--subject", default="chemistry", choices=["chemistry", "physics", "mathematics", "english"])
    parser.add_argument("--lang", default="en", choices=["en", "bn"])
    parser.add_argument("--dry-run", action="store_true", help="Preview without writing to DB")
    parser.add_argument("--purge-first", action="store_true", help="Purge stale chunks for this curriculum version first")
    parser.add_argument("--skip-embed", action="store_true", help="Skip generating embeddings")
    args = parser.parse_args()

    # 1. Resolve Subject UUID and Curriculum Version UUID
    subj_map = {"chemistry": "SSC-CHEM", "physics": "SSC-PHY", "mathematics": "SSC-MATH", "english": "SSC-ENG"}
    subj_code = subj_map.get(args.subject, "SSC-CHEM")
    subj_res = supabase.table("subjects").select("id").eq("code", subj_code).single().execute()
    if not subj_res.data:
        print(f"Error: Subject not found with code {subj_code}")
        sys.exit(1)
    subject_id = subj_res.data["id"]

    v_res = supabase.table("curriculum_versions").select("id").eq("subject_id", subject_id).eq("language_tag", args.lang).eq("is_active", True).single().execute()
    if not v_res.data:
        print(f"Error: Curriculum version not found for {args.subject} ({args.lang})")
        sys.exit(1)
    curriculum_version_id = v_res.data["id"]
    print(f"Target Curriculum Version ID: {curriculum_version_id} ({subj_code} - {args.lang})")

    # 2. Fetch Chapters map: chapter_no -> chapter_id
    ch_res = supabase.table("chapters").select("id, chapter_no, title_en, title_bn").eq("subject_id", subject_id).order("chapter_no").execute()
    chapter_map = {r["chapter_no"]: r["id"] for r in ch_res.data}
    print(f"Loaded {len(chapter_map)} chapters from Supabase.")

    # 3. Load Figure Crops Manifest if available
    figures_dir = INGESTION_DIR / "output" / "figures" / f"{args.subject}_{args.lang}"
    manifest_file = figures_dir / "figure_crops_manifest.json"
    crops_manifest = {}
    if manifest_file.exists():
        crops_manifest = json.loads(manifest_file.read_text(encoding="utf-8"))
        print(f"Loaded figure crops manifest for {len(crops_manifest)} pages.")

    # 4. Read cached extractions
    cache_dir = INGESTION_DIR / "cache_gemini" / f"{args.subject}_{args.lang}"
    page_files = sorted(cache_dir.glob("page_*.json"))
    print(f"Found {len(page_files)} extracted page files in {cache_dir}.")

    if not page_files:
        print("No extraction files found to ingest. Exiting.")
        return

    if args.purge_first and not args.dry_run:
        print(f"PURGING stale chunks and embeddings for curriculum_version_id = {curriculum_version_id}...")
        supabase.table("curriculum_chunks").delete().eq("curriculum_version_id", curriculum_version_id).execute()
        print("Purge completed.")

    # 5. Build chunks to insert
    chunks_to_insert = []
    chunk_global_idx = 1

    for pf in page_files:
        pdata = json.loads(pf.read_text(encoding="utf-8"))
        pno = pdata["printed_page_no"]
        ch_no = pdata["chapter_no"]
        ch_id = chapter_map.get(ch_no)
        if not ch_id:
            print(f"Warning: Unknown chapter {ch_no} on page {pno}. Skipping.")
            continue

        # Get uploaded figure CDN URLs for this page
        page_key = f"page_{pno:03d}"
        diagram_urls = []
        if page_key in crops_manifest:
            for fig in crops_manifest[page_key]:
                crop_path = Path(fig["crop_filepath"])
                if crop_path.exists():
                    storage_path = f"{args.subject}/{args.lang}/figures/{crop_path.name}"
                    if not args.dry_run:
                        cdn_url = upload_crop_to_storage(crop_path, storage_path)
                    else:
                        cdn_url = f"{CDN_BASE}/{storage_path}"
                    diagram_urls.append(cdn_url)

        # Iterate sections on this page
        sections = pdata.get("sections", [])
        if not sections:
            # Fallback if whole page is single chunk
            continue

        for s_idx, sec in enumerate(sections):
            content = sec.get("content_markdown", "").strip()
            if not content:
                continue

            chunk_type = sec.get("chunk_type", "theory")
            # Database check constraint: 'theory', 'worked_example', 'cq_stimulus', 'cq_subquestion', 'table'
            if chunk_type not in ['theory', 'worked_example', 'cq_stimulus', 'cq_subquestion', 'table']:
                chunk_type = 'theory'

            def clean_str(val):
                if isinstance(val, str):
                    return val.replace("\x00", "").replace("\u0000", "")
                return val

            sec_no = clean_str(sec.get("section_no"))
            sec_title = clean_str(sec.get("section_title"))
            act_tag = sec.get("activity_tag")
            if act_tag and not content.startswith(f"[{act_tag}]"):
                content = f"[{act_tag.upper()}]\n{content}"
            content = clean_str(content)

            chunk_record = {
                "curriculum_version_id": curriculum_version_id,
                "chapter_id": ch_id,
                "content_chunk": content,
                "content_format": "markdown",
                "chunk_type": chunk_type,
                "section_no": sec_no,
                "section_title": sec_title,
                "source_book_page_ref": f"Page {pno}",
                "diagram_image_urls": diagram_urls if s_idx == 0 else [],
                "chunk_index": chunk_global_idx,
            }
            chunks_to_insert.append(chunk_record)
            chunk_global_idx += 1

    print(f"\nPrepared {len(chunks_to_insert)} chunks from {len(page_files)} pages.")

    if args.dry_run:
        print("Dry-run preview of first 2 chunks:")
        for c in chunks_to_insert[:2]:
            print(json.dumps(c, indent=2, ensure_ascii=False))
        return

    # 6. Insert Chunks into Supabase
    print(f"Inserting {len(chunks_to_insert)} curriculum_chunks into Supabase...")
    inserted_chunk_ids = []
    
    # Batch insert in chunks of 50
    batch_size = 50
    for i in range(0, len(chunks_to_insert), batch_size):
        batch = chunks_to_insert[i:i + batch_size]
        res = supabase.table("curriculum_chunks").insert(batch).execute()
        for r in res.data:
            inserted_chunk_ids.append((r["id"], r["content_chunk"]))
        print(f"  Inserted {min(i + batch_size, len(chunks_to_insert))} / {len(chunks_to_insert)} chunks...")

    # 7. Generate & Insert Embeddings (gemini-embedding-2, 1024-dim)
    if not args.skip_embed:
        print(f"\nGenerating 1024-dim Matryoshka embeddings ({EMBED_MODEL_NAME}) for {len(inserted_chunk_ids)} chunks...")
        embeddings_to_insert = []
        quota_hit = False
        for idx, (cid, ctext) in enumerate(inserted_chunk_ids):
            try:
                vec = generate_embedding(ctext)
                time.sleep(0.1)
                embeddings_to_insert.append({
                    "chunk_id": cid,
                    "model_name": EMBED_MODEL_NAME,
                    "model_version": EMBED_MODEL_VERSION,
                    "embedding": vec,
                })
            except Exception as e:
                print(f"\n[QUOTA NOTICE] Embedding stopped at {idx+1}/{len(inserted_chunk_ids)}: {e}")
                print(f"Persisting all {len(embeddings_to_insert)} generated embeddings to Supabase...")
                quota_hit = True
                break

            if (idx + 1) % 10 == 0 or (idx + 1) == len(inserted_chunk_ids):
                print(f"  Embedded {idx + 1} / {len(inserted_chunk_ids)} chunks...")

        # Batch insert embeddings
        if embeddings_to_insert:
            for i in range(0, len(embeddings_to_insert), batch_size):
                batch = embeddings_to_insert[i:i + batch_size]
                supabase.table("chunk_embeddings").upsert(batch, on_conflict="chunk_id,model_name,model_version").execute()
                print(f"  Saved {min(i + batch_size, len(embeddings_to_insert))} / {len(embeddings_to_insert)} embeddings to DB...")

        if quota_hit:
            print(f"\nSaved {len(embeddings_to_insert)} / {len(inserted_chunk_ids)} embeddings. Remaining will backfill at 00:00 UTC quota reset.")
        else:
            print(f"\nAll {len(embeddings_to_insert)} embeddings generated and saved!")

    print("\nIngestion step completed successfully!")

if __name__ == "__main__":
    main()
