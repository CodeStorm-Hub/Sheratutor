#!/usr/bin/env python3
"""
SheraTutor: Production Multimodal Curriculum Pipeline for Chemistry (Class 9-10).
Extracts all 310 pages of Bengali & English editions:
- Multi-column text, balanced LaTeX chemical equations ($...$), formulas, and tables.
- Cross-references cropped 300-DPI diagrams with Supabase CDN URLs.
- Generates 1024-d embeddings via Azure text-embedding-3-large.
- Upserts directly into Supabase PostgreSQL tables: curriculum_chunks & chunk_embeddings.
"""

import os
import sys
import json
import time
import base64
import re
import argparse
from pathlib import Path
from typing import List, Dict, Any, Optional

import fitz  # PyMuPDF
from dotenv import load_dotenv
from openai import AzureOpenAI
from supabase import create_client

# Load environment
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

AZURE_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT", "https://sheratutor-ai-a6e24.openai.azure.com/")
AZURE_KEY = os.getenv("AZURE_OPENAI_API_KEY")
VISION_MODEL = os.getenv("AZURE_OPENAI_DEPLOYMENT_VISION", "gpt-4o-mini")
EMBEDDING_MODEL = os.getenv("AZURE_OPENAI_DEPLOYMENT_EMBEDDING", "text-embedding-3-large")
API_VERSION = "2024-12-01-preview"

SB_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SB_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not AZURE_KEY or not SB_URL or not SB_KEY:
    print("Error: Missing Azure or Supabase credentials in .env")
    sys.exit(1)

azure_client = AzureOpenAI(
    azure_endpoint=AZURE_ENDPOINT,
    api_key=AZURE_KEY,
    api_version=API_VERSION,
)
supabase = create_client(SB_URL, SB_KEY)

# Ground truth chapter definitions
CHEMISTRY_CHAPTERS = [
    {"chapter_no": 1, "start_page": 6, "end_page": 21, "title_en": "Concepts of Chemistry", "title_bn": "রসায়নের ধারণা"},
    {"chapter_no": 2, "start_page": 22, "end_page": 39, "title_en": "States of Matter", "title_bn": "পদার্থের অবস্থা"},
    {"chapter_no": 3, "start_page": 40, "end_page": 63, "title_en": "Structure of Matter", "title_bn": "পদার্থের গঠন"},
    {"chapter_no": 4, "start_page": 64, "end_page": 86, "title_en": "Periodic Table", "title_bn": "পর্যায় সারণি"},
    {"chapter_no": 5, "start_page": 87, "end_page": 113, "title_en": "Chemical Bonds", "title_bn": "রাসায়নিক বন্ধন"},
    {"chapter_no": 6, "start_page": 114, "end_page": 146, "title_en": "Concept of Mole and Chemical Calculation", "title_bn": "মোলের ধারণা ও রাসায়নিক গণনা"},
    {"chapter_no": 7, "start_page": 147, "end_page": 172, "title_en": "Chemical Reactions", "title_bn": "রাসায়নিক বিক্রিয়া"},
    {"chapter_no": 8, "start_page": 173, "end_page": 210, "title_en": "Chemistry and Energy", "title_bn": "রসায়ন ও শক্তি"},
    {"chapter_no": 9, "start_page": 211, "end_page": 237, "title_en": "Acid-Base Balance", "title_bn": "এসিড-ক্ষার সমতা"},
    {"chapter_no": 10, "start_page": 238, "end_page": 265, "title_en": "Mineral Resources: Metal-Nonmetal", "title_bn": "খনিজ সম্পদ: ধাতু-অধাতু"},
    {"chapter_no": 11, "start_page": 266, "end_page": 291, "title_en": "Mineral Resources: Fossils", "title_bn": "খনিজ সম্পদ: জীবাশ্ম"},
    {"chapter_no": 12, "start_page": 292, "end_page": 309, "title_en": "Chemistry in Our Life", "title_bn": "আমাদের জীবনে রসায়ন"},
]

PDF_FILES = {
    "bn": Path(__file__).parent / "textbooks/chemistry_bn.pdf",
    "en": Path(__file__).parent / "textbooks/chemistry_en.pdf",
}

CACHE_DIR = Path(__file__).parent / "cache_azure"

PROMPT_TEMPLATE = """You are an expert scientific OCR and LaTeX typesetter for NCTB Secondary Chemistry (Class 9-10).
Transcribe this textbook page into clean, structured Markdown:
1. Maintain strict fidelity to the printed text in {lang_full}.
2. Format ALL chemical equations, reaction mechanisms, formulas, and math in standard LaTeX:
   - Chemical reactions: $$\\text{{CaCO}}_3 + 2\\text{{HCl}} \\rightarrow \\text{{CaCl}}_2 + \\text{{H}}_2\\text{{O}} + \\text{{CO}}_2 \\uparrow$$
   - Formulas & Stoichiometry: $n = \\frac{{W}}{{M}} = \\frac{{V}}{{22.4}}$, Avogadro's number $6.023 \\times 10^{{23}}$, $\\Delta H = -57.34\\text{{ kJ}}$
   - Electron configurations: $1s^2 2s^2 2p^6 3s^2 3p^6$
   - State symbols: $(s), (l), (g), (aq)$
3. Preserve textbook structure: use ## for main sections, ### for subsections, bullet points, and clean Markdown tables for data.
4. If there is a diagram, figure, or chart on the page, include a short descriptive placeholder: `[DIAGRAM: brief caption]`.
Output ONLY the clean Markdown text without code fences."""

def get_db_metadata(lang: str) -> tuple[dict, str]:
    """Fetches chapter UUIDs and curriculum version UUID for Chemistry."""
    subj_res = supabase.table("subjects").select("id").eq("code", "SSC-CHEM").single().execute()
    subj_id = subj_res.data["id"]

    ver_res = supabase.table("curriculum_versions").select("id").eq("subject_id", subj_id).eq("language_tag", lang).single().execute()
    ver_id = ver_res.data["id"]

    ch_res = supabase.table("chapters").select("id, chapter_no").eq("subject_id", subj_id).execute()
    ch_map = {row["chapter_no"]: row["id"] for row in ch_res.data}

    return ch_map, ver_id

def render_page_b64(pdf_doc: fitz.Document, page_no: int, dpi: int = 200) -> str:
    """Renders 1-indexed page from PDF to base64 JPEG."""
    page = pdf_doc.load_page(page_no - 1)
    pix = page.get_pixmap(dpi=dpi)
    img_bytes = pix.tobytes("jpeg")
    return base64.b64encode(img_bytes).decode("utf-8")

def find_diagram_urls(lang: str, chapter_no: int, page_no: int) -> List[str]:
    """Finds all cropped diagram CDN URLs belonging to this page."""
    figures_dir = Path(__file__).parent / f"output/figures/chemistry/{lang}/ch_{chapter_no:02d}"
    prefix = f"p{page_no:03d}_fig_"
    urls = []
    if figures_dir.exists():
        for f in sorted(figures_dir.glob(f"{prefix}*.png")):
            url = f"{SB_URL}/storage/v1/object/public/curriculum-assets/chemistry/{lang}/ch_{chapter_no:02d}/{f.name}"
            urls.append(url)
    return urls

def extract_page_with_azure(pdf_doc: fitz.Document, page_no: int, lang: str) -> str:
    """Invokes Azure OpenAI Vision to extract Markdown with LaTeX equations."""
    lang_full = "Bengali" if lang == "bn" else "English"
    b64_img = render_page_b64(pdf_doc, page_no)

    prompt = PROMPT_TEMPLATE.format(lang_full=lang_full)

    for attempt in range(3):
        try:
            resp = azure_client.chat.completions.create(
                model=VISION_MODEL,
                messages=[
                    {"role": "user", "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64_img}"}}
                    ]}
                ],
                max_completion_tokens=3000
            )
            content = resp.choices[0].message.content or ""
            return content.strip()
        except Exception as e:
            print(f"    [Retry {attempt+1}/3] Error on page {page_no}: {e}")
            time.sleep(2.0 * (attempt + 1))
    return ""

def generate_1024d_embedding(text: str) -> List[float]:
    """Generates 1024-d dense embedding via Azure text-embedding-3-large."""
    for attempt in range(3):
        try:
            resp = azure_client.embeddings.create(
                input=[text[:8000]],
                model=EMBEDDING_MODEL,
                dimensions=1024
            )
            return resp.data[0].embedding
        except Exception as e:
            time.sleep(1.5 * (attempt + 1))
    return []

def classify_chunk_type(text: str) -> str:
    lower = text.lower()
    if "উদ্দীপক" in text or "stem" in lower:
        return "cq_stimulus"
    elif "প্রশ্ন" in text or "question" in lower or "mcq" in lower or "(ক)" in text or "(খ)" in text:
        return "cq_subquestion"
    elif "|" in text and "---" in text:
        return "table"
    elif "পরীক্ষা" in text or "experiment" in lower or "activity" in lower or "উদাহরণ" in text or "example" in lower:
        return "worked_example"
    return "theory" 

def process_chapter(chapter_info: dict, lang: str, ch_map: dict, ver_id: str):
    ch_no = chapter_info["chapter_no"]
    ch_id = ch_map.get(ch_no)
    start_p = chapter_info["start_page"]
    end_p = chapter_info["end_page"]
    title = chapter_info["title_bn"] if lang == "bn" else chapter_info["title_en"]

    print(f"\n==================================================================")
    print(f"Processing Chapter {ch_no}: {title} ({lang.upper()}) | Pages {start_p} to {end_p}")
    print(f"==================================================================")

    pdf_path = PDF_FILES[lang]
    doc = fitz.open(str(pdf_path))

    lang_cache = CACHE_DIR / f"chemistry_{lang}"
    lang_cache.mkdir(parents=True, exist_ok=True)

    for p in range(start_p, end_p + 1):
        cache_file = lang_cache / f"page_{p:04d}.json"
        
        # 1. Extraction / Cache Read
        if cache_file.exists():
            with open(cache_file, "r", encoding="utf-8") as f:
                page_data = json.load(f)
            md_content = page_data.get("markdown", "")
        else:
            print(f" -> [Page {p}/{end_p}] Extracting with Azure Vision ({VISION_MODEL})...")
            md_content = extract_page_with_azure(doc, p, lang)
            diag_urls = find_diagram_urls(lang, ch_no, p)
            page_data = {
                "page_no": p,
                "chapter_no": ch_no,
                "lang": lang,
                "markdown": md_content,
                "diagram_urls": diag_urls,
                "timestamp": time.time()
            }
            with open(cache_file, "w", encoding="utf-8") as f:
                json.dump(page_data, f, ensure_ascii=False, indent=2)

        if not md_content:
            continue

        diag_urls = page_data.get("diagram_urls", [])
        chunk_type = classify_chunk_type(md_content)

        # 2. Ingest Chunk into Supabase
        print(f" -> [Page {p}] Embedding & Ingesting ({chunk_type}, {len(diag_urls)} diagrams)...")
        emb = generate_1024d_embedding(md_content)

        chunk_payload = {
            "chapter_id": ch_id,
            "curriculum_version_id": ver_id,
            "content_chunk": md_content,
            "content_format": "markdown_with_latex",
            "source_book_page_ref": str(p),
            "diagram_image_urls": diag_urls,
            "chunk_type": chunk_type,
            "chunk_index": p
        }

        # Check existing chunk for this page
        existing = supabase.table("curriculum_chunks").select("id").eq("curriculum_version_id", ver_id).eq("source_book_page_ref", str(p)).execute()

        if existing.data:
            chunk_id = existing.data[0]["id"]
            supabase.table("curriculum_chunks").update(chunk_payload).eq("id", chunk_id).execute()
        else:
            ins = supabase.table("curriculum_chunks").insert(chunk_payload).execute()
            chunk_id = ins.data[0]["id"]

        # Insert / Update embedding
        if emb:
            emb_payload = {
                "chunk_id": chunk_id,
                "model_name": "text-embedding-3-large",
                "model_version": "1",
                "embedding": emb
            }
            # Upsert embedding
            existing_emb = supabase.table("chunk_embeddings").select("id").eq("chunk_id", chunk_id).execute()
            if existing_emb.data:
                supabase.table("chunk_embeddings").update(emb_payload).eq("id", existing_emb.data[0]["id"]).execute()
            else:
                supabase.table("chunk_embeddings").insert(emb_payload).execute()

    print(f"[SUCCESS] Chapter {ch_no} ({title}) fully ingested into Supabase!")

def main():
    parser = argparse.ArgumentParser(description="NCTB Chemistry Multimodal Pipeline")
    parser.add_argument("--lang", choices=["bn", "en", "both"], default="both")
    parser.add_argument("--start-chapter", type=int, default=1)
    parser.add_argument("--end-chapter", type=int, default=12)
    args = parser.parse_args()

    languages = ["bn", "en"] if args.lang == "both" else [args.lang]

    for lang in languages:
        ch_map, ver_id = get_db_metadata(lang)
        for ch in CHEMISTRY_CHAPTERS:
            if args.start_chapter <= ch["chapter_no"] <= args.end_chapter:
                process_chapter(ch, lang, ch_map, ver_id)

if __name__ == "__main__":
    main()
