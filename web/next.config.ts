import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Statically-typed <Link href> / router calls (stable in Next 16).
  typedRoutes: true,
  // Don't advertise the framework.
  poweredByHeader: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Supabase Storage (exam-script uploads, avatars).
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/**' },
    ],
  },

  // Cache Components: PPR + `use cache` unified. Data is dynamic by default;
  // routes opt into caching. Enabled with per-route validation deferred via
  // `export const instant = false` on each segment (the documented incremental
  // path) — convert routes to `use cache` / <Suspense> one at a time.
  // Guide: node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md
  cacheComponents: true,
  partialPrefetching: true,

  // Runtime visibility for AI coding agents (Step 2 of Next.js AI Agents guide)
  logging: {
    fetches: {
      fullUrl: true,
    },
    browserToTerminal: true,
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'katex'],
  },
};

export default nextConfig;
