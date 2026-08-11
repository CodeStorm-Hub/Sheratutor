# SheraTutor SSC Phase — Technical & Strategic Review

**Reviewed:** `docs/SheraTutor_Full_Project_Documentation.md`, `docs/SheraTutor_Software_Requirements_Specification.md`, `docs/research-idea/*`, `Developer_Hand-Off_Guide_ SheraTutor_B2C_Web_Portal_(SSC_Phase).md`
**Date:** 2026-08-12
**Verdict:** The product thesis is sound and the architecture is directionally right. The hand-off guide, however, contains commands that will not run, model names that no longer exist, a compliance gap that is now statutory law, and an unaddressed OCR failure mode that inverts the core product promise. None of these are fatal; all are cheaper to fix now than in Week 12.

---

## 0. Severity index

| # | Finding | Severity | Fix cost now |
|---|---|---|---|
| 1 | PDPA 2026 — verifiable guardian consent for under-18s | **Blocker** | Days |
| 2 | VLM silent error-correction destroys grading validity | **Blocker** | Days (design), weeks (eval) |
| 3 | No question↔answer↔student mapping anywhere in the spec | **Blocker** | Days (design) |
| 4 | NCTB textbook copyright unaddressed | **Blocker (legal)** | Weeks (external) |
| 5 | Gemini 1.5 Flash is shut down; `--langs` flag no longer exists | High | Hours |
| 6 | SRS says n8n + Flutter, hand-off says Genkit + Next — two "approved" specs conflict | High | Hours |
| 7 | Colab CLI as production ingestion infrastructure | High | Days |
| 8 | Schema: no `institution_id` on tenant tables, no model/rubric versioning, no idempotency | High | Days |
| 9 | NFR-REL-01 (r ≥ 0.95 vs. humans) is physically unachievable | High | Hours |
| 10 | 66-book scope at the highest-risk stage (8× inflation vs. strategy doc) | High | Hours |
| 11 | No evaluation harness / golden set | High | Days |
| 12 | No unit cost model per script | Medium-High | Days |
| 13 | Bengali typography not specified (Baloo 2 has no Bengali) | Medium | Hours |
| 14 | NFR-PERF-04 (1k–10k RPS) drives wrong infrastructure | Medium | Hours |
| 15 | No abuse/quota design on a free LLM product | Medium | Days |
| 16 | No minor-safety moderation on the tutor chatbot | Medium | Days |

---

## 1. Things in the hand-off guide that will not work as written

These are verified against current upstream documentation, not recalled.

### 1.1 `marker_single --langs bn,en` — flag removed

The guide (§2.B) prescribes:

```
marker_single /path/to/textbook_bn.pdf /output/dir --langs bn,en --use_llm \
  --llm_service marker.services.ollama.OllamaService ... --mode fast
```

Current `marker` (datalab-to/marker) has **no `--langs` flag**. OCR runs through the Surya VLM, which is multilingual and does not take a language hint. The command fails on an unknown option. Remove it.

### 1.2 `--mode fast` is the wrong mode on a GPU

`--mode fast` is the **CPU-optimized** pipeline: lightweight layout detector, `pdftext` extraction, minimal VLM usage (66.6% olmocr-bench). `--mode balanced` is the GPU pipeline: Surya VLM layout, inline-math OCR, re-OCR of problem pages (76.0%). You provisioned a T4 specifically to get GPU throughput and then selected the mode that avoids using it. For NCTB textbooks — dense equations, chemical structures, Bengali script — use `balanced`.

### 1.3 `llava` is a 2023-era model

Prescribed for both `--use_llm` correction and diagram captioning. It is the weakest currently-available option for Bengali text, mathematical notation, and scientific diagrams. Current local pick is **Qwen3-VL** (Qwen3-VL-8B scores 96.1 DocVQA; explicitly recommended for multilingual OCR). If quality matters more than local-only, use a frontier API for the captioning pass only — it's a few thousand images, not a recurring cost.

### 1.4 Gemini 1.5 Flash returns 404

The guide (§4, Layer 1) names "Gemini 1.5 Flash on the free tier." All Gemini 1.0 and 1.5 models are **shut down** — requests return 404. Gemini 2.0 Flash/Flash-Lite were shut down 2026-06-01. **`gemini-2.5-flash` is scheduled for shutdown 2026-10-16**, which lands inside your Phase 3 web-beta window.

Current targets: `gemini-3.6-flash` (best token efficiency), `gemini-3.5-flash` (no announced shutdown), `gemini-3.5-flash-lite`.

**The deeper issue:** four Gemini generations were retired in ~14 months. Pin model IDs in config, never in code; store the model ID on every grading result; and add a quarterly model-deprecation review to the ops calendar. Treat model IDs as an expiring dependency, like a TLS cert.

### 1.5 Stale framework baseline

SRS §2.3 specifies "Next.js 14+, React 18." Current: **Next.js 16.3, React 19.2**. Genkit is at **1.41.0** (actively released — last publish 2026-08-11). Starting a greenfield 2026 project on React 18 means starting on a superseded baseline and inheriting a migration before launch. Target Next 16 / React 19; shadcn/ui supports React 19.

### 1.6 Marker's model weights carry a revenue ceiling

Marker's **code** is Apache-2.0, but the **model weights** are under a modified AI-Pubs OpenRAIL-M: free for research, personal use, and startups under **$5M funding/revenue**. You are raising a seed round. This is fine today and a licensing tripwire later. Track it explicitly; don't discover it during diligence.

---

## 2. Blocking legal and compliance gaps

### 2.1 Bangladesh PDPA 2026 — the biggest gap in the entire document set

Bangladesh Parliament repealed the PDPO 2025 and passed the **Personal Data Protection Act, 2026 (Law 63 of 2026)** in April 2026. The relevant provisions:

- **Anyone under 18 is a "child."** Your stated B2C audience is 13–19. The overwhelming majority of your users are children under this Act.
- **Verifiable parental or guardian consent is required before processing any child's personal data.** Consent remains valid until the child turns 18.
- **Cross-border transfer of sensitive data is heavily restricted**, with authority notification for large-scale transfers and disclosure of safeguards to data subjects.
- **Breach notification** to the Data Protection Authority where a breach causes significant damage.
- **Penalties:** up to 25 lakh BDT; up to 50 lakh BDT for significant data fiduciaries.
- **Enforcement machinery activates around May 2027** — precisely your Phase 4/5 window.

What the current documents contain on this: SRS NFR-SEC-03, one sentence, "must comply with data protection regulations for minors… images shall be scrubbed of PII before LLM model training." The hand-off guide's onboarding flow (§5.A) captures board, exam type, group, and target year, and has **no age gate and no guardian consent step at all**.

Three specific exposures:

1. **Signup.** Email/Google/Phone-OTP auth with no age verification and no guardian consent path. Every student signup is currently non-compliant processing.
2. **Cross-border inference.** A photographed answer script carries the student's name, roll, institution, and handwriting. Sending it to Gemini/OpenAI/Anthropic US endpoints is a cross-border transfer of a child's personal data. Handwriting is identifying — "scrubbing PII" does not de-identify a handwriting image.
3. **Training on student data.** Full Doc §5.3 states every graded script becomes training data. Under PDPA this is a distinct purpose requiring distinct consent — from a guardian, revocably.

**Recommended, in priority order:**
- Age gate at signup; branch to a guardian-consent flow for under-18s. SMS-to-guardian is the practical Bangladeshi mechanism (near-universal mobile penetration, works without a guardian email).
- Separate, unbundled, default-off opt-in for "use my scripts to improve the AI." Do not bundle it into ToS acceptance.
- Data map: what leaves Bangladesh, to whom, under what safeguard. Consider a regional inference endpoint or self-hosted VLM for the script-image path specifically — this also aligns with the §5.2 cost strategy, so it's one decision serving two goals.
- Retention policy on script images (e.g. auto-delete originals at 90 days, keep derived scores). Currently unbounded.
- Records of processing, breach runbook, and a named data-protection contact before the B2B pilot, because schools will ask.
- **The waitlist push in Phase 1 already collects minors' contact data.** Put a consent notice on the landing page now.

Being early here is a **sales asset**, not just a cost. A school signing a grading contract in 2027 will ask, and "we designed for PDPA from day one" closes deals against competitors who did not.

### 2.2 NCTB textbook copyright — unaddressed in every document

The plan digitizes 66 NCTB textbooks plus past board papers, stores them as retrievable chunks, and serves derived content through a **commercially licensed** B2B product. No document mentions rights, permission, or licensing.

Bangladesh's Copyright Act 2000 fair-dealing provisions cover private study, research, review, and criticism — not commercial redistribution of derived works at scale. NCTB is an autonomous body under the Ministry of Education; textbooks are state-produced but not, as far as available sources show, released under an open licence.

This cuts both ways: it's a genuine legal risk, and an **NCTB MoU is exactly the kind of moat** the "defensibility" section claims but doesn't currently have. A competitor with better engineering cannot replicate a licensing agreement. Start that conversation in Phase 1 — government timelines in Bangladesh are measured in quarters, and you have this at Phase 5.

---

## 3. The technical risk nobody has named: transcription fidelity

This is the most serious product-level finding in the review.

Recent benchmarking of Bengali handwritten transcription (**BanglaWild**, arXiv 2608.03884) documents a specific VLM failure mode: **over-correction — models silently fix errors rather than transcribing verbatim.** The same literature notes that VLM multilingual claims skew heavily toward English and Chinese, and that the marketing-to-measurement gap is "particularly acute" for low-resource Indic scripts.

For every normal OCR application, silent correction is a *feature*. For a grading product it is **catastrophic and inverted**: you need the student's mistakes preserved exactly. If the VLM reads a student's `÷100` and normalizes it to `÷1000`, or repairs a misspelt technical term, the pipeline awards marks for an answer that was wrong. The system doesn't grade harshly — it grades *generously and invisibly*, which is far worse for trust with schools.

Worse, **NFR-REL-01 cannot detect this.** Score correlation against human examiners can look healthy on average while the system systematically over-credits a specific class of error. The metric is blind to the failure.

Nothing in the SRS, the AI strategy doc, or the hand-off guide addresses this.

**Recommended mitigations:**
1. **Verbatim-transcription prompting** with explicit anti-correction instruction, and low temperature. Necessary, not sufficient.
2. **Add a transcription-fidelity NFR, separate from grading accuracy.** Character Error Rate against human-transcribed ground truth, reported separately for correct and incorrect student answers. If CER is materially lower on incorrect answers, the model is correcting.
3. **Two-pass verification.** After the rubric evaluator awards or denies a step, re-check that step against the image crop rather than the text intermediate. Grade math steps from the image with the rubric in context; text is a lossy intermediate for notation.
4. **Show the student the transcription** with a one-tap "this isn't what I wrote" flag. This is a UX feature, a compliance feature (correction right under PDPA), and your highest-signal free labelling channel simultaneously.
5. **Build the eval set before the pipeline.** ~200 real scripts, human-transcribed and human-double-graded, is the single highest-value artifact of Phase 2 and it doesn't appear anywhere in the plan.

---

## 4. The missing module: which answer belongs to which question, and to whom

FR-OCR-01 uploads multi-page images. FR-EVAL-02 grades **per question**. **No document specifies how the system determines which region of which page answers which question.** This is the load-bearing piece between the two halves of the product and it is simply absent.

It gets harder on the B2B side, which is the revenue side: `submission_type: BATCH_SCAN` implies a stack of scanned scripts from an institutional exam, where the system must also determine **whose script each one is**. Neither mapping exists in the schema or the requirements.

Options, roughly in order of effort:
- **B2C:** student selects the question number per upload. Crude, reliable, ship it in the slice.
- **B2C better:** student writes the question number; a cheap layout pass detects question-number markers.
- **B2B (recommended):** SheraTutor generates the answer sheet as part of question-paper generation (FR-GEN-03 already produces printable PDFs) with a **pre-printed QR/roll block and question-region markers**. This turns an unsolved CV problem into a printing convention, and makes your paper generator a lock-in mechanism rather than a commodity feature. This is a strategic decision, not just an implementation detail — decide it before building FR-GEN-03.

---

## 5. Infrastructure and architecture

### 5.1 Colab CLI is real, but it is not batch infrastructure

To be clear: the Colab CLI exists (Google, June 2026, Apache-2.0, `colab new --gpu T4`, `colab exec -f`, `colab download`, ships a `COLAB_SKILL.md` for agent use). The guide isn't describing a fictional tool.

But Colab's own documentation is explicit that limits are **undisclosed and variable**: idle timeouts, maximum VM lifetime, and GPU availability "vary over time" and are deliberately unpublished. Free notebooks cap at ~12h; Pro+ at ~24h with sufficient compute units. **Continuously running long computations on the free tier risks account restriction** — Colab prioritizes interactive notebook users, by design. The CLI's "automatic keep-alive daemon" mitigates idle termination, not session caps or quota exhaustion.

66 textbooks at 200–400 pages each, in `balanced` mode with a per-page VLM pass, is tens of GPU-hours. Spreading that across sessions that can terminate without warning, on an account that can be restricted for exactly this usage pattern, is a poor foundation for the artifact the entire product depends on.

The plan also doesn't use the resume primitives that already exist: `marker` supports `--skip_existing`, and `--num_chunks` / `--chunk_idx` for multi-machine sharding. Neither appears.

**Recommendation:**
- Keep Colab CLI for the **vertical slice** — one book, interactive, fast iteration. It's genuinely good for that.
- Move the **66-book run** to a real batch runner (spot L4/A100 on any cloud, or Modal/RunPod). At current spot pricing this is roughly $30–80 *total*, one time. "Free" here is being purchased with weeks of engineering time and an availability risk on the critical path.
- Either way: a `ingestion_jobs` table in Postgres (book, page range, status, attempt count, checksum) so the run is resumable and auditable. Use `--skip_existing` and shard with `--num_chunks`.

### 5.2 n8n vs. Genkit — two contradictory approved specifications

The SRS is marked **"Approved Specification, v1.0.0"** and specifies n8n throughout: the context diagram, NFR-ARCH-01 ("connected via REST/n8n"), and the tech stack table. The hand-off guide states Genkit **replaces** n8n. Same conflict on Flutter: SRS Phase 2 ships it; the hand-off says Next.js replaces the Flutter requirement.

**Genkit is the right call** — type-safe, code-centric, Zod schema enforcement for Layer 4 (which is exactly what the rubric evaluator needs), built-in tracing, in-repo with the Next.js backend, no separate service to operate. n8n for a typed, versioned, testable grading pipeline would have been a mistake.

But an approved SRS that contradicts the developer hand-off means the traceability matrix (§9) is invalid on day one and any developer will implement whichever document they read last. **Amend the SRS to v1.1 before writing code.** Note also that NFR-ARCH-01's "independent replacement of LLM providers without code refactoring" is satisfied *better* by Genkit's model abstraction than by n8n — so the requirement survives, only the mechanism changes.

### 5.3 Grading must be an async job, not an HTTP request

NFR-PERF-01 specifies ≤15s p95 for upload → OCR → RAG → LLM → JSON. Building that as a synchronous request is wrong regardless of whether 15s is achievable:

- Multi-page submissions multiply the time linearly.
- Frontier API latency is not yours to control, and p99 tail is much worse than p95.
- Vercel Functions now allow up to 800s (30 min in beta, Pro/Enterprise), so it's *possible* — which is a trap, because it makes the wrong architecture look viable.

Design it as: upload → enqueue → worker → progress via Realtime subscription → result. Supabase gives you `pgmq` for the queue and Realtime for progress push, so this stays inside the existing stack. Make jobs **idempotent with a key** — retries are certain, and without a key you will double-bill inference and double-write grading results.

Restate the NFR in user terms: "student sees per-page progress within 2s and a complete result within 30s p95 for a 3-page submission."

### 5.4 NFR-PERF-04 (1,000–10,000 RPS) drives the wrong infrastructure

Even at full national scale, 3.2M students do not generate 1,000 sustained requests per second of grading. The metric is also the wrong unit: this is a **batch throughput** system, not a request-serving system. Correct targets are *scripts graded per hour*, *concurrent grading jobs*, and *queue depth at peak*. As written, this NFR justifies infrastructure spend you don't need and doesn't constrain the thing that will actually break (worker concurrency against per-provider API rate limits — check your Gemini tier's RPM/TPM quota; that is your real ceiling).

Also verify the stated peak months. The doc says April–May and October–November; SSC written exams have typically run February–April. Getting this wrong misplans your one moment of peak load.

---

## 6. Requirements that cannot pass verification as written

### 6.1 NFR-REL-01: "Pearson r ≥ 0.95 vs. human examiners"

Human inter-rater reliability on long-form scripts typically lands around **r ≈ 0.7–0.85**. This requirement specifies that the AI agree with human examiners **more closely than human examiners agree with each other**. It cannot be met — not because the model is inadequate, but because the target exceeds the reliability of the measuring instrument.

Replace with a defensible protocol:
1. Measure **human–human agreement first** on your golden set (3 examiners, blind). That value is the ceiling.
2. Target AI–consensus agreement **within the human–human band**, using **quadratic-weighted kappa** (the standard for ordinal mark agreement) rather than Pearson r, which is insensitive to systematic offset.
3. Report **mean absolute error in marks** as the number you actually take to schools — "average deviation 0.6 marks out of 10" is more persuasive and more honest than a correlation coefficient.
4. Report separately for MCQ and CQ. Averaging them hides the only hard case.

### 6.2 Other untestable requirements

- **FR-OCR-03 / §9: ">90% character accuracy on messy khata scripts."** No dataset, no annotation protocol, no definition of "messy." Untestable as written. Define the corpus (size, sourcing, board mix, handwriting-quality strata) and version it.
- **NFR-REL-03: "100% of facts cited reference indexed NCTB material."** Unenforceable at 100%. Needs a citation-span check, a refusal path when retrieval is weak, and an accepted threshold with escalation.
- **NFR-REL-02: 99.9% uptime SLA.** Your dependency chain is Supabase + Vercel + a third-party LLM API + (currently) Colab. You cannot offer a contractual 99.9% on top of dependencies whose combined availability you don't control and whose SLAs you haven't purchased. Do not put this in a B2B contract. State a target internally; commit to a support-response SLA externally, which you *can* control.

---

## 7. Data model review

Against SRS §6.1 ERD and hand-off §3.

**Correctness / integrity**

1. **No curriculum versioning.** `NCTB_CURRICULUM_EMBEDDINGS` has `chapter_id`, content, embedding, rubric, page ref — and no `curriculum_version` or `book_edition_year`. NCTB revises curricula; Bangladesh has been mid-reform. Without a version column you cannot deprecate superseded chunks and will ground grading in withdrawn content. Add `curriculum_version` and `language_tag` (the hand-off adds the latter; the SRS ERD is missing both — reconcile).
2. **`embedding vector(1536)` hardcodes a model.** 1536 implies OpenAI `text-embedding-3-small`. No document justifies it for Bengali. Candidates worth benchmarking: **BGE-M3** (1024-dim, self-hostable, explicitly covers Bengali among low-resource Indic languages, 8192-token context) and `gemini-embedding-001` (configurable dims). Decide **empirically** on your own Bangla retrieval set.
   More importantly: **don't model embeddings as a column you have to `ALTER`.** Use a separate `chunk_embeddings(chunk_id, model_name, model_version, embedding)` table so you can re-embed with a new model, run both in parallel, and cut over — without a migration on your largest table.
3. **No vector index specified anywhere.** Use **HNSW** with `vector_cosine_ops` (pgvector 0.8+; parallel builds cut index time 30–50%). Critically: you will *always* filter by `chapter_id` + `language_tag`, and HNSW + filtering is the classic recall trap. Plan for partial indexes per language, or `hnsw.iterative_scan = relaxed_order`. Keep the index resident in memory — that is the single biggest pgvector performance factor. This is your most consequential retrieval decision and it's absent from both documents.
4. **Rubrics are modeled twice, in the wrong places.** `official_rubric_rules jsonb` sits on the *embeddings* table (rubrics are per-question, not per-chunk) and `rubric_criteria_json` sits on `QUESTIONS`. Give rubrics their own **versioned** table — you will correct a rubric and need to re-grade prior submissions against the corrected version, and prove which version produced which mark.
5. **Marks stored as `float`.** `score_obtained`, `max_marks`, `total_score_obtained` are floats. Marks come in 0.5 increments and get summed. Use `numeric(5,2)`. Float accumulation will produce 47.99999-mark totals on a document a parent reads.
6. **`WEAKNESS_LOGS` is a log modeled as a state table.** Described as "maintain a `weakness_score`," named as a log, with no unique constraint on `(student_id, chapter_id)`. As written you get duplicate rows and non-deterministic dashboards. Either append-only with a computed view, or add the unique constraint and upsert. Pick one.
7. **`USERS.password_hash`.** With Supabase Auth, credentials live in `auth.users`. A `password_hash` column in `public.users` is a security anti-pattern and reads like a copy-paste from a generic ERD. `public.users` should be a profile table keyed to `auth.users.id`.
8. **`STUDENT_PROFILES.group`** — `group` is a SQL reserved word requiring quoting everywhere. Rename `academic_group`.

**Multi-tenancy (FR-AUTH-03, NFR-SEC-02)**

9. **`institution_id` is missing from every tenant-scoped table.** `EXAM_SUBMISSIONS`, `SUBMISSION_PAGES`, `GRADING_RESULTS`, `WEAKNESS_LOGS`, `QUESTIONS` have no tenant column. Isolating via multi-hop joins back to `TEACHER_PROFILES` is both slow and fragile — and the requirement is "100% block rate on cross-tenant queries" between **competing coaching centers**, so a single missed join is a commercial incident.
   Denormalize `institution_id` onto every tenant-scoped table, index it, and write policies against it directly.
10. **RLS policy shape matters as much as its presence.** Per Supabase's own guidance: wrap auth calls — `(select auth.uid())`, not bare `auth.uid()`, which is re-evaluated **per row** (100×+ difference at scale). For membership checks use a `SECURITY DEFINER` helper in a **private** schema with an explicit `auth.uid()` check inside the function body and `EXECUTE` revoked from `anon`/`authenticated`. Index every column referenced in a policy. Add `force row level security` so table owners don't bypass it.
11. **RLS needs continuous automated testing**, as NFR-SEC-02 itself says. There is no test harness in the plan. This should be a CI gate, not a manual audit.

**Auditability and operations**

12. **`GRADING_RESULTS` has no provenance.** No `model_name`, `model_version`, `prompt_version`, `rubric_version`, or `pipeline_version`. The entire architecture is designed for swapping models (NFR-ARCH-01/02) — but after a swap you cannot tell which scores came from which model, cannot re-grade selectively, and cannot answer a school asking why a mark changed. Non-negotiable.
13. **No audit log.** A system that assigns marks needs append-only audit of every score creation and change, especially with the FR-EVAL-03 human override.
14. **FR-EVAL-03's "calibration queue" doesn't exist.** Teacher overrides are described as feeding "correction vectors back into the evaluation calibration queue." There is no queue and no table. This is your most valuable proprietary dataset — expert corrections on real Bangla scripts, which no competitor can buy — and it has nowhere to live. Model it first-class: `grading_corrections(result_id, teacher_id, original_score, corrected_score, reason, rubric_step, created_at)`.
15. **`EXAM_SUBMISSIONS.status` has no state machine**, no `attempt_count`, no `error_detail`, no `idempotency_key`. See §5.3.
16. **No partitioning plan** for `SUBMISSION_PAGES` and `GRADING_RESULTS`, which will dominate volume. Not urgent at pilot scale; decide the partition key (submitted month, or institution) before the B2B pilot rather than after.
17. **No cost telemetry.** Add `input_tokens`, `output_tokens`, `vision_pages`, `est_cost_usd` per grading result. See §8.2.

---

## 8. Gaps in the plan — things simply not present

### 8.1 No evaluation harness or golden set
There is a traceability matrix but no test dataset, no labelled corpus, no CI eval gate. You cannot safely iterate prompts, swap models, or prove NFR-REL-01 without one. Every subsequent decision in this document depends on it. **This is Week 1 work, not Week 12 work** — currently it appears at "calibration" in Weeks 9–12, after the pipeline is built and the architecture is frozen.

### 8.2 No unit cost model
The entire business model is "B2B revenue funds free B2C." No document contains a cost-per-script figure — vision cost per page, grading LLM cost per question, storage per submission, human-review cost per audited script. Without it, "free forever" is unfalsifiable and the B2B pricing has no floor. Instrument from day one (§7.17) and publish an internal cost-per-graded-script dashboard by end of the vertical slice. The research doc correctly flags human-in-the-loop as "a cost center to plan for explicitly" — nobody has planned it.

### 8.3 No abuse or quota design
A free product making expensive inference calls, with no per-user rate limits, will be drained — by scrapers, by competitors benchmarking you, and by ordinary enthusiastic users. Per-user daily grading quotas are **not** a violation of the free-forever promise (which is about not gating *quality* or charging money); they're capacity management. Design them now, generously.

### 8.4 No minor-safety layer on the tutor chatbot
FR-CHAT-01/02 is an open-ended conversational agent talking to 13-year-olds, in Bangla, with no moderation on input or output, no topic boundaries, and no escalation path for self-harm or abuse disclosure. For a product seeking government partnership and school trust, this is the kind of gap that ends a pilot. Add input/output moderation, a scoped system prompt that declines off-topic conversation, logging, and a documented escalation procedure.

### 8.5 No low-bandwidth design
Target users are on mobile data in Bangladesh, often metered 3G/4G. The plan uploads multi-page HEIC/PDF scripts. NFR-PERF-03 covers LCP but nothing covers **upload payload**. Required: client-side downscale + re-encode before upload (a 12MP HEIC becomes ~300KB at grading-sufficient quality), resumable/chunked uploads, retry on flaky connections, and a visible data-usage estimate. This directly determines whether rural students can use the product at all — which is the stated mission.

### 8.6 Bengali typography is not specified
The design system names **Baloo 2** (display), **Inter** (body), **Space Mono** (labels). **Baloo 2 is the Latin/Devanagari sibling; the Bengali family is Baloo Da 2.** Inter has no Bengali coverage. Space Mono has none. A bilingual product whose primary language is Bangla currently has no specified Bengali typeface for any role.

Fix: **Baloo Da 2** for display (preserves the brand's exact voice in Bangla — same superfamily), **Noto Sans Bengali** or **Hind Siliguri** for body, and a Latin-only fallback chain for the mono role. Subset aggressively: Bengali fonts are large, and this interacts directly with §8.5 and the 2.5s LCP target. Also missing: locale routing strategy, translation management, and a decision on whether Bangla or English is the default.

### 8.7 No observability, CI/CD, or environment strategy
Genkit ships tracing; nothing says where traces go. No mention of environments, migration tooling, seed data, branch strategy, error tracking, or a staging tenant for B2B pilots. For a hand-off guide, this is a notable omission — it's the section a new developer needs on day one.

### 8.8 No accessibility requirements
Not mentioned in any document. Relevant to government procurement later.

---

## 9. Sequencing and scope

### 9.1 The vertical slice has one step in the wrong order
The §6 sequence is: digitize a book → build DB + Genkit flow → build frontend → validate → ingest the other 65.

The instinct is right; the ordering buries the riskiest unknown behind the slowest task. **Grading quality — not ingestion — is the thing that can kill the product**, and you can test it with ten hand-entered rubrics and zero RAG in about two days.

Revised:
1. **Days 1–3:** 10 real Physics questions, rubrics typed by hand into a JSON file, 30 real handwritten scripts photographed. Run Layer 1 → Layer 4 with no retrieval. Compare to human marks. **This answers "does AI grading of Bangla scripts work at all?" before a single textbook is processed.**
2. **Days 4–5:** Add the transcription-fidelity measurement from §3. Determine whether silent correction is occurring at a rate that breaks grading.
3. **Week 2:** *Then* ingest one book and measure whether RAG grounding measurably improves grading over hand-entered rubrics. If it doesn't, you've learned something enormous about where to spend the next two months.
4. **Week 3+:** Frontend, then scale ingestion.

### 9.2 66 books is an 8× scope inflation at the highest-risk stage
The hand-off guide scopes "33 subjects × 2 languages = 66 textbooks" for the SSC phase. The AI strategy doc scopes Phase 2 as "Physics, Chemistry, Math, and English" — **4 subjects × 2 languages = 8 books.** The strategy doc is right; these are the subjects where CQ grading is most tractable (objective rubrics, verifiable steps) and where students feel the most pain.

Humanities and Commerce involve genuinely subjective long-form marking and, per your own research doc, "will need more calibration." Attempting them in the same phase as the first working pipeline compounds two hard problems. Ship 8 books, prove grading, then expand.

### 9.3 Plan and reality have diverged; re-baseline
The SRS Gantt shows Phase 1 (demo + waitlist) as **done**, dated 2026-08-01 to 08-21. The repository contains a 15-byte README and no code. Market figures are 2025 board results, and your own note says to re-check against 2026 results before using them in a live pitch — SSC 2026 results were expected this month. Re-baseline the Gantt and refresh the market table before the next investor conversation; a stale figure in a pitch deck is an easy, avoidable credibility hit.

### 9.4 Competitive timing
"Bangladesh's first AI board examiner" appears to hold specifically for **handwritten script grading** — 10 Minute School (~$9.26M raised, the best-funded Bangladeshi edtech) and Shikho (Shikho AI beta: Bangla doubt-solving, fine-tuned education models, RLHF) are both active in AI but not, per available reporting, in handwritten evaluation. That is a real and defensible gap.

It is also a **narrow window** against competitors with distribution you don't have. This argues strongly for §9.2: ship 8 books and a working grading loop in 6 weeks rather than 66 books and a perfect corpus in 16.

---

## 10. What is right and should not be changed

Worth stating explicitly, because the above is uniformly critical:

- **Genkit over n8n** is the correct call, for the correct reasons (type safety, Zod-enforced Layer 4, in-repo, traceable, testable).
- **pgvector in Postgres over a dedicated vector DB** is correct at this scale — one datastore, one backup story, RLS applies uniformly, and HNSW comfortably handles your corpus size.
- **Structured JSON rubric output as the grading mechanism** (rather than free-text grading) is the single best architectural decision in the documents. It is what makes grading auditable, correctable, and defensible to a parent — and it's what turns Layer 4 into a real component rather than a prompt.
- **Separable pipeline layers** with an open-source fallback path is genuinely forward-thinking, and the note to "re-validate model recommendations before committing" is exactly the right instinct (this review is that re-validation).
- **The vertical-slice instinct** — prove one subject end-to-end before scaling — is right; only the internal ordering needs adjusting.
- **The two-sided business model** is coherent and the B2B-funds-B2C logic holds, provided §8.2 gets built.
- **The design system's icon rationale** — rejecting the mortarboard as culturally imported, choosing the answer script + tick because students recognize their own khata — is unusually well-reasoned and should survive contact with any future designer.

---

## 11. Recommended next actions, in order

**Before any code:**
1. Amend the SRS to v1.1: Genkit replaces n8n, Next 16/React 19, Gemini 3.x model IDs, Flutter deferred. Reconcile with the hand-off guide so there is one authoritative spec.
2. Rewrite NFR-REL-01 per §6.1, NFR-PERF-01 per §5.3, NFR-PERF-04 per §5.4, and add the transcription-fidelity NFR from §3.
3. Decide the answer-sheet convention (§4) — it constrains the schema, the paper generator, and the B2B product.
4. Open the NCTB licensing conversation (§2.2).

**Week 1:**
5. Build the golden set: 30 scripts, 10 questions, human transcriptions, 3-examiner blind marks (§8.1).
6. Run the no-RAG grading spike (§9.1) and measure transcription fidelity (§3).
7. Fix the schema before the first migration: `institution_id` everywhere, versioned rubrics table, separate embeddings table, `numeric` marks, provenance columns, corrections table, idempotency keys (§7).

**Week 2:**
8. Design the age gate + guardian consent flow and the separate training-data opt-in (§2.1). Put a consent notice on the waitlist page today.
9. Benchmark BGE-M3 vs. `gemini-embedding-001` on your own Bangla retrieval set before committing to a dimension (§7.2).
10. Move ingestion off Colab for the 66/8-book run; add the `ingestion_jobs` table and use `--skip_existing` / `--num_chunks` (§5.1).
11. Stand up cost telemetry (§8.2).

**Before the B2B pilot:**
12. RLS test harness in CI (§7.11). Chatbot moderation + escalation path (§8.4). Retention policy on script images (§2.1). Bengali font stack and low-bandwidth upload path (§8.5, §8.6).

---

## Sources

- [Introducing the Google Colab CLI — Google Developers Blog](https://developers.googleblog.com/introducing-the-google-colab-cli/)
- [google-colab-cli — GitHub](https://github.com/googlecolab/google-colab-cli)
- [Google Colab FAQ (resource limits)](https://research.google.com/colaboratory/faq.html)
- [marker — datalab-to/marker, GitHub](https://github.com/datalab-to/marker)
- [Gemini deprecations — Google AI for Developers](https://ai.google.dev/gemini-api/docs/deprecations)
- [Gemini API release notes](https://ai.google.dev/gemini-api/docs/changelog)
- [Genkit Next.js integration](https://firebase.google.com/docs/genkit/nextjs)
- [Bangladesh Personal Data Protection Act, 2026 — Securiti overview](https://securiti.ai/bangladesh-personal-data-protection-act-overview/)
- [Personal Data Protection (Amendment) Ordinance, 2026 — Digital Policy Alert](https://digitalpolicyalert.org/change/18757-personal-data-protection-amendment-ordinance-2026-ordinance-no-23-of-2026)
- [Copyright law of Bangladesh](https://en.wikipedia.org/wiki/Copyright_law_of_Bangladesh)
- [BanglaWild: An In-the-Wild Bengali Scene Text Recognition Benchmark for OCR and Vision-Language Models — arXiv](https://arxiv.org/html/2608.03884v1)
- [Supabase — HNSW indexes](https://supabase.com/docs/guides/ai/vector-indexes/hnsw-indexes)
- [pgvector — GitHub](https://github.com/pgvector/pgvector)
- [Supabase — Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Vercel Functions can now run up to 30 minutes](https://vercel.com/changelog/vercel-functions-can-now-run-up-to-30-minutes)
- [Vercel Functions limits](https://vercel.com/docs/functions/limitations)
- [The Best Open-Source Embedding Models in 2026 — BentoML](https://www.bentoml.com/blog/a-guide-to-open-source-embedding-models)
- [Best Local Vision Language Models in 2026 — TinyWeights](https://tinyweights.dev/posts/best-local-vision-language-models-2026/)
- [Shikho aims to bring in the AI hype to ed-tech — The Daily Star](https://www.thedailystar.net/tech-startup/news/shikho-aims-bring-the-ai-hype-ed-tech-heres-how-3822316)
- [EdTech Startups in Bangladesh — Tracxn](https://tracxn.com/d/explore/edtech-startups-in-bangladesh/__LnWQTvQWVqO9od8WTqyJtvudqHMORoRUj57if73lRPU)
