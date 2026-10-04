# SheraTutor Brand Color Codes & Typography System

> **Design Direction:** "Academic Daylight / Midnight Cosmic Study"  
> **Source of Truth:** `web/src/app/globals.css` · `web/src/app/layout.tsx` · `web/DESIGN.md`

---

## 🎨 1. Brand Color Codes

### Core Brand Identity

| Token Name | Color Role | HEX Code | OKLCH Value | Notes & Practical Usage |
| :--- | :--- | :---: | :---: | :--- |
| **Hyper Sunset Coral** (`--primary`, `--cta`) | Primary Action Button | `#FF5538` | `oklch(0.660 0.210 34)` | Main CTA buttons (*"Start Focus Session"*, *"Upload"*, active pills) |
| **Brand Navy** (`--heading`, `--navy`) | Display Headlines | `#14182B` | `oklch(0.240 0.085 268)` | Prominent titles & logo anchor (`#1E2761`) |
| **Canvas Light** (`--background`) | Light App Canvas | `#F8FAFC` | `oklch(0.985 0.005 250)` | Glare-free daylight porcelain workspace background |
| **Card White** (`--card`, `--surface-1`) | Light Panels & Cards | `#FFFFFF` | `oklch(1.000 0.000 0)` | Pure white floating cards, dialogs, question containers |
| **Midnight Obsidian** (`--background` dark) | Dark App Canvas | `#0E1322` | `oklch(0.142 0.032 262)` | Midnight cosmic study background (hue 262, zero eye fatigue) |
| **Obsidian Card** (`--card` / `--surface-1` dark) | Dark Panels & Cards | `#161D31` | `oklch(0.188 0.038 262)` | Tier-1 elevated panels in dark mode |
| **Obsidian Hover** (`--surface-2` dark) | Hovered / Active Slot | `#1E2642` | `oklch(0.230 0.042 262)` | Tier-2 active navigation pills & hover states |
| **Obsidian Recessed** (`--surface-3` dark) | Inputs & Chips | `#273255` | `oklch(0.270 0.045 262)` | Tier-3 recessed inputs & active badges |

---

### Functional & Status Colors

| Role | Color Name | HEX Code | OKLCH Value | Usage Guidelines |
| :--- | :--- | :---: | :---: | :--- |
| **Success / Cyber Mint** | Cyber Mint | `#10B981` | `oklch(0.700 0.180 162)` | Correct steps, earned marks, study streaks, active status pips |
| **Warning / Solar Flame** | Solar Gold Flame | `#F59E0B` | `oklch(0.775 0.180 75)` | Tips, hints, notices, streaks, formula highlights |
| **Electric Cyan** | Electric Cyan | `#06B6D4` | `oklch(0.790 0.155 210)` | Vector physics, formulas, simulator highlights |
| **Electric Indigo** | Cosmic Indigo | `#6366F1` | `oklch(0.585 0.220 275)` | Logo badge gradient, secondary academic tags |
| **General Error** | Alert Red | `#EF4444` | `oklch(0.637 0.237 25)` | Form input errors, network disconnections |
| **Mark Deduction** | **Examiner Red** | `#DC2626` | `oklch(0.577 0.245 27)` | **Strictly Reserved:** Lost marks, missing steps |
| **Borders (Light)** | Slate Border | `#E2E8F0` | `oklch(0.920 0.012 250)` | 1px dividers, card contours |
| **Borders (Dark)** | Obsidian Border | — | `oklch(0.92 0.03 262 / 12%)` | 1px luminous borders in dark mode |
| **Focus Ring** | Deep Contrast | `#0F172A` | `oklch(0.208 0.040 266)` | High-contrast focus outline around coral controls |

> [!IMPORTANT]
> **The Reserve Rule:** `--mark-deduction` (`#DC2626`) is strictly preserved for academic penalties (e.g., lost exam marks, examiner red ink, missing calculation steps in CQs). Generic application errors use `--destructive` (`#EF4444`).

---

## 🔤 2. Typography & Fonts

All fonts are self-hosted via `next/font/google` with zero layout shift (`display: swap`):

### The 5 Font Families

```
1. Display / Titles (English)
   └─ Family: Outfit
   └─ Weights: 600 (Semi-Bold), 700 (Bold), 800 (Extra-Bold)
   └─ CSS Variable: --font-display

2. Display / Titles (Bangla)
   └─ Family: Baloo Da 2
   └─ Weights: 600 (Semi-Bold), 700 (Bold), 800 (Extra-Bold)
   └─ CSS Variable: --font-display-bn

3. Body / Paragraphs (English)
   └─ Family: Plus Jakarta Sans
   └─ Weights: 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold), 800 (Extra-Bold)
   └─ CSS Variable: --font-body

4. Body / Paragraphs (Bangla)
   └─ Family: Hind Siliguri
   └─ Weights: 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)
   └─ CSS Variable: --font-body-bn

5. Eyebrows, Numbers, Formulas & Timers (Monospace)
   └─ Family: JetBrains Mono
   └─ Weights: 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)
   └─ CSS Variable: --font-mono-eyebrow
```

---

### Type Scale (Sizes & Line Heights)

| Utility Class | Size | Line Height | Tracking | Where to use |
| :--- | :---: | :---: | :---: | :--- |
| **`text-display`** | `clamp(2rem, 5vw, 3.25rem)` | `1.15` | `-0.02em` | Large hero page titles |
| **`text-headline`** | `clamp(1.5rem, 3.5vw, 2.25rem)` | `1.25` | `-0.01em` | Section headers |
| **`text-xl`** | `1.25rem` (20px) | `1.40` | Normal | Card titles |
| **`text-sm`** | `0.875rem` (14px) | `1.50` | Normal | Standard body copy |
| **`text-xs`** | `0.75rem` (12px) | `1.30` | `+0.12em` | Uppercase eyebrow labels |
| **`text-2xs`** | `0.6875rem` (11px) | `1.45` | Normal | Metadata rows & small chips |
| **`text-3xs`** | `0.625rem` (10px) | `1.40` | Normal | Timers, graph axis labels |
| **`font-tabular`** | `font-variant-numeric: tabular-nums` | — | — | Prevents numerical jitter on timers & scoreboards |

---

### Language-Specific Rule for Bengali (`:lang(bn)`)

Bengali diacritics (*মাত্রা, কার, য-ফলা*) need extra vertical space to avoid text collision, and positive letter spacing prevents conjunct (*যুক্তবর্ণ*) fracturing:

```css
:lang(bn) {
  --font-sans: var(--font-body-bn);       /* Hind Siliguri */
  --font-heading: var(--font-display-bn); /* Baloo Da 2 */
  line-height: 1.68;                      /* Elevated line-height */
  letter-spacing: 0.005em;                /* Positive tracking for conjunct integrity */
}

:lang(bn) h1, :lang(bn) h2, :lang(bn) h3, :lang(bn) h4 {
  --font-heading: var(--font-display-bn);
  line-height: 1.42;
  letter-spacing: normal;
}
```

---

## 💻 3. Quick Copy Tailwind Classes

```tsx
// Primary Action Button
<button className="bg-cta text-cta-foreground hover:opacity-90 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.98]">
  Start Focus Session
</button>

// Display Title (Bilingual Safe)
<h1 className="text-display font-heading text-heading">
  বাস্তব গণিত শেখার খেলার মাঠ
</h1>

// Monospace Stat / Timer Badge
<span className="font-mono font-tabular text-xs font-bold text-muted-foreground uppercase tracking-wider">
  ⏱️ 60s Timed Exam
</span>

// Examiner Mark Deduction Callout
<div className="border border-mark/30 bg-mark/10 text-mark p-4 rounded-xl text-xs font-bold">
  -১ নম্বর কাটা: a ≠ 0 শর্তটি উল্লেখ করা হয়নি!
</div>
```
