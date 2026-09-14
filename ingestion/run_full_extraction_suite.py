#!/usr/bin/env python3
"""
SheraTutor: Full Extraction and Ingestion Suite for Chemistry EN, Physics BN, Physics EN.
Executes end-to-end:
1. Gemini Vision extraction with local OCR grounding & diagram box detection
2. Automatic figure cropping
3. Supabase ingestion + 1024-dim gemini-embedding-2 vector generation
"""

import sys
import subprocess
from pathlib import Path
import time

PYTHON_EXE = Path("/home/syed/workspace/Sheratutor/ingestion/.venv/bin/python")
INGESTION_DIR = Path("/home/syed/workspace/Sheratutor/ingestion")

TARGETS = [
    ("mathematics", "bn", 6, 349),  # 344 content pages (Chapters 1–17)
    ("mathematics", "en", 6, 389),  # 384 content pages (Chapters 1–17)
]

def run_step(cmd: list[str], step_name: str):
    print(f"\n{'='*60}\n>>> STARTING: {step_name}\n>>> COMMAND: {' '.join(cmd)}\n{'='*60}\n", flush=True)
    start_time = time.time()
    res = subprocess.run(cmd, cwd=str(INGESTION_DIR))
    elapsed = time.time() - start_time
    if res.returncode != 0:
        print(f"\n[ERROR] Step '{step_name}' failed with return code {res.returncode} after {elapsed:.1f}s.\n", flush=True)
        sys.exit(res.returncode)
    print(f"\n[SUCCESS] Step '{step_name}' completed in {elapsed:.1f}s.\n", flush=True)

def main():
    print("==================================================================", flush=True)
    print("SheraTutor Full Textbook Extraction & Ingestion Pipeline Starting", flush=True)
    print("Tier 2 Targets: Mathematics BN & Mathematics EN", flush=True)
    print("==================================================================\n", flush=True)

    for subj, lang, start_p, end_p in TARGETS:
        print(f"\n##################################################################", flush=True)
        print(f" PROCESSING TARGET: {subj.upper()} ({lang.upper()}) [Pages {start_p} to {end_p}]", flush=True)
        print(f"##################################################################\n", flush=True)

        # 1. Vision extraction
        extract_cmd = [
            str(PYTHON_EXE), "-u", "gemini_vision_extract.py",
            "--subject", subj,
            "--lang", lang,
            "--start-page", str(start_p),
            "--end-page", str(end_p),
            "--model", "gemini-3.1-flash-lite",
            "--pace-delay", "4.2"
        ]
        run_step(extract_cmd, f"Vision Extraction for {subj.upper()} {lang.upper()}")

        # 2. Crop detected figures
        crop_cmd = [
            str(PYTHON_EXE), "-u", "crop_figures_gemini.py",
            "--subject", subj,
            "--lang", lang
        ]
        run_step(crop_cmd, f"Figure Cropping for {subj.upper()} {lang.upper()}")

        # 3. Ingest into Supabase (Chunks & Figures)
        ingest_cmd = [
            str(PYTHON_EXE), "-u", "ingest_gemini_to_supabase.py",
            "--subject", subj,
            "--lang", lang,
            "--purge-first",
            "--skip-embed"
        ]
        run_step(ingest_cmd, f"Supabase Ingest for {subj.upper()} {lang.upper()}")

    print("\n==================================================================", flush=True)
    print("ALL 3 TARGET TEXTBOOKS FULLY EXTRACTED, CROPPED, AND INGESTED!", flush=True)
    print("==================================================================\n", flush=True)

if __name__ == "__main__":
    main()
