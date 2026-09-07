"""
Refresh legacy Bangla cached pages (Chapters 1-3) using PURE NIM 11B Vision
(no local Tesseract OCR, exactly like the English worker) with the secondary NIM API key.
Updates cache JSON and Supabase chunks + 1024-dim BGE-M3 embeddings.
"""

import os
import sys
import json
import time
import uuid
import requests
from pathlib import Path

REPO_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_DIR))

# Ensure secondary NIM API key is used
os.environ["NVIDIA_NIM_API_KEY"] = "REDACTED_NVIDIA_NIM_KEY"

import ingestion.nim_batch_ingest as nbi
nbi.NIM_API_KEY = "REDACTED_NVIDIA_NIM_KEY"
from ingestion.nim_batch_ingest import (
    render_page_jpeg,
    extract_with_nim,
    clean_and_validate_markdown,
    chunk_markdown
)
from ingestion.nim_bangla_ingest import (
    clean_nim_visual_output,
    get_bge_m3_embedding,
    detect_repetitions
)
from ingestion.prompts.textbook_prompts import build_textbook_prompt
from ingestion.run_chemistry_bangla import get_supabase_client

CACHE_DIR = REPO_DIR / "ingestion/cache/chemistry_bn"
PDF_PATH = REPO_DIR / "ingestion/textbooks/chemistry_bn.pdf"

PAGES_TO_REFRESH = [15, 18, 19, 21, 27, 30, 31, 32, 36, 38, 39, 45]

CHAPTER_MAP = {
    15: (1, "রসায়নের ধারণা"),
    18: (1, "রসায়নের ধারণা"),
    19: (1, "রসায়নের ধারণা"),
    21: (1, "রসায়নের ধারণা"),
    27: (2, "পদার্থের অবস্থা"),
    30: (2, "পদার্থের অবস্থা"),
    31: (2, "পদার্থের অবস্থা"),
    32: (2, "পদার্থের অবস্থা"),
    36: (2, "পদার্থের অবস্থা"),
    38: (2, "পদার্থের অবস্থা"),
    39: (2, "পদার্থের অবস্থা"),
    45: (3, "পদার্থের গঠন"),
}

def refresh_pages(page_list):
    sb_url, sb_headers = get_supabase_client()
    
    # Get Bangla curriculum version for Chemistry
    r_v = requests.get(f"{sb_url}/rest/v1/curriculum_versions?language_tag=eq.bn&select=id,subject_id", headers=sb_headers)
    cv_matches = [v for v in r_v.json() if v.get("subject_id") == "d85609a4-256b-485f-a4e6-6ec7c7b5098e"]
    curriculum_version_id = cv_matches[0]["id"]
    
    # Get chapters map
    r_c = requests.get(f"{sb_url}/rest/v1/chapters?subject_id=eq.d85609a4-256b-485f-a4e6-6ec7c7b5098e&select=id,chapter_no", headers=sb_headers)
    ch_id_map = {c["chapter_no"]: c["id"] for c in r_c.json()}
    
    print(f"Starting pure-vision refresh of {len(page_list)} legacy Bangla pages...")
    
    for p_num in page_list:
        ch_no, ch_title_bn = CHAPTER_MAP[p_num]
        chapter_id = ch_id_map[ch_no]
        cache_file = CACHE_DIR / f"page_{p_num:04d}.json"
        
        print(f"\n>>> Refreshing Page {p_num:03d} (Chapter {ch_no}: {ch_title_bn})...")
        t0 = time.time()
        
        # 1. Render JPEG at 130 DPI
        jpg_path = render_page_jpeg(PDF_PATH, p_num, dpi=130)
        
        # 2. Build prompt for Chapter
        prompt = build_textbook_prompt("chemistry", "bn", ch_no, ch_title_bn)
        
        # 3. Call NIM 11B Vision with streaming & secondary key
        raw_md = extract_with_nim(jpg_path, prompt, timeout=75)
        if jpg_path.exists():
            jpg_path.unlink()
            
        # 4. Clean up CoT, Devanagari Hindi leakage, and repetition loops
        clean_md = clean_nim_visual_output(raw_md)
        _, clean_md, _ = clean_and_validate_markdown(clean_md, "bn", ch_no)
        
        elapsed = time.time() - t0
        print(f"  [Page {p_num:03d}] Extracted {len(clean_md)} pristine chars in {elapsed:.2f}s")
        
        # 5. Overwrite cache JSON
        with open(cache_file, "w", encoding="utf-8") as f:
            json.dump({
                "page_no": p_num,
                "subject": "chemistry",
                "lang": "bn",
                "chapter_no": ch_no,
                "markdown": clean_md,
                "char_count": len(clean_md),
                "extraction_time_s": round(elapsed, 2),
                "timestamp": time.time()
            }, f, ensure_ascii=False, indent=2)
        print(f"  [Page {p_num:03d}] Updated cache file {cache_file.name}")
        
        # 6. Delete existing chunks & embeddings in Supabase
        r_old = requests.get(
            f"{sb_url}/rest/v1/curriculum_chunks?curriculum_version_id=eq.{curriculum_version_id}&source_book_page_ref=eq.{p_num}&select=id",
            headers=sb_headers
        )
        old_chunks = r_old.json() or []
        if old_chunks:
            old_ids = [c["id"] for c in old_chunks]
            for o_id in old_ids:
                requests.delete(f"{sb_url}/rest/v1/chunk_embeddings?chunk_id=eq.{o_id}", headers=sb_headers)
            requests.delete(
                f"{sb_url}/rest/v1/curriculum_chunks?curriculum_version_id=eq.{curriculum_version_id}&source_book_page_ref=eq.{p_num}",
                headers=sb_headers
            )
            print(f"  [Page {p_num:03d}] Cleared {len(old_ids)} old chunks from Supabase")
            
        # 7. Re-chunk and embed
        chunks = chunk_markdown(clean_md, max_chars=1200)
        for c in chunks:
            c["embedding"] = get_bge_m3_embedding(c["content"])
            
        chunk_records = []
        db_chunk_ids = []
        for c_idx, c in enumerate(chunks):
            db_id = str(uuid.uuid4())
            db_chunk_ids.append(db_id)
            chunk_records.append({
                "id": db_id,
                "curriculum_version_id": curriculum_version_id,
                "chapter_id": chapter_id,
                "chunk_index": p_num * 100 + c_idx,
                "content_chunk": c["content"],
                "chunk_type": c["chunk_type"],
                "section_no": c.get("section_no"),
                "section_title": c.get("section_title"),
                "source_book_page_ref": str(p_num),
                "diagram_image_urls": [],
                "official_rubric_rules": {},
                "parent_chunk_id": None
            })
            
        # Insert chunks
        r_ins_c = requests.post(f"{sb_url}/rest/v1/curriculum_chunks", headers=sb_headers, json=chunk_records)
        if r_ins_c.status_code not in (200, 201):
            print(f"  [ERROR] curriculum_chunks insert failed for page {p_num}: {r_ins_c.text}")
            continue
            
        # Insert embeddings
        embedding_records = []
        for db_id, c in zip(db_chunk_ids, chunks):
            embedding_records.append({
                "chunk_id": db_id,
                "model_name": "bge-m3",
                "model_version": "v1",
                "embedding": c["embedding"]
            })
        r_ins_e = requests.post(f"{sb_url}/rest/v1/chunk_embeddings", headers=sb_headers, json=embedding_records)
        if r_ins_e.status_code not in (200, 201):
            print(f"  [ERROR] chunk_embeddings insert failed for page {p_num}: {r_ins_e.text}")
            continue
            
        print(f"  [Page {p_num:03d}] Successfully persisted {len(chunks)} clean chunks & embeddings to Supabase.")
        time.sleep(1.0)
        
    print("\n=======================================================")
    print(f"COMPLETED PURE-VISION REFRESH OF ALL {len(page_list)} PAGES!")
    print("=======================================================")

if __name__ == "__main__":
    pages = [int(x) for x in sys.argv[1:]] if len(sys.argv) > 1 else PAGES_TO_REFRESH
    refresh_pages(pages)
