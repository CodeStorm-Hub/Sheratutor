#!/usr/bin/env python3
"""
SheraTutor: Dedicated Extraction & Conversion Pipeline for NCTB Class 9-10 Higher Mathematics (উচ্চতর গণিত).
Converts PDF textbook pages into Option A JSONL format with structured sections, clean LaTeX, and chapter boundaries.

Features:
- Idempotent caching in ingestion/cache_gemini/higher_mathematics_bn/page_XXX.json
- Direct append / export to ingestion/higher_math_class_9_10.jsonl
- API key rotation with backoff across Gemini keys
- Pydantic structured schema matching General Math
- KaTeX equation sanitization ($...$ and $$...$$)
"""

import os
import sys
import json
import time
import re
import argparse
from pathlib import Path
from typing import Optional, List, Dict, Any, Tuple
from pydantic import BaseModel, Field

import pymupdf
from dotenv import load_dotenv
from google import genai
from google.genai import types
from google.genai.errors import ClientError, APIError

REPO_ROOT = Path(__file__).resolve().parent.parent
INGESTION_DIR = Path(__file__).resolve().parent
ENV_INGEST = INGESTION_DIR / ".env"

if ENV_INGEST.exists():
    load_dotenv(ENV_INGEST)

PDF_PATH = INGESTION_DIR / "textbooks" / "Secondary (BV)-2026_Class 9-10_Higher Math_compressed.pdf"
CACHE_DIR = INGESTION_DIR / "cache_gemini" / "higher_mathematics_bn"
DEFAULT_JSONL_PATH = INGESTION_DIR / "higher_math_class_9_10.jsonl"

CACHE_DIR.mkdir(parents=True, exist_ok=True)

# Collect Gemini API keys
API_KEYS = []
for k in ["GEMINI_API_KEY", "GEMINI_API_KEY_SECONDARY", "GEMINI_API_KEY_TERTIARY", "GEMINI_API_KEY_QUAT", "GEMINI_API_KEY_QUIN"]:
    val = os.environ.get(k, "").strip()
    if val and val not in API_KEYS and not val.startswith("your-"):
        API_KEYS.append(val)

if not API_KEYS:
    print("Error: No Gemini API keys found in environment.")
    sys.exit(1)

_current_key_idx = 0

def get_client() -> genai.Client:
    global _current_key_idx
    key = API_KEYS[_current_key_idx % len(API_KEYS)]
    return genai.Client(api_key=key)

def rotate_key():
    global _current_key_idx
    _current_key_idx = (_current_key_idx + 1) % len(API_KEYS)
    print(f"  [KEY ROTATION] Switched to key ending in ...{API_KEYS[_current_key_idx][-6:]}")

# Authoritative Chapter Map and Page Ranges from NCTB 2026 Higher Math TOC
CHAPTER_INFO: Dict[int, Dict[str, Any]] = {
    1: {"title_bn": "সেট ও ফাংশন", "title_en": "Sets and Functions", "start_page": 1, "end_page": 37},
    2: {"title_bn": "বীজগাণিতিক রাশি", "title_en": "Algebraic Expressions", "start_page": 38, "end_page": 62},
    3: {"title_bn": "জ্যামিতি", "title_en": "Geometry", "start_page": 63, "end_page": 81},
    4: {"title_bn": "জ্যামিতিক অঙ্কন", "title_en": "Geometric Constructions", "start_page": 82, "end_page": 95},
    5: {"title_bn": "সমীকরণ", "title_en": "Equations", "start_page": 96, "end_page": 122},
    6: {"title_bn": "অসমতা", "title_en": "Inequalities", "start_page": 123, "end_page": 135},
    7: {"title_bn": "অসীম ধারা", "title_en": "Infinite Series", "start_page": 136, "end_page": 185},
    8: {"title_bn": "ত্রিকোণমিতি", "title_en": "Trigonometry", "start_page": 186, "end_page": 192},
    9: {"title_bn": "সূচকীয় ও লগারিদমীয় ফাংশন", "title_en": "Exponential and Logarithmic Functions", "start_page": 193, "end_page": 222},
    10: {"title_bn": "দ্বিপদী বিস্তৃতি", "title_en": "Binomial Expansion", "start_page": 223, "end_page": 238},
    11: {"title_bn": "স্থানাঙ্ক জ্যামিতি", "title_en": "Coordinate Geometry", "start_page": 239, "end_page": 270},
    12: {"title_bn": "সমতলীয় ভেক্টর", "title_en": "Planar Vectors", "start_page": 271, "end_page": 286},
    13: {"title_bn": "ঘন জ্যামিতি", "title_en": "Solid Geometry", "start_page": 287, "end_page": 305},
    14: {"title_bn": "সম্ভাবনা", "title_en": "Probability", "start_page": 306, "end_page": 327},
}

def get_chapter_for_printed_page(pno: int) -> Tuple[int, str]:
    for ch_no, info in CHAPTER_INFO.items():
        if info["start_page"] <= pno <= info["end_page"]:
            return ch_no, info["title_bn"]
    if pno > 327:
        return 14, "পরিশিষ্ট ও গণিতবিদ"
    return 1, "সেট ও ফাংশন"

# Pydantic Schemas matching General Math
class SectionChunk(BaseModel):
    section_no: Optional[str] = Field(None, description="e.g. '১.১', '১.২', or null")
    section_title: Optional[str] = Field(None, description="Section sub-heading or null")
    chunk_type: str = Field(..., description="One of: 'theory', 'worked_example', 'cq_stimulus', 'cq_subquestion', 'table'")
    content_markdown: str = Field(..., description="Verbatim Bengali text with math enclosed in LaTeX ($...$ inline or $$...$$ display)")
    activity_tag: Optional[str] = Field(None, description="Tag like 'কাজ', 'উদাহরণ', 'অনুশীলনী', 'সৃজনশীল প্রশ্ন' or null")

class FigureBox(BaseModel):
    figure_id: str = Field(..., description="Unique ID e.g. 'fig_1_1'")
    caption: Optional[str] = Field(None, description="Figure caption if provided")
    box_2d: List[int] = Field(..., description="[ymin, xmin, ymax, xmax] normalized on 0-1000 scale")

class PageExtractionResult(BaseModel):
    printed_page_no: int = Field(..., description="Printed textbook page number")
    pdf_page_no: int = Field(..., description="1-based PDF page number")
    chapter_no: int = Field(..., description="Chapter integer (1-14)")
    chapter_title: str = Field(..., description="Chapter title in Bengali")
    sections: List[SectionChunk] = Field(..., description="Semantic text and formula sections on this page")
    figures: List[FigureBox] = Field(default_factory=list, description="Any geometric diagrams or figures")

def render_page_image(doc: pymupdf.Document, pdf_page_1based: int) -> bytes:
    """Renders page at 150 DPI and returns PNG bytes."""
    page = doc[pdf_page_1based - 1]
    pix = page.get_pixmap(dpi=150)
    return pix.tobytes("png")

def extract_page_with_gemini(img_bytes: bytes, printed_pno: int, pdf_pno: int, ch_no: int, ch_title: str) -> PageExtractionResult:
    prompt = f"""You are an expert NCTB Secondary Higher Mathematics (এসএসসি উচ্চতর গণিত) textbook digitizer.
Your task is to transcribe this textbook page into clean structured Markdown and LaTeX matching the exact NCTB curriculum standards.

METADATA:
- Subject: Higher Mathematics (উচ্চতর গণিত, Class 9-10)
- Chapter {ch_no}: {ch_title}
- Printed Page Number: {printed_pno}
- PDF Page Number: {pdf_pno}

MANDATORY RULES:
1. STRICT LATEX EQUATIONS:
   - Enclose ALL algebraic expressions, set notations, vector arrows, coordinates, exponents, and formulas in standard LaTeX:
     - Inline: $x \\in A$, $\\vec{{u}} + \\vec{{v}}$, $\\binom{{n}}{{r}}$, $\\frac{{a}}{{b}}$, $\\sqrt{{x^2 + y^2}}$, $\\sin\\theta$, $\\log_a x$
     - Block/Display math: $$...$$ for standalone formulas and multi-step derivations.
   - For set notation, use escaped braces: $\\{{x \\in \\mathbb{{R}} : x > 0\\}}$.
   - For vectors, preserve arrow or bar notation: $\\vec{{AB}}$ or $\\mathbf{{u}}$.
   - NEVER place Bengali words inside math dollar signs.
2. VERBATIM BENGALI ACCURACY:
   - Transcribe all text in proper Bengali Unicode without spelling changes or missing words.
   - Preserve exercise numbering (e.g., 'অনুশীলনী ১.১', 'উদাহরণ ১', 'প্রশ্ন ৫').
3. CHUNK CLASSIFICATION:
   - 'theory': Explanatory narrative, definitions, theorems (সাধারণ নির্বচন, বিশেষ নির্বচন, প্রমাণ).
   - 'worked_example': Solved examples ('উদাহরণ ১', 'সমাধান:').
   - 'cq_stimulus': Creative question stem / scenario.
   - 'cq_subquestion': Sub-questions (ক), (খ), (গ) with assigned marks.
   - 'table': Tabular data or truth tables.
4. DIAGRAMS & FIGURES:
   - If there is a geometric diagram, coordinate plane, or figure, output its bounding box in `figures` with normalized [ymin, xmin, ymax, xmax] (0-1000).
   - If no diagrams, leave `figures` as empty [].

Output MUST adhere strictly to the JSON schema.
"""

    model_candidates = ["models/gemini-3.5-flash-lite", "models/gemini-3.6-flash", "models/gemini-3.5-flash"]
    
    for attempt in range(15):
        client = get_client()
        model_name = model_candidates[attempt % len(model_candidates)]
        try:
            resp = client.models.generate_content(
                model=model_name,
                contents=[
                    prompt,
                    types.Part.from_bytes(data=img_bytes, mime_type="image/png"),
                ],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=PageExtractionResult,
                    temperature=0.1,
                ),
            )
            data = json.loads(resp.text)
            return PageExtractionResult(**data)
        except ClientError as ce:
            err_msg = str(ce)
            if "429" in err_msg or "RESOURCE_EXHAUSTED" in err_msg:
                print(f"  [QUOTA/429] on attempt {attempt+1}. Rotating key & sleeping 10s...")
                rotate_key()
                time.sleep(10.0)
            else:
                print(f"  [WARN] ClientError on attempt {attempt+1}: {ce}")
                rotate_key()
                time.sleep(4.0)
        except Exception as e:
            print(f"  [WARN] Exception on attempt {attempt+1}: {e}")
            rotate_key()
            time.sleep(5.0)

    raise RuntimeError(f"Failed to extract printed page {printed_pno} after multiple retries.")

def process_page(doc: pymupdf.Document, printed_pno: int) -> PageExtractionResult:
    pdf_pno = printed_pno + 5  # PDF page 6 = Printed page 1
    cache_file = CACHE_DIR / f"page_{printed_pno:03d}.json"

    # Check cache
    if cache_file.exists():
        try:
            cached_data = json.loads(cache_file.read_text(encoding="utf-8"))
            return PageExtractionResult(**cached_data)
        except Exception:
            pass

    if pdf_pno > len(doc):
        raise ValueError(f"Printed page {printed_pno} maps to PDF page {pdf_pno}, exceeds doc length {len(doc)}")

    ch_no, ch_title = get_chapter_for_printed_page(printed_pno)
    img_bytes = render_page_image(doc, pdf_pno)
    
    result = extract_page_with_gemini(img_bytes, printed_pno, pdf_pno, ch_no, ch_title)
    
    # Save cache
    cache_file.write_text(json.dumps(result.model_dump(), ensure_ascii=False, indent=2), encoding="utf-8")
    return result

def main():
    parser = argparse.ArgumentParser(description="Extract Class 9-10 Higher Math to Option A JSONL")
    parser.add_argument("--start-page", type=int, default=1, help="Start printed page number (default: 1)")
    parser.add_argument("--end-page", type=int, default=37, help="End printed page number (default: 37 for Ch 1)")
    parser.add_argument("--chapter", type=int, default=None, help="Extract specific chapter (1-14)")
    parser.add_argument("--output-jsonl", type=str, default=str(DEFAULT_JSONL_PATH), help="Path to write JSONL output")
    parser.add_argument("--rebuild-jsonl-only", action="store_true", help="Recompile JSONL directly from existing cache")
    args = parser.parse_args()

    if not PDF_PATH.exists():
        print(f"Error: Higher Math PDF not found at {PDF_PATH}")
        sys.exit(1)

    output_path = Path(args.output_jsonl)

    # If chapter is specified, override start and end page
    if args.chapter is not None:
        if args.chapter in CHAPTER_INFO:
            info = CHAPTER_INFO[args.chapter]
            args.start_page = info["start_page"]
            args.end_page = info["end_page"]
            print(f"Selected Chapter {args.chapter}: {info['title_bn']} (Pages {args.start_page} to {args.end_page})")
        else:
            print(f"Error: Invalid chapter {args.chapter}. Valid chapters: 1-14.")
            sys.exit(1)

    print("=" * 65)
    print(" SheraTutor: Higher Mathematics (উচ্চতর গণিত) Ingestion Pipeline")
    print(f" Source PDF: {PDF_PATH.name}")
    print(f" Target Pages: Printed p.{args.start_page} to p.{args.end_page}")
    print(f" Output JSONL: {output_path.name}")
    print("=" * 65)

    doc = pymupdf.open(str(PDF_PATH))
    total_pages = len(doc)
    print(f"Opened PDF with {total_pages} total pages.")

    if args.rebuild_jsonl_only:
        print("[*] Rebuilding JSONL from existing cached pages...")
        cached_files = sorted(CACHE_DIR.glob("page_*.json"))
        with open(output_path, "w", encoding="utf-8") as out_f:
            for cf in cached_files:
                line_data = json.loads(cf.read_text(encoding="utf-8"))
                out_f.write(json.dumps(line_data, ensure_ascii=False) + "\n")
        print(f"[SUCCESS] Rebuilt {len(cached_files)} lines into {output_path}")
        return

    extracted_count = 0
    t0 = time.time()

    for pno in range(args.start_page, args.end_page + 1):
        print(f"[*] Processing Printed Page {pno} (PDF p.{pno + 5})...", end="", flush=True)
        try:
            res = process_page(doc, pno)
            sec_count = len(res.sections)
            fig_count = len(res.figures)
            print(f" Done! Extracted {sec_count} section(s), {fig_count} figure(s).")
            extracted_count += 1
            if extracted_count % 10 == 0:
                cached_files = sorted(CACHE_DIR.glob("page_*.json"))
                with open(output_path, "w", encoding="utf-8") as out_f:
                    for cf in cached_files:
                        line_data = json.loads(cf.read_text(encoding="utf-8"))
                        out_f.write(json.dumps(line_data, ensure_ascii=False) + "\n")
                print(f"  [SYNC] Synced {len(cached_files)} pages to {output_path.name}")
            # Polite pause for RPM quota
            time.sleep(2.0)
        except Exception as e:
            print(f" FAILED: {e}")

    # Build / update final JSONL
    print(f"\n[*] Exporting all cached pages to {output_path}...")
    cached_files = sorted(CACHE_DIR.glob("page_*.json"))
    with open(output_path, "w", encoding="utf-8") as out_f:
        for cf in cached_files:
            line_data = json.loads(cf.read_text(encoding="utf-8"))
            out_f.write(json.dumps(line_data, ensure_ascii=False) + "\n")

    elapsed = time.time() - t0
    print("=" * 65)
    print(f"[SUCCESS] Completed Higher Math extraction!")
    print(f"Pages Processed in this run: {extracted_count}")
    print(f"Total Lines in {output_path.name}: {len(cached_files)}")
    print(f"Total Time: {elapsed:.1f}s")
    print("=" * 65)

if __name__ == "__main__":
    main()
