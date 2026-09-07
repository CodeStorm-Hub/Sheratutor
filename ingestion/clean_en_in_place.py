#!/usr/bin/env python3
"""
SheraTutor: Clean in-place English pages that have collapsible loops and preambles.
Updates disk cache JSONs and syncs Supabase curriculum_chunks & chunk_embeddings.
"""

import os
import sys
import json
import uuid
from pathlib import Path
import requests

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "ingestion"))

from nim_batch_ingest import (
    load_env,
    clean_and_validate_markdown,
    classify_chunk,
    extract_section_info,
    sanitize_markdown,
    chunk_markdown,
    get_bge_m3_embedding,
    CACHE_BASE_DIR,
)

load_env()

PAGES_TO_CLEAN = [27, 52, 53, 73, 76, 92, 96, 100, 112, 139, 146, 152, 178, 194, 202, 207, 235, 242, 246, 248, 251, 255, 290]

def main():
    sb_url = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
    sb_key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
    sb_headers = {
        "apikey": sb_key,
        "Authorization": f"Bearer {sb_key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    # Get EN curriculum_version_id
    r_s = requests.get(f"{sb_url}/rest/v1/subjects?code=eq.SSC-CHEM&select=id", headers=sb_headers)
    subject_id = r_s.json()[0]["id"]
    r_v = requests.get(f"{sb_url}/rest/v1/curriculum_versions?subject_id=eq.{subject_id}&language_tag=eq.en&select=id", headers=sb_headers)
    curriculum_version_id = r_v.json()[0]["id"]
    
    r_c = requests.get(f"{sb_url}/rest/v1/chapters?subject_id=eq.{subject_id}&select=id,chapter_no", headers=sb_headers)
    chapter_map = {row["chapter_no"]: row["id"] for row in r_c.json()}
    
    cache_dir = CACHE_BASE_DIR / "chemistry_en"
    
    print(f"Cleaning {len(PAGES_TO_CLEAN)} English pages in-place...")
    
    # Track global_chunk_idx
    r_ex = requests.get(f"{sb_url}/rest/v1/curriculum_chunks?curriculum_version_id=eq.{curriculum_version_id}&select=chunk_index", headers=sb_headers)
    global_chunk_idx = max([row.get("chunk_index", 0) for row in r_ex.json() or []] + [0]) + 1

    for p in PAGES_TO_CLEAN:
        f = cache_dir / f"page_{p:04d}.json"
        data = json.loads(f.read_text(encoding="utf-8"))
        orig_md = data["markdown"]
        ch_no = data["chapter_no"]
        chapter_id = chapter_map[ch_no]
        
        valid, cleaned_md, err = clean_and_validate_markdown(orig_md, "en", ch_no=ch_no)
        if not valid:
            print(f"  [SKIP] Page {p:03d} validation error: {err}")
            continue
            
        data["markdown"] = cleaned_md
        data["char_count"] = len(cleaned_md)
        f.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        
        # 1. Delete old chunks for this page in Supabase
        r_old = requests.get(
            f"{sb_url}/rest/v1/curriculum_chunks?curriculum_version_id=eq.{curriculum_version_id}&source_book_page_ref=eq.{p}&select=id",
            headers=sb_headers
        )
        old_ids = [c["id"] for c in r_old.json() or []]
        if old_ids:
            id_str = ",".join(old_ids)
            requests.delete(f"{sb_url}/rest/v1/chunk_embeddings?chunk_id=in.({id_str})", headers=sb_headers)
            requests.delete(f"{sb_url}/rest/v1/curriculum_chunks?id=in.({id_str})", headers=sb_headers)
            
        # 2. Chunk cleaned markdown
        raw_chunks = chunk_markdown(cleaned_md, max_chars=1200)
        processed_chunks = []
        for c in raw_chunks:
            sec_no, sec_title = extract_section_info(c["content"])
            chunk_type = classify_chunk(c["content"])
            emb = get_bge_m3_embedding(c["content"])
            processed_chunks.append({
                "content": c["content"],
                "chunk_type": chunk_type,
                "section_no": sec_no,
                "section_title": sec_title,
                "parent_chunk_index": c.get("parent_chunk_index"),
                "embedding": emb
            })
            
        # 3. Insert new chunks
        chunk_records = []
        db_chunk_ids = []
        for c in processed_chunks:
            c_id = str(uuid.uuid4())
            db_chunk_ids.append(c_id)
            chunk_records.append({
                "id": c_id,
                "chapter_id": chapter_id,
                "curriculum_version_id": curriculum_version_id,
                "chunk_index": global_chunk_idx,
                "chunk_type": c["chunk_type"],
                "content_chunk": sanitize_markdown(c["content"]),
                "section_no": c["section_no"],
                "section_title": c["section_title"],
                "source_book_page_ref": str(p),
                "diagram_image_urls": [],
                "official_rubric_rules": {},
                "parent_chunk_id": None
            })
            global_chunk_idx += 1
            
        for c_idx, c in enumerate(processed_chunks):
            p_idx = c.get("parent_chunk_index")
            if p_idx is not None and p_idx < len(db_chunk_ids):
                chunk_records[c_idx]["parent_chunk_id"] = db_chunk_ids[p_idx]
                
        r_ins_c = requests.post(f"{sb_url}/rest/v1/curriculum_chunks", headers=sb_headers, json=chunk_records)
        if r_ins_c.status_code not in (200, 201):
            print(f"  [ERROR] Page {p:03d} chunk insert failed: {r_ins_c.text}")
            continue
            
        emb_records = []
        for db_id, c in zip(db_chunk_ids, processed_chunks):
            emb_records.append({
                "chunk_id": db_id,
                "model_name": "bge-m3",
                "model_version": "v1",
                "embedding": c["embedding"]
            })
        r_ins_e = requests.post(f"{sb_url}/rest/v1/chunk_embeddings", headers=sb_headers, json=emb_records)
        
        print(f"  [Page {p:03d}] Cleaned in-place: {len(orig_md)} -> {len(cleaned_md)} chars, {len(processed_chunks)} chunks persisted.")
        
    print("\nAll targeted in-place pages cleaned and synced!")

if __name__ == "__main__":
    main()
