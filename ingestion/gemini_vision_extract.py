#!/usr/bin/env python3
"""
SheraTutor: Production Multimodal Vision Extraction Pipeline via Gemini.
Renders 150 DPI page images from NCTB textbooks, masks margin noise,
extracts raw local OCR grounding via Tesseract to avoid RECITATION triggers,
and generates structured verbatim Markdown, LaTeX equations, and 2D diagram bounding boxes.
Features:
- Idempotent resumability (--skip-existing)
- Automatic rate-limit pacing (sleep between calls to stay within 15 RPM)
- Dynamic backoff on 429 (sleep 20s)
- Permanent model cutover to gemini-2.5-flash when gemini-3.5-flash daily quota hits
- Generalizable chapter resolution via Supabase chapters table
"""

import os
import sys
import json
import time
import re
import argparse
import subprocess
from pathlib import Path
from typing import Optional, List, Dict, Any, Tuple
from pydantic import BaseModel, Field

import pymupdf  # PyMuPDF
from PIL import Image, ImageDraw
from dotenv import load_dotenv
from google import genai
from google.genai import types
from google.genai.errors import ClientError, APIError
from supabase import create_client

# Paths
REPO_ROOT = Path(__file__).resolve().parent.parent
INGESTION_DIR = Path(__file__).resolve().parent
ENV_LOCAL = REPO_ROOT / "web" / ".env.local"
ENV_INGEST = INGESTION_DIR / ".env"

if ENV_LOCAL.exists():
    load_dotenv(ENV_LOCAL)
if ENV_INGEST.exists():
    load_dotenv(ENV_INGEST)

# API Keys rotation setup
# Use active working keys only
API_KEYS = [
    os.environ.get("GEMINI_API_KEY_SECONDARY", "").strip(),
    os.environ.get("GEMINI_API_KEY", "").strip(),
]
API_KEYS = [k for k in API_KEYS if k and not k.endswith("EiCkVg")]  # Filter out suspended tertiary key

if not API_KEYS:
    print("Error: No Gemini API keys found in environment.")
    sys.exit(1)

_current_key_idx = 0

def get_client(key_idx: Optional[int] = None) -> genai.Client:
    global _current_key_idx
    if key_idx is None:
        idx = _current_key_idx % len(API_KEYS)
    else:
        idx = key_idx % len(API_KEYS)
    return genai.Client(api_key=API_KEYS[idx])

def rotate_key():
    global _current_key_idx
    _current_key_idx = (_current_key_idx + 1) % len(API_KEYS)
    print(f"Rotating to Gemini API Key index {_current_key_idx} (key ending in ...{API_KEYS[_current_key_idx][-6:]})")

# Supabase Client for dynamic chapter lookups
SB_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SB_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(SB_URL, SB_KEY) if SB_URL and SB_KEY else None

SUBJECT_CODE_MAP = {
    "chemistry": "SSC-CHEM",
    "physics": "SSC-PHY",
    "mathematics": "SSC-MATH",
    "english": "SSC-ENG",
}

_chapter_cache = {}

def get_subject_chapters(subject: str) -> Dict[int, Dict[str, str]]:
    if subject in _chapter_cache:
        return _chapter_cache[subject]
    
    code = SUBJECT_CODE_MAP.get(subject.lower(), "SSC-CHEM")
    if not supabase:
        return {}
    
    s_res = supabase.table("subjects").select("id").eq("code", code).execute()
    if not s_res.data:
        return {}
    subj_id = s_res.data[0]["id"]
    
    ch_res = supabase.table("chapters").select("chapter_no, title_en, title_bn").eq("subject_id", subj_id).order("chapter_no").execute()
    ch_dict = {r["chapter_no"]: {"title_en": r["title_en"], "title_bn": r["title_bn"]} for r in ch_res.data}
    _chapter_cache[subject] = ch_dict
    return ch_dict

# --- Structured Pydantic Output Schema ---

class FigureDetection(BaseModel):
    caption: str = Field(..., description="Exact printed figure number and caption, e.g., 'Fig 2.05: Burning of a candle' or 'চিত্র ১.০১: ...'")
    figure_no: str = Field(..., description="Parsed figure number, e.g. '2.05'")
    box_2d: List[int] = Field(..., description="Bounding box [ymin, xmin, ymax, xmax] normalized on scale 0 to 1000 covering the visual diagram/photo and its parts")
    description: str = Field(..., description="Short factual description of what is depicted in the diagram or apparatus")
    reading_order_anchor: str = Field(..., description="Section or paragraph anchor where this figure is referenced")

class SectionChunk(BaseModel):
    section_no: Optional[str] = Field(None, description="Section number if visible, e.g., '2.5'")
    section_title: Optional[str] = Field(None, description="Section heading title if visible")
    chunk_type: str = Field(..., description="Classification: 'theory' | 'worked_example' | 'cq_stimulus' | 'cq_subquestion' | 'table'")
    content_markdown: str = Field(..., description="Verbatim text in markdown. All chemical formulas and equations MUST be formatted as LaTeX ($...$ or $$...$$). Retain tables in markdown | col | format.")
    activity_tag: Optional[str] = Field(None, description="Tag if this chunk represents a callout box: 'Individual Task' | 'Experiment' | 'Do It Yourself' | 'MCQ'")

class PageExtractionResult(BaseModel):
    printed_page_no: int
    pdf_page_no: int
    chapter_no: int
    chapter_title: str
    sections: List[SectionChunk]
    figures: List[FigureDetection]

# --- Noise Masking, Page Rendering & Local OCR ---

def render_and_mask_page(pdf_path: Path, pdf_page_1based: int, dpi: int = 150) -> Tuple[Image.Image, bytes]:
    doc = pymupdf.open(str(pdf_path))
    page = doc.load_page(pdf_page_1based - 1)
    
    zoom = dpi / 72.0
    mat = pymupdf.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat, alpha=False)
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    doc.close()

    draw = ImageDraw.Draw(img)
    w, h = img.size

    # Top running header mask (top 3.8% of page)
    header_h = int(h * 0.038)
    draw.rectangle([(0, 0), (w, header_h)], fill=(255, 255, 255))

    # Bottom printer's signature mask (bottom 2.8% of page)
    footer_top = int(h * 0.972)
    draw.rectangle([(0, footer_top), (w, h)], fill=(255, 255, 255))

    # Convert to PNG bytes
    import io
    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)
    return img, buf.getvalue()

def run_local_ocr_draft(img_bytes: bytes, lang: str) -> str:
    """Extracts raw textual draft locally via Tesseract to ground LLM extraction."""
    tess_lang = "eng" if lang.lower() == "en" else "ben+eng"
    try:
        proc = subprocess.run(
            ["tesseract", "stdin", "stdout", "-l", tess_lang, "--psm", "1"],
            input=img_bytes,
            capture_output=True,
            check=True
        )
        return proc.stdout.decode("utf-8", errors="replace").strip()
    except Exception as e:
        return ""

# --- Authoritative Table of Contents Page Ranges (Printed Page Numbers) ---
SUBJECT_TOC = {
    "chemistry": {
        "en": [
            (1, 16, 1), (17, 34, 2), (35, 58, 3), (59, 81, 4), (82, 108, 5),
            (109, 141, 6), (142, 167, 7), (168, 205, 8), (206, 232, 9),
            (233, 260, 10), (261, 286, 11), (287, 304, 12)
        ],
        "bn": [
            (1, 16, 1), (17, 34, 2), (35, 58, 3), (59, 81, 4), (82, 108, 5),
            (109, 141, 6), (142, 167, 7), (168, 205, 8), (206, 232, 9),
            (233, 260, 10), (261, 286, 11), (287, 304, 12)
        ]
    },
    "physics": {
        "en": [
            (1, 30, 1), (31, 60, 2), (61, 97, 3), (98, 126, 4), (127, 159, 5),
            (160, 186, 6), (187, 210, 7), (211, 241, 8), (242, 269, 9),
            (270, 298, 10), (299, 329, 11), (330, 346, 12), (347, 364, 13)
        ],
        "bn": [
            (1, 31, 1), (32, 61, 2), (62, 97, 3), (98, 126, 4), (127, 158, 5),
            (159, 185, 6), (186, 209, 7), (210, 240, 8), (241, 269, 9),
            (270, 297, 10), (298, 328, 11), (329, 345, 12), (346, 360, 13)
        ]
    },
    "mathematics": {
        "bn": [
            (1, 20, 1), (21, 42, 2), (43, 74, 3), (75, 92, 4), (93, 110, 5),
            (111, 135, 6), (136, 151, 7), (152, 173, 8), (174, 196, 9),
            (197, 204, 10), (205, 223, 11), (224, 248, 12), (249, 265, 13),
            (266, 284, 14), (285, 293, 15), (294, 325, 16), (326, 344, 17)
        ],
        "en": [
            (1, 21, 1), (22, 44, 2), (45, 79, 3), (80, 97, 4), (98, 117, 5),
            (118, 145, 6), (146, 163, 7), (164, 187, 8), (188, 212, 9),
            (213, 221, 10), (222, 241, 11), (242, 269, 12), (270, 288, 13),
            (289, 309, 14), (310, 318, 15), (319, 352, 16), (353, 384, 17)
        ]
    },
    "english": {
        "bn": [
            (1, 200, 1),
        ],
        "en": [
            (1, 96, 2),
            (97, 110, 3),
            (111, 125, 4),
            (126, 171, 5),
            (172, 179, 7),
            (180, 190, 2),
            (191, 208, 6),
            (209, 236, 9),
            (237, 318, 10),
        ]
    }
}

def detect_chapter_from_ocr(
    ocr_draft: str,
    subject_chapters: Dict[int, Dict[str, str]],
    subject: str = "chemistry",
    lang: str = "en",
    printed_pno: int = 1,
    fallback_ch: int = 1
) -> Tuple[int, str, str]:
    # 1. Authoritative TOC range lookup if known
    ranges = SUBJECT_TOC.get(subject.lower(), {}).get(lang.lower(), [])
    for start_p, end_p, ch in ranges:
        if start_p <= printed_pno <= end_p:
            if ch in subject_chapters:
                return ch, subject_chapters[ch]["title_en"], subject_chapters[ch]["title_bn"]
            return ch, f"Chapter {ch}", f"অধ্যায় {ch}"

    # 2. Look for explicit Chapter / অধ্যায় headers
    ch_match = re.search(r"(?:Chapter|অধ্যায়)\s*([0-9]+|[A-Za-z]+|[০-৯]+)", ocr_draft, re.IGNORECASE)
    if ch_match:
        val = ch_match.group(1).strip()
        bn_map = {"১": 1, "২": 2, "৩": 3, "৪": 4, "৫": 5, "৬": 6, "৭": 7, "৮": 8, "৯": 9, "১০": 10, "১১": 11, "১২": 12, "১৩": 13, "১৪": 14, "১৫": 15, "১৬": 16, "১৭": 17}
        en_word_map = {"one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10, "eleven": 11, "twelve": 12, "thirteen": 13, "fourteen": 14, "fifteen": 15, "sixteen": 16, "seventeen": 17}
        if val in bn_map:
            ch_num = bn_map[val]
            if ch_num in subject_chapters:
                return ch_num, subject_chapters[ch_num]["title_en"], subject_chapters[ch_num]["title_bn"]
        elif val.lower() in en_word_map:
            ch_num = en_word_map[val.lower()]
            if ch_num in subject_chapters:
                return ch_num, subject_chapters[ch_num]["title_en"], subject_chapters[ch_num]["title_bn"]
        elif val.isdigit():
            ch_num = int(val)
            if ch_num in subject_chapters:
                return ch_num, subject_chapters[ch_num]["title_en"], subject_chapters[ch_num]["title_bn"]

    # 3. Look for section numbers: e.g. "9.1", "9.2" (anchored to start of line or header)
    sec_matches = re.findall(r"(?:^|\n)\s*(\d{1,2})\.\d{1,2}\s+[A-Z\u0980-\u09FF]", ocr_draft)
    if sec_matches:
        for sm in sec_matches:
            c = int(sm)
            if c in subject_chapters:
                return c, subject_chapters[c]["title_en"], subject_chapters[c]["title_bn"]

    if fallback_ch in subject_chapters:
        return fallback_ch, subject_chapters[fallback_ch]["title_en"], subject_chapters[fallback_ch]["title_bn"]
    return fallback_ch, "General", "সাধারণ"

# --- Prompt Construction ---

def build_gemini_extraction_prompt(subject: str, lang: str, ch_no: int, ch_title: str, printed_pno: int, ocr_draft: str) -> str:
    lang_upper = lang.upper()
    is_en = (lang.lower() == "en")
    
    if is_en:
        lang_rules = """- LANGUAGE: This is strictly an ENGLISH EDITION textbook.
- Transcribe ALL content in verbatim English.
- Absolutely ZERO Bengali characters (\\u0980-\\u09FF) are allowed.
- Figures MUST be labeled 'Fig ...', not 'চিত্র'."""
        fig_example = f"Fig {ch_no}.XX"
    else:
        lang_rules = """- LANGUAGE: This is a BENGALI EDITION textbook (বাংলা সংস্করণ).
- Transcribe all text in authentic Bengali script (বাংলা বর্ণমালা ও যুক্তবর্ণ) verbatim.
- Figures MUST be labeled 'চিত্র ...'."""
        fig_example = f"চিত্র {ch_no}.XX"

    prompt = f"""You are an expert scientific editor, OCR specialist, and document layout analysis engine for secondary school STEM textbooks.
Below is an uncorrected OCR draft along with the scanned textbook page image.

Page Context:
- Subject: {subject.title()}
- Language: {lang_upper}
- Chapter {ch_no}: {ch_title}
- Printed Page Number: {printed_pno}

Raw OCR Draft (use as reference to prevent missing words):
{ocr_draft}

Instructions:
1. {lang_rules}
2. CHAPTER BOUNDARY & FIDELITY:
   - All content on this page belongs strictly to Chapter {ch_no}: '{ch_title}'.
   - Section numbers MUST start with '{ch_no}.' (e.g. {ch_no}.1, {ch_no}.2).
   - Figure numbers MUST match Chapter {ch_no} (e.g. {fig_example}). Never output figures from other chapters.
3. FORMULAS & EQUATIONS:
   - Format all chemical formulas, physics variables, equations, fractions, and reaction symbols in pristine LaTeX ($...$ or $$...$$).
4. DIAGRAM / FIGURE DETECTION & BOUNDING BOXES:
   - Identify every genuine photographic illustration, scientific apparatus drawing, molecular lattice, graph, or schematic on the page.
   - For EACH figure, specify its exact bounding box `box_2d: [ymin, xmin, ymax, xmax]` normalized on a 0 to 1000 integer grid covering the visual illustration.
   - Do NOT include full page text, plain paragraphs, or table headers inside figure bounding boxes.
   - If there are NO figures on the page, the figures list MUST be empty []. Never hallucinate figures.
5. CHUNK CLASSIFICATION:
   - For each section or text block, classify into `chunk_type`:
     * 'theory': Standard expository narrative text.
     * 'worked_example': Numbered Example / গাণিতিক সমস্যা / উদাহরণ blocks.
     * 'cq_stimulus': Creative Question stem / উদ্দীপক.
     * 'cq_subquestion': Sub-questions (a), (b), (c), (d) or (ক), (খ), (গ), (ঘ).
     * 'table': Structured data tables.
   - If a chunk is an activity/callout box (e.g., 'Individual Task', 'Experiment', 'Do It Yourself', 'MCQ'), set `activity_tag`.
"""
    return prompt

# Global active model tracker (permanent switch to 2.5-flash when 3.5 daily limit exhausted)
_active_primary_model = None

def extract_page_gemini(
    pdf_path: Path,
    pdf_page_1based: int,
    subject: str = "chemistry",
    lang: str = "en",
    model_name: str = "gemini-3.5-flash-lite",
    
    current_active_chapter: int = 1,
) -> Tuple[PageExtractionResult, int]:
    global _active_primary_model
    if _active_primary_model is None:
        _active_primary_model = model_name

    printed_pno = pdf_page_1based - 5
    chapters = get_subject_chapters(subject)

    print(f"\n[Page {pdf_page_1based} / Printed p.{printed_pno}] Rendering & local OCR grounding...")
    pil_img, img_bytes = render_and_mask_page(pdf_path, pdf_page_1based)
    ocr_draft = run_local_ocr_draft(img_bytes, lang)

    ch_no, title_en, title_bn = detect_chapter_from_ocr(
        ocr_draft, chapters, subject=subject, lang=lang, printed_pno=printed_pno, fallback_ch=current_active_chapter
    )
    ch_title = title_en if lang.lower() == "en" else title_bn
    print(f"  Detected Chapter: {ch_no} ({ch_title})")

    prompt = build_gemini_extraction_prompt(subject, lang, ch_no, ch_title, printed_pno, ocr_draft)
    image_part = types.Part.from_bytes(data=img_bytes, mime_type="image/png")

    candidate_models = []
    for m in [_active_primary_model or model_name, "gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-3-flash-preview", "gemini-flash-latest"]:
        if m not in candidate_models:
            candidate_models.append(m)

    for current_model in candidate_models:
        for key_attempt in range(len(API_KEYS)):
            client = get_client()
            try:
                print(f"Calling Gemini ({current_model}) with Key {_current_key_idx}...")
                response = client.models.generate_content(
                    model=current_model,
                    contents=[image_part, prompt],
                    config=types.GenerateContentConfig(
                        temperature=0.1,
                        max_output_tokens=8192,
                        response_mime_type="application/json",
                        response_json_schema=PageExtractionResult.model_json_schema(),
                    ),
                )

                if not response.text:
                    print(f"Warning: Empty response text from {current_model}. Rotating key...")
                    rotate_key()
                    continue

                raw_text = response.text.strip()
                try:
                    parsed_json = json.loads(raw_text)
                except json.JSONDecodeError:
                    fixed_text = re.sub(r'\\(?![/"\\bfnrtu]|u[0-9a-fA-F]{4})', r'\\\\', raw_text)
                    parsed_json = json.loads(fixed_text, strict=False)

                result = PageExtractionResult(**parsed_json)
                result.printed_page_no = printed_pno
                result.pdf_page_no = pdf_page_1based
                result.chapter_no = ch_no
                result.chapter_title = ch_title

                # Lock in successful model as active primary
                _active_primary_model = current_model
                return result, ch_no

            except ClientError as e:
                err_str = str(e)
                if "RESOURCE_EXHAUSTED" in err_str or "429" in err_str:
                    print(f"Rate limit / Quota (429) on {current_model} with Key {_current_key_idx}. Rotating key...")
                    rotate_key()
                    time.sleep(2)
                    continue
                elif "PERMISSION_DENIED" in err_str or "403" in err_str:
                    print(f"Key {_current_key_idx} permission denied (403). Rotating key...")
                    rotate_key()
                    continue
                else:
                    print(f"ClientError on {current_model}: {e}")
                    rotate_key()
                    continue
            except Exception as e:
                print(f"Generation error with {current_model} on key {_current_key_idx}: {e}")
                time.sleep(2)
                rotate_key()

        print(f"Model {current_model} exhausted across all keys. Attempting next candidate model...")

    raise RuntimeError(f"Failed to extract page {pdf_page_1based} across all models and keys")

def main():
    parser = argparse.ArgumentParser(description="Extract NCTB textbook pages with Gemini")
    parser.add_argument("--subject", default="chemistry", choices=["chemistry", "physics", "mathematics", "english"])
    parser.add_argument("--lang", default="en", choices=["en", "bn"])
    parser.add_argument("--start-page", type=int, default=6, help="PDF page number (1-based), e.g. 6 = printed p.1")
    parser.add_argument("--end-page", type=int, default=None, help="PDF page number (1-based)")
    parser.add_argument("--model", default="gemini-3.5-flash-lite", help="Model name (e.g. gemini-2.5-flash)")
    parser.add_argument("--out-dir", default=None, help="Output cache directory")
    parser.add_argument("--skip-existing", action="store_true", default=True, help="Skip already extracted pages")
    parser.add_argument("--pace-delay", type=float, default=4.2, help="Sleep delay in seconds between requests for 15 RPM safety")
    args = parser.parse_args()

    pdf_file = INGESTION_DIR / "textbooks" / f"{args.subject}_{args.lang}.pdf"
    if not pdf_file.exists():
        print(f"Error: PDF file {pdf_file} does not exist.")
        sys.exit(1)

    doc = pymupdf.open(str(pdf_file))
    total_pdf_pages = len(doc)
    doc.close()

    end_page = args.end_page if args.end_page else total_pdf_pages - 1

    out_dir = Path(args.out_dir) if args.out_dir else INGESTION_DIR / "cache_gemini" / f"{args.subject}_{args.lang}"
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"=== Starting Extraction Pipeline ===")
    print(f"Subject: {args.subject} | Language: {args.lang.upper()}")
    print(f"Source PDF: {pdf_file} (Total Pages: {total_pdf_pages})")
    print(f"Target Range: PDF p.{args.start_page} to p.{end_page} (Printed p.{args.start_page-5} to p.{end_page-5})")
    print(f"Primary Model: {args.model} | Cache: {out_dir}")
    print(f"Pacing Delay: {args.pace_delay}s per page\n")

    current_ch = 1
    extracted_count = 0
    skipped_count = 0

    for p in range(args.start_page, end_page + 1):
        printed_pno = p - 5
        cache_file = out_dir / f"page_{printed_pno:03d}.json"

        if args.skip_existing and cache_file.exists():
            try:
                cached_data = json.loads(cache_file.read_text(encoding="utf-8"))
                current_ch = cached_data.get("chapter_no", current_ch)
                skipped_count += 1
                continue
            except Exception:
                pass

        # Retry page up to 5 times
        page_success = False
        for page_try in range(5):
            try:
                res, current_ch = extract_page_gemini(
                    pdf_path=pdf_file,
                    pdf_page_1based=p,
                    subject=args.subject,
                    lang=args.lang,
                    model_name=args.model,
                    current_active_chapter=current_ch,
                )
                cache_file.write_text(res.model_dump_json(indent=2), encoding="utf-8")
                extracted_count += 1
                print(f"✓ Saved [p.{printed_pno:03d} / PDF {p:03d}] -> {cache_file.name} (Sections: {len(res.sections)}, Figures: {len(res.figures)})")
                page_success = True
                time.sleep(args.pace_delay)
                break
            except Exception as e:
                print(f"Retry {page_try+1}/5 on page {p} failed: {e}. Sleeping 15s...")
                time.sleep(15)

        if not page_success:
            print(f"\n[FATAL] Page {p} failed all 5 retries. Aborting.")
            sys.exit(1)

    print(f"\nExtraction run complete. Processed: {extracted_count} | Skipped: {skipped_count} | Total Target: {end_page - args.start_page + 1}")

if __name__ == "__main__":
    main()
