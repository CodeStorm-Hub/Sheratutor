#!/usr/bin/env python3
"""
SheraTutor: High-Throughput Batch Embedding Backfill using gemini-embedding-2 (1024-dim Matryoshka)
Embeds up to 30 chunks per API call, rotating active Gemini API keys with backoff.
"""

import os
import sys
import time
import re
import argparse
from pathlib import Path
from typing import List, Tuple
from dotenv import load_dotenv
from supabase import create_client
from google import genai
from google.genai import types

load_dotenv()

SB_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SB_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SB_URL or not SB_KEY:
    print("Error: Missing Supabase credentials in environment.")
    sys.exit(1)

supabase = create_client(SB_URL, SB_KEY)

# Collect active API keys
API_KEYS = []
for k in ["GEMINI_API_KEY_SECONDARY", "GEMINI_API_KEY"]:
    val = os.getenv(k)
    if val and val not in API_KEYS and not val.startswith("your-"):
        API_KEYS.append(val)

if not API_KEYS:
    print("Error: No valid Gemini API keys found.")
    sys.exit(1)

_key_idx = 0

def get_client():
    global _key_idx
    return genai.Client(api_key=API_KEYS[_key_idx % len(API_KEYS)])

def rotate_key():
    global _key_idx
    _key_idx = (_key_idx + 1) % len(API_KEYS)
    print(f"  [ROTATION] Switched to Gemini API Key ending in ...{API_KEYS[_key_idx % len(API_KEYS)][-6:]}")

EMBED_MODEL = "gemini-embedding-2"
EMBED_DIM = 1024
EMBED_VERSION = "v1"

def embed_batch_with_retry(texts: List[str], max_retries: int = 6) -> List[List[float]]:
    """Embeds a batch of texts in a single request with key rotation and retry."""
    items = [types.Content(parts=[types.Part.from_text(text=t)]) for t in texts]
    for attempt in range(max_retries):
        client = get_client()
        try:
            resp = client.models.embed_content(
                model=EMBED_MODEL,
                contents=items,
                config=types.EmbedContentConfig(output_dimensionality=EMBED_DIM)
            )
            embeddings = [list(e.values) for e in resp.embeddings]
            return embeddings
        except Exception as e:
            err = str(e)
            print(f"    [WARN] Batch embed attempt {attempt+1}/{max_retries} failed: {err[:120]}...")
            if "429" in err or "RESOURCE_EXHAUSTED" in err:
                rotate_key()
                delay = 2.0
                m = re.search(r"retry in (\d+(?:\.\d+)?)s", err)
                if m:
                    delay = min(float(m.group(1)), 25.0)
                time.sleep(delay)
            else:
                rotate_key()
                time.sleep(2.0)
    raise RuntimeError(f"Failed to embed batch of {len(texts)} items after {max_retries} retries")

def backfill_version(version_id: str, subject_code: str, lang: str, batch_size: int = 30):
    print(f"\n{'='*60}")
    print(f" BACKFILLING EMBEDDINGS: {subject_code} [{lang}]")
    print(f" Version ID: {version_id}")
    print(f" Model: {EMBED_MODEL} ({EMBED_DIM}-dim Matryoshka)")
    print(f"{'='*60}")

    # 1. Fetch all chunk IDs for this version
    chunks_res = supabase.table("curriculum_chunks").select("id, content_chunk, chunk_index").eq("curriculum_version_id", version_id).order("chunk_index").execute()
    all_chunks = chunks_res.data or []
    print(f"Total chunks in curriculum_version: {len(all_chunks)}")
    if not all_chunks:
        return

    # 2. Fetch existing embeddings for this version to skip already embedded
    chunk_ids = [c["id"] for c in all_chunks]
    existing_chunk_ids = set()
    for b_idx in range(0, len(chunk_ids), 100):
        b_ids = chunk_ids[b_idx:b_idx+100]
        res = supabase.table("chunk_embeddings").select("chunk_id").in_("chunk_id", b_ids).eq("model_name", EMBED_MODEL).execute()
        for r in (res.data or []):
            existing_chunk_ids.add(r["chunk_id"])
    print(f"Already embedded: {len(existing_chunk_ids)} | Pending: {len(all_chunks) - len(existing_chunk_ids)}")

    pending_chunks = [c for c in all_chunks if c["id"] not in existing_chunk_ids]
    if not pending_chunks:
        print("✓ All chunks already have embeddings. Nothing to backfill.")
        return

    # 3. Process in batches
    total_embedded = 0
    start_time = time.time()

    for i in range(0, len(pending_chunks), batch_size):
        batch = pending_chunks[i:i + batch_size]
        texts = [c["content_chunk"] for c in batch]
        
        try:
            vectors = embed_batch_with_retry(texts)
        except Exception as e:
            print(f"[FATAL] Could not embed batch starting at index {i}: {e}")
            break

        records = []
        for c, vec in zip(batch, vectors):
            records.append({
                "chunk_id": c["id"],
                "model_name": EMBED_MODEL,
                "model_version": EMBED_VERSION,
                "embedding": vec,
            })

        supabase.table("chunk_embeddings").upsert(records, on_conflict="chunk_id,model_name,model_version").execute()
        total_embedded += len(records)
        elapsed = time.time() - start_time
        rate = total_embedded / max(elapsed, 0.1)
        print(f"  Saved {total_embedded} / {len(pending_chunks)} embeddings ({rate:.1f} chunks/sec)...")
        time.sleep(1.0)  # Gentle delay between batches for RPM safety

    print(f"✓ Completed backfill for {subject_code} [{lang}]: {total_embedded} embeddings inserted in {time.time()-start_time:.1f}s.")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--subject", choices=["chemistry", "physics", "mathematics", "english", "all"], default="all")
    parser.add_argument("--lang", choices=["bn", "en", "all"], default="all")
    parser.add_argument("--batch-size", type=int, default=30)
    args = parser.parse_args()

    subjs_map = {s["id"]: s["code"] for s in supabase.table("subjects").select("id, code").execute().data}
    versions_res = supabase.table("curriculum_versions").select("id, subject_id, language_tag").execute()

    for v in versions_res.data:
        code = subjs_map.get(v["subject_id"], "")
        lang = v["language_tag"]
        
        subj_name = "chemistry" if "CHEM" in code else "physics" if "PHY" in code else "mathematics" if "MATH" in code else "english" if "ENG" in code else ""
        if args.subject != "all" and args.subject != subj_name:
            continue
        if args.lang != "all" and args.lang != lang:
            continue

        backfill_version(v["id"], code, lang, batch_size=args.batch_size)

if __name__ == "__main__":
    main()
