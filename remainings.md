### What Has Been Completed

#### A. Database & Schema Architecture (`/supabase`)
*Verified directly via Supabase MCP (`qjottictwewysfcjirma`)*
- **12 Migrations Applied**: All 12 production migrations are active in PostgreSQL with RLS enabled across all 24 tables.
- **Provider & Model Decoupling (§7.2)**: `chunk_embeddings` is separated from `curriculum_chunks` with `model_name`, `model_version`, and 1024-dim vector support (`bge-m3`).
- **Versioned Rubrics (§7.4)**: `rubrics` table is independently versioned with `criteria_json` and step-by-step mark allocations.
- **Data Integrity & Marks (§7.5, §7.8)**: All marks are stored as `numeric(5,2)` (avoiding float accumulation bugs). `STUDENT_PROFILES.group` renamed to `academic_group`.
- **Multi-Tenancy (§7.9)**: `institution_id` denormalized onto `exam_submissions`, `submission_pages`, `grading_results`, `weakness_logs`, and `questions`.
- **Audit & Provenance (§7.12–7.14)**: `grading_results` stores `model_name`, `prompt_version`, `rubric_version_id`, `pipeline_version`. `grading_corrections` and `audit_log` tables exist.
- **Golden Set Schema (§8.1)**: Migration `00000000000011_golden_set.sql` provisioned `golden_set_items`, `golden_set_human_grades`, and `golden_set_model_runs`.
- **Vector Search Function (`match_curriculum_chunks`)**: PostgreSQL RPC handles cosine similarity filtered by subject, curriculum version, and language tag (`bn` / `en`).

---

#### B. Ingestion & RAG Pipeline (`/ingestion`)
- **Marker 2.0 Parser Alignment (§1.1, §1.2)**: Removed obsolete flags, aligned parser with Marker 2.0 block schema, and added `--page-range` support.
- **Ollama Embedding Integration**: Updated `embed_text()` to use `POST /api/embed` with `bge-m3:latest` (eliminating cloud API rate limits and providing native 1024-dim Bengali semantic embeddings).
- **Ingestion State Tracking (§5.1)**: `ingestion_jobs` records every run, page range, chunk count, and execution status.
- **Bilingual Extraction & Vector Search Verified**: Successfully ingested and verified retrieval for NCTB SSC Physics in both English (`physics_en.pdf`) and Bangla (`physics_bn.pdf`) with LaTeX equations ($\vec{A}, \vec{B}$, $v = s/t$, $37^{\circ}\text{C}$).

---

#### C. AI Core & Genkit Flows (`/web/src/ai`)
- **Provider Pivot (§1.4, §5.2)**: Configured Genkit 1.41.0 with OpenAI-compatible adapters for **NVIDIA NIM** (`nemotron-nano-12b-v2-vl`), **Fireworks AI**, and local **Ollama** (`bge-m3`).
- **`retrieve-grounding.ts` (Layer 2)**: Queries Supabase pgvector and returns grounded curriculum chunks with exact book page references.
- **`transcribe.ts` (Layer 1)**: Verbatim handwritten transcription prompt designed with anti-correction constraints (§3).
- **`grade-submission.ts` & `evaluate-rubric.ts` (Layers 3 & 4)**: Multi-layer grading pipeline enforcing Zod schema output, deduction explanations in Bengali and English, and rubric criteria evaluations.
- **`tutor-chat.ts` (Layer 5)**: Socratic AI tutor with academic topic guardrails.
- **Minor-Safety Pre-filter (§8.4)**: Self-harm and crisis keyword detection with fallback escalation to Bangladesh's national helpline (*Kaan Pete Roi: ০৯৬১৩৪২৭৮০০*).

---

#### D. Frontend & Compliance (`/web/src/app`)
- **Bengali Typography (§8.6)**: Configured font stack in [layout.tsx](file:///home/syed/workspace/Sheratutor/web/src/app/layout.tsx) with **Baloo Da 2** (Bengali Display), **Hind Siliguri** (Bengali Body), **Baloo 2** (Latin Display), **Inter** (Latin Body), and **Space Mono** (Stats/Eyebrows).
- **PDPA 2026 Minor Consent Flow (§2.1)**: [onboarding/page.tsx](file:///home/syed/workspace/Sheratutor/web/src/app/onboarding/page.tsx) includes an age gate (`dateOfBirth` < 18 detection), parent/guardian phone number field, and statutory consent confirmation.
- **B2C Pages**: Responsive Landing page with waitlist capture, Supabase Auth (`/login`, `/signup`, `/auth`), Student Dashboard (`/dashboard`), and Upload portal (`/dashboard/upload`).

---

### Remaining Technical Deliverables (Engineering & Product)

Excluding Compliance and Legal items, here is the detailed breakdown of the remaining engineering tasks required for the **SheraTutor B2C Web Portal (SSC Phase)**:

---

### 1. Ingestion & Curriculum RAG Pipeline

#### A. Full 8-Book Ingestion (Core SSC Subjects)
* **Status**: Chapter 2 & 3 of Physics (BN & EN) are ingested and verified.
* **Remaining**: Scale the ingestion pipeline across the remaining chapters of the **4 core SSC subjects** (8 textbooks total):
  1. **Physics** (*পদার্থবিজ্ঞান*) — Bangla & English versions (Ch 1 to Ch 14)
  2. **Chemistry** (*রসায়ন*) — Bangla & English versions
  3. **General Mathematics** (*সাধারণ গণিত*) — Bangla & English versions
  4. **English** (*English for Today*) — Classes 9 & 10
* **Technical Detail**: Use batch chunking with Marker 2.0 and local `bge-m3:latest` embedding generation, tracked via `ingestion_jobs`.

---

### 2. OCR, Transcription & Question Mapping

#### A. Question-to-Region / Page Association
* **Current State**: All uploaded pages of a submission are concatenated into a single text block during grading.
* **Remaining**:
  * **Question Picker on Upload**: Allow students to indicate which page or section corresponds to which question (e.g., *Question 1 (ক, খ) on Page 1*, *Question 1 (গ, ঘ) on Page 2*).
  * **Structured Question Mapping**: Update `submission_answers` to map individual question IDs to specific page slices and transcript chunks.

#### B. Student Transcription Review & Correction UI
* **Problem**: Vision-Language Models (VLMs) can occasionally misread messy handwriting or silently normalize student mistakes.
* **Remaining**:
  * In `/dashboard/submissions/[id]`, display the **Raw Transcribed Text & LaTeX** alongside the original uploaded image.
  * Provide a **"Report OCR Error" / "Edit Transcription"** toggle so the student can verify what the AI read before or after grading.

---

### 3. Asynchronous Grading Queue & Real-Time UX

#### A. Background Worker (`pgmq` / Asynchronous Processing)
* **Current State**: `gradeSubmissionFlow` runs sequentially inside server actions. Multi-page submissions can exceed HTTP request timeouts on slow connections.
* **Remaining**:
  * **Queue Enqueue**: When a student clicks "Submit for Evaluation", enqueue the job with an `idempotency_key` in PostgreSQL (`pgmq` or background worker).
  * **Supabase Realtime Progress**: Stream the evaluation status in real-time to the student's browser:
    $$\text{UPLOADED} \longrightarrow \text{OCR\_PROCESSING} \longrightarrow \text{RETRIEVING\_GROUNDING} \longrightarrow \text{EVALUATING} \longrightarrow \text{COMPLETED}$$

#### B. Visual Rubric Breakdown Display
* **Remaining**:
  * Render the 4-part Creative Question (CQ) rubric breakdown:
    * **ক (Knowledge / জ্ঞানমূলক):** 1 Mark
    * **খ (Comprehension / অনুধাবনমূলক):** 2 Marks
    * **গ (Application / প্রয়োগমূলক):** 3 Marks
    * **ঘ (Higher Order Thinking / উচ্চতর দক্ষতামূলক):** 4 Marks
  * Highlight exact step-by-step deductions with bilingual explanations (*Bangla & English*).

---

### 4. Interactive Socratic Tutor Chat ("Explain It Simply")

#### A. In-Context Chat Drawer in Dashboard
* **Current State**: `tutorChatFlow` is written in `web/src/ai/flows/tutor-chat.ts` with minor-safety pre-filters.
* **Remaining**:
  * Build the interactive chat UI (drawer/modal) on the submission results page.
  * When a student clicks **"বুঝিয়ে বলো" (Explain this step)** on a deduction, automatically initialize the chat pre-loaded with:
    * The exact sub-question
    * The student's answer text
    * The specific rubric rule missed
    * Grounded textbook excerpts

---

### 5. Evaluation Harness & Golden Dataset

#### A. Golden Set Benchmark Runner
* **Current State**: Database tables (`golden_set_items`, `golden_set_human_grades`, `golden_set_model_runs`) are provisioned via migration `0011`.
* **Remaining**:
  * **Populate Corpus**: Insert ~30 real handwritten student exam answers with consensus grades from 3 human examiners.
  * **Automated CI Eval Script**: A CLI/test script (`eval_benchmark.ts` / Python) that runs the grading flow over the golden set and outputs:
    * **Mean Absolute Error (MAE)** in marks
    * **Quadratic Weighted Kappa (QWK)** against human examiners
    * **Character Error Rate (CER)** on messy handwriting vs clean handwriting

---

### 6. Client-Side Optimization & Abuse Prevention

#### A. Low-Bandwidth Image Compression
* **Problem**: Rural Bangladeshi students often upload 12MP–48MP smartphone photos over metered 3G/4G connections.
* **Remaining**:
  * Implement client-side Canvas/WebP downscaling in the upload component before upload (converting a 5MB JPEG/HEIC to ~300KB WebP without losing text readability).

#### B. Daily Grading Quotas & Telemetry
* **Remaining**:
  * Rate-limiting middleware: Limit free students to a generous daily quota (e.g. 5–10 script evaluations/day) to prevent bot scraping and API abuse.
  * Complete token & vision page logging in `grading_results` for operational cost tracking.

---

### Summary Checklist

```markdown
[ ] 1. Ingest remaining chapters for the 8 core SSC textbooks
[ ] 2. Build Question-to-Page mapping in upload flow
[ ] 3. Add Student OCR Review / Edit UI
[ ] 4. Connect Async Worker (`pgmq`) with Supabase Realtime progress
[ ] 5. Wire the "Explain It Simply" Socratic Chat drawer to submission results
[ ] 6. Populate the 30-script Golden Dataset & run the CI evaluation harness
[ ] 7. Add client-side WebP image compression (<300KB)
[ ] 8. Enforce daily student evaluation quotas
```