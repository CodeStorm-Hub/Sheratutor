# Refactor Model Provider to Google AI Studio Free Gemini API

Refactor the complete Genkit architecture across SheraTutor to exclusively use Google AI Studio's free Gemini API (`@genkit-ai/google-genai`), eliminating legacy NVIDIA NIM, AgentRouter, and Fireworks dependencies, fixing broken fallbacks, and unifying embedding and reasoning pipelines.

## User Review Required

> [!IMPORTANT]
> **API Key Setup Required**: A valid Google AI Studio Gemini API key is required (`GEMINI_API_KEY`, and optionally `GEMINI_API_KEY_SECONDARY` for automated failover across daily free quotas). Please ensure your key from [Google AI Studio](https://aistudio.google.com/apikey) is added to `web/.env.local`.

> [!WARNING]
> **Embedding Backfill Required**: The remote database currently has only 304 chunks embedded under `gemini-embedding-2` out of 1,962 total curriculum chunks. After this refactor, running the new `reembed-gemini.ts` script is required to ensure 100% of the textbook corpus is searchable.

## Proposed Changes

### Core AI & Genkit Configuration

#### [MODIFY] [web/src/ai/genkit.ts](file:///home/kratzer/workspace/Github/Sheratutor/web/src/ai/genkit.ts)
- Configure `googleAI` as the primary and default plugin.
- Deprecate or remove active defaults pointing to `nim` and `agentrouter`.
- Standardize `MODELS`:
  - `MODELS.vision`: `googleai/gemini-2.5-flash` (multimodal OCR & diagram recognition)
  - `MODELS.reasoning`: `googleai/gemini-2.5-flash` (Socratic tutoring, rubric grading)
  - `MODELS.fast`: `googleai/gemini-2.5-flash`
  - `MODELS.paper`: `googleai/gemini-2.5-flash` (replaces dead NIM model `nim/nvidia/nemotron-3-nano-30b-a3b`)
  - `FALLBACK_REASONING_MODEL`: `googleai/gemini-2.0-flash`
- Set `activeEmbedder = geminiEmbedder` with `gemini-embedding-2` (1024-dim Matryoshka).
- Ensure `embedWithGeminiFallback` and `generateWithGeminiFallback` rotate seamlessly between primary and secondary Gemini keys.

---

### Genkit Flows

#### [MODIFY] [web/src/ai/flows/generate-question-paper.ts](file:///home/kratzer/workspace/Github/Sheratutor/web/src/ai/flows/generate-question-paper.ts)
- Remove the hardcoded OpenAI/NIM client fallback targeting `https://integrate.api.nvidia.com/v1`.
- Replace fallback with Genkit secondary Gemini model generation (`generateWithGeminiFallback` / `FALLBACK_REASONING_MODEL`).
- Retain strict Zod schema parsing with `GeneratedPaperSchema`.

#### [MODIFY] [web/src/ai/flows/tutor-chat.ts](file:///home/kratzer/workspace/Github/Sheratutor/web/src/ai/flows/tutor-chat.ts)
- Remove the OpenAI/NIM fallback branch.
- Route generation through `generateWithGeminiFallback` with automatic Gemini key failover.
- Retain LaTeX delimiter normalization, safety pre-filtering, and authentic diagram markdown injections.

#### [MODIFY] [web/src/ai/flows/grade-submission.ts](file:///home/kratzer/workspace/Github/Sheratutor/web/src/ai/flows/grade-submission.ts)
- Optimize transcription pass by processing pages concurrently (`Promise.all`) to prevent Vercel 60s function timeouts.
- Record Gemini model identifier in provenance tracking (`model_name: "googleai/gemini-2.5-flash"`).

#### [MODIFY] [web/src/ai/flows/retrieve-grounding.ts](file:///home/kratzer/workspace/Github/Sheratutor/web/src/ai/flows/retrieve-grounding.ts)
- Standardize embedding exclusively through `embedWithGeminiFallback(query, 1024)`.
- Query `match_curriculum_chunks` and `match_curriculum_chunks_global` with `EMBED_MODEL_NAME = "gemini-embedding-2"` and `EMBED_MODEL_VERSION = "v1"`.

---

### Agent & Tools

#### [MODIFY] [web/src/ai/tools/tutor-tools.ts](file:///home/kratzer/workspace/Github/Sheratutor/web/src/ai/tools/tutor-tools.ts)
- In `searchTextbookCurriculum`: when `chapterId` is not provided, invoke `retrieveGroundingFlow` without `chapterId` so it executes `match_curriculum_chunks_global` (Gemini hybrid RAG) instead of raw SQL `ILIKE` pattern matching.
- Keep deterministic arithmetic evaluator `verifyPhysicsCalculation` intact.

#### [MODIFY] [web/src/lib/supabase/session-store.ts](file:///home/kratzer/workspace/Github/Sheratutor/web/src/lib/supabase/session-store.ts)
- Support structured message parts when loading snapshot history so tool requests/responses from `tutorAgent` turns are not stripped.

---

### MCP Server

#### [MODIFY] [web/src/ai/mcp/server.ts](file:///home/kratzer/workspace/Github/Sheratutor/web/src/ai/mcp/server.ts)
- Import and register all flows (`transcribePageFlow`, `gradeSubmissionFlow`, `generateQuestionPaperFlow`, `tutorChatFlow`) and tools (`searchTextbookCurriculum`, `verifyPhysicsCalculation`) with the SheraTutor MCP server.

---

### Environment & Scripts

#### [MODIFY] [web/.env.example](file:///home/kratzer/workspace/Github/Sheratutor/web/.env.example) & [web/.env.local](file:///home/kratzer/workspace/Github/Sheratutor/web/.env.local)
- Update model routing configuration:
  - `GENKIT_VISION_MODEL="googleai/gemini-2.5-flash"`
  - `GENKIT_REASONING_MODEL="googleai/gemini-2.5-flash"`
  - `GENKIT_FAST_MODEL="googleai/gemini-2.5-flash"`
  - `GENKIT_PAPER_MODEL="googleai/gemini-2.5-flash"`
  - `GENKIT_FALLBACK_REASONING_MODEL="googleai/gemini-2.0-flash"`
- Add placeholders for `GEMINI_API_KEY` and `GEMINI_API_KEY_SECONDARY`.

#### [NEW] [web/scripts/reembed-gemini.ts](file:///home/kratzer/workspace/Github/Sheratutor/web/scripts/reembed-gemini.ts)
- Dedicated script to backfill all 1,962 curriculum chunks in Supabase with `gemini-embedding-2` (1024-dim) embeddings using `embedWithGeminiFallback`.

---

## Verification Plan

### Automated Tests & Lint
- Verify TypeScript types across `web/src/ai` and API routes.
- Execute existing unit tests:
  ```bash
  cd web && npx tsx src/ai/tools/tutor-tools.test.ts
  cd web && npx tsx src/ai/flows/tutor-chat.test.ts
  ```

### Live Provider & Flow Verification
- Run live Gemini flow tests:
  ```bash
  cd web && npx tsx --env-file=.env.local scripts/test-gemini-tutor-live.ts
  ```
- Test question paper generation flow with Gemini:
  ```bash
  cd web && npx tsx --env-file=.env.local scripts/test-general-chat.ts
  ```
- Verify Supabase MCP connection and check chunk embedding counts after backfilling.
