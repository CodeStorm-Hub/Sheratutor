---
name: next-dev-loop
description: Use after making edits in Next.js to inspect, compile, and verify pages against the running Next.js development server using MCP and terminal logs.
version: 1.0.0
---

# Next.js Development Loop Skill (`next-dev-loop`)

This skill provides a standardized inspect, edit, and runtime verification cycle for Next.js applications, combining framework diagnostics with runtime log verification.

## When to Use
- After making changes to any Next.js React component, page, layout, server action, or API route.
- When verifying that a page compiles cleanly without having to trigger a full production build.
- To detect hydration errors, uncached prerender warnings, or runtime errors early.

## The Loop Workflow

### Step 1: Inspect & Query Dev Server
1. Ensure the development server is running (`npm run dev` in `web/`).
2. Use `next-devtools` MCP tools:
   - Call `get_compilation_issues` or `get_errors` to check the current server state.
   - Call `get_routes` if discovering available route specifiers.

### Step 2: Compile Target Route
1. Trigger on-demand compilation for modified routes without waiting for manual browser requests:
   - Call `compile_route` with the target `routeSpecifier` (e.g. `/`, `/login`, `/dashboard`).
2. Verify no compilation or syntax errors are reported.

### Step 3: Check Runtime Diagnostics
1. Check live logs via `get_logs` or dev terminal output:
   - Look for `[browser]` log lines forwarded via `logging.browserToTerminal`.
   - Inspect any uncached prerender warnings or hydration mismatch warnings.
2. Resolve any reported issues immediately before proceeding to the next feature.
