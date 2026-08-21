# SheraTutor `web/src/ai` — Review Findings

**Date:** 2026-08-21  
**Scope:** All files under `web/src/ai/`, with deep review of `tutorChatFlow` and `generateQuestionPaperFlow` (including call sites).  
**Related canvases:** [web AI architecture](file:///home/syed/.cursor/projects/home-syed-workspace-Sheratutor/canvases/web-ai-architecture.canvas.tsx), [tutor + paper flow review](file:///home/syed/.cursor/projects/home-syed-workspace-Sheratutor/canvases/tutor-paper-flow-review.canvas.tsx)

---

## 1. Directory overview

| Path | Role |
|------|------|
| `genkit.ts` | Shared Genkit instance, provider plugins, `MODELS`, embedders, `PIPELINE_VERSION` / `PROMPT_VERSION` |
| `schemas/transcription.ts` | Layer 1 OCR structured output |
| `schemas/rubric.ts` | Layer 4 grading structured output |
| `flows/transcribe.ts` | L1 vision/OCR |
| `flows/retrieve-grounding.ts` | L2 hybrid RAG |
| `flows/evaluate-rubric.ts` | L3+4 grounded rubric evaluation |
| `flows/grade-submission.ts` | Orchestrator (L1→L4 + Supabase writes) |
| `flows/tutor-chat.ts` | “Explain it simply” tutor |
| `flows/generate-question-paper.ts` | Mock paper generation |

**App entry points**

| Flow | Called from |
|------|-------------|
| `gradeSubmissionFlow` | `/api/internal/process-grading-queue` (async worker) |
| `tutorChatFlow` | `/api/tutor-chat` (+ sessions APIs) |
| `generateQuestionPaperFlow` | `app/actions/generate-paper.ts` |
| `retrieveGroundingFlow` | grading, tutor (general mode), paper gen |
| `transcribePageFlow` / `evaluateRubricFlow` | only via `gradeSubmissionFlow` |

**Mental model:** `genkit.ts` picks providers and embedders. Flows are typed Genkit units. `gradeSubmission` orchestrates OCR → RAG → rubric eval with provenance. Tutor chat and paper gen reuse RAG + reasoning outside the grading queue.

---

## 2. Architecture & design themes (whole `web/src/ai`)

### Strengths

1. **Clear layered grading pipeline** — L1 OCR → L2 RAG → L3+4 evaluate, orchestrated asynchronously with status transitions (`OCR_PROCESSING` → `EVALUATING` → `COMPLETED`).
2. **Idempotent grading** — Already-`COMPLETED` submissions short-circuit (safe queue redelivery).
3. **Verbatim OCR emphasis** — Prompt + `TranscriptionSchema` fight silent VLM “correction” of student errors; optional image cross-check can set `transcript_mismatch_detected`.
4. **Curriculum grounding** — Hybrid dense + FTS via `match_curriculum_chunks`; CQ parent-stimulus expansion.
5. **Auditable scores** — Structured rubric JSON + `model_name` / `prompt_version` / `pipeline_version` / `rubric_version_id` on `grading_results`.
6. **Provider pragmatism** — NIM default, Ollama for local embed/dev, Fireworks registered but not defaulted; Vercel vs local embedder switch via `process.env.VERCEL`.
7. **Optional page→question mapping** — Scopes transcript and images per question when declared; undeclared pages remain shared context.

### Cross-cutting notes / risks

| Severity | Finding | Where |
|----------|---------|--------|
| Medium | `model_version: "unpinned"` — SDK doesn’t surface resolved version; trace ID is interim | `grade-submission.ts` |
| Medium | Language still hardcoded `"bn"` in grading path (comment acknowledges future wiring) | `grade-submission.ts` |
| Info | Fireworks is registered, not defaulted — intentional until golden set | `genkit.ts` |
| Info | Pipeline version string still says `bge-m3-pivot` while prod embeds via NIM | `PIPELINE_VERSION` |

---

## 3. Deep review: `tutorChatFlow`

**File:** `web/src/ai/flows/tutor-chat.ts`  
**Call site:** `web/src/app/api/tutor-chat/route.ts`  
**SRS:** FR-CHAT-01 (contextual “Explain it simply”), FR-CHAT-02 (BN/EN analogies)

### 3.1 Strengths

| Finding | Detail |
|---------|--------|
| Mode split is clean | `rubric` freezes question / answer snippet / deduction; `general` uses subject + chapter. Route freezes rubric `context_json` and re-grounds general mode each turn — correct asymmetry. |
| Model failure nets | `normalizeLatexDelimiters` and `stripLeadingGreeting` fix `$…$` rendering and Bangla greetings when the model ignores rules. |
| Safety early-exit | Self-harm regex hits never reach the LLM; route writes `SAFETY_ESCALATION` to `audit_log`; Kaan Pete Roi helpline in Bangla escalation copy. |
| Ops around the flow | Auth, onboarding gate, Asia/Dhaka daily rate limit (50 student messages), RLS-backed sessions, message persistence with `safety_category`. |

### 3.2 Findings

| Severity | Finding | Where | Detail |
|----------|---------|--------|--------|
| **High** | Safety schema is mostly fiction | `SafetyCheckResult` vs `preFilterSafety` | Enum includes `abuse_disclosure` and `off_topic_unsafe`, but only ~6 self-harm regexes ever fire. Callers/DB can store categories the flow never produces. Comment correctly says this is not a moderation API — types still overclaim. |
| **High** | Rubric context is client-trusted | `route.ts` session create from body | `questionText`, `studentAnswerChunk`, `rubricFailureReason`, `groundedContext` come from the browser on session create, not from `grading_results`. A student can poison the tutor’s academic frame or inject long fake “textbook” text. Prefer server load from submission + grading results. |
| **High** | Rule 4 hardcodes physics | Prompt rule 4 | `"Always adhere to official NCTB textbook physics terminology"` runs for every subject/chapter in both modes. Wrong for chemistry, math, Bangla, etc.; biases terms and analogies. |
| **Medium** | Unbounded history + message size | Flow `history[]`; route loads all messages | No max turns, no token budget, no `studentMessage` max length. Long sessions blow context/cost and enlarge prompt-injection surface. Cap history (e.g. last N or ~4k tokens) and message length at the route. |
| **Medium** | Escalation ignores `languagePreference` | `SAFE_ESCALATION_MESSAGE_BN` | Always Bangla even when `languagePreference` is `en`. Fine for default SSC BN UX; wrong for the declared bilingual API. |
| **Medium** | Greeting stripper incomplete | `stripLeadingGreeting` | Prompt forbids Hello; stripper only removes Bangla / হ্যালো / হাই patterns. English Hello/Hi and multi-line greetings still leak. |
| **Low** | Stale comment vs rule numbering | `normalizeLatexDelimiters` comment | Comment says “rule #2”; LaTeX is rule #3. Harmless but signals prompt churn without tests. |
| **Low** | No streaming / structured teaching turns | `ai.generate` text only | Full-buffer wait; no step scaffolding in output schema. Acceptable for v1; UX will feel slow on NIM latency. |

### 3.3 SRS map (tutor)

- **FR-CHAT-01** — Met in shape (contextual preload + interactive session).
- **FR-CHAT-02** — Met in shape (BN/EN analogies in prompt); English escalation path incomplete.
- **Safety** — Floor only (self-harm regex), not full moderation for minors at scale.

---

## 4. Deep review: `generateQuestionPaperFlow`

**File:** `web/src/ai/flows/generate-question-paper.ts`  
**Call site:** `web/src/app/actions/generate-paper.ts`  
**SRS:** FR-GEN-01 (custom mock papers). FR-GEN-02/03 explicitly out of scope in flow comments.

### 4.1 Strengths

| Finding | Detail |
|---------|--------|
| Reuses grading RAG | `retrieveGroundingFlow` per chapter via `Promise.all` — same embedder + `match_curriculum_chunks` as grading. |
| Rubric shape matches DB | `[{step_name, max_step_marks, matching_rules}]` aligned with `rubrics.criteria_json` / seed so `evaluateRubricFlow` can grade without a schema bridge. |
| Structured Genkit output | `output: { schema: GeneratedPaperSchema }` forces bilingual texts + rubric arrays for persistence. |

### 4.2 Findings

| Severity | Finding | Where | Detail |
|----------|---------|--------|--------|
| **Critical** | Mark / chapter invariants are prompt-only | Flow return; `generate-paper.ts` insert loop | Prompt asks for `sum(max_marks) === totalMarks` and step sums, but nothing validates. `chapter_id` is not checked ∈ input `chapterIds`. Invalid or foreign UUIDs can fail FK mid-loop and leave a **partial paper**. |
| **Critical** | Empty RAG explicitly authorizes invention | Grounding fallback string in prompt assembly | `"(no retrieved content — invent conservatively from general NCTB knowledge…)"` contradicts `"do not invent topics outside [context]"`. On sparse chapters, papers are model memory, not curriculum-grounded — main FR-GEN-01 integrity risk. |
| **High** | RAG query is generic and static | `queryText` constant | Same English string for every chapter: `"important board-exam topics, formulas, and concepts…"`. No subject, difficulty, or `paperType` in the query → weak / similar chunks; CQ vs MCQ retrieval needs differ. |
| **High** | Board CQ format not modeled | `GeneratedQuestionSchema` | Bangladeshi CQ needs উদ্দীপক + knowledge / understanding / application / higher-order sub-parts with fixed mark bands. Schema is a flat question + step rubric — not board-standard CQ. MCQ has no `options[]` (options stuffed into `question_text`). |
| **Medium** | `paperType` / MIXED underspecified | Prompt one-liner | MCQ vs CQ vs MIXED only appears as an adjective. No counts, option rules, or CQ:MCQ ratio. Difficulty is a word, not calibrated examples. |
| **Medium** | Partial DB writes on failure | `generate-paper.ts` | Paper insert, then per-question rubric + question inserts. Failure at Qn leaves orphan paper/rubrics. Needs a transaction or compensating delete. |
| **Medium** | No generation quota | Server action vs tutor route | Tutor has 50 msg/day; paper gen has none. Each call = N embeddings + one large structured generate — easy to burn NIM quota. |
| **Low** | `languagePreference` only drives RAG tag | Input `languagePreference` | Output always asks for both BN and EN. Fine for bilingual storage; parameter is half-used. |

### 4.3 SRS map (paper gen)

- **FR-GEN-01** — Partial: parameters (subject/chapters/difficulty/marks) exist; board-standard CQ/MCQ form and grounding honesty are weak.
- **FR-GEN-02 / FR-GEN-03** — Out of scope (documented in flow comments).

---

## 5. Suggested fix order

| # | Change | Flow | Why |
|---|--------|------|-----|
| 1 | Validate marks sums + `chapter_id ∈` input; reject/repair before insert | Paper | Stops corrupt / partial papers |
| 2 | Fail closed when grounding empty (or hard-require min chunks) | Paper | Keeps FR-GEN-01 honest |
| 3 | Server-load rubric session context from `grading_results` | Tutor | Removes client poison |
| 4 | Subject-aware prompt; drop physics-only rule 4 | Tutor | Multi-subject correctness |
| 5 | Cap history + message length; enrich RAG query by `paperType` | Both | Cost + retrieval quality |
| 6 | CQ schema (stimulus + subparts) or narrow `paperType` to what you can grade today | Paper | Board-standard claim |
| 7 | Transaction (or compensating delete) around paper/rubric/question inserts | Paper action | No orphan papers |
| 8 | Rate-limit paper generation | Paper action | Protect NIM free tier |
| 9 | Implement or remove unused safety categories; EN escalation copy | Tutor | Honest safety API |
| 10 | Complete greeting stripper for English; fix stale rule comments | Tutor | UX polish |

---

## 6. File inventory checklist

| File | Reviewed | Notes |
|------|----------|-------|
| `genkit.ts` | Yes | Providers, MODELS, dual embedders, versions |
| `schemas/transcription.ts` | Yes | Verbatim fidelity signals |
| `schemas/rubric.ts` | Yes | Load-bearing FR-EVAL-02 schema |
| `flows/transcribe.ts` | Yes (overview) | L1 vision |
| `flows/retrieve-grounding.ts` | Yes (overview) | Hybrid RAG + CQ parents |
| `flows/evaluate-rubric.ts` | Yes (overview) | Structured grade + optional images |
| `flows/grade-submission.ts` | Yes (overview) | Orchestrator + provenance |
| `flows/tutor-chat.ts` | **Deep** | See §3 |
| `flows/generate-question-paper.ts` | **Deep** | See §4 |

---

## 7. Bottom line

- **`web/src/ai` as a whole** is a coherent Genkit grading stack with strong provenance and OCR/RAG design pressures baked in.
- **`tutorChatFlow`** is product-ready as a tutoring UX layer with a thin safety floor, but overclaims safety categories, trusts client rubric context, and hardcodes physics terminology.
- **`generateQuestionPaperFlow`** is a thin prompt wrapper: grounding can fall back to invention, board CQ format is missing, and mark/chapter invariants are prompt-only — not enforced before DB write.

Severity here means product risk for SSC minors and gradeable papers, not code style.
