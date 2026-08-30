import Link from 'next/link';
import { Logo } from '@/components/logo';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <Logo />
      <div>
        <p className="font-mono text-2xs font-bold tracking-[0.16em] text-muted-foreground uppercase">
          404
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold">Page not found</h1>
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          The page you’re looking for doesn’t exist or has moved.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 rounded-lg bg-cta px-4 py-2.5 text-sm font-semibold text-cta-foreground transition-colors hover:opacity-90"
      >
        Back to workspace
      </Link>
    </div>
  );
}
