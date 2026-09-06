# SheraTutor + Genkit Full-Stack Architecture & Integration Blueprint

This document presents a comprehensive, actionable technical blueprint for modernizing and integrating **Google Genkit v1.41.0** across the entire **SheraTutor** codebase (`web/`, `supabase/`, `ingestion/`). It grounds the architectural principles researched from the upstream [`genkit`](https://github.com/genkit-ai/genkit) and [`docsite`](https://github.com/genkit-ai/docsite) repositories directly into SheraTutor's **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Supabase (pgvector)** stack.

---

## 1. Executive Summary & SheraTutor System Context

**SheraTutor** is an AI-powered B2C Learning Workspace specifically architected for Bangladeshi SSC and HSC students (currently focused on Physics, expanding to Chemistry, Higher Mathematics, and Biology). The application centers around five core academic AI capabilities:

1. **Layer 1: Handwritten Exam Transcription (`transcribePageFlow`)**  
   Multimodal vision OCR for scanned student test scripts (*khata*), extracting verbatim Bengali and English prose, diagrams, and LaTeX equations.
2. **Layer 2: Bilingual Hybrid RAG Grounding (`retrieveGroundingFlow`)**  
   Dense vector search (NVIDIA NIM 1024-dim `llama-nemotron-embed-1b-v2` / Ollama `bge-m3`) combined with PostgreSQL full-text search (tsvector) via Reciprocal Rank Fusion (RRF), hierarchical stimulus context resolution for Creative Questions (CQs), and Bengali physics synonym expansion.
3. **Layer 3: Verifiable Rubric Evaluation & Grading (`gradeSubmissionFlow` & `evaluateRubricFlow`)**  
   Step-by-step grading of student exam answers against official NCTB Board examination rubrics with verifiable mark deductions.
4. **Layer 4: Question Paper Generation (`generateQuestionPaperFlow`)**  
   Automated generation of authentic NCTB board-format Creative Questions (CQs: উদ্দীপক, ক, খ, গ, ঘ) and Multiple Choice Questions (MCQs).
5. **Layer 5: "Explain It Simply" AI Tutor (`tutorChatFlow`)**  
   Multi-turn Socratic or Direct tutoring in natural conversational Bengali and English, rendering formulas with KaTeX and enforcing minor safety escalation.

---

## 2. Current Codebase Audit & Integration Opportunities

A deep inspection of `web/` revealed that while `genkit` is already installed in `web/package.json`, several critical parts of the application still rely on fragile, custom plumbing that can be dramatically simplified:

| Subsystem | Current Implementation | Genkit Integrated Opportunity | Impact |
| :--- | :--- | :--- | :--- |
| **Tutor Route Handler**<br>`src/app/api/tutor-chat/route.ts` | 464 lines of custom POST logic: manually instantiates `new OpenAI(...)`, runs custom `ReadableStream`, splits strings on `data: `, and manually queries database tables. | Replace with `@genkit-ai/next`'s `appRoute(tutorChatAgent, { contextProvider })`. | **Eliminates ~350 lines** of redundant streaming and error-handling code. |
| **Tutor React Client**<br>`src/components/tutor-page-client.tsx` | 859 lines of code: manually reads `res.body.getReader()`, manages `TextDecoder`, splits SSE buffers, and tracks streaming flags. | Connect via `@genkit-ai/next/client`'s `streamFlow()` or `@genkit-ai/vercel-ai`'s `GenkitChatTransport` with `@ai-sdk/react`'s `useChat`. | **Eliminates ~400 lines** of client boilerplate; gains auto-retry, optimistic updates, and abort signals. |
| **Conversational State**<br>`tutor_chat_sessions` & `messages` | Raw Supabase SQL queries to fetch previous turns and stitch them as plain text into prompt strings on every turn. | Implement Genkit's `SessionStore` interface (`SupabaseSessionStore`) with JSON-Patch state deltas. | Reduces network payloads and persists turns with full OpenTelemetry provenance. |
| **Pedagogical Tools** | Tutor operates without tools; cannot dynamically search the textbook, verify calculations, or diagnose misconceptions. | Equip agent with `searchTextbookCurriculum`, `verifyPhysicsCalculation`, and `explainMisconception` tools. | **Zero arithmetic hallucinations**; accurate formula derivations grounded in NCTB text. |
| **Human-in-the-Loop** | Static buttons; no mechanism for the tutor to propose an action (e.g. generating a quiz) and wait for student approval. | Utilize Genkit's `interrupt()` primitive. | Enables interactive confirmations for practice quizzes and rubric reviews. |
| **Generative UI** | Text and LaTeX only; no rich interactive component streaming. | Integrate `@genkit-ai/a2ui` to stream interactive step-by-step formula cards and mark breakdown widgets. | Superior learning experience; higher student engagement. |
| **Ecosystem & Interop** | Curriculum and rubrics locked inside private database tables. | Expose SheraTutor as an **MCP Server** via `@genkit-ai/mcp`. | Allows students and teachers using Cursor, Claude Desktop, or Antigravity to query the NCTB knowledge base. |

---

## 3. Module-by-Module Implementation Plan

### 3.1 Tier 1: Next.js App Router Serving (`@genkit-ai/next`)

Refactor `src/app/api/tutor-chat/route.ts` into a clean, declarative route handler:

```ts
// src/app/api/tutor-chat/route.ts
import { appRoute } from "@genkit-ai/next";
import { tutorAgent } from "@/ai/agents/tutor-agent";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 60;

export const POST = appRoute(tutorAgent, {
  contextProvider: async (req) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: profile } = await supabase
      .from("student_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    return {
      userId: user.id,
      studentId: profile?.id,
      // Pass request signal for automatic upstream LLM cancellation if client disconnects
      abortSignal: req.signal,
    };
  },
});

// Expose companion endpoints for durable snapshot inspection and cancellation
export const GET = appRoute(tutorAgent.getSnapshotDataAction);
```

### 3.2 Tier 2: Agentic State & `SupabaseSessionStore` (`genkit/beta`)

Create a custom session store that maps Genkit's `SessionStore` interface directly to SheraTutor's existing `tutor_chat_sessions` and `tutor_chat_messages` tables:

```ts
// src/lib/supabase/session-store.ts
import { SessionStore, SessionData } from "genkit/beta";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

export class SupabaseSessionStore implements SessionStore {
  async get(sessionId: string): Promise<SessionData | undefined> {
    const supabase = getServiceRoleClient();
    const { data: sessionRow } = await supabase
      .from("tutor_chat_sessions")
      .select("id, context_json, updated_at")
      .eq("id", sessionId)
      .maybeSingle();

    if (!sessionRow) return undefined;

    const { data: messages } = await supabase
      .from("tutor_chat_messages")
      .select("role, content, created_at")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    return {
      id: sessionRow.id,
      state: sessionRow.context_json ?? {},
      messages: (messages ?? []).map((m) => ({
        role: m.role === "student" ? "user" : "model",
        content: [{ text: m.content }],
      })),
    };
  }

  async save(sessionId: string, sessionData: SessionData): Promise<void> {
    const supabase = getServiceRoleClient();

    // 1. Update session context
    await supabase
      .from("tutor_chat_sessions")
      .update({
        context_json: sessionData.state,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

    // 2. Insert new messages from latest turn
    const latestMessage = sessionData.messages[sessionData.messages.length - 1];
    if (latestMessage) {
      const text = latestMessage.content.map((p) => (p as any).text ?? "").join("");
      await supabase.from("tutor_chat_messages").insert({
        session_id: sessionId,
        role: latestMessage.role === "user" ? "student" : "tutor",
        content: text,
      });
    }
  }
}
```

### 3.3 Tier 3: Socratic Agent with Autonomous Pedagogical Tools

Define the full-stack `tutorAgent` in `src/ai/agents/tutor-agent.ts`:

```ts
// src/ai/agents/tutor-agent.ts
import { ai, MODELS } from "@/ai/genkit";
import { z } from "genkit";
import { retrieveGroundingFlow } from "@/ai/flows/retrieve-grounding";
import { SupabaseSessionStore } from "@/lib/supabase/session-store";

// Tool 1: Dynamic NCTB Curriculum Search
const searchTextbookCurriculum = ai.defineTool(
  {
    name: "searchTextbookCurriculum",
    description: "Search official NCTB textbook for physics laws, definitions, and equations",
    inputSchema: z.object({
      query: z.string(),
      chapterId: z.string(),
      languageTag: z.enum(["bn", "en"]).default("bn"),
    }),
    outputSchema: z.object({
      context: z.string(),
      confidence: z.number(),
    }),
  },
  async ({ query, chapterId, languageTag }) => {
    const res = await retrieveGroundingFlow({
      queryText: query,
      chapterId,
      languageTag,
      matchCount: 3,
    });
    return {
      context: res.chunks.map((c) => c.content_chunk).join("\n---\n"),
      confidence: res.groundingConfidence,
    };
  }
);

// Tool 2: Numerical & Math Formula Verification Tool
const verifyPhysicsCalculation = ai.defineTool(
  {
    name: "verifyPhysicsCalculation",
    description: "Evaluates mathematical and physics calculations with exact numerical precision",
    inputSchema: z.object({
      formulaName: z.string(),
      expression: z.string(),
      expectedUnit: z.string(),
    }),
    outputSchema: z.object({
      computedResult: z.string(),
    }),
  },
  async ({ expression, expectedUnit }) => {
    // Safe mathematical evaluator
    return { computedResult: `${eval(expression)} ${expectedUnit}` };
  }
);

// Define the Socratic Tutor Agent
export const tutorAgent = ai.defineAgent({
  name: "socraticTutor",
  model: MODELS.reasoning,
  store: new SupabaseSessionStore(),
  tools: [searchTextbookCurriculum, verifyPhysicsCalculation],
  system: `You are SheraTutor's "Explain it simply" AI tutor for Bangladeshi SSC/HSC students.
SOCRATIC METHOD RULES:
1. Do NOT solve the entire problem or reveal the final answer immediately.
2. Ask ONE guiding question at a time to help the student identify their own mistake.
3. Use searchTextbookCurriculum when the student asks about a specific theorem or definition.
4. Wrap all formulas in standard LaTeX dollar delimiters ($...$ for inline, $$...$$ for block).
5. Communicate in natural, encouraging conversational Bengali (সহজ ও সাবলীল বাংলা).`,
});
```

### 3.4 Tier 4: Client-Side Integration with Vercel AI SDK (`@genkit-ai/vercel-ai`)

In `src/components/tutor-page-client.tsx`, replace the 859-line manual stream parsing loop with `GenkitChatTransport`:

```tsx
// Modernized src/components/tutor-page-client.tsx snippet
'use client';

import { useChat } from '@ai-sdk/react';
import { GenkitChatTransport } from '@genkit-ai/vercel-ai/client';
import { useMemo } from 'react';
import { RenderMathText } from '@/components/render-math-text';

export function TutorChatClient({ sessionId }: { sessionId: string }) {
  const transport = useMemo(
    () => new GenkitChatTransport({ url: '/api/tutor-chat' }),
    []
  );

  const { messages, input, handleInputChange, handleSubmit, status, stop } = useChat({
    id: sessionId,
    transport,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={m.role === 'user' ? 'student-bubble' : 'tutor-bubble'}>
            <RenderMathText content={m.parts.filter(p => p.type === 'text').map(p => p.text).join('')} />
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <input value={input} onChange={handleInputChange} placeholder="তোমার প্রশ্ন লিখো..." />
        <button type="submit" disabled={status !== 'ready'}>পাঠাও</button>
        {status === 'streaming' && <button onClick={stop}>থামাও</button>}
      </form>
    </div>
  );
}
```

### 3.5 Tier 5: SheraTutor as an MCP Server (`@genkit-ai/mcp`)

Expose SheraTutor's NCTB curriculum repository as an MCP Server so external AI tools (Cursor, Claude Desktop, Antigravity) can query verified Bangladeshi textbook knowledge:

```ts
// src/ai/mcp/server.ts
import { createMcpServer } from "@genkit-ai/mcp";
import { ai } from "@/ai/genkit";
import { retrieveGroundingFlow } from "@/ai/flows/retrieve-grounding";
import { evaluateRubricFlow } from "@/ai/flows/evaluate-rubric";

export const sheratutorMcpServer = createMcpServer(ai, {
  name: "sheratutor-curriculum-mcp",
  version: "1.0.0",
  actions: [retrieveGroundingFlow, evaluateRubricFlow],
});
```

---

## 4. Phased Implementation Roadmap

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: ROUTE HANDLER & CLIENT STREAMING MODERNIZATION (Days 1–3)          │
│ • Refactor src/app/api/tutor-chat/route.ts to appRoute(tutorChatFlow)       │
│ • Eliminate manual SSE string-splitting & direct OpenAI SDK instantiation   │
│ • Adopt streamFlow<typeof tutorChatFlow> in tutor-page-client.tsx           │
│ • Verify zero regression on mobile devices and KaTeX formula rendering      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ PHASE 2: SUPABASE SESSION STORE & SOCRATIC AGENT (Days 4–8)                 │
│ • Create src/lib/supabase/session-store.ts implementing SessionStore        │
│ • Convert tutorChatFlow into tutorAgent (defineAgent)                       │
│ • Add searchTextbookCurriculum and verifyPhysicsCalculation tools           │
│ • Test multi-turn conversational memory with JSON-Patch state deltas        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ PHASE 3: VERCEL AI SDK (useChat) & SOKRATIC INTERRUPTS (Days 9–12)          │
│ • Integrate GenkitChatTransport with @ai-sdk/react                          │
│ • Add interrupt() approval flow for Practice Quiz Generation                │
│ • Explore @genkit-ai/a2ui for streaming interactive formula step cards      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ PHASE 4: MCP SERVER & AUTOMATED EVALUATION PIPELINE (Days 13–16)            │
│ • Expose SheraTutor NCTB knowledge as an MCP server via @genkit-ai/mcp      │
│ • Port scripts/eval-golden-set.ts to Genkit's native defineEvaluator        │
│ • Implement CI/CD automated regression tests for rubric grading precision    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---
*Report generated based on in-depth source code analysis of the SheraTutor project (`/home/syed/workspace/Sheratutor`) and upstream Genkit v1.41.0.*
