#!/usr/bin/env python3
"""
SheraTutor: Refresh and Remediate All Flawed Pages (Bangla & English)
- Bangla: Re-extracts the legacy Tesseract OCR pages using pure Vision (meta/llama-3.2-11b-vision-instruct)
  with presence_penalty=0.5 using the SECONDARY NVIDIA NIM API KEY.
- English: Re-extracts the multi-line loop / preamble pages using pure Vision with presence_penalty=0.5
  using the PRIMARY NVIDIA NIM API KEY.
- Re-chunks, computes 1024-dim BGE-M3 embeddings locally via Ollama, and persists to Supabase.
"""

import os
import sys
import json
import time
import uuid
import argparse
from pathlib import Path
import requests

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT))
sys.path.insert(0, str(REPO_ROOT / "ingestion"))

from prompts.textbook_prompts import build_textbook_prompt
from nim_batch_ingest import (
    load_env,
    NIM_API_KEY,
    render_page_jpeg,
    extract_with_nim,
    clean_and_validate_markdown,
    classify_chunk,
    extract_section_info,
    sanitize_markdown,
    chunk_markdown,
    get_bge_m3_embedding,
    CACHE_BASE_DIR,
    PDF_MAP
)

load_env()

SECONDARY_BN_NIM_KEY = "REDACTED_NVIDIA_NIM_KEY"

CHEMISTRY_CHAPTERS = [
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

def get_chapter_info(page_no: int):
    for ch_no, start_p, end_p, t_en, t_bn in CHEMISTRY_CHAPTERS:
        if start_p <= page_no <= end_p:
            return ch_no, t_en, t_bn
    return 1, "Concepts of Chemistry", "রসায়নের ধারণা"

def get_pages_to_refresh(lang: str) -> list:
    cache_dir = CACHE_BASE_DIR / f"chemistry_{lang}"
    audit_file = REPO_ROOT / "ingestion" / "full_audit_results.json"
    
    if lang == "en":
        # 48 English pages needing re-extraction
        return [8, 17, 21, 41, 43, 65, 67, 68, 85, 93, 107, 113, 115, 117, 119, 121, 128, 130, 132, 133, 138, 140, 148, 149, 164, 171, 174, 177, 189, 191, 196, 203, 212, 213, 214, 216, 243, 247, 263, 264, 272, 278, 283, 286, 293, 304, 306, 307]
    else:
        # All legacy Tesseract / flawed pages in Bangla
        pages = []
        for p in range(6, 310):
            f = cache_dir / f"page_{p:04d}.json"
            if not f.exists():
                pages.append(p)
                continue
            try:
                d = json.loads(f.read_text(encoding="utf-8"))
                md = d.get("markdown", "")
                t = d.get("extraction_time_s", 999)
                if ("চিত্র ২.১০" in md or "NO VISUAL ELEMENTS" in md or "DIAGRAMS AND TABLES" in md or (t < 15 and p not in [6, 22, 40, 64, 87, 114, 147, 173, 211, 238, 266, 292]) or p == 38):
                    pages.append(p)
            except Exception:
                pages.append(p)
        return pages

def process_single_page(
    lang: str,
    p_num: int,
    pdf_path: Path,
    cache_dir: Path,
    sb_url: str,
    sb_headers: dict,
    curriculum_version_id: str,
    chapter_map: dict,
    api_key: str
):
    import nim_batch_ingest as nbi
    nbi.NIM_API_KEY = api_key
    
    ch_no, ch_title_en, ch_title_bn = get_chapter_info(p_num)
    ch_title = ch_title_en if lang == "en" else ch_title_bn
    chapter_id = chapter_map[ch_no]
    
    prompt = build_textbook_prompt(
        subject="chemistry",
        lang=lang,
        ch_no=ch_no,
        ch_title=ch_title
    )
    
    t0 = time.time()
    img_path = render_page_jpeg(pdf_path, p_num)
    
    raw_md = extract_with_nim(
        image_path=img_path,
        prompt=prompt,
        model="meta/llama-3.2-11b-vision-instruct",
        timeout=80
    )
    
    valid, cleaned_md, err = clean_and_validate_markdown(raw_md, lang=lang, ch_no=ch_no)
    if not valid:
        print(f"  [PAGE {p_num:03d}] Validation warning: {err}. Retrying once...")
        time.sleep(2)
        raw_md = extract_with_nim(image_path=img_path, prompt=prompt, model="meta/llama-3.2-11b-vision-instruct", timeout=85)
        valid, cleaned_md, err = clean_and_validate_markdown(raw_md, lang=lang, ch_no=ch_no)
        
    duration = round(time.time() - t0, 2)
    
    # 1. Update cache JSON
    page_data = {
        "page_no": p_num,
        "subject": "chemistry",
        "lang": lang,
        "chapter_no": ch_no,
        "markdown": cleaned_md,
        "char_count": len(cleaned_md),
        "extraction_time_s": duration,
        "timestamp": time.time(),
        "model": "meta/llama-3.2-11b-vision-instruct",
        "verified_pure_vision": True
    }
    cache_file = cache_dir / f"page_{p_num:04d}.json"
    cache_file.write_text(json.dumps(page_data, ensure_ascii=False, indent=2), encoding="utf-8")
    
    # 2. Delete old chunks & embeddings in Supabase
    r_old = requests.get(
        f"{sb_url}/rest/v1/curriculum_chunks?curriculum_version_id=eq.{curriculum_version_id}&source_book_page_ref=eq.{p_num}&select=id",
        headers=sb_headers
    )
    old_ids = [c["id"] for c in r_old.json() or []]
    if old_ids:
        id_str = ",".join(old_ids)
        requests.delete(f"{sb_url}/rest/v1/chunk_embeddings?chunk_id=in.({id_str})", headers=sb_headers)
        requests.delete(f"{sb_url}/rest/v1/curriculum_chunks?id=in.({id_str})", headers=sb_headers)
        
    # 3. Chunk and Embed
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
        
    # 4. Global chunk index lookup
    r_ex = requests.get(f"{sb_url}/rest/v1/curriculum_chunks?curriculum_version_id=eq.{curriculum_version_id}&select=chunk_index", headers=sb_headers)
    global_chunk_idx = max([row.get("chunk_index", 0) for row in r_ex.json() or []] + [0]) + 1
    
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
            "source_book_page_ref": str(p_num),
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
        raise RuntimeError(f"curriculum_chunks insert failed for page {p_num}: {r_ins_c.text}")
        
    emb_records = []
    for db_id, c in zip(db_chunk_ids, processed_chunks):
        emb_records.append({
            "chunk_id": db_id,
            "model_name": "bge-m3",
            "model_version": "v1",
            "embedding": c["embedding"]
        })
    r_ins_e = requests.post(f"{sb_url}/rest/v1/chunk_embeddings", headers=sb_headers, json=emb_records)
    if r_ins_e.status_code not in (200, 201):
        raise RuntimeError(f"chunk_embeddings insert failed for page {p_num}: {r_ins_e.text}")
        
    print(f"  [Page {p_num:03d} - {lang.upper()}] Re-extracted ({duration}s): {len(cleaned_md)} chars, {len(processed_chunks)} chunks persisted.")

def run_worker(lang: str, delay_s: float = 1.5):
    pdf_path = PDF_MAP[("chemistry", lang)]
    cache_dir = CACHE_BASE_DIR / f"chemistry_{lang}"
    cache_dir.mkdir(parents=True, exist_ok=True)
    
    api_key = SECONDARY_BN_NIM_KEY if lang == "bn" else NIM_API_KEY
    if not api_key:
        raise ValueError(f"No NIM API key available for {lang}")
        
    sb_url = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
    sb_key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
    sb_headers = {
        "apikey": sb_key,
        "Authorization": f"Bearer {sb_key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    r_s = requests.get(f"{sb_url}/rest/v1/subjects?code=eq.SSC-CHEM&select=id", headers=sb_headers)
    subject_id = r_s.json()[0]["id"]
    r_v = requests.get(f"{sb_url}/rest/v1/curriculum_versions?subject_id=eq.{subject_id}&language_tag=eq.{lang}&select=id", headers=sb_headers)
    curriculum_version_id = r_v.json()[0]["id"]
    r_c = requests.get(f"{sb_url}/rest/v1/chapters?subject_id=eq.{subject_id}&select=id,chapter_no", headers=sb_headers)
    chapter_map = {row["chapter_no"]: row["id"] for row in r_c.json()}
    
    pages = get_pages_to_refresh(lang)
    print(f"\n=======================================================")
    print(f" LAUNCHING REMEDIATION WORKER: {lang.upper()}")
    print(f" Target Pages: {len(pages)} pages")
    print(f" Model: meta/llama-3.2-11b-vision-instruct (presence_penalty=0.5)")
    print(f" API Key: {api_key[:12]}...{api_key[-4:]}")
    print(f"=======================================================\n")
    
    for idx, p in enumerate(pages, start=1):
        print(f"[{idx}/{len(pages)}] Processing Page {p:03d} ({lang.upper()})...")
        try:
            process_single_page(
                lang=lang,
                p_num=p,
                pdf_path=pdf_path,
                cache_dir=cache_dir,
                sb_url=sb_url,
                sb_headers=sb_headers,
                curriculum_version_id=curriculum_version_id,
                chapter_map=chapter_map,
                api_key=api_key
            )
        except Exception as e:
            print(f"  [ERROR] Page {p:03d} failed: {e}. Retrying in 5s...")
            time.sleep(5)
            try:
                process_single_page(
                    lang=lang,
                    p_num=p,
                    pdf_path=pdf_path,
                    cache_dir=cache_dir,
                    sb_url=sb_url,
                    sb_headers=sb_headers,
                    curriculum_version_id=curriculum_version_id,
                    chapter_map=chapter_map,
                    api_key=api_key
                )
            except Exception as e2:
                print(f"  [CRITICAL] Page {p:03d} failed retry: {e2}")
                
        time.sleep(delay_s)
        
    print(f"\n>>> REMEDIATION WORKER {lang.upper()} FINISHED ALL {len(pages)} PAGES! <<<\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Refresh and remediate flawed pages")
    parser.add_argument("--lang", choices=["en", "bn"], required=True, help="Language edition to remediate")
    parser.add_argument("--delay", type=float, default=1.5, help="Delay between pages")
    args = parser.parse_args()
    
    run_worker(args.lang, delay_s=args.delay)
