import React from 'react';
import { cn } from '@/lib/utils';

/**
 * The SheraTutor brand mark: a graded answer script with an AI check.
 * Inlined so the wordmark can use the app font and the badge can react to
 * the current theme. Mirrors /public/logo-horizontal-{light,dark}.svg.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 140"
      role="img"
      aria-label="SheraTutor"
      className={cn('size-[30px] shrink-0', className)}
    >
      <circle
        cx="70"
        cy="70"
        r="58"
        className="fill-[#14182B] dark:fill-[#1E2761]"
      />
      <g transform="rotate(-6 70 70)">
        <rect x="46.562" y="40.938" width="46.875" height="58.125" rx="3.75" fill="#FFFFFF" />
        <rect x="46.562" y="40.938" width="46.875" height="8.625" rx="3.75" fill="#F2F4FA" />
        <line x1="52.938" y1="54.062" x2="87.062" y2="54.062" stroke="#D7DEEF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="52.938" y1="60.438" x2="87.062" y2="60.438" stroke="#D7DEEF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="52.938" y1="66.812" x2="78.25" y2="66.812" stroke="#D7DEEF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="52.938" y1="73.188" x2="87.062" y2="73.188" stroke="#D7DEEF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="52.938" y1="79.562" x2="82.0" y2="79.562" stroke="#D7DEEF" strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="M 54.812,86.312 L 55.694,89.224 L 58.735,89.162 L 56.239,90.901 L 57.237,93.775 L 54.812,91.938 L 52.388,93.775 L 53.386,90.901 L 50.89,89.162 L 53.931,89.224 Z"
          fill="#FFC93C"
        />
      </g>
      <path
        d="M 52.188,71.875 L 65.312,85.938 L 92.5,53.125"
        fill="none"
        stroke="#FF6B57"
        strokeWidth="6.375"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 98.125,37.75 L 99.186,40.814 L 102.25,41.875 L 99.186,42.936 L 98.125,46.0 L 97.064,42.936 L 94.0,41.875 L 97.064,40.814 Z"
        fill="#23D9A5"
      />
    </svg>
  );
}

export function Logo({
  className,
  tagline = false,
}: {
  className?: string;
  tagline?: boolean;
}) {
  return (
    <div className={cn('inline-flex items-center gap-2 select-none', className)}>
      <LogoMark />
      <span className="hidden font-heading text-[22px] leading-none font-bold tracking-tight text-foreground min-[360px]:inline">
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
