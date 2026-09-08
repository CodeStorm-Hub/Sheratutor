# Implementation Plan: Complete Local Vision Extraction & RAG Pipeline for NCTB Textbooks (Excluding Physics)

A production-grade, resource-optimized pipeline for extracting all NCTB Class 9–10 secondary textbooks (both Bengali and English editions) locally using vision-language models via Ollama, generating multilingual embeddings with `bge-m3`, and storing/retrieving chunks via hybrid RAG in both local vector storage and the live Supabase instance.

> [!IMPORTANT]
> **Physics (`SSC-PHY`) Skipped**:
> As verified in the Supabase database audit, **736 chunks across all core chapters of Physics are already extracted, embedded, and indexed** in both English (`370 chunks`) and Bengali (`366 chunks`). Physics is excluded from this ingestion queue.

---

## Target Scope: Phase 2 Core Subjects + Remaining 32 Subjects

### 1. Immediate High-Priority Subjects (Phase 2 STEM & Core)
1. **Chemistry (`SSC-CHEM`)** — 12 Chapters
   * Bengali Edition: `Secondary (BV)-2026_Class 9-10_Chemistry_compressed.pdf` (98.15 MB)
   * English Edition: `Chemistry 9, com_compressed.pdf` (50.85 MB)
2. **General Mathematics (`SSC-MATH`)** — 17 Chapters
   * Bengali Edition: `Secondary (BV)-2026_Class 9-10_Math_compressed.pdf` (101.32 MB)
   * English Edition: `Math-9, com _compressed.pdf` (72.05 MB)
3. **English (`SSC-ENG`)** — 10 Chapters
   * English For Today: `Secondary (BV)-2026_Class 9-10_English For Today_compressed.pdf` (37.64 MB)
   * English Grammar & Composition: `Secondary (BV)-2026_Class 9-10_English Grammar and Composition_compressed.pdf` (83.49 MB)

### 2. Secondary STEM & Commerce Queue (Follow-up)
* **Biology** (BV & EV), **Higher Mathematics** (BV & EV)
* **Accounting** (BV & EV), **Finance & Banking** (BV & EV), **Business Entrepreneurship** (BV & EV)
* **ICT** (BV & EV), **General Science** (BV & EV)
* Followed by Humanities, Moral/Religion, and Electives.

---

## User Review Required

> [!IMPORTANT]
> **Hardware Profile & Model Sizing (GTX 1050 Ti 4GB VRAM + i5-8300H)**:
> - **Primary VLM**: `qwen2.5-vl:3b` (~2.2 GB VRAM) or `qwen2-vl:2b` (~1.8 GB VRAM). Fits entirely inside your 4GB GPU VRAM, delivering ~2–5 sec/page inference with high accuracy on Bengali typography, complex conjuncts (যুক্তবর্ণ), chemical symbols, and LaTeX formulas.
> - **Embedding Model**: `bge-m3` via Ollama (1024 dimensions), matching the `chunk_embeddings` column type and HNSW index in Supabase.

> [!TIP]
> **Database Sync**:
> Newly extracted chunks for Chemistry, Mathematics, and English will be formatted to directly insert into the live Supabase tables (`curriculum_chunks` and `chunk_embeddings`), joining the existing 736 Physics chunks, while simultaneously saving locally into a ChromaDB cache for offline development.

---

## Proposed Changes

### Component 1: Local Vision Extraction Engine

#### [NEW] [local_vision_extractor.py](file:///home/kratzer/workspace/Sheratutor/ingestion/local_dev/local_vision_extractor.py)
* **High-DPI PDF Rasterizer**: Uses `pymupdf` to render PDF pages to in-memory PIL images at 150 DPI.
* **Ollama Vision Client**:
  * Calls `/api/generate` with base64 encoded images to `qwen2.5-vl:3b`.
  * Enforces deterministic extraction (`temperature: 0.0`).
  * System prompt designed for NCTB secondary curriculum:
    * Verbatim transcription of Bengali narrative text.
    * Automatic Unicode normalization (`unicodedata.normalize('NFC', text)`).
    * LaTeX conversion for math and chemistry expressions (e.g. chemical reaction equations $2\text{Na} + \text{Cl}_2 \to 2\text{NaCl}$, fractions, matrices).
    * Preservation of Creative Question (সৃজনশীল প্রশ্ন / CQ) hierarchy: Stimulus (উদ্দীপক) + sub-questions `(ক, খ, গ, ঘ)`.
    * Markdown table formatting for commerce ledgers and science data tables.

---

### Component 2: Chunk Classifier & Hierarchical Parser

#### [NEW] [chunk_classifier.py](file:///home/kratzer/workspace/Sheratutor/ingestion/local_dev/chunk_classifier.py)
* Inspects extracted Markdown text and tags chunks by type:
  * `theory`: Standard textbook explanatory content.
  * `worked_example`: Mathematical or chemistry numerical problems with solutions.
  * `cq_stimulus`: The introductory scenario/passage for Creative Questions.
  * `cq_subquestion`: Individual questions `(ক, খ, গ, ঘ)`.
* Generates hierarchical `parent_chunk_id` linkages so that when a sub-question is retrieved, the parent stimulus is joined automatically.
* Extracts section numbers (`section_no`) and titles (`section_title`).

---

### Component 3: Local Vector Store & Supabase Dual-Target Exporter

#### [NEW] [embed_and_store.py](file:///home/kratzer/workspace/Sheratutor/ingestion/local_dev/embed_and_store.py)
* **Embedding Generator**: Calls Ollama's `/api/embed` using `bge-m3` to produce 1024-dimensional normalized vectors.
* **Dual Exporter**:
  * **ChromaDB / Local Cache**: Stores locally for instant offline search.
  * **Supabase Exporter**: Directly writes to `curriculum_chunks` and `chunk_embeddings` or outputs batch-optimized SQL migration scripts matching the existing schema and HNSW index.

---

### Component 4: Batch Ingestion Orchestrator & CLI

#### [NEW] [batch_ingest_cli.py](file:///home/kratzer/workspace/Sheratutor/ingestion/batch_ingest_cli.py)
* Interactive and unattended batch ingestion runner with explicit skip filter for Physics:
  ```bash
  # Ingest Chemistry Chapter 1 (both BN and EN)
  python ingestion/batch_ingest_cli.py --subject SSC-CHEM --start-chapter 1 --end-chapter 3
  
  # Ingest General Math Chapter 1
  python ingestion/batch_ingest_cli.py --subject SSC-MATH --chapter 1
  ```
* Features:
  * Checkpointing & resumption per chapter.
  * Automatic VRAM garbage collection (`gc.collect()`).
  * Strict validation ensuring physics books are skipped.

---

### Component 5: Retrieval Verification Test Suite

#### [NEW] [test_hybrid_retrieval.py](file:///home/kratzer/workspace/Sheratutor/ingestion/local_dev/test_hybrid_retrieval.py)
* Verifies hybrid dense + sparse search across Chemistry, Mathematics, and English:
  * Tests Bengali queries against English chunks (cross-lingual retrieval).
  * Tests exact formula retrieval (e.g. $PV = nRT$, $(a+b)^2 = a^2 + 2ab + b^2$).
  * Verifies CQ Stimulus attachment when retrieving sub-questions.

---

## Verification Plan

### Automated Execution
1. **Ollama Service Health Check**:
   ```bash
   curl -s http://localhost:11434/api/tags
   ```
2. **Single-Page Vision Extraction Smoke Test**:
   Run extraction on page 10 of `Secondary (BV)-2026_Class 9-10_Chemistry_compressed.pdf` (Chemistry Chapter 1, "Concepts of Chemistry" / "রসায়নের ধারণা") and verify LaTeX and Bengali text formatting:
   ```bash
   python ingestion/local_dev/local_vision_extractor.py --pdf "ingestion/textbooks/Secondary (BV)-2026_Class 9-10_Chemistry_compressed.pdf" --page 10
   ```
3. **End-to-End Chapter Test**:
   Ingest Chemistry Chapter 1 ("Concepts of Chemistry" / "রসায়নের ধারণা") in both BN and EN:
   ```bash
   python ingestion/batch_ingest_cli.py --subject SSC-CHEM --chapter 1 --language en
   python ingestion/batch_ingest_cli.py --subject SSC-CHEM --chapter 1 --language bn
   ```
4. **Retrieval Benchmark**:
   Run `test_hybrid_retrieval.py` for Chemistry queries and verify cosine similarity $\ge 0.65$.

### Manual Verification
- Review generated Markdown snippets to ensure chemical reaction formulas (e.g. $\text{H}_2 + \text{O}_2 \to \text{H}_2\text{O}$) and Bengali typography are intact.
