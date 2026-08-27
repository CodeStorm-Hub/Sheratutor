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
* Place `'use client'` only at interactive leaf boundaries (event listeners, browser APIs, React state/effects).
* Never pass sensitive server utilities or secret keys to Client Components.

### 2. React 19 Server Actions & Form Mutations
* Define Server Actions in dedicated files or inline within Server Components using `'use server'`.
* Use React 19 hooks in Client Components:
  ```typescript
  'use client'
  import { useActionState, useOptimistic } from 'react'
  import { updateProfile } from '@/app/actions'

  export function ProfileForm({ initialData }) {
    const [state, formAction, isPending] = useActionState(updateProfile, null)
    const [optimisticName, setOptimisticName] = useOptimistic(
      initialData.name,
      (current, update: string) => update
    )
    // ...
  }
  ```

### 3. Layouts, Suspense & Streaming
* Co-locate layouts (`layout.tsx`), loading states (`loading.tsx`), and error boundaries (`error.tsx`).
* Wrap dynamic asynchronous data-fetching components in `<Suspense fallback={<Skeleton />}>` to enable granular streaming.

### 4. Styling & UI Components
* Use Tailwind CSS v4 and Radix UI / shadcn/ui components.
* Maintain accessible semantics, ARIA compliance, and dark mode support via `next-themes`.
