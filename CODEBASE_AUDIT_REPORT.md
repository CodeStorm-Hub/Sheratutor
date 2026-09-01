# SheraTutor — Full-Scope Codebase & Product Audit

**Date:** 2026-09-01
**Scope:** `web/` (Next.js 16 / React 19 app), `supabase/` (Postgres schema, RLS, migrations), `ingestion/` (Python RAG pipeline)
**Method:** Static review of source, schema, config, and existing internal audits (`AI_CODE_REVIEW_FINDINGS.md`, `SHERATUTOR_CODEBASE_REPORT.md`, `docs/PHYSICS_AUDIT_FINDINGS.md`, `docs/LAUNCH_CHECKLIST.md`), cross-checked line-by-line against the current tree. Where an earlier audit's finding has since been fixed, that is called out explicitly rather than repeated as open.

---

## Executive Summary & Health Score

**Overall Health Score: 6.5 / 10** — a genuinely ambitious, well-architected product (four-layer grounded grading pipeline, RLS-everywhere schema, provenance tracking, PDPA-aware consent flows) that is **pre-launch and knows it** — its own `docs/LAUNCH_CHECKLIST.md` is unusually honest about what's missing. The core engineering (schema design, AI pipeline structure, TypeScript strictness) is above the bar for this stage. The gap is in three places: **grading accuracy is unvalidated** (golden set has 0 rows), **the AI flows trust unvalidated LLM output and client input in a few load-bearing spots**, and **the dashboard shows fabricated numbers to real users** when they have no data yet — a trust-eroding launch blocker for an "actionable diagnostics, not bare scores" product.

Encouragingly, several issues flagged in earlier internal audits are **already fixed** in the current tree:
- The "two parallel theming systems" problem (`SHERATUTOR_CODEBASE_REPORT.md §7`) is resolved — `ThemeContext.tsx` is now a thin compatibility shim over `next-themes` (`web/src/context/ThemeContext.tsx:1-33`), not a competing implementation.
- Missing `aria-label`s on header controls (`docs/PHYSICS_AUDIT_FINDINGS.md` Page 3) are now present (`web/src/components/Header.tsx:174,191,206,231,287,341`).
- The legacy `dashboard-nav.tsx` duplicate component no longer exists in the tree.
- There are zero `console.log`, zero `@ts-ignore`/`@ts-expect-error`, and `strict: true` in `tsconfig.json` — better hygiene than the median pre-launch app.

What has **not** moved since the last audits, and is the substance of this report, follows below.

| Dimension | Score | Note |
|---|---|---|
| Architecture & data model | 8/10 | Layered AI pipeline, versioned rubrics, RLS on all 24+ tables, idempotent async grading |
| Security posture | 5/10 | RLS is solid; app-layer gaps remain (client-trusted AI context, no CSP/security headers, no CAPTCHA, exposed secret in git history) |
| Code quality / TS hygiene | 7/10 | Strict TS, low `any` count, clean route structure; a few 800+-line client components and unenforced invariants in AI flows |
| Testing / CI | 3/10 | 5 test files (~166 lines), no CI workflow, no e2e, grading accuracy unmeasured |
| UI/UX & design system | 7/10 | Coherent OKLCH token system, real loading/error/empty-state scaffolding; a11y and copy-consistency gaps remain, plus a legacy CSS layer on auth pages |
| Product integrity | 5/10 | Fabricated fallback stats visible to real users; several "SSC-only" surfaces still say "HSC" |

---

## Critical & High Priority Issues

### 🔴 Critical

**C1 — Dashboard shows fabricated data to real students with no data yet.**
`web/src/app/dashboard/page.tsx:97-181`. When a student has no `overall_momentum_score`, `momentumScore` falls back to a **hardcoded `82`** (line 101); `percentileRank` falls back to a **hardcoded `12`** (line 105); `defaultSubjectList` shows **invented Physics progress of 78%** (line 108-110) when the DB returns no subjects; `todayTasks` (lines 137-162) is a **static, fully-fictional 4-item study schedule** ("Physics: Light Reflection & Ray Diagrams", times `09:30`/`11:00`/`16:30`/`19:00`) shown whenever there's no active plan. A brand-new student — the exact user this page is designed to onboard — sees a fully-populated dashboard of numbers that describe nobody. This directly contradicts the product's own stated principle ("Actionable Diagnostics over Bare Scores… strictly anchored", `web/PRODUCT.md:65`). **Fix:** replace every fallback branch with a real empty state (zero-data illustration + "upload your first script" CTA); never synthesize a score, percentile, or schedule.

**C2 — `examType` defaults to `'HSC'` while the product is SSC-only.**
`web/src/app/dashboard/page.tsx:181`: `const examType = studentProfile?.exam_type || 'HSC';`. Combined with the login page's copy bug already flagged in `docs/PHYSICS_AUDIT_FINDINGS.md` ("Sign in to continue your HSC study momentum" on an SSC-scoped product), this is a systemic default, not a one-off typo — grep for `'HSC'` as a literal fallback/default across `web/src/app` and `web/src/components` and correct every instance to `'SSC'` (or better, make the field required at onboarding so there is no silent default).

**C3 — Mark/chapter invariants for AI-generated papers are prompt-only, not enforced.**
`web/src/ai/flows/generate-question-paper.ts` + `web/src/app/actions/generate-paper.ts`. The prompt asks the model to make `Σ max_marks === totalMarks` and to only use `chapter_id`s from the input, but nothing validates this before the insert loop runs. A malformed or hallucinated response can (a) write a paper with marks that don't sum correctly, or (b) reference a chapter UUID that fails a foreign-key constraint **mid-loop**, leaving an orphaned `question_papers` row with a partial set of `questions`/`rubrics`. **Fix:** validate the parsed output against `chapterIds` and mark-sum invariants before any insert; wrap the paper/rubric/question inserts in a single Postgres RPC (transaction) so a failure rolls back atomically instead of leaving partial state (`generate-paper.ts` already deletes the paper on a caught error, but not the already-inserted `rubrics`/`questions` rows for earlier questions in the loop — confirm and close that leak).

**C4 — Grading accuracy is completely unmeasured.**
`golden_set_items` / `golden_set_human_grades` / `golden_set_model_runs` all have **0 rows** (per `docs/PHYSICS_AUDIT_FINDINGS.md` live DB check and confirmed unchanged in `docs/LAUNCH_CHECKLIST.md §10`), and `npm run eval:golden-set` (`web/package.json:10`) has never run against real data. This is a board-exam grading product for minors whose entire value proposition — "grounded, examiner-accurate grading" — is currently an unverified claim. This is the single highest-leverage pre-launch task: populate ~30 real graded scripts with 3-examiner consensus, run the harness, and set a numeric pass bar (MAE / QWK) before opening beyond a pilot.

### 🟠 High

**H1 — Tutor chat's academic framing is client-supplied, not server-verified.**
`web/src/app/api/tutor-chat/route.ts` (session-create path) accepts `questionText`, `studentAnswerChunk`, `rubricFailureReason`, and `groundedContext` directly from the request body when a `rubric`-mode session is first created, instead of loading them from `grading_results` server-side. A student (or anyone scripting the endpoint with a valid session cookie) can inject arbitrary "textbook" text or a fabricated rubric-failure reason into the model's system framing for their own tutor session. Low blast radius (single-user context poisoning, not cross-tenant), but it undermines the "curriculum-grounded truth" guarantee and is a straightforward prompt-injection vector. **Fix:** resolve rubric context server-side from `submission_id` + `question_id` + `grading_results`, ignore any of those fields if present in the client payload.

**H2 — Tutor safety schema overclaims what it actually detects.**
`web/src/ai/flows/tutor-chat.ts`. `SafetyCheckResult`'s enum includes categories like `abuse_disclosure` and `off_topic_unsafe`, but `preFilterSafety()` only runs ~6 self-harm regex patterns (English + Bangla). The DB (`tutor_chat_messages.safety_category`) and any downstream consumer can be led to believe a real moderation classifier is running, when in fact only a keyword floor exists — the code comment itself says "a floor, not a ceiling." For a platform serving minors, either implement the categories the schema promises or shrink the enum to what the regex floor actually produces, and add a real moderation pass (e.g. a hosted moderation endpoint) before broad rollout, not just self-harm keywords.

**H3 — Prompt rule hardcodes Physics terminology for every subject.**
`web/src/ai/flows/tutor-chat.ts` prompt rule 4: *"Always adhere to official NCTB textbook physics terminology."* This applies unconditionally in both `rubric` and `general` chat modes, regardless of the actual subject/chapter passed in. Once Chemistry/Math/English chapters go live (curriculum ingestion is already Physics-only per `docs/LAUNCH_CHECKLIST.md §10`), every tutor answer for those subjects will be biased toward physics vocabulary and examples. **Fix:** make the terminology rule subject-parameterized from the session's `subject_id`.

**H4 — Empty RAG retrieval silently authorizes invention in paper generation.**
`web/src/ai/flows/generate-question-paper.ts`: when `retrieveGroundingFlow` returns no chunks for a chapter, the assembled prompt includes a fallback string telling the model to *"invent conservatively from general NCTB knowledge"* — directly contradicting the same prompt's instruction not to invent content outside the grounded context. Given curriculum ingestion currently covers only a subset of chapters (`docs/LAUNCH_CHECKLIST.md §10`: "only Physics ch. 2–3 ingested of 8 books / 14 chapters" at last audit), most paper-generation requests today are likely hitting this fallback and producing ungrounded content while still being labeled "NCTB-grounded" in the UI. **Fix:** fail closed — reject generation (with a clear "this chapter isn't ready yet" message) below a minimum retrieved-chunk threshold, rather than falling back to invention.

**H5 — No CSRF/abuse controls on the public waitlist form; anti-bot is honeypot-only.**
`docs/LAUNCH_CHECKLIST.md §6` (confirmed still open): the anonymous `waitlist_signups` insert path has a honeypot field but no CAPTCHA and no IP rate limit. This is public-internet-facing and pre-auth — worth closing before any marketing push, not just before "scale."

**H6 — No security headers configured.**
`web/next.config.ts:1-33` sets only `poweredByHeader: false`. There is no `headers()` block for HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `frame-ancestors`, or a CSP. Given the app renders user-influenced markdown (tutor chat responses via `react-markdown`) and handles PDPA-scoped minor data, a baseline CSP + frame-ancestors is a cheap, high-value addition.

**H7 — Internal worker-secret comparison is not constant-time.**
`web/src/app/api/internal/process-grading-queue/route.ts:29`: `secret !== process.env.INTERNAL_WORKER_SECRET` is a plain `!==` string compare, timing-attack-able in principle. Low real-world severity (the route is not high-value or frequently hit by attackers), but trivial to fix with `crypto.timingSafeEqual` — worth doing given `docs/LAUNCH_CHECKLIST.md §1` also flags that the *current* secret is already exposed in git history and needs rotation regardless.

**H8 — HEIC/PDF uploads bypass compression, contrary to what the code implies.**
`web/src/components/upload-form.tsx:280-320`. `compressImage()` guards on `file.type.startsWith("image/")` (line 281) — HEIC files report MIME type `image/heic`/`image/heif`, which passes this guard, but `createImageBitmap()` cannot decode HEIC in Chromium/most non-Safari browsers, so the call throws, falls into the catch path, and the **original multi-megabyte file is uploaded uncompressed** — silently, with no user-facing signal that compression didn't happen. Given the target user is "rural Bangladeshi students on metered 3G/4G" (`web/PRODUCT.md:24`), this is a real bandwidth/cost problem for a meaningful slice of the user base. **Fix:** detect HEIC by extension/MIME and either convert via a WASM HEIC decoder before canvas drawing, or reject with a clear "please export as JPEG" message instead of silently uploading raw.

---

## Architecture & Performance

**Strengths worth preserving:**
- The four-layer grading pipeline (transcribe → hybrid RAG retrieve → rubric-cited evaluate → provenance-tracked persist) is a clean separation of concerns, and every `grading_results` row carries `model_name`/`prompt_version`/`rubric_version_id`/`pipeline_version` — genuinely good practice for an auditable AI product, and rare at this project stage.
- RLS is enabled on all tables; a single `service-role` client (`web/src/lib/supabase/service-role.ts`) is deliberately isolated with a runtime browser guard (`if (typeof window !== "undefined") throw`) — a good defense-in-depth pattern against accidental client-bundle leakage.
- Async grading via `pgmq` with idempotency keys, `MAX_ATTEMPTS`-capped retry, and a terminal `FAILED` state is more production-hardened than typical for this stage.
- `tsconfig.json` has `strict: true`; only 23 `any` occurrences across the whole `web/src` tree, 0 `@ts-ignore`/`@ts-expect-error`.

**Gaps:**

1. **Queue visibility timeout may be too tight for multi-page VLM grading.** `VISIBILITY_TIMEOUT_SECONDS = 120` (`process-grading-queue/route.ts:10`) combined with `maxDuration = 60` on the route (line 6) and `BATCH_SIZE = 5` sequential submissions per invocation — a multi-page submission with several rubric-evaluation calls can plausibly exceed 120s, causing pgmq to redeliver the same job to a second invocation while the first is still running (duplicate-processing risk, mitigated only by the `COMPLETED` short-circuit in `gradeSubmissionFlow`, not by a lock). Consider raising the visibility timeout and/or dropping `BATCH_SIZE` to 1–2, or adding a heartbeat that extends visibility mid-processing.
2. **Static, generic RAG query for paper generation.** The retrieval query text in `generate-question-paper.ts` is one fixed English string reused for every chapter/paper-type combination, which weakens retrieval quality precisely where grounding matters most (see H4).
3. **`tutor-page-client.tsx` is 858 lines** (`web/src/components/tutor-page-client.tsx`) — the largest client component in the app by a wide margin (next largest is 493 lines). This is a strong decomposition candidate: session-list sidebar, chat panel, and prompt-chip logic are natural seams to split into separate components/hooks, both for maintainability and to shrink the client bundle sent for a page most users will hit repeatedly.
4. **Unbounded chat history load.** `tutorChatFlow` and the `/api/tutor-chat` route load the full message history for a session on every turn with no sliding-window cap and no per-message length limit — a long-running session grows both LLM cost and context-window risk linearly, and enlarges the prompt-injection surface. `docs/LAUNCH_CHECKLIST.md` already proposes `history.slice(-6)` plus a 1,000-char input cap — a good, minimal fix.
5. **`recharts` is referenced in `next.config.ts`'s `optimizePackageImports` but is not a dependency and not imported anywhere in `src`** (`web/package.json` has no `recharts`; `grep -rl recharts src` returns nothing). Dead config — harmless but should be removed to avoid confusing future contributors about what charting library is actually in use (the app hand-rolls SVG charts in `BarChart.tsx`/`ScoreRing.tsx` instead).
6. **No transaction wrapping on multi-table writes.** Both paper generation (C3) and the general pattern of "insert parent, then loop-insert children" elsewhere in `web/src/app/actions/` would benefit from being pushed into Postgres RPCs so partial failures roll back atomically instead of relying on manual compensating deletes.
7. **AI-provider selection logic is triplicated.** The same NIM/AgentRouter branch (`isNim = ... .startsWith("nim/") || Boolean(process.env.NVIDIA_NIM_API_KEY)`, then stripping the provider prefix from the model name) is copy-pasted near-verbatim in `web/src/ai/genkit.ts`, `web/src/ai/flows/tutor-chat.ts:236`, `web/src/app/api/tutor-chat/route.ts:321` (the route's own inline SSE client, built by calling the raw OpenAI SDK directly instead of reusing the Genkit flow), and `web/src/ai/flows/generate-question-paper.ts:138`. Factor this into one shared `resolveProvider()`/`getRawClient()` helper — as written, a provider migration (as already happened once, Google GenAI → NIM) requires editing four files in sync.
8. **Supabase anon-client construction duplicated 4×.** `dashboard/tutor/page.tsx`, `dashboard/practice/page.tsx`, `dashboard/practice/[id]/page.tsx`, and `dashboard/practice/generate/page.tsx` each hand-construct their own `createClient(NEXT_PUBLIC_SUPABASE_URL!, NEXT_PUBLIC_SUPABASE_ANON_KEY!)` because they run inside `'use cache'` functions where the cookie-bound `lib/supabase/server.ts` client can't be used. Worth factoring into one `lib/supabase/cached.ts` helper rather than four independent copies.
9. **Admin authorization is hardcoded and duplicated.** The same admin-email allowlist (`'syed.salman.reza.181@gmail.com'` + an `ADMIN_EMAILS` env extension) is inlined separately in `dashboard/layout.tsx:31` and `dashboard/admin/waitlist/page.tsx:24`. Two independent copies of an authorization check is exactly the kind of duplication that silently drifts — one gets updated, the other doesn't, and the admin surface is now inconsistently gated. Centralize into a single `isAdmin(email)` helper.
10. **Curriculum coverage is a single-subject vertical slice today**, not the 4-subject platform `web/PRODUCT.md` describes: only SSC Physics is ingested (confirmed 14/14 chapters per `docs/PHYSICS_AUDIT_FINDINGS.md`); Chemistry/Math/English show empty states in Practice. This matters for H3/H4 above — the physics-hardcoded tutor prompt and generic paper-gen retrieval query are currently invisible precisely because nothing else has content yet to expose them.

---

## Security Review

| Area | Finding | Severity |
|---|---|---|
| RLS coverage | All tables RLS-protected; service-role isolated to server-only, browser-guarded | ✅ Good |
| AI prompt-context trust | Rubric session context accepted from client on session create (H1) | High |
| Secrets | `INTERNAL_WORKER_SECRET` already committed to git history per `docs/LAUNCH_CHECKLIST.md §1` — rotation still open | High (until rotated) |
| Timing safety | Worker-secret compare is non-constant-time (H7) | Low |
| Transport hardening | No CSP/HSTS/`X-Content-Type-Options`/`frame-ancestors` (H6) | Medium |
| Public form abuse | Waitlist has honeypot only, no CAPTCHA/IP rate limit (H5) | Medium |
| Auth flow | No password-reset routes; no sign-up rate limiting; raw Supabase error strings shown to users (`docs/LAUNCH_CHECKLIST.md §8`, confirmed still open) | Medium |
| Rate limiting | Tutor chat: hand-rolled Postgres per-day count (50 msgs/day), reasonable for now; paper generation: **no rate limit at all** — `docs/LAUNCH_CHECKLIST.md §10` confirmed still open, and each call fans out to N embedding calls + one large structured generation, an easy way to burn a free-tier LLM quota | Medium |
| Injection surfaces | No raw SQL string concatenation found; Zod validation present on server actions (`generate-paper.ts`, `waitlist.ts`); Genkit flows use structured/typed output schemas | ✅ Good |
| Minor-safety | Self-harm regex floor only, explicitly documented as non-exhaustive (H2) | High (product-risk, not code-risk) |

---

## Testing & CI/CD Readiness

- **Test coverage is thin**: 5 files, ~166 total lines (`mark-glyph.test.ts`, `tutor-chat.test.ts`, `translations.test.ts`, `validation.test.ts`, `waitlist-email.test.ts`) — unit-level only, covering validation logic, translation-key parity, and score-threshold math. No integration or e2e tests exist despite `docs/Comprehensive Automated Browser Testing Plan (Suites 1–7) Plan.md` describing a plan for one.
- **No CI workflow found** (`.github/workflows` does not exist in this repo). Lint (`eslint.config.mjs`, includes `eslint-plugin-jsx-a11y`), typecheck, and `vitest run` all currently depend on a human running them locally before merge — nothing gates a PR automatically.
- **Golden-set evaluation infra exists but is unpopulated** (C4) — this is simultaneously a testing gap and a product-integrity gap, since it's the only mechanism that would catch a grading-quality regression before a real student sees it.
- Quick win: even a minimal GitHub Actions workflow running `npm run lint && npx tsc --noEmit && npm run test` on every PR would catch a meaningful class of regressions for near-zero cost, given the scripts already exist.
- **ESLint is already doing real work worth preserving**: `web/eslint.config.mjs` hard-errors on raw hex-color literals in `.tsx` outside `components/ui/`, enforcing the design-token system at lint time — a genuinely strong practice most teams skip. `@typescript-eslint/no-explicit-any`, `no-unused-vars`, and `ban-ts-comment` are intentionally left as `"warn"` with a comment promising to tighten them once debt is paid down (`eslint.config.mjs:45`) — the debt is now down to 3 `any` occurrences total (`waitlist-table.tsx:178,188,198`, typing an `onChange` handler), so this is a good moment to flip that rule to `"error"`.
- `jsx-a11y/recommended` is wired as warnings only, and with no CI, a11y warnings never block anything in practice — pairs with the a11y gaps below.

---

## UI/UX & Design System

**Strengths:**
- A genuinely coherent 3-layer OKLCH design token system (`web/DESIGN.md`, source of truth in `globals.css`) — primitive → semantic → component, with an ESLint rule against raw color literals in `.tsx`. This is more disciplined than most apps at this stage.
- Real loading/error/empty-state route scaffolding exists: `error.tsx`, `not-found.tsx`, `global-error.tsx`, and per-route `loading.tsx` for dashboard, submissions, submissions/[id], profile, upload, study-plan, tutor, and practice/generate.
- Theme system is now a single, correctly-implemented mechanism (`next-themes` + pre-paint script, no FOUC), superseding an earlier dual-implementation problem.
- Bilingual typography is deliberate and specific (Baloo 2 / Baloo Da 2 / Inter / Noto Sans Bengali / Space Mono, all self-hosted via `next/font`), matching a real product requirement rather than an afterthought.

**Gaps (confirmed still open):**
1. **Legacy CSS layer on `/login`, `/signup`, and parts of the landing page** — plain CSS/inline styles coexisting with the Tailwind v4 + shadcn system used everywhere else in the dashboard. A visible, unfinished migration seam; these are also the first pages a new user sees.
2. **Heading hierarchy skip on the landing page** — `h1` → `h3` in feature cards with no `h2`, an axe/Lighthouse-flagged a11y issue.
3. **Chart label contrast** — `BarChart.tsx` renders day labels at `#989faf` on white, a 2.65:1 contrast ratio against the WCAG AA 4.5:1 minimum for normal text.
4. **Touch targets** — the page-thumbnail delete button in `upload-form.tsx` is 20×20px (`w-5 h-5`), well under the 44×44px WCAG-recommended minimum for a mobile-first upload flow.
5. **`ExplainSimplyButton` only binds to the first observation** in a graded question's `observations_json[0]` (`SubmissionDetailClient.tsx`), so a question with multiple rubric deductions can only get an AI explanation for the first one — a functional gap, not just cosmetic, on the app's signature "explain this step" feature.
6. **i18n inconsistency at the UI level**: `login`/`signup` are hardcoded English, `onboarding` is hardcoded Bangla — neither uses the `t()` translation dictionary, so `translations.test.ts` parity checks can't even see them, and a Bangla-preferring user hits an English auth flow.
7. **Copy inconsistency**: "HSC" language leaking into an SSC-only product surface (see C2) — both in static copy (login subtitle) and in a runtime default value.
8. **Inconsistent `loading.tsx` coverage.** 8 dashboard subroutes have a proper route-level `loading.tsx`; `practice`, `practice/[id]`, `achievements`, `mistake-analysis`, `board-simulator`, and `admin/waitlist` do not (some substitute an inline `<Suspense>` instead, which is a reasonable equivalent, but the mix is inconsistent enough to be worth auditing in one pass rather than route-by-route).
9. **Thin a11y attribute surface overall**: only ~34 `aria-label` occurrences and 3 `alt=` attributes across the entire `.tsx` tree for an app with this many interactive dashboard screens — the specific gaps already flagged (contrast, heading order, touch targets) are symptoms of a broader pattern, not isolated misses.
10. **Static progress stepper on submission detail** uses a hardcoded fallback (`isDone = isComplete || i < 4`) instead of real per-stage status, understating how close (or far) a submission actually is mid-grading — worth replacing with a live Supabase Realtime subscription on `exam_submissions` status transitions, which the codebase already uses elsewhere (`Header.tsx`'s realtime subscription for grading-complete notifications is a working precedent to copy).

---

## Prioritized Action Plan

### Quick wins (hours, not days)
1. Fix the `'HSC'` default fallbacks → `'SSC'` (C2) and the login-page copy bug.
2. Add a `headers()` block to `next.config.ts` for HSTS/CSP/`frame-ancestors`/`X-Content-Type-Options` (H6).
3. Swap the worker-secret compare to `crypto.timingSafeEqual` (H7); rotate `INTERNAL_WORKER_SECRET` (already flagged as exposed in git history).
4. Remove dead `recharts` entry from `next.config.ts` `optimizePackageImports`.
5. Fix chart-label contrast (`#989faf` → `#555e6d` as already proposed in `docs/PHYSICS_AUDIT_FINDINGS.md`) and the landing-page `h1`→`h3` heading skip.
6. Resize the upload-page thumbnail delete button to ≥44×44px.
7. Cap tutor chat history to the last ~6 turns and message length to ~1,000 chars.
8. Bind `ExplainSimplyButton` to every `observations_json` entry, not just index 0.
9. Add a minimal CI workflow: lint + typecheck + `vitest run` on every PR.
10. Add a CAPTCHA (Turnstile/hCaptcha) to the public waitlist form.

### Near-term (days)
11. Replace every fabricated dashboard fallback (C1) with a real, verified empty state — this should be treated as a launch blocker, not a polish item.
12. Server-load tutor rubric context from `grading_results` instead of trusting client-supplied fields (H1).
13. Make the tutor's subject-terminology rule dynamic instead of hardcoding physics (H3).
14. Add mark-sum and `chapter_id ∈ input` validation before any paper-generation DB write, and wrap the paper/rubric/question insert sequence in a single Postgres RPC (C3).
15. Fail closed on empty RAG retrieval in paper generation instead of authorizing invention (H4).
16. Fix HEIC/PDF upload compression passthrough — detect and either convert or reject with a clear message (H8).
17. Add a rate limit to paper generation (currently none).
18. Finish the auth-flow gaps: password reset routes, sign-up rate limiting, translated (not raw) Supabase error messages, i18n-consistent login/signup/onboarding.

### Long-term refactors
19. Populate the golden-set benchmark (~30 human-graded scripts, 3-examiner consensus) and wire `eval:golden-set` into CI with a numeric MAE/QWK pass bar — the highest-leverage single investment in the codebase (C4).
20. Either implement real content moderation for the tutor's safety categories or shrink the schema to match the actual regex-floor behavior, and add a genuine moderation API pass ahead of broad rollout (H2).
21. Decompose `tutor-page-client.tsx` (858 lines) into session-list, chat-panel, and prompt-chip components/hooks.
22. Migrate the remaining legacy plain-CSS pages (`/login`, `/signup`, parts of the landing page) onto the Tailwind v4 + shadcn/OKLCH-token system used elsewhere.
23. Replace the static submission-progress stepper with a live Realtime status subscription, matching the pattern already used in `Header.tsx`.
24. Scale curriculum ingestion beyond current Physics-chapter coverage before enabling paper generation/tutoring broadly for other subjects, given H3/H4 depend on it.

---

## Feature Enhancement Ideas (Product)

1. **Confidence-gated human review queue.** `evaluate-rubric.ts` already emits `grounding_confidence` per grading result, but low-confidence grades aren't routed anywhere (`docs/LAUNCH_CHECKLIST.md §10`). Building a lightweight teacher/admin review queue for sub-threshold grades would directly de-risk the "unverified accuracy" problem (C4) in production, not just in a one-time benchmark.
2. **Student-facing OCR review/correction step.** Before a submission is graded (or alongside the result), show the verbatim VLM transcript next to the original photo with an inline "this isn't what I wrote" correction affordance per line — turning the existing binary dispute flag into a genuinely actionable correction loop, and generating labeled data that can feed back into the golden set.
3. **Per-step "explain it simply" for every deduction**, not just the first (already listed as a bug fix above, but also a real feature completion — this is the app's core differentiator and currently only half-works).
4. **Real-time grading progress stream.** Replace the static stepper with a Realtime-driven progress bar showing actual pipeline stage (OCR → grounding → evaluating → done); combined with typical LLM latency on the free NIM tier, visible progress meaningfully changes perceived quality for an anxious exam-prep audience.
5. **Cohort-grounded momentum/percentile.** Once there's a real user base, replace the currently-fabricated `momentumScore`/`percentileRank` heuristics with an actual cohort-relative computation (or remove the metric entirely if the population is too small to be meaningful) — directly resolves C1 while keeping the feature idea that motivated it.

---

## Notes on Method

This report consolidates and verifies (with current file:line citations) findings from four prior internal audits already in the repository (`AI_CODE_REVIEW_FINDINGS.md`, `SHERATUTOR_CODEBASE_REPORT.md`, `docs/PHYSICS_AUDIT_FINDINGS.md`, `docs/LAUNCH_CHECKLIST.md`), plus fresh checks against the current tree (git status, tsconfig, service-role client, worker-auth route, dashboard fallback logic, theme system, upload compression, `next.config.ts`). Where an older finding no longer reproduces in the current code, this report says so explicitly rather than re-reporting stale issues as open.
