#!/usr/bin/env python3
"""
SheraTutor: Sequential Full-Corpus Ingestion for Chemistry (English & Bangla).
Processes all 304 curriculum pages (PDF pages 6 to 309) for both editions:
1. Chemistry English (chemistry_en.pdf)
2. Chemistry Bangla (chemistry_bn.pdf)

Features:
- Ground-truth NCTB chapter-page boundaries (Chapters 1 to 12).
- Automatic database resumption (skips already-persisted pages).
- Non-blocking error handling with second-pass retry for transient failures.
- NVIDIA NIM Llama 3.2 11B Vision with SSE streaming and presence_penalty.
- Local Ollama BGE-M3 1024-dim embeddings.
- Direct Supabase PostgREST persistence into curriculum_chunks and chunk_embeddings.
- Detailed logging to ingestion/chemistry_full_ingest.log.
"""

import os
import sys
import json
import time
import base64
import unicodedata
import re
import uuid
import traceback
from pathlib import Path
from typing import Optional, Dict, Any, List, Tuple

import requests

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

from prompts.textbook_prompts import PROMPTS
from nim_batch_ingest import (
    load_env,
    NIM_API_KEY,
    NIM_BASE_URL,
    NIM_MODEL,
    OLLAMA_URL,
    OLLAMA_EMBED_MODEL,
    PDF_MAP,
    SUBJECT_CODE_MAP,
    BN_DIGIT_MAP,
    normalize_math_digits,
    render_page_jpeg,
    extract_with_nim,
    classify_chunk,
    extract_section_info,
    sanitize_markdown,
    chunk_markdown,
    get_bge_m3_embedding,
    CACHE_BASE_DIR,
)

load_env()

CHEMISTRY_CHAPTER_RANGES = [
    (1, 6, 21, "Concepts of Chemistry", "রসায়নের ধারণা"),
    (2, 22, 39, "States of Matter", "পদার্থের অবস্থা"),
    (3, 40, 63, "Structure of Matter", "পদার্থের গঠন"),
    (4, 64, 86, "Periodic Table", "পর্যায় সারণি"),
    (5, 87, 113, "Chemical Bond", "রাসায়নিক বন্ধন"),
    (6, 114, 146, "Concept of Mole & Chemical Calculation", "মোলের ধারণা ও রাসায়নিক গণনা"),
    (7, 147, 172, "Chemical Reactions", "রাসায়নিক বিক্রিয়া"),
    (8, 173, 210, "Chemistry and Energy", "রসায়ন ও শক্তি"),
    (9, 211, 237, "Acid-Base Balance", "এসিড-ক্ষার সমতা"),
    (10, 238, 265, "Mineral Resources: Metal-Nonmetal", "খনিজ সম্পদ: ধাতু-অধাতু"),
    (11, 266, 291, "Mineral Resources: Fossils", "খনিজ সম্পদ: জীবাশ্ম"),
    (12, 292, 309, "Chemistry in Our Lives", "আমাদের জীবনে রসায়ন"),
]

LOG_FILE = SCRIPT_DIR / "chemistry_full_ingest.log"

def log(msg: str):
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    formatted = f"[{timestamp}] {msg}"
    print(formatted, flush=True)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(formatted + "\n")

def get_chapter_info_for_page(page_no: int) -> Tuple[int, str, str]:
    for ch_no, start_p, end_p, t_en, t_bn in CHEMISTRY_CHAPTER_RANGES:
        if start_p <= page_no <= end_p:
            return ch_no, t_en, t_bn
    if page_no < 6:
        return 1, "Concepts of Chemistry", "রসায়নের ধারণা"
    return 12, "Chemistry in Our Lives", "আমাদের জীবনে রসায়ন"

def process_single_page(
    p_num: int,
    pdf_path: str,
    lang: str,
    cache_dir: Path,
    prompt: str,
    chapter_map: Dict[int, str],
    curriculum_version_id: str,
    sb_url: str,
    sb_headers: Dict[str, str],
    global_chunk_idx: int,
    delay_s: float = 2.0
) -> Tuple[int, int]:
    """Processes a single page and returns (chunk_count, new_global_chunk_idx)."""
    ch_no, ch_title_en, ch_title_bn = get_chapter_info_for_page(p_num)
    chapter_id = chapter_map.get(ch_no)
    cache_file = cache_dir / f"page_{p_num:04d}.json"
    
    # 1. Extraction from Cache or NIM
    markdown_text = ""
    if cache_file.exists():
        try:
            page_data = json.loads(cache_file.read_text(encoding="utf-8"))
            markdown_text = page_data.get("markdown", "")
            if len(markdown_text) < 25:
                markdown_text = ""
            else:
                log(f"  [Page {p_num:03d}] Loaded from cache ({len(markdown_text)} chars)")
        except Exception:
            markdown_text = ""
            
    if not markdown_text:
        jpg_file = render_page_jpeg(pdf_path, p_num)
        t0 = time.time()
        markdown_text = extract_with_nim(jpg_file, prompt, max_retries=3, timeout=90)
        elapsed_s = round(time.time() - t0, 2)
        log(f"  [Page {p_num:03d}] NIM Vision extracted {len(markdown_text)} chars in {elapsed_s}s")
        
        page_data = {
            "page_no": p_num,
            "subject": "chemistry",
            "lang": lang,
            "chapter_no": ch_no,
            "markdown": markdown_text,
            "char_count": len(markdown_text),
            "extraction_time_s": elapsed_s,
            "timestamp": time.time()
        }
        cache_file.write_text(json.dumps(page_data, ensure_ascii=False, indent=2), encoding="utf-8")
        
        if jpg_file.exists():
            jpg_file.unlink()
        time.sleep(delay_s)
        
    # 2. Chunking
    chunks = chunk_markdown(markdown_text)
    if not chunks:
        log(f"  [Page {p_num:03d}] Produced 0 chunks. Skipping.")
        return 0, global_chunk_idx
        
    # 3. Embeddings
    for c in chunks:
        c["embedding"] = get_bge_m3_embedding(c["content"])
        
    # 4. Supabase Persistence
    chunk_records = []
    db_chunk_ids = []
    for c in chunks:
        db_id = str(uuid.uuid4())
        db_chunk_ids.append(db_id)
        chunk_records.append({
            "id": db_id,
            "curriculum_version_id": curriculum_version_id,
            "chapter_id": chapter_id,
            "chunk_index": global_chunk_idx,
            "content_chunk": c["content"],
            "chunk_type": c["chunk_type"],
            "section_no": c["section_no"],
            "section_title": c["section_title"],
            "source_book_page_ref": str(p_num),
            "diagram_image_urls": c.get("diagram_image_urls", []),
            "official_rubric_rules": {},
            "parent_chunk_id": None
        })
        global_chunk_idx += 1
        
    for c_idx, c in enumerate(chunks):
        p_idx = c.get("parent_chunk_index")
        if p_idx is not None and p_idx < len(db_chunk_ids):
            chunk_records[c_idx]["parent_chunk_id"] = db_chunk_ids[p_idx]
            
    r_ins_c = requests.post(f"{sb_url}/rest/v1/curriculum_chunks", headers=sb_headers, json=chunk_records)
    if r_ins_c.status_code not in (200, 201):
        raise RuntimeError(f"curriculum_chunks insert failed: {r_ins_c.text}")
        
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
        raise RuntimeError(f"chunk_embeddings insert failed: {r_ins_e.text}")
        
    log(f"  [Page {p_num:03d}] Persisted {len(chunks)} chunks to Chapter {ch_no} ({ch_title_en})")
    return len(chunks), global_chunk_idx

def run_single_edition(
    lang: str,
    start_page: int = 6,
    end_page: int = 309,
    delay_s: float = 2.0
) -> Dict[str, Any]:
    pdf_path = PDF_MAP[("chemistry", lang)]
    cache_dir = CACHE_BASE_DIR / f"chemistry_{lang}"
    cache_dir.mkdir(parents=True, exist_ok=True)
    prompt = PROMPTS["chemistry"]
    
    log(f"================================================================")
    log(f" STARTING INGESTION: Chemistry ({lang.upper()}) | Pages {start_page}..{end_page}")
    log(f"================================================================")
    
    sb_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    sb_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    sb_headers = {
        "apikey": sb_key,
        "Authorization": f"Bearer {sb_key}",
        "Content-Type": "application/json"
    }
    
    r_s = requests.get(f"{sb_url}/rest/v1/subjects?code=eq.SSC-CHEM&select=id", headers=sb_headers)
    subject_id = r_s.json()[0]["id"]
    
    r_v = requests.get(f"{sb_url}/rest/v1/curriculum_versions?subject_id=eq.{subject_id}&language_tag=eq.{lang}&select=id", headers=sb_headers)
    curriculum_version_id = r_v.json()[0]["id"]
    
    r_c = requests.get(f"{sb_url}/rest/v1/chapters?subject_id=eq.{subject_id}&select=id,chapter_no", headers=sb_headers)
    chapter_map = {row["chapter_no"]: row["id"] for row in r_c.json()}
    
    r_ex = requests.get(f"{sb_url}/rest/v1/curriculum_chunks?curriculum_version_id=eq.{curriculum_version_id}&select=source_book_page_ref,chunk_index", headers=sb_headers)
    existing_pages = set()
    global_chunk_idx = 0
    for row in r_ex.json() or []:
        try:
            existing_pages.add(int(row["source_book_page_ref"]))
        except (ValueError, TypeError):
            pass
        if row.get("chunk_index") is not None and row["chunk_index"] > global_chunk_idx:
            global_chunk_idx = row["chunk_index"] + 1
            
    pages_to_process = [p for p in range(start_page, end_page + 1) if p not in existing_pages]
    log(f"Already persisted: {len(existing_pages)} pages. Remaining to process: {len(pages_to_process)} pages.")
    
    failed_pages = []
    processed_pages = 0
    total_chunks = 0
    
    for idx, p_num in enumerate(pages_to_process, 1):
        log(f"[{idx}/{len(pages_to_process)}] Chemistry ({lang.upper()}) Page {p_num:03d}...")
        try:
            chunks_cnt, global_chunk_idx = process_single_page(
                p_num=p_num,
                pdf_path=pdf_path,
                lang=lang,
                cache_dir=cache_dir,
                prompt=prompt,
                chapter_map=chapter_map,
                curriculum_version_id=curriculum_version_id,
                sb_url=sb_url,
                sb_headers=sb_headers,
                global_chunk_idx=global_chunk_idx,
                delay_s=delay_s
            )
            processed_pages += 1
            total_chunks += chunks_cnt
        except Exception as e:
            log(f"  [ERROR] Page {p_num:03d} failed: {e}")
            failed_pages.append(p_num)
            time.sleep(4)
            continue
            
    # Second-pass recovery
    if failed_pages:
        log(f"\n[SECOND PASS] Retrying {len(failed_pages)} failed pages: {failed_pages}")
        recovered = []
        for p_num in list(failed_pages):
            log(f"[SECOND PASS] Retrying Page {p_num:03d}...")
            time.sleep(6)
            try:
                chunks_cnt, global_chunk_idx = process_single_page(
                    p_num=p_num,
                    pdf_path=pdf_path,
                    lang=lang,
                    cache_dir=cache_dir,
                    prompt=prompt,
                    chapter_map=chapter_map,
                    curriculum_version_id=curriculum_version_id,
                    sb_url=sb_url,
                    sb_headers=sb_headers,
                    global_chunk_idx=global_chunk_idx,
                    delay_s=delay_s + 1.0
                )
                processed_pages += 1
                total_chunks += chunks_cnt
                recovered.append(p_num)
                log(f"[SECOND PASS SUCCESS] Page {p_num:03d} recovered successfully!")
            except Exception as e:
                log(f"[SECOND PASS FAILED] Page {p_num:03d} failed again: {e}")
        failed_pages = [p for p in failed_pages if p not in recovered]
        
    log(f"================================================================")
    log(f" FINISHED: Chemistry ({lang.upper()})")
    log(f" Newly Processed Pages: {processed_pages}")
    log(f" New Chunks Persisted:  {total_chunks}")
    log(f" Total Pages in Supabase: {len(existing_pages) + processed_pages} / {end_page - start_page + 1}")
    log(f" Failed Pages: {failed_pages}")
    log(f"================================================================\n")
    
    return {
        "lang": lang,
        "processed_pages": processed_pages,
        "total_chunks": total_chunks,
        "failed_pages": failed_pages
    }

def main():
    log("=================================================================")
    log(" SHERATUTOR FULL-CORPUS CHEMISTRY INGESTION (EN -> BN SEQUENTIAL)")
    log("=================================================================")
    
    # 1. Chemistry English (pages 6 to 309)
    res_en = run_single_edition("en", start_page=6, end_page=309, delay_s=2.0)
    
    # 2. Chemistry Bangla (pages 6 to 309)
    res_bn = run_single_edition("bn", start_page=6, end_page=309, delay_s=2.0)
    
    log("*****************************************************************")
    log(" ALL CHEMISTRY EDITIONS FULLY PROCESSED!")
    log(f" Summary EN: {res_en}")
    log(f" Summary BN: {res_bn}")
    log("*****************************************************************")

if __name__ == "__main__":
    main()
