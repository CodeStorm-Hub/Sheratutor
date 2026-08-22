import React from 'react';

/**
 * A stylized marked exam script (khata) preview with ruled lines,
 * margin rule, teacher's tick marks, and examiner score card.
 */
export function KhataPreview({ className }: { className?: string }) {
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
        aria-label="একটি পরীক্ষার খাতা, লাল কালিতে নম্বর দেওয়া"
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

        {/* Paper Ruled Lines */}
        {Array.from({ length: 11 }, (_, i) => 56 + i * 32).map((y) => (
          <line
            key={y}
            x1="88"
            y1={y}
            x2="330"
            y2={y}
            stroke="#eff1f6"
            strokeWidth="1"
          />
        ))}

        {/* Red Margin Rule */}
        <line
          x1="64"
          y1="24"
          x2="64"
          y2="416"
          stroke="#ff6b57"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Handwriting Simulation Strokes */}
        {[
          [96, 44, 210, 44],
          [96, 76, 260, 76],
          [96, 108, 180, 108],
          [96, 140, 240, 140],
          [96, 172, 300, 172],
          [96, 204, 150, 204],
        ].map(([x1, y1, x2], idx) => (
          <line
            key={idx}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y1}
            stroke="#687994"
            strokeOpacity="0.45"
            strokeWidth="4"
            strokeLinecap="round"
          />
        ))}

        {/* Examiner Checkmarks in the Margin */}
        <g transform="translate(38, 40)" stroke="#23d9a5" fill="none">
          <path
            d="M0 4 L4 9 L11 -1"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <g transform="translate(36, 96)" stroke="#ffc93c" fill="none">
          <path
            d="M0 9 L6 -2 L12 9 Z"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        </g>
        <g transform="translate(37, 168)" stroke="#ff6b57" fill="none">
          <path
            d="M0 0 L11 11 M11 0 L0 11"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
        <g transform="translate(38, 200)" stroke="#23d9a5" fill="none">
          <path
            d="M0 4 L4 9 L11 -1"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Floating Score Card */}
        <g transform="translate(88, 244)">
          <rect
            width="242"
            height="152"
            rx="14"
            fill="#fff3f0"
            stroke="#ffd6cf"
            strokeWidth="1.2"
          />
          <text
            x="20"
            y="34"
            fill="#d85241"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
            }}
          >
            EXAMINER SCORE
          </text>
          <text
            x="20"
            y="88"
            fill="#14182b"
            style={{
              fontFamily: "'Baloo 2', sans-serif",
              fontSize: '48px',
              fontWeight: 800,
            }}
          >
            ৮৭
            <tspan
              fill="#69718c"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '20px',
                fontWeight: 600,
              }}
            >
              /১০০ (A+)
            </tspan>
          </text>
          <rect x="20" y="106" width="202" height="4" rx="2" fill="#ffd6cf" />
          <rect x="20" y="106" width="175" height="4" rx="2" fill="#23d9a5" />
          <text
            x="20"
            y="132"
            fill="#69718c"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '11px',
              fontWeight: 500,
            }}
          >
            ✓ ৩য় প্রশ্নে ২টি ধাপ ছাড়া পড়েছে (+৭ মার্কস পুনরুদ্ধার সম্ভব)
          </text>
        </g>
      </svg>
    </div>
  );
}
