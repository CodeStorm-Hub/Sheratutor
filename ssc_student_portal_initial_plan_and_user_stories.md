# SheraTutor — Initial Intended Plan & Complete User Stories Specification for the SSC Students Web Portal

> **Document Type:** Product Architecture & Requirements Specification (Original Design Baseline)  
> **Target Audience:** Secondary School Certificate (SSC / Grade 10) Science, Humanities, and Business Studies Students in Bangladesh  
> **Source Documents Synthesized:**  
> - `SheraTutor_Software_Requirements_Specification.md` (IEEE Std 830-1998 / ISO 29148 Baseline)  
> - `docs/SheraTutor_Full_Project_Documentation.md`  
> - `docs/research-idea/01-project-overview.md` through `05-business-model.md`  
> - `docs/content/architecture/developer-handoff-guide.mdx`  
> - `docs/review/SSC_Phase_Technical_Review.md` / `docs/quality/ssc-technical-review.md`  
> - `docs/quality/codebase-gap-analysis.md`  
> - `web/PRODUCT.md` & `web/DESIGN.md`  

---

## Executive Summary & Historical Context

The initial intended plan for **SheraTutor** was not conceived as a generic SaaS AI wrapper or simple chatbot. It was architected as **"Bangladesh's First AI Board Examiner & Super Teacher"**—a nationwide educational equalizer engineered to bridge the severe divide between classroom instruction and the unforgiving grading standards of Bangladesh's 11 Education Boards.

### The Operational Drivers (2025–2026 Data)
1. **The SSC Exam Crisis:** Annually, approximately **1.93 million students** sit for the SSC national exams across 11 boards (Dhaka, Rajshahi, Comilla, Jessore, Chittagong, Barisal, Sylhet, Dinajpur, Mymensingh, Madrasah, and Technical Boards). Pass rates fluctuate unpredictably (dropping to 68.45% in recent cohorts), with the sharpest fail rates concentrated in General Mathematics, Higher Mathematics, Physics, and Chemistry.
2. **The "Khata" (খাতা) Reality:** 100% of Bangladeshi board exams are written by hand on paper scripts known as *Khata*. Students spend hundreds of hours practicing Creative Questions (CQ / সৃজনশীল প্রশ্ন). Yet, when they practice at home or in school, they receive either a single subjective red-pen score (e.g., "6/10") or no feedback at all. They never learn *which specific step* cost them marks.
3. **The Coaching Inequality:** Wealthy families in urban hubs (Dhaka, Chittagong) spend tens of thousands of Taka on private tutors and commercial coaching centers (e.g., Udvash, UCC, Retina). Rural and lower-income students are left with no access to high-caliber diagnostic evaluation.
4. **The Founding Mandate:** SheraTutor's student-facing B2C portal was planned to be **100% free forever**—no subscription paywalls, no trial limits, and no degraded "free tier" quality. It is funded sustainably by selling assessment and grading infrastructure to B2B institutions (schools, coaching centers, and government bodies).

---

## 1. Initial Intended System Architecture for the SSC Portal

### 1.1 Scope & Curriculum Coverage
- **Target Grade:** Grade 10 (Secondary School Certificate / SSC candidates).
- **Initial Vertical Focus:** SSC Science core:
  - **Physics (পদার্থবিজ্ঞান)** — Bangla & English versions
  - **Chemistry (রসায়ন)** — Bangla & English versions
  - **Higher Mathematics (উচ্চতর গণিত)** — Bangla & English versions
  - **General Mathematics (সাধারণ গণিত)** — Bangla & English versions
- **Full Planned Horizon:** 33 SSC curriculum subjects across both Bangla and English media (66 textbooks total).

### 1.2 The 4-Layer Hybrid AI Evaluation Engine
The heart of the intended SSC portal was designed as a sequential, decoupled 4-layer pipeline:
1. **Layer 1: Multimodal Vision & Handwritten OCR:**
   - Transcribes messy handwritten student scripts in both Bengali and English.
   - Converts equations into LaTeX and chemical reactions into standardized notation.
   - **Anti-Overcorrection Safeguard:** Unlike conventional OCR (which silently repairs misspellings and arithmetic errors), the grading vision model is strictly constrained to transcribe errors *verbatim* so that student mistakes are faithfully preserved for grading.
2. **Layer 2: RAG Curriculum Grounding:**
   - Vector semantic search against indexed NCTB textbooks and official Board marking schemes.
   - Ensures that 100% of facts, formulas, and definitions evaluated are grounded strictly in the authentic Bangladeshi textbook syllabus.
3. **Layer 3: Bengali Pedagogical Reasoning:**
   - Evaluates the student's reasoning chain against the step-by-step logic expected by senior national board examiners.
4. **Layer 4: Rubric Evaluator (JSON Schema Enforcer):**
   - Enforces a deterministic JSON output detailing marks awarded for each NCTB CQ tier:
     - **(a) Knowledge (জ্ঞানমূলক - $k$):** 1 mark (direct recall).
     - **(b) Comprehension (অনুধাবনমূলক - $b$):** 2 marks (explanation & understanding).
     - **(c) Application (প্রয়োগমূলক - $ap$):** 3 marks (formula, substitution, calculation, units).
     - **(d) Higher Ability (উচ্চতর দক্ষতামূলক - $ah$):** 4 marks (analysis, mathematical synthesis, comparative judgment).

### 1.3 Legal, Ethical & Minor Protection Architecture (PDPA 2026)
Because SSC students are typically **13 to 16 years old**, they are classified as **children** under the **Bangladesh Personal Data Protection Act, 2026 (Law 63 of 2026)**:
- **Age Gate & Guardian Consent:** Compulsory verification of birth date at onboarding. Students under 18 must trigger an automated SMS verification to their parent/guardian's mobile phone (`+8801[3-9]\d{8}`).
- **Data Sovereignty & Retention:** Explicit, unbundled opt-in for retaining answer script images for model improvement. Automatic purging of raw camera photos after 90 days.
- **Child Safety Triage:** Integrated safety classifiers on the tutor chat to intercept signs of academic distress or self-harm, immediately serving the national emotional support helpline (**Kaan Pete Roi / কান পেতে রই: ০৯৬১৩৪২৭৮০০**).

### 1.4 Low-Bandwidth & Device Optimization for Rural Bangladesh
- Real Bangladeshi students often study on low-cost Android phones with metered, unreliable 3G/4G connections.
- **Client-Side Image Optimization:** Automatic Canvas/WebAssembly downscaling and WebP re-encoding before transmission, reducing a 12MB phone snapshot to $<300\text{KB}$ while preserving high-contrast ink edges.
- **Performance Budget:** Maximum Largest Contentful Paint (LCP) of $\le 2.5\text{ seconds}$ on mobile.

---

## 2. Intended Actors & Persona Matrix

```
+------------------------------------+-------------------------------------------------------------------------+
| Actor                              | Profile & Primary Motivations                                            |
+------------------------------------+-------------------------------------------------------------------------+
| 1. SSC Candidate (Student)         | 15-year-old student preparing for board exams. Stressed about GPA-5,   |
|                                    | struggles with Physics/Math formulas, lacks access to personal tutors.  |
+------------------------------------+-------------------------------------------------------------------------+
| 2. Minor Student's Guardian        | Parent concerned about child's academic future and digital privacy.     |
|                                    | Authorizes platform access via SMS OTP under PDPA 2026 regulations.      |
+------------------------------------+-------------------------------------------------------------------------+
| 3. High-Stakes Board Examinee      | Student practicing under timed board conditions (3-hour full mock exam) |
|                                    | needing instant diagnostic grading before national exams start.         |
+------------------------------------+-------------------------------------------------------------------------+
| 4. Peer / Study Group Learner      | Student comparing progress against divisional and national benchmarks.  |
+------------------------------------+-------------------------------------------------------------------------+
| 5. Human Board Examiner / Teacher  | Senior educator reviewing borderline or disputed automated evaluations, |
|                                    | validating AI marks, and feeding corrections to the calibration queue.  |
+------------------------------------+-------------------------------------------------------------------------+
| 6. System Safety & Guardian Worker | Background process auditing minors' data, quota limits, and escalation. |
+------------------------------------+-------------------------------------------------------------------------+
```

---

## 3. Complete User Stories Specification (Organized by Planned Subsystem)

---

### Subsystem A: Onboarding, Minor Protection & Legal Compliance (PDPA 2026)

#### US-ONB-01: Age-Gated Student Registration & Profile Setup
> **As an** SSC student,  
> **I want to** register using my phone number, email, or Google account and select my educational board, academic group, and target exam year,  
> **So that** my entire portal experience is personalized to my exact national syllabus.

- **Pedagogical & Business Intent:** SSC students in Bangladesh belong to specific boards (e.g., Dhaka Board, Madrasah Board) and academic groups (`SCIENCE`, `HUMANITIES`, `BUSINESS STUDIES`). The platform must calibrate past papers and syllabus chapters according to these selections.
- **Acceptance Criteria (Gherkin):**
  - **Given** I am a first-time visitor on the registration page,
  - **When** I submit my email and password or authenticate via Google OAuth 2.0,
  - **Then** the system prompts for my Date of Birth, Board (dropdown of 11 boards), Group (Science/Humanities/Business), and Target SSC Year (e.g., 2026),
  - **And** if my age is $\le 18$ years, the system flags my account as `is_minor = true` and transitions to the Guardian Verification screen.

#### US-ONB-02: Verifiable Parental/Guardian SMS Consent
> **As a** Parent or Legal Guardian of an SSC student,  
> **I want to** receive an SMS verification code and approve my child's usage of SheraTutor,  
> **So that** I know my child is using a safe educational platform and my consent is legally recorded under the Bangladesh Personal Data Protection Act, 2026.

- **Pedagogical & Business Intent:** Compliance with Law 63 of 2026. Processing data of minors without verifiable guardian consent carries penalties up to 50 Lakh BDT.
- **Acceptance Criteria (Gherkin):**
  - **Given** an underage student has completed initial signup,
  - **When** the student enters their guardian's Bangladeshi mobile number (`+8801[3-9]\d{8}`),
  - **Then** the platform dispatches a 6-digit SMS OTP to the guardian's phone stating: *"Your ward [Name] requested access to SheraTutor AI study platform. Use code XXXXXX to consent under PDPA 2026"*,
  - **And** only upon successful OTP submission is `guardian_consent_at` recorded in the database, unlocking full access to the student dashboard.

#### US-ONB-03: Granular Data Retention & Training Opt-In
> **As a** Privacy-Conscious Guardian or Student,  
> **I want to** choose whether my handwritten script images are stored for AI training or automatically deleted after grading,  
> **So that** my child's handwriting and personal notes remain confidential.

- **Pedagogical & Business Intent:** Prevents bundled consent. Respects student data sovereignty.
- **Acceptance Criteria (Gherkin):**
  - **Given** the onboarding consent screen,
  - **When** reviewing data permissions,
  - **Then** the "Allow SheraTutor to use anonymized scripts to improve grading models" toggle is set to **OFF by default**,
  - **And** if left off, the system schedules the raw image files in Supabase Storage for automatic deletion after 90 days, retaining only the derived numerical grades.

---

### Subsystem B: Low-Bandwidth Handwritten Script Capture & Preprocessing

#### US-SCR-01: Multi-Page Handwritten Khata Upload with Mobile Camera
> **As an** SSC student studying on a budget smartphone,  
> **I want to** take sequential photos of my handwritten exam answer pages directly within the browser,  
> **So that** I can submit my physical khata without needing a desktop scanner or expensive apps.

- **Pedagogical & Business Intent:** Students write in physical exercise books (*Khata*). Frictionless multi-page capture is the primary user journey.
- **Acceptance Criteria (Gherkin):**
  - **Given** I am on the `/dashboard/upload` page on a mobile device,
  - **When** I tap the "Add Page" button,
  - **Then** my device opens the rear camera with `capture="environment"`,
  - **And** after snapping, the page is rendered as a thumbnail with options to rotate, re-order (drag and drop), or delete,
  - **And** I can tag which question number (e.g., "CQ-01" or "CQ-02") corresponds to each page.

#### US-SCR-02: Client-Side Compression & Bandwidth Saver
> **As an** SSC student on a limited 3G/4G cellular data pack in a rural district,  
> **I want to** have my photos compressed automatically on my device before uploading,  
> **So that** my data pack is not depleted and the upload does not time out on slow connections.

- **Pedagogical & Business Intent:** 12MP smartphone cameras produce 5MB–15MB files. Uploading 4 pages would consume 50MB and stall on 3G.
- **Acceptance Criteria (Gherkin):**
  - **Given** 3 high-resolution script photos are captured by the user,
  - **When** the user clicks "Submit for Grading",
  - **Then** an in-browser Canvas/WebAssembly pipeline downscales the images to a maximum width of 2048px and converts them to WebP at 80% quality,
  - **And** the total payload size is reduced by $\ge 75\%$ (average $<350\text{KB}$ per page),
  - **And** a live visual upload progress bar displays transferred bytes and estimated completion time.

#### US-SCR-03: Perspective Correction & Ruling Enhancement
> **As an** SSC student taking photos on a dimly lit study desk,  
> **I want to** have my skewed or shadowed answer sheets automatically perspective-corrected,  
> **So that** the AI examiner can read my handwriting accurately.

- **Acceptance Criteria (Gherkin):**
  - **Given** an uploaded script page taken at an oblique angle,
  - **When** pre-processed by the vision ingest service,
  - **Then** page contours are detected, the quadrilateral is flattened to a rectangular aspect ratio, and contrast is normalized across uneven lighting conditions.

---

### Subsystem C: Vision OCR Transcription & Anti-Overcorrection Safeguards

#### US-OCR-01: Verbatim Bengali & English Handwritten OCR
> **As an** SSC student writing in mixed Bangla and English,  
> **I want to** have my handwritten sentences, formulas, and diagrams transcribed with high fidelity,  
> **So that** the evaluation is based on what I actually wrote.

- **Pedagogical & Business Intent:** Bangladeshi students frequently mix languages (e.g., writing Bengali grammar with English variables: "এখানে $m = 500\text{ gm} = 0.5\text{ kg}$").
- **Acceptance Criteria (Gherkin):**
  - **Given** a handwritten khata page containing Bengali handwriting and English equations,
  - **When** transcribed by the OCR model,
  - **Then** character error rate (CER) on readable handwriting is $\le 8\%$,
  - **And** mathematical equations are converted to valid LaTeX tokens enclosed in `$...$` or `$$...$$`.

#### US-OCR-02: Preservation of Student Errors (Anti-Overcorrection)
> **As an** AI Board Examiner Pipeline,  
> **I want to** preserve all student spelling mistakes, incorrect formulas, and false calculation steps verbatim,  
> **So that** the student is not awarded unearned marks due to the AI silently "fixing" their work.

- **Pedagogical & Business Intent:** *BanglaWild (arXiv 2608.03884)* proved that standard VLMs silently correct misspelled Bengali words or incorrect scientific constants (e.g., turning `g = 9.7` into `9.8`). This is disastrous for grading.
- **Acceptance Criteria (Gherkin):**
  - **Given** a student writes an incorrect formula (e.g., $v = u - at$ instead of $v = u + at$ for downward acceleration),
  - **When** the OCR engine transcribes the text,
  - **Then** it transcribes $v = u - at$ strictly as written,
  - **And** does NOT substitute the standard textbook equation.

#### US-OCR-03: Strikethrough & Crossed-Out Text Detection
> **As an** SSC student who crossed out an incorrect calculation attempt on my paper,  
> **I want to** have crossed-out blocks ignored during mark calculation,  
> **So that** I am only graded on my final intended answer.

- **Acceptance Criteria (Gherkin):**
  - **Given** a paragraph or formula that has a line or cross drawn through it,
  - **When** processed by the vision transcriber,
  - **Then** the text is tagged with `[crossed out: ...]` or bounding-box flagged as invalid,
  - **And** the downstream rubric evaluator excludes it from awarded marks.

---

### Subsystem D: Curriculum-Grounded NCTB Rubric Evaluation & Step Breakdown

#### US-EVL-01: Granular Step-by-Step Mark Breakdown for Creative Questions (CQ)
> **As an** SSC Science student,  
> **I want to** see exactly which marks I earned and lost across parts (a), (b), (c), and (d) of every Creative Question,  
> **So that** I know if I lost marks for knowledge, explanation, mathematical working, or missing units.

- **Pedagogical & Business Intent:** Official NCTB Board guidelines dictate a 4-step rubric for CQ:
  - (a) জ্ঞানমূলক (1 mark): Exact definition or law.
  - (b) অনুধাবনমূলক (2 marks): 1 mark for knowledge statement + 1 mark for explanation.
  - (c) প্রয়োগমূলক (3 marks): 1 mark for formula + 1 mark for data substitution + 1 mark for answer with correct SI unit.
  - (d) উচ্চতর দক্ষতামূলক (4 marks): 1 mark for premise + 1 mark for mathematical verification + 1 mark for logical comparison + 1 mark for justified conclusion.
- **Acceptance Criteria (Gherkin):**
  - **Given** an evaluated Physics CQ submission,
  - **When** I view the results on `/dashboard/submissions/[id]`,
  - **Then** the interface displays an interactive breakdown card for each sub-question showing:
    - Max marks vs. awarded marks (e.g., 2.5 / 3.0),
    - Step criteria statuses (`MATCHED`, `PARTIAL`, `MISSED`),
    - Specific Bangla feedback: e.g., *"একক (Unit) না লেখায় ০.৫ নম্বর কাটা হয়েছে।" (0.5 mark deducted for omitting SI unit)*.

#### US-EVL-02: Grounded Textbook Citation & Zero-Hallucination Guarantee
> **As an** SSC student skeptical of AI grading,  
> **I want to** see the exact textbook page and chapter referenced for every mark deduction,  
> **So that** I can open my physical textbook and verify why the AI penalized me.

- **Pedagogical & Business Intent:** Students and teachers will not trust generic LLM scores. Grounding every deduction in NCTB textbook chunks builds institutional trust.
- **Acceptance Criteria (Gherkin):**
  - **Given** a mark deduction in Chemistry Chapter 4 (Periodic Table),
  - **When** I expand the deduction details,
  - **Then** the card displays a verified citation chip: e.g., *"NCTB রসায়ন, অধ্যায় ৪, পৃষ্ঠা ৬৪"*,
  - **And** clicking the chip shows the official textbook excerpt defining the ionization energy trend.

#### US-EVL-03: Asynchronous Grading Notification
> **As an** SSC student on a smartphone,  
> **I want to** be able to close my browser after uploading my script and receive a notification when grading is complete,  
> **So that** I do not have to keep the screen on while the background queue processes my work.

- **Acceptance Criteria (Gherkin):**
  - **Given** my submission has entered the `grading_queue`,
  - **When** processing finishes (within 45 seconds),
  - **Then** the system sends a Web Push notification / SMS alert,
  - **And** when I open the dashboard, the submission badge changes from "Processing" to "Graded (A+)".

---

### Subsystem E: Contextual Socratic AI Tutoring ("Explain It Simply")

#### US-TUT-01: "Explain It Simply" Contextual Drawer
> **As an** SSC student reviewing a question where I scored poorly,  
> **I want to** click an "Explain it simply" button right next to the red deduction mark,  
> **So that** an AI tutor opens with the exact context of my mistake already loaded.

- **Pedagogical & Business Intent:** Eliminates the cognitive friction of having to re-type the question or explain what went wrong to a blank chatbot.
- **Acceptance Criteria (Gherkin):**
  - **Given** I am looking at Question 2(c) where I lost 2 marks,
  - **When** I click the "সহজ ভাষায় বোঝাও" (Explain it simply) button,
  - **Then** a side drawer slides open with the AI tutor initiating: *"দেখছি তুমি এখানে নিউটনের দ্বিতীয় সূত্রে ভরের একক গ্রামে রেখে হিসাব করেছো। চলো দেখি কীভাবে গ্রামকে কেজিতে রূপান্তর করতে হয়..."*,
  - **And** the context includes the question stem, the student's transcribed answer, and the textbook rubric rule.

#### US-TUT-02: Socratic Guidance without Giving Away Direct Answers
> **As an** Educational Platform,  
> **I want** the AI tutor to use Socratic questioning to lead the student to discover the solution,  
> **So that** the student builds genuine problem-solving skills instead of cheating on homework.

- **Acceptance Criteria (Gherkin):**
  - **Given** an active tutoring session,
  - **When** the student asks: *"Just tell me the final answer of 3(d)"*,
  - **Then** the AI tutor responds: *"আমি সরাসরি উত্তরটি বলব না, তবে তোমাকে সাহায্য করব! প্রথমে বলো, উদ্দীপকে আদিবেগ $u$ এবং ত্বরণ $a$ এর মান কত দেওয়া আছে?"*,
  - **And** guides the student step-by-step through the formula derivation.

#### US-TUT-03: Authentic Textbook Diagram & Visual Aid Integration
> **As an** SSC student struggling to visualize a physics ray diagram or chemical reaction apparatus,  
> **I want to** see the official textbook diagram displayed inside the chat,  
> **So that** I can connect the mathematical formulas to visual concepts.

- **Acceptance Criteria (Gherkin):**
  - **Given** a discussion regarding concave mirrors in SSC Physics Chapter 6,
  - **When** the tutor explains image formation beyond the center of curvature,
  - **Then** the tutor dynamically displays the extracted NCTB textbook diagram with labelled principal axis, focus, and object position.

#### US-TUT-04: Child Safety Triage & Crisis Helpline Escalation
> **As a** Safety Guardrail for Minors,  
> **I want** the system to detect any expressions of acute psychological distress, self-harm, or abuse in student chat inputs,  
> **So that** the system immediately halts normal conversation and provides emotional support resources.

- **Pedagogical & Business Intent:** High-stakes board exams in Bangladesh cause severe mental health stress. A platform interacting with 14-year-olds must have compassionate, immediate safeguards.
- **Acceptance Criteria (Gherkin):**
  - **Given** a student types a message containing distress/self-harm keywords in Bangla or English,
  - **When** evaluated by the safety pre-filter,
  - **Then** the tutor halts academic responses and presents a compassionate message in Bengali with the toll-free **Kaan Pete Roi** mental health helpline: **০৯৬১৩৪২৭৮০০**,
  - **And** logs a high-priority `SAFETY_ESCALATION` event in the administrative audit log.

---

### Subsystem F: Adaptive Study Planner & Student Progress Matrix

#### US-PLN-01: Continuous Weakness Matrix & Topic Heatmap
> **As an** SSC student,  
> **I want to** see a color-coded heatmap of my understanding across every chapter in my subjects,  
> **So that** I immediately know which chapters need urgent study.

- **Pedagogical & Business Intent:** Continuous logging of a `weakness_score` ($0.0$ = Mastered to $1.0$ = Critical Gap) per chapter in `WEAKNESS_LOGS`.
- **Acceptance Criteria (Gherkin):**
  - **Given** I have submitted 3 or more exam scripts,
  - **When** I view `/dashboard`,
  - **Then** the subject cards display green, yellow, or red status indicators:
    - **Green (Mastered):** Weakness score $<0.25$,
    - **Yellow (Review Needed):** Weakness score $0.25 - 0.60$,
    - **Red (Critical Gap):** Weakness score $>0.60$,
  - **And** the top 3 high-impact weak topics are highlighted under an "AI Quick Wins" banner.

#### US-PLN-02: Dynamic Daily Revision Schedule Generation
> **As an** SSC student juggling 9 subjects with only 60 days left before board exams,  
> **I want to** have an automated daily study timetable that allocates more hours to my weak chapters,  
> **So that** I don't waste time re-reading topics I have already mastered.

- **Acceptance Criteria (Gherkin):**
  - **Given** my current weakness logs and selected available study hours per day (e.g., 4 hours),
  - **When** I click "Generate Weekly Study Plan",
  - **Then** the algorithm generates a 7-day schedule with daily task blocks (e.g., "Day 1: 45 min Physics Ch 2 Motion calculations + 30 min Chemistry Ch 3 practice"),
  - **And** checking off completed tasks updates my momentum streak on the dashboard.

#### US-PLN-03: Board Exam GPA-5 Prediction & Momentum Score
> **As an** SSC candidate,  
> **I want to** see an estimated Board GPA prediction based on my mock exam performances,  
> **So that** I stay motivated and can track my trajectory toward achieving GPA-5.00.

- **Acceptance Criteria (Gherkin):**
  - **Given** my historical test submissions,
  - **When** I open the dashboard,
  - **Then** the "Board Readiness" widget displays my predicted GPA tier (`A+`, `A`, `A-`, `B`, `C`, `F`), estimated percentile rank compared to all peers in my board, and a weekly momentum velocity ring.

---

### Subsystem G: Practice Exams & Full SSC Board Exam Simulator

#### US-EXM-01: Custom Practice Exam Generator
> **As an** SSC student,  
> **I want to** generate a practice exam by selecting specific subjects, chapters, and question counts,  
> **So that** I can test myself on the exact topics I revised tonight.

- **Acceptance Criteria (Gherkin):**
  - **Given** I am on `/dashboard/practice/generate`,
  - **When** I select "Physics", Chapters "2 & 3", 10 MCQs, and 2 Creative Questions,
  - **Then** the system retrieves grounded NCTB question stems and rubrics,
  - **And** renders an authentic board-style question paper with full marks and instructions,
  - **And** provides an option to print or solve online.

#### US-EXM-02: Full 3-Hour SSC Board Exam Simulator (Part A + Part B)
> **As an** SSC student doing weekend revision,  
> **I want to** take a complete 3-hour mock exam with timed Part A (30 MCQs) and Part B (Handwritten Creative Questions),  
> **So that** I experience the exact time pressure and stamina required on board exam day.

- **Pedagogical & Business Intent:** Authentic simulation of the official SSC examination format:
  - **Part A (MCQ - 30 Marks, 30 Minutes):** 30 objective questions with OMR-style selection. Auto-submitted when the 30-minute timer expires.
  - **Part B (Creative Questions - 70 Marks, 2 Hours 30 Minutes):** 11 questions provided, student chooses 7. Student writes answers on paper, then uses the camera bridge to photograph and upload scripts before the final deadline.
- **Acceptance Criteria (Gherkin):**
  - **Given** I click "Start Full Board Simulator",
  - **When** Part A begins,
  - **Then** an active 30:00 countdown timer starts with full-screen focus,
  - **And** selecting options saves state in real-time,
  - **And** at 00:00, Part A auto-submits and transitions to Part B with an upload gateway for handwritten pages.

---

### Subsystem H: Regrade Appeals, Teacher Overrides & Model Calibration

#### US-APP-01: Student Regrade Appeal with Highlighted Discrepancy
> **As an** SSC student who believes my handwritten symbol was misread by the AI,  
> **I want to** flag a specific sub-question and file a regrade request with an explanation,  
> **So that** a human educator can review my script.

- **Acceptance Criteria (Gherkin):**
  - **Given** I am viewing an evaluated script where question 3(c) was marked down,
  - **When** I click "Dispute Mark / পুনঃমূল্যায়ন আবেদন",
  - **Then** a modal allows me to select the disputed step, type an explanation in Bangla (e.g., *"আমি এখানে $\mu$ লিখেছি, কিন্তু AI এটাকে $u$ হিসেবে পড়েছে"*), and submit,
  - **And** the submission enters the `regrade_requests` table with status `'pending'`.

#### US-APP-02: Teacher / Examiner Override & Calibration Dataset Feed
> **As a** Human Board Examiner,  
> **I want to** inspect student appeals on a split-screen interface (original photo vs. AI transcription vs. rubric criteria) and adjust marks,  
> **So that** the student receives fair grades and my correction is saved to the model calibration dataset.

- **Pedagogical & Business Intent:** The research documents explicitly highlight that human corrections are the most valuable proprietary asset of the company. Every teacher override feeds the golden calibration dataset.
- **Acceptance Criteria (Gherkin):**
  - **Given** a teacher logged into the verification portal,
  - **When** opening a pending regrade appeal,
  - **Then** the screen displays the student's original image crop next to the AI transcription and rubric step,
  - **And** the teacher can modify the mark (e.g., from 1.5 to 2.5), enter an examiner note, and click "Confirm Override",
  - **And** the system records an immutable audit log and saves a row to `grading_corrections` containing `{ original_score, corrected_score, teacher_id, reason, image_crop_url }`.

---

### Subsystem I: Typographic, Bilingual & Aesthetic Identity

#### US-DES-01: Authentic Bengali Typography & LaTeX Scientific Rendering
> **As an** SSC student reading scientific explanations,  
> **I want to** see Bengali text rendered in clear, legible native typography alongside crisp LaTeX mathematical symbols,  
> **So that** complex equations with Bengali descriptions are effortless to read.

- **Acceptance Criteria (Gherkin):**
  - **Given** any page in the portal,
  - **Then** display headlines utilize **Baloo Da 2** (weights 600, 700, 800),
  - **And** body copy utilizes **Noto Sans Bengali** or **Inter**,
  - **And** scientific numbers and equations are formatted with KaTeX without font clipping or glyph distortion.

#### US-DES-02: Bilingual Instant Language Switcher
> **As an** English Version SSC student,  
> **I want to** toggle the entire portal interface between Bengali and English with a single tap,  
> **So that** I can navigate the portal in my preferred medium of instruction.

- **Acceptance Criteria (Gherkin):**
  - **Given** any screen on the portal,
  - **When** I click the language toggle button in the header,
  - **Then** 100% of UI strings, rubric labels ($k, b, ap, ah$), navigation buttons, and status badges switch instantly between Bangla and English without a page reload,
  - **And** my preference is remembered in `localStorage` and user profile.

---

## 4. Comprehensive Requirements Traceability Matrix

| Requirement / Story ID | Subsystem Area | Criticality | Target Milestone | Verification Method |
|---|---|---|---|---|
| **US-ONB-01** | Minor Auth & Board Profiling | High | Phase 1 (MVP) | Automated E2E Test |
| **US-ONB-02** | PDPA 2026 SMS Guardian Consent | Critical | Phase 1 (Legal) | SMS Gateway Mock / Manual Audit |
| **US-ONB-03** | Data Retention & Privacy Opt-In | High | Phase 1 (Legal) | DB Check Constraints & RLS |
| **US-SCR-01** | Multi-Page Mobile Camera Upload | Critical | Phase 1 (Core) | Real Device Mobile Testing |
| **US-SCR-02** | WebP Client-Side Downscaling | High | Phase 1 (Mobile) | Network Payload Benchmark ($<350\text{KB}$) |
| **US-SCR-03** | Perspective & Contrast Normalize | Medium | Phase 2 (Vision) | OpenCV / VLM Edge Detection Suite |
| **US-OCR-01** | Mixed Bangla/English OCR | Critical | Phase 2 (OCR) | Benchmark vs. BanglaWild Dataset |
| **US-OCR-02** | Anti-Overcorrection Safeguards | Critical | Phase 2 (Grading) | Golden Negative Error Test Suite |
| **US-OCR-03** | Strikethrough Text Omission | Medium | Phase 2 (OCR) | Annotation Visual Inspection |
| **US-EVL-01** | CQ 4-Step Rubric Breakdown | Critical | Phase 1 (Grading) | Zod Schema Validation & Pearson $r \ge 0.95$ |
| **US-EVL-02** | Grounded NCTB Textbook Citation | High | Phase 1 (RAG) | Vector Cosine Match Verification |
| **US-EVL-03** | Asynchronous Queue Notification | High | Phase 1 (Infra) | PGMQ & Web Push Test |
| **US-TUT-01** | "Explain It Simply" Context Drawer | High | Phase 1 (Tutor) | UI Integration Test |
| **US-TUT-02** | Socratic Pedagogical Guardrail | High | Phase 1 (Tutor) | Prompt Jailbreak Resistance Eval |
| **US-TUT-03** | Textbook Diagram Chat Embeds | Medium | Phase 2 (Tutor) | Storage URL Ingestion Pipeline |
| **US-TUT-04** | Self-Harm & Minor Crisis Triage | Critical | Phase 1 (Safety) | Automated Keyword Red-Teaming |
| **US-PLN-01** | Continuous Weakness Heatmap | High | Phase 1 (Analytics) | Aggregation Function Unit Tests |
| **US-PLN-02** | Adaptive Weekly Study Scheduler | Medium | Phase 2 (Planning) | Dynamic Schedule Generation Test |
| **US-PLN-03** | Board GPA-5 Prediction Ring | Medium | Phase 1 (Dashboard) | Statistical Scoring Model Test |
| **US-EXM-01** | Custom Practice Paper Generator | High | Phase 1 (Practice) | Paper Generation Flow Validation |
| **US-EXM-02** | 3-Hour Board Simulator (MCQ+CQ) | High | Phase 2 (Sim) | Real-Time Countdown & Auto-Submit |
| **US-APP-01** | Student Regrade Appeal Ticket | Medium | Phase 2 (Quality) | Ticket State Machine Verification |
| **US-APP-02** | Human Override Calibration Feed | High | Phase 2 (Data) | Audit Log & Calibration Table Sync |
| **US-DES-01** | Baloo Da 2 & KaTeX Typography | High | Phase 1 (Design) | Cross-Browser Font Inspection |
| **US-DES-02** | Instant Bilingual Toggle | High | Phase 1 (i18n) | Translation Coverage Audit ($100\%$) |

---

## 5. Summary & Contrast: Initial Intended Plan vs. Existing Codebase

| Dimension | Initial Intended Plan (Foundational Documents) | Existing Codebase State (`web/`) |
|---|---|---|
| **Audience Scope** | SSC Candidates (Grade 10, Ages 13–16) across 11 Boards with full minor compliance | Code has evolved to mix HSC and SSC, with current focus leaned toward HSC 1st/2nd Year Physics/Chemistry |
| **Regulatory (PDPA)** | Mandatory SMS Guardian OTP for under-18s; explicit data training opt-out; 90-day auto-purge | Checkbox on waitlist, but full SMS OTP and age-gated consent gate not yet wired into live auth flow |
| **Curriculum Ingestion** | 33 SSC Subjects $\times$ 2 Languages = 66 Textbooks (Phased starting with 8 Science books) | 1,962 chunks ingested primarily for HSC Physics & Chemistry |
| **Transcription Integrity** | Explicit anti-overcorrection prompt constraints; benchmarked against *BanglaWild* | Basic OCR with confidence logging; overcorrection guardrails partially drafted in system prompts |
| **Exam Simulator** | Full 3-Hour Simulation (Part A: 30 MCQs timed auto-submit; Part B: 7 CQs paper upload) | Exam generator exists for custom papers; full 3-hour live countdown simulator with Part B bridge pending |
| **Human Calibration** | First-class `grading_corrections` table feeding active learning model tuning | `regrade_requests` table exists; automated retraining/calibration feed pipeline pending |

---
<!-- GOAL_COMPLETE -->
