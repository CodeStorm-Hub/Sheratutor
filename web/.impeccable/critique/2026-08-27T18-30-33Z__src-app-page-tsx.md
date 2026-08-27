---
target: src/app/page.tsx
total_score: 20
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
timestamp: 2026-08-27T18-30-33Z
slug: src-app-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Form uses `useActionState` with pending/success/error indicators; live student counter shows community size. Minor delay during Supabase count fetch on mount. |
| 2 | Match System / Real World | 4/4 | Excellent real-world alignment with Bangladeshi student terminology (SSC/HSC, খাতা, বোর্ড পরীক্ষক, NCTB রুব্রিক, A+ grade metrics). |
| 3 | User Control and Freedom | 3/4 | Instant bilingual toggle (Bangla / English) with localStorage persistence; minor toggle easily expands/collapses PDPA section. |
| 4 | Consistency and Standards | 2/4 | Design token fracture: `DESIGN.md` specifies Bottle Green & Paper Canvas, but page uses Navy/Coral and plain `#fff`. Nav has "Open Workspace" while Hero has "Join Waitlist" (competing mental models). |
| 5 | Error Prevention | 3/4 | Proper HTML5 validation (`inputMode="tel"`, numeric constraints for exam year 2026–2030, required attributes). |
| 6 | Recognition Rather Than Recall | 3/4 | The `KhataPreview` makes the abstract concept of "AI Grading" immediately recognizable through the visual metaphor of marked exam paper. |
| 7 | Flexibility and Efficiency of Use | n/a | Persuade mode (Landing page): Public marketing/conversion surface; keyboard accelerators and power-user workflows are not applicable. |
| 8 | Aesthetic and Minimalist Design | 2/4 | Above-the-fold hero is overloaded with a 7-field form (including PDPA legal notice); two consecutive 3-card grids create visual monotony; heavy inline styling. |
| 9 | Error Recovery | 3/4 | Clear inline error message rendered upon form submission failure without wiping user inputs. |
| 10 | Help and Documentation | n/a | Persuade mode (Landing page): Conversion landing flow; formal help docs are not applicable on this surface. |
| **Total** | | **20/32** | **Acceptable (62.5%)** |

## Design Specificity Verdict

**LLM assessment**: SheraTutor possesses a distinct and compelling cultural concept defined in its product documentation: **"The Board Examiner's Khata & Blackboard"**—rooted in Bangladesh's high-stakes NCTB curriculum (SSC/HSC), bilingual handwriting OCR (Bangla/English), authentic board grading rubrics, and the tactile reality of the ruled-paper exam script (*খাতা*). However, `src/app/page.tsx` only partially realizes this promise. The `KhataPreview` SVG component and bilingual copy strongly anchor the subject matter, but the layout defaults to a standard 2-column SaaS waitlist hero and two consecutive 3-card grids. Furthermore, there is token drift away from `DESIGN.md` (Bottle Green `#006A4E`, Examiner Red `#D92638`, Paper Light `#F7F8F5`) toward generic Ink Navy, Coral, and `#ffffff`.

**Deterministic scan**: The automated detector identified 5 findings across the landing page component tree:
- 4 font-size advisory warnings in `src/components/khata-preview.tsx` (lines 153, 166, 175, 190: 11px, 44px, 18px, 10px inside SVG illustration).
- 1 color drift warning in `src/components/waitlist-form.tsx` (line 34: undocumented hardcoded green `#0a7d5c` outside `DESIGN.md` palette).

## Overall Impression
SheraTutor has strong cultural authenticity and a high-conviction educational mission for Bangladeshi students, but the landing page is weighed down by a friction-heavy 7-field waitlist form above the fold, a split conversion narrative (Workspace vs. Waitlist), and design token drift from its "Board Examiner's Khata" design system.

## What's Working
1. **Culturally Grounded Khata Visual Artifact (`KhataPreview.tsx`)**: The bespoke SVG exam paper with notebook ruling, red margin, green teacher checkmarks, yellow warning triangles, and red deduction marks provides instant recognition of authentic board grading.
2. **First-Class Bilingual Architecture & Copywriting**: Zero-flash language switching between Bangla and English with natural, respectful terminology ("হাতে লেখা উত্তরপত্র", "বোর্ড পরীক্ষক", "নম্বর কাটা গেছে").
3. **Ethical Value Proposition**: The "Problem / Solution / Promise" framework articulates the mission of democratizing private-tutor quality diagnostics for every student with zero paywalls.

## Priority Issues

### [P1] CTA Intent Schism: Live Workspace vs. Closed Waitlist
- **Why it matters**: Header offers "Open Workspace" (`/dashboard`) while the hero primary CTA is "Join Waitlist", confusing visitors about whether the product is live or in private beta.
- **Fix**: Unify the funnel strategy. For an active product, replace the hero form with a 1-step "Try Sample Exam Script" or "Start Free Practice" CTA. For closed beta, route navbar CTAs to the waitlist section.
- **Suggested command**: `/impeccable clarify src/app/page.tsx`

### [P1] Design System Token Fracture & Hardcoded Styles
- **Why it matters**: `DESIGN.md` and `globals.css` define the tactile "Board Examiner's Khata" palette (Bottle Green `#006A4E`, Examiner Red `#D92638`, Paper Light `#F7F8F5`), but `page.tsx`, `waitlist-form.tsx`, and `styles.css` rely on legacy Navy/Coral, stark `#fff`, and hardcoded inline styles.
- **Fix**: Refactor markup to consume Tailwind design tokens (`bg-paper`, `text-ink`, `border-line`, primary Bottle Green CTAs, reserving Examiner Red strictly for score deductions and margin rules).
- **Suggested command**: `/impeccable colorize src/app/page.tsx`

### [P2] Hero Form Cognitive Overload & 7-Field Friction
- **Why it matters**: Asking for Full Name, Phone, Email, Exam Type, Exam Year, Minor Checkbox, and Guardian Consent on initial page load causes high abandonment, especially on mobile devices.
- **Fix**: Replace with a streamlined 1-step entry (phone/WhatsApp or email) with progressive disclosure for exam details, or relocate the comprehensive registration form to a dedicated section.
- **Suggested command**: `/impeccable distill src/app/page.tsx`

### [P2] Monotonous Card Grid & Lack of Subject/Curriculum Breadth
- **Why it matters**: Two consecutive 3-card grids without section `<h2>` headers create visual fatigue and fail to showcase NCTB subject depth (Physics CQ rubrics, Higher Math KaTeX equations, Chemistry diagrams).
- **Fix**: Add semantic `<h2>` headers, introduce an interactive subject preview switcher or KaTeX formula breakdown card, and vary container elevation and padding.
- **Suggested command**: `/impeccable layout src/app/page.tsx`

## Persona Red Flags

- **Jordan (Confused First-Timer)**: Conflicted by "Open Workspace" vs. "Join Waitlist"; intimidated by formal legalistic guardian consent text under the 2026 PDPA.
- **Casey (Distracted Mobile Student on 3G)**: The 7-field form takes up over 550px of vertical height on mobile viewports before the `KhataPreview` or product benefits become visible.
- **Tanvir (Bangladeshi HSC Science Student under GPA-5 Pressure)**: Seeks proof that the AI understands board-standard Creative Questions (CQ 'গ' ও 'ঘ' marks) and NCTB syllabi, but sees only high-level generic steps.

## Minor Observations
- Document outline skips `<h2>` levels (jumps from `<h1>` directly to `<h3>` in cards).
- Heavy use of inline React `style={{ ... }}` attributes across landing components.
- Footer lacks essential trust and navigation links (Syllabus Coverage, Privacy Policy, Terms, Contact).

## Questions to Consider
- *What if students could upload a photo of their handwritten homework or try a live interactive demo directly on the landing page without signing up or joining a waitlist?*
- *What if the entire page background subtly embraced the warm off-white ruled paper texture (`#F7F8F5`) with authentic 1px margin rules, rather than a generic white SaaS container?*
- *What if we featured an interactive "Board Exam Subject Matrix" (Physics, Chemistry, Higher Math, Biology, Bangla CQ) allowing students to see live sample rubric deductions for Dhaka/Rajshahi/Chattogram boards?*
