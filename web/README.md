# SheraTutor — `web/`

AI-powered board examiner and learning workspace for Bangladeshi SSC & HSC
students. This directory is the Next.js frontend.

## Stack

| Area | Choice |
|---|---|
| Framework | Next.js 16 (App Router, RSC, Turbopack) · React 19 |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) · shadcn/ui on `radix-ui` |
| Design system | 3-layer OKLCH tokens in [`src/app/globals.css`](src/app/globals.css) — see [`DESIGN.md`](DESIGN.md). It is the single source of truth; regenerate the docs from it, never patch code back toward the docs. |
| Auth / data | Supabase (`@supabase/ssr`), PostgreSQL, `pgvector` for RAG |
| AI | Genkit multi-model pipeline, KaTeX math rendering |
| Theme | Academic Daylight (`#F8FAFC`) & Midnight Cosmic Obsidian (`#0E1322`) via `next-themes` (pre-paint script, no FOUC) |
| Typography | Teenage research stack: `Outfit` (EN Display), `Plus Jakarta Sans` (EN Body), `Baloo Da 2` (BN Display), `Hind Siliguri` (BN Body), `JetBrains Mono` (Formulas/Stats) |
| i18n | Bilingual bn/en — `sheratutor_lang` cookie drives server render, `LanguageContext` drives client |

## Getting started

```bash
cp .env.example .env.local   # fill in Supabase + AI provider keys
npm install
npm run dev                  # http://localhost:3000
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint — includes the design-token guard (no raw colour literals in `src/**/*.tsx`) |
| `npm run test:chat` | Smoke-test the tutor chat flow |
| `npm run test:grounding` | Smoke-test RAG grounding retrieval |
| `npm run eval:golden-set` | Run the grading eval suite |
| `node scripts/e2e-chemistry-ch4-12-complete.mjs` | Headless Chromium E2E test for Chemistry V2 Guidebooks (Ch 1–12) |

## Layout

```
src/
  app/                 App Router — one server page.tsx per route, data fetched
                       server-side and handed to a *Client component
    dashboard/
      playground/v2/   Canonical Guidebook routes (/math/[1-17], /physics/[1-12], /chemistry/[1-12])
    error.tsx          error boundaries (+ global-error, dashboard/error)
    not-found.tsx      custom 404
    kitchen-sink/      design-system reference (noindex)
  components/
    ui/                shadcn primitives (vendored — excluded from the lint guard)
    pages/             per-route client components
    playground/v2/     Canonical 3-column Guidebooks (17 Math, 12 Physics, 12 Chemistry)
  context/             Theme (shim over next-themes) + Language providers
  lib/supabase/        SSR / server / service-role clients + session refresh
  ai/                  Genkit flows, schemas, prompts
  data/translations.ts bn/en dictionary
src/proxy.ts           Next 16 middleware (renamed) — refreshes the Supabase session
```

## Notes

- `next.config.ts` documents why **Cache Components** is not yet enabled (every
  Supabase page reads `cookies()` / auth and would need `'use cache'` /
  Suspense boundaries first).
- `typescript` and `eslint` are pinned to `5.9.3` / `9.37.0` — the newest
  releases (`^7` / `^10`) aren't yet supported by `typescript-eslint` /
  `eslint-plugin-react`, which breaks `npm run lint`.
