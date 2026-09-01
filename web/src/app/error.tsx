'use client';

import { useEffect } from 'react';

export default function Error({
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
    <div className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-background px-6 text-center">
      <div>
        <p className="font-mono text-2xs font-bold tracking-[0.16em] text-destructive uppercase">
          Something went wrong
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold">We hit an unexpected error</h1>
        <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
          Try again — if it keeps happening, refresh the page or come back in a moment.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-2xs text-muted-foreground/70">ref: {error.digest}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => retry()}
        className="inline-flex items-center gap-2 rounded-lg bg-cta px-4 py-2.5 text-sm font-semibold text-cta-foreground transition-colors hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
