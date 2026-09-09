#!/usr/bin/env python3
"""
SheraTutor: High-Performance Batch Ingestion Pipeline via NVIDIA NIM Vision.
Uses meta/llama-3.2-11b-vision-instruct to extract STEM textbooks (Chemistry, Math, English)
into clean Markdown + LaTeX, caches extractions to disk, classifies pedagogical chunks,
generates 1024-dim BGE-M3 embeddings via local Ollama, and persists to Supabase.
"""

import os
import sys
import json
import time
import base64
import argparse
import subprocess
import unicodedata
import re
import uuid
from pathlib import Path
from typing import Optional, Dict, Any, List, Tuple

import requests

# Add ingestion directory to sys.path for prompt imports
sys.path.insert(0, str(Path(__file__).resolve().parent))
from prompts.textbook_prompts import PROMPTS

CACHE_VERIFIED_DIR = Path(__file__).resolve().parent / "cache_verified"
CACHE_BASE_DIR = Path(__file__).resolve().parent / "cache"

def load_env():
    """Loads environment variables from web/.env.local if not already set."""
    env_local = Path(__file__).resolve().parent.parent / "web" / ".env.local"
    if env_local.exists():
        for line in env_local.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                k = k.strip()
                v = v.strip().strip('"').strip("'")
                if k not in os.environ:
                    os.environ[k] = v

load_env()

NIM_API_KEY = os.environ.get("NVIDIA_NIM_API_KEY")
NIM_BASE_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
NIM_MODEL = "meta/llama-3.2-11b-vision-instruct"
OLLAMA_URL = os.environ.get("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
OLLAMA_EMBED_MODEL = "bge-m3"

PDF_MAP = {
    ("chemistry", "bn"): "ingestion/textbooks/chemistry_bn.pdf",
    ("chemistry", "en"): "ingestion/textbooks/chemistry_en.pdf",
    ("mathematics", "bn"): "ingestion/textbooks/mathematics_bn.pdf",
    ("mathematics", "en"): "ingestion/textbooks/mathematics_en.pdf",
    ("math", "bn"): "ingestion/textbooks/mathematics_bn.pdf",
    ("math", "en"): "ingestion/textbooks/mathematics_en.pdf",
    ("english", "bn"): "ingestion/textbooks/english_for_today.pdf",
    ("english", "en"): "ingestion/textbooks/english_grammar_and_composition.pdf",
}

SUBJECT_CODE_MAP = {
    "chemistry": "SSC-CHEM",
    "mathematics": "SSC-MATH",
    "math": "SSC-MATH",
    "english": "SSC-ENG",
}

BN_DIGIT_MAP = str.maketrans("০১২৩৪৫৬৭৮৯", "0123456789")

def normalize_math_digits(text: str) -> str:
    """Normalizes Bengali digits to Arabic numbers inside LaTeX math formulas."""
    def replace_digits(match):
        return match.group(0).translate(BN_DIGIT_MAP)
    
    text = re.sub(r"\$\$.*?\$\$", replace_digits, text, flags=re.DOTALL)
    text = re.sub(r"\$.*?\$", replace_digits, text)
    return text

def render_page_jpeg(pdf_path: str, page_no: int, dpi: int = 130, quality: int = 85) -> Path:
    """Renders a single PDF page (1-indexed) into an optimized JPEG using pdftoppm."""
    out_prefix = f"/tmp/nim_p_{os.getpid()}_{page_no}"
    cmd = [
        "pdftoppm", "-jpeg",
        "-r", str(dpi),
        "-jpegopt", f"quality={quality}",
        "-f", str(page_no),
        "-l", str(page_no),
        pdf_path,
        out_prefix
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    matches = list(Path("/tmp").glob(f"nim_p_{os.getpid()}_{page_no}*.jpg"))
    if not matches:
        raise FileNotFoundError(f"pdftoppm failed to generate JPEG for page {page_no}")
    return matches[0]

def extract_with_nim(
    image_path: Path,
    prompt: str,
    max_retries: int = 3,
    timeout: int = 80,
    model: Optional[str] = None
) -> str:
    """Sends page JPEG to NVIDIA NIM vision model with retry, rate limit handling, and timeout."""
    if not NIM_API_KEY:
        raise ValueError("NVIDIA_NIM_API_KEY not found in environment or web/.env.local")
        
    img_b64 = base64.b64encode(image_path.read_bytes()).decode("utf-8")
    chosen_model = model or NIM_MODEL
    
    headers = {
        "Authorization": f"Bearer {NIM_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": chosen_model,
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_b64}"}}
                ]
            }
        ],
        "temperature": 0.0,
        "presence_penalty": 0.5,
        "max_tokens": 2500,
        "stream": True
    }
    
    for attempt in range(1, max_retries + 1):
        try:
            req_timeout = (15, timeout) if isinstance(timeout, (int, float)) else timeout
            resp = requests.post(NIM_BASE_URL, headers=headers, json=payload, stream=True, timeout=req_timeout)
            if resp.status_code == 200:
                collected = []
                for line in resp.iter_lines():
                    if line:
                        decoded = line.decode("utf-8")
                        if decoded.startswith("data: ") and decoded != "data: [DONE]":
                            try:
                                chunk_data = json.loads(decoded[6:])
                                choices = chunk_data.get("choices")
                                if choices and len(choices) > 0:
                                    delta = choices[0].get("delta", {}).get("content", "")
                                    if delta:
                                        collected.append(delta)
                            except json.JSONDecodeError:
                                pass
                content = "".join(collected)
                normalized = unicodedata.normalize("NFC", content).strip()
                if len(normalized) < 25:
                    print(f"    [Warning: extracted text too short ({len(normalized)} chars). Retrying attempt {attempt}/{max_retries}]", flush=True)
                    time.sleep(2)
                    continue
                return normalize_math_digits(normalized)
            elif resp.status_code == 429:
                wait_s = attempt * 8
                print(f"    [Rate limit 429] Backing off for {wait_s}s (attempt {attempt}/{max_retries})...", flush=True)
                time.sleep(wait_s)
            else:
                print(f"    [HTTP {resp.status_code}] {resp.text[:200]} (attempt {attempt}/{max_retries})", flush=True)
                time.sleep(2)
        except requests.exceptions.RequestException as e:
            print(f"    [Network/Timeout error] {e} (attempt {attempt}/{max_retries})", flush=True)
            time.sleep(3)
            
    raise RuntimeError(f"Failed to extract page after {max_retries} attempts with {chosen_model}")

def clean_and_validate_markdown(
    markdown: str,
    lang: str,
    ch_no: Optional[int] = None
) -> Tuple[bool, str, str]:
    """
    Validates and cleans markdown content for a page:
    1. Removes conversational wrappers (e.g. ```markdown ... ```).
    2. Enforces language isolation: If lang == 'en', detects any Bengali characters (\\u0980-\\u09FF).
    3. Enforces chapter scoping: Checks for section headers or figures belonging to other chapters.
    4. Deduplicates consecutive identical lines and repetitive loops.
    Returns (is_valid, cleaned_markdown, error_message).
    """
    if not markdown:
        return False, "", "Empty markdown content"
        
    cleaned = markdown.strip()
    # Strip markdown fence wrappers if any
    cleaned = re.sub(r"^```(?:markdown)?\s*\n", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\n```\s*$", "", cleaned).strip()
    
    # Strip LLM preambles / COT leakage
    cot_pats = [
        r"(?i)^\s*here is the (?:transcription|markdown|text)[^\n]*\n+",
        r"(?i)^\s*certainly[,!][^\n]*\n+",
        r"(?i)^\s*based on the (?:image|provided|page)[^\n]*\n+",
        r"(?i)<\s*think\s*>.*?<\s*/\s*think\s*>",
        r"(?i)\btranscription:\s*\n",
    ]
    for pat in cot_pats:
        cleaned = re.sub(pat, "", cleaned, flags=re.DOTALL).strip()
        
    # Multi-line cycle loop collapsing (k from 1 to 60)
    lines = [l.rstrip() for l in cleaned.splitlines()]
    changed = True
    while changed:
        changed = False
        max_k = min(len(lines) // 2, 60)
        for k in range(1, max_k + 1):
            i = 0
            new_lines = []
            while i < len(lines):
                pattern = lines[i:i+k]
                if any(p.strip() for p in pattern):
                    repeats = 0
                    while i + (repeats + 1) * k <= len(lines) and lines[i + repeats * k : i + (repeats + 1) * k] == pattern:
                        repeats += 1
                    if repeats > 1:
                        new_lines.extend(pattern)
                        i += repeats * k
                        rem = len(lines) - i
                        if 0 < rem < k and lines[i:i+rem] == pattern[:rem]:
                            i += rem
                        changed = True
                        continue
                new_lines.append(lines[i])
                i += 1
            lines = new_lines
            if changed:
                break
    cleaned = "\n".join(lines).strip()
    
    # 1. Language check: EN version must not have Bengali characters
    if lang.lower() == "en":
        bn_chars = re.findall(r"[\u0980-\u09ff]", cleaned)
        if len(bn_chars) > 0:
            sample = "".join(bn_chars[:12])
            return False, cleaned, f"Language contamination: {len(bn_chars)} Bengali chars found in EN page (sample: '{sample}')"
            
    # 2. Chapter scoping: Check for section headers belonging to other chapters
    if ch_no is not None:
        # Check section headers like ## 2.5 or **2.5
        sec_matches = re.findall(r"(?:^|\n)(?:#{1,4}|\*\*)\s*(\d+)\.(\d+)", cleaned)
        wrong_secs = [f"{m[0]}.{m[1]}" for m in sec_matches if int(m[0]) != ch_no and int(m[0]) in range(1, 13)]
        if wrong_secs:
            return False, cleaned, f"Chapter scope violation: Foreign section(s) {list(set(wrong_secs))} found in Chapter {ch_no}"
            
        # Check figure captions like Fig 2.05 or চিত্র 2.05
        fig_matches = re.findall(r"(?i)(?:Fig(?:ure)?|চিত্র)\.?\s*(\d+)[\.\:]\d+", cleaned)
        wrong_figs = [m for m in fig_matches if int(m) != ch_no and int(m) in range(1, 13)]
        if wrong_figs:
            return False, cleaned, f"Chapter scope violation: Foreign figure(s) matching Chapter {list(set(wrong_figs))} found in Chapter {ch_no}"
            
    return True, cleaned, ""

def classify_chunk(text: str) -> str:
    """Classifies text block into pedagogical type."""
    lower_text = text.lower()
    if any(k in text for k in ["গাণিতিক উদাহরণ", "উদাহরণ", "গাণিতিক সমস্যা"]) or "example" in lower_text:
        return "worked_example"
    elif any(k in text for k in ["সৃজনশীল প্রশ্ন", "উদ্দীপক", "অনুশীলনীর প্রশ্ন"]) or "creative question" in lower_text:
        return "cq_stimulus"
    elif re.search(r"^[(\[]?[কখগঘabcd][)\]\.]", text.strip(), re.MULTILINE):
        return "cq_subquestion"
    elif text.strip().startswith("|") and text.count("|") > 4:
        return "table"
    return "theory"

def extract_section_info(text: str) -> Tuple[Optional[str], Optional[str]]:
    """Extracts section number and title if present."""
    match = re.search(r"(?:^|\n)(?:#{1,4}\s*)?(\d+\.\d+)\s+([^\n]+)", text)
    if match:
        return match.group(1).strip(), match.group(2).strip()
    return None, None

def detect_chapter_number(text: str, fallback_chapter: int = 1) -> int:
    """Detects current chapter number from text headers."""
    # Bengali chapter pattern: প্রথম/দ্বিতীয় or অধ্যায় ১ / অধ্যায় 1
    m_bn = re.search(r"(?:অধ্যায়|অধ্যায়)\s*(\d+|[০-৯]+)", text)
    if m_bn:
        ch_str = m_bn.group(1).translate(BN_DIGIT_MAP)
        try:
            return int(ch_str)
        except ValueError:
            pass
            
    # English chapter pattern: Chapter 1 / CHAPTER 3
    m_en = re.search(r"(?i)chapter\s*(\d+)", text)
    if m_en:
        try:
            return int(m_en.group(1))
        except ValueError:
            pass
            
    # Section number heuristic: 3.2 implies Chapter 3
    m_sec = re.search(r"(?:^|\n)(?:#{1,4}\s*)?(\d+)\.\d+\s+", text)
    if m_sec:
        try:
            ch_num = int(m_sec.group(1))
            if 1 <= ch_num <= 20:
                return ch_num
        except ValueError:
            pass
            
    return fallback_chapter

def sanitize_markdown(markdown_text: str) -> str:
    """Cleans up empty table rows, duplicate placeholders, and degenerate pipe sequences."""
    lines = []
    prev_line = None
    rep_count = 0
    for line in markdown_text.splitlines():
        stripped = line.strip()
        # Drop table rows that have no real text/numbers, e.g. "| | | | |" or "|   |   |"
        if re.match(r"^\s*\|(\s*\|)+\s*$", line):
            continue
        # Drop consecutive identical lines
        if stripped and stripped == prev_line:
            rep_count += 1
            if rep_count > 1:
                continue
        else:
            rep_count = 0
            prev_line = stripped if stripped else None
        lines.append(line)
    return "\n".join(lines).strip()

def chunk_markdown(markdown_text: str, max_chars: int = 1200) -> List[Dict[str, Any]]:
    """Splits extracted page markdown into cohesive pedagogical chunks."""
    clean_text = sanitize_markdown(markdown_text)
    raw_blocks = re.split(r"(?=\n#{1,3}\s)", clean_text)
    chunks = []
    
    last_stimulus_index = None
    
    for block in raw_blocks:
        block = block.strip()
        if not block:
            continue
            
        paras = [p.strip() for p in block.split("\n\n") if p.strip()]
        current = ""
        for p in paras:
            if len(current) + len(p) > max_chars and current:
                chunks.append(current)
                current = ""
                
            if len(p) > max_chars:
                # Sub-split oversized paragraph by lines
                sub_lines = p.split("\n")
                sub_curr = ""
                for s_line in sub_lines:
                    if len(sub_curr) + len(s_line) > max_chars and sub_curr:
                        chunks.append(sub_curr.strip())
                        sub_curr = s_line
                    else:
                        sub_curr = f"{sub_curr}\n{s_line}" if sub_curr else s_line
                if sub_curr:
                    current = sub_curr.strip()
            else:
                current = f"{current}\n\n{p}" if current else p
                
        if current:
            chunks.append(current)
            
    structured_chunks = []
    for c_idx, c_text in enumerate(chunks):
        if len(c_text) < 25:
            continue
        c_type = classify_chunk(c_text)
        sec_no, sec_title = extract_section_info(c_text)
        
        is_stimulus = (c_type == "cq_stimulus")
        if is_stimulus:
            last_stimulus_index = c_idx
            
        parent_idx = last_stimulus_index if (c_type == "cq_subquestion" and last_stimulus_index is not None) else None
        
        structured_chunks.append({
            "chunk_index": c_idx,
            "content": c_text,
            "chunk_type": c_type,
            "section_no": sec_no,
            "section_title": sec_title,
            "parent_chunk_index": parent_idx
        })
        
    return structured_chunks

def get_bge_m3_embedding(text: str, ollama_url: str = OLLAMA_URL) -> List[float]:
    """Generates 1024-dim BGE-M3 embedding via local Ollama."""
    prompt_text = text[:2000].strip()
    try:
        r = requests.post(
            f"{ollama_url}/api/embeddings",
            json={"model": OLLAMA_EMBED_MODEL, "prompt": prompt_text},
            timeout=30
        )
        r.raise_for_status()
        emb = r.json().get("embedding", [])
        if len(emb) != 1024:
            raise ValueError(f"Expected 1024-dim embedding, got {len(emb)}")
        return emb
    except Exception as e:
        raise RuntimeError(f"Ollama BGE-M3 embedding failed: {e}")

def process_subject_batch(
    subject: str,
    lang: str,
    start_page: int,
    end_page: int,
    pdf_path: Optional[str] = None,
    delay_s: float = 2.0,
    persist_db: bool = False
):
    """Processes a batch of textbook pages: renders, extracts with NIM, chunks, embeds, and persists."""
    subj_key = subject.lower()
    if not pdf_path:
        pdf_path = PDF_MAP.get((subj_key, lang))
    if not pdf_path or not Path(pdf_path).exists():
        raise FileNotFoundError(f"PDF not found for subject={subject}, lang={lang} at {pdf_path}")
        
    verified_cache_dir = CACHE_VERIFIED_DIR / f"{subj_key}_{lang}"
    cache_dir = verified_cache_dir if verified_cache_dir.exists() else (CACHE_BASE_DIR / f"{subj_key}_{lang}")
    cache_dir.mkdir(parents=True, exist_ok=True)
    
    prompt = PROMPTS.get(subj_key, PROMPTS["chemistry"])
    
    print(f"\n=======================================================")
    print(f" SheraTutor Batch Ingestion: {subject.upper()} ({lang.upper()})")
    print(f" PDF: {pdf_path}")
    print(f" Range: Pages {start_page}..{end_page} ({end_page - start_page + 1} pages)")
    print(f" Vision Model: {NIM_MODEL} via NVIDIA NIM (Timeout: 75s)")
    print(f" Embedder: local Ollama {OLLAMA_EMBED_MODEL} (1024-dim)")
    print(f" Cache Directory: {cache_dir}")
    print(f" Persist to Supabase: {persist_db}")
    print(f"=======================================================\n", flush=True)
    
    # 1. Supabase setup if persisting
    supabase = None
    curriculum_version_id = None
    chapter_map = {} # chapter_no -> chapter_id
    existing_pages = set()
    global_chunk_idx = 0
    
    if persist_db:
        sb_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
        sb_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        if not sb_url or not sb_key:
            raise ValueError("Supabase credentials missing for --persist-db")
            
        sb_headers = {
            "apikey": sb_key,
            "Authorization": f"Bearer {sb_key}",
            "Content-Type": "application/json"
        }
        
        subj_code = SUBJECT_CODE_MAP[subj_key]
        r_s = requests.get(f"{sb_url}/rest/v1/subjects?code=eq.{subj_code}&select=id", headers=sb_headers)
        s_data = r_s.json()
        if not s_data:
            raise ValueError(f"Subject {subj_code} not found in Supabase")
        subject_id = s_data[0]["id"]
        
        r_v = requests.get(f"{sb_url}/rest/v1/curriculum_versions?subject_id=eq.{subject_id}&language_tag=eq.{lang}&select=id", headers=sb_headers)
        v_data = r_v.json()
        if not v_data:
            raise ValueError(f"Curriculum version for {subj_code} ({lang}) not found")
        curriculum_version_id = v_data[0]["id"]
        
        r_c = requests.get(f"{sb_url}/rest/v1/chapters?subject_id=eq.{subject_id}&select=id,chapter_no", headers=sb_headers)
        chapter_map = {row["chapter_no"]: row["id"] for row in r_c.json()}
        
        # Check existing pages in DB
        r_ex = requests.get(f"{sb_url}/rest/v1/curriculum_chunks?curriculum_version_id=eq.{curriculum_version_id}&select=source_book_page_ref,chunk_index", headers=sb_headers)
        for row in r_ex.json() or []:
            try:
                existing_pages.add(int(row["source_book_page_ref"]))
            except (ValueError, TypeError):
                pass
            if row.get("chunk_index") is not None and row["chunk_index"] > global_chunk_idx:
                global_chunk_idx = row["chunk_index"] + 1
        print(f"Found {len(existing_pages)} already persisted pages in Supabase for {subject.upper()} ({lang.upper()}).", flush=True)

    results = []
    current_chapter_no = 1
    
    for p_num in range(start_page, end_page + 1):
        if persist_db and p_num in existing_pages:
            print(f"  [Page {p_num:03d}] Already in Supabase. Skipping.", flush=True)
            continue
            
        verified_file = verified_cache_dir / f"page_{p_num:04d}.json"
        cache_file = cache_dir / f"page_{p_num:04d}.json"
        
        # 1. Check verified cache first, then standard cache
        if verified_file.exists():
            print(f"  [Page {p_num:03d}] Loading from VERIFIED ground-truth cache ({verified_file.name})...", flush=True)
            page_data = json.loads(verified_file.read_text(encoding="utf-8"))
            markdown_text = page_data["markdown"]
            elapsed_s = page_data.get("extraction_time_s", 0.0)
        elif cache_file.exists():
            print(f"  [Page {p_num:03d}] Loading from disk cache...", flush=True)
            page_data = json.loads(cache_file.read_text(encoding="utf-8"))
            markdown_text = page_data["markdown"]
            elapsed_s = page_data.get("extraction_time_s", 0.0)
        else:
            # 2. Render & extract via NIM
            t0 = time.time()
            print(f"  [Page {p_num:03d}] Rendering JPEG...", end="", flush=True)
            jpg_file = render_page_jpeg(pdf_path, p_num)
            print(f" Calling NIM...", end="", flush=True)
            
            markdown_text = extract_with_nim(jpg_file, prompt, timeout=75)
            elapsed_s = round(time.time() - t0, 2)
            print(f" Done in {elapsed_s}s ({len(markdown_text)} chars)", flush=True)
            
            # Save cache
            page_data = {
                "page_no": p_num,
                "subject": subj_key,
                "lang": lang,
                "markdown": markdown_text,
                "char_count": len(markdown_text),
                "extraction_time_s": elapsed_s,
                "timestamp": time.time()
            }
            cache_file.write_text(json.dumps(page_data, ensure_ascii=False, indent=2), encoding="utf-8")
            
            if jpg_file.exists():
                jpg_file.unlink()
                
            time.sleep(delay_s)
            
        # Detect chapter
        current_chapter_no = detect_chapter_number(markdown_text, fallback_chapter=current_chapter_no)
        
        # 3. Chunking
        chunks = chunk_markdown(markdown_text)
        print(f"    -> Chapter {current_chapter_no} | Chunked into {len(chunks)} blocks: ", end="", flush=True)
        type_counts = {}
        for c in chunks:
            t = c["chunk_type"]
            type_counts[t] = type_counts.get(t, 0) + 1
        print(", ".join(f"{k}: {v}" for k, v in type_counts.items()), flush=True)
        
        # 4. Generate local BGE-M3 embeddings
        print(f"    -> Generating 1024-dim BGE-M3 embeddings...", end="", flush=True)
        t_emb0 = time.time()
        for c in chunks:
            c["embedding"] = get_bge_m3_embedding(c["content"])
        emb_elapsed = round(time.time() - t_emb0, 2)
        print(f" Done in {emb_elapsed}s", flush=True)
        
        # 5. Persist to Supabase if requested
        if persist_db:
            print(f"    -> Writing {len(chunks)} chunks to Supabase...", end="", flush=True)
            chapter_id = chapter_map.get(current_chapter_no)
            if not chapter_id and chapter_map:
                chapter_id = list(chapter_map.values())[0]
                
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
                
            # Resolve parent_chunk_id for subquestions
            for c_idx, c in enumerate(chunks):
                p_idx = c.get("parent_chunk_index")
                if p_idx is not None and p_idx < len(db_chunk_ids):
                    chunk_records[c_idx]["parent_chunk_id"] = db_chunk_ids[p_idx]
                    
            # Insert chunks via PostgREST
            r_ins_c = requests.post(f"{sb_url}/rest/v1/curriculum_chunks", headers=sb_headers, json=chunk_records)
            if r_ins_c.status_code not in (200, 201):
                raise RuntimeError(f"Failed to insert curriculum_chunks: {r_ins_c.text}")
            
            # Insert embeddings via PostgREST
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
                raise RuntimeError(f"Failed to insert chunk_embeddings: {r_ins_e.text}")
            print(f" Persisted successfully!", flush=True)
            
        results.append({
            "page_no": p_num,
            "chapter_no": current_chapter_no,
            "markdown": markdown_text,
            "chunks": chunks
        })
        
    print(f"\nBatch processing complete! Successfully processed {len(results)} pages.")
    return results

def main():
    parser = argparse.ArgumentParser(description="NVIDIA NIM Batch Ingestion Runner")
    parser.add_argument("--subject", choices=["chemistry", "mathematics", "math", "english"], default="chemistry")
    parser.add_argument("--lang", choices=["bn", "en"], default="bn")
    parser.add_argument("--start-page", type=int, default=15)
    parser.add_argument("--end-page", type=int, default=16)
    parser.add_argument("--pdf", help="Optional override path to PDF")
    parser.add_argument("--delay", type=float, default=2.0, help="Polite delay between pages in seconds")
    parser.add_argument("--persist-db", action="store_true", help="Persist chunks and embeddings to Supabase")
    args = parser.parse_args()
    
    process_subject_batch(
        subject=args.subject,
        lang=args.lang,
        start_page=args.start_page,
        end_page=args.end_page,
        pdf_path=args.pdf,
        delay_s=args.delay,
        persist_db=args.persist_db
    )

if __name__ == "__main__":
    main()
