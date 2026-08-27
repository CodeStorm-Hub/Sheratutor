# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** SSC (Grade 10) and HSC (Grade 12) students in Bangladesh preparing for national board exams (~3.2M candidate TAM annually across 11 education boards).
- **Secondary:** Teachers, coaching centers, and school administrators needing automated grading and NCTB-aligned question paper generation.

## Product Purpose

Democratize expert-level exam preparation in Bangladesh by providing every student with an instant, always-available AI board examiner and personalized tutor for free—funded sustainably by selling assessment and grading infrastructure to institutions.

## Positioning

Unlike generic AI tutors or Western-centric ed-tech platforms, SheraTutor is grounded directly in the NCTB curriculum and official Bangladesh board-exam grading rubrics. It reads both Bangla and English handwriting, equations, and diagrams, providing granular step-by-step mark deduction explanations and gap analysis aligned with real board examiners.

## Operating Context

- **Student Context:** High-stakes exam preparation under pressure, varying internet bandwidth across divisional and rural Bangladesh, studying handwritten khata/scripts and NCTB textbook chapters.
- **Institutional Context:** High-volume term and mock exam grading, manual question paper creation, parent-teacher diagnostic reporting.

## Capabilities and Constraints

- **Capabilities:**
  - Vision-powered OCR and grading for handwritten exam scripts (Creative Questions & Multiple Choice Questions).
  - Step-by-step mark breakdown explaining exactly where and why marks were deducted.
  - NCTB-grounded conversational AI tutor ("Explain it simply") with bilingual Bangla/English support.
  - Adaptive study planner dynamically targeting weak chapters based on performance analytics.
  - Board-standard mock exam and question paper generator.
- **Constraints & Stack:**
  - Next.js (App Router, React 19, Tailwind CSS v4, Radix UI / shadcn).
  - Supabase Auth, PostgreSQL, and `pgvector` for RAG vector embeddings.
  - Genkit / multi-layer AI pipeline with KaTeX math rendering.
  - Strictly free access for students (no paywalls, no gating of core grading quality).

## Brand Commitments

- **Name & Domain:** SheraTutor (`sheratutor.ai`), "Shera" meaning "best/top" in Bangla.
- **Tagline:** "SheraTutor, for **Shera**Students"
- **Visual Identity:**
  - Dominant colors: Ink Navy (`#14182B`), Card Navy (`#1E2761`), Paper White (`#FFFFFF`), Paper Gray (`#F4F5FB`).
  - Signature Accents: Coral (`#FF6B57`, primary action/wordmark), Mint (`#23D9A5`, AI indicator/sparkle), Sunshine (`#FFC93C`, merit star).
  - Typography: Baloo 2 (headlines/wordmarks - energetic, youthful), Inter (clean UI body text), Space Mono (labels, precision exam stats).
  - Iconography: Tilted exam answer script with coral grading tick, mint AI sparkle, and sunshine merit star.
- **Voice & Tone:** Warm, aspirational, energetic, encouraging, culturally rooted in Bangladeshi student life, avoiding generic corporate SaaS jargon.

## Evidence on Hand

- Comprehensive Software Requirements Specification (`docs/SheraTutor_Software_Requirements_Specification.md`).
- Project overview, market analysis, design system specifications, and tech stack documentation (`docs/research-idea/`).
- Official brand assets and logos (`docs/assets/`).
- Active Next.js application routes, AI Genkit flows, and evaluation scripts (`src/`).

## Product Principles

1. **Free for Every Student:** Core feedback, AI grading, and learning tools remain genuinely free—no artificial feature paywalls.
2. **Curriculum-Grounded Truth:** Feedback is strictly anchored to NCTB textbooks and official board rubrics, not speculative LLM generation.
3. **Actionable Diagnostics over Bare Scores:** Every deduction must explain the missing concept or calculation step to build mastery.
4. **Built for Bangladeshi Learners:** Culturally attuned UI, bilingual Bangla/English support, and resilient performance across diverse devices and connections.

## Accessibility & Inclusion

- High contrast text readability across light and dark modes.
- Support for assistive technologies, keyboard navigability, and clear focus states.
- Mobile-responsive layouts accommodating diverse screen sizes and touch devices.
