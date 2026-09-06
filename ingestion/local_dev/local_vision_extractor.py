#!/usr/bin/env python3
"""
SheraTutor: Local Vision Document Extractor for NCTB Textbooks.
Renders PDF pages to high-DPI images and uses Ollama Vision Models (e.g. qwen2.5-vl:3b)
to transcribe Bengali and English textbook pages into clean Markdown with LaTeX math.
"""

import os
import sys
import json
import base64
import time
import argparse
import unicodedata
from pathlib import Path
from typing import Optional, Dict, Any, List

import pymupdf
import requests
from PIL import Image

OLLAMA_BASE_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434")
DEFAULT_VISION_MODEL = os.environ.get("VISION_MODEL", "qwen2.5-vl:3b")

NCTB_EXTRACTION_PROMPT = """You are an expert OCR, document transcription, and layout engine specialized in secondary school textbooks (Bangladesh NCTB Class 9-10).
Transcribe the content of this page into clean, structured GitHub-flavored Markdown following these strict instructions:

1. VERBATIM ACCURACY:
   - Transcribe all text accurately. Do not correct mistakes, paraphrase, or hallucinate content.
   - For Bengali text, preserve authentic spelling and conjuncts (যুক্তবর্ণ).

2. MATHEMATICAL & CHEMICAL FORMULAS:
   - Convert all mathematical, physical, and chemical formulas into clean LaTeX syntax.
   - Use inline math ($...$) for variables, formulas, and units in text (e.g., $F = ma$, $2\\text{H}_2 + \\text{O}_2 \\to 2\\text{H}_2\\text{O}$).
   - Use display math ($$...$$) for standalone derivations, equations, and numbered formulas.
   - Retain Bengali numerals in narrative text, but use standard numerals in math expressions.

3. STRUCTURE & HEADINGS:
   - Identify chapter titles (#), section headings (##), and sub-sections (###).
   - Format section numbering clearly (e.g. ## 1.1 রসায়নের ধারণা / Concept of Chemistry).

4. CREATIVE QUESTIONS (সৃজনশীল প্রশ্ন / CQ):
   - Clearly mark the shared stem/scenario as: **[উদ্দীপক / STIMULUS]**.
   - Explicitly label sub-questions: (ক), (খ), (গ), (ঘ) or (a), (b), (c), (d).

5. TABLES & LISTS:
   - Convert tabular data into standard Markdown tables (| Col 1 | Col 2 |).

6. OUTPUT ONLY MARKDOWN:
   - Do NOT include conversational filler, preamble ("Here is the transcription:"), or closing remarks."""


def normalize_bengali_nfc(text: str) -> str:
    """Normalize text with Unicode NFC to prevent split diacritics and broken conjuncts."""
    return unicodedata.normalize("NFC", text).strip()


def check_ollama_status(base_url: str = OLLAMA_BASE_URL) -> bool:
    """Check if the Ollama service is reachable."""
    try:
        r = requests.get(f"{base_url}/api/tags", timeout=5)
        return r.status_code == 200
    except Exception:
        return False


def render_pdf_page_to_png(doc: pymupdf.Document, page_no: int, dpi: int = 150) -> bytes:
    """Render a single PDF page into PNG bytes at specified DPI."""
    page = doc[page_no]
    pix = page.get_pixmap(dpi=dpi)
    return pix.tobytes("png")


def extract_page_text_vision(
    image_bytes: bytes,
    model_name: str = DEFAULT_VISION_MODEL,
    base_url: str = OLLAMA_BASE_URL,
    timeout: int = 240
) -> str:
    """Send page image to Ollama Vision API for layout-aware transcription."""
    b64_data = base64.b64encode(image_bytes).decode("utf-8")
    
    payload = {
        "model": model_name,
        "prompt": "Transcribe this textbook page into Markdown with LaTeX formulas.",
        "system": NCTB_EXTRACTION_PROMPT,
        "images": [b64_data],
        "stream": False,
        "options": {
            "temperature": 0.0,
            "num_ctx": 4096,
        }
    }
    
    resp = requests.post(f"{base_url}/api/generate", json=payload, timeout=timeout)
    if resp.status_code != 200:
        raise RuntimeError(f"Ollama API error ({resp.status_code}): {resp.text}")
        
    result_text = resp.json().get("response", "")
    return normalize_bengali_nfc(result_text)


def extract_pdf_pages(
    pdf_path: str,
    start_page: int,
    end_page: int,
    model_name: str = DEFAULT_VISION_MODEL,
    dpi: int = 150,
    progress_callback=None
) -> List[Dict[str, Any]]:
    """Extract a range of pages from a PDF file."""
    doc = pymupdf.open(pdf_path)
    total_pages = len(doc)
    actual_end = min(end_page, total_pages - 1)
    
    results = []
    for p_idx in range(start_page, actual_end + 1):
        t0 = time.time()
        img_bytes = render_pdf_page_to_png(doc, p_idx, dpi=dpi)
        text = extract_page_text_vision(img_bytes, model_name=model_name)
        elapsed = time.time() - t0
        
        page_data = {
            "page_no": p_idx + 1,        # 1-indexed
            "zero_index": p_idx,
            "markdown": text,
            "char_count": len(text),
            "elapsed_seconds": round(elapsed, 2)
        }
        results.append(page_data)
        
        if progress_callback:
            progress_callback(p_idx + 1, actual_end + 1, page_data)
            
    return results


def main():
    parser = argparse.ArgumentParser(description="Extract NCTB textbook pages using Ollama Vision models.")
    parser.add_argument("--pdf", required=True, help="Path to PDF textbook file")
    parser.add_argument("--start-page", type=int, default=1, help="Start page (1-indexed)")
    parser.add_argument("--end-page", type=int, default=1, help="End page (1-indexed)")
    parser.add_argument("--model", default=DEFAULT_VISION_MODEL, help="Ollama vision model name")
    parser.add_argument("--dpi", type=int, default=150, help="Rendering DPI (default: 150)")
    parser.add_argument("--output", help="Optional output path for extracted Markdown")
    args = parser.parse_args()

    if not check_ollama_status():
        print(f"Error: Ollama service is not running at {OLLAMA_BASE_URL}.", file=sys.stderr)
        print("Please start it with: ollama serve &", file=sys.stderr)
        sys.exit(1)

    pdf_file = Path(args.pdf)
    if not pdf_file.exists():
        print(f"Error: PDF not found: {pdf_file}", file=sys.stderr)
        sys.exit(1)

    print(f"Extracting '{pdf_file.name}' [p. {args.start_page}..{args.end_page}] with {args.model}...")

    def on_page_done(current, total, data):
        print(f"  [Page {current}/{total}] {data['char_count']} chars extracted in {data['elapsed_seconds']}s")

    pages = extract_pdf_pages(
        str(pdf_file),
        start_page=args.start_page - 1,
        end_page=args.end_page - 1,
        model_name=args.model,
        dpi=args.dpi,
        progress_callback=on_page_done
    )

    combined_markdown = "\n\n---\n\n".join(
        f"<!-- Page {p['page_no']} -->\n{p['markdown']}" for p in pages
    )

    if args.output:
        out_path = Path(args.output)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(combined_markdown, encoding="utf-8")
        print(f"Saved extracted Markdown to {out_path}")
    else:
        print("\n--- SAMPLE EXTRACTED OUTPUT ---")
        print(combined_markdown[:800])
        print("...")


if __name__ == "__main__":
    main()
