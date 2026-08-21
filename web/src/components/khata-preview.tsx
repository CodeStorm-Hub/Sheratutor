/**
 * The landing hero's thesis image: a stylized marked khata (exam script)
 * page — ruled lines standing in for handwriting, a red margin column with
 * examiner ticks, and a final score. Built as inline SVG (no real script
 * photo exists yet) so it ships with zero extra requests and themes cleanly.
 */
export function KhataPreview({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 440"
      className={className}
      role="img"
      aria-label="একটি পরীক্ষার খাতা, লাল কালিতে নম্বর দেওয়া"
    >
      <rect x="4" y="4" width="352" height="432" rx="16" className="fill-card stroke-border" strokeWidth="1.5" />
      {/* ruled paper lines */}
      {Array.from({ length: 11 }, (_, i) => 56 + i * 32).map((y) => (
        <line key={y} x1="88" y1={y} x2="330" y2={y} className="stroke-border" strokeWidth="1" />
      ))}
      {/* margin rule */}
      <line x1="64" y1="24" x2="64" y2="416" className="stroke-red" strokeWidth="2.5" />

      {/* handwriting-stand-in strokes */}
      {[
        [96, 44, 210, 44],
        [96, 76, 260, 76],
        [96, 108, 180, 108],
        [96, 140, 240, 140],
        [96, 172, 300, 172],
        [96, 204, 150, 204],
      ].map(([x1, y1, x2]) => (
        <line key={y1} x1={x1} y1={y1} x2={x2} y2={y1} className="stroke-ink-soft/40" strokeWidth="4" strokeLinecap="round" />
      ))}

      {/* examiner marks in the margin */}
      <g transform="translate(38, 40)" className="stroke-green fill-none">
        <path d="M0 4 L4 9 L11 -1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(36, 96)" className="stroke-ochre fill-none">
        <path d="M0 9 L6 -2 L12 9 Z" strokeWidth="2.2" strokeLinejoin="round" />
      </g>
      <g transform="translate(37, 168)" className="stroke-red fill-none">
        <path d="M0 0 L11 11 M11 0 L0 11" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <g transform="translate(38, 200)" className="stroke-green fill-none">
        <path d="M0 4 L4 9 L11 -1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* score card */}
      <g transform="translate(88, 244)">
        <rect width="242" height="150" rx="12" className="fill-red-soft stroke-red/30" strokeWidth="1" />
        <text x="20" y="34" className="fill-red font-heading" style={{ fontFamily: "var(--font-mono-eyebrow)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em" }}>
          মোট নম্বর
        </text>
        <text x="20" y="86" className="fill-red-deep" style={{ fontFamily: "var(--font-display)", fontSize: "46px", fontWeight: 800 }}>
          ৮৭<tspan style={{ fontSize: "22px", fontWeight: 600 }}>/১০০</tspan>
        </text>
        <text x="20" y="126" className="fill-ink-soft" style={{ fontFamily: "var(--font-body-bn)", fontSize: "13px" }}>
          ৩য় প্রশ্নে ২টি ধাপ ছাড়া পড়েছে
        </text>
      </g>
    </svg>
  );
}
