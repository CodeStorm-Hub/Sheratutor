# SheraTutor Brand Color Codes & Typography System

> **Design Direction:** "Academic Daylight / Cosmic Study"  
> **Source of Truth:** `web/src/app/globals.css` · `web/src/app/layout.tsx` · `web/DESIGN.md`

---

## 🎨 1. Brand Color Codes

### Core Brand Identity

| Token Name | Color Role | HEX Code | OKLCH Value | Notes & Practical Usage |
| :--- | :--- | :---: | :---: | :--- |
| **Brand Coral** (`--primary`, `--cta`) | Primary Action Button | `#FF6B57` | `oklch(0.706 0.164 33)` | Main CTA buttons (*"Start Exam"*, *"Submit"*, active badges) |
| **Brand Navy** (`--heading`, `--navy`) | Display Headlines | `#14182B` | `oklch(0.270 0.100 273)` | Prominent titles & logo anchor (`#1E2761`) |
| **Canvas Light** (`--background`) | Light App Canvas | `#F8F9FC` | `oklch(0.984 0.003 265)` | Daylight porcelain workspace background |
| **Card White** (`--card`, `--surface-1`) | Light Panels & Cards | `#FFFFFF` | `oklch(1.000 0.000 0)` | Raised cards, dialogs, question containers |
| **Cosmic Navy** (`--background` dark) | Dark App Canvas | `#0D0F16` | `oklch(0.171 0.044 278)` | Deep late-night study background |
| **Dark Card** (`--card` dark) | Dark Panels & Cards | `#141822` | `oklch(0.223 0.055 278)` | Raised panels in dark mode |

---

### Functional & Status Colors

| Role | Color Name | HEX Code | OKLCH Value | Usage Guidelines |
| :--- | :--- | :---: | :---: | :--- |
| **Success / Accent 2** | Emerald Green | `#10B981` | `oklch(0.696 0.170 162)` | Correct steps, earned marks, study streaks |
| **Warning / Merit** | Solar Amber | `#F59E0B` | `oklch(0.769 0.166 70)` | Tips, hints, notices, boss rush countdown |
| **General Error** | Alert Red | `#EF4444` | `oklch(0.637 0.237 25)` | Form input errors, network disconnections |
| **Mark Deduction** | **Examiner Red** | `#DC2626` | `oklch(0.577 0.245 27)` | **Strictly Reserved:** Lost marks, missing steps |
| **Borders (Light)** | Slate Border | `#E2E8F0` | `oklch(0.929 0.012 261)` | 1px dividers, card contours |
| **Focus Ring** | Deep Contrast | `#0F172A` | `oklch(0.208 0.040 266)` | High-contrast focus outline around coral buttons |

> [!IMPORTANT]
> **The Reserve Rule:** `--mark-deduction` (`#DC2626`) is strictly preserved for academic penalties (e.g., lost exam marks, examiner red ink, missing calculation steps in CQs). Generic application errors use `--destructive` (`#EF4444`).

---

## 🔤 2. Typography & Fonts

All fonts are self-hosted via `next/font/google` with zero layout shift (`display: swap`):

### The 5 Font Families

```
1. Display / Titles (English)
   └─ Family: Baloo 2
   └─ Weights: 600 (Semi-Bold), 700 (Bold)
   └─ CSS Variable: --font-display

2. Display / Titles (Bangla)
   └─ Family: Baloo Da 2
   └─ Weights: 600 (Semi-Bold), 700 (Bold)
   └─ CSS Variable: --font-display-bn

3. Body / Paragraphs (English)
   └─ Family: Inter
   └─ Weights: 400 (Regular), 500 (Medium), 600 (Semi-Bold)
   └─ CSS Variable: --font-body

4. Body / Paragraphs (Bangla)
   └─ Family: Noto Sans Bengali
   └─ Weights: 400 (Regular), 600 (Semi-Bold), 700 (Bold)
   └─ CSS Variable: --font-body-bn

5. Eyebrows, Numbers & Timers (Monospace)
   └─ Family: Space Mono
   └─ Weights: 400 (Regular), 700 (Bold)
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

Bengali diacritics (*মাত্রা, কার, য-ফলা*) need extra vertical space to avoid text collision:

```css
:lang(bn) {
  --font-sans: var(--font-body-bn);       /* Noto Sans Bengali */
  --font-heading: var(--font-display-bn); /* Baloo Da 2 */
  line-height: 1.65;                      /* Elevated line-height */
}

:lang(bn) h1, :lang(bn) h2, :lang(bn) h3, :lang(bn) h4 {
  line-height: 1.40;
}
```

---

## 💻 3. Quick Copy Tailwind Classes

```tsx
// Primary Action Button
<button className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all">
  Start Challenge
</button>

// Display Title (Bilingual Safe)
<h1 className="text-display font-heading text-heading">
  বাস্তব গণিত শেখার খেলার মাঠ
</h1>

// Monospace Stat / Timer Badge
<span className="font-mono font-tabular text-xs font-bold text-muted-foreground uppercase tracking-wider">
  ⏱️ 60s Boss Rush
</span>

// Examiner Mark Deduction Callout
<div className="border border-mark/30 bg-mark/10 text-mark p-4 rounded-xl text-xs font-bold">
  -১ নম্বর কাটা: a ≠ 0 শর্তটি উল্লেখ করা হয়নি!
</div>
```
