---
name: next-cache-components-optimizer
description: Optimization workflow to achieve instant navigation, push dynamic data reads beneath Suspense boundaries, and eliminate loading waterfalls.
version: 1.0.0
---

# Next.js Cache Components Optimizer Skill (`next-cache-components-optimizer`)

This skill refactors target routes to ensure immediate click-time UI rendering (Instant Navigation) under Next.js 16 Partial Prerendering (PPR).

## Goals
- Guarantee the App Shell and common UI (headers, navbars, cards, layout) render instantly without waiting for server network hops.
- Push dynamic personalized/live queries below `<Suspense>` boundaries.
- Ensure static prefetch payloads contain the full shell HTML.

## Workflow

### 1. Identify Target Navigation Path
Select the target transition (e.g. `/` $\rightarrow$ `/login` or `/dashboard` $\rightarrow$ `/tutor/[id]`).

### 2. Move Dynamic Reads Down the Component Tree
- Do NOT await slow queries at the root page level if they block the outer layout shell.
- Instead, pass promises or place the async component inside `<Suspense fallback={<CardSkeleton />}>`.
- Apply `'use cache'` with scoped `cacheTag` for frequently accessed, cacheable datasets.

### 3. Verify Instant Navigation
- Test that clicking the link renders the shell immediately while async slots stream in without layout shifts.
