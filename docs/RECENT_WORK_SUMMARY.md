# SheraTutor — Recent Work Summary & Technical Log

**Date:** September 2026  
**Environment:** Next.js 16 (App Router, Turbopack, React 19) · Supabase · Genkit AI  
**Test Account:** `afsanchowdhury5@gmail.com` (Student: **anam chowdhury**, SSC Science, Dhaka Board)

---

## 1. Project Runtime & Dev Server Startup

- **Action:** Initialized and verified the Next.js development server using Turbopack, Cache Components, and Partial Prefetching (PPR).
- **Endpoint:** `http://localhost:3000` (Network: `http://192.168.0.108:3000`).
- **Health:** Verified HTTP `200 OK` on initial and subsequent route requests.

---

## 2. Resolving Browser Extension Hydration Mismatch (Dark Reader)

### Problem
- React 19 raised a console hydration error on the landing page:
  `A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.`
- Attribute diffs revealed injected attributes such as `data-darkreader-inline-fill`, `data-darkreader-inline-stroke`, and `--darkreader-inline-...` CSS variables across SVG and form elements.

### Root Cause
- The **Dark Reader** browser extension was parsing the DOM and mutating inline styles before React completed client hydration.

### Resolution
- Registered the official `darkreader-lock` meta tag in [web/src/app/layout.tsx](file:///home/kratzer/workspace/Sheratutor/web/src/app/layout.tsx):
  ```tsx
  <head>
    <meta name="darkreader-lock" />
  </head>
  ```
  and metadata:
  ```ts
  other: {
    'darkreader-lock': '',
  }
  ```
- This prevents Dark Reader from injecting inline styles into SheraTutor (which already has its own built-in light/dark theme system).

---

## 3. End-to-End User Authentication & Dashboard Verification

- **Action:** Executed live browser testing using Chromium via Puppeteer to authenticate with:
  - **Email:** `afsanchowdhury5@gmail.com`
  - **Password:** `callofduty100`
- **Results:**
  - Targeted the email form submit button specifically (avoiding Google OAuth button).
  - Supabase Auth password grant completed in ~538ms.
  - Successfully redirected to `/dashboard`.
  - Student profile verified: **anam chowdhury** (`SSC · SCIENCE · Dhaka Board`).
  - Saved visual snapshots to `web/test-artifacts/01-before-login.png` and `web/test-artifacts/02-after-login.png`.

---

## 4. Full E2E Test Suite Across All 11 Dashboard & AI Features

Executed an automated comprehensive test script ([web/scripts/e2e-all-features-test.mjs](file:///home/kratzer/workspace/Sheratutor/web/scripts/e2e-all-features-test.mjs)) covering all portal modules:

| # | Module / Route | Verified Behavior | Status |
|---|---|---|:---:|
| 1 | **Login** (`/login`) | Authentication, token set, session cookies, redirect to `/dashboard`. | ✅ Passed |
| 2 | **Dashboard Home** (`/dashboard`) | Metrics, student details, momentum score, active enrolled subjects. | ✅ Passed |
| 3 | **AI Tutor Chat** (`/dashboard/tutor`) | Prompted Newton's Second Law; streamed grounded physics response with $F=ma$ in ~8s. | ✅ Passed |
| 4 | **AI Script Upload** (`/dashboard/upload`) | Rubric picker, page dropzone, and OCR pipeline triggers. | ✅ Passed |
| 5 | **Submissions History** (`/dashboard/submissions`) | Past evaluated exam list, marks breakdown, status chips. | ✅ Passed |
| 6 | **Mistake Analysis** (`/dashboard/mistake-analysis`) | Weakness logs, error taxonomy, and revision recommendations. | ✅ Passed |
| 7 | **Board Simulator** (`/dashboard/board-simulator`) | Mock exam timer, NCTB board instructions, question switcher. | ✅ Passed |
| 8 | **Practice Generator** (`/dashboard/practice`) | Adaptive chapter selection and mock test generation controls. | ✅ Passed |
| 9 | **Study Planner** (`/dashboard/study-plan`) | Daily schedule and personalized revision routine. | ✅ Passed |
| 10 | **Achievements** (`/dashboard/achievements`) | Milestones, study streak, and subject badges. | ✅ Passed |
| 11 | **Profile & Settings** (`/dashboard/profile`) | Student academic info, board details, guardian consent status. | ✅ Passed |

- **Outcome:** **11 / 11 tests passed**, 0 uncaught console errors, 11 screenshots saved in `web/test-artifacts/all-features/`.

---

## 5. Bug Fix: 404 "Page Not Found" on Generated Practice Papers

### Problem
- Clicking "Generate Practice Paper" on `/dashboard/practice/generate` redirected to `/dashboard/practice/[id]`, but displayed a **404 Page Not Found** screen.

### Root Cause
- In [web/src/app/dashboard/practice/[id]/page.tsx](file:///home/kratzer/workspace/Sheratutor/web/src/app/dashboard/practice/%5Bid%5D/page.tsx), `getQuestionPaper` was querying Supabase with an unauthenticated client:
  ```ts
  const supabase = createSupabaseClient(URL, ANON_KEY);
  ```
- Because self-generated practice papers are saved with `is_public_template = false` and `created_by_user_id = auth.uid()`, Supabase Row-Level Security (RLS) blocked the anonymous query and returned `null`.
- The page called `if (!paper) notFound();`, triggering the 404.

### Solution
- Refactored `practice/[id]/page.tsx` to use the authenticated server client (`createClient()` from `@/lib/supabase/server`).
- Added a fallback via `getServiceRoleClient()` for instant read availability.
- Updated [web/src/app/dashboard/practice/page.tsx](file:///home/kratzer/workspace/Sheratutor/web/src/app/dashboard/practice/page.tsx) so generated papers immediately appear on the student's **Mock Exams** list.

---

## 6. Question Paper Alignment: Authentic NCTB Bangla Pattern

### Problem
- Generated question papers were showing in English (stimulus and subquestions) when the user's top-level portal UI language was set to English (`ENG`).

### Root Cause
- `QuestionPaperViewerClient.tsx` used the global `useLanguage()` state to select between `stimulus_bn` vs `stimulus_en` and `text_bn` vs `text_en`.

### Solution
- Updated [web/src/components/pages/QuestionPaperViewerClient.tsx](file:///home/kratzer/workspace/Sheratutor/web/src/components/pages/QuestionPaperViewerClient.tsx):
  1. **Bangla by Default:** All NCTB subject question papers default to **Bangla (`bn`)**, matching authentic board exam standards regardless of site UI language.
  2. **Dedicated Version Switcher:** Added `[বাংলা সংস্করণ (NCTB)]` and `[English Version]` toggle buttons on the paper header.
  3. **NCTB Pattern & Numerals:**
     - Question numbering: `১.`, `২.`, `৩.` in Bengali digits.
     - Subquestions: `(ক)`, `(খ)`, `(গ)`, `(ঘ)`.
     - Domain badges: `জ্ঞানমূলক`, `অনুধাবনমূলক`, `প্রয়োগমূলক`, `উচ্চতর দক্ষতা`.
     - Marks: `২ নম্বর`, `৪ নম্বর`, `৪ নম্বর` (totaling 10 marks per CQ).
     - Full marks & time: `পূর্ণমান: ২৫`, `সময়: ৩৮ মিনিট`.
     - Board instructions: *"[বিশেষ নির্দেশাবলি: প্রতিটি প্রশ্নের মান ডানপাশে উল্লেখ করা হয়েছে। ক, খ, গ (ও ঘ) অংশের উত্তর ক্রমানুসারে লেখো।]"*.
- **Verification:** Captured screenshot at `web/test-artifacts/bangla-nctb-paper.png`.

---

## 7. SheraTutor Playground: Gamified NCTB Study Material

### Concept & Objectives
To solve the common dilemma of students finding standard textbook notes boring and disengaging, we introduced **SheraTutor Playground** (`/dashboard/playground`). 
It transforms dry NCTB curricula into an interactive, visually rich, and gamified experience:
- **Playground Hub (`/dashboard/playground`):** Displays enrolled curriculum chapters (Class 9–10 General Mathematics), progress indicators, completion stars, and quick launch actions.
- **Dual-Mode Chapter Architecture:**
  1. **🎮 Interactive Playground (ইন্টারেক্টিভ ল্যাব):** Micro-sandboxes, sliders, compass constructions, bitmask subset generators, and rapid-fire Boss Battles.
  2. **📖 Board Master & Problem Solver Guide (বোর্ড মাস্টার ও সমাধান গাইড):** Comprehensive chapter theory, board CQ (2+4+4) marking breakdown, step-by-step model solutions with rubrics, examiner mark deduction warnings, and 5-year board exam frequency matrices.
  3. **🤖 Sheru Socratic AI Companion:** Real-time conversational AI math buddy embedded on every quest page, powered by streaming `/api/tutor-chat`.

---

## 8. Chapter 1: বাস্তব সংখ্যা (Real Numbers) Implementation

- **Route:** `/dashboard/playground/math/1`
- **Interactive Quests:**
  1. *সংখ্যার শ্রেণিবিন্যাস ল্যাব (Number Classification Lab):* Sorting integers, natural, rational, and irrational numbers with instant feedback.
  2. *পৌনঃপুনিকের এক্স-রে মেশিন (Recurring Decimal Decoder):* Interactive step-by-step 9s and 0s algebraic decoder.
  3. *সংখ্যারেখায় √২ এর জ্যামিতিক কাঁটা (Geometric $\sqrt{2}$ Compass):* Pythagorean unit triangle construction with sweeping circular compass arc onto the number line.
  4. *মৌলিক সংখ্যা শিকারী (Sieve of Eratosthenes):* Multiples elimination grid up to 50.
  5. *৬০ সেকেন্ডের নাম্বার ডিটেকটিভ বস ফাইট (60s Boss Rush):* Timed board MCQ quiz with streak multipliers.
- **Board Master Guide:**
  - 5 Pillars: Core definitions, CQ marks breakdown, 3 model solutions ($\sqrt{2}$ irrationality proof, recurring conversion, coprime proof), examiner traps, and 2020–2024 board matrix.

---

## 9. Chapter 2: সেট ও ফাংশন (Sets & Functions) Implementation

- **Route:** `/dashboard/playground/math/2`
- **Interactive Quests:**
  1. *ভেনচিত্র দ্বীপ (Venn Island Sandbox):* Live SVG vector Venn diagram with neon glowing regions for $A \cup B, A \cap B, A \setminus B, B \setminus A, (A \cup B)', (A \cap B)', A \Delta B$, and real-time formula verification $n(A \cup B) = n(A) + n(B) - n(A \cap B)$.
  2. *শক্তি সেট ও উপসেট শাখা (Power Set $2^n$ Generator):* Cardinality controls ($n = 1..4$), proper subset counter ($2^n - 1$), size-based filtering, and 4-mark board proof breakdown.
  3. *দ্য মরগ্যানের সূত্র আয়না (De Morgan Dual Mirror):* Side-by-side dual-canvas visualizer demonstrating geometric equivalence for $(A \cup B)' = A' \cap B'$ and $(A \cap B)' = A' \cup B'$.
  4. *ফাংশন মেশিন ও ডোমেন-রেঞ্জ কনভেয়ার (Function Machine):* Animated conveyor gear transforming inputs $x$ into outputs $y$, with division-by-zero detection when testing $x = 2$ on rational functions.
  5. *৬০ সেকেন্ডের সেট বস ফাইট (60s Sets Boss Rush):* Rapid-fire CQ/MCQ battle with streak scoring and "সেট ও ফাংশন অধিনায়ক" badge unlock.
- **Board Master Guide:**
  - 5 Pillars: Formal NCTB definitions (Relations, Domain, Range, One-to-one), CQ breakdown, 3 model solutions ($2^n$ proof, set builder to roster, relation domain/range table), examiner traps (missing outer braces in $P(A)$, writing $\{\emptyset\}$), and 5-year board matrix.

---

## 10. Chapter 3: বীজগাণিতিক রাশি (Algebraic Expressions) Implementation

- **Route:** `/dashboard/playground/math/3`
- **Interactive Quests:**
  1. *জ্যামিতিক টাইল কাটার ও ক্ষেত্রফল ল্যাব (Geometric Tile Slicer & Expander):* Interactive SVG square partitioned into $a^2$, two $ab$, and $b^2$ tiles with sliders for $a$ and $b$, dynamically verifying $(a+b)^2 = a^2 + 2ab + b^2$.
  2. *x + 1/x সিমেট্রিক্যাল পাওয়ার মই (Power Ladder):* Step-by-step interactive ladder ascending from given seed $k$ to higher powers: $x^2 + 1/x^2 \to x^3 + 1/x^3 \to x^4 + 1/x^4 \to x^5 + 1/x^5$.
  3. *মিডল-টার্ম উৎপাদক স্প্লিটার (Middle-Term Factor Splitter):* Interactive integer dials for $p$ and $q$ satisfying $p \times q = c$ and $p + q = b$ for authentic board quadratics.
  4. *ভাগশেষ উপপাদ্য ও ভ্যানিশিং মেথড (Remainder Theorem Machine):* Dialing roots for cubic polynomial $f(x) = x^3 - x - 6$ to discover $f(2) = 0$ and reveal 3-line synthetic factoring.
  5. *৬০ সেকেন্ডের বীজগণিত বস ফাইট (60s Algebra Boss Rush):* Timed CQ/MCQ battery covering cube expansions, difference of squares, and factor roots with streak scoring and "বীজগণিত অধিনায়ক" badge unlock.
- **Board Master Guide:**
  - 5 Pillars: Formulas & corollaries vault ($4ab, 2(a^2+b^2)$, difference of two squares), CQ breakdown, 3 model solutions ($x^5 - 1/x^5$ proof, $m^3 + 2p^3 = 3mn$ identity, and factor theorem vanishing proof), examiner traps (cross-term omission in $x^5$, sign errors), and 2020–2024 board matrix.

---

## 11. Automated End-to-End Test Suites & Verification

- **Chapter 1 Verification:** `web/scripts/e2e-playground-test.mjs`
  - Automated Puppeteer flow testing login, hub, all 5 quests, Sheru companion, and Board Master Guide tabs.
  - **Result:** Passed, 0 console errors, 11 screenshots captured.
- **Chapter 2 Verification:** `web/scripts/e2e-ch2-playground-test.mjs`
  - Automated Puppeteer flow testing login, Chapter 2 quests (Venn, Power Set, De Morgan, Function Machine zero division trap, Boss battle), and all 5 Board Master pillars.
  - **Result:** Passed, 0 console errors, 13 screenshots captured.
- **Chapter 3 Verification:** `web/scripts/e2e-ch3-playground-test.mjs`
  - Automated Puppeteer flow testing login, Chapter 3 quests (Tiles, Power ladder Rung 5, Middle-term factoring, Vanishing root $f(2)=0$, Boss battle), and all 5 Board Master pillars.
  - **Result:** Passed, 0 console errors, 11 screenshots captured.
- **Chapter 4 Verification:** `web/scripts/e2e-ch4-playground-test.mjs`
  - Automated Puppeteer flow testing login, Chapter 4 quests (Paper Fold to the Moon $2^n$, Richter & Sound Decibel logarithmic compressor, Base-Exponent Power Balancer $a^x = a^y \implies x = y$, Scientific Notation & Characteristic/Mantissa Lab, Boss battle), and all 5 Board Master pillars.
  - **Result:** Passed, 0 console errors, 13 screenshots captured.
- **Playground Version 2 Verification:** `web/scripts/e2e-playground-v2-test.mjs`
  - Automated Puppeteer flow testing login, Playground Hub Version Switcher tabs, Version 2 Hub Library, Chapter 1 Dual View, Dedicated `/dashboard/playground/v2/math/1`, all 5 interactive guidebook lessons, and 4-stage Guided Path Modal.
  - **Result:** Passed, 0 console errors, 10 screenshots captured.

---

## 9. Playground Version 2: Virtual Interactive Guidebook & Safe Decommissioning Architecture

### Overview
In response to student learning feedback, **Playground Version 2: Virtual Interactive Guidebook** was engineered as an alternative, calm, pedagogical study medium prioritizing reasoning-first mastery, proof narratives, and strict NCTB Board CQ/MCQ alignment without noisy gamification timers.

### Architectural Decoupling & Safe Decommissioning Strategy
To guarantee that either **Version 1 (Quest Arena)** or **Version 2 (Virtual Guidebook)** can be promoted as the permanent product without leaving dead code or broken links:
1. **Central Feature Flag (`web/src/lib/playground-config.ts`):**
   ```ts
   export type PlaygroundMode = 'dual' | 'v1-only' | 'v2-only';
   export const PLAYGROUND_CONFIG = {
     mode: 'dual' as PlaygroundMode,
   };
   ```
2. **Zero Cross-Dependency:**
   - Version 1 code is strictly isolated inside `web/src/components/playground/` (e.g., `RealNumbersPlayground.tsx`).
   - Version 2 code is strictly isolated inside `web/src/components/playground/v2/` (`RealNumbersGuidebook.tsx`, `GuidebookLibraryView.tsx`, `GuidedPathModal.tsx`).
   - Route `/dashboard/playground` switches between the two views based on tab state and `PLAYGROUND_CONFIG.mode`.
   - Route `/dashboard/playground/math/1` utilizes `Chapter1DualView` which dynamically mounts either version with a persistent top switcher.
   - Dedicated canonical route `/dashboard/playground/v2/math/1` directly serves Version 2.
3. **Painless Future Promotion / Deletion:**
   - **If User Chooses Version 2:** Set `PLAYGROUND_CONFIG.mode = 'v2-only'`, route `/math/1` permanently serves `RealNumbersGuidebook`, and `components/playground/RealNumbersPlayground.tsx` can be deleted without side effects.
   - **If User Chooses Version 1:** Set `PLAYGROUND_CONFIG.mode = 'v1-only'` and delete folder `components/playground/v2/` and routes `/v2/`.

### Chapter 1: বাস্তব সংখ্যা (Real Numbers) Guidebook Features
- **Hardcover Book Aesthetic:** Spine accent, asymmetric border radii (`rounded-tr-3xl rounded-br-3xl rounded-tl-lg rounded-bl-lg`), study time badge (১৫ মিনিট), and 10-mark NCTB exam weight tag.
- **Sticky Chapter Rail:** `০১` through `০৫` numbered navigation, completion checkmarks, and examiner hints.
- **Lesson 01 (সংখ্যার মহাবিশ্ব):** Real Number hierarchy tree with interactive concept drawer and a live Rational vs. Irrational badge classifier ($0, \sqrt{3}, -5, 0.\dot{3}, \pi, 22/7$).
- **Lesson 02 (প্রমাণের গোয়েন্দা):** Frame-by-frame $\sqrt{2}$ detective narrative (Assumption of Rationality $\to$ Squaring $\to$ Crimson Contradiction $2q \neq p^2/q \to$ Conclusion) with an expandable *"কেন এই ধাপ?"* (Why this step?) board marking rubric breakdown.
- **Lesson 03 (আবৃত্ত দশমিক কোড):** Live 9–0 rule calculator with live step-by-step arithmetic subtraction ($\frac{245-2}{990} = \frac{27}{110}$) and amber highlights on recurring digits.
- **Lesson 04 (রেড লাইন পদ্ধতি):** Authentic NCTB place-value decimal alignment with a vertical red buffer zone explaining carry propagation.
- **Lesson 05 (ঝটপট বোর্ড কুইজ):** Authentic board retrieval questions with instant, reasoning-first feedback explaining why options are right or wrong.
- **4-Stage Guided Path Modal:** Accessible via floating button (`গাইডেড ডেমো`) providing a step-by-step tour: *Start & Orient*, *Understand Concepts*, *Hands-on Practice*, and *Board Self-Check*.

---

## 9. Playground v2: Subject-to-Chapter Hierarchy & Physics Chapter 1 & 2

### A. Subject-to-Chapter Hierarchy Architecture
Refactored `web/src/components/playground/v2/GuidebookLibraryView.tsx` into a structured two-level hierarchy:
1. **Top Subject Grid:** Cards for **Physics** (2 Live), **General Mathematics** (1 Live), **Higher Mathematics** (Coming Soon), **Chemistry** (Coming Soon), and **Biology** (Coming Soon).
2. **Subject Filter Tabs:** One-click quick toggle across subjects with active chapter counts.
3. **Chapter Drill-Down Shelf:** Shows live playable chapters and upcoming curriculum roadmaps per subject.

### B. Physics Chapter 1: ভৌত রাশি ও পরিমাপ (Physical Quantities & Measurement)
- **Live Route:** `/dashboard/playground/v2/physics/1`
- **Component:** `web/src/components/playground/v2/PhysicsMeasurementGuidebook.tsx`
- **5-Step Flow:**
  - **Step 1 (Learn Concept):** 5 lessons including interactive Vernier Calipers Simulator (slider, zero error compensation $\pm 0.2\text{ mm}$), Screw Gauge Micrometer Simulator, Relative Error & Uncertainty Lab ($E_R = \frac{\Delta M}{M} \times 100\%$).
  - **Step 2 (See Example):** Sphere volume measurement creative question with Examiner Marking Rubric drawer.
  - **Step 3 (Try Yourself):** Cylinder volume and vernier constant calculation challenges.
  - **Step 4 (Check Understanding):** 5 authentic board MCQs with detailed KaTeX solutions.
  - **Step 5 (Summary):** Master formulas sheet, instrument precision comparisons, and 1-click note copy.

### C. Physics Chapter 2: গতি (Motion)
- **Live Route:** `/dashboard/playground/v2/physics/2`
- **Component:** `web/src/components/playground/v2/PhysicsMotionGuidebook.tsx`
- **5-Step Flow:**
  - **Step 1 (Learn Concept):**
    - 5 types of motion & Reference Frame observer toggle (Train passenger vs Platform observer).
    - Curved path distance ($d$) vs displacement ($\vec{s}$) interactive canvas (NCTB Fig 2.04) & whirling stone centripetal acceleration demo (Fig 2.05).
    - 4 Equations of motion with live car simulator ($u, a, t$ sliders and live formula substitutions).
    - Galileo Free Fall Twin-Chamber (air resistance vs vacuum drop of heavy ball vs light feather) & vertical projectile launcher.
    - $v-t$ multi-phase trapezoid graph area decomposition ($s = s_1 + s_2 + s_3 = 120\text{ m}$).
  - **Step 2 (See Example):** Textbook CQ 2 (Bus and cow braking distance $s_2 = 280\text{ m} < 300\text{ m}$), cricket ball projectile, graph area solver, and tiger-deer chase with expandable Examiner Marking Rubric drawer.
  - **Step 3 (Try Yourself):** Motion equation detective, graph area calculator, and safe braking distance challenges.
  - **Step 4 (Check Understanding):** 5 authentic board MCQs with KaTeX explanations.
  - **Step 5 (Summary):** Master kinematic formulas ($s_{t\text{th}}$ included), falling bodies rules, Top 4 board traps, and 1-click note copy.

### D. Physics Chapter 3: বল (Force)
- **Live Route:** `/dashboard/playground/v2/physics/3`
- **Component:** `web/src/components/playground/v2/PhysicsForceGuidebook.tsx`
- **5-Step Flow:**
  - **Step 1 (Learn Concept):**
    - বাস যাত্রীর জড়তা সিমুলেটর (Bus Passenger Inertia Simulator): ত্বরণ ও হঠাৎ ব্রেক কষার সময় যাত্রীর সামনে-পেছনে হেলে পড়া ও জড়তার পরিমাপ হিসেবে ভর।
    - $F = ma$ ও ঘর্ষণ ত্বরণ ল্যাব: বল ($F$), ভর ($m$) ও মেঝের ঘর্ষণ ($f_k$) পরিবর্তন করে কার্যকর লব্ধি বল $F_{\text{net}} = F - f_k = ma$ এবং গাড়ি চালনা অ্যানিমেশন।
    - নিউটনের ৩য় সূত্র ও বন্দুকের পশ্চাৎবেগ সিমুলেটর: গুলির ভর ($m$, গ্রাম), বেগ ($v$, $\text{m/s}$) এবং বন্দুকের ভর ($M$, কেজি) স্লাইডার দিয়ে $V = -\frac{mv}{M}$ গণনা ও ফায়ার অ্যানিমেশন।
    - ভরবেগের সংরক্ষণশীলতা ও ২-গাড়ির দ্বিমুখী সংঘর্ষ ল্যাব: কার ও ট্রাকের ভর ও বেগ সমন্বয় করে সংঘর্ষ এবং মিলিত বেগ $V = \frac{m_1u_1 + m_2u_2}{m_1 + m_2}$ নির্ণয়।
    - ৪ প্রকার ঘর্ষণের ইন্টারঅ্যাক্টিভ অ্যানালাইজার: স্থিতি, পিছলানো, আবর্ত ও প্রবাহী ঘর্ষণ এবং ঘর্ষণ কমানো/বাড়ানোর বাস্তব উপায়।
  - **Step 2 (See Example):** পাঠ্যবই নমুনা সৃজনশীল ১ (ফারুকের বাক্স টানা ও ঘর্ষণ বল), সৃজনশীল ২ (কার ও ট্রাকের মুখোমুখি সংঘর্ষ ও মিলিত বেগ), ঢাকা বোর্ড বন্দুকের পশ্চাৎবেগ, এবং রাজশাহী বোর্ড নৌকা থেকে লাফ সাথে "পরীক্ষকের গোপন কথা" (Examiner Marking Rubric) ড্রয়ার।
  - **Step 3 (Try Yourself):** ৩টি হ্যান্ডস-অন বোর্ড চ্যালেঞ্জ ($F=ma$ লব্ধি ত্বরণ নির্ণয়কারী, বন্দুকের পশ্চাৎবেগ গণক, ২-গাড়ির সংঘর্ষ ও মিলিত বেগ গণক) উইথ ইনস্ট্যান্ট ভ্যালিডেশন।
  - **Step 4 (Check Understanding):** ৫টি অথেনটিক বোর্ড MCQ (বলের মাত্রা সমীকরণ $[MLT^{-2}]$, ভরবেগের SI একক $\text{kg}\cdot\text{ms}^{-1}$, ৫ কেজি বস্তুর ত্বরণ, সবল নিউক্লীয় বল, আবর্ত ঘর্ষণ) উইথ KaTeX ব্যাখ্যা।
### E. Physics Chapter 4: কাজ, ক্ষমতা ও শক্তি (Work, Power & Energy)
- **Live Route:** `/dashboard/playground/v2/physics/4`
- **Component:** `web/src/components/playground/v2/PhysicsWorkEnergyGuidebook.tsx`
- **5-Step Flow:**
  - **Step 1 (Learn Concept):**
    - কাজ ও বলের মধ্যবর্তী কোণ ল্যাব (Work & Vector Angle Lab): বল ($F$), সরণ ($s$) ও মধ্যবর্তী কোণ ($\theta \in [0^\circ, 180^\circ]$) পরিবর্তন করে $W = Fs \cos\theta$ এবং ধনাত্মক কাজ ($\theta < 90^\circ$), শূন্য কাজ ($\theta = 90^\circ$), ও ঋণাত্মক কাজ ($\theta > 90^\circ$) ক্লাসিফিকেশন।
    - গতিশক্তি ও কাজ-শক্তি উপপাদ্য ল্যাব: ভর ($m$) ও বেগ ($v$) স্লাইডার দিয়ে $E_k = \frac{1}{2}mv^2 = \frac{p^2}{2m}$ এবং কাজ-শক্তি উপপাদ্য ($W = \Delta E_k$) প্রমাণ।
    - স্থিতিস্থাপক বিভবশক্তি ও স্প্রিং সংকোচন ল্যাব: স্প্রিং ধ্রুবক ($k$) ও সংকোচন ($x$) সমন্বয় করে সঞ্চিত বিভবশক্তি $E_p = \frac{1}{2}kx^2$ এবং স্প্রিং কম্পন অ্যানিমেশন।
    - যান্ত্রিক শক্তির সংরক্ষণশীলতা ফ্রি-ফল টাওয়ার: পতনের মোট উচ্চতা ($H$) ও ভর ($m$) দিয়ে বল ফেলে দেওয়া, প্রতিটি বিন্দুতে $E_p = mg(H-x)$, $E_k = mgx$, এবং মোট শক্তি $E_{\text{total}} = mgH$ অপরিবর্তনশীল থাকার রিয়েল-টাইম বার চার্ট।
    - পানির পাম্প ও মোটরের কর্মদক্ষতা (%) ল্যাব: মোটরের প্রদত্ত ক্ষমতা ($P_{\text{in}}$, kW), পানির পরিমাণ ($V$, L), উচ্চতা ($h$) এবং সময় ($t$) স্লাইডার দিয়ে কার্যকর ক্ষমতা $P_{\text{out}} = \frac{mgh}{t}$ এবং কর্মদক্ষতা $\eta = \frac{P_{\text{out}}}{P_{\text{in}}} \times 100\%$ সাথে ছাদের পানির ট্যাংক ভরার ভিজ্যুয়াল অ্যানিমেশন।
  - **Step 2 (See Example):** পাঠ্যবই সৃজনশীল ১ (বালক ও যুবকের দৌড় ও ক্ষমতা তুলনা), পাঠ্যবই সৃজনশীল ২ (১ kW বনাম ২ kW পাম্পের কর্মদক্ষতা ও অপচয়কৃত শক্তি), ঢাকা বোর্ড মুক্ত পতনে $E_k = 2E_p$ শর্তে উচ্চতা ($h = \frac{1}{3}H$), এবং রাজশাহী বোর্ড চলন্ত গাড়ির ব্রেকিং দূরত্ব ও কাজ-শক্তি উপপাদ্য সাথে "পরীক্ষকের গোপন কথা" (Examiner Marking Rubric) ড্রয়ার।
  - **Step 3 (Try Yourself):** ৩টি হ্যান্ডস-অন বোর্ড চ্যালেঞ্জ (অভিকর্ষের বিরুদ্ধে কৃতকাজ গণক $W = mgh$, শক্তি সংরক্ষণ শর্ত $E_k = 2E_p$ উচ্চতা নির্ণায়ক, এবং পানির পাম্পের কর্মদক্ষতা গণক) উইথ ইনস্ট্যান্ট ভ্যালিডেশন।
  - **Step 4 (Check Understanding):** ৫টি অথেনটিক বোর্ড MCQ (কাজের মাত্রা সমীকরণ $[ML^2T^{-2}]$, সমবেগে বৃত্তাকার গতির কাজহীন বল, স্প্রিং বিভবশক্তি অনুপাত, সর্বোচ্চ বিভবশক্তি বিন্দু, ১ HP = ৭৪৬ W) উইথ KaTeX ব্যাখ্যা।
  - **Step 5 (Summary):** ডায়নামিক সূত্রাবলী চিট-শিট ($W=Fs\cos\theta, E_k=\frac{1}{2}mv^2=\frac{p^2}{2m}, E_p=mgh, E_p=\frac{1}{2}kx^2, P=\frac{W}{t}=Fv, \eta=\frac{P_{\text{out}}}{P_{\text{in}}}\times 100\%$), বোর্ড পরীক্ষার শীর্ষ ৪ মারাত্মক ভুল, এবং ১-ক্লিক নোট কপি।
  - **Embedded Socratic AI Physics Tutor:** সাইডবার চ্যাট ড্রয়ার ও ইনস্ট্যান্ট প্রশ্ন প্রম্পটস।

### F. Physics Chapter 5: পদার্থের অবস্থা ও চাপ (States of Matter & Pressure)
- **Live Route:** `/dashboard/playground/v2/physics/5`
- **Component:** `web/src/components/playground/v2/PhysicsMatterPressureGuidebook.tsx`
- **5-Step Flow:**
  - **Step 1 (Learn Concept):**
    - চাপ ও উপাদান ঘনত্ব ল্যাব (Pressure & Density Simulator): বল ($F$) ও ক্ষেত্রফল ($A$) পরিবর্তন করে চাপ ($P = F/A$), হাই-হিল বনাম হাতির পা বনাম পিন প্রিসেট, এবং ভর-আয়তন দিয়ে ঘনত্ব ($\rho = m/V$) ও পানিতে ভাসার তুলনামূলক অ্যানালাইজার।
    - তরলের অভ্যন্তরে চাপ ও গভীরতা ল্যাব: গভীরতা ($h$) ও তরলের ঘনত্ব ($\rho$) স্লাইডার দিয়ে তরলস্তম্ভের চাপ $P = h\rho g$ এবং কাস্টম তরল (কেরোসিন ৮০০, বিশুদ্ধ পানি ১০০০, সমুদ্রের লোনা পানি ১০২৫, পারদ ১৩৬০০ $\text{kg/m}^3$) নির্বাচন।
    - আর্কিমিডিসের নীতি ও প্লবতা ল্যাব: ব্লকের ঘনত্ব ও আয়তন স্লাইডার এবং তরলে নিমজ্জন অ্যানিমেশন। উর্ধ্বমুখী প্লবতা $F_B = V_{\text{sub}}\rho_{\text{liq}}g$, বাতাসে ওজন, এবং পানিতে আপাত ওজন হ্রাসের রিয়েল-টাইম ক্যালকুলেটর।
    - প্যাসকেলের হাইড্রোলিক প্রেস বল বৃদ্ধিকরণ ল্যাব: ছোট ও বড় পিস্টনের ব্যাসার্ধ ($r_1, r_2$) ও ইনপুট বল ($F_1$) পরিবর্তন, পাম্প হ্যান্ডেল অ্যানিমেশন এবং ২৫ গুণ বল বৃদ্ধিতে বড় পিস্টনে গাড়ি উত্তোলন সাথে শক্তির সংরক্ষণশীলতা ($W_1 = W_2$) প্রমাণ।
    - স্থিতিস্থাপকতা ও ইয়ং-এর গুণাঙ্ক ল্যাব: তারের উপাদান (ইস্পাত $200\text{ GPa}$, তামা $110\text{ GPa}$, কাচ $65\text{ GPa}$, হাড় $16\text{ GPa}$), আদি দৈর্ঘ্য ($L$), ব্যাস ($d$) ও ভর ($M$) সমন্বয় করে দৈর্ঘ্য প্রসারণ ($\Delta L = \frac{FL}{AY}$) এবং পীড়ন-বিকৃতি পরিমাপ।
  - **Step 2 (See Example):** পাঠ্যবই নমুনা সৃজনশীল ১ (পানিতে কাঠের ব্লকের নিমজ্জন, ঘনত্ব ও তাপমাত্রা বৃদ্ধি), পাঠ্যবই নমুনা সৃজনশীল ২ (রাবার ব্যান্ডের হুকের সূত্র ও স্প্রিং ব্যালেন্স ডিজাইন), ঢাকা বোর্ড হাইড্রোলিক প্রেস গাড়ি উত্তোলন, এবং রাজশাহী বোর্ড আর্কিমিডিসের সূত্রে সোনার মুকুটে ভেজাল শনাক্তকরণ সাথে "পরীক্ষকের গোপন কথা" (Examiner Marking Rubric) ড্রয়ার।
  - **Step 3 (Try Yourself):** ৩টি হ্যান্ডস-অন বোর্ড চ্যালেঞ্জ (তরলের গভীরতায় চাপ গণক $P = h\rho g$, হাইড্রোলিক প্রেস আউটপুট বল গণক, এবং বরফের নিমজ্জিত শতকরা হার গণক) উইথ ইনস্ট্যান্ট ভ্যালিডেশন।
  - **Step 4 (Check Understanding):** ৫টি অথেনটিক বোর্ড MCQ (ব্যারোমিটার, তরলের চাপের নির্ভরশীলতা, নিমজ্জিত অবস্থায় ভাসার শর্ত, হাইড্রোলিক প্রেসে বল বৃদ্ধি, এবং ইয়ং-এর গুণাঙ্কের একক) উইথ KaTeX ব্যাখ্যা।
  - **Step 5 (Summary):** ডায়নামিক সূত্রাবলী চিট-শিট ($P = F/A, \rho = m/V, P = h\rho g, F_B = V\rho g, F_2/F_1 = A_2/A_1, Y = \frac{FL}{A\Delta L}$), বোর্ড পরীক্ষার শীর্ষ ৪ মারাত্মক ভুল, এবং ১-ক্লিক নোট কপি।
  - **Embedded Socratic AI Physics Tutor:** সাইডবার চ্যাট ড্রয়ার ও ইনস্ট্যান্ট প্রশ্ন প্রম্পটস ("বরফ পানিতে ভাসে কেন?", "হাইড্রোলিক প্রেসে কি শক্তি তৈরি হয়?")।

---

## 15. Playground V2: Physics Chapter 6 — বস্তুর ওপর তাপের প্রভাব (Effect of Heat on Matter)

- **Curriculum Coverage (NCTB Class 9–10 Physics, pp. 159–185):**
  - **Step 1 (Learn Concept & Interactive Physics Labs):**
    - **Lab 1: তাপ, তাপমাত্রা ও স্কেল রূপান্তর:** সেলসিয়াস, ফারেনহাইট ও কেলভিন থার্মোমিটারের ত্রিমুখী সমন্বয় ($C/5 = (F-32)/9 = (K-273)/5$), সমবিন্দু ($-40^\circ$), বরফ গলনাঙ্ক, মানবদেহ ও স্ফুটনাঙ্ক কুইক প্রিসেটস, এবং আণবিক গতিশক্তি সিমুলেটর যেখানে তাপমাত্রা বৃদ্ধির সাথে সাথে অণুগুলোর কম্পন ও বেগ বৃদ্ধি পায়।
    - **Lab 2: কঠিনের তাপীয় প্রসারণ ও রেললাইন:** ধাতব উপাদানের প্রসারণ সহগ (তামা, লোহা/ইস্পাত, অ্যালুমিনিয়াম, পিতল, ইনভার), আদি দৈর্ঘ্য ($L_1$), তাপমাত্রা বৃদ্ধি ($\Delta T$) এবং রেললাইনের ফাঁক সমন্বয়। দৈর্ঘ্য প্রসারণ $\Delta L = \alpha L_1 \Delta T$, ক্ষেত্র প্রসারণ $\beta = 2\alpha$, আয়তন প্রসারণ $\gamma = 3\alpha$, এবং ফাঁক অপর্যাপ্ত হলে রেললাইন বেঁকে যাওয়ার রিয়েল-টাইম সতর্কবার্তা।
    - **Lab 3: তরলের প্রসারণ ও পানির ব্যতিক্রমী প্রসারণ:** ফ্লাস্কে তরলের প্রসারণের ৩টি পর্যায় (প্রাথমিক স্তর $A \rightarrow$ পাত্রের প্রসারণে অবনমন $B \rightarrow$ তরলের প্রসারণে চূড়ান্ত উচ্চতা $C$, যেখানে $V_r = V_a + V_g$); এবং $0^\circ\text{C}-4^\circ\text{C}$ পানির ব্যতিক্রমী প্রসারণে হিমায়িত হ্রদের বাস্তুসংস্থান (হ্রদের পৃষ্ঠে $0^\circ\text{C}$ বরফ ভাসমান, তলদেশে $4^\circ\text{C}$-এর ভারী পানিতে মাছের নিরাপদ জীবন)।
    - **Lab 4: আপেক্ষিক তাপ ও ক্যালোরিমিতির মিশ্রণ ল্যাব:** ধাতব বস্তুর উপাদান (তামা, লোহা, সীসা, রূপা, সোনা), ভর ও তাপমাত্রা নির্বাচন এবং ঠান্ডা পানিতে নিমজ্জন। বর্জিত তাপ $Q_1 = m_1 s_1 (T_1 - \theta)$ ও গৃহীত তাপ $Q_2 = m_2 s_2 (\theta - T_2)$ সাম্যাবস্থায় $Q_{\text{lost}} = Q_{\text{gained}}$ যাচাইকরণ।
    - **Lab 5: সুপ্ততাপ হিটিং কার্ভ ও প্রেশার কুকার ল্যাব:** তাপশক্তি ইনপুট স্লাইডার ($0\text{--}3200\text{ kJ}$) দিয়ে ১ কেজি বরফের ৫টি দশা পরিবর্তন (বরফ শীতলীকরণ $\rightarrow$ বরফ গলন সুপ্ততাপ $L_f = 3.36 \times 10^5\text{ J/kg} \rightarrow$ পানি উষ্ণায়ন $\rightarrow$ বাষ্পীভবন সুপ্ততাপ $L_v = 2.26 \times 10^6\text{ J/kg} \rightarrow$ অতিউত্তপ্ত বাষ্প) এবং পারিপার্শ্বিক চাপ স্লাইডার ($0.5\text{--}2.0\text{ atm}$) দ্বারা প্রেশার কুকারে স্ফুটনাঙ্ক বৃদ্ধি ($120^\circ\text{C}$) বনাম পাহাড়ের চূড়ায় স্ফুটনাঙ্ক হ্রাস ($85^\circ\text{C}$) পর্যবেক্ষণ।
  - **Step 2 (See Example):** ৪টি বোর্ড সৃজনশীল ও পরীক্ষকের গোপন মূল্যায়ন রুব্রিক:
    1. পাঠ্যবই সৃজনশীল ১ (পৃষ্ঠা ১৮৫): বৈদ্যুতিক তারের সংকোচন ও শীতকালে তার ছিঁড়ে যাওয়ার কারণ।
    2. পাঠ্যবই সৃজনশীল ২ (পৃষ্ঠা ১৮৫): ২টি ধাতব দণ্ডের দৈর্ঘ্য প্রসারণের উপাত্ত থেকে উভয় দণ্ডই তামার তৈরি কিনা তা যাচাইকরণ ($\alpha \approx 17 \times 10^{-6}\text{ K}^{-1}$)।
    3. ঢাকা বোর্ড সৃজনশীল: উত্তপ্ত তামার গোলক ও ক্যালোরিমিতির মিশ্রণে তাপীয় সাম্যাবস্থা ($23.67^\circ\text{C}$) ও শক্তির নিত্যতা।
    4. রাজশাহী বোর্ড সৃজনশীল: মিশ্রণে বরফ সম্পূর্ণ গলবে কিনা ও মিশ্রণের চূড়ান্ত তাপমাত্রা নির্ণয়।
  - **Step 3 (Try Yourself):** ৩টি হ্যান্ডস-অন বোর্ড চ্যালেঞ্জ উইথ ইনস্ট্যান্ট ভ্যালিডেশন:
    1. মানবদেহের তাপমাত্রা $38.5^\circ\text{C}$ ফারেনহাইট স্কেলে রূপান্তর ($101.3^\circ\text{F}$)।
    2. ৫০ মিটার তামার তারের তাপমাত্রা $20^\circ\text{C}$ থেকে $70^\circ\text{C}$ বৃদ্ধি পেলে দৈর্ঘ্য বৃদ্ধি ($4.18\text{ cm}$)।
    3. ৮০°C তাপমাত্রার ১ কেজি গরম পানির সাথে ২০°C তাপমাত্রার ২ কেজি ঠান্ডা পানি মেশালে মিশ্রণের তাপমাত্রা ($40^\circ\text{C}$)।
  - **Step 4 (Check Understanding):** ৫টি অথেনটিক বোর্ড MCQ (ফারেনহাইট-সেলসিয়াস সমবিন্দু $-40^\circ$, তামার দৈর্ঘ্য প্রসারণ সহগের একক $\text{K}^{-1}$, ৪°C তাপমাত্রায় পানির আয়তন সর্বনিম্ন ও ঘনত্ব সর্বোচ্চ, বরফ গলনের সুপ্ততাপ $3.36 \times 10^5\text{ J/kg}$, এবং প্রেশার কুকারে চাপ বৃদ্ধির প্রভাব) উইথ KaTeX ব্যাখ্যা।
  - **Step 5 (Summary):** ডায়নামিক সূত্রাবলী চিট-শিট ($C/5 = (F-32)/9 = (K-273)/5, \Delta L = \alpha L_1 \Delta T, \beta=2\alpha, \gamma=3\alpha, V_r = V_a + V_g, Q = ms\Delta\theta, Q = mL$), বোর্ড পরীক্ষার শীর্ষ ৪ মারাত্মক ফাঁদ (যেমন: $\Delta T$-তে ২৭৩ যোগ না করা), এবং ১-ক্লিক নোট কপি।
  - **Embedded Socratic AI Physics Tutor:** সাইডবার ড্রয়ার ও ইনস্ট্যান্ট প্রশ্ন প্রম্পটস ("রেললাইনে ফাঁক কেন থাকে?", "পানির ব্যতিক্রমী প্রসারণ কী?", "প্রেশার কুকারের নীতি কী?")।


### 16. Physics Chapter 7: তরঙ্গ ও শব্দ (Waves & Sound) — Virtual Interactive Guidebook V2 (COMPLETED)
- **Status:** 100% Implemented & Verified with 12 End-to-End Puppeteer Screenshots (0 console errors).
- **Core Syllabus Covered (NCTB Class 9–10 Physics, Chapter 7, Pages 186–209):**
  - **Lab 1: সরল স্পন্দন গতি ও পর্যায়কাল (Simple Harmonic Motion - SHM):**
    - সরল দোলক ল্যাব: দৈর্ঘ্য ($l$), ভর ($m$) ও অভিকর্ষজ ত্বরণ ($g$) পরিবর্তন করে দোলনকাল $T = 2\pi\sqrt{l/g}$ ও কম্পাঙ্ক $f = 1/T$ লাইভ পর্যবেক্ষণ; চাঁদ ($1.62\text{ m/s}^2$) ও বৃহস্পতি ($24.79\text{ m/s}^2$) গ্র্যাভিটি প্রিসেটস।
    - স্প্রিং স্পন্দন ল্যাব: স্প্রিং ধ্রুবক ($k$) ও ঝুলন্ত ভর ($m$) দিয়ে $T = 2\pi\sqrt{m/k}$ পর্যবেক্ষণ ও হুকের বল $F = -kx$ সিমুলেশন।
  - **Lab 2: তরঙ্গ সৃষ্টি ও প্রকারভেদ (Transverse & Longitudinal Waves):**
    - অনুপ্রস্থ তরঙ্গ (Transverse Wave): কম্পাঙ্ক ($f$), তরঙ্গদৈর্ঘ্য ($\lambda$) এবং বিস্তার ($A$) স্লাইডার দিয়ে তরঙ্গ বেগ $v = f\lambda$ ও পর্যায়কাল $T = 1/f$ লাইভ সাইন কার্ভে কণার উলম্ব স্পন্দন ও তরঙ্গের আনুভূমিক প্রবাহ।
    - অনুদৈর্ঘ্য তরঙ্গ (Longitudinal Wave): স্প্রিং/বাতাসে সংকোচন (Compression) ও প্রসারণ (Rarefaction) অ্যানিমেশন এবং তীব্রতা ও বিস্তারের বর্গের সমানুপাতিকতা ($I \propto A^2$)।
  - **Lab 3: বিভিন্ন মাধ্যমে শব্দের বেগ ও তাপমাত্রা ল্যাব ($v \propto \sqrt{T}$):**
    - বায়বীয়, তরল ও কঠিন মাধ্যমে শব্দের বেগ তুলনা: বাতাস ($344.8\text{ m/s}$), হাইড্রোজেন গ্যাস ($1284\text{ m/s}$), পানি ($1493\text{ m/s}$), লোহা ($5130\text{ m/s}$) এবং হীরা ($12000\text{ m/s}$)।
    - বেলজার পরীক্ষা (Bell Jar Experiment): বায়ুশূন্য (Vacuum) মোড টগল — কাচের পাত্র থেকে বাতাস বের করে দিলে শব্দ নিঃশব্দ হয়ে যায়, প্রমাণ করে শব্দ সঞ্চালনে জড় মাধ্যম অপরিহার্য।
    - তাপমাত্রার প্রভাব: $v = 330\sqrt{T/273}\text{ m/s}$ বা $v = 330 + 0.6\theta\text{ m/s}$।
  - **Lab 4: প্রতিধ্বনি ও প্রতিফলন ল্যাব ($2d = vt$):**
    - প্রতিফলক দেয়ালের দূরত্ব স্লাইডার ($5\text{--}80\text{ m}$) ও বায়ুর তাপমাত্রা স্লাইডার ($0\text{--}40^\circ\text{C}$)।
    - "তালি বাজাও / Clap" অডিও পালস অ্যানিমেশন, উৎসে ফিরে আসার সময় $t = 2d/v$ এবং মস্তিষ্কে শব্দের স্থায়িত্বকাল $0.1\text{ s}$ সাপেক্ষে প্রতিধ্বনি শোনা যাবে কি না তার রিয়েল-টাইম রায়।
  - **Lab 5: শ্রবণযোগ্যতার পাল্লা, আল্ট্রাসাউন্ড ও সোনার (SONAR):**
    - ফ্রিকোয়েন্সি স্পেকট্রাম স্লাইডার ($5\text{ Hz}\text{--}100\text{ kHz}$): ইনফ্রাসাউন্ড ($<20\text{ Hz}$, হাতি/ভূমিকম্প), শ্রাব্য শব্দ ($20\text{ Hz}\text{--}20\text{ kHz}$), এবং আল্ট্রাসাউন্ড ($>20\text{ kHz}$, বাদুড়/চিকিৎসা বিজ্ঞান)।
    - জাহাজের সোনার (SONAR) সমুদ্রের তলদেশ জরিপ সিমুলেটর: গভীরতা $h$ ও পানিতে শব্দের বেগ $v = 1493\text{ m/s}$ থেকে প্রতিফলিত সংকেতের সময় $t = 2h/v$ নির্ণয় এবং ত্রিমাত্রিক সিসমিক সার্ভে (3D Seismic Survey with Geophone)।
- **Step 2 (See Example):** ৪টি বোর্ড সৃজনশীল ও পরীক্ষকের গোপন মূল্যায়ন রুব্রিক ("পরীক্ষকের গোপন কথা"):
  1. পাঠ্যবই সৃজনশীল ২ (পৃষ্ঠা ২০৮): তরঙ্গ লেখচিত্র থেকে কম্পাঙ্ক ($85\text{ Hz}$), পর্যায়কাল ($0.012\text{ s}$) এবং $18\text{ m}$ দূরে দেয়াল থেকে প্রতিধ্বনি শোনা যাবে কি না ($t = 0.106\text{ s} > 0.1\text{ s}$)।
  2. পাঠ্যবই সৃজনশীল ৩ (পৃষ্ঠা ২০৯): সাজেকে নুসরাতের চিৎকার, শব্দের বেগ $332\text{ m/s}$, তরঙ্গদৈর্ঘ্য $\lambda = 0.25\text{ m}$ এবং $0.3\text{ s}$ পর প্রতিধ্বনি শোনার জন্য আদি অবস্থান থেকে আরও $36.2\text{ m}$ পেছনে যাওয়া।
  3. ঢাকা বোর্ড সৃজনশীল: শীতকালে ($15^\circ\text{C}$) ও গ্রীষ্মকালে ($35^\circ\text{C}$) কূপের মুখের প্রতিধ্বনির সময় তুলনা ($0.116\text{ s} < 0.12\text{ s}$)।
  4. রাজশাহী বোর্ড সৃজনশীল: জাহাজের আল্ট্রাসনিক সংকেত ($50\text{ kHz}$), পানিতে তরঙ্গদৈর্ঘ্য ($2.99\text{ cm}$) এবং $400\text{ m}$ উঁচু ডুবো পাহাড় শনাক্তকরণ ($1.264\text{ s}$)।
- **Step 3 (Try Yourself):** ৩টি হ্যান্ডস-অন বোর্ড চ্যালেঞ্জ উইথ ইনস্ট্যান্ট ভ্যালিডেশন:
  1. $512\text{ Hz}$ টিউনিং ফর্কের শব্দ তরঙ্গদৈর্ঘ্য নির্ণয় ($0.664\text{ m}$)।
  2. $30^\circ\text{C}$ তাপমাত্রায় বায়ুতে প্রতিধ্বনি শোনার ন্যূনতম দূরত্ব নির্ণয় ($17.5\text{ m}$)।
  3. $0^\circ\text{C}$-এ $332\text{ m/s}$ হলে $27^\circ\text{C}$ (300 K) তাপমাত্রায় বায়ুতে শব্দের বেগ নির্ণয় ($348\text{ m/s}$)।
- **Step 4 (Check Understanding):** ৫টি অথেনটিক বোর্ড MCQ (মস্তিষ্কে শব্দের স্থায়িত্বকাল $0.1\text{ s}$, মাধ্যমে বেগের ক্রম $v_{\text{solid}} > v_{\text{liquid}} > v_{\text{gas}}$, $0^\circ\text{C}$ তাপমাত্রায় ন্যূনতম দূরত্ব $16.6\text{ m}$, শ্রাব্য সীমার ঊর্ধ্বসীমা $20\text{ kHz}$, এবং সোনার পূর্ণরূপ Sound Navigation and Ranging) উইথ KaTeX ব্যাখ্যা।
- **Step 5 (Summary):** ডায়নামিক সূত্রাবলী চিট-শিট ($T=2\pi\sqrt{l/g}, v=f\lambda, v \propto \sqrt{T}, 2d=vt, h=vt/2$), বোর্ড পরীক্ষার শীর্ষ ৪ মারাত্মক ফাঁদ (যেমন: প্রতিধ্বনিতে ২ দিয়ে ভাগ ভুলে যাওয়া, কেলভিন স্কেল না বসানো), এবং ১-ক্লিক নোট কপি।
- **Embedded Socratic AI Physics Tutor:** সাইডবার ড্রয়ার ও ইনস্ট্যান্ট প্রশ্ন প্রম্পটস ("প্রতিধ্বনি শোনার ন্যূনতম দূরত্ব কত?", "কঠিনে শব্দের বেগ বায়ুর চেয়ে বেশি কেন?", "বাদুড় কীভাবে পথ চলে?")।

---

## 17. SheraTutor Playground V2: NCTB Class 9–10 Physics Chapter 8 (আলোর প্রতিফলন / Reflection of Light)

Following the 5-step learning architecture, Chapter 8 (আলোর প্রতিফলন / Reflection of Light) was implemented and thoroughly verified:
- **Interactive Labs (৫টি ভিজ্যুয়াল অপটিক্স ল্যাব):**
  - **Lab 1: প্রতিফলনের সূত্র ও সমতল দর্পণ ($i = r$):**
    - আলোকরশ্মির প্রতিফলন স্লাইডার ($0^\circ\text{--}80^\circ$): আপতন কোণ = প্রতিফলন কোণ ($\angle i = \angle r$)।
    - মসৃণ তল বনাম অমসৃণ/অনিয়মিত তল টগল (নিয়মিত প্রতিফলন বনাম বিক্ষিপ্ত প্রতিফলন)।
    - সমতল দর্পণে প্রতিবিম্বের বৈশিষ্ট্য: লক্ষ্যবস্তুর দূরত্ব = প্রতিবিম্বের দূরত্ব ($u = v$), অবাস্তব ও সোজা প্রতিবিম্ব, এবং পার্শ্বীয় পরিবর্তন।
    - নিজের সম্পূর্ণ প্রতিবিম্ব দেখতে ব্যক্তির উচ্চতার ঠিক অর্ধেক আকারের আয়না প্রয়োজন ($H/2$), দূরত্বের ওপর নির্ভর করে না।
  - **Lab 2: অবতল দর্পণ ও ৬টি অবস্থানের রশ্মিচিত্র (Concave Mirror 6-Position Ray Tracing):**
    - লক্ষ্যবস্তুর অবস্থান স্লাইডার ($u = 5\text{--}80\text{ cm}$) ও ৬টি প্রিসেট বাটন:
      1. অসীম দূরত্বে ($u = \infty \implies v = f$)
      2. বক্রতার কেন্দ্রের বাইরে ($u > 2f \implies f < v < 2f$)
      3. বক্রতার কেন্দ্রে ($u = 2f \implies v = 2f$, সমান ও উল্টো, $|m| = 1$)
      4. ফোকাস ও বক্রতার কেন্দ্রের মাঝে ($f < u < 2f \implies v > 2f$)
      5. প্রধান ফোকাসে ($u = f \implies v = \infty$)
      6. মেরু ও ফোকাসের মাঝে ($u < f \implies v < 0$, অবাস্তব সোজা বিবর্ধিত)
    - লাইভ জ্যামিতিক SVG রশ্মি চিত্রাঙ্কন ও গাণিতিক ফলাফল ($v, |m|$, বাস্তব/অবাস্তব, উল্টো/সোজা)।
  - **Lab 3: উত্তল দর্পণ ও বিস্তৃত দৃষ্টিক্ষেত্র (Convex Mirror & Wide Field of View):**
    - উত্তল দর্পণ ($120^\circ$ দৃষ্টিকোণ) বনাম সমতল দর্পণ ($45^\circ$ দৃষ্টিকোণ) তুলনা।
    - পেছনের গাড়ির রিয়ার-ভিউ মিরর ড্রাইভার সিমুলেটর: কেন সর্বদা খর্বিত, অবাস্তব ও সোজা প্রতিবিম্ব গঠিত হয় এবং ব্লাইন্ড স্পট দূর করে।
    - উত্তল দর্পণে ফোকাস দূরত্ব সর্বদা ঋণাত্মক ($f < 0$) হওয়ার সতর্কতা।
  - **Lab 4: দর্পণ সমীকরণ ও বিবর্ধন ক্যালকুলেটর ($\frac{1}{u} + \frac{1}{v} = \frac{1}{f}$):**
    - দর্পণ টাইপ সিলেক্টর (অবতল $f > 0$ বনাম উত্তল $f < 0$)।
    - ফোকাস দূরত্ব ($|f| = 5\text{--}50\text{ cm}$) ও লক্ষ্যবস্তুর দূরত্ব ($u = 5\text{--}80\text{ cm}$) স্লাইডার।
    - তাৎক্ষণিক সমীকরণ সমাধান: $v = \frac{uf}{u - f}$ এবং রৈখিক বিবর্ধন $m = -v/u = L'/L$ ধাপভিত্তিক সমীকরণসহ।
  - **Lab 5: বিপজ্জনক পাহাড়ি বাঁক ও বাস্তব জীবনের প্রয়োগ (Mountain Curve & Real-World Devices):**
    - ৯০° পাহাড়ি বিপজ্জনক ব্লাইন্ড টার্নে ৪৫° কোণে বসানো দর্পণ সিমুলেটর ও গাড়ির ড্রাইভ মুভমেন্ট।
    - ডেন্টিস্টের অবতল দর্পণ ($u < f$, দাঁতের অবাস্তব সোজা বিবর্ধিত প্রতিবিম্ব)।
    - সোলার কুকার (ফোকাস বিন্দুতে সমান্তরাল সৌররশ্মি ঘনীভূতকরণ) ও সার্চলাইট / হেডলাইট (ফোকাসে বাল্ব থেকে সমান্তরাল আলোক রশ্মি তৈরি)।
- **Step 2 (See Example):** ৪টি বোর্ড সৃজনশীল ও পরীক্ষকের গোপন মূল্যায়ন রুব্রিক ("পরীক্ষকের গোপন কথা"):
  1. পাঠ্যবই সৃজনশীল ৩ (পৃষ্ঠা ২৪০): অবতল দর্পণ ($r = 30\text{ cm}, f = 15\text{ cm}$) ও $5\text{ cm}$ পিনের অবস্থান ($u_1 = 12.5\text{ cm} \implies v_1 = -75\text{ cm}, m_1 = 6$) থেকে $4\text{ cm}$ দূরে সরালে ($u_2 = 16.5\text{ cm} \implies v_2 = 165\text{ cm}, m_2 = 10$) বিবর্ধন বৃদ্ধি ও সদ রূপান্তর।
  2. ঢাকা বোর্ড সৃজনশীল: অবতল দর্পণ ($f = 15\text{ cm}$), বস্তুর অবস্থান $20\text{ cm}$ হলে প্রতিবিম্ব $60\text{ cm}$ বাস্তব; আর $10\text{ cm}$ হলে প্রতিবিম্ব $-30\text{ cm}$ অবাস্তব ও বিবর্ধিত।
  3. রাজশাহী বোর্ড সৃজনশীল: গাড়ির লুকিং গ্লাস ($r = -4\text{ m}, f = -2\text{ m}$), $6\text{ m}$ পেছনে ট্রাকের প্রতিবিম্ব দর্পণের পেছনে $1.5\text{ m}$ দূরে এবং সমতল দর্পণের চেয়ে উত্তল দর্পণ ব্যবহারের যৌক্তিকতা।
  4. চট্টগ্রাম বোর্ড সৃজনশীল: বক্রতার কেন্দ্রে ($u = 2f = 40\text{ cm}$) বস্তু রাখলে $v = 40\text{ cm}$ ও বিবর্ধন $|m| = 1$ এবং ফোকাসে ($u = f$) বস্তু রাখলে অসীমে প্রতিবিম্ব গঠন।
- **Step 3 (Try Yourself):** ৩টি হ্যান্ডস-অন বোর্ড চ্যালেঞ্জ উইথ ইনস্ট্যান্ট ভ্যালিডেশন ($f = 20\text{ cm}, v = 30\text{ cm}, v = -6\text{ cm}$)।
- **Step 4 (Check Understanding):** ৫টি অথেনটিক বোর্ড MCQ (সমতল দর্পণে পূর্ণ প্রতিবিম্বের জন্য উচ্চতা $H/2$, উত্তল দর্পণে প্রতিবিম্বের বৈশিষ্ট্য, পাহাড়ি বাঁকে দর্পণের কোণ $45^\circ$, বক্রতার ব্যাসার্ধ ও ফোকাস দূরত্ব সম্পর্ক $f = r/2$, এবং বিবর্ধন $m = -v/u$) উইথ KaTeX ব্যাখ্যা।
- **Step 5 (Summary):** ডায়নামিক সূত্রাবলী চিট-শিট ($i = r, r = 2f, \frac{1}{u} + \frac{1}{v} = \frac{1}{f}, m = -v/u, \text{Height} = H/2$), বোর্ড পরীক্ষার শীর্ষ ৪ মারাত্মক ফাঁদ (যেমন: উত্তল দর্পণে $f$-এ ঋণাত্মক চিহ্ন না দেওয়া, দূরত্বের মান মাইনাস রেখে দেওয়া), এবং ১-ক্লিক নোট কপি।
- **Embedded Socratic AI Physics Tutor:** সাইডবার ড্রয়ার ও ইনস্ট্যান্ট প্রশ্ন প্রম্পটস ("গাড়িতে উত্তল আয়না কেন ব্যবহার হয়?", "ডেন্টিস্টরা কেন অবতল আয়না ব্যবহার করেন?", "পাহাড়ি বাঁকের আয়না কীভাবে কাজ করে?")।

---

## 18. SheraTutor Playground V2: NCTB Class 9–10 Physics Chapter 9 (আলোর প্রতিসরণ / Refraction of Light)

Following the 5-step learning architecture, Chapter 9 (আলোর প্রতিসরণ / Refraction of Light) was implemented and thoroughly verified:
- **Interactive Labs (৫টি ভিজ্যুয়াল অপটিক্স ল্যাব):**
  - **Lab 1: স্নেলের সূত্র ও প্রতিসরণাঙ্ক ল্যাব ($n_1 \sin\theta_1 = n_2 \sin\theta_2$):**
    - মাধ্যম ১ ও ২ নির্বাচন (বায়ু $n=1.00$, পানি $n=1.33$, কাচ $n=1.52$, হীরা $n=2.42$)।
    - আপতন কোণ স্লাইডার ($0^\circ\text{--}85^\circ$), প্রতিসরণ কোণ $\theta_2$ লাইভ সমাধান, এবং মাধ্যমে আলোর বেগ ($v = c/n$) প্রদর্শন।
    - মুদ্রা ও আপাত গভীরতা সিমুলেটর টগল ($h' = h \cdot n_1/n_2$), যা ব্যাখ্যা করে কেন পানির ভেতরের মুদ্রা উপরে উঠে এসেছে মনে হয়।
  - **Lab 2: সংকট কোণ ও পূর্ণ অভ্যন্তরীণ প্রতিফলন চেম্বার (Critical Angle & TIR):**
    - ঘন মাধ্যম নির্বাচন (কাচ $\theta_c = 41.1^\circ$, পানি $48.8^\circ$, হীরা $24.4^\circ$, ফাইবার কোর $75.2^\circ$)।
    - ৩টি অবস্থা: সাধারণ প্রতিসরণ ($\theta < \theta_c$), ক্রান্তি কোণ বা বিভেদতল ঘেঁষে ৯০° প্রতিসরণ ($\theta = \theta_c$), এবং ১০০% প্রতিফলন বা TIR ($\theta > \theta_c$)।
    - পূর্ণ অভ্যন্তরীণ প্রতিফলনের ২টি আবশ্যিক শর্ত (ঘন থেকে হালকা মাধ্যমে গমন, এবং আপতন কোণ সংকট কোণের চেয়ে বড় হওয়া)।
  - **Lab 3: অপটিক্যাল ফাইবার, মরীচিকা ও প্রিজম (Optical Fiber, Mirage & Prism):**
    - অপটিক্যাল ফাইবার সিমুলেটর: কোর ($n=1.50$) ও ক্ল্যাডিং ($n=1.45$) এর মধ্যে জিকজ্যাক পূর্ণ অভ্যন্তরীণ প্রতিফলনে ১০০ কিমি+ সিগন্যাল সঞ্চালন ও ইনফ্রারেড রশ্মির গুরুত্ব।
    - মরুভূমির মরীচিকা: ৩ স্তরের বাতাসের তাপমাত্রা ও প্রতিসরণাঙ্কের পার্থক্যে আলো বেঁকে গিয়ে খেজুর গাছের উল্টো প্রতিবিম্ব তৈরির মাধ্যমে পানির দৃষ্টিবিভ্রম।
    - কাচ প্রিজমে বিচ্ছুরণ: সাদা আলো প্রিজমে প্রতিসরিত হয়ে তরঙ্গদৈর্ঘ্যভিত্তিক প্রতিসরণাঙ্কের কারণে ৭টি বর্ণে (বেনীআসহকলা / VIBGYOR) বিভক্ত হওয়া।
  - **Lab 4: উত্তল ও অবতল লেন্সের রশ্মিচিত্র (Convex & Concave Lens Ray Tracing):**
    - উত্তল লেন্স (অভিসারী) বনাম অবতল লেন্স (অপসারী) টগল।
    - লক্ষ্যবস্তুর দূরত্ব $u$ ($5\text{--}70\text{ cm}$) ও ফোকাস দূরত্ব $f$ ($10\text{--}35\text{ cm}$) স্লাইডার।
    - উত্তল লেন্সের ৬টি পজিশন প্রিসেট ($u > 2f$, $u = 2f$ সদ সমান উল্টো $|m|=1$, $f < u < 2f$ বিবর্ধিত সদ, $u = f$ অসীম, $u < f$ আতশিকাচ বা ম্যাগনিফাইং গ্লাস)।
    - লাইভ জ্যামিতিক SVG রশ্মিচিত্র ($O, F_1, F_2, 2F_1, 2F_2$, সমান্তরাল রশ্মি ও কেন্দ্রগামী রশ্মি, $v$ ও $m$ ক্যালকুলেশন)।
  - **Lab 5: লেন্স সমীকরণ, ক্ষমতা ও চোখের দৃষ্টিত্রুটি (Lens Power & Eye Defect Corrections):**
    - অক্ষিগোলক, রেটিনা ও কর্নিয়া মডেল।
    - দৃষ্টিত্রুটি সিমুলেটর: স্বাভাবিক দৃষ্টি, ক্ষীণদৃষ্টি (Myopia - রেটিনার সামনে ফোকাস), এবং দূরদৃষ্টি (Hypermetropia - রেটিনার পেছনে ফোকাস)।
    - চশমা সংশোধন: অবতল লেন্স (-D) দিয়ে ক্ষীণদৃষ্টি প্রতিকার এবং উত্তল লেন্স (+D) দিয়ে দূরদৃষ্টি প্রতিকার।
    - লেন্সের ক্ষমতা ক্যালকুলেটর: $P = 1/f\text{ (m)} = 100/f\text{ (cm)}$ ডায়াপ্টার (D)।
- **Step 2 (See Example):** ৪টি বোর্ড সৃজনশীল ও পরীক্ষকের গোপন মূল্যায়ন রুব্রিক ("পরীক্ষকের গোপন কথা"):
  1. পাঠ্যবই সৃজনশীল ১ (পৃষ্ঠা ২৬৯): শিউলীর চশমার ক্ষমতা $-2\text{ D}$, ফোকাস দূরত্ব $f = -50\text{ cm}$, এবং $1\text{ m}$ দূরের বস্তুর প্রতিবিম্ব $v = -33.33\text{ cm}$ (অবাস্তব সোজা খর্বিত)।
  2. পাঠ্যবই অনুশীলনী ১ (পৃষ্ঠা ২৬৭): কাচের ক্রান্তি কোণ ৬৫° থেকে তরলের ফোঁটা যোগে ৭৫° হওয়ায় তরলের প্রতিসরণাঙ্ক $n = 1.066$ নির্ণয়।
  3. ঢাকা বোর্ড সৃজনশীল: পানিতে বেগ $2.26 \times 10^8\text{ m/s}$ ও কাচে $2.0 \times 10^8\text{ m/s}$, কাচ-পানি ক্রান্তি কোণ ৬২.৪৬° এবং ৬০° কোণে আপতিত হলে TIR না ঘটার গাণিতিক প্রমাণ।
  4. রাজশাহী বোর্ড সৃজনশীল: উত্তল লেন্সে $f = 15\text{ cm}$, বস্তু $u = 10\text{ cm}$ হলে প্রতিবিম্ব $v = -30\text{ cm}, m = +3$ এবং আতশিকাচ হিসেবে প্রয়োগ।
- **Step 3 (Try Yourself):** ৩টি হ্যান্ডস-অন বোর্ড চ্যালেঞ্জ উইথ ইনস্ট্যান্ট ভ্যালিডেশন ($n = 1.33, \theta_c = 75^\circ, P = +2\text{ D}$)।
- **Step 4 (Check Understanding):** ৫টি অথেনটিক বোর্ড MCQ (সংকট কোণে প্রতিসরণ কোণ ৯০°, অপটিক্যাল ফাইবারে পূর্ণ অভ্যন্তরীণ প্রতিফলন, $u=2f$-এ বিবর্ধন $|m|=1$, $-2.5\text{ D}$ লেন্সের ফোকাস দূরত্ব $-0.4\text{ m}$, এবং দূরদৃষ্টিতে উত্তল লেন্স) উইথ KaTeX ব্যাখ্যা।
- **Step 5 (Summary):** ডায়নামিক সূত্রাবলী চিট-শিট ($n=c/v, n_1 \sin\theta_1 = n_2 \sin\theta_2, \sin\theta_c = n_1/n_2, \frac{1}{u}+\frac{1}{v}=\frac{1}{f}, P = 1/f$), বোর্ড পরীক্ষার শীর্ষ ৪ মারাত্মক ফাঁদ (যেমন: $f$ মিটারে রূপান্তর না করা, অবতল লেন্সে মাইনাস চিহ্ন ভুলে যাওয়া), এবং ১-ক্লিক নোট কপি।
- **Embedded Socratic AI Physics Tutor:** সাইডবার ড্রয়ার ও ইনস্ট্যান্ট প্রশ্ন প্রম্পটস ("পূর্ণ অভ্যন্তরীণ প্রতিফলনের দুটি শর্ত কী?", "অপটিক্যাল ফাইবার কীভাবে কাজ করে?", "চশমার পাওয়ার প্লাস বা মাইনাস হওয়ার অর্থ কী?")।

---

---

## 19. Physics Chapter 10: স্থির তড়িৎ (Static Electricity) Guidebook Implementation

Built, deployed, and 100% verified the comprehensive interactive guidebook for NCTB Class 9–10 Physics Chapter 10: স্থির তড়িৎ (`/dashboard/playground/v2/physics/10`).

- **Architecture:** 5-step learning workflow (`[ 1 Learn Concept ] [ 2 See Example ] [ 3 Try Yourself ] [ 4 Check Understanding ] [ 5 Summary ]`).
- **Step 1 (Learn Concept) — 5 Specialized Interactive Labs:**
  1. **ঘর্ষণে স্থির বিদ্যুৎ ও ইলেকট্রন স্থানান্তর ল্যাব:** Triboelectric friction simulator across 3 pairs (কাচ + রেশম, চিরুনি + পশম, বেলুন + পশম) with dynamic rub slider, animated flying electrons ($e^-$), relative humidity toggle (dry winter 20% RH vs monsoon 95% RH demonstrating moisture leakage), and paper scraps attraction test.
  2. **স্বর্ণপাত তড়িৎবীক্ষণ যন্ত্র ও আবেশ ল্যাব:** Full SVG gold-leaf electroscope with brass disc, insulating cork, brass rod, diverging gold leaves ($\theta = 0^\circ \text{--} 65^\circ$), earth grounding toggle, charge rod slider, and 4-step electrostatic induction wizard (Step 1: Bring Rod $\rightarrow$ Step 2: Earthing $\rightarrow$ Step 3: Disconnect Earthing $\rightarrow$ Step 4: Remove Rod leaving permanent opposite charge).
  3. **কুলম্বের বল ও দূরত্বের প্রভাব ল্যাব:** Coulomb's inverse square law collider ($F = k \frac{q_1 q_2}{r^2}$) with charge sliders ($q_1, q_2$), distance slider ($r = 0.1\text{--}2.0\text{ m}$), dielectric medium selector (vacuum $k=9\times 10^9$, glass $\kappa=5$, water $\kappa=80$), mutual equal-and-opposite force vectors ($\vec{F}_{12}, \vec{F}_{21}$ satisfying Newton's 3rd Law), attraction vs repulsion indicator, and textbook presets.
  4. **তড়িৎ ক্ষেত্র ও বলরেখা সিমুলেটর:** Electric field intensity $E = k \frac{Q}{r^2}$ with 5 polarity presets (dipole $+/-$, like charges $+/+$, textbook $+4\text{ C}/-1\text{ C}$, isolated positive/negative), draggable/slider test charge probe ($q_0 = +1\text{ C}$) calculating resultant $\vec{E}_{\text{net}}$, and exact null point ($E_{\text{net}} = 0$) position solver.
  5. **তড়িৎ বিভব, ধারক ও বজ্রপাত ল্যাব:** 3 sub-modes:
     - Parallel Plate Capacitor ($C = \frac{\varepsilon A}{d}$, $Q=CV$, $U = \frac{1}{2}CV^2$) with area, distance, voltage sliders, and dielectric selector (air vs mica $\kappa=6$).
     - Electric Potential & Charge Flow (Sphere A 24V/6C vs Sphere B 10V/9C with animated connecting wire demonstrating potential difference, not total charge, dictates current direction).
     - Cloud-to-ground lightning discharge simulator with building model, sharp copper lightning rod (action of points), earthing wire, and Faraday cage automobile safety explanation.
- **Step 2 (See Example):** 4 worked board CQs with Examiner Secret Marking Rubrics ("পরীক্ষকের গোপন কথা"):
  1. পাঠ্যবই পৃষ্ঠা ২৮১: $+5\text{ C}$ ও $+3\text{ C}$ আধান $1\text{ m}$ ব্যবধানে কুলম্বের বল $F = 1.35 \times 10^{11}\text{ N}$ এবং নিরপেক্ষ বিন্দু $x = 0.565\text{ m}$ নির্ণয়।
  2. পাঠ্যবই সৃজনশীল ১ (পৃষ্ঠা ২৯৭): চুল ও চিরুনির ঘর্ষণে ঋণাত্মক আধান এবং স্বর্ণপাত তড়িৎবীক্ষণ যন্ত্রের সাহায্যে আধানের প্রকৃতি নির্ণয়।
  3. ঢাকা বোর্ড সৃজনশীল: বিপরীত আধানের সংযোগ রেখার মধ্যবিন্দুতে বিভব শূন্য ($V = 0\text{ V}$) কিন্তু প্রাবল্য অশূন্য ($E = 5.76 \times 10^6\text{ N/C} \neq 0$) গাণিতিক বিশ্লেষণ।
  4. রাজশাহী ও চট্টগ্রাম বোর্ড সৃজনশীল: ধারকে সঞ্চিত শক্তি $U = \frac{1}{2} C V^2 = 1.21\text{ J}$ এবং তেলবাহী ট্রাকে ভূমিসংযুক্ত শিকল ব্যবহারের বৈজ্ঞানিক কারণ।
- **Step 3 (Try Yourself):** ৩টি হ্যান্ডস-অন চ্যালেঞ্জ উইথ ইনস্ট্যান্ট ভ্যালিডেশন ($F = 1.8 \times 10^{10}\text{ N}, E = 18000\text{ N/C}, U = 0.2\text{ J}$)।
- **Step 4 (Check Understanding):** ৫টি অথেনটিক বোর্ড MCQ (কাচ-রেশম ঘর্ষণে কাচ ধনাত্মক, স্বর্ণপাত ফাঁকা হ্রাস-বৃদ্ধি, দূরত্বের বর্গের ব্যস্তানুপাত $F/4$, বিভব পার্থক্য আধান প্রবাহ নির্ধারণ করে, এবং ধারকে পরাবৈদ্যুতিক মাধ্যমে ধারকত্ব বৃদ্ধি) উইথ KaTeX ব্যাখ্যা।
- **Step 5 (Summary):** ডায়নামিক সূত্রাবলী চিট-শিট ($F = k \frac{q_1 q_2}{r^2}, E = \frac{F}{q} = k \frac{Q}{r^2}, V = \frac{W}{q} = k \frac{Q}{r}, C = \frac{Q}{V} = \frac{\varepsilon A}{d}, U = \frac{1}{2} C V^2$), ৪টি মারাত্মক পরীক্ষক ফাঁদ, এবং ১-ক্লিক নোট কপি।
- **Embedded Socratic AI Physics Tutor:** সাইডবার ড্রয়ার ও ইনস্ট্যান্ট প্রশ্ন প্রম্পটস ("কুলম্বের সূত্রে দূরত্বের বর্গের ব্যস্তানুপাত নীতি কী?", "তড়িৎ প্রাবল্য ও বিভবের মৌলিক পার্থক্য কী?", "বজ্রপাতের সময় গাড়ির ভেতর থাকা নিরাপদ কেন?")।

---

## 20. Physics Chapter 11: চল তড়িৎ (Current Electricity) Guidebook Implementation

Built, deployed, and 100% verified the comprehensive interactive guidebook for NCTB Class 9–10 Physics Chapter 11: চল তড়িৎ (`/dashboard/playground/v2/physics/11`).

- **Architecture:** 5-step learning workflow (`[ 1 Learn Concept ] [ 2 See Example ] [ 3 Try Yourself ] [ 4 Check Understanding ] [ 5 Summary ]`).
- **Step 1 (Learn Concept) — 5 Specialized Interactive Labs:**
  1. **ওহমের সূত্র ও রোধক ল্যাব (Ohm's Law & Circuit Lab):** $V = IR$, $I = V/R$, live SVG circuit diagram with animated drifting electrons whose speed scales with current, dynamic ammeter and voltmeter needles, polarity inverter toggle, and interactive Ohm's Triangle ($V, I, R$) tooltips.
  2. **আপেক্ষিক রোধ ও তারের জ্যামিতি ল্যাব (Resistivity & Wire Geometry Lab):** $R = \rho \frac{L}{A}$, dynamic 3D cylinder SVG rendering wire length and circular cross-section, temperature slider ($0^\circ\text{C}$ to $100^\circ\text{C}$), metal vs semiconductor (Silicon) negative temperature coefficient comparison, and 5 material presets (রুপা, তামা, টাংস্টেন, নাইক্রোম, সিলিকন).
  3. **শ্রেণি ও সমান্তরাল বর্তনী সিমুলেটর (Series & Parallel Circuits Lab):** 2 dynamic sub-modes:
     - Series vs Parallel circuit configuration with equal/different resistor toggles, equivalent resistance $R_{\text{eq}}$, ammeters, voltmeters, and broken bulb fault injection (শ্রেণি বর্তনীতে একটি বাল্ব নষ্ট হলে সব বন্ধ, সমান্তরাল বর্তনীতে অন্য বাল্ব অক্ষুণ্ণ থাকে).
     - Cell Internal Resistance & Lost Volts simulator ($E = V + Ir$, $v = Ir$, $V = E - Ir$) with live electromotive force and terminal potential drops.
  4. **তড়িৎ ক্ষমতা ও বিদ্যুৎ বিল ক্যালকুলেটর (Power, Energy & Grid Transmission Lab):** 2 dynamic sub-modes:
     - Household Multi-Appliance Electricity Bill Calculator ($W = Pt / 1000$ BOT unit/kWh) with live monthly cost calculation in BDT at selectable tariff rates across bulbs, fans, refrigerators, TVs, and air conditioners.
     - High-Voltage Grid Transmission Loss Simulator ($P_{\text{loss}} = I^2 R$) showing transmission from power plant to city, comparing low voltage ($220\text{ V}$) resulting in heavy transmission losses ($100\%$ grid failure) vs stepped-up grid transmission ($132\text{ kV}$) cutting loss down to $2.9\text{ W}$ ($99.99\%$ efficiency).
  5. **গৃহস্থালি নিরাপদ বর্তনী ও শর্ট-সার্কিট ল্যাব (Household Safety & Wiring Lab):** 2 dynamic sub-modes:
     - NCTB Figure 11.17 Household Wiring Flow (Meter $\rightarrow$ Main Switch $\rightarrow$ Fuse/MCB $\rightarrow$ Parallel Appliances), live vs neutral switch risk comparison, and 3-pin earth grounding chassis leakage protection against electrocution.
     - Bird on Single Wire vs Bat Mystery (NCTB Exercise Q5): Demonstrates why a bird sitting on a single $11\text{ kV}$ wire with both feet suffers zero potential difference ($\Delta V = 0\text{ V}, I = 0\text{ A}$) and remains unharmed, while a bat touching two phase wires simultaneously experiences full $400\text{ V}$ potential drop causing fatal electrocution.
- **Step 2 (See Example):** 3 worked board CQs with Examiner Secret Marking Rubrics ("পরীক্ষকের গোপন কথা"):
  1. পাঠ্যবই পৃষ্ঠা ৩১২: একই দৈর্ঘ্যের তামার তার ও নাইক্রোম তারের হিটার কুণ্ডলী তৈরি এবং নাইক্রোম তারে তাপ ও রোধের আধিক্য বিশ্লেষণ।
  2. পাঠ্যবই সৃজনশীল ১ (পৃষ্ঠা ৩২৭): আলভী ও আলিফের বাসার বিদ্যুৎ ব্যবহারের মাসিক বিওটি ইউনিট ও বিদ্যুৎ বিলের গাণিতিক তুলনা।
  3. ঢাকা বোর্ড মিশ্র বর্তনী সৃজনশীল: শ্রেণিতে $R_1$ এবং সমান্তরালে $R_2, R_3$ যুক্ত মিশ্র বর্তনীর তুল্য রোধ $R_{\text{eq}}$, মূল প্রবাহ $I$, এবং প্রতিটি রোধের বিভব পতন ও ক্ষমতা।
- **Step 3 (Try Yourself):** ৩টি হ্যান্ডস-অন চ্যালেঞ্জ উইথ ইনস্ট্যান্ট ভ্যালিডেশন ($I = 4\text{ A}, R_{\text{eq}} = 1.0\ \Omega, W = 30\text{ kWh}$)।
- **Step 4 (Check Understanding):** ৫টি অথেনটিক বোর্ড MCQ (দৈর্ঘ্য দ্বিগুণ করলে রোধ দ্বিগুণ, সমান্তরাল সমবায়ে তুল্য রোধ ক্ষুদ্রতম রোধ অপেক্ষা কম, ফিউজ তার শ্রেণিতে সংযোগ, পাখির দুই পায়ে বিভব পার্থক্য শূন্য, উচ্চ ভোল্টেজে বিদ্যুৎ সঞ্চালনে $I^2 R$ অপচয় হ্রাস) উইথ KaTeX ব্যাখ্যা।
- **Step 5 (Summary):** ডায়নামিক সূত্রাবলী চিট-শিট ($I = \frac{Q}{t}, V = IR, R = \rho \frac{L}{A}, R_s = \sum R, \frac{1}{R_p} = \sum \frac{1}{R}, P = VI = I^2 R = \frac{V^2}{R}, W = Pt$), ৪টি মারাত্মক পরীক্ষক ফাঁদ, এবং ১-ক্লিক নোট কপি।
- **Embedded Socratic AI Physics Tutor:** সাইডবার ড্রয়ার ও ইনস্ট্যান্ট প্রশ্ন প্রম্পটস ("উচ্চ ভোল্টেজে বিদ্যুৎ সঞ্চালন করলে অপচয় কমে কেন?", "পাখি হাই-ভোল্টেজ তারে বসে থাকলে শক খায় না কেন?", "ফিউজ সবসময় লাইভ তারে শ্রেণিতে লাগাতে হয় কেন?")।

---

## 21. Physics Chapter 12: বিদ্যুতের চৌম্বক ক্রিয়া (Magnetic Effects of Current) Guidebook Implementation

Built, deployed, and 100% verified the comprehensive interactive guidebook for NCTB Class 9–10 Physics Chapter 12: বিদ্যুতের চৌম্বক ক্রিয়া (`/dashboard/playground/v2/physics/12`).

- **Architecture:** 5-step learning workflow (`[ 1 Learn Concept ] [ 2 See Example ] [ 3 Try Yourself ] [ 4 Check Understanding ] [ 5 Summary ]`).
- **Step 1 (Learn Concept) — 5 Specialized Interactive Labs:**
  1. **ওয়েরস্টেডের পরীক্ষা ও ডান হাতের বুড়ো আঙুল নিয়ম (Oersted Experiment & Right-Hand Thumb Rule):** $B = \frac{\mu_0 |I|}{2\pi r}$, live SVG straight copper wire piercing plane, concentric circular magnetic field lines with directional curling arrows, compass needle with dynamic deflection angle ($\theta = \arctan(B / B_E)$), above vs below wire placement, and polarity reversal East/West deflection indicator.
  2. **সলিনয়েড ও তাড়িতচুম্বক ডোমেইন ল্যাব (Solenoid & Electromagnet Magnetic Domains):** $B = \mu_r \mu_0 \frac{N}{L} I$, turns slider ($N = 5\text{--}50$), current slider ($I = 0\text{--}10\text{ A}$), core material selector (বাতাস $\mu_r=1$, নরম লোহা $\mu_r=1200$, ইস্পাত $\mu_r=150$), microscopic magnetic domain arrows aligning into parallel saturation, and nail attraction test with instant demagnetization upon power cut for soft iron.
  3. **ডিসি মোটর ও ফ্লেমিং-এর বাম হস্ত নিয়ম (DC Motor & Fleming's Left-Hand Rule):** $F = BIL \sin\theta, \tau = BIA \sin\theta$, permanent horseshoe magnet pole shoes (Red North, Blue South), rotating armature coil with live angular position tracking, split-ring commutator & carbon brushes, Fleming's left hand 3-finger guide, and fault-injection toggle disabling commutator causing motor to stall at $90^\circ$ neutral plane.
  4. **তাড়িতচৌম্বক আবেশ, লেঞ্জের নিয়ম ও এসি জেনারেটর (Electromagnetic Induction & AC Generator):** 2 dynamic sub-modes:
     - Mode A (Faraday Coil & Bar Magnet): Solenoid coil ($N = 50\text{--}500$), draggable bar magnet with velocity controls, center-zero Galvanometer needle deflection ($\mathcal{E} = -N \frac{d\Phi}{dt}$), and Lenz's Law visualizer demonstrating repulsive opposing pole formation upon entry and attractive pole upon withdrawal.
     - Mode B (AC / DC Generator): Rotating coil inside magnetic field generating smooth sinusoidal AC wave on live oscilloscope screen ($\mathcal{E}(t) = \mathcal{E}_0 \sin(\omega t)$) with slip rings vs split-ring commutator toggle.
  5. **ট্রান্সফরমার সিমুলেটর ও পাওয়ার গ্রিড ল্যাব (Transformer & Power Grid Transmission):** 2 dynamic sub-modes:
     - Mode A (Dual-Coil Core Transformer & DC Trap): Laminated soft iron core with Primary and Secondary windings ($V_s / V_p = n_s / n_p = I_p / I_s$), Step-Up vs Step-Down status, and textbook fatal DC Battery Trap warning ($d\Phi/dt = 0 \implies V_s = 0\text{ V}$).
     - Mode B (National Grid High-Voltage Transmission): Power plant ($100\text{ kW}$) and transmission line resistance ($5\ \Omega$), comparing raw unstepped $220\text{ V}$ transmission ($1,033\text{ kW}$ loss causing $100\%$ grid collapse) vs stepped-up $132\text{ kV}$ grid transmission cutting heat loss down to $2.87\text{ W}$ ($99.99\%$ efficiency).
- **Step 2 (See Example):** 3 worked board CQs with Examiner Secret Marking Rubrics ("পরীক্ষকের গোপন কথা"):
  1. পাঠ্যবই পৃষ্ঠা ৩৪১-৩৪২ ও ঢাকা বোর্ড: ট্রান্সফরমার রূপান্তর ($V_s = 120\text{ V}, I_s = 0.1\text{ A}$) এবং ডিসি ব্যাটারি যুক্ত করলে ফ্লাক্স পরিবর্তন শূন্য হওয়ায় $V_s = 0\text{ V}$ এর বৈজ্ঞানিক ব্যাখ্যা।
  2. পাঠ্যবই চিত্র ১২.১১ ও রাজশাহী বোর্ড: ডিসি মোটরে ফ্লেমিং-এর বাম হস্ত নিয়ম এবং অবিচ্ছিন্ন স্লিপ-রিং ব্যবহার করলে প্রতি অর্ধ-ঘূর্ণনে কারেন্ট না উল্টে সাম্যাবস্থায় আটকে যাওয়ার কারণ।
  3. পাঠ্যবই পৃষ্ঠা ৩৪১ ও চট্টগ্রাম বোর্ড: বিদ্যুৎ কেন্দ্রে $200\text{ kW}$ বিদ্যুৎ $132\text{ kV}$ এ স্টেপ-আপ করায় লাইন কারেন্ট $1.515\text{ A}$ এবং অপচয় $8.26\text{ MW}$ থেকে কমে মাত্র $22.95\text{ W}$ এ নেমে আসার গাণিতিক প্রমাণ।
- **Step 3 (Try Yourself):** ৩টি হ্যান্ডস-অন চ্যালেঞ্জ উইথ ইনস্ট্যান্ট ভ্যালিডেশন ($V_s = 200\text{ V}, I_s = 10\text{ A}, n = 500\text{ turns/m}$)।
- **Step 4 (Check Understanding):** ৫টি অথেনটিক বোর্ড MCQ (সলিনয়েডে ক্ষেত্র ঘনীভূত ও শক্তিশালী, আবেশে কাজ করে ট্রান্সফরমার, ডিসিতে গৌণ ভোল্টেজ ০ V, মোটরে কমিউটেটরের একমুখী ঘূর্ণন ভূমিকা, গ্রিডে $I^2 R$ তাপীয় অপচয় হ্রাস) উইথ KaTeX ব্যাখ্যা।
- **Step 5 (Summary):** ডায়নামিক সূত্রাবলী চিট-শিট ($V_p/V_s = n_p/n_s = I_s/I_p, P_p = P_s, P_{\text{loss}} = I^2 R, F = BIL\sin\theta, B = \mu_r \mu_0 n I, \mathcal{E} = -N d\Phi/dt$), ৪টি মারাত্মক পরীক্ষক ফাঁদ, এবং ১-ক্লিক নোট কপি।
- **Embedded Socratic AI Physics Tutor:** সাইডবার ড্রয়ার ও ইনস্ট্যান্ট প্রশ্ন প্রম্পটস ("ট্রান্সফরমার ডিসিতে কাজ করে না কেন?", "মোটরে কমিউটেটর না থাকলে কী হতো?", "উচ্চ ভোল্টেজে বিদ্যুৎ সঞ্চালন করলে কেন অপচয় কমে?", "লেঞ্জের নিয়ম কীভাবে শক্তির নিত্যতা মানে?")।

---

## 19. General Mathematics Chapter 2 (সেট ও ফাংশন / Sets & Functions) V2 Guidebook Implementation

### Highlights & Architecture
- **Dedicated Route:** `/dashboard/playground/v2/math/2`
- **Component:** `MathSetsFunctionsGuidebook.tsx` (2,100+ LOC)
- **NCTB Alignment:** Class 9–10 General Mathematics Chapter 2 (Sets & Functions)
- **Step 1 (Learn Concept):** 5 dedicated interactive sub-labs:
  1. **সেট প্রকাশের পদ্ধতি ও প্রকারভেদ ল্যাব (Set Notations & Types):** Roster vs Set-builder notation generator, preset conditions (even, perfect squares, primes, factors of 24, multiples of 5), upper limit slider $N$, dynamic element listing with $n(A)$ card badges, and cards for finite, infinite, empty ($\emptyset$), and universal ($U$) sets.
  2. **ভেনচিত্র ও সেট অপারেশন ল্যাব (Venn Diagram & Operations):** Universal set $U = \{1, \dots, 10\}$, dynamic set operations ($A \cup B$, $A \cap B$, $A \setminus B$, $B \setminus A$, $A'$, $B'$), live proof verification of De Morgan's 1st & 2nd Laws ($(A \cup B)' = A' \cap B'$ and $(A \cap B)' = A' \cup B'$), and Disjoint Mode toggle ($A \cap B = \emptyset$) visually splitting circles.
  3. **শক্তি সেট ও উপসেট সিমুলেটর (Power Set & $2^n$ Subsets):** Configurator for $n = 0, 1, 2, 3, 4$, dynamic generator for all $2^n$ subsets, distinction between proper subsets ($2^n - 1$) and improper subset (the set itself), and examiner empty set power set trap $P(\emptyset) = \{\emptyset\}$ with $2^0 = 1$ element.
  4. **কার্তেসীয় গুণজ ও অন্বয় ল্যাব (Cartesian Product & Relations):** $A \times B$ grid with $3 \times 3 = 9$ ordered pairs, condition filters ($R_1: y = x + 1, R_2: x < y, R_3: y = 2x, R_4: x \ge y$), dynamic extraction of $\operatorname{Dom}(R)$ and $\operatorname{Range}(R)$, and SVG Bipartite Arrow Graph with dashed connectors.
  5. **ফাংশন, ডোমেন ও রেঞ্জ মেশিন (Function Machine & Visualizer):** Mother-Child analogy explaining why unique image per domain element is required, linear, quadratic ($x^2 - 4x + 3$), and rational ($\frac{2x+1}{2x-1}$) functions, slider inputs, step-by-step arithmetic substitution engine, and one-to-one function tests.
- **Step 2 (See Example):** 3 worked board CQs with Examiner Secret Marking Rubrics ("পরীক্ষকের গোপন কথা"):
  1. ঢাকা ও রাজশাহী বোর্ড: $U$, $A$ (মৌলিক), $B$ (বিজোড়), $C = \{2, 3, 5\}$ দিয়ে দ্য মরগানের ১ম সূত্র প্রমাণ এবং $P(C)$ উপাদান সংখ্যা $2^n$ সমর্থন।
  2. চট্টগ্রাম ও দিনাজপুর বোর্ড: $A \times B$, অন্বয় $R = \{(x, y) : y = 2x\}$, $\operatorname{Dom}(R)$, $\operatorname{Range}(R)$ এবং অন্বয়টি ফাংশন কিনা ব্যাখ্যা।
  3. কুমিল্লা ও সিলেট বোর্ড: $f(x) = \frac{2x+1}{2x-1}$ থেকে $\frac{f(1/x)+1}{f(1/x)-1} = \frac{2}{x}$ সরলীকরণ এবং $g(-2) = 0$ এর জন্য ধ্রুবক $k$ নির্ণয়।
- **Step 3 (Try Yourself):** ৩টি হ্যান্ডস-অন চ্যালেঞ্জ উইথ ইনস্ট্যান্ট ভ্যালিডেশন ($P(A)$ প্রকৃত উপসেট সংখ্যা $15$, কার্তেসীয় গুণজ উপাদান সংখ্যা $6$, $f(3) = 4$)।
- **Step 4 (Check Understanding):** ৫টি অথেনটিক বোর্ড MCQ (নিশ্ছেদ সেট, $2^n - 1$ প্রকৃত উপসেট, ক্রমজোড় সমতা, ভগ্নাংশ ফাংশন মান, ফাংশন শর্ত) উইথ KaTeX ব্যাখ্যা।
- **Step 5 (Summary):** ডায়নামিক সূত্রাবলী চিট-শিট ($n(P(A)) = 2^n, (A \cup B)' = A' \cap B', (A \cap B)' = A' \cup B', n(A \times B) = n(A) \cdot n(B), A \cap B = \emptyset, f(x_1) = f(x_2) \implies x_1 = x_2$), ৪টি মারাত্মক পরীক্ষক ফাঁদ, এবং ১-ক্লিক নোট কপি।
- **Embedded Socratic AI Mathematics Tutor:** সাইডবার ড্রয়ার ও ইনস্ট্যান্ট প্রশ্ন প্রম্পটস ("দ্য মরগানের সূত্রের সহজ ব্যাখ্যা কী?", "ফাঁকা সেট ∅ এবং {∅} এর পার্থক্য কী?", "অন্বয় আর ফাংশনের মূল পার্থক্য কী?", "P(A) এর উপাদান সংখ্যা 2ⁿ উপপাদ্য কীভাবে লিখবো?")।

---

## 21. General Mathematics Chapter 3 (বীজগাণিতিক রাশি / Algebraic Expressions) — Version 2 Implementation

- **Live Route:** `/dashboard/playground/v2/math/3`
- **Component:** `MathAlgebraicExpressionsGuidebook.tsx` (1,930+ LOC)
- **5-Step Calm Discovery & Deep Logic Workflow:**
  - **Step 1 (Learn Concept — 5 Sub-Labs):**
    1. *জ্যামিতিক টাইলস ও বর্গ-ঘন সম্প্রসারণ ল্যাব:* $(a+b)^2$, $(a-b)^2$, $(a+b)(a-b)$, $(a+b+c)^2$, $(a+b)^3$ সূত্র নির্বাচন, $a, b$ স্লাইডার ও চতুর্ভুজ টাইলস ($a^2, ab, ab, b^2$) ক্ষেত্রফল ভিজ্যুয়ালাইজার।
    2. *প্রতিসম $x \pm 1/x$ পাওয়ার সিঁড়ি ল্যাব:* $x+1/x=\sqrt{5}$, $x+1/x=3$, $x-1/x=4$, এবং শীর্ষ বোর্ড ট্র্যাপ $x+1/x=\sqrt{3}$ (যেখানে $x^3+1/x^3=0 \implies x^6=-1$); ৬টি ধাপে সিঁড়ির মতো আরোহণ ও লাইভ মান গণনা ($x^5 \pm 1/x^5$ প্রমাণ)।
    3. *মিডল-টার্ম ও উৎপাদক স্প্লিটার ল্যাব:* $x^2+5x+6$, $x^2-7x+12$, $x^2+x-20$, $x^2-2x-15$, $2x^2+9x+10$ এর জন্য $p, q$ নির্বাচন, $p+q=b$ ও $pq=ac$ শর্ত ব্যাজ এবং ধাপে ধাপে উৎপাদক রূপান্তর।
    4. *ভাগশেষ উপপাদ্য ও ভ্যানিশিং মেথড ল্যাব:* বহুপদী $f(x)=x^3-7x-6$ ইত্যাদিতে $x=a$ বসিয়ে $f(a)=0$ যাচাই, সবুজ গ্লোয়িং বীকন এবং এনসিটিবি ৩-লাইন ভ্যানিশিং কৌশল উন্মোচন।
    5. *চক্র-ক্রমিক ও প্রতিসম রাশি ল্যাব:* $a \to b \to c \to a$ বৃত্তাকার আবর্তন হুইল এবং $a+b+c=0 \implies a^3+b^3+c^3=3abc$ এর লাইভ সমতা যাচাই।
  - **Step 2 (See Example):** ৩টি অথেনটিক বোর্ড CQ (ঢাকা, রাজশাহী, কুমিল্লা, চট্টগ্রাম, যশোর, দিনাজপুর) উইথ পরীক্ষকের নম্বর বণ্টন রুব্রিক ও ১-ক্লিক কপি।
  - **Step 3 (Try Yourself):** ৩টি ইন্টারেক্টিভ বীজগাণিতিক চ্যালেঞ্জ ($a^3+b^3=9$, $x^2+1/x^2=18$, $x^3+1/x^3=0$) উইথ রিয়েল-টাইম যাচাই ও KaTeX ব্যাখ্যা।
  - **Step 4 (Check Understanding):** ৫টি বোর্ড স্ট্যান্ডার্ড MCQ উইথ অপশন চিপস, লাইভ স্কোরিং ও ব্যাখ্যা।
### 20. General Mathematics Chapter 4: সূচক ও লগারিদম (Exponents & Logarithms) Virtual Guidebook Implementation

- **Route:** `/dashboard/playground/v2/math/4` (Page: `web/src/app/dashboard/playground/v2/math/4/page.tsx`).
- **Guidebook Component:** `web/src/components/playground/v2/MathExponentsLogarithmsGuidebook.tsx` (2,570+ LOC).
- **Core Educational Systems Implemented:**
  - **Step 1 (Learn Concept):** 5 Interactive Labs:
    1. *সূচকের মৌলিক নিয়মাবলি ও ঘাত স্কেল ল্যাব (Laws of Indices & Exponent Power Scale):* $a \in [2, 3, 5, 10]$ base selector, $n \in [-4, 4]$ slider, $a^0 = 1$ ($a \neq 0$) zero-power alert, $a^{-n} = 1/a^n$ division ladder visualizer, 5 NCTB fundamental index laws cards, and fractional exponent radicals explorer ($a^{m/n} = \sqrt[n]{a^m}$).
    2. *লগারিদমের রূপান্তর তুলাদণ্ড ল্যাব (Logarithm Definition & Balance Machine):* Two-way converter ($a^x = N \iff x = \log_a N$), two-pan physical balance beam, and domain safety sentinel exposing base $a=1$ and negative/zero $N \le 0$ traps.
    3. *লগের গুণ, ভাগ ও ভিত্তি পরিবর্তন ল্যাব (Laws of Logarithms & Change of Base):* Live breakdown of $\log_a(MN) = \log_a M + \log_a N$, $\log_a(M/N) = \log_a M - \log_a N$, change of base $\log_a b = \frac{\log_k b}{\log_k a}$, and side-by-side numerical comparison proving fatal trap $\log(M+N) \neq \log M + \log N$.
    4. *সূচকীয় সমীকরণ সমাধানকারী ল্যাব (Exponential Equations Solver):* Animated solvers for 4 classic board models ($4^x = 8$, $2^{x+7} = 4^{x+2}$, $(\sqrt{3})^{x+1} = (\sqrt[3]{3})^{2x-1}$, and quadratic substitution $2^{2x+1} - 9 \cdot 2^x + 4 = 0$).
    5. *বৈজ্ঞানিক রূপ, পূর্ণক ও অংশক ল্যাব (Scientific Notation, Characteristic & Mantissa):* Real-time scientific notation converter ($N = A \times 10^n$), characteristic integer / bar notation ($\bar{k}$), non-negative mantissa guarantee ($0 \le m < 1$), and negative logarithm mantissa trap analyzer ($\log N = -2.4621 \implies \bar{3}.5379$).
  - **Step 2 (See Example):** 3 Master Board CQs with marking rubrics, Examiner Tips & Secrets:
    - CQ 1 (Dhaka & Chittagong Board): Complex exponential cyclic simplification ($P=x^a, Q=x^b, R=x^c$).
    - CQ 2 (Rajshahi & Comilla Board): Logarithmic equation and identity proofs ($\log_{10} \frac{x+y}{3} = \frac{1}{2}(\log x + \log y) \implies \frac{x}{y} + \frac{y}{x} = 7$).
    - CQ 3 (Jessore & Dinajpur Board): Fractional power log simplification ($M \div \log_k 1.2 = 3/2$) and exponential equation solving.
  - **Step 3 (Try Yourself):** 3 Numeric calculation challenges ($2^{x+4} = 32 \implies 1$, $\log_4 2 = 0.5$, $5^0 + 5^{-1} = 1.2$) with instant feedback and green success badges.
  - **Step 4 (Check Understanding):** 5 Board MCQs with full KaTeX explanations.
  - **Step 5 (Summary):** 6 Comprehensive formula cards, 4 fatal examiner traps ($a^0=1$ without $a\ne 0$, $\log(M+N)=\log M+\log N$, negative logarithm, negative mantissa trap), 1-click note copy, and Sheru Socratic AI Companion drawer.
- **Library View Integration:** `web/src/components/playground/v2/GuidebookLibraryView.tsx` updated with `activeCount: 4` for General Math, Chapter 4 live card, and total 16 live chapters.
- **E2E Test Execution:** `web/scripts/e2e-math-ch4-complete.mjs` executed with **0 console errors** and 19 sequential visual snapshots captured and verified.

---

## Key Files Created & Modified

### Components & App Routes:
- `web/src/lib/playground-config.ts`: Central feature flag for dual / v1-only / v2-only mode.
- `web/src/app/dashboard/playground/page.tsx`: Playground Hub with version switcher tabs (`🎮 সংস্করণ ১` vs `📖 সংস্করণ ২`).
- `web/src/app/dashboard/playground/v2/page.tsx`: Dedicated Version 2 Guidebook library hub.
- `web/src/app/dashboard/playground/v2/math/1/page.tsx`: Dedicated General Math Chapter 1 Guidebook route.
- `web/src/app/dashboard/playground/v2/math/2/page.tsx`: Dedicated General Math Chapter 2 Guidebook route.
- `web/src/app/dashboard/playground/v2/math/3/page.tsx`: Dedicated General Math Chapter 3 Guidebook route.
- `web/src/app/dashboard/playground/v2/math/4/page.tsx`: Dedicated General Math Chapter 4 Guidebook route.
- `web/src/app/dashboard/playground/v2/math/5/page.tsx`: Dedicated General Math Chapter 5 Guidebook route.
- `web/src/components/playground/v2/RealNumbersGuidebook.tsx`: Chapter 1 General Math Guidebook.
- `web/src/components/playground/v2/MathSetsFunctionsGuidebook.tsx`: Chapter 2 General Math Guidebook.
- `web/src/components/playground/v2/MathAlgebraicExpressionsGuidebook.tsx`: Chapter 3 General Math Guidebook.
- `web/src/components/playground/v2/MathExponentsLogarithmsGuidebook.tsx`: Chapter 4 General Math Guidebook.
- `web/src/components/playground/v2/MathEquationsOneVariableGuidebook.tsx`: Chapter 5 General Math Guidebook.
- `web/src/app/dashboard/playground/v2/physics/1/page.tsx`: Dedicated Physics Chapter 1 Guidebook route.
- `web/src/app/dashboard/playground/v2/physics/2/page.tsx`: Dedicated Physics Chapter 2 Guidebook route.
- `web/src/app/dashboard/playground/v2/physics/3/page.tsx`: Dedicated Physics Chapter 3 Guidebook route.
- `web/src/app/dashboard/playground/v2/physics/4/page.tsx`: Dedicated Physics Chapter 4 Guidebook route.
- `web/src/app/dashboard/playground/v2/physics/5/page.tsx`: Dedicated Physics Chapter 5 Guidebook route.
- `web/src/app/dashboard/playground/v2/physics/6/page.tsx`: Dedicated Physics Chapter 6 Guidebook route.
- `web/src/app/dashboard/playground/v2/physics/7/page.tsx`: Dedicated Physics Chapter 7 Guidebook route.
- `web/src/app/dashboard/playground/v2/physics/8/page.tsx`: Dedicated Physics Chapter 8 Guidebook route.
- `web/src/app/dashboard/playground/v2/physics/9/page.tsx`: Dedicated Physics Chapter 9 Guidebook route.
- `web/src/app/dashboard/playground/v2/physics/10/page.tsx`: Dedicated Physics Chapter 10 Guidebook route.
- `web/src/app/dashboard/playground/v2/physics/11/page.tsx`: Dedicated Physics Chapter 11 Guidebook route.
- `web/src/app/dashboard/playground/v2/physics/12/page.tsx`: Dedicated Physics Chapter 12 Guidebook route.
- `web/src/components/playground/v2/PhysicsMeasurementGuidebook.tsx`: Chapter 1 Physics Guidebook.
- `web/src/components/playground/v2/PhysicsMotionGuidebook.tsx`: Chapter 2 Physics Guidebook.
- `web/src/components/playground/v2/PhysicsForceGuidebook.tsx`: Chapter 3 Physics Guidebook.
- `web/src/components/playground/v2/PhysicsWorkEnergyGuidebook.tsx`: Chapter 4 Physics Guidebook.
- `web/src/components/playground/v2/PhysicsMatterPressureGuidebook.tsx`: Chapter 5 Physics Guidebook.
- `web/src/components/playground/v2/PhysicsHeatMatterGuidebook.tsx`: Chapter 6 Physics Guidebook.
- `web/src/components/playground/v2/PhysicsWavesSoundGuidebook.tsx`: Chapter 7 Physics Guidebook.
- `web/src/components/playground/v2/PhysicsLightReflectionGuidebook.tsx`: Chapter 8 Physics Guidebook.
- `web/src/components/playground/v2/PhysicsLightRefractionGuidebook.tsx`: Chapter 9 Physics Guidebook.
- `web/src/components/playground/v2/PhysicsStaticElectricityGuidebook.tsx`: Chapter 10 Physics Guidebook.
- `web/src/components/playground/v2/PhysicsCurrentElectricityGuidebook.tsx`: Chapter 11 Physics Guidebook.
- `web/src/components/playground/v2/PhysicsMagneticEffectsGuidebook.tsx`: Chapter 12 Physics Guidebook.
- `web/src/app/dashboard/playground/v2/math/6/page.tsx`: Dedicated Math Chapter 6 Guidebook route.
- `web/src/components/playground/v2/MathLinesAnglesTrianglesGuidebook.tsx`: Chapter 6 Math Guidebook (Lines, Angles & Triangles).
- `web/src/app/dashboard/playground/v2/math/7/page.tsx`: Dedicated Math Chapter 7 Guidebook route.
- `web/src/components/playground/v2/MathPracticalGeometryGuidebook.tsx`: Chapter 7 Math Guidebook (Practical Geometry).
-`web/src/app/dashboard/playground/v2/math/8/page.tsx`: Dedicated Math Chapter 8 Guidebook route.
- `web/src/components/playground/v2/MathCircleGuidebook.tsx`: Chapter 8 Math Guidebook (Circle).
- `web/src/app/dashboard/playground/v2/math/9/page.tsx`: Dedicated Math Chapter 9 Guidebook route.
- `web/src/components/playground/v2/MathTrigonometryGuidebook.tsx`: Chapter 9 Math Guidebook (Trigonometric Ratios).
- `web/src/components/playground/v2/GuidebookLibraryView.tsx`: Subject-to-chapter hierarchy library view (Physics activeCount: 12, Math activeCount: 9, total live chapters: 21).

### Test Automation Scripts:
- `web/scripts/e2e-math-ch9-complete.mjs`: E2E suite for General Math Chapter 9 (20 sequential screenshots verified, 0 errors).
- `web/scripts/e2e-math-ch8-complete.mjs`: E2E suite for General Math Chapter 8 (20 sequential screenshots verified, 0 errors).
- `web/scripts/e2e-math-ch7-complete.mjs`: E2E suite for General Math Chapter 7 (20 sequential screenshots verified, 0 errors).
- `web/scripts/e2e-math-ch6-complete.mjs`: E2E suite for General Math Chapter 6 (19 sequential screenshots verified, 0 errors).
- `web/scripts/e2e-math-ch5-complete.mjs`: E2E suite for General Math Chapter 5 (19 sequential screenshots verified, 0 errors).
- `web/scripts/e2e-math-ch4-complete.mjs`: E2E suite for General Math Chapter 4 (19 sequential screenshots verified, 0 errors).
- `web/scripts/e2e-math-ch3-complete.mjs`: E2E suite for General Math Chapter 3 (19 sequential screenshots verified, 0 errors).
- `web/scripts/e2e-math-ch2-complete.mjs`: E2E suite for General Math Chapter 2 (19 sequential screenshots verified, 0 errors).
- `web/scripts/e2e-physics-v2-complete.mjs`: E2E suite for Physics Chapter 1.
- `web/scripts/e2e-physics-ch2-complete.mjs`: E2E suite for Physics Chapter 2.
- `web/scripts/e2e-physics-ch3-complete.mjs`: E2E suite for Physics Chapter 3.
- `web/scripts/e2e-physics-ch4-complete.mjs`: E2E suite for Physics Chapter 4.
- `web/scripts/e2e-physics-ch5-complete.mjs`: E2E suite for Physics Chapter 5.
- `web/scripts/e2e-physics-ch6-complete.mjs`: E2E suite for Physics Chapter 6.
- `web/scripts/e2e-physics-ch7-complete.mjs`: E2E suite for Physics Chapter 7.
- `web/scripts/e2e-physics-ch8-complete.mjs`: E2E suite for Physics Chapter 8.
- `web/scripts/e2e-physics-ch9-complete.mjs`: E2E suite for Physics Chapter 9.
- `web/scripts/e2e-physics-ch10-complete.mjs`: E2E suite for Physics Chapter 10.
- `web/scripts/e2e-physics-ch11-complete.mjs`: E2E suite for Physics Chapter 11.
- `web/scripts/e2e-physics-ch12-complete.mjs`: E2E suite for Physics Chapter 12.
- `web/scripts/e2e-subjects-hierarchy.mjs`: E2E test for subject hierarchy navigation.






