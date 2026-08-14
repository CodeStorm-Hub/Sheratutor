#!/usr/bin/env python3
"""
SheraTutor: Robust Pure-Python GPU/CPU Ingestion Pipeline for NCTB SSC Physics (Kaggle).
Uses Surya OCR (PyTorch) + PyMuPDF for reliable, container-agnostic page extraction,
normalizes LaTeX equations and Bengali numerals, classifies pedagogical chunk types 
(Theory, Worked Examples, CQ Stimulus + Sub-questions), computes 1024-dim BGE-M3 embeddings,
and batch-inserts incrementally into Supabase.
"""

import os
import sys
import subprocess
import json
import re
import uuid
import time
from pathlib import Path

# 1. Install pure PyTorch OCR dependencies
def ensure_packages():
    print("=== [1/6] Ensuring Dependencies ===", flush=True)
    required_packages = [
        "surya-ocr==0.14.7",
        "pymupdf",
        "Pillow",
        "sentence-transformers",
        "supabase",
        "tqdm"
    ]
    for pkg in required_packages:
        pkg_name = pkg.split("==")[0].replace("-", "_")
        try:
            __import__(pkg_name)
        except ImportError:
            print(f"Installing {pkg}...", flush=True)
            subprocess.run([sys.executable, "-m", "pip", "install", "-q", pkg], check=True)

ensure_packages()

import torch  # type: ignore

# 2. Configure Device: Determine if CUDA capability supports modern PyTorch
target_device = "cpu"
if torch.cuda.is_available():
    try:
        cap = torch.cuda.get_device_capability()
        print(f"Detected GPU: {torch.cuda.get_device_name(0)} (Compute Capability {cap})", flush=True)
        if cap[0] >= 7:
            target_device = "cuda"
            print("Enabling CUDA GPU acceleration.", flush=True)
        else:
            print(f"GPU Capability {cap} is sm_60 (P100). Setting PyTorch device to CPU to avoid CUDA kernel mismatch.", flush=True)
            target_device = "cpu"
    except Exception as e:
        print(f"CUDA check warning: {e}. Defaulting to CPU.", flush=True)
        target_device = "cpu"
else:
    print("No CUDA GPU detected. Running on multi-core CPU.", flush=True)
    target_device = "cpu"

os.environ["TORCH_DEVICE"] = target_device

import pymupdf  # type: ignore
from PIL import Image  # type: ignore
from surya.detection import DetectionPredictor  # type: ignore
from surya.recognition import RecognitionPredictor  # type: ignore
from sentence_transformers import SentenceTransformer  # type: ignore
from supabase import create_client, Client  # type: ignore
from tqdm import tqdm  # type: ignore

print(f"PyTorch Version: {torch.__version__} | Active Device: {target_device}", flush=True)

# Supabase Configuration
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "https://qjottictwewysfcjirma.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqb3R0aWN0d2V3eXNmY2ppcm1hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjU1MDEwMSwiZXhwIjoyMTAyMTI2MTAxfQ.E2KD2UxtBwm9YotncSB4_dO2_bHXJjGN1PUFqgSPqqQ")
EMBEDDING_MODEL_NAME = "bge-m3"
EMBEDDING_MODEL_VERSION = "v1"

# Standard 14 Chapters for NCTB SSC Physics
PHYSICS_CHAPTERS = [
    {"chapter_no": 1, "title_en": "Physical World and Measurement", "title_bn": "ভৌত রাশি ও পরিমাপ"},
    {"chapter_no": 2, "title_en": "Motion", "title_bn": "গতি"},
    {"chapter_no": 3, "title_en": "Force", "title_bn": "বল"},
    {"chapter_no": 4, "title_en": "Work, Power and Energy", "title_bn": "কাজ, ক্ষমতা ও শক্তি"},
    {"chapter_no": 5, "title_en": "State of Matter and Pressure", "title_bn": "পদার্থের অবস্থা ও চাপ"},
    {"chapter_no": 6, "title_en": "Effect of Heat on Matter", "title_bn": "বস্তুর উপর তাপের প্রভাব"},
    {"chapter_no": 7, "title_en": "Waves and Sound", "title_bn": "তরঙ্গ ও শব্দ"},
    {"chapter_no": 8, "title_en": "Reflection of Light", "title_bn": "আলোর প্রতিফলন"},
    {"chapter_no": 9, "title_en": "Refraction of Light", "title_bn": "আলোর প্রতিসরণ"},
    {"chapter_no": 10, "title_en": "Static Electricity", "title_bn": "স্থির তড়িৎ"},
    {"chapter_no": 11, "title_en": "Current Electricity", "title_bn": "চল তড়িৎ"},
    {"chapter_no": 12, "title_en": "Magnetic Effect of Current", "title_bn": "বিদ্যুতের চৌম্বক ক্রিয়া"},
    {"chapter_no": 13, "title_en": "Modern Physics and Electronics", "title_bn": "আধুনিক পদার্থবিজ্ঞান ও ইলেকট্রনিক্স"},
    {"chapter_no": 14, "title_en": "Physics to Save Life", "title_bn": "জীবন বাঁচাতে পদার্থবিজ্ঞান"}
]

BN_DIGIT_MAP = str.maketrans("০১২৩৪৫৬৭৮৯", "0123456789")

def normalize_math_digits(text: str) -> str:
    """Normalizes Bengali digits to Arabic numbers inside LaTeX / math formulas."""
    def replace_digits(match):
        math_content = match.group(0)
        return math_content.translate(BN_DIGIT_MAP)
    
    text = re.sub(r"\$\$.*?\$\$", replace_digits, text, flags=re.DOTALL)
    text = re.sub(r"\$.*?\$", replace_digits, text)
    text = re.sub(r"<math>.*?</math>", replace_digits, text, flags=re.DOTALL)
    return text

def classify_chunk(text: str) -> str:
    """Classifies chunk into pedagogical type."""
    lower_text = text.lower()
    if "গাণিতিক উদাহরণ" in text or "mathematical example" in lower_text or "example 2." in lower_text or "example 3." in lower_text:
        return "worked_example"
    elif "সৃজনশীল প্রশ্ন" in text or "creative question" in lower_text:
        return "cq_stimulus"
    elif re.search(r"^[(\[]?[কখগঘabcd][)\]\.]", text.strip(), re.MULTILINE):
        return "cq_subquestion"
    elif text.strip().startswith("|") and text.count("|") > 4:
        return "table"
    return "theory"

def extract_section_info(text: str) -> tuple[str | None, str | None]:
    """Extracts section number and title if present in chunk text."""
    match = re.search(r"(?:^|\n)(?:#{1,4}\s*)?(\d+\.\d+)\s+([^\n]+)", text)
    if match:
        return match.group(1).strip(), match.group(2).strip()
    return None, None

def chunk_page_paragraphs(text: str, max_chars: int = 1200) -> list[str]:
    """Splits raw page OCR text into paragraph-aware chunks."""
    paras = [p.strip() for p in text.split("\n\n") if p.strip()]
    if not paras:
        paras = [p.strip() for p in text.split("\n") if p.strip()]
    
    chunks, current = [], ""
    for p in paras:
        if len(current) + len(p) > max_chars and current:
            chunks.append(current)
            current = p
        else:
            current = f"{current}\n\n{p}" if current else p
    if current:
        chunks.append(current)
    return [c for c in chunks if len(c.strip()) >= 25]

def main():
    print("=== [2/6] Connecting to Supabase & Ensuring Schema ===", flush=True)
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    subj_res = supabase.table("subjects").select("id").eq("code", "SSC-PHY").execute()
    if not subj_res.data:
        subj_res = supabase.table("subjects").insert({
            "code": "SSC-PHY",
            "name_en": "Physics",
            "name_bn": "পদার্থবিজ্ঞান",
            "level": "SSC",
            "subject_group": "SCIENCE"
        }).execute()
    subject_id = subj_res.data[0]["id"]
    print(f"Subject SSC-PHY ID: {subject_id}", flush=True)
    
    versions = {}
    for lang in ["bn", "en"]:
        v_res = supabase.table("curriculum_versions").select("id").eq("subject_id", subject_id).eq("language_tag", lang).execute()
        if not v_res.data:
            v_res = supabase.table("curriculum_versions").insert({
                "subject_id": subject_id,
                "edition_year": 2026,
                "language_tag": lang,
                "is_active": True,
                "notes": f"NCTB 2026 Physics ({lang})"
            }).execute()
        versions[lang] = v_res.data[0]["id"]

    chapter_map = {}
    for ch in PHYSICS_CHAPTERS:
        c_res = supabase.table("chapters").select("id").eq("subject_id", subject_id).eq("chapter_no", ch["chapter_no"]).execute()
        if not c_res.data:
            c_res = supabase.table("chapters").insert({
                "subject_id": subject_id,
                "chapter_no": ch["chapter_no"],
                "title_en": ch["title_en"],
                "title_bn": ch["title_bn"]
            }).execute()
        chapter_map[ch["chapter_no"]] = c_res.data[0]["id"]
    print(f"Seeded {len(chapter_map)} chapters.", flush=True)

    # Locate input PDFs
    print("=== [3/6] Locating Input PDFs ===", flush=True)
    all_pdfs = list(Path("/kaggle/input").rglob("*.pdf")) + list(Path(".").rglob("*.pdf"))
    print(f"Discovered {len(all_pdfs)} PDF files: {[str(p) for p in all_pdfs]}", flush=True)
    pdf_bn = next((p for p in all_pdfs if "physics_bn" in p.name.lower()), None)
    pdf_en = next((p for p in all_pdfs if "physics_en" in p.name.lower()), None)

    print(f"Bangla PDF: {pdf_bn}", flush=True)
    print(f"English PDF: {pdf_en}", flush=True)
    if not pdf_bn or not pdf_en:
        raise FileNotFoundError(f"Could not locate both physics_bn.pdf and physics_en.pdf in {all_pdfs}!")

    # Initialize Surya OCR and BGE-M3 models
    print(f"=== [4/6] Initializing Surya OCR & BGE-M3 on {target_device} ===", flush=True)
    det_predictor = DetectionPredictor()
    rec_predictor = RecognitionPredictor()
    print("Surya OCR Predictors initialized.", flush=True)

    embed_model = SentenceTransformer("BAAI/bge-m3", device=target_device)
    print(f"BGE-M3 Embedding model loaded on {target_device} (Dim: {embed_model.get_sentence_embedding_dimension()})", flush=True)

    # Ingestion Targets
    targets = [
        ("bn", pdf_bn, versions["bn"]),
        ("en", pdf_en, versions["en"])
    ]

    out_base = Path("/kaggle/working/output")
    out_base.mkdir(parents=True, exist_ok=True)

    for lang, pdf_path, cur_version_id in targets:
        print(f"\n=== [5/6] OCR & Ingesting {lang.upper()} ({pdf_path.name}) ===", flush=True)
        doc = pymupdf.open(str(pdf_path))
        num_pages = len(doc)
        print(f"Total Pages to Process: {num_pages}", flush=True)

        processed_chunks = []
        last_stimulus_id = None
        global_chunk_idx = 0
        current_chapter_no = 1

        # Process in page batches for speed and memory efficiency
        page_batch_size = 4
        for start_p in tqdm(range(0, num_pages, page_batch_size), desc=f"OCR {lang.upper()}"):
            end_p = min(start_p + page_batch_size, num_pages)
            images = []
            page_numbers = []

            for p_num in range(start_p, end_p):
                pix = doc[p_num].get_pixmap(dpi=150)
                img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
                images.append(img)
                page_numbers.append(p_num + 1)

            try:
                # Run Surya OCR on image batch
                batch_results = rec_predictor(images, det_predictor=det_predictor)
            except Exception as e:
                print(f"\nBatch OCR warning on pages {page_numbers}: {e}. Retrying individually...", flush=True)
                batch_results = []
                for single_img in images:
                    try:
                        single_res = rec_predictor([single_img], det_predictor=det_predictor)
                        batch_results.extend(single_res)
                    except Exception as single_err:
                        print(f"Skipping page due to OCR error: {single_err}", flush=True)

            for p_idx, res in enumerate(batch_results):
                page_no = page_numbers[p_idx]
                page_text = "\n".join(line.text for line in res.text_lines if line.text.strip())
                if len(page_text.strip()) < 20:
                    continue

                page_chunks = chunk_page_paragraphs(page_text)
                for chunk_text in page_chunks:
                    norm_content = normalize_math_digits(chunk_text)
                    chunk_type = classify_chunk(norm_content)
                    sec_no, sec_title = extract_section_info(norm_content)

                    if sec_no:
                        try:
                            ch_cand = int(sec_no.split(".")[0])
                            if 1 <= ch_cand <= 14:
                                current_chapter_no = ch_cand
                        except ValueError:
                            pass

                    chapter_id = chapter_map.get(current_chapter_no, chapter_map[1])
                    chunk_id = str(uuid.uuid4())
                    parent_id = None

                    if chunk_type == "cq_stimulus":
                        last_stimulus_id = chunk_id
                    elif chunk_type == "cq_subquestion" and last_stimulus_id:
                        parent_id = last_stimulus_id
                    elif chunk_type == "theory":
                        last_stimulus_id = None

                    processed_chunks.append({
                        "id": chunk_id,
                        "chapter_id": chapter_id,
                        "curriculum_version_id": cur_version_id,
                        "content_chunk": norm_content,
                        "content_format": "markdown",
                        "source_book_page_ref": str(page_no),
                        "chunk_index": global_chunk_idx,
                        "chunk_type": chunk_type,
                        "parent_chunk_id": parent_id,
                        "section_no": sec_no,
                        "section_title": sec_title
                    })
                    global_chunk_idx += 1

            # Incremental save to Supabase every 40 pages to ensure progress is never lost
            if len(processed_chunks) >= 40:
                print(f"\n[Incremental Save] Embedding and inserting {len(processed_chunks)} chunks for {lang.upper()}...", flush=True)
                texts_to_embed = [c["content_chunk"] for c in processed_chunks]
                embeddings = embed_model.encode(
                    texts_to_embed,
                    batch_size=16,
                    show_progress_bar=False,
                    normalize_embeddings=True
                ).tolist()

                db_batch_size = 50
                for b_idx in range(0, len(processed_chunks), db_batch_size):
                    chunk_batch = processed_chunks[b_idx:b_idx + db_batch_size]
                    emb_batch = embeddings[b_idx:b_idx + db_batch_size]

                    supabase.table("curriculum_chunks").upsert(chunk_batch, on_conflict="id").execute()
                    emb_rows = [
                        {
                            "chunk_id": chunk["id"],
                            "model_name": EMBEDDING_MODEL_NAME,
                            "model_version": EMBEDDING_MODEL_VERSION,
                            "embedding": emb
                        }
                        for chunk, emb in zip(chunk_batch, emb_batch)
                    ]
                    supabase.table("chunk_embeddings").upsert(emb_rows, on_conflict="chunk_id,model_name,model_version").execute()

                processed_chunks = []

        # Flush any remaining chunks
        if processed_chunks:
            print(f"\n[Final Save] Embedding and inserting {len(processed_chunks)} remaining chunks for {lang.upper()}...", flush=True)
            texts_to_embed = [c["content_chunk"] for c in processed_chunks]
            embeddings = embed_model.encode(
                texts_to_embed,
                batch_size=16,
                show_progress_bar=False,
                normalize_embeddings=True
            ).tolist()

            for b_idx in range(0, len(processed_chunks), 50):
                chunk_batch = processed_chunks[b_idx:b_idx + 50]
                emb_batch = embeddings[b_idx:b_idx + 50]

                supabase.table("curriculum_chunks").upsert(chunk_batch, on_conflict="id").execute()
                emb_rows = [
                    {
                        "chunk_id": chunk["id"],
                        "model_name": EMBEDDING_MODEL_NAME,
                        "model_version": EMBEDDING_MODEL_VERSION,
                        "embedding": emb
                    }
                    for chunk, emb in zip(chunk_batch, emb_batch)
                ]
                supabase.table("chunk_embeddings").upsert(emb_rows, on_conflict="chunk_id,model_name,model_version").execute()

        print(f"Successfully finished ingestion for {lang.upper()}!", flush=True)

    print("\n=== [6/6] All Textbooks Ingested Successfully! ===", flush=True)

if __name__ == "__main__":
    main()
