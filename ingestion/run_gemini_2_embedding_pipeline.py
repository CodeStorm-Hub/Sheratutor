#!/usr/bin/env python3
"""
Full Paced Ingestion Pipeline for gemini-embedding-2.
Generates 1024-dimensional embeddings for all 304 Chemistry Bengali chunks
and stores them into Supabase 'chunk_embeddings'.
Uses batches of 10 with 12s pacing and exponential backoff retry.
"""

import os
import sys
import json
import time
import urllib.request
import urllib.error
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

env_path = Path("/home/syed/workspace/Sheratutor/ingestion/.env")
load_dotenv(dotenv_path=env_path)

sb_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
sb_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
gemini_api_key = os.getenv("GEMINI_API_KEY")

if not sb_url or not sb_key or not gemini_api_key:
    print("Error: Missing credentials in .env")
    sys.exit(1)

supabase = create_client(sb_url, sb_key)

CURRICULUM_VERSION_ID = "fde7ee81-5899-4d46-8ee5-f090d440521b"
MODEL_NAME = "gemini-embedding-2"
MODEL_VERSION = "v1"
OUTPUT_DIM = 1024
BATCH_SIZE = 10
SLEEP_SECONDS = 12

print("="*60)
print("STARTING GEMINI-EMBEDDING-2 PIPELINE (1024 DIMS)")
print("="*60)

# Fetch all chunks
print("Fetching Chemistry BN curriculum chunks from Supabase...")
res = (
    supabase.table("curriculum_chunks")
    .select("id, chunk_index, source_book_page_ref, content_chunk")
    .eq("curriculum_version_id", CURRICULUM_VERSION_ID)
    .order("chunk_index")
    .execute()
)
chunks = res.data
total_chunks = len(chunks)
print(f"Total chunks to embed: {total_chunks}")

# Check already embedded chunks to allow resuming if needed
existing_res = (
    supabase.table("chunk_embeddings")
    .select("chunk_id")
    .eq("model_name", MODEL_NAME)
    .execute()
)
embedded_ids = set(r["chunk_id"] for r in existing_res.data)
remaining_chunks = [c for c in chunks if c["id"] not in embedded_ids]
print(f"Already embedded: {len(embedded_ids)} | Remaining: {len(remaining_chunks)}")

batch_url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:batchEmbedContents?key={gemini_api_key}"

def embed_batch_with_retry(batch_items, max_retries=6):
    requests_payload = [
        {
            "model": f"models/{MODEL_NAME}",
            "content": {"parts": [{"text": item["content_chunk"][:6000]}]},
            "output_dimensionality": OUTPUT_DIM
        }
        for item in batch_items
    ]
    
    payload_bytes = json.dumps({"requests": requests_payload}).encode("utf-8")
    
    for attempt in range(1, max_retries + 1):
        try:
            req = urllib.request.Request(
                batch_url,
                data=payload_bytes,
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=60) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                embeddings = data.get("embeddings", [])
                return [e["values"] for e in embeddings]
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8") if hasattr(e, "read") else str(e)
            print(f"    [Retry {attempt}] HTTP {e.code}: {err_body[:100]}")
            sleep_time = 15 * attempt
            print(f"    Backing off for {sleep_time}s...")
            time.sleep(sleep_time)
        except Exception as ex:
            print(f"    [Retry {attempt}] Network/Timeout: {ex}")
            time.sleep(10)
            
    raise RuntimeError("Batch embedding failed after max retries")

total_inserted = len(embedded_ids)

for i in range(0, len(remaining_chunks), BATCH_SIZE):
    batch = remaining_chunks[i : i + BATCH_SIZE]
    batch_pages = [b["source_book_page_ref"] for b in batch]
    print(f"\n[Batch {i//BATCH_SIZE + 1}/{(len(remaining_chunks)-1)//BATCH_SIZE + 1}] Embedding pages: {batch_pages[0]} to {batch_pages[-1]}...")
    
    t0 = time.time()
    vectors = embed_batch_with_retry(batch)
    dur = time.time() - t0
    
    insert_rows = []
    for chunk_meta, vec in zip(batch, vectors):
        assert len(vec) == OUTPUT_DIM, f"Vector dim {len(vec)} != {OUTPUT_DIM}"
        insert_rows.append({
            "chunk_id": chunk_meta["id"],
            "model_name": MODEL_NAME,
            "model_version": MODEL_VERSION,
            "embedding": vec
        })
        
    supabase.table("chunk_embeddings").insert(insert_rows).execute()
    total_inserted += len(insert_rows)
    print(f"  --> Inserted {len(insert_rows)} embeddings ({dur:.1f}s). Total Progress: {total_inserted}/{total_chunks}")
    
    if i + BATCH_SIZE < len(remaining_chunks):
        time.sleep(SLEEP_SECONDS)

print("\n" + "="*60)
print(f"SUCCESS: ALL {total_inserted}/{total_chunks} CHUNKS EMBEDDED WITH GEMINI-EMBEDDING-2!")
print("="*60)
