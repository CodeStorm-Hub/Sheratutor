# SheraTutor `web/` — Full Redesign Plan (Visual + Technical + Backend)

## Context

SheraTutor is a free AI board-examiner app for Bangladeshi students (Next.js 16, React 19, Tailwind v4, shadcn/radix-ui, Supabase, Genkit AI). A codebase review surfaced two problem classes: (1) the UI was built without a consistent responsive strategy — several components (notably the tutor chat session sidebar) break on mobile, and nothing scales deliberately for large/wide displays; (2) the backend/AI layer has real gaps — missing input validation on some auth/API paths, no streaming on the one latency-sensitive endpoint (tutor chat), silent-fail config, and an IDOR-shaped query. The user wants a full visual + technical redesign (not just patches) that also respects Bangladeshi students as the primary audience (font choice matters), covers mobile through ultrawide, and extends into backend/AI hardening. This plan is a review document only — no code changes happen until it's approved.

---

## 1. Design System Evolution

**Fonts — recommendation: keep Baloo Da 2 for Bangla display, replace Hind Siliguri with Noto Sans Bengali for Bangla body text.**
Rationale: Hind Siliguri/Baloo Da 2 are already wired via `next/font/google` in [layout.tsx](src/app/layout.tsx) with proper `display: swap` and variable-font subsetting. SolaimanLipi/Kalpurush are the most *culturally recognized* Bangla fonts in Bangladesh (print/government/education standard) but are print-era DTP fonts with weaker hinting/metrics at small UI sizes, and self-hosting them adds licensing diligence (Ekushey Punarbhaba terms) and build-pipeline maintenance the project doesn't have today. Noto Sans Bengali is Google-hosted (same integration pattern, zero new infra), purpose-built for UI legibility at small sizes, and is a safe upgrade over Hind Siliguri. Concrete change: swap the `Hind_Siliguri` import for `Noto_Sans_Bengali` as `--font-body-bn` in [layout.tsx](src/app/layout.tsx); keep `Baloo_Da_2` for headings (brand "bounce"). Log SolaimanLipi/Kalpurush self-hosting as a post-launch enhancement gated on real student feedback, not a blocker.

**Color/token strategy** — extend [globals.css](src/app/globals.css), don't replace the existing OKLCH token system (`@theme inline` block, lines 12–67):
- Add an elevation scale (`--shadow-xs/sm/md/lg/xl`) — none exists today. Light mode: navy at low alpha; dark mode: black at higher alpha.
- Add a `--space-*` scale (4/8/12/16/24/32/48/64) as CSS vars for a tunable density system, replacing ad hoc per-component spacing choices.
- Dark mode: `.dark` currently reuses `--color-card-navy` for both `--card` and `--muted` (lines 112, 116), flattening surface hierarchy — add `--color-card-navy-raised` for elevated surfaces (dialogs, active session cards).
- Keep `--chart-1..5` as-is.

**Responsive strategy**:
- Mobile-first Tailwind v4 defaults. Add the missing `sm:` (640px) step everywhere the audit found it skipped (landing page hero/cards, two-column forms that jump straight to `md:`).
- Use Tailwind v4 native container queries (`@container`, `@sm:`/`@md:` prefixes) for components rendered in multiple layout contexts at different available widths — specifically the tutor chat panel and dashboard summary cards. Keep viewport media queries for page-level shell decisions (sidebar visibility, grid column count).
- Fix the mobile viewport-height bug: `h-[calc(100vh-8rem)]` in [dashboard/tutor/page.tsx](src/app/dashboard/tutor/page.tsx) → `h-[calc(100dvh-8rem)]` so mobile browser chrome collapse doesn't clip the chat panel.
- Wide-display strategy: replace the flat `max-w-5xl` wrapper in [dashboard/layout.tsx:14](src/app/dashboard/layout.tsx) with `max-w-5xl` up to `xl`, `2xl:max-w-7xl` beyond, and add a `2xl:grid-cols-[1fr_360px]` secondary rail on [dashboard/page.tsx](src/app/dashboard/page.tsx) so ultrawide monitors get real content instead of dead whitespace.

---

## 2. Dashboard Shell & Navigation Redesign

[dashboard-nav.tsx](src/components/dashboard-nav.tsx) already has the right pattern (desktop `hidden md:flex` sidebar + mobile `Sheet` drawer) and becomes the shared primitive:
- Migrate to the shadcn `Sidebar` block (`SidebarProvider`, `SidebarTrigger`) for collapsible-to-icon-only desktop behavior — today's sidebar is a fixed `md:w-60` strip with no collapse, wasteful on wide monitors and cramped on 13" laptops.
- Add breadcrumbs in [dashboard/layout.tsx](src/app/dashboard/layout.tsx), derived from nav links + dynamic segments (subject/chapter names, submission titles).
- Fix [tutor-page-client.tsx:114-146](src/components/tutor-page-client.tsx) — the session-history sidebar is a hardcoded `w-64 shrink-0` with **no mobile fallback**, the single worst responsive break in the app. Reuse the exact `Sheet` drawer pattern already proven in `DashboardNav`: below `md:` render a history icon that opens the session list as a left `SheetContent`; at `md:`+ keep it as a persistent inline column.

---

## 3. Page-by-Page Changes

| File | Change |
|---|---|
| [tutor-page-client.tsx](src/components/tutor-page-client.tsx) | Session sidebar → Sheet drawer on mobile / persistent column on desktop (§2) |
| [dashboard/tutor/page.tsx](src/app/dashboard/tutor/page.tsx) | `100vh` → `100dvh` height calc |
| [dashboard/page.tsx](src/app/dashboard/page.tsx) | Header: `justify-between` → `flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`; add `2xl:` secondary rail |
| [page-transcription-card.tsx](src/components/page-transcription-card.tsx) | Flag button `h-7` → `h-11 w-11` hit area (44px touch-target minimum) |
| [generate-paper-form.tsx](src/app/dashboard/practice/generate/generate-paper-form.tsx) | `grid-cols-2` → `grid-cols-1 sm:grid-cols-2` on checkbox/select grids |
| [waitlist-form.tsx](src/components/waitlist-form.tsx) | Same `grid-cols-1 sm:grid-cols-2` fix |
| [submissions/[id]/page.tsx](src/app/dashboard/submissions/[id]/page.tsx) | Rubric rows: `flex-col sm:flex-row` |
| [page.tsx](src/app/page.tsx) (landing) | Add missing `sm:` step on hero/card grids; consider `@container` for repeated card components |
| [dashboard/layout.tsx](src/app/dashboard/layout.tsx) | `max-w-5xl` → `max-w-5xl 2xl:max-w-7xl` |
| [dashboard-nav.tsx](src/components/dashboard-nav.tsx) | Migrate to shadcn `Sidebar` block, add desktop collapse (§2) |
| upload, study-plan, profile, submissions list pages | Visual-only pass: apply new elevation tokens to `Card` usages, adopt new spacing scale |
| [upload-form.tsx](src/components/upload-form.tsx), [explain-simply-button.tsx](src/components/explain-simply-button.tsx) | Audit all icon-only buttons for 44px touch targets |

---

## 4. Backend/AI Layer Improvements

- **Zod everywhere**: add validation to [auth.ts](src/app/actions/auth.ts) (`signUpWithEmail`/`signInWithEmail` currently have none) and to every API route doing an `as`-cast on `request.json()` — [tutor-chat/route.ts](src/app/api/tutor-chat/route.ts), [submissions/route.ts](src/app/api/submissions/route.ts), the flag route, both session routes.
- **Fix tutor-chat IDOR**: [tutor-chat/route.ts:94-101](src/app/api/tutor-chat/route.ts) looks up a chat session by `id` alone with no `student_id` filter in the query — add `.eq("student_id", user.id)` as defense-in-depth, don't rely solely on RLS.
- **Centralized route protection**: [middleware.ts](src/lib/supabase/middleware.ts)/[proxy.ts](src/proxy.ts) only refresh the session cookie today — add explicit redirect-on-unauthenticated for `/dashboard/*` and protected `/api/*` there, instead of every page/route re-implementing its own check.
- **Stream tutor chat**: switch [tutor-chat.ts](src/ai/flows/tutor-chat.ts) from `ai.generate` to `ai.generateStream`, change the API route to return SSE/`ReadableStream`, and rewrite `handleSend` in [tutor-page-client.tsx](src/components/tutor-page-client.tsx) + [tutor-chat-panel.tsx](src/components/tutor-chat-panel.tsx) for incremental rendering (watch for KaTeX rendering mid-stream on incomplete math blocks). This is the single largest and riskiest item in the plan.
- **Fail-fast config**: [genkit.ts](src/ai/genkit.ts) defaults missing API keys to the literal string `"unset"` — replace with a startup assertion that fails loudly instead of producing confusing 401s later.
- **Retry/backoff**: no `ai.generate`/`ai.embed` call anywhere has retry/backoff despite NIM's ~40 RPM ceiling — add a shared wrapper used by every flow in `src/ai/flows/`.
- **Pin `model_version`**: [grade-submission.ts](src/ai/flows/grade-submission.ts) hardcodes `"unpinned"` in audit provenance — resolve the real model id from `genkit.ts`.
- **Typed flow errors**: replace generic `throw new Error(...)` on missing model output across flows with a typed error class.
- **Wire the grading queue cron**: [process-grading-queue/route.ts](src/app/api/internal/process-grading-queue/route.ts) is manual-drain only — add a scheduled trigger (Vercel Cron or equivalent) with the existing worker-secret gate.
- **Confirm `retrieve-grounding.ts` service-role usage**: it bypasses RLS on `curriculum_chunks` inside a live user request — confirm that table is genuinely global/non-tenant-scoped and document the exception, or switch to the request-scoped client if not.
- **`generate-paper.ts` rollback**: no transaction/cleanup if question insertion fails mid-loop after the paper row is created — wrap in a Postgres RPC transaction or clean up on catch.
- **`study-plan.ts` error handling**: DB failures are `console.error`-only today — return a typed error state so the UI can show a retry affordance.

---

## 5. Phased Rollout

| Phase | Scope | Size |
|---|---|---|
| 0 | Design tokens + font swap (Noto Sans Bengali), elevation/spacing tokens in `globals.css` | S (2–3d) |
| 1 | Dashboard shell/nav: shadcn Sidebar migration, breadcrumbs, tutor session drawer fix, `dvh` fix, wide-layout wrapper | M (3–5d) |
| 2 | Page-by-page responsive + visual pass (§3 table), container-query adoption | L (~1–1.5wk) |
| 3 | Backend hardening: zod pass, IDOR fix, middleware protection, fail-fast config, retry/backoff, model pinning, transaction fix, cron wiring — runs independent of/parallel to Phases 1–2 | M (4–6d) |
| 4 | Streaming tutor chat (backend + client rewrite) — last, since it's highest-risk and benefits from Phase 3 already landing | M–L (5–7d) |

---

## 6. Risks / Tradeoffs

- Deferring SolaimanLipi/Kalpurush means the "most culturally familiar" font goal isn't fully met at launch — explicit tradeoff, revisit with real student feedback.
- Streaming chat rewrite is the biggest risk: SSE/ReadableStream client handling plus partial-markdown/KaTeX rendering is materially more complex than today's `fetch().json()`.
- Container queries have ~93% global support but the target audience (Bangladeshi students, often older/lower-end Android) should be checked against real analytics before leaning on them heavily.
- Centralizing auth in middleware needs an RLS policy audit first — a route wrongly excluded from the middleware matcher becomes silently unprotected, less visible than today's explicit per-page checks.
- shadcn Sidebar migration touches every dashboard page indirectly — low code risk, broad manual-QA surface.
- `generate-paper.ts` transaction fix likely needs a new Postgres RPC (a Supabase migration + `types.ts` regeneration), not pure Next.js work.

## Verification

- Responsive work: manual pass at 375px (mobile), 768px (tablet), 1280px (laptop), 1920px+ (wide) in the browser preview for every page in §3, plus dark mode toggle at each size.
- Backend work: existing `scripts/test-tutor-chat.ts` / `scripts/test-general-chat.ts` smoke tests, plus manual verification that an unauthenticated request to a protected route now redirects/401s consistently, and that a cross-student session-id request to `tutor-chat` now 403s instead of leaking.
- Streaming chat: verify token-by-token rendering in the browser, confirm KaTeX/markdown doesn't error on partial content, confirm graceful fallback if the stream errors mid-response.

### Critical files
`src/app/layout.tsx`, `src/app/globals.css`, `src/components/dashboard-nav.tsx`, `src/components/tutor-page-client.tsx`, `src/app/api/tutor-chat/route.ts`, `src/ai/genkit.ts`, `src/lib/supabase/middleware.ts`
