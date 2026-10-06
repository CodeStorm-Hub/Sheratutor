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

  // Security headers. Note: script-src is intentionally left out of the CSP —
  // a nonce-based CSP requires proxy.ts wiring (Next.js 16 renamed middleware
  // to proxy); the baseline below still blocks framing, plugins and base-tag
  // hijacking without breaking Next.js inline scripts.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value:
              "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/dashboard/playground/math/:id',
        destination: '/dashboard/playground/v2/math/:id',
        permanent: true,
      },
    ];
  },

  experimental: {
    // recharts was removed: zero imports in src (was dead weight in the bundle).
    optimizePackageImports: ['lucide-react', 'katex'],
  },
};

export default nextConfig;
