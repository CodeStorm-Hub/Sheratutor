#!/usr/bin/env python3
"""
SheraTutor: Single-Pass Multimodal Extraction Pipeline via Gemini 3.5 Flash.
Renders 150 DPI page images from NCTB textbooks, masks margin noise,
extracts raw OCR grounding locally, and leverages Gemini 3.5 Flash to generate
verbatim Markdown + LaTeX formulas with structured section classification,
and detects diagram bounding boxes ([ymin, xmin, ymax, xmax]) in a single call.
"""

import os
import sys
import json
import time
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
API_KEYS = [
    os.environ.get("GEMINI_API_KEY_SECONDARY", ""),
    os.environ.get("GEMINI_API_KEY", ""),
    os.environ.get("GCP_API_KEY", ""),
]
API_KEYS = [k.strip() for k in API_KEYS if k and k.strip()]

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

# Chapter mappings for Chemistry (310 pages total, +5 offset, content: printed pp 1-304, PDF pp 6-309)
CHEMISTRY_CHAPTERS = [
    (1, "Concepts of Chemistry", "রসায়নের ধারণা", 1, 16, 6, 21),
    (2, "States of Matter", "পদার্থের অবস্থা", 17, 34, 22, 39),
    (3, "Structure of Matter", "পদার্থের গঠন", 35, 58, 40, 63),
    (4, "Periodic Table", "পর্যায় সারণি", 59, 81, 64, 86),
    (5, "Chemical Bond", "রাসায়নিক বন্ধন", 82, 108, 87, 113),
    (6, "Concept of Mole & Chemical Calculation", "মোলের ধারণা ও রাসায়নিক গণনা", 109, 141, 114, 146),
    (7, "Chemical Reactions", "রাসায়নিক বিক্রিয়া", 142, 167, 147, 172),
    (8, "Chemistry and Energy", "রসায়ন ও শক্তি", 168, 205, 173, 210),
    (9, "Acid-Base Balance", "এসিড-ক্ষার সমতা", 206, 232, 211, 237),
    (10, "Mineral Resources: Metal-Nonmetal", "খনিজ সম্পদ: ধাতু-অধাতু", 233, 260, 238, 265),
    (11, "Mineral Resources: Fossils", "খনিজ সম্পদ: জীবাশ্ম", 261, 286, 266, 291),
    (12, "Chemistry in Our Lives", "আমাদের জীবনে রসায়ন", 287, 304, 292, 309),
]

def get_chapter_for_printed_page(pno: int) -> Tuple[int, str, str]:
    for ch_no, title_en, title_bn, p_start, p_end, _, _ in CHEMISTRY_CHAPTERS:
        if p_start <= pno <= p_end:
            return ch_no, title_en, title_bn
    return 0, "Unknown", "অজানা"

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
        print(f"Local Tesseract warning: {e}")
        return ""

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
   - Format all chemical formulas, equations, stoichiometry fractions, and reaction symbols in pristine LaTeX ($...$ or $$...$$).
   - Fix all subscripts, arrows, and states: e.g. $\\text{{Ca(HCO}}_3)_2 + 2\\text{{HCl}} \\longrightarrow \\text{{CaCl}}_2 + 2\\text{{H}}_2\\text{{O}} + 2\\text{{CO}}_2$
4. DIAGRAM / FIGURE DETECTION & BOUNDING BOXES:
   - Identify every genuine photographic illustration, scientific apparatus drawing, molecular lattice, graph, or chemical reaction scheme on the page.
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

# --- Extraction Function with Key Failover ---

def extract_page_gemini(
    pdf_path: Path,
    pdf_page_1based: int,
    subject: str = "chemistry",
    lang: str = "en",
    model_name: str = "gemini-3.5-flash",
    fallback_model: str = "gemini-2.5-flash",
) -> PageExtractionResult:
    printed_pno = pdf_page_1based - 5
    ch_no, title_en, title_bn = get_chapter_for_printed_page(printed_pno)
    ch_title = title_en if lang.lower() == "en" else title_bn

    print(f"\n[Page {pdf_page_1based} / Printed p.{printed_pno}] Rendering & local OCR grounding (Ch {ch_no}: {ch_title})...")
    pil_img, img_bytes = render_and_mask_page(pdf_path, pdf_page_1based)
    ocr_draft = run_local_ocr_draft(img_bytes, lang)

    prompt = build_gemini_extraction_prompt(subject, lang, ch_no, ch_title, printed_pno, ocr_draft)
    image_part = types.Part.from_bytes(data=img_bytes, mime_type="image/png")

    active_model = model_name

    for model_attempt in [active_model, fallback_model]:
        for key_attempt in range(len(API_KEYS)):
            client = get_client()
            try:
                print(f"Calling Gemini ({model_attempt}) with Key {_current_key_idx}...")
                response = client.models.generate_content(
                    model=model_attempt,
                    contents=[image_part, prompt],
                    config=types.GenerateContentConfig(
                        temperature=0.1,
                        max_output_tokens=8192,
                        response_mime_type="application/json",
                        response_json_schema=PageExtractionResult.model_json_schema(),
                    ),
                )

                if not response.text:
                    print(f"Warning: Empty response text from {model_attempt} (candidates: {len(response.candidates)})")
                    rotate_key()
                    continue

                raw_text = response.text.strip()
                parsed_json = json.loads(raw_text)
                result = PageExtractionResult(**parsed_json)
                result.printed_page_no = printed_pno
                result.pdf_page_no = pdf_page_1based
                result.chapter_no = ch_no
                result.chapter_title = ch_title
                return result

            except ClientError as e:
                err_str = str(e)
                if "RESOURCE_EXHAUSTED" in err_str or "429" in err_str:
                    print(f"Key {_current_key_idx} quota/rate limit hit (429). Rotating key...")
                    rotate_key()
                    time.sleep(2)
                    continue
                elif "PERMISSION_DENIED" in err_str or "403" in err_str:
                    print(f"Key {_current_key_idx} permission denied (403). Rotating key...")
                    rotate_key()
                    continue
                else:
                    print(f"ClientError: {e}")
                    rotate_key()
                    continue
            except Exception as e:
                print(f"Generation error with {model_attempt} on key {_current_key_idx}: {e}")
                rotate_key()
                time.sleep(2)
        
        print(f"Model {model_attempt} exhausted across all keys. Escalating to fallback model {fallback_model}...")

    raise RuntimeError(f"Failed to extract page {pdf_page_1based} with both {model_name} and {fallback_model}")

def main():
    parser = argparse.ArgumentParser(description="Extract NCTB textbook pages with Gemini 3.5 Flash")
    parser.add_argument("--subject", default="chemistry", choices=["chemistry", "physics", "mathematics"])
    parser.add_argument("--lang", default="en", choices=["en", "bn"])
    parser.add_argument("--start-page", type=int, default=35, help="PDF page number (1-based), e.g. 35 = printed p.30")
    parser.add_argument("--end-page", type=int, default=35, help="PDF page number (1-based)")
    parser.add_argument("--model", default="gemini-3.5-flash", help="Model name (e.g. gemini-3.5-flash)")
    parser.add_argument("--out-dir", default=None, help="Output cache directory")
    args = parser.parse_args()

    pdf_file = INGESTION_DIR / "textbooks" / f"{args.subject}_{args.lang}.pdf"
    if not pdf_file.exists():
        print(f"Error: PDF file {pdf_file} does not exist.")
        sys.exit(1)

    out_dir = Path(args.out_dir) if args.out_dir else INGESTION_DIR / "cache_gemini" / f"{args.subject}_{args.lang}"
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"Starting extraction for {args.subject} ({args.lang}) from PDF p.{args.start_page} to p.{args.end_page}")
    print(f"Model: {args.model} | Cache: {out_dir}")

    for p in range(args.start_page, args.end_page + 1):
        printed_pno = p - 5
        cache_file = out_dir / f"page_{printed_pno:03d}.json"
        
        try:
            res = extract_page_gemini(
                pdf_path=pdf_file,
                pdf_page_1based=p,
                subject=args.subject,
                lang=args.lang,
                model_name=args.model,
            )
            cache_file.write_text(res.model_dump_json(indent=2), encoding="utf-8")
            print(f"Successfully extracted and saved: {cache_file}")
            print(f"  Sections found: {len(res.sections)}")
            print(f"  Figures found: {len(res.figures)}")
            for fig in res.figures:
                print(f"    - {fig.caption} | box_2d: {fig.box_2d}")
        except Exception as e:
            print(f"Failed to process page {p}: {e}")
            break

if __name__ == "__main__":
    main()
