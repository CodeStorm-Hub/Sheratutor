#!/usr/bin/env python3
"""
Ingests all 304 verified NCTB Chemistry (Bengali Edition) pages into Supabase 'curriculum_chunks'.
Tied to curriculum_version_id = 'fde7ee81-5899-4d46-8ee5-f090d440521b'.
STOP before embedding generation as requested by the user.
"""

import os
import re
import json
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

env_path = Path("/home/syed/workspace/Sheratutor/ingestion/.env")
load_dotenv(dotenv_path=env_path)

sb_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
sb_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not sb_url or not sb_key:
    print("Error: Supabase credentials missing in .env")
    exit(1)

supabase = create_client(sb_url, sb_key)

CURRICULUM_VERSION_ID = "fde7ee81-5899-4d46-8ee5-f090d440521b"
SUBJECT_CODE = "SSC-CHEM"

# Fetch Chapter UUIDs for SSC-CHEM
ch_res = supabase.table("chapters").select("id, chapter_no, title_bn").eq("subject_id", "d85609a4-256b-485f-a4e6-6ec7c7b5098e").order("chapter_no").execute()
CHAPTER_MAP = {r["chapter_no"]: r["id"] for r in ch_res.data}
print(f"Loaded {len(CHAPTER_MAP)} chapters from Supabase.")

# Load verified figure URLs map
url_map_file = Path("/home/syed/workspace/Sheratutor/ingestion/output/figures_verified/chemistry/bn/uploaded_supabase_urls.json")
uploaded_urls = {}
if url_map_file.exists():
    url_data = json.loads(url_map_file.read_text(encoding="utf-8"))
    uploaded_urls = url_data.get("urls", {})
print(f"Loaded {len(uploaded_urls)} verified figure CDN URLs from Storage map.")

cache_dir = Path("/home/syed/workspace/Sheratutor/ingestion/cache_verified/chemistry_bn")
page_files = sorted(cache_dir.glob("page_*.json"))
print(f"Found {len(page_files)} verified page files to ingest.")

rows_to_insert = []
base_cdn = f"{sb_url}/storage/v1/object/public/curriculum-assets"

for idx, pf in enumerate(page_files):
    data = json.loads(pf.read_text(encoding="utf-8"))
    pno = data["page_no"]
    ch_no = data["chapter_no"]
    md = data["markdown"]
    ch_id = CHAPTER_MAP[ch_no]
    ch_str = f"ch_{ch_no:02d}"

    # Extract section info if available
    section_no = None
    section_title = None
    sec_match = re.search(r"(?:^|\n)##?\s*(\d+\.\d+)\s+([^\n]+)", md)
    if sec_match:
        section_no = sec_match.group(1).strip()
        section_title = sec_match.group(2).strip()

    # Allowed check constraint values: 'theory', 'worked_example', 'cq_stimulus', 'cq_subquestion', 'table'
    chunk_type = "theory"
    if "সৃজনশীল প্রশ্ন" in md or "উদ্দীপক" in md:
        chunk_type = "cq_stimulus"
    elif "উদাহরণ" in md or "গাণিতিক" in md:
        chunk_type = "worked_example"
    elif data.get("tables_present") and "টেবিল" in md:
        chunk_type = "table"

    # Map verified diagrams to live Supabase CDN URLs
    diag_urls = []
    for diag in data.get("diagrams", []):
        fid = diag["figure_id"]
        storage_key = f"chemistry/bn/{ch_str}/{fid}.png"
        if storage_key in uploaded_urls:
            diag_urls.append(uploaded_urls[storage_key])
        else:
            diag_urls.append(f"{base_cdn}/{storage_key}")

    row = {
        "chapter_id": ch_id,
        "curriculum_version_id": CURRICULUM_VERSION_ID,
        "content_chunk": md,
        "content_format": "markdown",
        "official_rubric_rules": {
            "chapter_no": ch_no,
            "page_no": pno,
            "diagrams": [d["caption"] for d in data.get("diagrams", [])],
            "verified": True
        },
        "source_book_page_ref": str(pno),
        "diagram_image_urls": diag_urls,
        "chunk_index": idx,
        "chunk_type": chunk_type,
        "section_no": section_no,
        "section_title": section_title
    }
    rows_to_insert.append(row)

print(f"Prepared {len(rows_to_insert)} rows. Inserting into Supabase in batches of 25...")

batch_size = 25
inserted_count = 0

for i in range(0, len(rows_to_insert), batch_size):
    batch = rows_to_insert[i : i + batch_size]
    res = supabase.table("curriculum_chunks").insert(batch).execute()
    inserted_count += len(batch)
    print(f"  Inserted {inserted_count}/{len(rows_to_insert)} chunks...")

print(f"\nSUCCESS: Ingested all {inserted_count} verified curriculum chunks into Supabase!")
print(f"Note: Embeddings generation was SKIPPED per user instruction.")
