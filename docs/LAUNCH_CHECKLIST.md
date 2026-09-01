# SheraTutor — Launch Checklist

> Living document. Derived from a full review of `web/` on 2026-09-01.
> Tick items as they land. Keep the priority/phase tags — they drive sequencing.

**Priority:** `P0` blocker · `P1` needed for a credible launch · `P2` fast-follow
**Phase:** `A` public waitlist · `B` private early access · `C` public product

Minimum bar to ship the **waitlist (Phase A)**: sections 1, 2, 3, 4, 5, 6, 7, 13.
Everything tagged `B`/`C` is the early-access / public-product gate and comes after.

---

## 0. TL;DR decisions still open

- [x] **Email provider** — Zoho SMTP configured via App Password (`support@sheratutor.tech`, `smtppro.zoho.com`).
- [ ] **Email confirmation on signup** — on or off? Drives the auth flow work in §8.
- [x] **Brand domain** — reconciled to `sheratutor.tech`.
- [ ] **Percentile / momentum score** — ground in real cohort data or remove from the UI (§9).

---

## 1. Domain cutover to `sheratutor.tech` — P0 / A

- [x] Set `NEXT_PUBLIC_SITE_URL=https://sheratutor.tech` in Vercel **Production** env / `.env.local`; redeploy (value is inlined at build time).
- [x] New migration `00000000000030_waitlist_email_and_cron_update.sql`: `cron.unschedule('process-grading-queue')` then reschedule with `url := 'https://sheratutor.tech/api/internal/process-grading-queue'`.
- [x] In that migration, read the worker secret from `vault.decrypted_secrets` with fallback.
- [ ] **Rotate `INTERNAL_WORKER_SECRET`** (current value is in git history); update Vercel env + the new migration.
- [ ] Supabase → Auth → URL Configuration: Site URL `https://sheratutor.tech`; redirect allow-list `https://sheratutor.tech/**` and keep `http://localhost:3000/**`.
- [ ] Google Cloud Console → OAuth client: add `https://sheratutor.tech` to Authorized JavaScript origins.
- [ ] Choose canonical host (apex vs `www`); 308-redirect the other; force HTTPS.
- [ ] Verify cron fires: `select jobname, status, return_message from cron.job_run_details order by start_time desc limit 5;`
- [x] Update domain in docs: `web/PRODUCT.md:43`, `README.md:16`.

---

## 2. Email infrastructure (Zoho) — P0 / A

### Can we send via Zoho App Password + SMTP? — findings

**Short answer: yes, but not on the Forever Free plan.** An App Password is only the
auth credential; it does not unlock SMTP on a plan that excludes it.

| Source | Says |
|---|---|
| Zoho IMAP help page | "For newly signed-up users (Free plan), the IMAP Access feature will not be available." IMAP **and** SMTP for external clients are paid-only for new accounts. |
| Zoho SMTP help page | Lists `smtp.zoho.com` for "Free Organization users" — reflects **older** provisioning; newer free accounts are blocked. Treat as stale. |
| Third-party (2026) | Zoho moved IMAP/POP/SMTP behind **Mail Lite** ($1/user/mo, $12/user/yr) after free SMTP was abused for bulk sending. |
| Send limits | Free ~200/day · Mail Lite ~250–500/day · Premium ~1,000/day. |

**Recommendation:** use **ZeptoMail** (Zoho's transactional product) for anything the
app sends. Better deliverability, higher limits, separate credits, SMTP + REST API.
Keep a free Zoho *Mail* mailbox only for humans to read/reply (`hello@`, `support@`).

**Decision (2026-09-01):** the **waitlist email is kept entirely separate from Supabase
Auth**. The waitlist server action saves the row to Supabase *and* sends its own
verification email straight through Zoho SMTP — it does not go through Supabase Auth's
email system. Supabase Auth's Custom SMTP (§2 → Supabase Auth task) is a separate
concern that only matters once login/signup goes live. Both ultimately point at the
same Zoho/ZeptoMail SMTP credential, configured once.

### SMTP settings (once on a plan that includes it)

| Field | Value |
|---|---|
| Host | `smtp.zoho.com` (personal / free-org) · `smtppro.zoho.com` (paid domain org) · `smtp.zeptomail.com` (ZeptoMail) |
| Port | `587` (STARTTLS) or `465` (SSL) |
| Username | full address, e.g. `noreply@sheratutor.tech` |
| Password | **App Password** — `accounts.zoho.com` → Security → App Passwords (requires 2FA enabled). Not the login password. |
| Auth | required |

### Tasks

- [ ] **DNS on `sheratutor.tech`** — P0/A:
  - [ ] Zoho domain-verification `TXT`
  - [ ] `MX` → `mx.zoho.com`, `mx2.zoho.com`, `mx3.zoho.com`
  - [ ] `SPF` `TXT` → `v=spf1 include:zoho.com include:zeptomail.net ~all` (adjust to chosen senders)
  - [ ] `DKIM` selector `TXT` (from Zoho / ZeptoMail console)
  - [ ] `DMARC` `TXT` → `v=DMARC1; p=none; rua=mailto:dmarc@sheratutor.tech` (tighten later)
- [x] Create mailboxes: `support@sheratutor.tech`.
- [x] Enable 2FA on the sending account; generate an App Password.
- [ ] **Supabase Auth → Custom SMTP** — P0/B. The built-in sender caps at ~2–4/hour and is unusable in production. Point it at ZeptoMail / Mail Lite SMTP. Blocks all auth email (confirmation, magic link, password reset).
- [x] **Waitlist verification email** — P1/A. Implemented with Nodemailer + double opt-in verification link.

### 2b. Verification-mail flow — decision: **double opt-in (Option B)**

Two approaches were considered:

| | Option A — confirmation only | **Option B — double opt-in (chosen)** |
|---|---|---|
| Behaviour | "You're on the list." No action needed. | Email contains a **"Confirm my spot"** link; only confirmed emails count. |
| Proves the address is real | No | Yes |
| Records explicit consent | Weak | Yes (timestamped) |
| Extra work | None | 3 columns + 1 route + link in the email |

**Why B:** it validates the email before the marketing spend, cleans the traction
number (bots/typos don't inflate it), and gives a proper timestamped consent record —
important given PDPA 2026 and minors. Ship B from the start.

- [x] Columns on `waitlist_signups` (migration `030`): `email_verified boolean not null default false`, `verify_token uuid not null default gen_random_uuid()`, `verified_at timestamptz`.
- [x] Route `GET /waitlist/verify?token=<uuid>` → sets `email_verified = true, verified_at = now()` where `verify_token` matches and not already verified; renders a bn/en success (or "link expired / invalid") page.
- [x] `joinWaitlist` action: `select` the `verify_token` back from the insert, then send the email (see §2c) containing `https://sheratutor.tech/waitlist/verify?token=<token>`.
- [x] Admin count / CSV export (§5) filters on `email_verified = true` for the headline number; keep unverified rows visible separately.
- [ ] Optional P2: a re-send-verification action (rate-limited) for users who lost the email.

### 2c. Implementation stack — Zoho App Password + SMTP

| Concern | Choice |
|---|---|
| SMTP client | **`nodemailer`** (+ `@types/nodemailer` dev). Talks to Zoho with host/port/user/app-password directly. |
| Where it runs | Next.js **server action**, **Node.js runtime** — Nodemailer uses `net`/`tls` and **cannot run on the Edge runtime**. Never add `runtime = 'edge'` to a route that imports it. |
| Non-blocking send | `after()` from `next/server` — email goes out after the form response returns; a slow/failed SMTP call never blocks or fails the signup (row is already saved). |
| Template | plain HTML template literal, or `@react-email/components` + `@react-email/render` if authoring in React. bn/en. |
| If ever moved to a Supabase Edge Function (Deno) | Nodemailer won't work there — switch to `denomailer` or the ZeptoMail REST API. Staying in the Next.js app avoids this. |

- [x] `npm i nodemailer` + `npm i -D @types/nodemailer` in `web/`.
- [x] File layout:
  - `web/src/lib/email/transporter.ts` — module-singleton `nodemailer.createTransport({ host, port, secure: port===465, auth: { user, pass } })`
  - `web/src/lib/email/send-waitlist-verification.ts` — builds the verify URL, calls `mailer.sendMail({ from, to, replyTo: 'support@sheratutor.tech', subject, html, text })`
  - `web/src/lib/email/templates/waitlist-verification.ts` — returns `{ subject, html, text }` per language
- [x] Wire into `web/src/app/actions/waitlist.ts` via `after(async () => { try { await sendWaitlistVerification(...) } catch (e) { console.error(e) } })`.
- [x] Env (Vercel Production **and** Preview, plus `web/.env.example`):
  ```
  ZOHO_SMTP_HOST=smtppro.zoho.com        # or smtp.zeptomail.com
  ZOHO_SMTP_PORT=465                  # 465 SSL, or 587 STARTTLS
  ZOHO_SMTP_USER=support@sheratutor.tech
  ZOHO_SMTP_PASS=<app-password>       # accounts.zoho.com → Security → App Passwords (2FA required)
  ```
  Reuse the existing `NEXT_PUBLIC_SITE_URL` for the verify link.
- [x] Don't set `pool: true` — SMTP connections don't survive between serverless invocations. Accept the ~1–2s handshake on cold start (it's inside `after()`).

- [ ] Verify deliverability to Gmail / Outlook / Yahoo (check spam placement) before the marketing push.

---

## 3. Waitlist form — email required, phone optional — P1 / A

- [x] `web/src/components/waitlist-form.tsx`: add `required` + `*` to the email input; remove `required` and `*` from the phone input.
- [x] `web/src/app/actions/waitlist.ts`:
  - [x] schema `email: z.string().email()` (drop `.optional().or(z.literal(""))`)
  - [x] schema `phone: bdPhone.optional().or(z.literal(""))`
  - [x] insert `phone: parsed.data.phone || null`
- [x] Migration `00000000000030_waitlist_email_and_cron_update.sql`:
  - [x] `alter table waitlist_signups alter column phone drop not null;`
  - [x] backfill / clear null-email test rows, then `alter column email set not null;`
  - [x] drop `unique (phone)`, add `unique (email)`
  - [x] add `email_verified boolean not null default false`, `verify_token uuid not null default gen_random_uuid()`, `verified_at timestamptz` (double opt-in — see §2b)
- [x] Update the `error.code === "23505"` branch — now an email conflict ("This email address is already on the waitlist.").
- [x] Translations `web/src/data/translations.ts`: remove "(ঐচ্ছিক)" / "(Optional)" from `form.email_label`; add optional hint to `form.phone_label`.
- [ ] `referral_source` column exists but the form never sets it — add hidden UTM capture or a "How did you hear about us?" field.

---

## 4. Legal / compliance — P0 / A

*(The waitlist already collects minors' name, email, phone, exam type/year, minor flag, guardian consent, signup role.)*

- [x] `/privacy` route — real PDPA-2026 privacy policy: data collected, purpose, retention, third parties (Supabase, Zoho/ZeptoMail, AI providers), contact, data-subject-request path.
- [x] `/terms` route.
- [x] Wire the footer in `web/src/app/page.tsx` — "Privacy Policy" / "Terms" now render as Next.js Links.
- [x] Confirm the on-page consent notice text exists and matches `consent_notice_version = 'v1'` (`supabase/migrations/00000000000008_waitlist.sql`).
- [ ] Short cookie/storage notice (`sheratutor_lang` cookie + theme `localStorage`).
- [ ] Replace `guardian_consent_method: "CHECKBOX_ACK_PILOT"` with real guardian SMS-OTP verification before scaling past pilot (`web/src/app/actions/onboarding.ts` flags this in-code). — B/C

---

## 5. Analytics & waitlist ops — P0 / A

- [x] Analytics library: `@vercel/analytics` integrated in `layout.tsx`.
- [ ] Track: landing view, form-start, submit success/error, language, referral source.
- [x] Admin view: `/dashboard/admin/waitlist` (metrics, filter, search, and CSV export) protected for `syed.salman.reza.181@gmail.com`.
- [x] **`StudentCount` accurate data** — `web/src/components/landing/student-count.tsx` displays live waitlist member numbers instead of placeholder active student counts.

---

## 6. Anti-abuse on the public form — P1 / A

- [ ] The `anon` insert has no CAPTCHA and no rate limit. Add Cloudflare Turnstile (free) or hCaptcha; verify the token server-side in the action.
- [x] Add a honeypot field (hidden website input for automated bot suppression).
- [ ] IP rate-limit `/` POST (Vercel firewall rule or Upstash Ratelimit).

---

## 7. SEO / social / metadata — P1 / A

- [x] `web/src/app/layout.tsx` metadata: `description`, `metadataBase: new URL('https://sheratutor.tech')`, `openGraph` (title/description/`locale: 'bn_BD'`), `twitter` card, `alternates.canonical`, keywords.
- [ ] `opengraph-image.tsx` or a static 1200×630 OG image.
- [x] `app/robots.ts` and `app/sitemap.ts` (landing + legal only; exclude `/dashboard`).
- [x] `app/manifest.ts` (web manifest / PWA groundwork; brand docs reference app-store icons).
- [x] Verify `<html lang>` / `dir` switch correctly by language.
- [ ] Organisation / WebSite JSON-LD — P2.

---

## 8. Auth flow — P0/P1 / B

- [ ] `signUpWithEmail` (`web/src/app/actions/auth.ts`) redirects straight to `/onboarding` after `auth.signUp()`. If email confirmation is ON there is no session and onboarding bounces to login. Decide confirmation on/off; if on, add a "check your inbox" screen and set `emailRedirectTo`. If off, add abuse controls.
- [ ] No **password reset** — add `/forgot-password` + `/reset-password` routes.
- [ ] No **sign-up rate limiting**.
- [ ] OAuth error display — `signInWithGoogle` → `/login?error=oauth`, callback → `?error=auth_callback_failed`, but `LoginPage` never reads `searchParams` to show a message.
- [ ] `web/src/app/auth/callback/route.ts` doesn't handle Supabase's `error` / `error_description` query params.
- [ ] Supabase `error.message` strings are shown raw to users (English, sometimes leaky) across auth + onboarding — wrap/translate.
- [ ] **i18n gap:** `login` / `signup` pages are hardcoded **English**; `onboarding` is hardcoded **Bangla** (no `useLanguage`, no `t()`). Neither uses the dictionary, so `translations.test.ts` parity can't see them.

---

## 9. Dashboard & product integrity — P0 / B (before login opens)

- [ ] **Fabricated fallback data.** `web/src/app/dashboard/page.tsx` ships invented stats when a student has no data: `defaultSubjectList` (Physics 78 %, Chemistry 65 %, Math 84 %, English 90 %), fixed `todayTasks` with fake times, `momentumScore = 82`, `percentileRank = 12`, `progress = 70 + (idx % 3) * 8`. A brand-new user sees a full dashboard of fake numbers. Replace every fallback with a real empty state.
- [ ] Audit the same pattern in `AchievementsPageClient`, `MistakesPageClient`, `ExamsPageClient`, `study-plan` — each dashboard route needs a verified zero-state.
- [ ] `web/src/app/dashboard/study-plan/page.tsx:43` — "assume today is day 1"; the schedule never offsets from `start_date`, so the plan never advances. Fix the day-offset math.
- [ ] `percentileRank` / `momentumScore` are made-up heuristics (`100 - avgScorePct + 5`). Ground in real cohort data or don't show a percentile.
- [ ] `QuestionPaperViewerClient` / `ExamsPageClient` have hardcoded `'SSC MOCK EXAMINATION 2026'` / `'MOCK EXAM'` strings — check bilingual + correctness.

---

## 10. AI pipeline — P0/P1 / B

*(from `AI_CODE_REVIEW_FINDINGS.md`, still open)*

- [ ] **Grading accuracy is unmeasured** — `golden_set_*` tables have 0 rows; `npm run eval:golden-set` has never run with data. Populate ~30 real scripts with 3-examiner consensus; report MAE + Quadratic Weighted Kappa; set a pass bar. **The single most important gate.**
- [ ] **Curriculum coverage** — only Physics ch. 2–3 (bn+en) ingested of 8 books / 14 chapters. Ingest high-frequency chapters of all 4 core subjects.
- [ ] **Benchmark the OCR model** — Layer 1 runs on free-tier `llama-3.2-11b-vision-instruct` (`web/src/ai/genkit.ts`), never tested on Bangla handwriting. Likely move to a stronger paid VLM; Fireworks is registered but unused.
- [ ] **Provider clarity** — `genkit.ts` now registers **AgentRouter** as the first plugin (keys in `.env.local`), undocumented in README / `.env.example`, while `MODELS.*` still default to `nim/…`. Pin down the live production path and document its ToS/reliability.
- [ ] Paper-gen (`web/src/ai/flows/generate-question-paper.ts`) — **critical:** mark-sum & `chapter_id ∈ input` invariants are prompt-only → corrupt/partial papers; empty-RAG fallback authorises invention; no CQ stimulus+subparts schema (MCQ options stuffed in text); paper/rubric/question inserts have no transaction → orphan rows on failure; no rate limit.
- [ ] Tutor (`web/src/ai/flows/tutor-chat.ts`) — rubric context comes from the browser on session create (injection) → load server-side from `grading_results`; "rule 4" hardcodes NCTB *physics* terminology for every subject; safety enum overclaims (only ~6 self-harm regexes fire); English escalation copy missing.
- [ ] Safety pre-filter is regex-only ("a floor, not a ceiling"). For minors at scale, add a real moderation pass before opening broadly.
- [ ] `grounding_confidence` is emitted but low-confidence grades are **not routed to a human** — wire a review queue.
- [ ] Grading queue worker (`web/src/app/api/internal/process-grading-queue/route.ts`) — `maxDuration = 60`, `BATCH_SIZE = 5`, grades multi-question submissions sequentially. Load-test at expected concurrency; consider batch size 1–2 or per-question queue messages.
- [ ] Grading language hardcoded `"bn"` in `grade-submission.ts`; `model_version: "unpinned"`; `PIPELINE_VERSION` string stale (`bge-m3-pivot` vs NIM) — this is the audit trail.
- [ ] `retrieve-grounding` uses a static generic query string for paper-gen — weak retrieval.

---

## 11. Ops / observability / security — P0/P1 / B

- [ ] No error monitoring. `web/src/instrumentation.ts` logs a structured line only — wire `onRequestError` to Sentry / Axiom / Logflare.
- [ ] No health endpoint — add `/api/health` (checks Supabase) for uptime monitoring.
- [ ] Run Supabase `get_advisors` (security + performance lints); fix RLS gaps / missing indexes.
- [ ] Add security headers via `next.config.ts` `headers()` — HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `frame-ancestors`, a CSP. Only `poweredByHeader: false` is set now.
- [ ] Confirm `SUPABASE_SERVICE_ROLE_KEY` is server-scope only and `web/src/lib/supabase/service-role.ts` is never pulled into a client/edge bundle.
- [ ] Confirm the production Supabase project has PITR / backups enabled.
- [ ] `npm audit` + git-history secret scan (the migration-27 worker secret is already exposed — see §1).
- [ ] Signed-URL TTL check on the private `submission-pages` bucket (`supabase/migrations/00000000000009_storage.sql`).
- [ ] Consider real rate-limit infra (Upstash / Vercel firewall) — three routes hand-roll per-day Postgres counts; nothing guards bursts or the unauthenticated surface.

---

## 12. Testing / QA — P1 / B–C

- [ ] Only 17 vitest unit tests (validation, translations parity, score thresholds). No integration / e2e.
- [ ] Smoke-test the critical paths with Playwright: waitlist submit; signup → onboarding → dashboard; upload → grade → result. (`docs/Comprehensive Automated Browser Testing Plan (Suites 1–7) Plan.md` exists but isn't built.)
- [ ] Run `test:chat`, `test:grounding`, `eval:golden-set` in CI.
- [ ] Runtime a11y (axe) — only static `jsx-a11y` runs today.
- [ ] Low-bandwidth / rural Android device testing (the target user).

---

## 13. Release mechanics — P0 / A

- [ ] Current work is on branch `redesign-design-system` (~24 commits) — merge to `main`; confirm `main` → Vercel Production auto-deploy.
- [ ] All env vars present in Vercel (Production **and** Preview): Supabase URL / anon / service-role, NIM / AgentRouter / Fireworks keys, `INTERNAL_WORKER_SECRET`, `NEXT_PUBLIC_SITE_URL`, `GENKIT_*_MODEL`, mail-provider key.
- [ ] Tagged release + rollback plan.
- [ ] Preview-deployment protection (password) so staging isn't publicly indexable.
- [ ] Migrations 1–28 applied to prod; 29+ for the domain / email / waitlist changes above.

---

## Sources (Zoho SMTP research, 2026-09-01)

- [Zoho Mail — IMAP and SMTP Configuration details](https://www.zoho.com/mail/help/imap-access.html)
- [Zoho Mail — SMTP Configuration](https://www.zoho.com/mail/help/zoho-smtp.html)
- [Zoho Mail Review 2026 — Pricing / Free Plan (startupowl.com)](https://startupowl.com/reviews/zoho-mail)
- [Zoho Mail SMTP, IMAP & POP3 Settings 2026 (smtpedia.com)](https://smtpedia.com/zoho-email-settings-pop3-imap-and-smtp/)
- [Zoho Mail free-plan updates & insights (creatorscripts.com)](https://www.creatorscripts.com/blogs/post/zoho-mail-free-plan-updates-insights)
- [Sending mail from Zoho Mail Forever Free Plan using Python (Zoho community)](https://help.zoho.com/portal/en/community/topic/sending-mail-from-zoho-mail-forever-free-plan-using-python)
