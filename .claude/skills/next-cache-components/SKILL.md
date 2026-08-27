---
name: next-cache-components
description: Use when configuring or writing Next.js 16+ caching, including 'use cache', cacheLife, cacheTag, revalidateTag, Partial Prerendering (PPR), and Cache Components.
version: 1.0.0
---

# Next.js Cache Components & Modern Caching Skill

This skill guides development using Next.js 16's unified caching model: **Cache Components**.

## Core Concepts

### 1. Enabling Cache Components
Ensure `cacheComponents: true` is configured in `next.config.ts`:

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}
export default nextConfig
```

### 2. The `'use cache'` Directive
* **Function-level data caching**: Place `'use cache'` at the top of an `async` function.
* **Component-level UI caching**: Place `'use cache'` at the top of a React Server Component.

### 3. Cache Lifetimes (`cacheLife`)
Standard profiles: `seconds`, `minutes`, `hours`, `days`, `max`.

### 4. Cache Invalidation (`cacheTag` & `revalidateTag`)
* Associate tags inside cached functions: `cacheTag('user-profile')`
* Invalidate within Server Actions or route handlers: `revalidateTag('user-profile')`

### 5. Partial Prerendering (PPR)
* Static shell is generated from cached components at build/revalidation time.
* Dynamic holes wrap non-cached components in React `<Suspense>` boundaries.
