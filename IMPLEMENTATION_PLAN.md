# SheraTutor — Implementation Roadmap for CODEBASE_AUDIT_REPORT.md + docs/LAUNCH_CHECKLIST.md

## Context

Two audit documents already exist in the repo and were verified line-by-line against the current tree: `CODEBASE_AUDIT_REPORT.md` (architecture/security/quality/UX audit) and `docs/LAUNCH_CHECKLIST.md` (pre-launch punch list, P0–P2 across phases A/B/C). Together they list ~40 concrete engineering items plus a set of non-code operational tasks (DNS, Vercel env vars, Supabase console settings). This plan turns every **engineering** item into a sequenced, executable roadmap; non-code ops items are listed separately at the end so nothing is silently dropped, but they are explicitly out of scope for implementation here.

**Decisions locked in for this plan** (from user answers):
- This is a **planning deliverable only** — no code will be written in this pass. The plan is handed off for phase-by-phase implementation later.
- Error monitoring → **Vercel OTel / Vercel Monitoring** (stays inside the existing Vercel deploy target, no new third-party account).
- Waitlist CAPTCHA → **skipped for now** (honeypot stays as the only anti-bot control; no Turnstile/hCaptcha work planned).
- Tutor safety → **add a real moderation API call** in front of every LLM response, on top of the existing self-harm regex floor.

**Two corrections surfaced during research** (both audit docs are slightly stale here — noted so the implementer doesn't chase a fix for something that doesn't exist):
1. **H4 ("empty-RAG invention fallback") is not present in the current code.** `generate-question-paper.ts` doesn't call `retrieveGroundingFlow` at all today — paper generation has **no RAG grounding step whatsoever**, it's a fixed hardcoded-physics prompt built from chapter titles only. The real fix is "**add grounding to paper generation**," not "fix an existing fallback string." Folded into Phase 1.3 below.
2. **The literal `#989faf` contrast bug is not in `BarChart.tsx`** — it already uses the `text-muted-foreground` token. If a real contrast problem remains, it lives in `--muted-foreground`'s token value in `web/src/app/globals.css` (light: `var(--slate-600)` = `oklch(0.446 0.037 258)`, against `--background` = `var(--slate-50)`). Folded into Phase 6 as "verify, then fix at the token level if needed" rather than a component fix.

---

## Phase 0 — Shared infrastructure (do first; later phases depend on it)

Small, low-risk helpers that several later phases reuse. No behavior change on their own.

1. **`web/src/lib/admin.ts`** (new) — `export function isAdmin(email: string | null | undefined): boolean`, centralizing the byte-for-byte duplicated allowlist currently inlined in `web/src/app/dashboard/layout.tsx:30-34` and `web/src/app/dashboard/admin/waitlist/page.tsx:23-28`. Replace both call sites.
2. **`web/src/lib/supabase/cached.ts`** (new) — one `getCachedAnonClient()` factory wrapping the `createSupabaseClient(NEXT_PUBLIC_SUPABASE_URL!, NEXT_PUBLIC_SUPABASE_ANON_KEY!)` two-liner currently duplicated in `dashboard/tutor/page.tsx`, `dashboard/practice/page.tsx`, `dashboard/practice/[id]/page.tsx`, `dashboard/practice/generate/page.tsx` (all inside `'use cache'` functions, which is *why* the cookie-bound `lib/supabase/server.ts` client can't be used there). Swap all four call sites to import it.
3. **`web/src/ai/resolve-provider.ts`** (new) — `export function resolveRawProvider(envVar: string, fallbackModel: string)` returning `{ modelName, apiKey, baseURL, defaultHeaders }`, extracting the `isNim = ... .startsWith("nim/") || Boolean(process.env.NVIDIA_NIM_API_KEY)` + prefix-stripping ternary that's currently copy-pasted in `web/src/ai/flows/generate-question-paper.ts` (~line 138), `web/src/ai/flows/tutor-chat.ts` (~line 236), and `web/src/app/api/tutor-chat/route.ts` (~line 321). Update all three call sites to `new OpenAI(resolveRawProvider(...))`.
4. **`web/src/lib/age.ts`** (new) — `export function isMinor(dateOfBirth: string): boolean`, hoisting the 18-year-cutoff logic duplicated in `web/src/app/onboarding/page.tsx` (client-side display logic) and `web/src/app/actions/onboarding.ts` (server-side gate). Both import from here; server stays authoritative, client uses it only for conditional UI.
5. **`web/src/lib/validation.ts`** — derive the onboarding page's local `BOARDS` array from `educationBoard.options` (the existing Zod enum) instead of keeping two independent hardcoded lists of the same 11 boards.

---

## Phase 1 — Trust & data-integrity (highest priority: users see fabricated numbers today)

### 1.1 Kill fabricated dashboard data (C1, C2, LAUNCH_CHECKLIST §9)
Files: `web/src/app/dashboard/page.tsx`, `web/src/components/pages/DashboardPageClient.tsx`, `web/src/app/dashboard/study-plan/page.tsx`, and the same fallback pattern in `AchievementsPageClient`/`MistakesPageClient`/`ExamsPageClient` (audit flags these as needing the same audit pass).

- Remove every hardcoded fallback number: `momentumScore` (`dashboard/page.tsx:101`, hardcoded `82`), `percentileRank` (`:105`, hardcoded `12`), `defaultSubjectList` (`:108-110`, invented `progress: 78`), the fictional `todayTasks` array (`:137-162`), and its near-duplicate in `study-plan/page.tsx`'s `dynamicTasks` fallback.
- Replace with explicit "no data yet" signals passed as props (e.g. `momentumScore: number | null`, `hasSubjects: boolean`) so `DashboardPageClient`/`PlannerPageClient` can render a real empty state — "Upload your first script to see your stats" — instead of receiving a pre-filled fake number. This is a **prop-shape change**, so update both the server page and the client component together.
- Fix `examType` default: `dashboard/page.tsx:181` currently does `studentProfile?.exam_type || 'HSC'`. Since `lib/validation.ts`'s `examType` enum legitimately includes both `SSC`/`HSC` (this is schema-correct, not a bug), the fix is narrower than "remove HSC": stop silently defaulting to `'HSC'` when the value is genuinely unknown — surface it as unset/empty rather than guessing, since onboarding already makes `examType` a required field (a missing value here means the profile fetch failed or the user hasn't onboarded, not that they're HSC).
- Fix the matching login-page copy bug: `web/src/app/login/page.tsx` line ~33, `"Sign in to continue your HSC study momentum."` — grep the whole `web/src/app` and `web/src/components` tree for other stray `'HSC'` literals used as a default/fallback (not as a legitimate enum option) and correct each.
- **Percentile/momentum decision** (LAUNCH_CHECKLIST §0, open): given no real cohort data exists yet, ground `percentileRank` in real computed data only when `avgScorePct !== null` (the existing computed branch is fine — `100 - avgScorePct + 5` is a reasonable placeholder *formula* once real, non-fabricated inputs exist) and show nothing (not a fake `12`) when there's no data. Same treatment for `momentumScore`.

### 1.2 Fix study-plan "day 1" bug (LAUNCH_CHECKLIST §9, confirmed in `study-plan.ts`/`study-plan/page.tsx`)
- `web/src/app/dashboard/study-plan/page.tsx`: replace `const currentDay = 1;` with a real offset computed from `study_plans.start_date` (already selected via `select('*')` on `plan`) using Asia/Dhaka-aware date math — reuse the existing `web/src/lib/time.ts` helper pattern (the codebase already has a `startOfDhakaDayUtcIso()`-style helper used elsewhere; extend/reuse it here rather than hand-rolling new date math) and clamp to `[1, CYCLE_DAYS]` (14, from `web/src/app/actions/study-plan.ts`).
- While touching this file, note `togglePlanTask`'s task IDs (`task-${i}`, index-based) aren't stable across plan regeneration — out of scope for this fix, but leave a short code comment flagging it so a future regenerate-plan feature doesn't silently break completion state.

### 1.3 Atomic, validated paper generation (C3, AI_CODE_REVIEW_FINDINGS Critical items)
Files: `web/src/app/actions/generate-paper.ts`, `web/src/ai/flows/generate-question-paper.ts`, new migration `supabase/migrations/00000000000031_create_custom_paper_rpc.sql`.

- **New Postgres RPC** `create_custom_paper(p_subject_id uuid, p_title text, p_paper_type text, p_difficulty text, p_total_marks int, p_questions jsonb) returns uuid`, `language plpgsql`. Model it on the pattern already in the repo (`supabase/migrations/00000000000018_grading_queue.sql`'s `enqueue_grading_job`/`read_grading_jobs`/`archive_grading_job`), but **do not use `security definer`** here — confirmed via `00000000000019_paper_generator_rls.sql` that `questions_insert_own_paper` and `rubrics_insert_own` RLS policies already permit an authenticated user to insert their own rows (`created_by_user_id = auth.uid()` / `created_by = auth.uid()`), so a plain invoker-rights function is both sufficient and safer (least privilege) — `security definer` was only needed in the pgmq migration because `authenticated` has no direct grant on the `pgmq` schema. The function body inserts `question_papers` → loops `jsonb_array_elements(p_questions)` inserting `rubrics` then `questions` per item; a `plpgsql` function body is one implicit transaction, so any failure (a bad `chapter_id` FK, a constraint violation) rolls back the whole paper atomically — this alone eliminates the orphaned-rubric leak in the current `generate-paper.ts` loop (whose catch-block only deletes `question_papers`, never the already-inserted `rubrics` rows, which have no FK back to the paper).
- **`generate-paper.ts`**: before calling the new RPC, add explicit validation (fail fast with a clear message, not a DB error) that (a) `Σ q.max_marks === totalMarks` (or is within an accepted tolerance — decide during implementation whether exact match or a rounding allowance is right, since CQ marks are fixed-10 blocks) and (b) every `q.chapter_id` is a member of `parsed.data.chapterIds`. Replace the current multi-loop `supabase.from(...).insert(...)` calls with a single `supabase.rpc('create_custom_paper', {...})` call.
- **Add RAG grounding to paper generation** (this is the corrected version of H4 — currently absent, not "sometimes falls back to invention"): call `retrieveGroundingFlow` per selected chapter (mirroring how `grade-submission.ts:130` already calls it) before building the prompt, and inject the retrieved chunks into the prompt as authoritative context. Decide and implement a **fail-closed** behavior below a minimum chunk-count threshold (reject generation for that chapter with a clear "this chapter isn't ready yet" message) rather than letting the model free-write when nothing is retrieved.
- **Subject-agnostic prompt**: the current prompt in `generate-question-paper.ts` is hardcoded "senior Bangladeshi NCTB SSC Physics examiner" with physics-specific formula/unit examples baked in. Parameterize by the fetched `subjects` row (name, code) so the flow is at minimum structurally reusable when Chemistry/Math/English content is ingested later — full multi-subject prompt engineering is out of scope, but hardcoding physics into the flow itself should end here.

---

## Phase 2 — AI flow trust boundaries & quality (H1, H2, H3, AI_CODE_REVIEW_FINDINGS)

### 2.1 Server-resolve tutor rubric context (H1)
File: `web/src/app/api/tutor-chat/route.ts` (session-create path, `rubric` mode).
- Currently accepts `questionText`, `studentAnswerChunk`, `rubricFailureReason`, `groundedContext` straight from the request body on session create. Change to: given `submissionId` + `questionId` + `rubricStepIndex` from the client, look up the corresponding `grading_results` row server-side and derive all four fields from it — mirror the pattern already used correctly for `general` mode (lines ~181-192, which does derive `subjectName`/`chapterName` from a server-side `chapters`/`subjects` join). Drop the client-supplied versions of these fields entirely from the accepted request shape (or ignore them if present, for backward compatibility during rollout).

### 2.2 Real moderation pass + honest safety schema (H2, per user's chosen approach)
Files: `web/src/ai/flows/tutor-chat.ts`, `web/src/app/api/tutor-chat/route.ts`.
- Keep the existing `preFilterSafety()` self-harm regex as a fast, zero-latency first pass (cheap, catches the worst case before any network call).
- Add a moderation API call **before** the main LLM generation whenever the self-harm regex doesn't already flag the message — call a hosted moderation endpoint (OpenAI's moderation endpoint is free and works against any text regardless of which model generates the reply; confirm during implementation whether NIM/AgentRouter expose an equivalent, otherwise use OpenAI's directly since `openai` is already a dependency). On a moderation hit, route to the existing `SAFE_ESCALATION_MESSAGE_BN` path (or a category-appropriate variant) instead of the LLM call, and log to `audit_log` exactly as the self-harm path already does.
- Reconcile `SafetyCheckResult`'s enum (`none | self_harm | abuse_disclosure | off_topic_unsafe`) with what actually fires now that a real moderation call exists — map moderation-API categories onto this enum (or extend it) so `tutor_chat_messages.safety_category` stops overclaiming and starts reflecting real classifier output.
- Add the missing English escalation copy (currently `SAFE_ESCALATION_MESSAGE_BN` is Bangla-only regardless of `languagePreference`) — add a parallel `SAFE_ESCALATION_MESSAGE_EN` and select by `languagePreference`.

### 2.3 Subject-aware tutor prompt (H3)
File: `web/src/ai/flows/tutor-chat.ts`, `buildTutorPrompt()`.
- Rule 5 ("Adhere to official NCTB textbook curriculum definitions and formulas") is already subject-neutral in wording, but the surrounding prompt is framed entirely around Physics ("SheraTutor's 'Explain it simply' AI tutor for Bangladeshi SSC/HSC **Physics** students"). Parameterize the role-intro/rule text by `subjectName` (already passed in for `general` mode; for `rubric` mode this needs to be resolved server-side too, per 2.1's fix, since rubric-mode context should also carry subject).

### 2.4 Bound tutor chat history & message length (AI_CODE_REVIEW_FINDINGS Medium, LAUNCH_CHECKLIST §10)
File: `web/src/app/api/tutor-chat/route.ts` (message-history load, ~line where `priorMessages` is queried and mapped).
- Slice history to the last ~6 turns before passing to `buildTutorPrompt` (query already orders ascending; either add `.limit()` with a descending-then-reverse trick, or slice in-memory after fetch — pick whichever keeps the query simple given expected session sizes).
- Add a max length check on `studentMessage` in the route's Zod `RequestBody` schema (e.g. `.max(1000)`), returning a clear 400 rather than silently truncating.

### 2.5 Fix grading-flow hardcodes (LAUNCH_CHECKLIST §10)
File: `web/src/ai/flows/grade-submission.ts`.
- `languageTag: "bn"` is hardcoded at the retrieval call regardless of the submission's actual paper language — derive it from the question paper / student profile's language preference instead.
- `model_version: "unpinned"` and the stale `PIPELINE_VERSION` string (`"v1.3.0-nim-standard"` doesn't reflect the actual embedder/model in active use) — update `web/src/ai/genkit.ts`'s `PIPELINE_VERSION`/`PROMPT_VERSION` constants to accurately describe the current provider/model combination, and bump them as part of this change so the provenance trail on `grading_results` stays meaningful.

### 2.6 Route low-confidence grades to human review (LAUNCH_CHECKLIST §10, new capability)
- `evaluate-rubric.ts` already emits `grounding_confidence` per result, but nothing consumes it. Add a threshold check in `grade-submission.ts`'s orchestration: when `grounding_confidence` falls below a chosen cutoff, set a review-needed flag on the `grading_results` row (may need a small migration adding a `needs_review boolean default false` column, or reuse `grading_corrections`'s existing shape if it already models this — check before adding a new column) instead of marking the submission simply `COMPLETED`. Building the actual teacher-facing review queue UI is a larger feature — scope this phase to the data-model/flag change only, and note the UI as a Phase 8 candidate if prioritized later.

---

## Phase 3 — Security & ops hardening

### 3.1 Security headers (H6)
File: `web/next.config.ts`.
- Add a `headers()` function returning `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Strict-Transport-Security`, `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`), and a CSP. Before finalizing the CSP, check `web/src/components/render-math-text.tsx` (the KaTeX rendering path used by `tutor-page-client.tsx`) for any inline-style/script requirements — KaTeX typically only needs its stylesheet, so a reasonably strict CSP (no `unsafe-inline` script, style may need `unsafe-inline` or a nonce depending on how KaTeX/Tailwind inject styles — verify empirically against the running dev server before locking the policy).

### 3.2 Worker-secret hardening (H7, LAUNCH_CHECKLIST §1)
File: `web/src/app/api/internal/process-grading-queue/route.ts`.
- Replace `secret !== process.env.INTERNAL_WORKER_SECRET` with a constant-time comparison via `crypto.timingSafeEqual` (need equal-length buffers — pad/hash both sides or check length first before doing the timing-safe compare).
- The current value is already known to be exposed in git history (LAUNCH_CHECKLIST §1) — rotating it is an **ops action** (new Vercel env var value + updating the value baked into migration `00000000000030`'s cron job definition), not a code change; flag it for the user to do alongside deploying this fix, since a code fix alone doesn't rotate the leaked value.

### 3.3 Remove dead config (quick win)
File: `web/next.config.ts` — drop `'recharts'` from `experimental.optimizePackageImports` (confirmed not a dependency, not imported anywhere in `src`).

### 3.4 Health check endpoint (LAUNCH_CHECKLIST §11)
New file: `web/src/app/api/health/route.ts`. Lightweight Supabase reachability check (e.g. `.from('subjects').select('id').limit(1)` via the service-role client, or a plain `select 1`), returning `NextResponse.json({ status: 'ok' })` on success and following the existing `apiError()` convention (`web/src/lib/api.ts`) on failure (e.g. `apiError(503, "unhealthy", { detail })`).

### 3.5 Error monitoring via Vercel OTel (LAUNCH_CHECKLIST §11, per user's choice)
File: `web/src/instrumentation.ts` (currently a documented no-op `register()` plus a `console.error`-only `onRequestError`).
- Add `@vercel/otel` as a dependency, call `registerOTel('sheratutor')` inside `register()` per the file's own existing comment.
- Keep `onRequestError`'s structured `console.error` (useful for local/dev), but this phase's main value is that OTel auto-instruments and reports server errors/traces to Vercel's dashboard once deployed there — no additional manual error-forwarding code should be needed beyond the `registerOTel` call.

### 3.6 `npm audit` + dependency hygiene (LAUNCH_CHECKLIST §11)
- Run `npm audit` in `web/` as part of this phase's verification pass and address anything actionable (the repo's own `git push` output already surfaced "GitHub found 5 vulnerabilities (3 high, 2 moderate)" via Dependabot — cross-reference `npm audit`'s findings against those before deciding fixes, since some may be transitive/dev-only and not worth a breaking upgrade pre-launch).

---

## Phase 4 — Code quality: decomposition & duplication cleanup

*(Builds on Phase 0's helpers; safe to do incrementally, no user-facing behavior change.)*

1. **Decompose `tutor-page-client.tsx`** (858 lines, the largest file in the app). Concrete seams identified from its current structure:
   - `useTutorChatStream()` hook — extracts `submitQuestion` (the SSE-consuming send-message function, currently the single largest chunk of logic in the file), `stopGeneration`, and the `messages`/`isGenerating` state.
   - `TutorSessionList` component — `sessions`/`activeSessionId` state + `startNewSession`/`selectSession` handlers + the session-list JSX block.
   - Composer sub-component — `prompt` state, `handleTextareaInput`, the form/textarea JSX.
   - Subject/chapter selector sub-component — `selectedSubjectId`/`selectedChapterId` state, `handleSubjectChange`, the selector JSX.
   - Do this split file-by-file (extract one seam, verify the page still renders/streams correctly via the `run` skill or manual dev-server check, then extract the next) rather than one large rewrite.
2. **Flip `@typescript-eslint/no-explicit-any` to `"error"`** in `web/eslint.config.mjs` — the remaining debt is exactly 3 occurrences, all in `web/src/components/pages/waitlist-table.tsx` (lines ~178, 188, 198, an `onChange` handler cast as `any`). Fix those 3 sites (type the handler against the actual filter-value union) as part of the same change, not after.
3. Once `no-explicit-any` is tightened, evaluate `no-unused-vars` and `ban-ts-comment` for the same treatment — lower priority than the `any` fix, do only if the remaining warning count is genuinely near zero.

---

## Phase 5 — Auth, onboarding & i18n completeness (LAUNCH_CHECKLIST §8)

1. **Email confirmation decision** (open in the checklist): recommend turning confirmation **on** (safer default for a minors-facing product) and building the flow properly rather than leaving it undecided:
   - `web/src/app/actions/auth.ts`'s `signUpWithEmail` currently redirects straight to `/onboarding` after `signUp()`; with confirmation on there's no session yet. Add a "check your inbox" confirmation screen shown instead of the redirect, and set `emailRedirectTo` on the `signUp()` call pointing at `/auth/callback`.
2. **Password reset flow** — new routes `web/src/app/forgot-password/page.tsx` (+ a server action calling `supabase.auth.resetPasswordForEmail`) and `web/src/app/reset-password/page.tsx` (+ action calling `supabase.auth.updateUser({ password })` after the recovery-link session is established). Reuse the `credentials` (or a `password`-only slice of it) schema from `lib/validation.ts`.
3. **OAuth error surfacing**:
   - `web/src/app/login/page.tsx` currently takes no props at all — convert to read `searchParams` (Next 16 async `searchParams` prop) and render a message keyed off `?error=oauth` / `?error=auth_callback_failed`.
   - `web/src/app/auth/callback/route.ts` currently only reads `code`/`next` — also read and branch on `error`/`error_description` query params Supabase appends on OAuth failure, instead of collapsing every failure mode into one generic redirect.
   - Wrap/translate raw Supabase `error.message` strings before showing them (both `signUpWithEmail`/`signInWithEmail` in `auth.ts` currently return `error.message` verbatim) — map known Supabase error codes/messages to bn/en copy, fall back to a generic message for anything unrecognized.
4. **Sign-up rate limiting** — add a lightweight check in `signUpWithEmail` (same hand-rolled-Postgres-count style already used for tutor-chat/submissions daily limits, e.g. count recent signups from the same IP/email-domain in a short window) rather than pulling in new rate-limit infra, consistent with this phase's no-new-vendor constraint.
5. **i18n gap** — `login`/`signup` are hardcoded English, `onboarding` is hardcoded Bangla; none use `useLanguage()`/`t()`. Add new translation namespaces to `web/src/data/translations.ts` following the existing `form.*` pattern already used by `waitlist-form.tsx` (e.g. `auth.*` for login/signup, `onboarding.*`), wire both pages/the onboarding page through `useLanguage()`, and confirm `translations.test.ts`'s bn/en parity check still passes with the new keys.

---

## Phase 6 — UI/UX & accessibility

1. **Legacy CSS migration on `/login`, `/signup`, landing-page remnants** — migrate remaining inline-style/plain-CSS sections onto the Tailwind v4 + shadcn/OKLCH-token system used elsewhere (this pairs naturally with Phase 5's i18n rewrite of the same two pages — do them together rather than touching these files twice).
2. **Landing page heading hierarchy** — fix the `h1` → `h3` skip in feature cards (insert a properly-leveled `h2`, or demote the card headings to match actual hierarchy).
3. **Chart-label contrast** — first *verify* whether `--muted-foreground`'s current token value (`oklch(0.446 0.037 258)` in light mode, per `globals.css:134,208`) actually fails 4.5:1 against `--background` (`var(--slate-50)`) using a contrast-checker tool as part of implementation (don't assume the audit's stale finding is still accurate — the original flagged file, `BarChart.tsx`, no longer contains a raw hex literal). If it does fail, adjust the token value in `globals.css`, which fixes it everywhere the token is used, not just the chart.
4. **Touch targets** — resize the upload-page thumbnail delete button (`web/src/components/upload-form.tsx`, currently `w-5 h-5` / 20×20px) to at least 44×44px (can keep the visible icon small and enlarge the hit area via padding).
5. **`ExplainSimplyButton` per-observation binding** (confirmed exact bug): in `web/src/components/pages/SubmissionDetailClient.tsx`, move the single `<ExplainSimplyButton>` (currently rendered once per question, hardcoded to `q.observations_json?.[0]` and `rubricStepIndex={0}`) inside the existing `q.observations_json.map((obs, idx) => ...)` loop that already renders every deduction row, passing `stepName={obs.step}`, `observation={obs.observation}`, `rubricStepIndex={idx}` per row. No backend change needed — the tutor-session lookup in `api/tutor-chat/route.ts` already keys on `submissionId`/`questionId`/`rubricStepIndex`, so per-observation buttons map cleanly onto per-observation sessions.
6. **Live grading-progress stepper**: replace `SubmissionDetailClient.tsx`'s `const isDone = isComplete || i < 4;` fallback with real per-stage status. Confirm the actual `exam_submissions.status` enum values (check the exams migration) and map them onto the stepper's steps; add a Supabase Realtime subscription on `exam_submissions` status transitions for this submission, mirroring the pattern `Header.tsx` already uses for its grading-complete notifications.

---

## Phase 7 — Testing & CI

1. **Minimal CI workflow** — new `.github/workflows/ci.yml` running (on every PR against `main`) `npm run lint && npx tsc --noEmit && npm run test` inside `web/`. All three scripts already exist in `web/package.json`; this is close to zero-cost given no CI exists at all today.
2. **Tighten lint gating** once Phase 4's `any` cleanup lands — the a11y `jsx-a11y/recommended` rules are currently downgraded to `"warn"` (`eslint.config.mjs`); with CI in place, decide whether to flip key a11y rules to `"error"` so future regressions are actually blocked, not just visible in output.
3. **Playwright smoke suite** — a plan for this already exists (`docs/Comprehensive Automated Browser Testing Plan (Suites 1–7) Plan.md`) but was never built. Implement the highest-value paths first: waitlist submit, signup → onboarding → dashboard, upload → grade → result. Wire it as a separate CI job (likely not on every PR given it needs a live/staging Supabase + AI provider — decide during implementation whether it runs on a schedule or on-demand rather than blocking every PR).
4. **Golden-set harness in CI** — `npm run eval:golden-set` already exists as a script but needs real data (Phase 9) before it's meaningful in CI; once populated, add it as a manual-trigger or scheduled workflow (not per-PR, given cost/latency of a full LLM eval run) with a numeric MAE/QWK pass-bar check.

---

## Phase 8 — Deferred by explicit user choice (documented, not scheduled)

- **CAPTCHA on the public waitlist form** — user said skip. IP rate-limiting remains open in the checklist too; if revisited later, `web/src/app/actions/waitlist.ts` is the insertion point (right after the existing honeypot check, before `WaitlistInputSchema.safeParse`).
- **Guardian SMS-OTP verification** replacing the current `guardian_consent_method: "CHECKBOX_ACK_PILOT"` (`web/src/app/actions/onboarding.ts`) — explicitly tagged `B/C` (post-pilot) in the checklist; needs an SMS provider decision before it can be planned concretely. Flag for a future planning pass once a provider is chosen.

---

## Phase 9 — Longer-horizon / requires non-code work

These are real items from both docs but are either data-collection tasks, ops/business actions, or need a scope decision before they're plannable as code:

- **Populate the golden-set benchmark** (~30 human-graded scripts, 3-examiner consensus) — a data-collection task, not a code task; the harness (`eval:golden-set`) already exists and just needs data.
- **Curriculum ingestion beyond current SSC-Physics coverage** — content pipeline work in `ingestion/` (Python), not `web/`; separate effort.
- **Board-standard CQ schema redesign** (stimulus as its own row vs. JSON-blobbed sub-questions) — the research pass found the current schema is a flat `sub_questions_json` blob on one `questions` row, not literally "MCQ options stuffed in question_text" as the audit phrased it, but there is genuinely no separate stimulus/subpart table structure. Whether this warrants a schema migration is a scope decision the user should make explicitly before it's planned — flagging here rather than assuming a big schema change belongs in the roadmap.

---

## Non-code / ops checklist (from `docs/LAUNCH_CHECKLIST.md`, not part of this engineering plan)

Listed so nothing is silently dropped, but these require account access, DNS control, or Supabase/Vercel console actions the assistant can't perform as code changes: domain cutover DNS records (§1), Supabase Auth URL/OAuth-origin configuration for the new domain (§1), Supabase Auth custom SMTP provider switch (§2), deliverability testing (§2), running Supabase's `get_advisors` lint pass and acting on results (§11 — can be done via the Supabase MCP tools when that connector is available in a session), confirming PITR/backups are enabled (§11), signed-URL TTL check on the storage bucket (§11), merging the current branch to `main` and confirming Vercel auto-deploy (§13), tagged release + rollback plan (§13), preview-deployment password protection (§13), and confirming all required env vars are set in both Vercel Production and Preview (§13, includes the `INTERNAL_WORKER_SECRET` rotation from Phase 3.2 above).

---

## Verification approach (once implementation begins)

- **Phase 0–1 (data/paper integrity)**: `npm run test` (existing vitest suite) plus manual dev-server walkthrough of `/dashboard` with a fresh zero-data test account and an existing-data account, confirming no fabricated numbers appear; manual paper-generation run confirming a deliberately-bad chapter ID or mark mismatch is rejected before any DB write, and that a mid-generation failure leaves zero orphaned rows (`select * from rubrics where created_by = <test-user> and id not in (select rubric_id from questions)` should return nothing after a forced failure).
- **Phase 2 (AI trust)**: `npm run test:chat` / `npm run test:grounding` (existing scripts) plus a manual tutor-chat session exercising both `rubric` and `general` modes, confirming rubric context can no longer be overridden by a tampered client payload.
- **Phase 3 (security/ops)**: `curl -I` the deployed app to confirm headers are present; hit `/api/health` to confirm it responds; trigger a deliberate server error to confirm it surfaces in Vercel's monitoring once OTel is wired.
- **Phase 4–6 (quality/auth/UX)**: `npm run lint`, `npx tsc --noEmit`, `npm run test` all green; manual walkthrough of login/signup/onboarding in both bn/en; run a Lighthouse/axe pass on the pages the original audit flagged, confirm the specific findings (heading order, touch targets, contrast) are resolved.
- **Phase 7 (CI)**: open a throwaway PR and confirm the new workflow actually runs and fails on an intentionally-broken change, then passes once fixed.

Each phase should land as its own PR (or small stack of PRs) rather than one giant change, given the number of independent concerns — this also keeps the CI workflow (Phase 7) useful for reviewing everything that lands after it.
