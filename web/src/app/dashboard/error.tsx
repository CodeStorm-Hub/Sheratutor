'use client';

import { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

export default function DashboardError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div>
        <p className="font-mono text-2xs font-bold tracking-[0.16em] text-destructive uppercase">
          This section failed to load
        </p>
        <h2 className="mt-2 font-heading text-xl font-bold">Couldn’t load this page</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          The rest of your workspace is fine — try reloading just this section.
        </p>
      </div>
      <button
        type="button"
        onClick={() => retry()}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold transition-colors hover:bg-accent"
      >
        <RotateCcw size={15} /> Retry
      </button>
    </div>
  );
}
