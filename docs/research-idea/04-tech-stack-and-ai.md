# SheraTutor — Technology Stack & AI Strategy

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend (Phase 1 — Web)** | Next.js, React, Tailwind CSS, Shadcn UI | Fast, responsive web app for rapid iteration and the B2B institutional dashboard |
| **Frontend (Phase 2 — Mobile)** | Flutter, Dart | Cross-platform iOS/Android app for students, with native camera access for scanning answer scripts |
| **Backend & database** | Supabase (Postgres + `pgvector`) | Auth, relational data (users, scores, institutions), and vector storage for curriculum embeddings |
| **AI orchestration** | n8n | Low-code workflow engine chaining: image upload → OCR/vision model → vector DB lookup for grounding → LLM grading/explanation → structured result |
| **Microservices** | Node.js, Python | Custom data extraction, vector chunking, and batch-grading pipelines n8n can trigger |
| **Vision/OCR + grading AI** | See below | The core "examiner" intelligence |

---

## AI Model Strategy — Building the "Super AI Tutor"

This is the hardest and most important part of the product, so it's worth being specific about both **which models** and **how training/grounding actually happens** — this is not "prompt an LLM and hope."

### The core technical challenge

Grading a Bangladeshi board exam script isn't a generic OCR problem. It requires:
1. Reading **handwritten Bangla and English**, including equations, diagrams, and messy student handwriting.
2. Understanding **what the question was actually asking** (CQ-style multi-part questions are common in Bangladesh's system).
3. Applying the **actual board marking rubric** — partial credit for method, specific deductions for missing steps — not just "is the final answer right."
4. Explaining **why** marks were lost, in a way a 15–18 year old can act on.

That's four different capabilities stacked together: vision/OCR, reading comprehension, rubric-based reasoning, and pedagogical explanation.

### Recommended model approach: a hybrid stack, not one model

**Layer 1 — Vision/OCR (reading the handwriting):**
- **Frontier multimodal APIs** (Gemini, GPT-class, or Claude vision models) for the highest accuracy during the pilot phase, when getting grading right matters more than cost per script.
- **Open-source vision-language models** (Qwen-VL family, which supports OCR across 32 languages including strong multilingual document understanding, and DeepSeek-OCR for highly cost-efficient large-scale text extraction) as a self-hosted fallback once volume grows — this is what makes free-for-students financially sustainable at scale, since API cost-per-script for millions of free users would otherwise be unsustainable.

**Layer 2 — Curriculum grounding (knowing what's actually correct):**
- **RAG (Retrieval-Augmented Generation)** over a vector database (Supabase `pgvector`) containing digitized NCTB textbooks, official board marking rubrics, and past board papers.
- Every grading decision is checked against this retrieved context — this is what prevents hallucinated grading and is the difference between "an AI guessing" and "an AI examiner."

**Layer 3 — Bangla-native reasoning and explanation:**
- Bangla-specific fine-tuned language models (e.g., BanglaLLaMA-class models, 3B–11B parameters, trained specifically on Bangla text) as an option for the explanation/tutoring layer, so feedback reads naturally in Bangla rather than as a translated English explanation.
- Alternatively, frontier multilingual models are increasingly strong in Bangla directly and may be sufficient without a dedicated fine-tune in early phases — this is a build-vs-buy decision to validate empirically during the pilot.

**Layer 4 — Rubric-based grading logic:**
- Not just "ask the LLM to grade it" — a structured pipeline where the model must output the specific rubric criteria it matched/missed (in a fixed JSON schema), which is then used to compute the score and generate the deduction explanation. This makes grading auditable and correctable, which matters enormously for trust with schools and parents.

### How "training" actually happens (realistic path, not hype)

1. **Curriculum digitization (Weeks 4–8):** NCTB textbooks and past board papers for Physics, Chemistry, Math, and English are digitized and embedded — this is the foundation everything else is grounded in.
2. **Calibration against real handwriting (Weeks 9–12):** The B2B pilot with 2–3 coaching centers is where the model actually gets "trained" in the practical sense — real, messy student handwriting run through the pipeline, graded output compared against what a human teacher would give, and the prompt/rubric-matching logic iteratively corrected.
3. **Feedback loop from scale:** Every graded script (B2C and B2B) becomes potential training/eval data (with appropriate privacy handling) to keep improving grading consistency over time.
4. **Human-in-the-loop initially:** Especially for CQ (long-form) answers during the pilot phase, a teacher spot-checks a sample of AI-graded scripts before this expands unsupervised — this is both a quality safeguard and a trust-building step with schools.
5. **Expansion:** Once Physics/Chemistry/Math/English are reliable, expand the same pipeline to Humanities and Commerce subjects, which involve more long-form, subjective grading and will need more calibration.

---

## Notes for Engineering Planning

- The four-layer AI approach above (vision/OCR → RAG grounding → Bangla reasoning → structured rubric output) should be built as **separable pipeline stages**, not one monolithic prompt — this makes it possible to swap the underlying model in any one layer (e.g., moving from a proprietary API to a self-hosted open-source model for cost reasons) without rebuilding the whole system.
- Because this is a genuinely fast-moving space, **re-validate the specific model recommendations above against current options before committing** — treat the named models (Qwen-VL, DeepSeek-OCR, BanglaLLaMA, frontier proprietary APIs) as a snapshot of the landscape at time of writing, not a permanent decision.
- Human-in-the-loop review during the pilot phase is a cost center to plan for explicitly in early budgeting — it is a feature of getting grading right, not a temporary inconvenience to rush past.
