'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

/**
 * A stylized marked exam script (khata) preview with ruled lines,
 * margin rule, teacher's tick marks, and examiner score card.
 */
export function KhataPreview({ className }: { className?: string }) {
  const { language } = useLanguage();

  const scoreTitle = language === 'bn' ? 'পরীক্ষকের মূল্যায়ন' : 'EXAMINER SCORE';
  const scoreValue = language === 'bn' ? '৮৭' : '87';
  const scoreTotal = language === 'bn' ? '/১০০ (A+)' : '/100 (A+)';
  const noteText =
    language === 'bn'
      ? '✓ ৩য় প্রশ্নে ২টি ধাপ ছাড়া পড়েছে (+৭ মার্কস পুনরুদ্ধার সম্ভব)'
      : '✓ 2 steps missed in Q3 (+7 marks recoverable)';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        padding: '0 4px',
      }}
    >
      <svg
        viewBox="0 0 360 440"
        className={className}
        style={{
          width: '100%',
          maxWidth: 360,
          height: 'auto',
          filter: 'drop-shadow(0 14px 30px rgba(20, 24, 43, 0.08))',
          boxSizing: 'border-box',
        }}
        role="img"
        aria-label="An evaluated exam script preview"
      >
        {/* Main Paper Background */}
        <rect
          x="4"
          y="4"
          width="352"
          height="432"
          rx="18"
          fill="#fffdfa"
          stroke="#e9ebf3"
          strokeWidth="1.5"
        />

        {/* Top Header Margin Line */}
        <line
          x1="20"
          y1="56"
          x2="340"
          y2="56"
          stroke="#e9ebf3"
          strokeWidth="1.2"
        />

        {/* Left Vertical Red Margin Line */}
        <line
          x1="76"
          y1="20"
          x2="76"
          y2="420"
          stroke="var(--coral)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Ruled Notebook Writing Lines */}
        <line x1="96" y1="92" x2="330" y2="92" stroke="#f0f2f8" strokeWidth="1.5" />
        <line x1="96" y1="126" x2="330" y2="126" stroke="#f0f2f8" strokeWidth="1.5" />
        <line x1="96" y1="160" x2="330" y2="160" stroke="#f0f2f8" strokeWidth="1.5" />
        <line x1="96" y1="194" x2="330" y2="194" stroke="#f0f2f8" strokeWidth="1.5" />
        <line x1="96" y1="228" x2="330" y2="228" stroke="#f0f2f8" strokeWidth="1.5" />
        <line x1="96" y1="262" x2="330" y2="262" stroke="#f0f2f8" strokeWidth="1.5" />
        <line x1="96" y1="296" x2="330" y2="296" stroke="#f0f2f8" strokeWidth="1.5" />
        <line x1="96" y1="330" x2="330" y2="330" stroke="#f0f2f8" strokeWidth="1.5" />

        {/* Simulated Student Handwriting Blocks */}
        <rect x="96" y="86" width="84" height="4.5" rx="2.2" fill="#adb5bd" />
        <rect x="96" y="120" width="118" height="4.5" rx="2.2" fill="#adb5bd" />
        <rect x="96" y="154" width="68" height="4.5" rx="2.2" fill="#adb5bd" />
        <rect x="96" y="188" width="104" height="4.5" rx="2.2" fill="#adb5bd" />
        <rect x="96" y="222" width="144" height="4.5" rx="2.2" fill="#adb5bd" />
        <rect x="96" y="256" width="54" height="4.5" rx="2.2" fill="#adb5bd" />

        {/* Left Margin Teacher Annotation Marks */}
        {/* Step 1 Checkmark */}
        <path
          d="M38 90 L46 98 L60 82"
          fill="none"
          stroke="var(--mint)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Step 2 Triangle/Warning */}
        <path
          d="M48 150 L57 166 L39 166 Z"
          fill="none"
          stroke="var(--sun)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Step 3 Error Cross */}
        <g stroke="var(--coral)" strokeWidth="3" strokeLinecap="round">
          <line x1="40" y1="220" x2="56" y2="236" />
          <line x1="56" y1="220" x2="40" y2="236" />
        </g>

        {/* Step 4 Checkmark */}
        <g transform="translate(0, 142)">
          <path
            d="M38 90 L46 98 L60 82"
            fill="none"
            stroke="var(--mint)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Floating Score Card */}
        <g transform="translate(80, 240)">
          <rect
            width="254"
            height="156"
            rx="14"
            fill="#fdeaec"
            stroke="#f5c2c7"
            strokeWidth="1.2"
          />
          <text
            x="18"
            y="32"
            fill="#d92638"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.08em',
            }}
          >
            {scoreTitle}
          </text>
          <text
            x="18"
            y="86"
            fill="#14251f"
            style={{
              fontFamily: "'Baloo 2', sans-serif",
              fontSize: '36px',
              fontWeight: 800,
            }}
          >
            {scoreValue}
            <tspan
              fill="#52655d"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '20px',
                fontWeight: 600,
              }}
            >
              {' '}{scoreTotal}
            </tspan>
          </text>
          <rect x="18" y="104" width="218" height="4" rx="2" fill="#f5c2c7" />
          <rect x="18" y="104" width="185" height="4" rx="2" fill="var(--mint)" />
          <text
            x="18"
            y="130"
            fill="#52655d"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '12px',
              fontWeight: 500,
            }}
          >
            {noteText}
          </text>
        </g>
      </svg>
    </div>
  );
}
