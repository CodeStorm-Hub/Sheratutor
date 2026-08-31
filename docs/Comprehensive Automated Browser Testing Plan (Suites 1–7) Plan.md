# Comprehensive Automated Browser Testing Plan (Suites 1–7)
## Integrated with `next-dev-loop`, `next-devtools` MCP & `chrome-devtools` MCP

Execute an end-to-end, dual-layer automated testing workflow against the local Next.js development server on `http://localhost:3001` using the authenticated test account (`syed.salman.reza.181@gmail.com`).

---

## 🛠️ Integrated Skills & MCP Tooling Architecture

1. **`next-dev-loop`**:
   - Standardized Inspect $\rightarrow$ Compile $\rightarrow$ Verify development loop.
   - Pre-compiles target routes on-demand via `compile_route` before browser navigation to ensure warm caches and detect compilation errors immediately.
   - Checks runtime log output and hydration status after every route transition.

2. **`next-devtools` MCP Bridge**:
   - `nextjs_index` & `nextjs_call` connected to the running dev server on port `3001`.
   - **`get_errors`**: Live query of active runtime exceptions and hydration mismatches.
   - **`get_compilation_issues`**: Verification of bundler/Turbopack issues across the module graph.
   - **`compile_route`**: On-demand route warmup.
   - **`get_routes`**: App Router path validation.

3. **`chrome-devtools` MCP**:
   - Headless/live browser automation: `new_page`, `navigate_page`, `click`, `fill_form`, `type_text`, `upload_file`, `evaluate_script`, `take_screenshot`, `list_console_messages`, `list_network_requests`.

4. **Performance & Caching Skills (`next-partial-prefetching-adoption` & `next-cache-components-optimizer`)**:
   - Verifies instant App Shell navigation (`◐ Partial Prerender`) and PPR cache hits during tab switching.

---

## 🧪 Comprehensive Test Suites & Verification Steps

### Suite 1: Authentication, Session & App Shell
- **DevTools Pre-warm**: `compile_route({ routeSpecifier: "/login" })` & `compile_route({ routeSpecifier: "/dashboard" })`.
- **Browser Actions**:
  1. Navigate to `/login`.
  2. Fill email `syed.salman.reza.181@gmail.com` and password `123qweasd`.
  3. Submit login $\rightarrow$ verify redirect to `/dashboard`.
- **Next-Dev-Loop Verification**:
  - `get_errors` to ensure zero session establishment errors.
  - Verify `sb-access-token` session cookie in browser storage.
  - Direct navigation to `/dashboard/exams` and `/dashboard/practice` to verify persistent session & instant App Shell rendering.

---

### Suite 2: AI Tutor & Multimodal Learning (`/dashboard/tutor`)
- **DevTools Pre-warm**: `compile_route({ routeSpecifier: "/dashboard/tutor" })`.
- **Browser Actions**:
  1. Select Subject: **Higher Mathematics (উচ্চতর গণিত)**.
  2. Send bilingual query:
     > *"প্রমাণ করো যে, $\tan^{-1}(1/2) + \tan^{-1}(1/3) = \pi/4$ ধাপগুলো বিস্তারিত বুঝিয়ে দাও। "*
  3. Verify streaming token responses, typing indicators, and KaTeX math formatting ($\tan^{-1}$, fractions, $\pi$).
  4. Follow-up multi-turn prompt and test thread creation/switching in the history sidebar.
- **Next-Dev-Loop Verification**:
  - Inspect network stream chunk integrity (`list_network_requests`).
  - `get_errors` to check for React streaming / Suspense de-opts.

---

### Suite 3: Exam Submission & Vision OCR (`/dashboard/upload` & `/dashboard/exams`)
- **DevTools Pre-warm**: `compile_route({ routeSpecifier: "/dashboard/upload" })` & `compile_route({ routeSpecifier: "/dashboard/exams" })`.
- **Browser Actions**:
  1. Navigate to `/dashboard/upload`.
  2. Select Subject (*Physics 1st Paper*) and Topic (*Dynamics / গতিবিদ্যা*).
  3. Attach test exam image file via `upload_file`.
  4. Submit upload $\rightarrow$ verify Supabase Storage upload and redirect to `/dashboard/exams`.
  5. Inspect exam submission card, marks breakdown, and rubric annotations.
- **Next-Dev-Loop Verification**:
  - Verify Server Action execution via `list_network_requests`.
  - Check `get_compilation_issues` for image optimizer warnings.

---

### Suite 4: Practice Generator & Interactive Quiz (`/dashboard/practice`)
- **DevTools Pre-warm**: `compile_route({ routeSpecifier: "/dashboard/practice" })`.
- **Browser Actions**:
  1. Configure quiz: Class 10/HSC, Subject (*Chemistry*), Chapter (*Periodic Table*), Count (*5 MCQs*).
  2. Click **"Generate Practice Set"** (triggers `actions/generate-paper.ts`).
  3. Interactively select MCQ options and submit answers.
  4. Verify instant score computation ($x/5$), explanation reveals, and automatic logging of incorrect answers.
- **Next-Dev-Loop Verification**:
  - Check Server Action invocation and database mutation.
  - `get_errors` to verify zero client state synchronization errors.

---

### Suite 5: Mistakes Logbook ("Khata") & Remediation (`/dashboard/mistakes`)
- **DevTools Pre-warm**: `compile_route({ routeSpecifier: "/dashboard/mistakes" })`.
- **Browser Actions**:
  1. Navigate to `/dashboard/mistakes`.
  2. Filter by Subject (*Chemistry*) and Error Tag (*Misconception*).
  3. Expand mistake items to review side-by-side student vs standard answer rubrics.
  4. Click **"Practice Similar Questions"** and verify dynamic drill generation.
- **Next-Dev-Loop Verification**:
  - Verify dynamic query execution beneath Suspense boundary.
  - `get_errors` to ensure zero hydration mismatches on timestamp/badge rendering.

---

### Suite 6: Analytics & AI Study Plan (`/dashboard/analytics` & `/dashboard/plan`)
- **DevTools Pre-warm**: `compile_route({ routeSpecifier: "/dashboard/analytics" })` & `compile_route({ routeSpecifier: "/dashboard/plan" })`.
- **Browser Actions**:
  1. Navigate to `/dashboard/analytics` $\rightarrow$ inspect Recharts/SVG graphs (accuracy by subject, weekly study hours, topic mastery).
  2. Navigate to `/dashboard/plan` $\rightarrow$ generate 4-week milestone schedule; toggle task checkboxes and verify persistent state.
- **Next-Dev-Loop Verification**:
  - `list_console_messages` for SVG/Canvas rendering errors.
  - `get_errors` for client component mount warnings.

---

### Suite 7: Localization, Theme & End-to-End Health Audit
- **Browser Actions**:
  1. Toggle `LanguageToggle` between **বাংলা (BN)** and **English (EN)** across all routes; verify UI label translations.
  2. Toggle `ThemeToggle` between Dark and Light mode; verify CSS variables update without flash.
- **Next-Dev-Loop & Next-DevTools Full System Audit**:
  - Call `get_compilation_issues` across the entire module graph.
  - Call `get_errors` to confirm `configErrors: []` and `sessionErrors: []`.
  - Capture visual screenshots and compile audit results.

---

## Verification Plan

### Automated Next-Dev-Loop MCP Calls:
```bash
nextjs_call(port="3001", toolName="get_compilation_issues")
nextjs_call(port="3001", toolName="get_errors")
nextjs_call(port="3001", toolName="get_routes")
```

### End-of-Run Deliverables:
- Live test execution across all 7 suites.
- Verified DOM snapshots and screenshots.
- Complete execution summary documented in `walkthrough.md`.
