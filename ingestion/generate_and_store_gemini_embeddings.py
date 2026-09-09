#!/usr/bin/env python3
"""
Generates 1024-dim embeddings for all 304 Chemistry BN curriculum_chunks using gemini-embedding-2
and stores them into Supabase 'chunk_embeddings'.
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

print("Fetching Chemistry BN curriculum chunks from Supabase...")
res = (
    supabase.table("curriculum_chunks")
    .select("id, chunk_index, source_book_page_ref, content_chunk")
    .eq("curriculum_version_id", CURRICULUM_VERSION_ID)
    .order("chunk_index")
    .execute()
)
chunks = res.data
print(f"Found {len(chunks)} chunks to embed.")

batch_url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:batchEmbedContents?key={gemini_api_key}"

def embed_batch_with_retry(batch_texts, max_retries=6):
    requests_payload = [
        {
            "model": f"models/{MODEL_NAME}",
            "content": {"parts": [{"text": txt[:6000]}]},  # Safe token bound
            "output_dimensionality": OUTPUT_DIM
        }
        for txt in batch_texts
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
            print(f"  [Attempt {attempt}] HTTP {e.code}: {err_body[:120]}")
            if e.code == 429:
                sleep_time = 4 * (2 ** (attempt - 1))
                print(f"  Rate limited. Sleeping {sleep_time}s...")
                time.sleep(sleep_time)
            else:
                time.sleep(2)
        except Exception as ex:
            print(f"  [Attempt {attempt}] Connection error: {ex}")
            time.sleep(3)
            
    raise RuntimeError("Failed to generate batch embeddings after max retries")

BATCH_SIZE = 20
total_inserted = 0

print(f"\nStarting embedding generation in batches of {BATCH_SIZE}...")

for i in range(0, len(chunks), BATCH_SIZE):
    batch = chunks[i : i + BATCH_SIZE]
    batch_texts = [c["content_chunk"] for c in batch]
    
    vectors = embed_batch_with_retry(batch_texts)
    
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
    print(f"  [Progress] Embedded and stored {total_inserted}/{len(chunks)} chunks...")
    time.sleep(1.0) # Polite spacing for API limits

print(f"\nSUCCESS: Successfully embedded and stored all {total_inserted} Chemistry BN chunks in Supabase!")
