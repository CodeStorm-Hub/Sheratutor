#!/usr/bin/env python3
"""
Crops figures from rendered NCTB textbook pages using Gemini 3.5 Flash detected bounding boxes.
Takes [ymin, xmin, ymax, xmax] (normalized 0-1000), crops from 150 DPI page image,
and saves to output/figures/{subject}_{lang}/p{page:03d}_fig_{idx:02d}.png.
"""

import os
import sys
import json
import argparse
from pathlib import Path
from typing import Dict, Any, List

import pymupdf
from PIL import Image

REPO_ROOT = Path(__file__).resolve().parent.parent
INGESTION_DIR = Path(__file__).resolve().parent

def crop_figures_for_page(
    pdf_path: Path,
    pdf_page_1based: int,
    figures_metadata: List[Dict[str, Any]],
    output_dir: Path,
    dpi: int = 150,
    padding_px: int = 8,
) -> List[Dict[str, Any]]:
    if not figures_metadata:
        return []

    doc = pymupdf.open(str(pdf_path))
    page = doc.load_page(pdf_page_1based - 1)
    zoom = dpi / 72.0
    mat = pymupdf.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat, alpha=False)
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    doc.close()

    w, h = img.size
    cropped_info = []

    for idx, fig in enumerate(figures_metadata):
        box = fig.get("box_2d")
        if not box or len(box) != 4:
            continue
        ymin, xmin, ymax, xmax = box

        # Convert normalized 0-1000 coordinates to actual pixel bounds
        top = int((ymin / 1000.0) * h) - padding_px
        bottom = int((ymax / 1000.0) * h) + padding_px
        left = int((xmin / 1000.0) * w) - padding_px
        right = int((xmax / 1000.0) * w) + padding_px

        # Clamp bounds
        top = max(0, min(h, top))
        bottom = max(0, min(h, bottom))
        left = max(0, min(w, left))
        right = max(0, min(w, right))

        if right <= left or bottom <= top:
            continue

        cropped_img = img.crop((left, right, bottom, top) if False else (left, top, right, bottom))
        
        printed_pno = pdf_page_1based - 5
        filename = f"p{printed_pno:03d}_fig_{idx+1:02d}.png"
        filepath = output_dir / filename
        cropped_img.save(filepath, format="PNG", optimize=True)

        fig_record = dict(fig)
        fig_record["crop_filename"] = filename
        fig_record["crop_filepath"] = str(filepath)
        fig_record["width"] = cropped_img.width
        fig_record["height"] = cropped_img.height
        cropped_info.append(fig_record)
        print(f"  Cropped figure -> {filepath} ({cropped_img.width}x{cropped_img.height}px)")

    return cropped_info

def main():
    parser = argparse.ArgumentParser(description="Crop figures using Gemini bounding boxes")
    parser.add_argument("--subject", default="chemistry")
    parser.add_argument("--lang", default="en")
    parser.add_argument("--cache-dir", default=None)
    parser.add_argument("--out-dir", default=None)
    args = parser.parse_args()

    cache_dir = Path(args.cache_dir) if args.cache_dir else INGESTION_DIR / "cache_gemini" / f"{args.subject}_{args.lang}"
    out_dir = Path(args.out_dir) if args.out_dir else INGESTION_DIR / "output" / "figures" / f"{args.subject}_{args.lang}"
    out_dir.mkdir(parents=True, exist_ok=True)

    pdf_file = INGESTION_DIR / "textbooks" / f"{args.subject}_{args.lang}.pdf"
    if not pdf_file.exists():
        print(f"Error: PDF not found at {pdf_file}")
        sys.exit(1)

    page_files = sorted(cache_dir.glob("page_*.json"))
    print(f"Processing {len(page_files)} cached extractions from {cache_dir}...")

    manifest = {}
    for pf in page_files:
        data = json.loads(pf.read_text(encoding="utf-8"))
        pdf_page = data.get("pdf_page_no")
        printed_page = data.get("printed_page_no")
        figures = data.get("figures", [])
        if figures:
            print(f"Page p.{printed_page} (PDF {pdf_page}): {len(figures)} figure(s) detected")
            crops = crop_figures_for_page(pdf_file, pdf_page, figures, out_dir)
            manifest[f"page_{printed_page:03d}"] = crops

    manifest_file = out_dir / "figure_crops_manifest.json"
    manifest_file.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Saved crop manifest to {manifest_file}")

if __name__ == "__main__":
    main()
