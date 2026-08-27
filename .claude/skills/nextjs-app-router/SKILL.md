---
name: nextjs-app-router
description: Use when building App Router routes, layouts, React Server Components (RSC), Server Actions, React 19 hooks, and full-stack Next.js features.
version: 1.0.0
---

# Next.js App Router & React 19 Architecture Skill

This skill provides architectural guidance and best practices for building scalable full-stack applications with the Next.js App Router and React 19.

## Architecture Guidelines

### 1. Server Component Default
* Keep all components as **React Server Components (RSC)** by default.
* Place `'use client'` only at interactive leaf boundaries.

### 2. React 19 Server Actions & Form Mutations
* Define Server Actions in dedicated files or inline within Server Components using `'use server'`.
* Use React 19 hooks: `useActionState`, `useOptimistic`.

### 3. Layouts, Suspense & Streaming
* Co-locate layouts (`layout.tsx`), loading states (`loading.tsx`), and error boundaries (`error.tsx`).
* Wrap dynamic asynchronous components in `<Suspense>`.
