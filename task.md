Searched for files: *
Listed directory ingestion
Viewed README.md:1-100
Viewed ingest.py:1-100
Viewed ingest.py:101-200
Viewed upload_figures_supabase.py:1-60
Viewed build_gallery_html.py:1-50

`ingestion/cache_verified` contains the **gold-standard, verified, ground-truth curriculum dataset** for NCTB Chemistry (Bengali Edition), covering all 12 chapters (304 pages, 431,618 characters, 153 authentic scientific diagrams, and 206 chemical equations).

Here is everything we can do with `ingestion/cache_verified`:

---

### 1. Ingest into Supabase for Production Multimodal RAG
This is the primary goal of the Sheratutor architecture:
- **Semantic Chunking (`curriculum_chunks`)**: Slice each verified page into topic-level passages preserving chapter number, page references, and section titles.
- **Dense Embeddings (`chunk_embeddings`)**: Generate 1024-dimensional embeddings (using `bge-m3` via local Ollama or `gemini-embedding-001`) and store them in pgvector with HNSW indexing.
- **Multimodal Visual Retrieval**: Upload the 153 clean diagrams from `ingestion/output/figures_verified/chemistry/bn/` into the Supabase Storage bucket (`curriculum-assets`). When a student asks about a topic (e.g., *"How does a dry cell work?"* or *"What is the difference between solid and liquid particles?"*), Sheratutor can retrieve both the verbatim textbook explanation and display the authentic high-resolution diagram.

---

### 2. Replace Legacy & Flawed Ingestion Caches
In earlier runs:
- `ingestion/cache/chemistry_bn` suffered from OCR hallucinations, missing diagrams, and repetitive text loops.
- `ingestion/cache_azure/chemistry_bn` stopped after Page 14 and produced blank pages and table borders.
- **Action**: We can swap `cache_verified` as the definitive data source for `ingest.py`, `nim_batch_ingest.py`, and `batch_ingest_cli.py`, completely eliminating redundant OCR/LLM API costs and execution time.

---

### 3. Build the Golden Evaluation Benchmark Dataset
As outlined in `supabase/migrations/00000000000011_golden_set.sql`:
- We can extract all end-of-chapter Creative Questions (CQ), Multiple Choice Questions (MCQ), and experimental procedures from the verified cache to create the **Official SSC Chemistry Benchmark Dataset**.
- This enables automated grading of model responses against verified textbook ground truth to measure hallucination rates and pedagogical accuracy.

---

### 4. Interactive Diagram Explorer & Digital Study App
- **Visual Explorer**: We can generate an interactive textbook gallery (updating `build_gallery_html.py` or the Next.js `web/` application) where students can navigate chapter-by-chapter, filter by diagram type (apparatus, molecular models, graphs, hazard symbols), and read the accompanying text.
- **Flashcards & Formula Reference**: Extract all chemical equations and reaction mechanisms ($\Delta H$, half-reactions, definitions) for quick revision.

---

### 5. Bilingual Parallel Alignment with the English Edition
- With `chemistry_bn` verified, we can run a parallel alignment pipeline against `chemistry_en.pdf` (Class 9–10 English version), matching:
  - Bengali diagrams with English diagrams.
  - Terminology pairs (e.g., `গলনাঙ্ক` $\leftrightarrow$ *Melting Point*, `ঊর্ধ্বপাতন` $\leftrightarrow$ *Sublimation*, `জারণ-বিজারণ` $\leftrightarrow$ *Redox*).
  - Cross-lingual RAG so students can ask in Bangla and retrieve references from both editions.

---

### Recommended Next Steps
Which of these would you like to proceed with?
1. **Run Supabase Ingestion**: Chunk `cache_verified`, embed, and upload figures to Supabase Storage for live RAG.
2. **Process English Edition (`chemistry_en.pdf`)**: Run the same verified extraction pipeline on the 310 pages of the English edition.
3. **Build Interactive Gallery / Web Viewer**: Mount the verified text and diagrams in the Next.js frontend or static documentation viewer.