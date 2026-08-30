import React from 'react';
import { cn } from '@/lib/utils';

export function Logo({
  className,
  tagline = false,
}: {
  className?: string;
  tagline?: boolean;
}) {
  return (
    <div className={cn('inline-flex items-center gap-2 select-none', className)}>
      <span
        aria-hidden
        className="flex size-[30px] shrink-0 -rotate-3 items-end gap-[2px] rounded-lg bg-navy p-1.5"
      >
        <span className="h-[9px] w-[5px] rounded-sm bg-surface-1" />
        <span className="h-[15px] w-[5px] rounded-sm bg-sun" />
        <span className="h-[19px] w-[5px] rounded-sm bg-coral" />
      </span>
      <span className="font-heading text-[22px] leading-none font-bold tracking-tight text-foreground">
        Shera<span className="text-coral">Tutor</span>
      </span>
      {tagline && (
        <span className="ml-1 hidden font-mono text-3xs text-muted-foreground sm:inline">
          HSC &amp; SSC
        </span>
      )}
    </div>
  );
}
