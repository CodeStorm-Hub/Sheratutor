#!/usr/bin/env python3
"""
SheraTutor: Batch Ingestion Orchestrator for NCTB Textbooks.
Executes automated page-by-page vision extraction, hierarchical chunking,
multilingual embedding via bge-m3, and storage in ChromaDB / Supabase SQL.

Note: Physics (SSC-PHY) is intentionally skipped as it is already ingested.
"""

import os
import sys
import gc
import json
import time
import argparse
from pathlib import Path
from typing import Dict, Any, List, Optional

# Ensure local_dev is importable
SCRIPT_DIR = Path(__file__).parent.resolve()
sys.path.insert(0, str(SCRIPT_DIR / "local_dev"))

from local_vision_extractor import extract_pdf_pages, check_ollama_status, DEFAULT_VISION_MODEL
from chunk_classifier import build_hierarchical_chunks, ClassifiedChunk
from embed_and_store import get_embedding, get_chroma_collection, save_to_chroma, generate_supabase_sql

TEXTBOOKS_DIR = SCRIPT_DIR / "textbooks"
OUTPUT_DIR = SCRIPT_DIR / "local_dev" / "output"

# Subject to PDF mapping for 2026 textbooks
SUBJECT_PDF_MAP = {
    "SSC-CHEM": {
        "name_en": "Chemistry",
        "name_bn": "রসায়ন",
        "bn": "chemistry_bn.pdf",
        "en": "chemistry_en.pdf",
        # Default page ranges for sample/pilot chapters
        "sample_chapter_pages": {
            1: (6, 21),   # Chapter 1: Concepts of Chemistry (রসায়নের ধারণা)
            2: (22, 39),  # Chapter 2: States of Matter (পদার্থের অবস্থা)
        }
    },
    "SSC-MATH": {
        "name_en": "Mathematics",
        "name_bn": "গণিত",
        "bn": "mathematics_bn.pdf",
        "en": "mathematics_en.pdf",
        "sample_chapter_pages": {
            1: (1, 20),
            2: (21, 40),
        }
    },
    "SSC-ENG": {
        "name_en": "English",
        "name_bn": "ইংরেজি",
        "bn": "english_for_today.pdf",
        "en": "english_grammar_and_composition.pdf",
        "sample_chapter_pages": {
            1: (1, 18),
        }
    },
}


def run_batch_ingest(
    subject_code: str,
    language: str,
    start_page: int,
    end_page: int,
    chapter_no: int,
    chapter_id: str,
    vision_model: str = DEFAULT_VISION_MODEL,
    target: str = "both",
    dpi: int = 150
):
    """Run extraction, classification, embedding, and storage for a page range."""
    # 1. Validation: Skip Physics
    if "PHY" in subject_code.upper() or "PHYSIC" in subject_code.upper():
        print(f"\n[!] SKIPPED: Subject '{subject_code}' is Physics.")
        print("    Physics is already completely indexed in Supabase (736 chunks across Ch 1-13).")
        return

    subject_info = SUBJECT_PDF_MAP.get(subject_code)
    if not subject_info:
        raise ValueError(f"Unknown or unsupported subject code: {subject_code}")

    pdf_filename = subject_info.get(language)
    if not pdf_filename:
        raise ValueError(f"No PDF registered for {subject_code} in language '{language}'")

    pdf_path = TEXTBOOKS_DIR / pdf_filename
    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

    print("\n" + "=" * 70)
    print(f"BATCH INGESTION: {subject_code} ({language.upper()}) - Chapter {chapter_no}")
    print(f"File: {pdf_filename}")
    print(f"Pages: {start_page} to {end_page} | Model: {vision_model} | Target: {target}")
    print("=" * 70)

    # 2. Extract pages (prioritizing cache_verified ground-truth)
    CACHE_VERIFIED_DIR = SCRIPT_DIR / "cache_verified"
    CACHE_BASE_DIR = SCRIPT_DIR / "cache"
    subj_prefix = "chemistry" if "CHEM" in subject_code else ("mathematics" if "MATH" in subject_code else "english")
    verified_cache_dir = CACHE_VERIFIED_DIR / f"{subj_prefix}_{language}"
    base_cache_dir = CACHE_BASE_DIR / f"{subj_prefix}_{language}"

    extracted_pages = []
    missing_pages = []

    print(f"\n[1/4] Checking verified cache for pages {start_page}..{end_page}...")
    for p_no in range(start_page, end_page + 1):
        v_file = verified_cache_dir / f"page_{p_no:04d}.json"
        b_file = base_cache_dir / f"page_{p_no:04d}.json"
        
        found_file = v_file if v_file.exists() else (b_file if b_file.exists() else None)
        if found_file:
            try:
                p_data = json.loads(found_file.read_text(encoding="utf-8"))
                extracted_pages.append({
                    "page_no": p_no,
                    "zero_index": p_no - 1,
                    "markdown": p_data["markdown"],
                    "char_count": len(p_data["markdown"]),
                    "elapsed_seconds": 0.0,
                    "source": "verified_cache" if found_file == v_file else "disk_cache"
                })
            except Exception:
                missing_pages.append(p_no)
        else:
            missing_pages.append(p_no)

    if len(extracted_pages) == (end_page - start_page + 1):
        print(f"  -> All {len(extracted_pages)} pages loaded directly from VERIFIED ground-truth cache! (0 Vision API calls needed)")
    else:
        print(f"  -> {len(extracted_pages)} pages loaded from cache. Extracting {len(missing_pages)} remaining pages via Vision Model ({vision_model})...")
        if missing_pages:
            def on_progress(cur, tot, data):
                print(f"  -> Page {cur}/{tot} transcribed: {data['char_count']} chars ({data['elapsed_seconds']}s)")

            fresh_pages = extract_pdf_pages(
                str(pdf_path),
                start_page=min(missing_pages) - 1,
                end_page=max(missing_pages) - 1,
                model_name=vision_model,
                dpi=dpi,
                progress_callback=on_progress
            )
            fresh_map = {p["page_no"]: p for p in fresh_pages}
            all_p = {p["page_no"]: p for p in extracted_pages}
            all_p.update(fresh_map)
            extracted_pages = [all_p[p_no] for p_no in range(start_page, end_page + 1) if p_no in all_p]

    # 3. Classify & Structure Chunks
    print(f"\n[2/4] Classifying chunks and building CQ hierarchy...")
    all_chunks: List[ClassifiedChunk] = []
    chunk_idx = 0
    for page in extracted_pages:
        page_chunks = build_hierarchical_chunks(
            markdown_text=page["markdown"],
            subject_code=subject_code,
            language=language,
            page_no=page["page_no"],
            start_chunk_index=chunk_idx
        )
        all_chunks.extend(page_chunks)
        chunk_idx += len(page_chunks)

    print(f"  -> Produced {len(all_chunks)} classified chunks:")
    type_counts = {}
    for c in all_chunks:
        type_counts[c.chunk_type] = type_counts.get(c.chunk_type, 0) + 1
    for c_type, count in type_counts.items():
        print(f"     - {c_type}: {count}")

    # 4. Generate Embeddings
    print(f"\n[3/4] Generating 1024-dim BGE-M3 embeddings via Ollama...")
    embeddings: List[List[float]] = []
    t_emb_start = time.time()
    for i, chunk in enumerate(all_chunks, 1):
        emb = get_embedding(chunk.content)
        embeddings.append(emb)
        if i % 10 == 0 or i == len(all_chunks):
            print(f"  -> Embedded {i}/{len(all_chunks)} chunks...")
    print(f"  -> Embeddings complete in {time.time() - t_emb_start:.1f}s")

    # 5. Store / Export
    print(f"\n[4/4] Writing to targets...")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    if target in ("chroma", "both"):
        collection = get_chroma_collection()
        save_to_chroma(
            collection=collection,
            chunks=all_chunks,
            embeddings=embeddings,
            subject_code=subject_code,
            language=language,
            chapter_no=chapter_no,
            source_filename=pdf_filename
        )
        print(f"  -> Saved {len(all_chunks)} chunks to local ChromaDB collection ('curriculum_chunks').")

    if target in ("supabase_sql", "both"):
        sql = generate_supabase_sql(
            chunks=all_chunks,
            embeddings=embeddings,
            subject_code=subject_code,
            language=language,
            chapter_id=chapter_id,
            edition_year=2026,
            model_name="bge-m3",
            model_version="v1"
        )
        out_sql_file = OUTPUT_DIR / f"{subject_code}_{language}_ch{chapter_no}_insert.sql"
        out_sql_file.write_text(sql, encoding="utf-8")
        print(f"  -> Generated Supabase batch SQL at: {out_sql_file} ({len(sql.splitlines())} lines)")

    # 6. Cleanup memory
    gc.collect()
    print("\n[✓] Ingestion step complete for Chapter " + str(chapter_no))


def main():
    parser = argparse.ArgumentParser(description="SheraTutor: Batch Textbook Ingest CLI.")
    parser.add_argument("--subject", required=True, choices=["SSC-CHEM", "SSC-MATH", "SSC-ENG"], help="Subject code")
    parser.add_argument("--language", choices=["bn", "en", "both"], default="both", help="Language edition")
    parser.add_argument("--chapter", type=int, default=1, help="Chapter number to ingest")
    parser.add_argument("--chapter-id", help="UUID of chapter in Supabase chapters table")
    parser.add_argument("--start-page", type=int, help="Optional manual start page (1-indexed)")
    parser.add_argument("--end-page", type=int, help="Optional manual end page (1-indexed)")
    parser.add_argument("--model", default=DEFAULT_VISION_MODEL, help="Ollama vision model")
    parser.add_argument("--target", choices=["chroma", "supabase_sql", "both"], default="both", help="Storage target")
    parser.add_argument("--dpi", type=int, default=150, help="Rendering DPI (default: 150)")
    args = parser.parse_args()

    if not check_ollama_status():
        print("Error: Ollama daemon is not responding at http://localhost:11434.", file=sys.stderr)
        sys.exit(1)

    subj = SUBJECT_PDF_MAP[args.subject]
    default_pages = subj["sample_chapter_pages"].get(args.chapter, (1, 10))
    start_p = args.start_page or default_pages[0]
    end_p = args.end_page or default_pages[1]

    # Chapter ID placeholder if not supplied
    ch_id = args.chapter_id or f"00000000-0000-0000-0000-{args.chapter:012d}"

    languages = ["bn", "en"] if args.language == "both" else [args.language]
    for lang in languages:
        run_batch_ingest(
            subject_code=args.subject,
            language=lang,
            start_page=start_p,
            end_page=end_p,
            chapter_no=args.chapter,
            chapter_id=ch_id,
            vision_model=args.model,
            target=args.target,
            dpi=args.dpi
        )


if __name__ == "__main__":
    main()
