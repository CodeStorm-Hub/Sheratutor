# SheraTutor — Design System

## Brand Name & Domain

- **Name:** SheraTutor ("Shera" = Bangla for "best/top")
- **Domain:** sheratutor.ai
- **Tagline lockup:** "SheraTutor, for **Shera**Students" — plays on the brand name to describe the audience, framing students as an identity/community, not just users.

---

## Color Palette

| Name | Hex | Usage |
|---|---|---|
| Ink Navy | `#14182B` | Primary dark background, headline text on light backgrounds |
| Ink-2 / Card Navy | `#1E2761` | Secondary dark surfaces, cards on dark sections, badge backgrounds on dark lockups |
| Coral | `#FF6B57` | Primary accent — CTA buttons, "Tutor"/"Students" wordmark color, grading-tick icon |
| Coral Deep | `#E6503D` | Hover states, small caption/eyebrow labels on light backgrounds |
| Mint | `#23D9A5` | Secondary accent — AI/sparkle motif, success states |
| Mint Deep | `#0FB98A` | Darker mint for depth/contrast where needed |
| Sunshine | `#FFC93C` | Tertiary accent — small "star" details (the "Shera" merit-mark accent) |
| Paper White | `#FFFFFF` | Light section backgrounds, the "paper" element in the icon |
| Paper Gray | `#F4F5FB` / `#F2F4FA` | Alternate light section backgrounds, paper header block in icon |
| Ruled Line Gray | `#D7DEEF` | Muted lines/dividers, ruled lines on the paper icon |
| Ink Soft | `#5A6180` | Muted body text on light backgrounds |

**Dominant/accent balance:** Ink Navy and white/paper gray carry most backgrounds (60–70%); Coral is the sharp, primary accent used deliberately (CTAs, key wordmark color); Mint and Sunshine are supporting accents used consistently for specific meanings (Mint = AI/tech, Sunshine = merit/best) rather than decoratively.

---

## Typography

| Role | Font | Weights | Notes |
|---|---|---|---|
| Display / headlines | **Baloo 2** | 600 / 700 / 800 | Bouncy, rounded, youthful — used for all headlines and the wordmark. This is the single most important typographic signal that the brand is built for teenagers, not corporate SaaS. |
| Body text | **Inter** | 400 / 500 / 600 / 700 | Clean, readable, standard UI body font |
| Labels / stats / mono accents | **Space Mono** | 700 | Uppercase, letter-spacing ~2–3px — used for section "eyebrow" labels (e.g., "THE PROBLEM"), stat numbers, and small caption text. Gives an "exam/grade sheet" precision feel that contrasts with the playful display font. |

Both Baloo 2 and Space Mono are free on Google Fonts.

---

## Logo & Icon System

### Wordmark
"SheraTutor" set in Baloo 2 ExtraBold (800): **"Shera"** in Ink Navy (or white on dark backgrounds), **"Tutor"** in Coral. No image needed — this can be recreated as styled text in code.

### Tagline lockup
"for **Shera**Students" set beneath the wordmark at roughly half the size, same two-tone logic: "for" in Ink Soft gray (de-emphasized connector), "Shera" in Ink Navy/white (matching the main wordmark), "Students" in Coral (matching "Tutor") — both in Baloo 2. This makes the tagline read as a companion line to the wordmark rather than a competing headline.

### Icon / mark
A tilted white **exam answer script** with a few thin gray ruled lines, a bold **coral checkmark** stroked confidently across it (the "AI grading tick" — this is the actual product mechanism, not an abstract symbol), a small **mint 4-point sparkle** near the top-right corner (the AI signal), and a small **sunshine 5-point star** tucked into the corner of the paper (the "Shera"/best merit-mark accent).

**Design rationale:** earlier concepts used a graduation cap (mortarboard) and an abstract star, both rejected — the mortarboard is a Western convocation symbol with no real connection to Bangladeshi SSC/HSC culture (no high-school graduation ceremony tradition), and a lone star didn't communicate what the product does. The answer-script-plus-tick icon is both **culturally relevant** (every student recognizes their own exam script/khata) and **literal to the product** (AI grades your handwritten answers) — it does double duty instead of being decorative.

**Signature motif — the "grade stamp":** a circular badge with a dashed ring border, echoing a rubber grading stamp. Used around the icon on badges, and as a recurring element in pitch materials (e.g., a big "A+" stamp on a hero slide) to visually tie back to "graded like a real examiner."

### Icon variants needed for production
- Rounded badge icon (favicon, social profile photo)
- Full-bleed square icon, no transparency (Play Store / App Store submission)
- Horizontal lockup (icon + wordmark) for light backgrounds
- Horizontal lockup for dark backgrounds — **important:** the paper/lines/header inside the icon must render in the exact same white/gray colors regardless of light or dark theme; only the badge circle background and wordmark text color should adapt for contrast. Do not invert the paper to a dark fill on dark backgrounds — this breaks visual consistency of the brand mark itself.
- Compact footer lockup with the sheratutor.ai domain as a small caption line

---

## Tone & Voice

- Warm, aspirational, energetic — built for teenagers, not corporate SaaS.
- Confident but not shouty; avoid generic ed-tech clichés ("unlock your potential," "revolutionize learning").
- Local and specific over generic and global — e.g., "graded like a real board examiner" lands harder than "AI-powered learning platform."
- Motion/animation (in digital surfaces like the deck or app) should feel smooth and deliberate — staggered entrances, eased transitions — rather than snappy/instant, to match the "premium but still fun" feel.

---

## Applied Examples

- **Pitch deck:** navy/coral/mint/sunshine palette throughout, Baloo 2 headlines with word-by-word entrance animation, Space Mono eyebrow labels ("THE PROBLEM," "THE SOLUTION"), the circular grade-stamp motif reused at key moments (hero, stats, closing CTA).
- **Waitlist landing page:** same palette and type system, coral CTA buttons, the paper+tick icon as the favicon and near the hero.
