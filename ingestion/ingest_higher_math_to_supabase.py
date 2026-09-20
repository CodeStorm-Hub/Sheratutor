#!/usr/bin/env python3
"""
SheraTutor: Ingestion & Vector Embedding Pipeline for Higher Mathematics (SSC-HMATH).
- Registers SSC-HMATH subject and curriculum version in Supabase
- Seeds all 14 chapters
- Inserts all 1,331 sections from higher_math_class_9_10.jsonl into curriculum_chunks
- Generates 1024-dim Matryoshka embeddings with gemini-embedding-2 (v1)
- Persists embeddings into chunk_embeddings with key rotation and batch upsert
"""

import os
import sys
import json
import time
import re
import urllib.request
import urllib.error
from pathlib import Path
from typing import List, Dict, Any, Set

INGESTION_DIR = Path(__file__).resolve().parent
ENV_PATH = INGESTION_DIR / ".env"
JSONL_PATH = INGESTION_DIR / "higher_math_class_9_10.jsonl"

if not ENV_PATH.exists():
    print(f"Error: {ENV_PATH} not found.")
    sys.exit(1)

env_vars = {}
for line in ENV_PATH.read_text(encoding="utf-8").splitlines():
    line = line.strip()
    if line and not line.startswith("#") and "=" in line:
        k, v = line.split("=", 1)
        env_vars[k.strip()] = v.strip().strip("\"'")

SB_URL = env_vars.get("NEXT_PUBLIC_SUPABASE_URL")
SB_KEY = env_vars.get("SUPABASE_SERVICE_ROLE_KEY")

if not SB_URL or not SB_KEY:
    print("Error: Missing Supabase credentials in ingestion/.env")
    sys.exit(1)

API_KEYS = []
for k in ["GEMINI_API_KEY", "GEMINI_API_KEY_SECONDARY", "GEMINI_API_KEY_TERTIARY", "GEMINI_API_KEY_QUAT", "GEMINI_API_KEY_QUIN"]:
    val = env_vars.get(k, "").strip()
    if val and val not in API_KEYS and not val.startswith("your-"):
        API_KEYS.append(val)

if not API_KEYS:
    print("Error: No valid Gemini API keys found.")
    sys.exit(1)

print(f"Loaded {len(API_KEYS)} Gemini API keys for embedding rotation.")

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
        print(f"  [KEY ROTATION] Switched to Gemini API key index {_current_key_idx} (...{API_KEYS[_current_key_idx][-6:]})")

def sb_request(path: str, method: str = "GET", data: Any = None, extra_headers: Dict[str, str] = None) -> Any:
    headers = {**SB_HEADERS, **(extra_headers or {})}
    url = f"{SB_URL}/rest/v1/{path}"
    payload = json.dumps(data).encode("utf-8") if data is not None else None
    req = urllib.request.Request(url, data=payload, headers=headers, method=method)
    with urllib.request.urlopen(req) as resp:
        content = resp.read().decode("utf-8")
        if content:
            return json.loads(content)
        return None

CHAPTERS_DATA = [
    {"chapter_no": 1, "title_en": "Sets and Functions", "title_bn": "সেট ও ফাংশন"},
    {"chapter_no": 2, "title_en": "Algebraic Expressions", "title_bn": "বীজগাণিতিক রাশি"},
    {"chapter_no": 3, "title_en": "Geometry", "title_bn": "জ্যামিতি"},
    {"chapter_no": 4, "title_en": "Geometric Constructions", "title_bn": "জ্যামিতিক অঙ্কন"},
    {"chapter_no": 5, "title_en": "Equations", "title_bn": "সমীকরণ"},
    {"chapter_no": 6, "title_en": "Inequalities", "title_bn": "অসমতা"},
    {"chapter_no": 7, "title_en": "Infinite Series", "title_bn": "অসীম ধারা"},
    {"chapter_no": 8, "title_en": "Trigonometry", "title_bn": "ত্রিকোণমিতি"},
    {"chapter_no": 9, "title_en": "Exponential and Logarithmic Functions", "title_bn": "সূচকীয় ও লগারিদমীয় ফাংশন"},
    {"chapter_no": 10, "title_en": "Binomial Expansion", "title_bn": "দ্বিপদী বিস্তৃতি"},
    {"chapter_no": 11, "title_en": "Coordinate Geometry", "title_bn": "স্থানাঙ্ক জ্যামিতি"},
    {"chapter_no": 12, "title_en": "Planar Vectors", "title_bn": "সমতলীয় ভেক্টর"},
    {"chapter_no": 13, "title_en": "Solid Geometry", "title_bn": "ঘন জ্যামিতি"},
    {"chapter_no": 14, "title_en": "Probability", "title_bn": "সম্ভাবনা"},
]

def setup_subject_and_chapters() -> Tuple[str, str, Dict[int, str]]:
    print("\n[*] Step 1: Ensuring subject 'SSC-HMATH' exists...")
    existing = sb_request("subjects?select=id,code&code=eq.SSC-HMATH")
    if existing and len(existing) > 0:
        subject_id = existing[0]["id"]
        print(f"  -> Found existing subject ID: {subject_id}")
    else:
        created = sb_request(
            "subjects",
            method="POST",
            data={
                "code": "SSC-HMATH",
                "name_en": "Higher Mathematics",
                "name_bn": "উচ্চতর গণিত",
                "level": "SSC",
                "subject_group": "SCIENCE",
            },
            extra_headers={"Prefer": "return=representation"}
        )
        subject_id = created[0]["id"]
        print(f"  -> Created subject 'SSC-HMATH': {subject_id}")

    print("[*] Step 2: Ensuring curriculum_version exists...")
    v_existing = sb_request(f"curriculum_versions?select=id&subject_id=eq.{subject_id}&language_tag=eq.bn")
    if v_existing and len(v_existing) > 0:
        cv_id = v_existing[0]["id"]
        print(f"  -> Found existing curriculum version ID: {cv_id}")
    else:
        v_created = sb_request(
            "curriculum_versions",
            method="POST",
            data={
                "subject_id": subject_id,
                "edition_year": 2026,
                "language_tag": "bn",
                "is_active": True,
                "notes": "NCTB Secondary Class 9-10 Higher Mathematics (Bengali Version)"
            },
            extra_headers={"Prefer": "return=representation"}
        )
        cv_id = v_created[0]["id"]
        print(f"  -> Created curriculum version ID: {cv_id}")

    print("[*] Step 3: Ensuring 14 chapters exist...")
    ch_existing = sb_request(f"chapters?select=id,chapter_no&subject_id=eq.{subject_id}")
    ch_map = {r["chapter_no"]: r["id"] for r in (ch_existing or [])}

    for cdata in CHAPTERS_DATA:
        cno = cdata["chapter_no"]
        if cno not in ch_map:
            res = sb_request(
                "chapters",
                method="POST",
                data={
                    "subject_id": subject_id,
                    "chapter_no": cno,
                    "title_en": cdata["title_en"],
                    "title_bn": cdata["title_bn"],
                },
                extra_headers={"Prefer": "return=representation"}
            )
            ch_map[cno] = res[0]["id"]
            print(f"  -> Created Chapter {cno}: {cdata['title_bn']}")
        else:
            print(f"  -> Chapter {cno} already exists.")

    return subject_id, cv_id, ch_map

def ingest_chunks_from_jsonl(cv_id: str, ch_map: Dict[int, str]) -> List[Dict[str, Any]]:
    print(f"\n[*] Step 4: Loading and inserting chunks from {JSONL_PATH.name}...")
    if not JSONL_PATH.exists():
        raise FileNotFoundError(f"{JSONL_PATH} does not exist.")

    # Check existing chunks count for this curriculum_version
    existing_chunks_count = 0
    try:
        url = f"{SB_URL}/rest/v1/curriculum_chunks?select=id&curriculum_version_id=eq.{cv_id}"
        req = urllib.request.Request(url, headers={**SB_HEADERS, "Range-Unit": "items", "Range": "0-0"}, method="HEAD")
        with urllib.request.urlopen(req) as resp:
            cr = resp.headers.get("Content-Range", "")
            if "/" in cr:
                existing_chunks_count = int(cr.split("/")[1])
    except Exception:
        pass

    if existing_chunks_count > 1000:
        print(f"  -> Found {existing_chunks_count} chunks already in DB for this version.")
        return fetch_all_chunks(cv_id)

    records = []
    chunk_index = 1

    with open(JSONL_PATH, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            data = json.loads(line)
            pno = data["printed_page_no"]
            cno = data["chapter_no"]
            ch_id = ch_map.get(cno, ch_map.get(1))

            for sec in data.get("sections", []):
                content = sec.get("content_markdown", "").strip()
                if not content:
                    continue

                ctype = sec.get("chunk_type", "theory")
                if ctype not in ["theory", "worked_example", "cq_stimulus", "cq_subquestion", "table"]:
                    ctype = "theory"

                act = sec.get("activity_tag")
                if act and not content.startswith(f"[{act}]"):
                    content = f"[{act.upper()}]\n{content}"

                record = {
                    "curriculum_version_id": cv_id,
                    "chapter_id": ch_id,
                    "chunk_index": chunk_index,
                    "chunk_type": ctype,
                    "section_no": sec.get("section_no"),
                    "section_title": sec.get("section_title"),
                    "content_chunk": content,
                    "source_book_page_ref": f"Page {pno}",
                    "content_format": "markdown",
                }
                records.append(record)
                chunk_index += 1

    print(f"  -> Prepared {len(records)} chunks to insert.")

    # Bulk insert in batches of 100
    batch_size = 100
    for i in range(0, len(records), batch_size):
        batch = records[i : i + batch_size]
        sb_request("curriculum_chunks", method="POST", data=batch)
        print(f"    Inserted {min(i + batch_size, len(records))}/{len(records)} chunks...")

    print("  -> All curriculum chunks successfully inserted!")
    return fetch_all_chunks(cv_id)

def fetch_all_chunks(cv_id: str) -> List[Dict[str, Any]]:
    all_chunks = []
    page_size = 1000
    start = 0

    while True:
        end = start + page_size - 1
        req = urllib.request.Request(
            f"{SB_URL}/rest/v1/curriculum_chunks?select=id,content_chunk,chunk_index,source_book_page_ref&curriculum_version_id=eq.{cv_id}&order=chunk_index.asc",
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
            if e.code == 416:
                break
            raise

    return all_chunks

def fetch_existing_embedding_ids(cv_id: str) -> Set[str]:
    embedded_ids = set()
    page_size = 1000
    start = 0

    while True:
        end = start + page_size - 1
        req = urllib.request.Request(
            f"{SB_URL}/rest/v1/chunk_embeddings?select=chunk_id,curriculum_chunks!inner(curriculum_version_id)&curriculum_chunks.curriculum_version_id=eq.{cv_id}&model_name=eq.{MODEL_NAME}&model_version=eq.{MODEL_VERSION}",
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

def embed_batch_with_retry(texts: List[str], max_retries: int = 20) -> List[List[float]]:
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
            if e.code in (429, 503):
                rotate_gemini_key()
                time.sleep(8.0)
            else:
                rotate_gemini_key()
                time.sleep(3.0)
        except Exception:
            rotate_gemini_key()
            time.sleep(3.0)

    raise RuntimeError(f"Failed to embed batch of {len(texts)} items after {max_retries} attempts.")

def upsert_embeddings(records: List[Dict[str, Any]]):
    req = urllib.request.Request(
        f"{SB_URL}/rest/v1/chunk_embeddings",
        data=json.dumps(records).encode("utf-8"),
        headers={**SB_HEADERS, "Prefer": "resolution=merge-duplicates"}
    )
    with urllib.request.urlopen(req) as resp:
        if resp.status not in (200, 201):
            raise RuntimeError(f"Supabase upsert failed with status {resp.status}")

def generate_and_save_embeddings(all_chunks: List[Dict[str, Any]], cv_id: str):
    print("\n[*] Step 5: Checking and generating vector embeddings...")
    embedded_ids = fetch_existing_embedding_ids(cv_id)
    print(f"  -> Already embedded: {len(embedded_ids)} / {len(all_chunks)}")

    pending = [c for c in all_chunks if c["id"] not in embedded_ids]
    print(f"  -> Pending embedding: {len(pending)}")

    if not pending:
        print("[SUCCESS] All chunks are already embedded in Supabase!")
        return

    start_time = time.time()
    total_embedded = 0

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
        print(f"    Progress: {total_embedded}/{len(pending)} pending ({done_now}/{len(all_chunks)} total, {pct:.1f}%) | {rate:.1f} chunks/sec")
        time.sleep(1.5)

    print(f"\n[SUCCESS] Completed vector embeddings for Higher Mathematics! Total: {total_embedded} chunks.")

def main():
    print("=" * 65)
    print(" SheraTutor: Higher Mathematics (SSC-HMATH) Database Ingestion ")
    print("=" * 65)

    subj_id, cv_id, ch_map = setup_subject_and_chapters()
    all_chunks = ingest_chunks_from_jsonl(cv_id, ch_map)
    generate_and_save_embeddings(all_chunks, cv_id)

    print("\n" + "=" * 65)
    print(" HIGHER MATHEMATICS FULLY INGESTED & VECTOR EMBEDDED IN SUPABASE! ")
    print("=" * 65)

if __name__ == "__main__":
    main()
