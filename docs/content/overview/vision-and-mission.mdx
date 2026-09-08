# SheraTutor — Full Project Documentation

**"SheraTutor, for Shera Students."**
Bangladesh's first AI board examiner — free for every student, monetized through institutions.

---

## 1. Vision & Mission

**Vision:** Modernize Bangladesh's education system by giving every SSC and HSC student access to the kind of personalized, board-standard feedback that today only the wealthiest families can buy through private tutors — then take the same model global.

**Mission:** Make quality exam preparation and expert-level feedback **free for every student**, funded entirely by selling efficiency, insight, and grading infrastructure to the institutions around them — schools, coaching centers, and government bodies — who currently pay for this work to be done slowly, by hand, at high cost.

**The two-sided idea in one line:** Students get a private tutor for free. Institutions pay for the AI that makes that possible.

**Long-term arc:**
1. **Phase 1 — Bangladesh, SSC/HSC:** Prove the model in the local board-exam system.
2. **Phase 2 — Bangladesh, all boards:** Expand to Madrasah, Technical, and university admission tests.
3. **Phase 3 — Global:** Take the same free-for-students / paid-for-institutions model to other exam-heavy education systems (South Asia first, then broader), with the same founding promise — education is free for all.

---

## 2. Product Overview

SheraTutor is a "Super AI Teacher" — a platform that acts as an always-available board examiner, tutor, and study planner for SSC and HSC students. It has two faces:

- **The student-facing product (B2C):** completely free. Mock exams, instant AI grading of handwritten answers, gap analysis, a conversational tutor, and an adaptive study plan.
- **The institution-facing product (B2B):** the revenue engine. Schools, coaching centers, and government education bodies license SheraTutor's grading and question-generation infrastructure to run their own exams, mock tests, and assessments at a fraction of current cost and time.

The same AI core — trained on the NCTB curriculum and board-exam rubrics — powers both sides. Every free student interaction also generates the performance data and content feedback loop that makes the B2B product more valuable.

---

## 3. Features

### 3.1 Student-Facing Features (B2C — Free, Always)

| Feature | What it does |
|---|---|
| **Custom mock exam generator** | Generates MCQs and Creative Questions (CQ) by chapter, difficulty, or past board paper (e.g., Dhaka Board 2023). |
| **Vision-powered grading** | Student photographs a handwritten answer sheet; AI reads Bangla and English handwriting, equations, and diagrams, and grades it like a board examiner. |
| **Granular gap analysis** | Identifies the exact step or concept that cost the mark, instead of a bare "wrong answer." |
| **"Explain it simply" tutor chatbot** | Breaks down hard topics (e.g., organic chemistry) using plain-language analogies, in Bangla or English. |
| **Adaptive study planner** | Daily plan that automatically reallocates time to weak chapters based on mock test performance. |
| **Progress dashboard** | Momentum score, board-prediction estimate, and a subject-by-subject understanding heatmap. |

**Free means free** — no ad-supported paywall, no "3 free tests then pay" limit, no premium tier that gates grading quality. The B2C side is not a funnel into a subscription; it is the mission.

### 3.2 Institution-Facing Features (B2B — Revenue)

| Feature | What it does | Buyer |
|---|---|---|
| **High-quality question paper generation** | AI generates board-standard question sets (MCQ + CQ) by chapter, syllabus coverage, and difficulty calibration, saving teachers the hours spent hand-writing exams every term. | Schools, coaching centers |
| **Automated answer script evaluation** | Institutions run their own paper-based exams as usual; students' handwritten scripts are scanned/photographed and graded automatically at scale. | Schools, coaching centers |
| **Mark breakdown & deduction explanations** | For every graded script, a breakdown of exactly where and why marks were deducted — usable by teachers for parent-teacher conferences and by students for review. | Schools, coaching centers |
| **Cohort analytics** | Class- and school-level performance dashboards: weak chapters across a whole batch, comparison against board averages, at-risk student flags. | Schools, coaching centers, government |
| **White-label deployment** | Coaching centers can offer "instant AI-grading" as their own branded value-add to parents. | Coaching centers |
| **Government/board-level tools** | Bulk grading infrastructure for standardized testing, board-level analytics on curriculum weak points nationwide, potential integration into national assessment pilots. | Government / education boards |

---

## 4. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend (Phase 1 — Web)** | Next.js, React, Tailwind CSS, Shadcn UI | Fast, responsive web app for rapid iteration and the B2B institutional dashboard |
| **Frontend (Phase 2 — Mobile)** | Flutter, Dart | Cross-platform iOS/Android app for students, with native camera access for scanning answer scripts |
| **Backend & database** | Supabase (Postgres + `pgvector`) | Auth, relational data (users, scores, institutions), and vector storage for curriculum embeddings |
| **AI orchestration** | n8n | Low-code workflow engine chaining: image upload → OCR/vision model → vector DB lookup for grounding → LLM grading/explanation → structured result |
| **Microservices** | Node.js, Python | Custom data extraction, vector chunking, and batch-grading pipelines n8n can trigger |
| **Vision/OCR + grading AI** | See Section 5 | The core "examiner" intelligence |

---

## 5. AI Model Strategy — Building the "Super AI Tutor"

This is the hardest and most important part of the product, so it's worth being specific about both **which models** and **how training/grounding actually happens** — this is not "prompt an LLM and hope."

### 5.1 The core technical challenge

Grading a Bangladeshi board exam script isn't a generic OCR problem. It requires:
1. Reading **handwritten Bangla and English**, including equations, diagrams, and messy student handwriting.
2. Understanding **what the question was actually asking** (CQ-style multi-part questions are common in Bangladesh's system).
3. Applying the **actual board marking rubric** — partial credit for method, specific deductions for missing steps — not just "is the final answer right."
4. Explaining **why** marks were lost, in a way a 15–18 year old can act on.

That's four different capabilities stacked together: vision/OCR, reading comprehension, rubric-based reasoning, and pedagogical explanation.

### 5.2 Recommended model approach: a hybrid stack, not one model

**Layer 1 — Vision/OCR (reading the handwriting):**
- **Frontier multimodal APIs** (Gemini, GPT-class, or Claude vision models) for the highest accuracy during the pilot phase, when getting grading right matters more than cost per script.
- **Open-source vision-language models** (Qwen-VL family, which supports OCR across 32 languages including strong multilingual document understanding, and DeepSeek-OCR for highly cost-efficient large-scale text extraction) as a self-hosted fallback once volume grows — this is what makes free-for-students financially sustainable at scale, since API cost-per-script for millions of free users would otherwise be unsustainable.

**Layer 2 — Curriculum grounding (knowing what's actually correct):**
- **RAG (Retrieval-Augmented Generation)** over a vector database (Supabase `pgvector`) containing digitized NCTB textbooks, official board marking rubrics, and past board papers.
- Every grading decision is checked against this retrieved context — this is what prevents hallucinated grading and is the difference between "an AI guessing" and "an AI examiner."

**Layer 3 — Bangla-native reasoning and explanation:**
- Bangla-specific fine-tuned language models (e.g., BanglaLLaMA-class models, 3B–11B parameters, trained specifically on Bangla text) as an option for the explanation/tutoring layer, so feedback reads naturally in Bangla rather than as a translated English explanation.
- Alternatively, frontier multilingual models are increasingly strong in Bangla directly and may be sufficient without a dedicated fine-tune in early phases — this is a build-vs-buy decision to validate empirically during the pilot.

**Layer 4 — Rubric-based grading logic:**
- Not just "ask the LLM to grade it" — a structured pipeline where the model must output the specific rubric criteria it matched/missed (in a fixed JSON schema), which is then used to compute the score and generate the deduction explanation. This makes grading auditable and correctable, which matters enormously for trust with schools and parents.

### 5.3 How "training" actually happens (realistic path, not hype)

1. **Curriculum digitization (Weeks 4–8):** NCTB textbooks and past board papers for Physics, Chemistry, Math, and English are digitized and embedded — this is the foundation everything else is grounded in.
2. **Calibration against real handwriting (Weeks 9–12):** The B2B pilot with 2–3 coaching centers is where the model actually gets "trained" in the practical sense — real, messy student handwriting run through the pipeline, graded output compared against what a human teacher would give, and the prompt/rubric-matching logic iteratively corrected.
3. **Feedback loop from scale:** Every graded script (B2C and B2B) becomes potential training/eval data (with appropriate privacy handling) to keep improving grading consistency over time.
4. **Human-in-the-loop initially:** Especially for CQ (long-form) answers during the pilot phase, a teacher spot-checks a sample of AI-graded scripts before this expands unsupervised — this is both a quality safeguard and a trust-building step with schools.
5. **Expansion:** Once Physics/Chemistry/Math/English are reliable, expand the same pipeline to Humanities and Commerce subjects, which involve more long-form, subjective grading and will need more calibration.

---

## 6. Market Size & Opportunity

| Metric | 2025 figure | Source |
|---|---|---|
| SSC & equivalent candidates | ~1.93 million appeared (1,928,970 registered) | Prothom Alo, BSS |
| SSC pass rate | 68.45% | BSS |
| SSC GPA-5 achievers | 139,032 | Prothom Alo |
| HSC & equivalent candidates | ~1.25 million registered (1,237,661 appeared) | Bangladesh Pratidin, Dhaka Tribune |
| HSC pass rate | 58.83% — **lowest in 21 years**, down 18.95 points from 77.78% in 2024 | The Business Standard, Prothom Alo |
| HSC GPA-5 achievers | 69,097 | Dhaka Tribune |
| Education boards | 11 (9 general boards + Madrasah + Technical) | BSS |
| Feeder institutions | ~29,000 schools and colleges | SSC Result portal |

**Why this matters for SheraTutor specifically:** the HSC pass rate collapsing to a 21-year low in 2025 is not a one-off — it's evidence of a system-wide gap between what students are taught and what they can demonstrate under exam conditions. That gap is exactly what personalized, granular feedback (rather than a single pass/fail mark) is positioned to close.

**Total addressable population:** ~3.2 million students sit these exams annually, but the real user base is larger — every one of those students spends 2–3 years in active preparation before their board exam, and every one of the ~29,000 feeder institutions has an ongoing need for grading and assessment infrastructure regardless of exam-day volume.

**Adjacent expansion paths:** Madrasah board (Bangla-medium, large population), Technical board, and — longer term — comparable board-exam systems across South Asia.

---

## 7. Business Model

### 7.1 The core structure: Free-for-students, paid-by-institutions

This is a deliberate two-sided model, not a freemium funnel:

- **B2C (students): 100% free, permanently.** No tiered "premium" grading, no ad monetization targeting students, no data-selling. This is the mission, not a loss-leader with strings attached.
- **B2B (institutions): the entire revenue engine.** Schools, coaching centers, and government bodies pay for the infrastructure that makes free grading possible at scale.

### 7.2 Why this works financially

The B2C side is expensive to run (inference costs, curriculum maintenance, support) but **generates the data, credibility, and usage volume** that makes the B2B product valuable and sellable. The B2B side is what actually needs to fund it — and unlike students, institutions have budgets already allocated to the exact problems SheraTutor solves (they currently pay teachers' overtime for manual grading, pay printers/vendors for question papers, and have no systematic way to track cohort-wide weak points).

### 7.3 B2B Revenue Streams (detail)

| Stream | Description | Target buyer |
|---|---|---|
| **Question paper generation** | Subscription or per-batch fee for AI-generated, board-standard MCQ/CQ question sets, calibrated to syllabus and difficulty. | Schools, coaching centers |
| **Answer script evaluation (per-script or per-batch pricing)** | Institutions send scanned/photographed scripts from their own exams; SheraTutor returns graded scores + mark breakdowns at a fraction of the cost of hiring extra grading staff. | Schools, coaching centers |
| **Explanation & deduction reporting** | Detailed "why this mark was lost" reports per student, usable in parent-teacher conferences — a premium add-on to raw grading. | Schools, coaching centers |
| **Cohort/institutional analytics dashboard** | Ongoing subscription for school- or center-wide performance tracking, weak-chapter heatmaps, and benchmarking. | Schools, coaching centers, government |
| **Government/board partnerships** | Larger-scale contracts for standardized assessment support, national curriculum weak-point analytics, or pilot integration into board-level testing infrastructure. | Ministry of Education, education boards |
| **White-label licensing** | Coaching centers brand the grading tool as their own value-add to differentiate from competitors. | Coaching centers |

### 7.4 Target Market Segmentation

| Segment | Description | Role in the model |
|---|---|---|
| **SSC/HSC students (13–19)** | ~3.2M/year sitting exams, ~6–8M in active 2–3 year preparation windows | Free users; the mission and the data/credibility engine |
| **Coaching centers** | Dense, competitive market across Dhaka and major cities; currently grade weekly mock tests by hand | Primary early revenue driver; fastest sales cycle |
| **Schools** | Both public and private, at SSC/HSC level | Mid-term revenue driver; longer sales cycle, higher trust bar |
| **Government / education boards** | Ministry of Education, the 11 boards, BANBEIS | Long-term, highest-value, highest-effort revenue driver; validates the model nationally |

### 7.5 Go-to-Market Sequencing

1. **Coaching centers first** — fastest to close, most price-sensitive to labor savings, and the best environment to calibrate grading against real, messy handwriting at manageable scale.
2. **Schools next** — once grading accuracy and case studies exist from the coaching center pilots, schools are a natural expansion with a longer but more defensible sales cycle.
3. **Government last (but highest ceiling)** — approached once there's a credible track record (accuracy data, adoption numbers, testimonials) to support a national-level conversation.

### 7.6 B2C Pre-Launch: The Waitlist

Before the product is fully built, Phase 1 runs a **dedicated B2C digital marketing push** — social media ads, coaching-center and campus outreach, and content aimed directly at SSC/HSC students — driving to a **waitlist landing page** rather than a live product.

This does three things at once:
- **Validates real demand** before engineering time is spent at scale — sign-up numbers and campaign response rates become an early, honest signal of whether "free AI grading" actually resonates with students, not just with investors.
- **Builds a ready-made launch audience** — the web/mobile beta in Phase 3–4 launches to a warm list instead of starting from zero.
- **Gives investors traction to point to** — a waitlist number alongside the market-size data in Section 6 turns "here's the opportunity" into "here's early evidence people want this," which is a meaningfully stronger pitch position.

This is a B2C-only motion — it runs in parallel with, not instead of, the B2B sequencing above, since the two audiences are acquired through completely different channels (consumer ads and organic/social for students; direct outreach and pilots for institutions).

---

## 8. Roadmap (Bangladesh Phase)

| Phase | Timing | Focus |
|---|---|---|
| **Phase 1 — Demo, waitlist & seed funding** | Weeks 1–3 | Finalize web demo, launch a **student waitlist landing page** backed by a B2C digital marketing push (social ads, coaching-center/campus outreach) to validate demand and build a launch list, pitch investors on TAM + early waitlist traction, secure capital/cloud credits |
| **Phase 2 — RAG pipeline & MVP** | Weeks 4–8 | Digitize NCTB curriculum for Physics/Chemistry/Math/English, build the n8n grading pipeline |
| **Phase 3 — Web beta & B2B pilot** | Weeks 9–12 | Launch web app, onboard 2–3 coaching centers, calibrate grading against real handwriting |
| **Phase 4 — Mobile & scaling** | Weeks 13–20 | Ship Flutter mobile app, expand to Humanities/Commerce, begin school-level B2B sales |
| **Phase 5 — Government engagement** | Post-Week 20 | Approach boards/ministry with pilot data and adoption evidence |
| **Phase 6 — Global expansion** | Long-term | Adapt the same free-for-students / paid-for-institutions model to other exam-heavy education systems |

---

## 9. Why This Is Defensible

- **Curriculum-grounded, not generic** — grading is pinned to actual NCTB textbooks and board rubrics via RAG, not open-ended LLM guessing. This is the difference between a toy demo and something a school will trust with real grades.
- **B2B distribution moat** — coaching centers already own the trust relationship with parents and the weekly grading workload; selling through them is faster than acquiring students one at a time, and hard for a new entrant to replicate quickly.
- **Mission-aligned free tier is a genuine differentiator, not just marketing** — most ed-tech in this space eventually paywalls the thing that actually helps (personalized feedback). SheraTutor's B2B-funded model means the free tier never has to be hollowed out to protect margins.
- **Data flywheel** — every free student interaction improves the grading model, which improves the B2B product, which funds more free access. The two sides reinforce each other rather than compete for resources.

---

## 10. Key Risks & Open Questions (worth tracking honestly)

- **Grading accuracy at scale** — CQ (long-form) grading is inherently harder than MCQ; human-in-the-loop review will likely be needed for longer than expected before fully unsupervised grading is safe to claim.
- **Government sales cycles** are typically long and relationship-driven in Bangladesh; the roadmap treats this as a Phase 5+ effort deliberately, not a launch dependency.
- **Cost of "free forever"** — inference costs at national scale (millions of students) are non-trivial; the hybrid proprietary/open-source model strategy (Section 5.2) exists specifically to make this sustainable, but will need real usage data to validate unit economics.
- **Data privacy** — handling minors' academic and performance data requires careful compliance design from day one, especially once government partnerships are in scope.

---

## Sources

- Prothom Alo — SSC 2025 results: https://en.prothomalo.com/youth/education/r0yh261bux
- BSS News Flash — SSC 2025 pass rate: https://www.bssnews.net/news-flash/290888
- The Business Standard — HSC 2025 results: https://www.tbsnews.net/bangladesh/education/hsc-2025-dhaka-board-tops-6462-pass-rate-cumilla-lowest-4886-1261906
- Bangladesh Pratidin — HSC 2025 results: https://en.bd-pratidin.com/national/2025/10/16/48794
- Dhaka Tribune — HSC 2025 institution pass rates: https://www.dhakatribune.com/bangladesh/394089/hsc-results-345-institutions-achieve-100%25-pass
- Prothom Alo — HSC 2025 lowest pass rate in 21 years: https://en.prothomalo.com/youth/education/1r36pq7bfn
- SSC Result Portal — institution/candidate counts: https://ssc2025result.com/
- Roboflow — Best Multimodal Models of 2026: https://blog.roboflow.com/best-multimodal-models/
- BentoML — Open-Source Vision Language Models 2026: https://www.bentoml.com/blog/multimodal-ai-a-guide-to-open-source-vision-language-models
- arXiv — Zero-Shot Classification of Bangla Documents (BanglaLLaMA reference): https://arxiv.org/pdf/2503.02993
