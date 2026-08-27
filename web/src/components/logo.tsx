'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export function SheraTutorIcon({
  size = 34,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ flexShrink: 0, display: 'inline-block' }}
    >
      {/* Outer Navy Circle */}
      <circle cx="50" cy="50" r="48" fill="#1C244B" />

      {/* Tilted Paper Document */}
      <g transform="rotate(7 50 52)">
        <rect x="25" y="21" width="46" height="58" rx="6" fill="#FFFFFF" />
        {/* Ruling lines */}
        <line x1="32" y1="34" x2="64" y2="34" stroke="#D3E0EE" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="32" y1="42" x2="64" y2="42" stroke="#D3E0EE" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="32" y1="50" x2="64" y2="50" stroke="#D3E0EE" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="32" y1="58" x2="56" y2="58" stroke="#D3E0EE" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="32" y1="66" x2="50" y2="66" stroke="#D3E0EE" strokeWidth="2.5" strokeLinecap="round" />

        {/* Bottom Left Gold Star on Paper */}
        <path
          d="M 36 67 C 36 69 37 70 39 70 C 37 70 36 71 36 73 C 36 71 35 70 33 70 C 35 70 36 69 36 67 Z"
          fill="#F59E0B"
        />
      </g>

      {/* Bold Coral Checkmark */}
      <path
        d="M 33 53 L 46 66 L 73 34"
        fill="none"
        stroke="#FF6551"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Top Right Teal Sparkle */}
      <path
        d="M 77 22 C 77 25 78 26 81 26 C 78 26 77 27 77 30 C 77 27 76 26 73 26 C 76 26 77 25 77 22 Z"
        fill="#20B2AA"
      />
    </svg>
  );
}

export function Logo({
  className,
  tagline = false,
  size = 34,
}: {
  className?: string;
  tagline?: boolean;
  size?: number;
}) {
  let taglineText = 'HSC, SSC & University Admission Exam';
  try {
    const { t } = useLanguage();
    taglineText = t('brand.tagline') || taglineText;
  } catch {
    // Fallback if rendered outside LanguageContext
  }

  return (
    <div
      className={cn(
        'brand',
        'inline-flex items-center gap-2.5 select-none',
        className
      )}
      style={{ padding: 0 }}
    >
      <SheraTutorIcon size={size} />
      <span className="logo-brand-text">
        <span className="logo-shera-text">Shera</span>
        <span className="logo-tutor-text">Tutor</span>
      </span>
      {tagline && (
        <span className="logo-tagline">
          {taglineText}
        </span>
      )}
    </div>
  );
}

