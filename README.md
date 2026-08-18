# SheraTutor — SSC Phase (B2C Web Portal)

Bangladesh's first AI board examiner — free for every student, funded by
institutions. This repo is the SSC-phase implementation: a Next.js portal
where a student photographs a handwritten answer script and gets it graded
against the real NCTB curriculum and board rubric, with a step-by-step
deduction breakdown.

Start with [`docs/review/SSC_Phase_Technical_Review.md`](docs/review/SSC_Phase_Technical_Review.md)
— a technical/legal review of the original hand-off guide against current
(Aug 2026) upstream sources. Every non-obvious decision in this codebase
traces back to a specific finding in that document; comments reference it
by section (e.g. `docs/review §7.9`) rather than re-explaining the reasoning
inline.

**Test User**: verify.tester@sheratutor.ai / VerifyPass123!

## Layout

```
docs/                    Product/business docs + the technical review
supabase/migrations/     Full DB schema: RLS, versioned rubrics/embeddings,
                          tenant isolation, provenance, PDPA-aware consent
supabase/seed.sql        4-subject/8-book vertical-slice seed data
ingestion/                NCTB textbook -> curriculum_chunks pipeline
  textbooks/               Source PDFs (gitignored) + SOURCE_MANIFEST.tsv
  ingest.py                marker-pdf (balanced mode) + embeddings -> Supabase
web/                      Next.js 16 / React 19 app
  src/ai/                  Genkit 4-layer grading pipeline (OCR -> RAG ->
                            reasoning -> structured rubric evaluator)
  src/app/                 Routes: waitlist landing, auth, onboarding,
                            dashboard, script upload, evaluation breakdown
  src/lib/supabase/        Browser/server/service-role clients
```

## Scope: what changed from the original hand-off guide

The [Developer Hand-Off Guide](<Developer_Hand-Off_Guide_ SheraTutor_B2C_Web_Portal_(SSC_Phase).md>)
specified 66 textbooks, `n8n` orchestration, Gemini 1.5 Flash, `llava`, and a
Colab-CLI ingestion loop with a `--langs` flag that no longer exists. This
implementation instead uses:

- **Genkit** (not n8n) for orchestration — type-safe, Zod-enforced structured
  output for the FR-EVAL-02 rubric schema, in-repo with the Next.js backend.
- **8 books** (Physics/Chemistry/Math/English, bn+en), not 66 — matches the
  AI-strategy doc's own subject prioritization; Humanities/Commerce follow
  once grading is proven, not before.
- **NVIDIA NIM** (not Gemini) for vision/OCR + reasoning, free and
  OpenAI-compatible — no Google GenAI key was available; model IDs are still
  read from env, never hardcoded, via `GENKIT_*_MODEL`. Fireworks AI is
  registered as a second provider but held back as a benchmark option, not a
  default — see `web/src/ai/genkit.ts`.
- **`marker_single --mode balanced`**, no `--langs` flag, Qwen3-VL instead
  of llava for local captioning.
- **A resumable `ingestion_jobs` table** instead of relying on Colab session
  state, which can terminate without warning.

## Status: live on Supabase, RAG proven end-to-end

Database, app, and RAG pipeline are running against a real Supabase project
(**SheraTutor**, ap-south-1, ref `qjottictwewysfcjirma`) — not a local stub.
All 9 migrations are applied, the vertical-slice seed data is loaded, and
`web/.env.local` already points at it. See
[`ingestion/local_dev/RAG_TEST_RESULTS.md`](ingestion/local_dev/RAG_TEST_RESULTS.md)
for a full end-to-end retrieval test (real OCR, real embeddings, real HNSW
index, real query — not a mock) and the two migration bugs it caught that a
read-only review couldn't have.

## Getting started

```bash
# 1. Web app — .env.local already has the live project's URL + anon key.
#    Only SUPABASE_SERVICE_ROLE_KEY needs filling in (grab it from the
#    Supabase dashboard — never exposed via the MCP, by design).
cd web
npm install
npm run dev

# 2. Curriculum ingestion — production path (needs NVIDIA_NIM_API_KEY, free
#    at build.nvidia.com; see ingestion/local_dev/ for how the pipeline was
#    originally proven end-to-end before that key was available).
cd ingestion
pip install -r requirements.txt
cp .env.example .env
python ingest.py --pdf textbooks/physics_en.pdf --subject-code SSC-PHY --language en --chapter-no 3
```

To point this at a different (or fresh local) Supabase project instead:

```bash
supabase link                              # once authenticated
supabase db push                           # applies supabase/migrations/*.sql
supabase db execute -f supabase/seed.sql
```

## What's implemented vs. what's next

**Implemented:** waitlist landing page with PDPA-aware guardian-consent
capture, email/Google auth, onboarding with an under-18 age gate, student
dashboard (momentum score, weakness heatmap, quick wins), script upload with
client-side downscaling, the full 4-layer Genkit grading pipeline with
provenance tracking, evaluation breakdown UI, the "Explain it simply"
tutor chat with a minor-safety pre-filter, and the golden-set schema + eval
harness (`web/scripts/eval-golden-set.ts`, see `ingestion/README.md` "Golden
dataset") for measuring transcription fidelity and grading agreement once
real graded scripts are collected.

**Explicitly not implemented yet** (tracked in the review, not silently
skipped): a real production job queue (grading currently dispatches via
Next's `after()`, adequate for the vertical slice — see
`src/app/api/submissions/route.ts` for the swap-to-`pgmq` note), the B2B
institutional dashboard, the question-paper generator (FR-GEN-*), guardian
consent is checkbox-acknowledgement for the pilot rather than verified
SMS-OTP (see `src/app/actions/onboarding.ts`), and the golden evaluation
set's actual *data* — the schema and eval harness exist (see above), but
populating `golden_set_items`/`golden_set_human_grades` with ~30 real
scripts and 3-examiner blind grades is a data-collection step, not a coding
one (`ingestion/README.md` "Golden dataset" has the process).
