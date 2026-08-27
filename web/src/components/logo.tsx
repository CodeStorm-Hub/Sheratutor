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
    <div
      className={cn(
        'brand',
        'inline-flex items-center gap-2 select-none',
        className
      )}
      style={{ padding: 0 }}
    >
      <div className="brand-mark">
        <span />
        <span />
        <span />
      </div>
      <span className="text-foreground" style={{ font: "700 22px 'Baloo 2', sans-serif", letterSpacing: '-0.3px', color: 'var(--foreground)' }}>
        Shera<span style={{ color: 'var(--color-red, #ff6b57)' }}>Tutor</span>
      </span>
      {tagline && (
        <span
          className="logo-tagline"
          style={{
            fontSize: 10,
            color: 'var(--muted)',
            fontFamily: 'Space Mono',
            marginLeft: 4,
          }}
        >
          HSC & SSC
        </span>
      )}
    </div>
  );
}
