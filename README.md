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
- **Current Gemini model IDs**, read from env, never hardcoded — 1.5 and 2.0
  are already shut down; pin via `GENKIT_*_MODEL` env vars.
- **`marker_single --mode balanced`**, no `--langs` flag, Qwen3-VL instead
  of llava for local captioning.
- **A resumable `ingestion_jobs` table** instead of relying on Colab session
  state, which can terminate without warning.

## Getting started

```bash
# 1. Database — once Supabase is authenticated (`supabase link`):
supabase db push          # applies supabase/migrations/*.sql
supabase db execute -f supabase/seed.sql

# 2. Web app
cd web
cp .env.example .env.local   # fill in Supabase + Gemini credentials
npm install
npm run dev

# 3. Curriculum ingestion (after the DB is up)
cd ingestion
pip install -r requirements.txt
cp .env.example .env
python ingest.py --pdf textbooks/physics_en.pdf --subject-code SSC-PHY --language en --chapter-no 3
```

## What's implemented vs. what's next

**Implemented:** waitlist landing page with PDPA-aware guardian-consent
capture, email/Google auth, onboarding with an under-18 age gate, student
dashboard (momentum score, weakness heatmap, quick wins), script upload with
client-side downscaling, the full 4-layer Genkit grading pipeline with
provenance tracking, evaluation breakdown UI, and the "Explain it simply"
tutor chat with a minor-safety pre-filter.

**Explicitly not implemented yet** (tracked in the review, not silently
skipped): a real production job queue (grading currently dispatches via
Next's `after()`, adequate for the vertical slice — see
`src/app/api/submissions/route.ts` for the swap-to-`pgmq` note), the B2B
institutional dashboard, the question-paper generator (FR-GEN-*), guardian
consent is checkbox-acknowledgement for the pilot rather than verified
SMS-OTP (see `src/app/actions/onboarding.ts`), and the golden evaluation set
the review recommends building before scaling ingestion past the vertical
slice.
