---
name: next-partial-prefetching-adoption
description: Workflow to adopt Partial Prefetching where Next.js links share an App Shell and prefetch dynamic slots efficiently.
version: 1.0.0
---

# Next.js Partial Prefetching Adoption Skill (`next-partial-prefetching-adoption`)

This skill configures and optimizes Partial Prefetching for `<Link>` components across the application.

## Prerequisites
- Requires `cacheComponents: true` enabled in `next.config.ts`.
- Reference guide: `node_modules/next/dist/docs/01-app/02-guides/adopting-partial-prefetching.md`

## Workflow

### 1. Audit Existing Link Prefetching
- Check all `<Link>` components in navbars, sidebars, and list items.
- Remove redundant manual `prefetch={true}` attributes that bypass standard PPR heuristics.

### 2. Configure Shared App Shell
- Ensure parent layouts (e.g. `layout.tsx`) are fully static / cached so prefetch payloads only need to fetch the shell once.

### 3. Verify Prefetch Headers and Payloads
- Verify in network inspection that prefetch requests receive `x-nextjs-prerender` or lightweight RSC payloads.
