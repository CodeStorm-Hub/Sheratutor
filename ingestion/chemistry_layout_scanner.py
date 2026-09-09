#!/usr/bin/env python3
"""
SheraTutor: High-Resolution Multimodal Layout Scanner for NCTB Chemistry.
Reviews Chemistry (bn and en) page-by-page, organizes down chapter-by-chapter,
detects all visual entities (apparatus, vector drawings, reaction mechanisms,
heating/cooling graphs, electrochemical cells, molecular models),
and crops them out at 300 DPI as high-quality lossless PNG assets.
"""

import os
import sys
import json
import time
from pathlib import Path
from typing import List, Dict, Any, Tuple
import fitz  # PyMuPDF
from PIL import Image

REPO_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = REPO_DIR / "ingestion/output/figures/chemistry"
CACHE_DIR_BN = REPO_DIR / "ingestion/cache/chemistry_bn"
CACHE_DIR_EN = REPO_DIR / "ingestion/cache/chemistry_en"

CHEMISTRY_CHAPTERS = [
    {"ch_no": 1, "start": 6, "end": 21, "title_en": "Concepts of Chemistry", "title_bn": "রসায়নের ধারণা"},
    {"ch_no": 2, "start": 22, "end": 39, "title_en": "States of Matter", "title_bn": "পদার্থের অবস্থা"},
    {"ch_no": 3, "start": 40, "end": 63, "title_en": "Structure of Matter", "title_bn": "পদার্থের গঠন"},
    {"ch_no": 4, "start": 64, "end": 86, "title_en": "Periodic Table", "title_bn": "পর্যায় সারণি"},
    {"ch_no": 5, "start": 87, "end": 113, "title_en": "Chemical Bond", "title_bn": "রাসায়নিক বন্ধন"},
    {"ch_no": 6, "start": 114, "end": 146, "title_en": "Concept of Mole & Chemical Calculation", "title_bn": "মোলের ধারণা ও রাসায়নিক গণনা"},
    {"ch_no": 7, "start": 147, "end": 172, "title_en": "Chemical Reactions", "title_bn": "রাসায়নিক বিক্রিয়া"},
    {"ch_no": 8, "start": 173, "end": 210, "title_en": "Chemistry and Energy", "title_bn": "রসায়ন ও শক্তি"},
    {"ch_no": 9, "start": 211, "end": 237, "title_en": "Acid-Base Balance", "title_bn": "এসিড-ক্ষার সমতা"},
    {"ch_no": 10, "start": 238, "end": 265, "title_en": "Mineral Resources: Metal-Nonmetal", "title_bn": "খনিজ সম্পদ: ধাতু-অধাতু"},
    {"ch_no": 11, "start": 266, "end": 291, "title_en": "Mineral Resources: Fossils", "title_bn": "খনিজ সম্পদ: জীবাশ্ম"},
    {"ch_no": 12, "start": 292, "end": 309, "title_en": "Chemistry in Our Lives", "title_bn": "আমাদের জীবনে রসায়ন"},
]

def get_chapter_for_page(page_no: int) -> Dict[str, Any]:
    for ch in CHEMISTRY_CHAPTERS:
        if ch["start"] <= page_no <= ch["end"]:
            return ch
    return {"ch_no": 0, "start": 1, "end": 5, "title_en": "Front Matter / Index", "title_bn": "ভূমিকা ও সূচিপত্র"}

def cluster_and_merge_rects(raw_rects: List[fitz.Rect], padding: float = 12.0) -> List[fitz.Rect]:
    """Clusters and merges intersecting or near-neighbor drawing rectangles."""
    if not raw_rects:
        return []
    
    merged = []
    for r in raw_rects:
        # Avoid full-page borders or tiny speckles
        if r.width < 45 or r.height < 45:
            continue
        if r.width > 550 and r.height > 750:  # Full page border
            continue
            
        r_expanded = fitz.Rect(r.x0 - padding, r.y0 - padding, r.x1 + padding, r.y1 + padding)
        was_merged = False
        for i, existing in enumerate(merged):
            if existing.intersects(r_expanded):
                merged[i] = existing | r  # Union
                was_merged = True
                break
        if not was_merged:
            merged.append(r)

    # Second pass consolidation
    final_rects = []
    for r in merged:
        was_merged = False
        for i, f in enumerate(final_rects):
            if f.intersects(fitz.Rect(r.x0 - padding, r.y0 - padding, r.x1 + padding, r.y1 + padding)):
                final_rects[i] = f | r
                was_merged = True
                break
        if not was_merged:
            final_rects.append(r)
            
    return final_rects

def scan_page_visuals(page: fitz.Page, page_no: int) -> List[fitz.Rect]:
    """Identifies both vector drawings and raster images on a single page."""
    candidate_rects = []
    
    # 1. Inspect Vector Drawings (molecular structures, graphs, glassware lines)
    drawings = page.get_drawings()
    for d in drawings:
        r = d["rect"]
        # Ignore full-width header/footer separator lines
        if r.height < 4 and r.width > 300:
            continue
        if 35 < r.width and 35 < r.height:
            candidate_rects.append(r)
            
    # 2. Inspect Raster Bitmaps (photos, complex color illustrations)
    image_list = page.get_images()
    for img_info in image_list:
        xref = img_info[0]
        # Get placement rects on page
        img_rects = page.get_image_rects(xref)
        for ir in img_rects:
            if ir.width > 35 and ir.height > 35:
                candidate_rects.append(ir)
                
    # 3. Cluster and merge
    merged_rects = cluster_and_merge_rects(candidate_rects)
    
    # Filter out header area (top 45pt) and footer area (bottom 45pt)
    page_height = page.rect.height
    filtered_rects = []
    for r in merged_rects:
        # Skip running header
        if r.y1 < 50:
            continue
        # Skip running footer page number if it's small
        if r.y0 > (page_height - 50) and r.height < 30:
            continue
        filtered_rects.append(r)
        
    return filtered_rects

def process_chemistry_textbook(pdf_path: str, lang: str) -> List[Dict[str, Any]]:
    print(f"\n=======================================================")
    print(f"[*] Starting Multimodal Layout Scan: {pdf_path} ({lang.upper()})")
    print(f"=======================================================")
    
    doc = fitz.open(pdf_path)
    total_pages = len(doc)
    extracted_figures = []
    
    lang_dir = OUTPUT_DIR / lang
    lang_dir.mkdir(parents=True, exist_ok=True)
    
    chapter_stats = {ch["ch_no"]: 0 for ch in CHEMISTRY_CHAPTERS}
    chapter_stats[0] = 0

    t0 = time.time()
    for page_idx in range(total_pages):
        page_no = page_idx + 1
        page = doc[page_idx]
        ch_info = get_chapter_for_page(page_no)
        ch_no = ch_info["ch_no"]
        
        rects = scan_page_visuals(page, page_no)
        if not rects:
            continue
            
        ch_dir = lang_dir / f"ch_{ch_no:02d}"
        ch_dir.mkdir(parents=True, exist_ok=True)
        
        # Load page text context if available in cache
        cache_dir = CACHE_DIR_BN if lang == "bn" else CACHE_DIR_EN
        cache_file = cache_dir / f"page_{page_no:04d}.json"
        context_text = ""
        if cache_file.exists():
            try:
                with open(cache_file, "r", encoding="utf-8") as cf:
                    cdata = json.load(cf)
                    context_text = cdata.get("markdown", "")[:1200]
            except Exception:
                pass
                
        for f_idx, r in enumerate(rects):
            # Add 8px padding around crop
            pad = 8.0
            crop_rect = fitz.Rect(
                max(0, r.x0 - pad),
                max(0, r.y0 - pad),
                min(page.rect.width, r.x1 + pad),
                min(page.rect.height, r.y1 + pad)
            )
            
            # Render at 300 DPI (crisp high-DPI quality)
            pix = page.get_pixmap(dpi=300, clip=crop_rect)
            
            # File naming: p{page_no:03d}_fig_{f_idx+1:02d}.png
            fig_filename = f"p{page_no:03d}_fig_{f_idx+1:02d}.png"
            fig_path = ch_dir / fig_filename
            pix.save(str(fig_path))
            
            fig_meta = {
                "id": f"chem_{lang}_ch{ch_no:02d}_p{page_no:03d}_{f_idx+1:02d}",
                "lang": lang,
                "subject": "Chemistry",
                "chapter_no": ch_no,
                "chapter_title": ch_info["title_bn"] if lang == "bn" else ch_info["title_en"],
                "page_no": page_no,
                "fig_idx": f_idx + 1,
                "relative_path": str(fig_path.relative_to(REPO_DIR)),
                "width_px": pix.width,
                "height_px": pix.height,
                "bbox_pt": [round(crop_rect.x0, 1), round(crop_rect.y0, 1), round(crop_rect.x1, 1), round(crop_rect.y1, 1)],
                "context_text": context_text
            }
            extracted_figures.append(fig_meta)
            chapter_stats[ch_no] += 1
            
        if (page_no % 30 == 0) or page_no == total_pages:
            print(f"  [Progress] Page {page_no}/{total_pages} | Total Figures Extracted: {len(extracted_figures)}")

    elapsed = time.time() - t0
    meta_path = lang_dir / "figures_catalog.json"
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(extracted_figures, f, ensure_ascii=False, indent=2)
        
    print(f"\n[✓] Finished {lang.upper()} Layout Scan in {elapsed:.1f}s!")
    print(f"    Total Visual Entities Cropped: {len(extracted_figures)}")
    print(f"    Catalog Saved To: {meta_path}")
    print("    Figures Per Chapter:")
    for ch in CHEMISTRY_CHAPTERS:
        c_num = ch["ch_no"]
        t = ch["title_bn"] if lang == "bn" else ch["title_en"]
        print(f"      Ch {c_num:02d} ({t}): {chapter_stats[c_num]} figures")
    return extracted_figures

if __name__ == "__main__":
    bn_figs = process_chemistry_textbook(str(REPO_DIR / "ingestion/textbooks/chemistry_bn.pdf"), "bn")
    en_figs = process_chemistry_textbook(str(REPO_DIR / "ingestion/textbooks/chemistry_en.pdf"), "en")
    print(f"\n🎉 Total Multimodal Assets Extracted Across Both Editions: {len(bn_figs) + len(en_figs)}")
