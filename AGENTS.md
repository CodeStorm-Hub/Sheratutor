# Project Context & Coding Rules

## Web Application (`web/`)
The web frontend is located in `/web` and built with:
- **Framework**: Next.js 16+ (App Router), React 19, Turbopack.
- **Styling & UI**: Tailwind CSS v4, shadcn/ui, Radix UI primitives, `lucide-react`.
- **MCP Server**: `next-devtools-mcp` is configured for live runtime diagnostics (`get_errors`, `get_routes`, `get_logs`, `compile_route`).
- **Docs**: In-repo version-accurate documentation is at `web/node_modules/next/dist/docs/`.
- **Caching**: Cache Components model (`'use cache'`, `cacheLife`, `cacheTag`).
- **AI & Data**: Supabase SSR (`@supabase/ssr`), Genkit AI (`@genkit-ai/next`).

## Available Skills
- `next-devtools`: Live devtools MCP diagnostics.
- `next-cache-components`: Next.js 16 caching patterns.
- `nextjs-app-router`: App Router and React 19 architecture.
- `impeccable`: Design system and UI polish.
