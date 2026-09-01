<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Context & Coding Rules

## Web Application (`web/`)
Built with:
- **Framework**: Next.js 16+ (App Router), React 19, Turbopack.
- **Styling & UI**: Tailwind CSS v4, shadcn/ui, Radix UI primitives, `lucide-react`.
- **MCP Server**: `next-devtools` (`next-devtools-mcp`) is configured for live runtime diagnostics (`get_errors`, `get_routes`, `get_logs`, `compile_route`, `get_compilation_issues`).
- **Docs**: In-repo version-accurate documentation is at `node_modules/next/dist/docs/`.
- **Caching**: Cache Components model (`'use cache'`, `cacheLife`, `cacheTag`).
- **AI & Data**: Supabase SSR (`@supabase/ssr`), Genkit AI (`@genkit-ai/next`).

## Available Skills
- `next-dev-loop`: Inspect, edit, and verify against the running Next.js dev server.
- `next-devtools`: Live devtools MCP diagnostics.
- `next-cache-components`: Next.js 16 caching patterns.
- `next-cache-components-adoption`: Incremental adoption and migration to Cache Components.
- `next-cache-components-optimizer`: Optimization for instant navigation and PPR suspense boundaries.
- `next-partial-prefetching-adoption`: Partial Prefetching setup and App Shell shared link prefetching.
- `nextjs-app-router`: App Router and React 19 architecture.
- `impeccable`: Design system and UI polish.

