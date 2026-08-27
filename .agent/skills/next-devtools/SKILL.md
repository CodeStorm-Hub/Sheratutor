---
name: next-devtools
description: Use when debugging Next.js runtime errors, analyzing App Router routes, inspecting server actions, checking live application logs, or compiling routes on-demand via Next.js DevTools MCP.
version: 1.0.0
---

# Next.js DevTools MCP Skill

This skill equips agents to interact directly with the running Next.js 16+ development server through the `next-devtools-mcp` server.

## Overview

When the Next.js development server is running (`npm run dev` in `web/`), it exposes a native MCP endpoint at `/_next/mcp`. The `next-devtools-mcp` bridge connects coding agents directly to this endpoint.

## Available MCP Tools & Diagnostic Workflows

### 1. Error Detection & Diagnosis
* **Tool**: `get_errors`
* **Purpose**: Query live compilation errors, runtime exceptions, type errors, and hydration mismatches.
* **Workflow**:
  1. Call `get_errors` to retrieve active session errors.
  2. Parse the error stack trace and matching file/line references.
  3. Formulate targeted fixes for hydration mismatches (e.g., mismatched server/client rendering or non-deterministic values).

### 2. Live Route & Segment Inspection
* **Tool**: `get_routes`
* **Purpose**: Scan the project filesystem to return all active entry points and route structures grouped by App Router (`appRouter`) and Pages Router (`pagesRouter`).
* **Tool**: `get_page_metadata`
* **Purpose**: Inspect metadata, component trees, and rendering modes for specific page routes (e.g., `/dashboard`, `/learn`).

### 3. Server Actions Inspection
* **Tool**: `get_server_action_by_id`
* **Purpose**: Resolve an internal Server Action ID back to its source file and function name.

### 4. Compilation & Turbopack Diagnostics
* **Tool**: `get_compilation_issues`
* **Purpose**: Query project-wide bundler warnings and errors.
* **Tool**: `compile_route`
* **Purpose**: Trigger on-demand background compilation for a specific route specifier (e.g., `/learn/[chapterId]`) without opening a browser window.

### 5. Development Logs
* **Tool**: `get_logs`
* **Purpose**: Retrieve the path to the active log file containing live console logs, server outputs, and request traces.

## Documentation Reference
Always consult the version-accurate documentation bundled within the installed Next.js package at:
`web/node_modules/next/dist/docs/`
