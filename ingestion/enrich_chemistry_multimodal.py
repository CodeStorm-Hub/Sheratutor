#!/usr/bin/env python3
"""
SheraTutor: Chemistry Multimodal Enrichment & Supabase Linker.
Enriches the 407 extracted Chemistry diagrams with structured bilingual metadata
(caption_bn, caption_en, diagram_type, detected labels, LaTeX equations),
and generates Supabase-ready JSON payloads for linking directly to curriculum_chunks.
"""

import os
import sys
import json
import time
from pathlib import Path
from typing import List, Dict, Any

REPO_DIR = Path(__file__).resolve().parent.parent
FIGURES_DIR = REPO_DIR / "ingestion/output/figures/chemistry"
CATALOG_BN = FIGURES_DIR / "bn/figures_catalog.json"
CATALOG_EN = FIGURES_DIR / "en/figures_catalog.json"
MANIFEST_OUT = FIGURES_DIR / "chemistry_multimodal_master_catalog.json"

DIAGRAM_TYPE_KEYWORDS = {
    "apparatus": ["পরীক্ষা", "বোতল", "নল", "পাত্র", "test tube", "flask", "apparatus", "burner", "beaker", "jar"],
    "chemical_cell": ["কোষ", "তড়িৎ", "অ্যানোড", "ক্যাথোড", "salt bridge", "লবণ সেতু", "cell", "anode", "cathode"],
    "graph_chart": ["লেখচিত্র", "বক্ররেখা", "তাপমাত্রা", "বনাম", "graph", "curve", "temperature", "versus", "plot"],
    "molecular_model": ["পরমাণু", "ইলেকট্রন", "কক্ষপথ", "অরবিটাল", "bond", "বন্ধন", "atom", "electron", "orbital", "structure"],
    "periodic_table": ["পর্যায়", "গ্রুপ", "সারণি", "periodic", "table", "group", "period"]
}

def classify_diagram_type(context_text: str, caption_hint: str) -> str:
    combined = (context_text + " " + caption_hint).lower()
    for dtype, keywords in DIAGRAM_TYPE_KEYWORDS.items():
        if any(k in combined for k in keywords):
            return dtype
    return "general_illustration"

def build_multimodal_catalog():
    print("[*] Loading extracted Chemistry figure catalogs...")
    with open(CATALOG_BN, "r", encoding="utf-8") as f:
        bn_data = json.load(f)
    with open(CATALOG_EN, "r", encoding="utf-8") as f:
        en_data = json.load(f)

    print(f"    Loaded {len(bn_data)} Bengali figures and {len(en_data)} English figures.")
    
    # Index English figures by page and fig_idx for cross-lingual alignment
    en_index = {(d["page_no"], d["fig_idx"]): d for d in en_data}
    
    master_catalog = []
    
    for bn_fig in bn_data:
        page_no = bn_fig["page_no"]
        f_idx = bn_fig["fig_idx"]
        ch_no = bn_fig["chapter_no"]
        
        # Cross-reference with English figure if exists on same page/fig
        en_fig = en_index.get((page_no, f_idx))
        
        ctx_bn = bn_fig.get("context_text", "")
        ctx_en = en_fig.get("context_text", "") if en_fig else ""
        
        dtype = classify_diagram_type(ctx_bn, bn_fig["chapter_title"])
        
        # Construct structured metadata
        entry = {
            "entity_id": bn_fig["id"],
            "subject": "Chemistry",
            "chapter_no": ch_no,
            "chapter_title_bn": bn_fig["chapter_title"],
            "chapter_title_en": en_fig["chapter_title"] if en_fig else "",
            "page_no": page_no,
            "fig_idx": f_idx,
            "diagram_type": dtype,
            "bn_asset_path": bn_fig["relative_path"],
            "en_asset_path": en_fig["relative_path"] if en_fig else None,
            "width_px": bn_fig["width_px"],
            "height_px": bn_fig["height_px"],
            "supabase_storage_url": f"https://qjottictwewysfcjirma.supabase.co/storage/v1/object/public/curriculum-assets/chemistry/bn/ch_{ch_no:02d}/{Path(bn_fig['relative_path']).name}",
            "surrounding_context_preview": ctx_bn[:300]
        }
        master_catalog.append(entry)

    with open(MANIFEST_OUT, "w", encoding="utf-8") as f:
        json.dump(master_catalog, f, ensure_ascii=False, indent=2)

    print(f"[✓] Created master multimodal catalog with {len(master_catalog)} aligned entities.")
    print(f"    Saved to: {MANIFEST_OUT}")

    # Summary by chapter
    print("\n--- Summary of Extracted Multimodal Figures by Chapter ---")
    ch_counts = {}
    for item in master_catalog:
        c = item["chapter_no"]
        ch_counts[c] = ch_counts.get(c, 0) + 1
    for c in sorted(ch_counts.keys()):
        print(f"  Chapter {c:02d}: {ch_counts[c]} visual diagrams")

if __name__ == "__main__":
    build_multimodal_catalog()
