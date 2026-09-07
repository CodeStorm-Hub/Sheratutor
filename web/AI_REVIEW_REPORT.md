# SheraTutor — Database + AI Implementation Review & E2E Validation

**Date:** 2026-09-07
**Reviewer session:** Supabase MCP (project `qjottictwewysfcjirma`, Postgres 17.6) + browser automation on local dev server (`http://localhost:3001`, Next.js 16.3.2 / Turbopack)
**Test account:** `syed.salman.reza.181@gmail.com` (student, SSC · SCIENCE · Dhaka Board, 2027 batch)

---

## 0. Executive summary — what works, what is broken

| Area | Status | Evidence |
|---|---|---|
| Auth / login / dashboard shell | ✅ Works | Logged in, dashboard renders |
| Supabase schema, RLS, migrations | ✅ Healthy (minor advisories) | 26 tables, all RLS-enabled; 31 migrations applied |
| pgvector / RAG store (local bge-m3) | ✅ Works | HNSW cosine search returns sensible neighbours |
| **RAG store on Vercel/prod (NIM embedder)** | ❌ **Broken** | Configured embed model `nvidia/llama-nemotron-embed-1b-v2` **no longer exists** on NIM (verified against live `/v1/models`) |
| **Practice paper generation** | ❌ **Broken** | Live test returned `410 status code (no body)`; model `nim/nvidia/nemotron-3-nano-30b-a3b` **retired** from NIM |
| **AI Tutor chat (Socratic agent)** | ❌ **Effectively broken** | Live test hung >2 min, no reply persisted; historic replies are 38–95-char English stubs that violate every pedagogy rule |
| AI grading pipeline (4-layer) | ⚠️ Unverified / stale | Only 1 genuine end-to-end run ever (2026-08-18, scored 0/10); rest is seed data; several referenced models are also retired |
| Mistake analysis | ✅ Works (cosmetic bug) | Renders from `weakness_logs`; literal `##Calculation` markdown leak |
| Study planner | ✅ Works (mostly mock UI) | Deterministic spaced-repetition heuristic; calendar strip + streak are hardcoded demo data |
| Board simulator / Results | ✅ Works (demo data) | Score-history chart & subject-performance bars are not derived from real data |

**Root cause of the three ❌ items is the same:** the NVIDIA NIM model IDs hard-wired in `.env.local` / `src/ai/genkit.ts` have been retired or renamed upstream. Every AI feature that calls a live model is failing or degraded.

---

## 1. Database review (Supabase MCP)

### 1.1 Shape
- **26 public tables**, Postgres 17.6, region `ap-south-1`.
- Core domains: identity (`profiles`, `student_profiles`, `teacher_profiles`, `institutions`), curriculum/RAG (`subjects`, `chapters`, `curriculum_versions`, `curriculum_chunks`, `chunk_embeddings`), assessment (`question_papers`, `questions`, `rubrics`, `exam_submissions`, `submission_pages`, `grading_results`, `grading_corrections`), tutoring (`tutor_chat_sessions`, `tutor_chat_messages`), progress (`weakness_logs`, `study_plans`), eval (`golden_set_*`), ops (`ingestion_jobs`, `audit_log`, `waitlist_signups`).
- **31 migrations** applied cleanly (`20260812171744` … `20260901122343`).

### 1.2 Row counts (live)
| Table | Rows | Note |
|---|---|---|
| `curriculum_chunks` | 2 308 | RAG corpus |
| `chunk_embeddings` | 3 044 | 2 308 bge-m3 + 736 nim-nemotron (partial re-embed) |
| `chapters` | 53 | Physics 14 + Chemistry chapters |
| `rubrics` | 58 | many auto-generated per practice paper |
| `questions` | 60 / `question_papers` 12 | mostly seeded practice papers |
| `tutor_chat_sessions` | 79 / `tutor_chat_messages` | 146 |
| `exam_submissions` | 3 (2 seed, 1 real) | `grading_results` 3 (2 seed, 1 real) |
| `profiles` | 8 (== `auth.users`, no orphans) | |
| `weakness_logs` | 5 | drives mistake-analysis + study-plan |
| `institutions`, `teacher_profiles`, `grading_corrections`, `ingestion_jobs`, `golden_set_*` | 0 | unused so far |

### 1.3 RLS
All 26 tables have `rls_enabled = true` and ≥1 policy. 12 have `FORCE ROW LEVEL SECURITY` (the sensitive ones: submissions, grading, profiles, chat, study plans). No table is exposed unprotected.

### 1.4 Security advisories (Supabase linter)
| Level | Finding | Recommendation |
|---|---|---|
| WARN | `public.verify_waitlist_token` has **mutable `search_path`** and is a **`SECURITY DEFINER`** function executable by `anon` + `authenticated` via `/rest/v1/rpc/` | Pin `SET search_path = ''`, and `REVOKE EXECUTE ... FROM anon, authenticated` (call it only from the server / service-role) — [lint 0011](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable), [0028](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable) |
| WARN | Extension `pg_net` installed in `public` schema | Move to a dedicated `extensions` schema — [lint 0014](https://supabase.com/docs/guides/database/database-linter?lint=0014_extension_in_public) |
| WARN | Auth: **leaked-password protection disabled** (HaveIBeenPwned) | Enable in Auth settings |

### 1.5 Additional issues found by direct query (not linter)

1. **Hard-coded worker secret in the `pg_cron` job definition.** `cron.job.command` for `process-grading-queue` contains a literal fallback:
   `'x-worker-secret', coalesce((select decrypted_secret from vault...), '16715429445cfb805329db5d2377fe116895b1e17deffdfd')`
   Anyone with read on `cron.job` sees a working shared secret for `/api/internal/process-grading-queue`. Remove the literal; fail closed if the vault secret is missing.

2. **Grading cron runs every 30 *minutes*, not every 30 *seconds*.** Schedule is `*/30 * * * * *` (6-field). `cron.job_run_details` shows **293 runs since 2026-09-01** ≈ one run / 30 min. Either pg_cron is parsing it as a 5-field spec or the seconds field is ignored. Effect: a submitted answer sheet can wait up to 30 min before the worker even picks it up. Verify the intended cadence and the actual parse.

3. **4 chapters have multiple `is_active` rubrics** (`SSC-PHY` ch.2 has **48**, ch.3 has 5, ch.1 has 2; `SSC-CHEM` ch.1 has 3). Every generated practice paper inserts a fresh `rubrics` row with `is_active = true` and never supersedes the old one. If any code does `.eq('chapter_id', x).eq('is_active', true).single()` it will break or pick arbitrarily. Add an "one active rubric per (chapter[, question])" constraint or scope rubrics to the paper/question, not the chapter.

4. **`grading_results.model_name` is inconsistent and partly points at retired models:** values seen — `nim/nvidia/nemotron-3-nano-omni-30b-a3b-reasoning`, `nim/nvidia/nemotron-nano-12b-v2-vl`, `nemotron-nano-12b-v2-vl` (no prefix). None match `MODELS.reasoning` in the current config. Provenance is unreliable.

5. **2 `questions` rows have `rubric_id = NULL`** — acceptable only if they are MCQ; confirm.

6. **33 unused indexes** flagged (performance linter, INFO). Expected on a low-traffic DB — revisit after real traffic, don't drop yet.

---

## 2. Vector database / RAG review

### 2.1 Store
- Extension `vector 0.8.2`. `chunk_embeddings.embedding` = `vector(1024)`.
- Index: `idx_chunk_embeddings_hnsw` — `hnsw (embedding vector_cosine_ops) WITH (m=16, ef_construction=64)`. Plus btree on `(model_name, model_version)` and a unique `(chunk_id, model_name, model_version)`.
- FTS: `curriculum_chunks.fts_doc` = generated `tsvector` (`to_tsvector('simple', content_chunk)`) with GIN index `idx_curriculum_chunks_fts`. Hybrid dense+sparse retrieval via RPC `match_curriculum_chunks(query_embedding, p_chapter_id, p_language_tag, match_count, p_model_name, p_model_version, query_text)` (RRF fusion, `SECURITY INVOKER`, `STABLE`).

### 2.2 Coverage
| Model | Embeddings | Chunk coverage |
|---|---|---|
| `bge-m3` v1 (local Ollama) | 2 308 | **100%** (every chunk, 0 missing, 0 orphaned) |
| `nvidia/llama-nemotron-embed-1b-v2` v1 (NIM / prod) | 736 | **~32%** only |

### 2.3 Findings

- **F-RAG-1 (critical): the production embedder model is gone.** `src/ai/genkit.ts` sets `NIM_EMBED_MODEL = "nvidia/llama-nemotron-embed-1b-v2"`; on Vercel (`process.env.VERCEL` set) `activeEmbedder = nimEmbedder`. That model **is not in NIM's live catalog** (checked `GET https://integrate.api.nvidia.com/v1/models`). So on the deployed site, `retrieveGroundingFlow` → `ai.embed(...)` throws, which means: grading Layer 2 (RAG grounding) fails, and the tutor's `searchTextbookCurriculum` tool fails. Candidate replacements present in the catalog: `nvidia/llama-nemotron-embed-vl-1b-v2`, `nvidia/nemotron-3-embed-1b`, `nvidia/llama-3.2-nv-embedqa-1b-v1`. **Any swap requires a full re-embed** of all 2 308 chunks into a new `model_name` and updating `EMBED_MODEL_NAME`/`EMBED_MODEL_VERSION`.
- **F-RAG-2 (high): even if the model worked, prod would only see 736/2 308 chunks.** `match_curriculum_chunks` is called with `p_model_name = EMBED_MODEL_NAME`, which is `nvidia/llama-nemotron-embed-1b-v2` on Vercel. Only 32% of the corpus is embedded under that name → most retrievals return few/no chunks → `groundingConfidence` collapses → grading "grades conservatively / flags low grounding" for most questions.
- **F-RAG-3 (medium): corpus contains boilerplate & un-stripped markup.** Nearest-neighbour probe surfaced chunks that are cover pages, `CONTENTS`, NCTB copyright text, and bodies with literal `<b>…</b>` and `<math>…</math>` tags. These are retrievable and will be injected into grading/tutor prompts as "curriculum context". Filter front-matter chunks (or tag `chunk_type`) and strip markup at ingestion.
- **F-RAG-4 (low): local vs prod silently use different embedders and different DB rows.** `isLocalOllamaEmbed = !process.env.VERCEL`. Local dev "passes" against bge-m3; prod uses a different (broken) model. This masks F-RAG-1 in every local test. Consider a single hosted embedder for both, or a loud startup assertion that the configured `model_name` has ≥N rows in `chunk_embeddings`.
- Positive: dense search itself is correct — self-similarity = 1.0, ranked neighbours are topically sensible; RRF hybrid + CQ parent-stimulus resolution logic in `retrieve-grounding.ts` is sound; Bengali physics synonym expansion (`expandBengaliPhysicsQuery`) is a nice touch.

---

## 3. AI implementation inventory (`web/src/ai`)

| # | Feature | Entry point | Flow / model | Live model status |
|---|---|---|---|---|
| 1 | **AI Tutor** (Socratic agent, tools) | `/dashboard/tutor` → `POST /api/tutor-chat` → `tutorAgent` | Genkit `defineAgent`, tools: `searchTextbookCurriculum` (RAG), `verifyPhysicsCalculation` (deterministic), `requestPracticeQuizInterrupt` (HITL interrupt). Model `MODELS.reasoning` = `nim/meta/llama-3.2-11b-vision-instruct` | model exists, but behaviour broken (§4.1) |
| 2 | **"Explain it simply" rubric tutor** | Results / grading breakdown → same `/api/tutor-chat`, `mode:"rubric"` | `tutorChatFlow` / agent, same model | same defect as #1 |
| 3 | **Practice paper generator** | `/dashboard/practice/generate` → server action `generatePaper` → `generateQuestionPaperFlow` | model `MODELS.paper` = `nim/nvidia/nemotron-3-nano-30b-a3b`, OpenAI-client fallback on same model | ❌ **410 Gone** (§4.2) |
| 4 | **AI grading pipeline (4 layers)** | `/dashboard/upload` → `POST /api/submissions` → `pgmq` → `POST /api/internal/process-grading-queue` → `gradeSubmissionFlow` | L1 `transcribePageFlow` (vision OCR, verbatim) → L2 `retrieveGroundingFlow` (RAG) → L3+4 `evaluateRubricFlow` (structured JSON, mistake taxonomy, arithmetic check, transcript-mismatch). Models: `MODELS.vision` / `MODELS.reasoning` = `llama-3.2-11b-vision-instruct` | vision model exists; L2 depends on broken prod embedder (§2); not verifiable end-to-end here (async, prod-URL cron) |
| 5 | **RAG retrieval** | `retrieveGroundingFlow` + RPC `match_curriculum_chunks` | dense HNSW + FTS + RRF | ✅ local / ❌ prod (§2) |
| 6 | Mistake analysis | `/dashboard/mistake-analysis` | **deterministic** aggregation of `weakness_logs` + `grading_results.mistake_category` | n/a |
| 7 | Study planner | `/dashboard/study-plan` → action `generateStudyPlan` | **deterministic** spaced-repetition heuristic (14-day cycle, weakness-weighted intervals) | n/a |
| 8 | Board prediction / Results analytics | `/dashboard`, `/dashboard/board-simulator`, `/dashboard/submissions` | aggregation; charts currently **mock data** | n/a |
| — | Safety pre-filter | `preFilterSafety()` in `tutor-chat.ts` + `/api/tutor-chat` | regex list → fixed Bangla escalation message + `audit_log` insert; bypasses LLM | ✅ logic present (not live-tested — would require sending self-harm text) |

Other AI infra: `src/ai/mcp/server.ts` (Genkit MCP server), `SupabaseSessionStore` for agent session persistence, `PIPELINE_VERSION = v1.3.0-nim-standard`, `PROMPT_VERSION = v1.1.0`.

---

## 4. Real-life use-case scenarios: expected vs actual

### 4.1 AI Tutor — general subject chat

**Use case A — vernier constant (definition + calc).**
Input (Bangla): *"একটি স্লাইড ক্যালিপার্সের প্রধান স্কেলের ক্ষুদ্রতম ভাগ 1 mm এবং ভার্নিয়ার স্কেলে 10 ভাগ আছে। ভার্নিয়ার ধ্রুবক নির্ণয় করো।"*
**Expected:** conversational Bangla, no greeting, ≤250 words, Socratic (ask which quantities are known / which relation applies before revealing), formula in `$…$` — `VC = \frac{\text{smallest main-scale division}}{\text{no. of vernier divisions}} = \frac{1\,\text{mm}}{10} = 0.1\,\text{mm} = 0.01\,\text{cm}$`, a local analogy.
**Actual:** message accepted, `POST /api/tutor-chat` → `200`, UI stuck on *"Generating response…"* for **> 2 minutes**, no assistant message ever rendered or persisted. DB: session `10d8e94c-…` has `msgs = 1, tutor_msgs = 0`.

**Use case B — kinematics final velocity.**
Input: *"স্থির অবস্থা থেকে a = 2 ms⁻², t = 10 s হলে শেষ বেগ কত?"* (expected `v = u + at = 20\,\text{ms}^{-1}$`, reached Socratically).
**Actual (from historic sessions on this account):**
- session `8e5f018e`: tutor reply = `"The final answer is $\boxed{20}$ ms⁻¹."` (38 chars)
- session `76cae421`: `"সূত্র v = u + at ব্যবহার করলে মান হল 20 ms⁻¹।"` (45 chars)
- session `dc437d9e`: `"…10 সেকেন্ড পর এর বেগ হবে 20 m/s।"` + `"গাড়িটি 10 সেকেন্ডে 100 মিটার দূরত্ব অতিক্রম করবে।"`

**Gap analysis (Tutor):**
1. **Hangs / never responds** on a cold session (reproduced live; 8 of 12 most-recent sessions have zero tutor messages).
2. When it does answer: **38–95 characters**, i.e. a bare terminal answer — violates "under 250 words, 2–3 paragraphs" (too short, not too long) and provides no scaffolding.
3. **Reveals the final calculation immediately** — direct violation of the Socratic rule "Do NOT reveal the full direct solution or final mathematical calculation immediately."
4. **Language:** `"The final answer is $\boxed{20}$"` is English and leaks the model's raw chain-of-thought tail (`\boxed{}`), despite `stripLeadingGreeting` / `normalizeLatexDelimiters` post-processing. Rule 1 (reply in Bangla) broken.
5. **No analogy, no NCTB citation, no step structure.**
6. Likely cause: `llama-3.2-11b-vision-instruct` (an 11B *vision* model) is being used as the reasoning/agent model driving 3 tools + Socratic control. It both stalls in tool loops and, when it exits, emits a stub. The dev log shows the agent entering the `verifyPhysicsCalculation` tool schema (`strict mode: use allowUnionTypes … #/properties/variables/anyOf/0` warning) right before the stall.

### 4.2 Practice paper generation

**Use case:** subject Physics, chapter *Motion*, type *Creative Questions (CQ)*, difficulty *Board Standard*, total marks 10 → expect 1 CQ (10 marks) with Bengali `stimulus_bn` containing real quantities/units and 4 sub-questions ক/খ/গ/ঘ (1/2/3/4 marks) each with `rubric_step_rules`, persisted as a `question_papers` + `questions` + per-question `rubrics` row, then redirect to the paper.
**Actual:** submitted the form; UI showed **`410 status code (no body)`** and reset Total Marks to 25. Dev log:
`Direct generation failed, trying OpenAI client fallback: GenkitError: UNKNOWN: 410 status code (no body)` — and the fallback then 410s too.
**Cause:** `GENKIT_PAPER_MODEL = "nim/nvidia/nemotron-3-nano-30b-a3b"` — this ID **is not in NIM's live `/v1/models`** (verified). HTTP 410 = permanently gone. Both the Genkit path and the manual `OpenAI` fallback in `generate-question-paper.ts` target the *same* dead ID, so there is no working path. Catalog now offers `nvidia/nemotron-nano-3-30b-a3b`, `nvidia/nemotron-3.5-lightning-30b-a3b`, `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning`.
**Secondary:** the error surfaced to the user verbatim as `"410 status code (no body)"` — no friendly message; and the "Standard: 25–100 marks" helper contradicts the Zod schema which accepts `min(5)`.

### 4.3 AI grading pipeline

**Use case:** upload a photo of a handwritten Motion CQ answer where the student used `s = ut + at²` (dropped the ½) and omitted units → expect: verbatim transcript (error preserved), RAG grounding from ch.2, `evaluateRubricFlow` → `score_obtained ≈ 7/10`, `mistake_category = "FORMULA_RECALL"` or `"UNIT_CONVERSION"`, `arithmetic_verified` reflecting the check, Bangla + English deduction summaries citing rubric steps, status `COMPLETED`.
**Actual:** **could not run end-to-end.** The queue has had **1 message total, ever**; the only genuine `exam_submissions` row (`32ef645c…`, 2026-08-18) is `COMPLETED 0/10` with `transcript_mismatch_detected = true`. All other submissions/results are seed fixtures (`aaaaaaaa-…`, `55555555-…`, `66666666-…`). The worker cron points at the **production** URL `https://sheratutor.tech/...`, so a local upload would sit in `pgmq` undrained.
**Observations from the seed `grading_results` (quality of the prompt design, not a live run):** the structured output *shape* is good — Bangla + English summaries, 3–5 criteria in `rubric_breakdown_json`, `mistake_category`, `arithmetic_verified`, transcript-mismatch fields. But `model_name` provenance is wrong/stale (§1.5.4) and two of the three rows are fixtures.
**Dependency risk:** Layer 2 uses the prod embedder → §2 F-RAG-1/2 means grading on the deployed site currently runs with little or no curriculum grounding.

### 4.4 Mistake analysis (deterministic)

**Use case:** after graded submissions, show recoverable-marks and per-chapter weakness with drill links.
**Actual:** ✅ renders — "MARKS RECOVERABLE +15", "78% conceptual", cards for Motion (−6), Reflection of Light (−4), Force (−3), Work/Power/Energy (−1), Physical World (−1) from the 5 `weakness_logs` rows.
**Bug:** the "Weakness Tags Aggregator" prints the literal string `##Calculation ##Formula` (raw markdown/`##` not rendered or stripped). Card tags render fine as `#Calculation #Formula`.

### 4.5 Study planner (deterministic)

**Use case:** generate a 14-day spaced-repetition plan weighted by weakness.
**Actual:** action `generateStudyPlan` is a sound heuristic (weakness ≥0.6 → days 1/3/7/12, etc.). **But the page UI is largely mock:** the week strip shows `M17 T18 W19 T20 F21 S22 S23` (August), a hardcoded "7 day streak / longest 12 days", and fixed times (9:30 / 11:30 / 13:30). It does not reflect `study_plans.start_date` / `daily_schedule_json` for today (2026-09-07). `study_plans` also has 10 rows despite the `one_active_study_plan_per_student` migration — check older rows are `is_active = false`.

### 4.6 Results / Board simulator / dashboard analytics

**Actual:** functional but **presentation data is fabricated** — "Score history" line chart, "Subject performance" bars (Motion 84%, Force 78%, Work & Energy 88%, Optics & Light 92%), "Top 35% among board students", "62% syllabus mastery", "A (70%)" board prediction. Only **one** real assessment exists for this account (the seed 7/10). These should be wired to real aggregates or clearly labelled as sample data.

---

## 5. Prioritised issue list

### P0 — blocks core AI features
1. **Practice paper generation is dead** — `GENKIT_PAPER_MODEL` (`nim/nvidia/nemotron-3-nano-30b-a3b`) retired → 410. Repoint to a live NIM model; verify the OpenAI-client fallback uses a *different* live model so it's a real fallback. (§4.2)
2. **Production RAG embedder is dead** — `nvidia/llama-nemotron-embed-1b-v2` retired. Pick a live 1024-dim embedder, **re-embed all 2 308 chunks**, update `EMBED_MODEL_NAME`/`_VERSION`, and make `match_curriculum_chunks` query the name that actually has full coverage. (§2 F-RAG-1/2)
3. **AI Tutor hangs and/or returns sub-100-char non-Socratic English stubs.** Move the agent/reasoning model off `llama-3.2-11b-vision-instruct` to a real instruction/reasoning model; add a hard server timeout + user-visible error instead of an infinite "Generating response…"; add an output-quality guard (min length, language, "no boxed answer"). (§4.1)

### P1 — correctness / security
4. **Hard-coded worker secret** literal inside the `pg_cron` job command — remove; fail closed. (§1.5.1)
5. **`verify_waitlist_token`**: mutable `search_path` + `SECURITY DEFINER` callable by `anon`/`authenticated` — pin search_path, revoke execute. (§1.4)
6. **Grading cron cadence**: `*/30 * * * * *` is running ~every 30 min, not 30 s — fix the schedule / confirm parse; users wait up to 30 min for grading to start. (§1.5.2)
7. **Multiple active rubrics per chapter** (up to 48) — add uniqueness / supersede-on-insert, or scope rubrics to question. (§1.5.3)
8. **Grading Layer 2 grounding** silently degraded in prod because of #2 — grading is effectively ungrounded there.
9. **Raw upstream errors shown to users** (`"410 status code (no body)"`) — wrap in friendly messaging.

### P2 — data hygiene / polish
10. `grading_results.model_name` inconsistent & references retired models — normalise, write the resolved model per run. (§1.5.4)
11. Mock/demo data presented as real: Results score-history & subject bars, dashboard "board prediction / top 35% / 62% mastery", study-planner calendar + streak — wire to real aggregates or label as samples. (§4.5, §4.6)
12. `##Calculation` literal markdown leak on mistake-analysis. (§4.4)
13. RAG corpus contains cover/contents/copyright chunks and un-stripped `<b>`/`<math>` tags — filter at ingestion. (§2 F-RAG-3)
14. `pg_net` in `public` schema; enable leaked-password protection. (§1.4)
15. 33 unused indexes — INFO only, revisit post-traffic.
16. "Standard: 25–100 marks" UI hint vs Zod `min(5)` mismatch on paper generator.

---

## 6. What was validated visually (browser automation)

- ✅ Login with the provided credentials → dashboard (`/dashboard`) renders with real profile (Syed, SSC/Science/Dhaka, 2027).
- ✅ `/dashboard/tutor` loads, subject/chapter picker works, message sends, `POST /api/tutor-chat → 200`, streaming placeholder appears — but **no response body** within 2+ min (screenshotted).
- ✅ `/dashboard/practice/generate` form works; submit → **`410` error banner** (screenshotted); dev-log confirms model 410.
- ✅ `/dashboard/mistake-analysis`, `/dashboard/study-plan`, `/dashboard/board-simulator`, `/dashboard/submissions`, `/dashboard/upload` all render; findings above.
- Not run: full photo-upload → grading (async, worker cron targets prod URL, needs real answer-sheet images); safety-escalation path (would require submitting self-harm text).

Report file: `web/AI_REVIEW_REPORT.md`
