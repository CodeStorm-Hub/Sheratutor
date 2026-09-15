#!/usr/bin/env python3
"""
SheraTutor: Dedicated Vector Embedding Pipeline for Secondary Mathematics (BN & EN).
Generates 1024-dim Matryoshka embeddings via Google AI Studio's gemini-embedding-2
and persists them into Supabase chunk_embeddings.

Features:
- Pure standard library (urllib.request, json) — zero external dependency friction.
- PostgREST Range header pagination (bypasses 1000 row caps).
- Idempotent and resumable (skips already-embedded chunks).
- Batch processing (25 chunks per API request).
- API key rotation between primary fresh key and secondary fallback with backoff.
"""

import sys
import os
import json
import time
import urllib.request
import urllib.error
from pathlib import Path
from typing import List, Dict, Any, Set

INGESTION_DIR = Path(__file__).resolve().parent
ENV_PATH = INGESTION_DIR / ".env"

if not ENV_PATH.exists():
    print(f"Error: {ENV_PATH} not found.")
    sys.exit(1)

# Parse environment variables
env = {}
for line in ENV_PATH.read_text(encoding="utf-8").splitlines():
    line = line.strip()
    if line and not line.startswith("#") and "=" in line:
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip("\"'")

SB_URL = env.get("NEXT_PUBLIC_SUPABASE_URL")
SB_KEY = env.get("SUPABASE_SERVICE_ROLE_KEY")

if not SB_URL or not SB_KEY:
    print("Error: Missing Supabase credentials in ingestion/.env")
    sys.exit(1)

API_KEYS = []
for k in ["GEMINI_API_KEY", "GEMINI_API_KEY_SECONDARY", "GEMINI_API_KEY_TERTIARY"]:
    val = env.get(k, "")
    if val and val not in API_KEYS and not val.startswith("your-"):
        API_KEYS.append(val)

if not API_KEYS:
    print("Error: No valid Gemini API keys found in ingestion/.env")
    sys.exit(1)

print(f"Loaded {len(API_KEYS)} Gemini API Key(s) for rotation:")
for i, key in enumerate(API_KEYS):
    print(f"  [{i+1}] ...{key[-8:]}")

MODEL_NAME = "gemini-embedding-2"
MODEL_VERSION = "v1"
EMBED_DIM = 1024
BATCH_SIZE = 25

SB_HEADERS = {
    "apikey": SB_KEY,
    "Authorization": f"Bearer {SB_KEY}",
    "Content-Type": "application/json",
}

_current_key_idx = 0

def get_current_gemini_key() -> str:
    global _current_key_idx
    return API_KEYS[_current_key_idx % len(API_KEYS)]

def rotate_gemini_key():
    global _current_key_idx
    if len(API_KEYS) > 1:
        _current_key_idx = (_current_key_idx + 1) % len(API_KEYS)
        print(f"  [KEY ROTATION] Switched to Gemini API key index {_current_key_idx} (...{API_KEYS[_current_key_idx][-8:]})")

def fetch_all_chunks(curriculum_version_id: str) -> List[Dict[str, Any]]:
    """Fetches all chunks for a curriculum_version using range pagination."""
    all_chunks = []
    page_size = 1000
    start = 0

    while True:
        end = start + page_size - 1
        req = urllib.request.Request(
            f"{SB_URL}/rest/v1/curriculum_chunks?select=id,content_chunk,chunk_index,source_book_page_ref&curriculum_version_id=eq.{curriculum_version_id}&order=chunk_index.asc",
            headers={**SB_HEADERS, "Range-Unit": "items", "Range": f"{start}-{end}"}
        )
        try:
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                if not data:
                    break
                all_chunks.extend(data)
                if len(data) < page_size:
                    break
                start += page_size
        except urllib.error.HTTPError as e:
            if e.code == 416:  # Requested range not satisfiable (end of table)
                break
            raise

    return all_chunks

def fetch_existing_embedding_ids(curriculum_version_id: str) -> Set[str]:
    """Fetches chunk_ids that already have embeddings for this version."""
    embedded_ids = set()
    page_size = 1000
    start = 0

    while True:
        end = start + page_size - 1
        req = urllib.request.Request(
            f"{SB_URL}/rest/v1/chunk_embeddings?select=chunk_id,curriculum_chunks!inner(curriculum_version_id)&curriculum_chunks.curriculum_version_id=eq.{curriculum_version_id}&model_name=eq.{MODEL_NAME}&model_version=eq.{MODEL_VERSION}",
            headers={**SB_HEADERS, "Range-Unit": "items", "Range": f"{start}-{end}"}
        )
        try:
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                if not data:
                    break
                for row in data:
                    embedded_ids.add(row["chunk_id"])
                if len(data) < page_size:
                    break
                start += page_size
        except urllib.error.HTTPError as e:
            if e.code == 416:
                break
            raise

    return embedded_ids

def embed_batch_with_retry(texts: List[str], max_retries: int = 15) -> List[List[float]]:
    """Calls Gemini batchEmbedContents with exponential backoff and key rotation."""
    requests_payload = [
        {
            "model": f"models/{MODEL_NAME}",
            "content": {"parts": [{"text": text[:8000]}]},
            "outputDimensionality": EMBED_DIM,
        }
        for text in texts
    ]
    payload_bytes = json.dumps({"requests": requests_payload}).encode("utf-8")

    for attempt in range(max_retries):
        key = get_current_gemini_key()
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:batchEmbedContents?key={key}"
        req = urllib.request.Request(url, data=payload_bytes, headers={"Content-Type": "application/json"})

        try:
            with urllib.request.urlopen(req, timeout=45) as resp:
                result = json.loads(resp.read().decode("utf-8"))
                embeddings = [e["values"] for e in result.get("embeddings", [])]
                if len(embeddings) != len(texts):
                    raise RuntimeError(f"Expected {len(texts)} embeddings, got {len(embeddings)}")
                return embeddings
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="ignore")
            print(f"  [WARN] Attempt {attempt+1}/{max_retries} failed with HTTP {e.code}: {err_body[:100]}...")
            if e.code in (429, 503):
                rotate_gemini_key()
                # Parse recommended retry delay if present
                delay = 15.0
                import re
                m = re.search(r"retry in (\d+(?:\.\d+)?)s", err_body, re.I)
                if m:
                    delay = max(float(m.group(1)) + 1.0, 10.0)
                print(f"  [BACKOFF] Waiting {delay:.1f}s for RPM quota window to reset...")
                time.sleep(delay)
            elif e.code == 400:
                print(f"  [ERROR] Bad request payload: {err_body[:200]}")
                raise
            else:
                rotate_gemini_key()
                time.sleep(5.0)
        except Exception as e:
            print(f"  [WARN] Attempt {attempt+1}/{max_retries} network error: {e}")
            time.sleep(5.0)

    raise RuntimeError(f"Failed to embed batch of {len(texts)} items after {max_retries} attempts.")

def upsert_embeddings(records: List[Dict[str, Any]]):
    """Upserts embedding records into Supabase chunk_embeddings table."""
    req = urllib.request.Request(
        f"{SB_URL}/rest/v1/chunk_embeddings",
        data=json.dumps(records).encode("utf-8"),
        headers={**SB_HEADERS, "Prefer": "resolution=merge-duplicates"}
    )
    with urllib.request.urlopen(req) as resp:
        if resp.status not in (200, 201):
            raise RuntimeError(f"Supabase upsert failed with status {resp.status}")

def run_embedding_for_target(name: str, version_id: str):
    print("\n" + "=" * 65)
    print(f" STARTING EMBEDDING FOR: {name.upper()}")
    print(f" Curriculum Version ID: {version_id}")
    print(f" Model: {MODEL_NAME} ({EMBED_DIM}-dim Matryoshka)")
    print("=" * 65)

    # 1. Fetch all chunks
    print(f"[*] Fetching chunks from Supabase...")
    all_chunks = fetch_all_chunks(version_id)
    print(f"[+] Total chunks in curriculum: {len(all_chunks)}")

    if not all_chunks:
        print("[!] No chunks found. Skipping.")
        return

    # 2. Check existing embeddings
    print(f"[*] Checking existing embeddings in chunk_embeddings...")
    embedded_ids = fetch_existing_embedding_ids(version_id)
    print(f"[+] Already embedded: {len(embedded_ids)}")

    pending = [c for c in all_chunks if c["id"] not in embedded_ids]
    print(f"[+] Chunks pending embedding: {len(pending)}")

    if not pending:
        print(f"[SUCCESS] All {len(all_chunks)} chunks are already embedded for {name}!")
        return

    # 3. Process batches
    total_embedded = 0
    start_time = time.time()

    for i in range(0, len(pending), BATCH_SIZE):
        batch = pending[i : i + BATCH_SIZE]
        texts = [c["content_chunk"] for c in batch]

        embeddings = embed_batch_with_retry(texts)

        records = [
            {
                "chunk_id": batch[idx]["id"],
                "model_name": MODEL_NAME,
                "model_version": MODEL_VERSION,
                "embedding": embeddings[idx],
            }
            for idx in range(len(batch))
        ]

        upsert_embeddings(records)
        total_embedded += len(records)

        elapsed = time.time() - start_time
        rate = total_embedded / max(elapsed, 0.1)
        done_now = len(embedded_ids) + total_embedded
        pct = (done_now / len(all_chunks)) * 100
        print(f"  --> Progress: {total_embedded}/{len(pending)} pending ({done_now}/{len(all_chunks)} total, {pct:.1f}%) | {rate:.1f} chunks/sec")

        # Sleep between batches for RPM safety (100 RPM ceiling)
        time.sleep(2.0)

    total_time = time.time() - start_time
    print(f"\n[SUCCESS] Completed {name}! Embedded {total_embedded} chunks in {total_time:.1f}s.")

def main():
    targets = [
        ("Mathematics (Bangla)", "a4f6fee4-6fe3-4ceb-beb4-359d827be57a"),
        ("Mathematics (English)", "42e377d0-4378-413d-8156-fe126c3ad509"),
    ]

    print("==================================================================")
    print(" SheraTutor Production Mathematics Vector Embedding Run Starting ")
    print("==================================================================")

    for name, vid in targets:
        run_embedding_for_target(name, vid)

    print("\n==================================================================")
    print(" ALL MATHEMATICS EMBEDDINGS SUCCESSFULLY GENERATED & SAVED! ")
    print("==================================================================")

if __name__ == "__main__":
    main()
