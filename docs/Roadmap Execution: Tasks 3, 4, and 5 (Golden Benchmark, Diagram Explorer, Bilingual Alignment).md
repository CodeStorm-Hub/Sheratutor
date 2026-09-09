# Roadmap Execution: Tasks 3, 4, and 5 (Golden Benchmark, Diagram Explorer, Bilingual Alignment)

## Background & Objective
With Step 1 (Frontend Integration with Gemini 3.5 Flash Lite, Genkit, and Multimodal Diagram Cards) and Secondary API Key Failover 100% completed and verified, we now proceed step-by-step through the remaining roadmap items in [`task.md`](file:///home/syed/workspace/Sheratutor/task.md):
- **Task 3: Build the Golden Evaluation Benchmark Dataset**: Extract authentic CQs (উদ্দীপক + ক, খ, গ, ঘ) and MCQs from verified textbook exercises in `ingestion/cache_verified/chemistry_bn`, insert into Supabase `golden_set_items` and `golden_set_human_grades`, and run the Genkit evaluation harness (`web/scripts/eval-golden-set.ts`) with `gemini-3.5-flash-lite`.
- **Task 4: Interactive Diagram Explorer & Digital Study App in Next.js**: Create `/dashboard/textbook-explorer` in Next.js App Router featuring all 171 authentic NCTB figures, chapter tabs (1 to 12), instant search, LaTeX formula support, and 1-click "Ask AI Tutor about this diagram" linking directly to the grounded tutor chat.
- **Task 5: Bilingual Parallel Alignment**: Build the parallel English-Bangla terminology dictionary and curriculum alignment from `chemistry_en.pdf` to enable cross-lingual student queries.

---

## User Review Required
> [!IMPORTANT]
> The evaluation benchmark will use real textbook creative questions and simulated human examiner grading bands (scores 10, 8, 9 with average 9/10) to validate the AI rubric evaluation flow without requiring external student private data.

---

## Proposed Changes

### Task 3: Golden Evaluation Benchmark Dataset
- Create extraction script `ingestion/extract_golden_benchmark.py` to extract end-of-chapter CQs and MCQs from `ingestion/cache_verified/chemistry_bn`.
- Populate Supabase `questions`, `rubrics`, `golden_set_items`, and `golden_set_human_grades`.
- Run `web/scripts/eval-golden-set.ts` with `gemini-3.5-flash-lite` to measure transcription CER and rubric score alignment.

### Task 4: Interactive Diagram Explorer & Digital Study App (`web/`)
- Create [`web/src/app/dashboard/textbook-explorer/page.tsx`](file:///home/syed/workspace/Sheratutor/web/src/app/dashboard/textbook-explorer/page.tsx) with:
  - Chapter selector (Chapters 1–12 with authentic titles in Bengali).
  - Search bar to filter figures by caption/concept (e.g. "ড্রাই সেল", "পরমাণুর মডেল", "পাতন").
  - Responsive diagram cards with authentic figure numbers, page citations, and tags.
  - Interactive Lightbox Zoom modal.
  - "Ask AI Tutor about this diagram" button redirecting to `/dashboard/tutor` with pre-filled context and diagram URL.
- Add navigation link to textbook explorer in dashboard navigation bar / sidebar.

### Task 5: Bilingual Parallel Alignment
- Check `chemistry_en.pdf` and build `ingestion/bilingual_dictionary.json` mapping all key SSC chemistry concepts between English and Bengali (e.g., *Sublimation* $\leftrightarrow$ *ঊর্ধ্বপাতন*, *Allotrope* $\leftrightarrow$ *বহুরূপতা*, *Exothermic* $\leftrightarrow$ *তাপউৎপাদী*).
- Integrate terminology expansion into `web/src/ai/flows/retrieve-grounding.ts`.

---

## Verification Plan
### Automated Tests & Quality Checks
- `npm run test` in `web/` (ensure all vitest suites pass).
- `npx tsx scripts/eval-golden-set.ts` to run the Genkit benchmark evaluation.
- `npm run build` in `web/` (verify all 36+ routes compile cleanly with Turbopack).

### Manual Verification
- Test navigation to `/dashboard/textbook-explorer` in development/preview.
- Verify diagram rendering and "Ask AI Tutor" deep-link functionality.
