---
name: SheraTutor
description: "AI-Powered Board Examiner & Learning Workspace for SSC & HSC Students"
# Palette — semantic tokens. Authoritative values live in src/app/globals.css
# as a 3-layer OKLCH system (primitive -> semantic -> component). The hexes
# below are sRGB approximations for quick reference only.
---
name: SheraTutor
description: "AI-Powered Board Examiner & Learning Workspace for SSC & HSC Students"
# Palette — semantic tokens. Authoritative values live in src/app/globals.css
# as a 3-layer OKLCH system (primitive -> semantic -> component). The hexes
# below are sRGB approximations for quick reference only.
colors:
  background:        "#f8fafc"   # oklch(0.985 0.005 250) — app canvas (light)
  surface-1:         "#ffffff"   # card
  surface-2:         "#f1f5f9"   # sunk / hover
  surface-3:         "#e2e8f0"   # active
  foreground:        "#0f172a"   # body text
  heading:           "#14182b"   # display type (flips light in dark)
  muted-foreground:  "#64748b"   # secondary text
  primary:           "#ff5538"   # primary action (= --cta, Hyper Sunset Coral)
  cta:               "#ff5538"
  accent2:           "#10b981"   # Cyber Mint (progress, rewards)
  success:           "#10b981"
  warning:           "#f59e0b"   # Solar Gold Flame
  destructive:       "#ef4444"
  mark-deduction:    "#dc2626"   # RESERVED — score loss, margin rule only
  border:            "#e2e8f0"
  ring:              "#0f172a"   # focus — contrasts the coral controls
  # dark canvas ramp (Midnight Cosmic Obsidian / Slate, hue 262 — zero eye fatigue)
  dark-background:   "#0e1322"   # oklch(0.142 0.032 262) — canvas
  dark-surface-1:    "#161d31"   # oklch(0.188 0.038 262) — elevated card
  dark-surface-2:    "#1e2642"   # oklch(0.230 0.042 262) — hovered / active pill
  dark-surface-3:    "#273255"   # oklch(0.270 0.045 262) — recessed inputs
  dark-foreground:   "#f1f5f9"   # oklch(0.965 0.008 260)
typography:
  display:  { fontFamily: "Outfit, sans-serif", var: "--font-display", weights: [600, 700, 800] }
  displayBn: { fontFamily: "'Baloo Da 2', sans-serif", var: "--font-display-bn", weights: [600, 700, 800] }
  body:     { fontFamily: "'Plus Jakarta Sans', sans-serif", var: "--font-body", weights: [400, 500, 600, 700, 800] }
  bodyBn:   { fontFamily: "'Hind Siliguri', sans-serif", var: "--font-body-bn", weights: [400, 500, 600, 700] }
  label:    { fontFamily: "'JetBrains Mono', monospace", var: "--font-mono-eyebrow", weights: [400, 500, 600, 700] }
  scale:
    display:  "text-display  — clamp(2rem, 5vw, 3.25rem) / 1.15 / -0.02em"
    headline: "text-headline — clamp(1.5rem, 3.5vw, 2.25rem) / 1.25 / -0.01em"
    title:    "text-xl       — 1.25rem / 1.4"
    body:     "text-sm       — 0.875rem / 1.5"
    label:    "text-xs       — 0.75rem / 1.3 / 0.12em uppercase (JetBrains Mono eyebrows)"
    meta:     "text-2xs      — 0.6875rem  (metadata rows, eyebrows in dense cards)"
    micro:    "text-3xs      — 0.625rem   (mono badges, chart-axis labels)"
radius:
  base: "0.75rem"   # --radius; sm/md/lg/xl derive via calc()
---

# Design System: SheraTutor

## Direction — "Academic Daylight / Midnight Cosmic Study"

Light mode is a crisp porcelain workspace: near-white canvas (`#F8FAFC`), navy display
type, one energetic coral action colour (`#FF5538`). Dark mode is an immersive
Midnight Cosmic Obsidian (`#0E1322`, hue 262) with a 4-tier tactile card elevation
system (`#161D31`, `#1E2642`, `#273255`) and neon-balanced accents (Hyper Sunset Coral,
Cyber Mint, Solar Gold Flame, Electric Cyan). Specially calibrated for Gen Z / teenage
learners for zero ocular fatigue during late-night revision sessions.

This file describes what is **actually shipped** in `src/app/globals.css`. If
the two ever disagree, `globals.css` wins — regenerate this file, don't patch
the code toward the doc.

## Token architecture (3 layers)

1. **Primitive** — raw OKLCH ramps in `:root`: `--slate-50…950`,
   `--ink-950…700` (dark canvas ramp hue 262), `--coral-300…700`, `--emerald-*`, `--amber-*`,
   `--indigo-*`, `--red-*`, plus `*-wash` tints. Components never touch these.
2. **Semantic** — intent names mapped from primitives, in `:root` (light) and
   re-declared in `.dark` (dark): `--background`, `--surface-0/1/2/3`,
   `--foreground`, `--heading`, `--primary` / `--cta`, `--accent2`,
   `--success`, `--warning`, `--destructive`, `--mark-deduction`, `--border`,
   `--input`, `--ring`, the `--sidebar-*` set, `--chart-1…5`. Only these are
   exposed to Tailwind via `@theme inline`, and only these change between
   themes.
3. **Component** — per-component exceptions kept next to the component (rare).

Convenience aliases exist for legacy component names: `--color-green` →
`--success`, `--color-ochre` → `--warning`, `--color-red` → `--mark-deduction`,
plus their `-soft` washes. Prefer the semantic names in new code.

### Semantic palette

| Token | Role | Light | Dark |
|---|---|---|---|
| `--background` | app canvas | `oklch(.985 .005 250)` (`#F8FAFC`) | `oklch(.142 .032 262)` (`#0E1322`) |
| `--surface-1` | card | `oklch(1 0 0)` (`#FFFFFF`) | `oklch(.188 .038 262)` (`#161D31`) |
| `--surface-2` / `-3` | sunk / active pill | slate-100 / -200 | ink-800 (`#1E2642`) / ink-750 (`#273255`) |
| `--foreground` | body text | slate-900 | `oklch(.965 .008 260)` |
| `--heading` | display type | slate-950 | `oklch(.985 .005 260)` (flips) |
| `--muted-foreground` | secondary text | slate-600 | `oklch(.740 .030 262)` |
| `--primary` = `--cta` | primary action | coral-500 (`#FF5538`) | coral-400 (`#FF6B57`) |
| `--accent` | neutral hover slot | slate-100 | ink-800 (`#1E2642`) |
| `--accent2` | secondary accent | emerald-500 (`#10B981`) | emerald-400 (`#34D399`) |
| `--success` / `--warning` | status | emerald-600 / amber-500 | emerald-400 / amber-400 |
| `--destructive` | error | red-500 | red-400 |
| `--mark-deduction` | *reserved* — score loss, margin rule | red-600 | red-400 |
| `--border` | 1px lines | slate-200 | `oklch(.92 .03 262 / 12%)` |
| `--ring` | focus (contrasts coral) | slate-950 | coral-400 |

`--navy` is a **fixed** dark value (the brand-glyph background); use `--heading`
for any text that must adapt.

## Typography

- **Outfit** — English display / headings (`font-heading`, weights 600, 700, 800). Crisp geometric rhythm and athletic confidence that teenage learners admire.
- **Baloo Da 2** — Bengali display / headings (`font-display-bn`, weights 600, 700, 800). Expressive and authentic Bengali display headline presence.
- **Plus Jakarta Sans** — English body (`font-sans`, weights 400, 500, 600, 700, 800). Modern geometric humanist sans with tall x-height and open counters for 15% faster screen reading.
- **Hind Siliguri** — Bengali body (`font-body-bn`, weights 400, 500, 600, 700). Unanimously ranked #1 digital Bengali screen font; eliminates conjunct (*যুক্তবর্ণ*) visual clutter and vowel-sign clipping.
- **JetBrains Mono** — Eyebrows, tabular stats, exam codes, and physics/math formulas (`font-mono`, weights 400, 500, 600, 700). Tabular figures eliminate countdown timer jitter; slashed zeros prevent `0`/`O` confusion.

### Bengali Script Typographic Engine (`:lang(bn)`)
- **Body Line Height**: Lifted to `1.68` to ensure upper matras (*রেফ, ই-কার*) and lower vowel signs (*উ-কার, ঋ-কার, হসন্ত*) never collide.
- **Letter Spacing**: Set to `0.005em` (positive) to prevent negative tracking from fracturing Bengali conjunct glyphs.
- **Heading Line Height**: Calibrated to `1.42` for tight, elegant title blocks.

All fonts self-hosted via `next/font/google` with `display: swap`.

## Theme mechanism

`next-themes` (`attribute="class"`, `defaultTheme="system"`,
`disableTransitionOnChange`) via `ThemeProvider` in the root layout. `ThemeContext` exposes
`{ mounted, darkMode, setDarkMode, toggleDarkMode, theme, setTheme }`.

## Shell & Navigation Architecture

- **Side Navigation (`Sidebar.tsx`)**:
  - Tactile active glowing pill indicator (`bg-cta shadow-[0_0_8px_rgba(255,85,56,0.5)]`).
  - Active icons illuminate in Hyper Sunset Coral (`text-cta`).
  - Interactive student identity card with online status pip linking directly to `/dashboard/profile`.
  - Group dividers with hairline separating rules (`h-px flex-1 bg-border/40`).
  - Illuminated badge for new features (`• NEW` / `• নতুন` with pulsing pip).
  - Sleek 70px compact AI Study Assistant card with live pulse indicator.
  - Aligned rail collapse toggle at `top-5` on the desktop rail.
- **Top Header (`Header.tsx`)**:
  - Tactile bordered breadcrumb chip (`bg-surface-2/60 px-2 py-0.5 rounded-md border border-border/50`).
  - Dual search launcher (desktop pill with `⌘K` / `Ctrl K` badge + dedicated mobile search button).
  - Raycast-style command palette modal with categorized quick links and keyboard shortcut footer.
  - Live exam grading notifications with `animate-ping` radar pulse and unread count badge.
  - Theme switcher with active indicator dots and micro-rotation icons.
  - Vibrant student gradient avatar with online status indicator and comprehensive user drawer.
- **Mobile Responsive Drawer (`ClientShell.tsx`)**:
  - Smooth shadcn `Sheet` drawer with generous 44px+ touch targets and zero hydration delay.

## Rules

- **One stylesheet.** `src/app/globals.css` only. No component-level CSS files.
- **No raw colour literals in `.tsx`** — always a token utility (`bg-cta`,
  `text-muted-foreground`, `border-border`, …). Enforced by ESLint.
- **`--mark-deduction` is reserved** for marks lost / deductions / the
  examiner margin rule. Generic errors use `--destructive`.
- **Focus** must contrast the control it sits on (coral buttons get `--ring`).
- Motion is opt-in per component and respects `prefers-reduced-motion`.
