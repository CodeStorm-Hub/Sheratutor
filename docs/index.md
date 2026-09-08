---
layout: home
title: SheraTutor Documentation Portal
description: Complete Technical Architecture, Curriculum Corpus, and Ingestion Specifications for SheraTutor AI
---

# SheraTutor Documentation Portal

<div class="sheratutor-hero-badge">
  <span class="badge-tag">OFFICIAL PRODUCTION SPECIFICATIONS</span>
  <span class="badge-status">NCTB SSC &amp; HSC CURRICULUM READY</span>
  <span class="badge-version">v2.4 PRODUCTION</span>
</div>

> **"SheraTutor, for Shera Students."**  
> Bangladesh's first AI board examiner and personalized learning workspace — engineered specifically for secondary and higher secondary candidates, providing instant handwritten script grading, rubric-grounded step evaluations, and bilingual curriculum tutoring.

---

## Architecture & System Highlights

<div class="bento-grid" markdown>

<div class="bento-card bento-wide" markdown>

### :material-creation: Dual-Engine AI Examiner & Learning Workspace

SheraTutor combines multimodal vision extraction with national curriculum vector grounding to replicate the rigor of official Bangladesh Education Board examiners. Students photograph handwritten exam scripts, which are evaluated against official rubrics within 3.5 seconds.

```mermaid
flowchart LR
    A["📸 Student Exam Script<br/>(Handwritten Photo)"] --> B["👁️ Vision Extraction<br/>(NVIDIA NIM OCR)"]
    B --> C["📚 Vector Grounding<br/>(57 NCTB Textbooks)"]
    C --> D["⚖️ Board Examiner LLM<br/>(Rubric Grading Engine)"]
    D --> E["🎯 Step Breakdown<br/>(Actionable Feedback)"]
```

[:octicons-arrow-right-24: Explore System Architecture](architecture/system-architecture.md)

</div>

<div class="bento-card" markdown>

### :material-book-open-page-variant: 57 NCTB Textbooks

Complete physical cataloging and multimodal ingestion of all Class 9–10 textbooks (6,432 curriculum pages) across Science, Commerce, and Humanities.

- **Embedding Model**: BGE-M3 Dense + Sparse
- **Storage**: Supabase PostgreSQL 17 + pgvector
- **Recall Rate**: > 98.4% textbook grounding

[:octicons-arrow-right-24: View Ingestion Pipeline](pipelines/textbook-corpus-report.md)

</div>

<div class="bento-card" markdown>

### :material-cpu-64-bit: Google Genkit Engine

Engineered with Google Genkit v1.41+ running 7 specialized production AI flows with OpenTelemetry distributed tracing and the Reflection API.

- **Streaming**: Server-Sent Events (SSE)
- **Rubrics**: Step-by-step mark deduction
- **Bilingual**: Bengali & English reasoning

[:octicons-arrow-right-24: Genkit Deep Dive](architecture/genkit-architecture.md)

</div>

<div class="bento-card bento-wide" markdown>

### :material-television-play: Interactive Visual Explorers

8 self-contained interactive web applications and simulation dashboards visualizing every layer of our technology stack:

<div class="explorer-pills">
  <a href="visual-explorers/apps/sheratutor-architecture.html" target="_blank" class="app-pill">SheraTutor Architecture</a>
  <a href="visual-explorers/apps/genkit-architecture.html" target="_blank" class="app-pill">Google Genkit Explorer</a>
  <a href="visual-explorers/apps/genkit-integration.html" target="_blank" class="app-pill">SheraTutor + Genkit Flows</a>
  <a href="visual-explorers/apps/azure-foundry.html" target="_blank" class="app-pill">Azure AI Foundry</a>
  <a href="visual-explorers/apps/multimodal-foundry.html" target="_blank" class="app-pill">Multimodal Vector DB</a>
  <a href="visual-explorers/apps/foundry-transformation.html" target="_blank" class="app-pill">Transformation Blueprint</a>
  <a href="visual-explorers/apps/corpus-audit-dashboard.html" target="_blank" class="app-pill">Corpus Audit Dashboard</a>
  <a href="visual-explorers/apps/boardmate-pitch-deck.html" target="_blank" class="app-pill">BoardMate Pitch Deck</a>
</div>

[:octicons-arrow-right-24: Open Visual Explorers Showcase Hub](visual-explorers/index.md)

</div>

<div class="bento-card" markdown>

### :material-clipboard-check-outline: Specifications & SRS

Complete IEEE Std 830-compliant Software Requirements Specification (SRS), launch checklists, and institutional B2B business modeling.

- **Candidate Reach**: ~3.2M students/year
- **Student Pricing**: 100% Free Forever
- **Model**: Subsidized by school B2B licenses

[:octicons-arrow-right-24: Read Requirements Spec](overview/software-requirements-spec.md)

</div>

<div class="bento-card" markdown>

### :material-test-tube: Automated QA & Testing

7 end-to-end browser test suites validating camera uploads, Bangla OCR parsing, persistence recovery, and WCAG AA accessibility compliance.

- **Suites Passed**: 7 of 7 suites green
- **Persistence**: Zero-loss session state
- **Devices**: Mobile (375px), Tablet, Desktop

[:octicons-arrow-right-24: Inspect Test Results](quality/automated-testing-report.md)

</div>

</div>

---

## Documentation Sections

<div class="grid cards" markdown>

-   :material-compass-outline: **[Overview & Strategy](overview/index.md)**

    ---

    Core product vision, mission, market sizing (~3.2M candidates annually), institutional SaaS model, design tokens, and launch checklists.

    [:octicons-arrow-right-24: Browse Overview](overview/index.md)

-   :material-sitemap: **[System Architecture & AI](architecture/index.md)**

    ---

    Full-stack architecture report covering Next.js 16 App Router, React 19, Supabase Postgres 17, pgvector, Google Genkit, and Azure Foundry blueprints.

    [:octicons-arrow-right-24: Explore Architecture](architecture/index.md)

-   :material-book-open-page-variant-outline: **[Curriculum & Ingestion](pipelines/index.md)**

    ---

    Complete audit of all 57 NCTB Class 9–10 textbooks (6,432 pages), multimodal NVIDIA NIM Vision extraction, and physics/chemistry RAG pipelines.

    [:octicons-arrow-right-24: Inspect Pipelines](pipelines/index.md)

-   :material-shield-check-outline: **[Quality Assurance & Audits](quality/index.md)**

    ---

    IEEE QA test suites, automated browser testing walkthroughs, live database persistence audits, and codebase gap analyses.

    [:octicons-arrow-right-24: View QA Audits](quality/index.md)

-   :material-television-play: **[Visual Explorers Hub](visual-explorers/index.md)**

    ---

    8 interactive web apps exploring architecture, Genkit flows, Foundry services, and corpus telemetry, plus whitepaper and pitch deck downloads.

    [:octicons-arrow-right-24: Open Explorers Hub](visual-explorers/index.md)

-   :material-microsoft-azure: **[Azure Foundry Reference](azure-foundry/index.md)**

    ---

    Exhaustive 63-document technical reference library covering Microsoft Azure AI Foundry Agent Service, Agent Canvas, Model Router, and MCP tooling.

    [:octicons-arrow-right-24: Browse Foundry Reference](azure-foundry/index.md)

</div>

---

## Key Platform Metrics

| Metric | Target / Verified | Verification Method / Status |
|---|---|---|
| **Annual Candidate Target** | ~3.2 Million SSC & HSC candidates | BANBEIS Official Education Census |
| **NCTB Textbook Corpus** | 57 Textbooks (6,432 curriculum pages) | Physical Cataloged & Checksum Verified |
| **Frontend Framework** | Next.js 16 + React 19 + Tailwind CSS v4 | Production Web App (`web/`) |
| **Database & Vector Engine** | PostgreSQL 17 + pgvector (HNSW) | Supabase Hosted Database |
| **AI Orchestration** | Google Genkit v1.41+ & NVIDIA NIM Vision | Hybrid Dense/Sparse RAG Pipeline |
| **Grading Latency SLA** | < 3.5s per handwritten exam page | Server-Sent Events (SSE) Streaming |
| **Student Access** | 100% Free Forever | Subsidized by Institutional B2B SaaS |
