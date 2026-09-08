# SheraTutor — Project Overview

## Vision & Mission

**Vision:** Modernize Bangladesh's education system by giving every SSC and HSC student access to the kind of personalized, board-standard feedback that today only the wealthiest families can buy through private tutors — then take the same model global.

**Mission:** Make quality exam preparation and expert-level feedback **free for every student**, funded entirely by selling efficiency, insight, and grading infrastructure to the institutions around them — schools, coaching centers, and government bodies — who currently pay for this work to be done slowly, by hand, at high cost.

**The two-sided idea in one line:** Students get a private tutor for free. Institutions pay for the AI that makes that possible.

**Long-term arc:**
1. **Phase 1 — Bangladesh, SSC/HSC:** Prove the model in the local board-exam system.
2. **Phase 2 — Bangladesh, all boards:** Expand to Madrasah, Technical, and university admission tests.
3. **Phase 3 — Global:** Take the same free-for-students / paid-for-institutions model to other exam-heavy education systems (South Asia first, then broader), with the same founding promise — education is free for all.

---

## Product Overview

SheraTutor is a "Super AI Teacher" — a platform that acts as an always-available board examiner, tutor, and study planner for SSC and HSC students. It has two faces:

- **The student-facing product (B2C):** completely free. Mock exams, instant AI grading of handwritten answers, gap analysis, a conversational tutor, and an adaptive study plan.
- **The institution-facing product (B2B):** the revenue engine. Schools, coaching centers, and government education bodies license SheraTutor's grading and question-generation infrastructure to run their own exams, mock tests, and assessments at a fraction of current cost and time.

The same AI core — trained on the NCTB curriculum and board-exam rubrics — powers both sides. Every free student interaction also generates the performance data and content feedback loop that makes the B2B product more valuable.

---

## Features

### Student-Facing Features (B2C — Free, Always)

| Feature | What it does |
|---|---|
| **Custom mock exam generator** | Generates MCQs and Creative Questions (CQ) by chapter, difficulty, or past board paper (e.g., Dhaka Board 2023). |
| **Vision-powered grading** | Student photographs a handwritten answer sheet; AI reads Bangla and English handwriting, equations, and diagrams, and grades it like a board examiner. |
| **Granular gap analysis** | Identifies the exact step or concept that cost the mark, instead of a bare "wrong answer." |
| **"Explain it simply" tutor chatbot** | Breaks down hard topics (e.g., organic chemistry) using plain-language analogies, in Bangla or English. |
| **Adaptive study planner** | Daily plan that automatically reallocates time to weak chapters based on mock test performance. |
| **Progress dashboard** | Momentum score, board-prediction estimate, and a subject-by-subject understanding heatmap. |

**Free means free** — no ad-supported paywall, no "3 free tests then pay" limit, no premium tier that gates grading quality. The B2C side is not a funnel into a subscription; it is the mission.

### Institution-Facing Features (B2B — Revenue)

| Feature | What it does | Buyer |
|---|---|---|
| **High-quality question paper generation** | AI generates board-standard question sets (MCQ + CQ) by chapter, syllabus coverage, and difficulty calibration, saving teachers the hours spent hand-writing exams every term. | Schools, coaching centers |
| **Automated answer script evaluation** | Institutions run their own paper-based exams as usual; students' handwritten scripts are scanned/photographed and graded automatically at scale. | Schools, coaching centers |
| **Mark breakdown & deduction explanations** | For every graded script, a breakdown of exactly where and why marks were deducted — usable by teachers for parent-teacher conferences and by students for review. | Schools, coaching centers |
| **Cohort analytics** | Class- and school-level performance dashboards: weak chapters across a whole batch, comparison against board averages, at-risk student flags. | Schools, coaching centers, government |
| **White-label deployment** | Coaching centers can offer "instant AI-grading" as their own branded value-add to parents. | Coaching centers |
| **Government/board-level tools** | Bulk grading infrastructure for standardized testing, board-level analytics on curriculum weak points nationwide, potential integration into national assessment pilots. | Government / education boards |

---

## Roadmap (Bangladesh Phase)

| Phase | Timing | Focus |
|---|---|---|
| **Phase 1 — Demo, waitlist & seed funding** | Weeks 1–3 | Finalize web demo, launch a **student waitlist landing page** backed by a B2C digital marketing push (social ads, coaching-center/campus outreach) to validate demand and build a launch list, pitch investors on TAM + early waitlist traction, secure capital/cloud credits |
| **Phase 2 — RAG pipeline & MVP** | Weeks 4–8 | Digitize NCTB curriculum for Physics/Chemistry/Math/English, build the n8n grading pipeline |
| **Phase 3 — Web beta & B2B pilot** | Weeks 9–12 | Launch web app, onboard 2–3 coaching centers, calibrate grading against real handwriting |
| **Phase 4 — Mobile & scaling** | Weeks 13–20 | Ship Flutter mobile app, expand to Humanities/Commerce, begin school-level B2B sales |
| **Phase 5 — Government engagement** | Post-Week 20 | Approach boards/ministry with pilot data and adoption evidence |
| **Phase 6 — Global expansion** | Long-term | Adapt the same free-for-students / paid-for-institutions model to other exam-heavy education systems |

---

## Why This Is Defensible

- **Curriculum-grounded, not generic** — grading is pinned to actual NCTB textbooks and board rubrics via RAG, not open-ended LLM guessing. This is the difference between a toy demo and something a school will trust with real grades.
- **B2B distribution moat** — coaching centers already own the trust relationship with parents and the weekly grading workload; selling through them is faster than acquiring students one at a time, and hard for a new entrant to replicate quickly.
- **Mission-aligned free tier is a genuine differentiator, not just marketing** — most ed-tech in this space eventually paywalls the thing that actually helps (personalized feedback). SheraTutor's B2B-funded model means the free tier never has to be hollowed out to protect margins.
- **Data flywheel** — every free student interaction improves the grading model, which improves the B2B product, which funds more free access. The two sides reinforce each other rather than compete for resources.

---

## Key Risks & Open Questions (worth tracking honestly)

- **Grading accuracy at scale** — CQ (long-form) grading is inherently harder than MCQ; human-in-the-loop review will likely be needed for longer than expected before fully unsupervised grading is safe to claim.
- **Government sales cycles** are typically long and relationship-driven in Bangladesh; the roadmap treats this as a Phase 5+ effort deliberately, not a launch dependency.
- **Cost of "free forever"** — inference costs at national scale (millions of students) are non-trivial; the hybrid proprietary/open-source model strategy exists specifically to make this sustainable, but will need real usage data to validate unit economics. See `04-tech-stack-and-ai.md`.
- **Data privacy** — handling minors' academic and performance data requires careful compliance design from day one, especially once government partnerships are in scope.
