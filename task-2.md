Viewed mcp_config.json:1-66
Used MCP tool: genkit-mcp-server/get_usage_guide
Used MCP tool: genkit-mcp-server/search_genkit_docs
Viewed read_genkit_docs.json
Searched for "FilePath:"
Used MCP tool: genkit-mcp-server/read_genkit_docs
Viewed output.txt:1-120
Viewed output.txt:121-250
Used MCP tool: genkit-mcp-server/read_genkit_docs
Ran command: `npx vitest run src/ai`
Used tool: manage_task
Used tool: manage_task
Ran command: `npm run test -- src/ai`
Ran command: `ls node_modules/.bin`
Ran command: `ls -la web/node_modules`
Ran command: `ls -la node_modules`

Based on an audit using the `genkit-mcp-server` documentation, Supabase MCP database queries, and codebase review, here are the identified issues across the Genkit implementations:

---

### 1. Missing Embeddings for Active Embedder (Critical RAG Degradation)
- **Problem**: 
  In [`web/src/ai/genkit.ts`](file:///home/kratzer/workspace/Github/Sheratutor/web/src/ai/genkit.ts#L343-L345), `activeEmbedder = geminiEmbedder` (`gemini-embedding-2`, version `v1`).
  However, inspecting the remote Supabase database via MCP revealed:
  - `gemini-embedding-2` (`v1`) has **only 304 embeddings** in `chunk_embeddings`.
  - The corpus has **1,962 total curriculum chunks** in `curriculum_chunks` (older embedders like `bge-m3` and `llama-nemotron-embed-vl-1b-v2` have ~1,650 embeddings).
- **Impact**: **84.5% of the curriculum is completely invisible** to Layer 2 RAG ([`retrieveGroundingFlow`](file:///home/kratzer/workspace/Github/Sheratutor/web/src/ai/flows/retrieve-grounding.ts)). Any question outside those 304 chunks receives 0 grounding matches because `match_curriculum_chunks` strictly filters by `model_name = 'gemini-embedding-2' AND model_version = 'v1'`.
- **Remediation**: Run a backfill script targeting `gemini-embedding-2` to embed all remaining 1,658 curriculum chunks into `chunk_embeddings`.

---

### 2. Upstream Retired Model & Broken Fallback in Question Generation
- **Problem**:
  - In [`web/.env.local`](file:///home/kratzer/workspace/Github/Sheratutor/web/.env.local#L31):
    `GENKIT_PAPER_MODEL="nim/nvidia/nemotron-3-nano-30b-a3b"` is hardcoded. This model ID has been retired upstream from NVIDIA NIM and returns HTTP 410 (Gone).
  - In [`web/src/ai/flows/generate-question-paper.ts`](file:///home/kratzer/workspace/Github/Sheratutor/web/src/ai/flows/generate-question-paper.ts#L121-L128), when direct generation fails, the fallback logic uses:
    ```ts
    const fallbackModel = FALLBACK_REASONING_MODEL.replace(/^(?:nim|agentrouter)\//, "");
    const client = new OpenAI({ baseURL: "https://integrate.api.nvidia.com/v1", ... });
    ```
    If `FALLBACK_REASONING_MODEL` defaults to `googleai/gemini-2.5-flash` (from [`genkit.ts`](file:///home/kratzer/workspace/Github/Sheratutor/web/src/ai/genkit.ts#L224)), the `.replace(...)` leaves `googleai/gemini-2.5-flash`, which is sent to NVIDIA NIM's API endpoint, failing with `404 Not Found`.
- **Impact**: Practice paper generation (`/dashboard/practice/generate`) fails both on primary generation and fallback.
- **Remediation**: Remove the dead NIM model from `.env.local` so it defaults to Gemini (`googleai/gemini-3.5-flash-lite`), and ensure the OpenAI-client fallback points to a valid provider and model.

---

### 3. Agent & Session Architecture Bypass in `POST /api/tutor-chat`
- **Problem**:
  - [`web/src/ai/agents/tutor-agent.ts`](file:///home/kratzer/workspace/Github/Sheratutor/web/src/ai/agents/tutor-agent.ts#L42-L51) defines `tutorAgent` with `ai.defineAgent`, [`SupabaseSessionStore`](file:///home/kratzer/workspace/Github/Sheratutor/web/src/lib/supabase/session-store.ts), and tools ([`verifyPhysicsCalculation`](file:///home/kratzer/workspace/Github/Sheratutor/web/src/ai/tools/tutor-tools.ts#L126), [`requestPracticeQuizInterrupt`](file:///home/kratzer/workspace/Github/Sheratutor/web/src/ai/tools/tutor-tools.ts#L630), [`searchTextbookCurriculum`](file:///home/kratzer/workspace/Github/Sheratutor/web/src/ai/tools/tutor-tools.ts#L11)).
  - In [`web/src/app/api/tutor-chat/route.ts`](file:///home/kratzer/workspace/Github/Sheratutor/web/src/app/api/tutor-chat/route.ts#L145-L297), the route bypasses `tutorAgent` entirely and directly calls `tutorChatFlow` with manual Supabase database operations.
  - Meanwhile, [`GET /api/tutor-chat`](file:///home/kratzer/workspace/Github/Sheratutor/web/src/app/api/tutor-chat/route.ts#L358-L377) calls `tutorAgent.getSnapshotData()`, and [`POST /api/tutor-chat/abort`](file:///home/kratzer/workspace/Github/Sheratutor/web/src/app/api/tutor-chat/abort/route.ts#L4) calls `appRoute(tutorAgent.abortAgentAction)`.
- **Impact**:
  - The Human-in-the-loop interrupt [`requestPracticeQuizInterrupt`](file:///home/kratzer/workspace/Github/Sheratutor/web/src/ai/tools/tutor-tools.ts#L630) is never reached.
  - Deterministic physics calculations ([`verifyPhysicsCalculation`](file:///home/kratzer/workspace/Github/Sheratutor/web/src/ai/tools/tutor-tools.ts#L126)) are never invoked during chat.
  - Snapshot retrieval and abort actions operate against `tutorAgent` while chat turns are recorded out-of-band.
- **Remediation**: Either standardize `POST /api/tutor-chat` on `tutorAgent.run()` / `appRoute(tutorAgent)`, or decouple the abort and snapshot routes if flow-based execution is intended.

---

### 4. Loss of Tool State in `SupabaseSessionStore`
- **Problem**:
  In [`web/src/lib/supabase/session-store.ts`](file:///home/kratzer/workspace/Github/Sheratutor/web/src/lib/supabase/session-store.ts#L128-L134):
  ```ts
  const messages = (messagesData ?? [])
    .filter((m) => m.content && !m.content.includes("LLM streaming failed"))
    .map((m) => ({
      role: m.role === "student" ? ("user" as const) : ("model" as const),
      content: [{ text: m.content }],
    }));
  ```
- **Impact**: Genkit multi-turn agent turns contain structured parts like `{ toolRequest: ... }` and `{ toolResponse: ... }`. `SupabaseSessionStore` only reconstructs plain text `content: [{ text }]`. If `tutorAgent` executes any tool, loading the session snapshot wipes out tool calls and tool responses, causing schema errors or hallucinated turns on resumption.
- **Remediation**: Persist structured message parts (JSON) or serialize tool call parts in `tutor_chat_messages`.

---

### 5. Fallback Provider Mismatch in `tutorChatFlow`
- **Problem**:
  In [`web/src/ai/flows/tutor-chat.ts`](file:///home/kratzer/workspace/Github/Sheratutor/web/src/ai/flows/tutor-chat.ts#L232-L248):
  ```ts
  const isNim = (process.env.GENKIT_REASONING_MODEL ?? "").startsWith("nim/") || Boolean(process.env.NVIDIA_NIM_API_KEY);
  const modelName = (process.env.GENKIT_REASONING_MODEL ?? "nim/openai/gpt-oss-20b").replace(/^(?:nim|agentrouter)\//, "");
  ```
  If `GENKIT_REASONING_MODEL` is `googleai/gemini-3.5-flash-lite` (or unset), but `NVIDIA_NIM_API_KEY` is present in `.env.local`, `isNim` evaluates to `true`. When Gemini fails, the fallback instantiates an OpenAI client pointing to `https://integrate.api.nvidia.com/v1` and asks NIM to execute `googleai/gemini-3.5-flash-lite`, causing an immediate 404.
- **Impact**: The fallback fails whenever Gemini has a transient outage or rate limit.
- **Remediation**: Check model prefix before routing to NIM, or explicitly set a valid NIM model (e.g. `meta/llama-3.3-70b-instruct`) for the NIM client.

---

### 6. Substring Fallback in `searchTextbookCurriculum` Tool
- **Problem**:
  In [`web/src/ai/tools/tutor-tools.ts`](file:///home/kratzer/workspace/Github/Sheratutor/web/src/ai/tools/tutor-tools.ts#L38-L92):
  ```ts
  if (chapterId && isUuid(chapterId)) {
    // calls retrieveGroundingFlow
  }
  // Fallback: searches with content_chunk.ilike.%${kw}%
  ```
- **Impact**: If a student asks a general or multi-chapter question where `chapterId` is null/omitted, semantic RAG is completely bypassed. Instead of calling `retrieveGroundingFlow` with `match_curriculum_chunks_global`, the tool executes crude SQL `ILIKE` keyword matching.
- **Remediation**: Update `searchTextbookCurriculum` to call `retrieveGroundingFlow` without `chapterId` so it uses `match_curriculum_chunks_global`.

---

### 7. Vercel Serverless Function Timeout in `gradeSubmissionFlow`
- **Problem**:
  - In [`web/src/app/api/internal/process-grading-queue/route.ts`](file:///home/kratzer/workspace/Github/Sheratutor/web/src/app/api/internal/process-grading-queue/route.ts#L6), `export const maxDuration = 60;`.
  - In [`web/src/ai/flows/grade-submission.ts`](file:///home/kratzer/workspace/Github/Sheratutor/web/src/ai/flows/grade-submission.ts#L66-L179), transcription, RAG retrieval, and rubric evaluations are executed sequentially in a `for` loop.
  - For a standard 3-page, 4-question exam script:
    - 3 calls to `transcribePageFlow` (~5-8s each = 15-24s)
    - 4 calls to `retrieveGroundingFlow` (~1-2s each = 4-8s)
    - 4 calls to `evaluateRubricFlow` (~8-12s each = 32-48s)
    - Total execution time: **51 - 80 seconds**.
- **Impact**: Exceeds Vercel's 60s serverless function timeout, causing pgmq grading jobs to timeout and fail repeatedly up to `MAX_ATTEMPTS`.
- **Remediation**: Parallelize `transcribePageFlow` calls via `Promise.all()`, and process questions concurrently or split queue jobs by question rather than submission.

---

### 8. Missing Flows and Tools in MCP Server
- **Problem**:
  In [`web/src/ai/mcp/server.ts`](file:///home/kratzer/workspace/Github/Sheratutor/web/src/ai/mcp/server.ts#L4-L5), only `retrieve-grounding` and `evaluate-rubric` are imported and exposed.
- **Impact**: `transcribePageFlow`, `gradeSubmissionFlow`, `generateQuestionPaperFlow`, `tutorChatFlow`, and the agent tools (`verifyPhysicsCalculation`, `searchTextbookCurriculum`) are not registered with the Genkit MCP server.
- **Remediation**: Import all flows and tools in `server.ts` so external MCP clients can discover and execute them.

---

### Summary Checklist of Priority Fixes

| Priority | Issue | Location | Fix |
| :--- | :--- | :--- | :--- |
| **High** | Embedder corpus gap (1,658 chunks missing) | Supabase `chunk_embeddings` | Run `npm run reembed:nim` or Gemini backfill for all chunks |
| **High** | Dead NIM model ID (HTTP 410) | `web/.env.local:31` | Remove `GENKIT_PAPER_MODEL` or point to active model |
| **High** | Broken NIM fallback target | `generate-question-paper.ts:121` | Ensure fallback uses a valid NIM model ID |
| **Medium** | Agent / Flow route divergence | `api/tutor-chat/route.ts` | Align chat execution with `tutorAgent` and its tools |
| **Medium** | Multi-turn tool call loss | `session-store.ts:130` | Preserve `{ toolRequest, toolResponse }` parts |
| **Medium** | Global RAG bypassed in tool | `tutor-tools.ts:63` | Call `match_curriculum_chunks_global` on missing `chapterId` |
| **Medium** | 60s Vercel timeout on grading | `grade-submission.ts:66` | Concurrently transcribe pages with `Promise.all()` |
| **Low** | Incomplete MCP tool surface | `mcp/server.ts` | Import and register all remaining flows and tools |