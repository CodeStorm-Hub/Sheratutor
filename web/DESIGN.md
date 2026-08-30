---
name: SheraTutor
description: "AI-Powered Board Examiner & Learning Workspace for SSC & HSC Students"
# Palette — semantic tokens. Authoritative values live in src/app/globals.css
# as a 3-layer OKLCH system (primitive -> semantic -> component). The hexes
# below are sRGB approximations for quick reference only.
colors:
  background:        "#f8f9fc"   # oklch(.984 .003 265)  — app canvas (light)
  surface-1:         "#ffffff"   # card
  surface-2:         "#f1f5f9"   # sunk / hover
  surface-3:         "#e2e8f0"   # active
  foreground:        "#0f172a"   # body text
  heading:           "#14182b"   # display type (flips light in dark)
  muted-foreground:  "#64748b"   # secondary text
  primary:           "#ff6b57"   # primary action (= --cta, coral)
  cta:               "#ff6b57"
  accent2:           "#10b981"   # secondary accent (emerald)
  success:           "#10b981"
  warning:           "#f59e0b"
  destructive:       "#ef4444"
  mark-deduction:    "#dc2626"   # RESERVED — score loss, margin rule only
  border:            "#e2e8f0"
  ring:              "#0f172a"   # focus — contrasts the coral controls
  # dark canvas ramp (neutralised — low chroma, "calm" not "cosmic blue")
  dark-background:   "#0d0f16"   # oklch(.165 .012 255)
  dark-surface-1:    "#141822"
  dark-surface-2:    "#1f2430"
  dark-foreground:   "#f1f5f9"
typography:
  display:  { fontFamily: "'Baloo 2', sans-serif", var: "--font-display", weights: [600, 700] }
  displayBn:{ fontFamily: "'Baloo Da 2', sans-serif", var: "--font-display-bn", weights: [600, 700] }
  body:     { fontFamily: "Inter, -apple-system, sans-serif", var: "--font-body", weights: [400, 500, 600] }
  bodyBn:   { fontFamily: "'Noto Sans Bengali', sans-serif", var: "--font-body-bn", weights: [400, 600, 700] }
  label:    { fontFamily: "'Space Mono', monospace", var: "--font-mono-eyebrow", weights: [400, 700] }
  scale:
    display:  "text-display  — clamp(2rem, 5vw, 3.25rem) / 1.15 / -0.02em"
    headline: "text-headline — clamp(1.5rem, 3.5vw, 2.25rem) / 1.25 / -0.01em"
    title:    "text-xl       — 1.25rem / 1.4"
    body:     "text-sm       — 0.875rem / 1.5"
    label:    "text-xs       — 0.75rem / 1.3 / 0.12em uppercase (Space Mono eyebrows)"
    meta:     "text-2xs      — 0.6875rem  (metadata rows, eyebrows in dense cards)"
    micro:    "text-3xs      — 0.625rem   (mono badges, chart-axis labels)"
radius:
  base: "0.75rem"   # --radius; sm/md/lg/xl derive via calc()
---

# Design System: SheraTutor

## Direction — "Academic Daylight / Cosmic Study"

Light mode is a crisp porcelain workspace: near-white canvas, navy display
type, one energetic coral action colour. Dark mode is a calm, low-chroma deep
slate — *neutralised* rather than "cosmic blue", so long study sessions don't
strain. The visual language is quiet and scannable; brand energy is spent in a
single place (the coral CTA) and everything around it stays neutral.

This file describes what is **actually shipped** in `src/app/globals.css`. If
the two ever disagree, `globals.css` wins — regenerate this file, don't patch
the code toward the doc. (A previous "Board Examiner's Khata & Blackboard"
concept was retired; the one idea kept from it is the reserved
`--mark-deduction` colour.)

## Token architecture (3 layers)

1. **Primitive** — raw OKLCH ramps in `:root`: `--slate-50…950`,
   `--ink-900…700` (dark canvas), `--coral-300…700`, `--emerald-*`, `--amber-*`,
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
| `--background` | app canvas | `oklch(.984 .003 265)` | `oklch(.165 .012 255)` |
| `--surface-1` | card | `oklch(1 0 0)` | `oklch(.213 .014 255)` |
| `--surface-2` / `-3` | sunk / active | slate-100 / -200 | ink-750 / -700 |
| `--foreground` | body text | slate-900 | slate-100 |
| `--heading` | display type | slate-950 | **slate-50** (flips) |
| `--muted-foreground` | secondary text | slate-600 | slate-400 |
| `--primary` = `--cta` | primary action | coral-500 | coral-400 |
| `--accent` | neutral hover slot | slate-100 | ink-750 |
| `--accent2` | secondary accent | emerald-500 | emerald-400 |
| `--success` / `--warning` | status | emerald-600 / amber-500 | emerald-400 / amber-400 |
| `--destructive` | error | red-500 | red-400 |
| `--mark-deduction` | *reserved* — score loss, margin rule | red-600 | red-400 |
| `--border` | 1px lines | slate-200 | `oklch(1 0 0 / 8%)` |
| `--ring` | focus (contrasts coral) | slate-950 | slate-300 |

`--navy` is a **fixed** dark value (the brand-glyph background); use `--heading`
for any text that must adapt.

## Typography

- **Baloo 2** — display / headings (`font-heading`). Latin only.
- **Baloo Da 2** — Bengali display, wired via `--font-display-bn` and the
  `:lang(bn)` block (which also lifts line-height to 1.65 for body, 1.4 for
  headings).
- **Inter** — body (`font-sans`).
- **Noto Sans Bengali** — Bengali body.
- **Space Mono** — eyebrows, tabular stats, exam codes (`font-mono`).

All self-hosted via `next/font/google` with `display: swap`; weights trimmed to
2–3 per family. `text-display` / `text-headline` utilities encode the scale;
`font-tabular` applies `tabular-nums` for score columns.

## Theme mechanism

`next-themes` (`attribute="class"`, `defaultTheme="system"`,
`disableTransitionOnChange`) via `ThemeProvider` in the root layout — it injects
a pre-paint script, so there is no FOUC. `ThemeContext` is a thin shim exposing
`{ mounted, darkMode, setDarkMode, toggleDarkMode, theme, setTheme }`; anything
that renders theme-dependent markup must gate on `mounted`. The header carries a
light / dark / system `DropdownMenu`.

## Shell & layout

- App shell (`ClientShell` + `Sidebar` + `Header`) is built on shadcn
  primitives: `Sheet` (mobile drawer), `DropdownMenu` (notifications, profile,
  theme), `Dialog` (⌘K search). Fixed `w-64` rail at `lg`, drawer below.
- Content column: `max-w-[1400px]`, gutters `px-4 sm:px-6 lg:px-10`.
- 8px spacing grid; `--radius` `0.75rem` base. Cards `rounded-2xl border
  border-border bg-surface-1 p-5`. Active nav = coral left-rule + surface tint.

## Rules

- **One stylesheet.** `src/app/globals.css` only. No component-level CSS files.
- **No raw colour literals in `.tsx`** — always a token utility (`bg-cta`,
  `text-muted-foreground`, `border-border`, …). Enforced by ESLint.
- **`--mark-deduction` is reserved** for marks lost / deductions / the
  examiner margin rule. Generic errors use `--destructive`.
- **Focus** must contrast the control it sits on (coral buttons get the
  `--ring` = slate, not coral).
- Motion is opt-in per component and respects `prefers-reduced-motion`
  (global reduce rule in `@layer base`).
