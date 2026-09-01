---
name: next-cache-components-adoption
description: Step-by-step workflow to adopt Next.js Cache Components, audit prerender blockers, and migrate routes safely.
version: 1.0.0
---

# Next.js Cache Components Adoption Skill (`next-cache-components-adoption`)

This skill guides the incremental migration of routes to the Next.js 16 Cache Components model (`cacheComponents: true`).

## Prerequisites & Documentation
- Read `node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md`
- Ensure `cacheComponents: true` in `next.config.ts`.

## Adoption Steps

### 1. Audit Routes
Scan all routes in `src/app/` to identify data fetching patterns:
- Identify un-cached dynamic reads (`cookies()`, `headers()`, search parameters, direct database calls, `connection()`).
- In routes not yet converted, ensure `export const instant = false` is present during transition to defer blocking prerender checks.

### 2. Isolate Prerender Blockers
For each target route:
1. Wrap asynchronous data-fetching components inside React `<Suspense fallback={<Skeleton />}>` boundaries.
2. For reusable data fetching functions, mark them with `'use cache'` and define explicit cache retention (`cacheLife('minutes')` / `cacheTag(...)`).

### 3. Verify Route Prerender
1. Run `npm run build` or inspect with `compile_route` via MCP.
2. Ensure the route builds with static shell prerendering without warnings.
3. Remove temporary `export const instant = false` once the static shell is verified.
