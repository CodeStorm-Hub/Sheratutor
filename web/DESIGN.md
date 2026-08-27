---
name: SheraTutor
description: "AI-Powered Board Examiner & Learning Workspace for SSC & HSC Students"
colors:
  primary: "#006a4e"
  primary-deep: "#00543d"
  primary-soft: "#e2f0e9"
  accent-coral: "#ff6b57"
  accent-coral-deep: "#e6503d"
  accent-mint: "#23d9a5"
  accent-mint-deep: "#0fb98a"
  accent-sunshine: "#ffc93c"
  accent-ochre: "#b97f08"
  examiner-red: "#d92638"
  examiner-red-deep: "#b81e2e"
  examiner-red-soft: "#fdeaec"
  paper-bg: "#f7f8f5"
  paper-card: "#ffffff"
  paper-alt: "#f4f5fb"
  blackboard-bg: "#0f1c17"
  blackboard-deep: "#081611"
  blackboard-card: "#16261f"
  blackboard-card-alt: "#10221a"
  ink: "#14251f"
  ink-soft: "#52655d"
  ink-navy: "#14182b"
  ink-chalk: "#e8efe9"
  ink-chalk-soft: "#a3b8ad"
  ink-chalk-muted: "#9db3a8"
  ochre-tint: "#e6c35c"
  ochre-deep: "#8f6206"
  coral-tint: "#ff6b7a"
  lilac-tint: "#a78bfa"
  line: "#dde4dd"
  border-subtle: "#e9ebf3"
typography:
  display:
    fontFamily: "'Baloo 2', sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Baloo 2', sans-serif"
    fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "'Space Mono', monospace"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.12em"
rounded:
  sm: "0.36rem"
  md: "0.48rem"
  lg: "0.6rem"
  xl: "0.84rem"
  2xl: "1.08rem"
  full: "9999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.5rem"
  2xl: "2rem"
  3xl: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
  button-coral:
    backgroundColor: "{colors.accent-coral}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
  button-coral-hover:
    backgroundColor: "{colors.accent-coral-deep}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
  card-paper:
    backgroundColor: "{colors.paper-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "16px"
---

# Design System: SheraTutor

## Overview

**Creative North Star: "The Board Examiner's Khata & Blackboard"**

SheraTutor's design system grounds digital exam preparation in the tactile reality of Bangladeshi academia. In light mode, the interface evokes the authentic ruled-paper exam script (*খাতা*)—warm off-white paper backgrounds (`#F7F8F5`), crisp ink typography (`#14251F`), subtle 1px ruled lines (`#DDE4DD`), and the authoritative presence of the examiner's red grading pen (`#D92638`). In dark mode, the environment seamlessly transitions into a calm, focused classroom chalkboard (`#0F1C17`) with chalk-tinted text and emerald accents.

The aesthetic balance bridges serious academic rigor with youthful energy. While headlines set in **Baloo 2** bring warmth, approachability, and native Bangla harmony for teenagers studying under intense pressure, technical statistics and question numbers set in **Space Mono** provide the uncompromising precision of a national board mark sheet.

Visual rejections are strict: SheraTutor rejects generic corporate SaaS blandness (cool blue-tinted grays and impersonal sterile cards), superficial AI neon gradients, and noisy gamification clutter. Every visual element serves diagnostic clarity and mastery.

**Key Characteristics:**
- **Authentic Paper & Blackboard Dual Themes:** Tactile paper textures in light mode and distraction-free chalkboard tones in dark mode.
- **Disciplined Examiner Red:** Red is never used as a generic CTA; it is strictly preserved for marks, deductions, and the signature margin rule.
- **Culturally Attuned Typography:** Energetic Baloo 2 paired with neutral Inter and monospace exam labels.
- **Diagnostic Clarity:** Information density optimized for step-by-step mark breakdowns and KaTeX mathematical notation.

## Colors

The SheraTutor palette operates with strict semantic role separation between brand anchors, deliberate student accents, and diagnostic marks.

### Primary
- **Bottle Green** (`#006A4E`): The primary institutional brand anchor representing national academic excellence, primary submission actions, and verified progress.
- **Deep Bottle Green** (`#00543D`): Active and hover states on primary interactive elements.
- **Soft Bottle Green** (`#E2F0E9`): Secondary badge fills, progress bar tracks, and subtle success callout backdrops.

### Secondary
- **Brand Coral** (`#FF6B57`): The vibrant, student-facing accent. Used for key call-to-action buttons ("Start Exam", "Ask Tutor"), wordmark highlights, and interactive spark moments.
- **Deep Coral** (`#E6503D`): Hover and pressed states for coral actions.
- **Mint** (`#23D9A5`): The AI motif color, highlighting instant OCR processing, AI tutoring suggestions, and smart hints.

### Tertiary
- **Sunshine Ochre** (`#FFC93C` / `#B97F08`): Merit marks, GPA-5 achievement badges, star ratings, and chapter mastery highlights.
- **Soft Ochre** (`#FBF3DC`): Warning callouts, pending review states, and revision reminders.

### Neutral
- **Paper Light** (`#F7F8F5` / `#FFFFFF`): The light theme canvas simulating high-grade exam khata paper.
- **Blackboard Dark** (`#0F1C17` / `#16261F`): The dark theme canvas mimicking a clean classroom slate.
- **Deep Ink** (`#14251F` / `#14182B`): Primary body and headline text with high contrast readability.
- **Soft Ink** (`#52655D` / `#69718C`): Subtitles, metadata, timestamps, and secondary captions.
- **Ruled Line** (`#DDE4DD` / `#E9EBF3`): 1px structural dividing lines and khata borders.

### Named Rules
**The Examiner Red Rule.** Examiner Red (`#D92638`) is strictly reserved for mark deductions, step gaps, and the signature left margin rule. It is never used as a primary button background or generic brand decoration, preserving its psychological authority ("the board examiner marked this").

**The Khata Contrast Rule.** The paper sheet element inside icons, preview cards, and badges must maintain authentic white/light-gray fill regardless of light or dark mode. Background contrast adapts around the paper, never inverting the khata itself.

**The Dark Mode Chalk Elevation Rule.** In dark mode, depth is created via layered chalkboard tonal steps rather than heavy drop shadows:
- **Base Canvas:** Deep Blackboard (`#0F1C17`)
- **Layer 1 Surface (Cards & Panels):** Blackboard Card (`#16261F` / `#10221A`) with 1px border `oklch(1 0 0 / 12%)`
- **Layer 2 Surface (Elevated Badges & Insets):** Inset Chalk Card (`rgba(255, 255, 255, 0.05)`)
- **Layer 3 Surface (Modals & Popovers):** Raised Blackboard (`#1D332A`) with subtle border glow

## Typography

**Display Font:** Baloo 2 (`next/font/google` self-hosted, variable: `--font-display`)  
**Body Font:** Inter (`next/font/google` self-hosted, variable: `--font-body`)  
**Bengali Body Font:** Noto Sans Bengali (`next/font/google`, variable: `--font-body-bn`)  
**Label/Mono Font:** Space Mono (`next/font/google`, variable: `--font-mono-eyebrow`)  

The typographic pairing balances the lively, rounded curves of Baloo 2—which seamlessly supports both Latin and Bengali letterforms—with the neutral clarity of Inter for dense rubric text and Space Mono for score sheets.

### Hierarchy
- **Display** (700, `clamp(2rem, 5vw, 3.25rem)`, line-height: 1.15): Hero banners, high-level dashboard greetings, and score summaries.
- **Headline** (700, `clamp(1.5rem, 3.5vw, 2.25rem)`, line-height: 1.25): Page headers, subject titles (e.g., "Physics 1st Paper"), and section anchors.
- **Title** (600, `1.25rem` / `20px`, line-height: 1.4): Card headers, question numbers (CQ 1, MCQ 14), and modal titles.
- **Body** (400 / 500, `0.875rem` / `14px`, line-height: 1.5): Standard UI copy, feedback explanations, and tutor dialogue. Max line length: 65–75ch.
- **Label** (700, `0.75rem` / `12px`, letter-spacing: `0.12em`, uppercase): Eyebrow tags (`MISTAKE ANALYSIS`, `DHAKA BOARD 2024`), rubric step codes, and tabular statistics.

### Named Rules
**The Bengali Script Rule.** When rendering Bengali text (`:lang(bn)`), typography automatically applies a line-height multiplier between `1.55` and `1.75` to ensure complex diacritics (*hoshonto*, *ro-khor*, *juktakkhor*) never clip or collide with adjacent lines.

**The Zero-CLS Font Loading Rule.** All typefaces are self-hosted and preloaded at build time via `next/font/google` with `display: 'swap'` and automatic font fallback metrics, eliminating FOIT (Flash of Invisible Text) and layout shifts.

**The Tabular Precision Rule.** All numerical scores, timers, and mark deductions utilize tabular numerals (`font-variant-numeric: tabular-nums`) to ensure strict columnar alignment in grade tables.

## Layout & Mobile Ergonomics

The spatial model employs an 8px base grid with a floating, collapsible navigation sidebar on desktop (fixed at `244px` width, inset `18px`), paired with a responsive fluid content canvas constrained to `1200px` max-width.

- **Grid & Spacing Rhythm:** Spacing steps follow a predictable scale (`0.25rem`, `0.5rem`, `0.75rem`, `1rem`, `1.5rem`, `2rem`, `3rem`).
- **Touch Target Floor:** All interactive elements (buttons, filter chips, icon actions, checklist toggles) enforce a minimum touch target of `44px × 44px` on mobile viewports to prevent mis-taps during hurried study sessions.
- **Responsive Breakpoints:**
  - Mobile (`<640px`): Full-bleed cards, bottom navigation or sheet drawer, single-column question review, sticky action CTA bar.
  - Tablet (`640px – 1024px`): Collapsed sidebar, two-column metric grids.
  - Desktop (`>1024px`): Permanent floating sidebar, multi-column exam review with dual-pane image transcription and rubric critique.

## Elevation & Depth

SheraTutor is **Flat-by-Default with Tonal Layering**. Depth is primarily established through 1px border rules (`#DDE4DD`) and surface tint steps (`#F7F8F5` background vs. `#FFFFFF` card surface) rather than heavy drop shadows.

### Shadow Vocabulary
- **Subtle Ambient** (`box-shadow: 0 8px 30px rgba(28, 35, 65, 0.04)`): Applied to floating desktop sidebar and key dashboard summary widgets.
- **Raised Popover** (`box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12)`): Dropdown menus, tooltips, and floating tutor chat bubble.

### Named Rules
**The Flat-by-Default Rule.** Surfaces rest flat with clean 1px border lines. Shadows appear only to indicate elevation state, floating navigation, or focused overlay modals.

## Shapes

Form language is modern, friendly, and structured. Corner radii are tuned to avoid sterile sharpness while maintaining academic structure:
- **Base Radius:** `0.6rem` (9.6px) for standard buttons and inputs.
- **Cards & Containers:** `0.84rem` – `1.08rem` (`rounded-xl` / `rounded-2xl`) with internal clipping.
- **Badges & Pills:** `9999px` (`rounded-full`) for status indicators and chapter tags.

## Components

### Buttons
- **Shape:** Smoothly rounded corners (`0.6rem` / 9.6px radius), `min-height: 40px` (desktop), `min-height: 44px` (mobile).
- **Primary Institutional:** Solid Bottle Green background (`#006A4E`), white text, hover transitions to `#00543D`.
- **Primary Student Action:** Solid Brand Coral (`#FF6B57`), white text, hover transitions to `#E6503D`.
- **Outline / Ghost:** Transparent background with 1px border (`#DDE4DD`), text in Deep Ink, hover in `#EEF0EA`.

### Cards & Containers
- **Corner Style:** `rounded-xl` (12px – 14px radius).
- **Background:** Paper White (`#FFFFFF`) on light mode; Blackboard Card (`#16261F`) on dark mode.
- **Border:** 1px solid border (`#DDE4DD` in light; `oklch(1 0 0 / 12%)` in dark).
- **Internal Padding:** Consistent `1rem` (16px) or `1.5rem` (24px).

### Badges & Chips
- **Style:** Compact pill (`rounded-full`), `Space Mono` uppercase 11px / 12px font.
- **Variants:**
  - **Success / Correct:** Soft Green (`#E2F0E9`) with Deep Green text (`#00543D`).
  - **Deduction / Mistake:** Soft Red (`#FDEAEC`) with Examiner Red text (`#D92638`).
  - **Merit / Star:** Soft Ochre (`#FBF3DC`) with Ochre text (`#B97F08`).
  - **AI / Smart Hint:** Mint soft tint with Mint Deep text (`#0FB98A`).

### Inputs & Fields
- **Style:** 1px border (`#DDE4DD`), `0.6rem` radius, Paper White fill on light, Blackboard Card fill on dark.
- **Focus State:** 2px ring in Bottle Green (`#006A4E`) or Coral with zero offset blur.

### Signature Component: The Examiner Margin Rule & Mark Glyph
- **Margin Rule:** A bold 3px solid left border in Examiner Red (`#D92638`) with `0.75rem` left padding, applied to mark deduction cards and critical step critiques.
- **Mark Glyph:** Circular rubber-stamp badge styling showing fractional marks (`+3/4`, `-1`) with distinct examiner ink feel.

## Do's and Don'ts

### Do:
- **Do** preserve Examiner Red (`#D92638`) exclusively for scores, deductions, and rubric feedback.
- **Do** format all mathematical and chemical equations using KaTeX with proper inline/block delimiters and horizontal scroll containment.
- **Do** use `Space Mono` uppercase tracking for eyebrow titles, exam codes, and score badges.
- **Do** ensure Bengali text rendered via `Baloo 2` has sufficient vertical line-height (`1.55` to `1.75`) to avoid clipping diacritics.
- **Do** keep card borders crisp (`1px solid #DDE4DD` in light, `oklch(1 0 0 / 12%)` in dark) with subtle surface contrast.
- **Do** maintain a minimum `44px × 44px` touch target size on mobile buttons and inputs.

### Don't:
- **Don't** use Examiner Red for primary CTA buttons or general marketing elements.
- **Don't** invert the white/light-gray paper sheet graphic in the brand mark when in dark mode.
- **Don't** use generic bright purple/blue AI gradient bubbles; use Mint (`#23D9A5`) and clean ink lines.
- **Don't** place heavy, blurry drop shadows on standard grid cards.
- **Don't** truncate mathematical formulas or script transcriptions on mobile viewports without horizontal scroll containers.
