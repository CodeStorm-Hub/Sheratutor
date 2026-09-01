All outstanding items worked through. Branch `redesign-design-system` — **24 commits, net ~−4,000 lines**. `next build` green (26/26), `eslint` 0 errors, `vitest` 17/17.

## Status of each outstanding item

| Item | Outcome |
|---|---|
| **ESLint blocked** | **Resolved & verified against the Next 16 docs.** The `next-lint-to-eslint-cli` codemod confirms the flat config is already correct; `eslint@9` / `typescript@5.9` are the right pins (eslint 10 moves React linting to `@eslint-react`, which `eslint-config-next` doesn't support yet). Added **`eslint-plugin-jsx-a11y`** — static a11y now runs in `npm run lint`, and it caught a real bug (tutor mobile scrim was a `<div onClick>` with no keyboard path → `<button>`). Warnings 162 → **18** (all `any` in the Genkit AI flows). |
| **Landing `'use client'`** | **Done** — server component, cookie-driven i18n, SSR-verified. |
| **Cache Components** | **Enabled**, via the documented incremental path: `cacheComponents: true`, fixed the one hard blocker (`new Date().getFullYear()` in the footer → client island), ran `@next/codemod cache-components-instant-false` (17 segments opted out). Build green, "Cache Components enabled", 2 dynamic-param routes now Partial-Prerender. Verified in a prod build incl. back-navigation (Activity state preservation). Per-route `use cache` conversion is the follow-up. |
| **Micro font-sizes** | **Done** — `text-2xs` / `text-3xs` tokens, 36 literals swept. |
| **axe in CI** | **Partial** — jsx-a11y gives static coverage now; runtime axe still needs your CI pipeline. |
| **`getUser()` ×18** | **Left as-is** — it's Supabase's own recommended SSR pattern; a `getClaims()` migration is a Supabase-architecture call, too risky to bulk-apply blind. |
| **Server Actions / zod** | **Done** — `auth.ts` got a credentials schema (the other 5 already validated). **Deduped** the board/examType/group/year/phone schemas that were copy-pasted across 4 actions into `src/lib/validation.ts`. |
| **instrumentation.ts** | **Done** — `register()` + `onRequestError` (structured error line, correlates with the `ref:<digest>` in the error boundaries). |
| **Tests** | **Done** — `vitest` + `npm test`. 17 tests: validation schemas (email/phone/year/board accept-reject), bn/en translation key parity, `levelFromScore` thresholds. |
| **Bundle** | **Partial** — route-split `katex.min.css` (~25 KB) out of the root layout into the 3 math components; the other ~24 routes no longer download it. No full analyzer report (Turbopack support is limited). |
| **App Router hygiene** | **Done** — added `error.tsx` / `global-error.tsx` / `dashboard/error.tsx` / `not-found.tsx` (Next 16 `retry` API); removed dead files (`src/tsconfig.json`, `theme-toggle.tsx`, `mockData.ts`, `submission-status.ts`, stray `src/next-env.d.ts` + `src/.next/`); `ES2017→ES2022`, `poweredByHeader:false`, real README, `NEXT_PUBLIC_SITE_URL` in `.env.example`. |
| **Verification sweep** | **Done** — board-simulator, practice/generate, practice/[id], upload, onboarding, signup all render clean, both themes, prod build. The error boundary proved itself (caught a stale-build `ChunkLoadError` mid-testing — not a code bug). |

## Genuinely still open (small)

- **18 eslint warnings** — `any` in `src/ai/flows/*`; needs the Genkit flow schema types.
- **`/kitchen-sink`** — `notFound()`s in prod, but PPR streams a 200 status (content is hidden; it's noindex, so cosmetic).
- **`.impeccable/design.json`** sidecar is stale vs the rewritten `DESIGN.md` — run `/impeccable document` (design-tool artifact).
- Pre-existing content nit: `ms^{-2}` LaTeX isn't KaTeX-rendered in the question-paper *stimulus* text (only the sub-questions are).
- `getClaims()` auth-perf pass and a deep API-route-handler review remain as their own focused tasks.

**Suppressed** — the `side-tab` finding on [kitchen-sink/page.tsx:141](web/src/app/kitchen-sink/page.tsx#L141) is a sanctioned exception, ignore now scoped to that file in `.impeccable/config.json`.

Rationale: `/kitchen-sink` is the design-system reference page, and that card is an explicitly labeled demo of the `border-l-mark` token — the "examiner margin-rule" (a red pen mark down the margin), a deliberate SheraTutor domain metaphor also used on the landing promise cards and documented in `DESIGN.md`. The card's own body text is literally "Examiner margin-rule card (`border-l-mark`)". It exists to show the token, so the detector's generic "accent rail on a card" tell is a false positive here.

Nothing fixed, nothing else left standing — this was the only finding.


Here are the specific color tokens and typography details used in the mock UI project:

### Color Tokens

These are defined as CSS custom properties in `src/styles.css` and overridden for dark mode in `src/layout-fixes.css`.

**Base Theme (Light Mode)**
```css
:root {
  --navy: #14182b;    /* Primary text, dark backgrounds */
  --muted: #69718c;   /* Secondary text, subtle elements */
  --paper: #f4f5fb;   /* Light surface backgrounds */
  --coral: #ff6b57;   /* Primary actions, warnings, negative indicators */
  --mint: #23d9a5;    /* Success, progress, positive indicators */
  --sun: #ffc93c;     /* Highlights, neutral tags */
  --border: #e9ebf3;  /* Dividers, card outlines */
}
```

**Dark Mode Overrides (`.app.dark`)**
```css
.app.dark {
  --navy: #f4f7ff;    /* Becomes light text/surfaces */
  --muted: #aab3c8;   /* Lighter secondary text */
  --border: #2b3245;  /* Darker borders */
  
  /* Note: The accent colors (coral, mint, sun) remain the same 
     to maintain brand familiarity in dark mode */
}
```

---

### Typography

The project imports three font families from Google Fonts:

**1. Inter** 
* **Weights:** 400, 500, 600, 700
* **Usage:** Base body text, inputs, standard buttons, filters, and standard UI copy.
* **Example:** `font: 14px Inter, Arial, sans-serif;`

**2. Baloo 2** 
* **Weights:** 600, 700, 800
* **Usage:** Brand logo, page titles, section headings, large scores/grades, and prominent feature text. This gives the app a slightly playful/approachable feel.
* **Example:** `font: 700 22px 'Baloo 2';`

**3. Space Mono** 
* **Weights:** 400, 700
* **Usage:** Eyebrow text, tags, data numbers, percentiles, timestamps, and small uppercase labels. It is used to present structural or "technical" data clearly.
* **Example:** `font: 700 10px 'Space Mono';`