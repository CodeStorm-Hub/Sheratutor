import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // `typedRoutes: true` is the target but currently surfaces type errors on
  // the app's many `href={string}` call sites — enable once those are typed.

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Supabase Storage (exam-script uploads, avatars).
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/**' },
    ],
  },

  // NOTE: Cache Components (`cacheComponents: true` + `'use cache'`) is the
  // intended target per AGENTS.md, but every Supabase-backed page reads
  // `cookies()`/auth and would need explicit `'use cache'` / Suspense
  // boundaries first. Tracked as a follow-up, not enabled here.
};

export default nextConfig;
