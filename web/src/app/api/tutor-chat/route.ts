import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { apiError } from "@/lib/api";
import { startOfDhakaDayUtcIso } from "@/lib/time";
import {
  tutorChatFlow,
  buildTutorPrompt,
  preFilterSafety,
  normalizeLatexDelimiters,
  stripLeadingGreeting,
  SAFE_ESCALATION_MESSAGE_BN,
} from "@/ai/flows/tutor-chat";


import { OpenAI } from "openai";

export const maxDuration = 60;

const RequestBody = z.object({
  sessionId: z.string().min(1).nullish(),
  mode: z.enum(["rubric", "general"]).default("rubric"),
  submissionId: z.string().min(1).nullish(),
  questionId: z.string().min(1).nullish(),
  rubricStepIndex: z.number().int().min(0).nullish(),
  questionText: z.string().max(20_000).nullish(),
  studentAnswerChunk: z.string().max(20_000).nullish(),
  rubricFailureReason: z.string().max(8_000).nullish(),
  groundedContext: z.string().max(50_000).nullish(),
  subjectId: z.string().min(1).nullish(),
  chapterId: z.string().min(1).nullish(),
  studentMessage: z.string().trim().min(1, "studentMessage is required").max(4_000),
  languagePreference: z.enum(["bn", "en"]).default("bn"),
  scaffoldingStyle: z.enum(["socratic", "direct"]).default("socratic"),
  stream: z.boolean().default(false),
});

// No new env var — a fixed, generous daily cap on a free LLM endpoint
// (docs/review §8.4 item 15 — no abuse/quota design existed at all).
const TUTOR_CHAT_DAILY_LIMIT = 50;

type ChatMode = "rubric" | "general";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return apiError(401, "unauthorized");

  const { data: profile } = await supabase
    .from("student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profile) return apiError(400, "complete onboarding first");

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return apiError(400, "invalid JSON body");
  }
  const parsed = RequestBody.safeParse(rawBody);
  if (!parsed.success) {
    return apiError(400, parsed.error.issues[0]?.message ?? "invalid request");
  }
  const {
    sessionId: incomingSessionId,
    mode,
    submissionId,
    questionId,
    rubricStepIndex,
    questionText,
    studentAnswerChunk,
    rubricFailureReason,
    groundedContext: rubricGroundedContext,
    subjectId,
    chapterId,
    studentMessage,
    languagePreference,
    scaffoldingStyle,
    stream,
  } = parsed.data;

  // Rate limit: count today's (Asia/Dhaka) student-authored messages across
  // every session this student owns.
  const { count: todaysMessageCount } = await supabase
    .from("tutor_chat_messages")
    .select("id, tutor_chat_sessions!inner(student_id)", { count: "exact", head: true })
    .eq("role", "student")
    .eq("tutor_chat_sessions.student_id", profile.id)
    .gte("created_at", startOfDhakaDayUtcIso());

  if ((todaysMessageCount ?? 0) >= TUTOR_CHAT_DAILY_LIMIT) {
    return apiError(429, "rate_limited", {
      message: "আজকের জন্য প্রশ্নের সীমা শেষ, আগামীকাল আবার চেষ্টা করো।",
    });
  }

  type ChatSession = {
    id: string;
    mode: ChatMode;
    context_json: Record<string, unknown> | null;
  };

  // Resolve or create the session.
  let session: ChatSession | null = null;

  if (incomingSessionId) {
    // RLS already scopes this to the caller; the student_id filter is
    // belt-and-suspenders and makes the ownership requirement explicit.
    const { data } = await supabase
      .from("tutor_chat_sessions")
      .select("id, mode, context_json")
      .eq("id", incomingSessionId)
      .eq("student_id", profile.id)
      .maybeSingle();
    if (!data) return apiError(404, "session not found");
    session = data as ChatSession;
  } else if (mode === "rubric") {
    if (!submissionId || !questionId || rubricStepIndex == null) {
      return apiError(
        400,
        "submissionId, questionId, and rubricStepIndex are required for a new rubric session",
      );
    }
    const { data: existing } = await supabase
      .from("tutor_chat_sessions")
      .select("id, mode, context_json")
      .eq("student_id", profile.id)
      .eq("submission_id", submissionId)
      .eq("question_id", questionId)
      .eq("rubric_step_index", rubricStepIndex)
      .eq("mode", "rubric")
      .maybeSingle();

    if (existing) {
      session = existing as ChatSession;
    } else {
      const contextJson = { questionText, studentAnswerChunk, rubricFailureReason, groundedContext: rubricGroundedContext };
      let { data: created, error } = await supabase
        .from("tutor_chat_sessions")
        .insert({
          student_id: profile.id,
          submission_id: submissionId,
          question_id: questionId,
          rubric_step_index: rubricStepIndex,
          mode: "rubric",
          context_json: contextJson,
        })
        .select("id, mode, context_json")
        .maybeSingle();

      if (error && error.code === "23503") {
        // Foreign key constraint failure (e.g. mock/seed submission or question ID)
        const retry = await supabase
          .from("tutor_chat_sessions")
          .insert({
            student_id: profile.id,
            rubric_step_index: rubricStepIndex,
            mode: "rubric",
            context_json: contextJson,
          })
          .select("id, mode, context_json")
          .single();
        created = retry.data;
        error = retry.error;
      }

      if (error || !created) {
        return apiError(500, error?.message ?? "failed to create session");
      }
      session = created as ChatSession;
    }
  } else {
    if (!chapterId) {
      return apiError(400, "chapterId is required for a new general session");
    }
    const { data: chapter } = await supabase
      .from("chapters")
      .select("title_en, title_bn, subjects(name_en)")
      .eq("id", chapterId)
      .maybeSingle();

    const contextJson = {
      subjectId,
      chapterId,
      subjectName: (chapter?.subjects as { name_en?: string } | null)?.name_en,
      chapterName: chapter?.title_en,
    };
    const { data: created, error } = await supabase
      .from("tutor_chat_sessions")
      .insert({
        student_id: profile.id,
        mode: "general",
        title: studentMessage.slice(0, 40),
        context_json: contextJson,
      })
      .select("id, mode, context_json")
      .single();
    if (error || !created) {
      return apiError(500, error?.message ?? "failed to create session");
    }
    session = created as ChatSession;
  }

  if (!session) return apiError(500, "failed to resolve session");

  const ctx = (session.context_json ?? {}) as {
    questionText?: string;
    studentAnswerChunk?: string;
    rubricFailureReason?: string;
    groundedContext?: string;
    chapterId?: string;
    subjectName?: string;
    chapterName?: string;
  };

  // Prior turns for this session, mapped to the flow's history shape.
  const { data: priorMessages } = await supabase
    .from("tutor_chat_messages")
    .select("role, content")
    .eq("session_id", session.id)
    .order("created_at", { ascending: true });

  const history = (priorMessages ?? [])
    .filter((m) => m.content && !m.content.includes("LLM streaming failed"))
    .map((m) => ({
      role: m.role as "student" | "tutor",
      text: m.content,
    }));

  const groundedContext = session.mode === "rubric" ? ctx.groundedContext : undefined;

  // Safety pre-filter check
  const safety = preFilterSafety(studentMessage);
  if (safety.flagged) {
    await supabase.from("tutor_chat_messages").insert([
      { session_id: session.id, role: "student", content: studentMessage, safety_category: safety.category },
      { session_id: session.id, role: "tutor", content: SAFE_ESCALATION_MESSAGE_BN, safety_category: "none" },
    ]);
    await supabase.from("tutor_chat_sessions").update({ updated_at: new Date().toISOString() }).eq("id", session.id);

    const service = getServiceRoleClient();
    await service.from("audit_log").insert({
      actor_id: user.id,
      action: "SAFETY_ESCALATION",
      entity_type: "tutor_chat",
      entity_id: user.id,
      detail_json: { category: safety.category, session_id: session.id },
    });

    if (stream) {
      const encoder = new TextEncoder();
      const s = new ReadableStream({
        start(controller) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "chunk", text: SAFE_ESCALATION_MESSAGE_BN })}\n\n`
            )
          );
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "done", sessionId: session?.id, reply: SAFE_ESCALATION_MESSAGE_BN, safety })}\n\n`
            )
          );
          controller.close();
        },
      });
      return new Response(s, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    return NextResponse.json({ sessionId: session.id, reply: SAFE_ESCALATION_MESSAGE_BN, safety });
  }

  // Streaming Response Path
  if (stream) {
    const prompt = buildTutorPrompt({
      mode: session.mode,
      scaffoldingStyle,
      questionText: ctx.questionText,
      studentAnswerChunk: ctx.studentAnswerChunk,
      rubricFailureReason: ctx.rubricFailureReason,
      subjectName: ctx.subjectName,
      chapterName: ctx.chapterName,
      groundedContext,
      history,
      studentMessage,
      languagePreference,
    });

    if (process.env.TUTOR_CHAT_DEBUG === "1") {
      process.stdout.write(`\n--- PROMPT START ---\n${prompt}\n--- PROMPT END ---\n`);
    }

    const encoder = new TextEncoder();
    const resolvedSessionId = session.id;

    // If the browser disconnects mid-stream, abort the upstream LLM request so
    // we stop consuming (and paying for) tokens nobody will read.
    const upstreamAbort = new AbortController();
    request.signal.addEventListener("abort", () => upstreamAbort.abort(), { once: true });

    const streamResponse = new ReadableStream({
      async start(controller) {
        try {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "start", sessionId: resolvedSessionId })}\n\n`
            )
          );

          const isNim = (process.env.GENKIT_REASONING_MODEL ?? "").startsWith("nim/") || Boolean(process.env.NVIDIA_NIM_API_KEY);
          const client = new OpenAI({
            apiKey: isNim
              ? (process.env.NVIDIA_NIM_API_KEY ?? "")
              : (process.env.AGENTROUTER_API_KEY ?? ""),
            baseURL: isNim
              ? "https://integrate.api.nvidia.com/v1"
              : (process.env.AGENTROUTER_BASE_URL ?? "https://agentrouter.org/v1"),
            defaultHeaders: isNim ? undefined : { "User-Agent": "Cline/3.0.0" },
          });
          const modelName = (process.env.GENKIT_REASONING_MODEL ?? "nim/meta/llama-3.2-11b-vision-instruct").replace(/^(?:nim|agentrouter)\//, "");

          const stream = await client.chat.completions.create(
            {
              model: modelName,
              messages: [
                {
                  role: "user",
                  content: prompt,
                },
              ],
              temperature: 0.5,
              stream: true,
            },
            { signal: upstreamAbort.signal },
          );

          let rawReply = "";
          for await (const chunk of stream) {
            if (upstreamAbort.signal.aborted) break;
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              rawReply += text;
              try {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ type: "chunk", text })}\n\n`
                  )
                );
              } catch {}
            }
          }

          // Client went away — don't persist a half-turn or try to write to a
          // closed stream.
          if (upstreamAbort.signal.aborted) {
            try {
              controller.close();
            } catch {}
            return;
          }

          const finalReply = stripLeadingGreeting(normalizeLatexDelimiters(rawReply || ""));

          // Persist messages in database
          await supabase.from("tutor_chat_messages").insert([
            { session_id: resolvedSessionId, role: "student", content: studentMessage, safety_category: "none" },
            { session_id: resolvedSessionId, role: "tutor", content: finalReply, safety_category: "none" },
          ]);

          await supabase
            .from("tutor_chat_sessions")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", resolvedSessionId);

          try {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "done", sessionId: resolvedSessionId, reply: finalReply, safety: { flagged: false, category: "none" } })}\n\n`
              )
            );
            controller.close();
          } catch {}
        } catch (streamErr) {
          // An abort (client disconnect) surfaces here as a rejection — that's
          // expected, not an error worth reporting.
          if (upstreamAbort.signal.aborted) {
            try {
              controller.close();
            } catch {}
            return;
          }
          console.error("SSE stream failed in tutor-chat:", streamErr);
          try {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "error", error: "LLM streaming failed" })}\n\n`
              )
            );
            controller.close();
          } catch {}
        }
      },
      cancel() {
        // Consumer (browser) cancelled the stream — abort the upstream LLM call.
        upstreamAbort.abort();
      },
    });

    return new Response(streamResponse, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  }

  // Non-streaming fallback
  const result = await tutorChatFlow({
    mode: session.mode,
    scaffoldingStyle,
    questionText: ctx.questionText,
    studentAnswerChunk: ctx.studentAnswerChunk,
    rubricFailureReason: ctx.rubricFailureReason,
    subjectName: ctx.subjectName,
    chapterName: ctx.chapterName,
    groundedContext,
    history,
    studentMessage,
    languagePreference,
  });

  await supabase.from("tutor_chat_messages").insert([
    { session_id: session.id, role: "student", content: studentMessage, safety_category: result.safety.category },
    { session_id: session.id, role: "tutor", content: result.reply, safety_category: "none" },
  ]);

  await supabase.from("tutor_chat_sessions").update({ updated_at: new Date().toISOString() }).eq("id", session.id);

  if (result.safety.flagged) {
    const service = getServiceRoleClient();
    await service.from("audit_log").insert({
      actor_id: user.id,
      action: "SAFETY_ESCALATION",
      entity_type: "tutor_chat",
      entity_id: user.id,
      detail_json: { category: result.safety.category, session_id: session.id },
    });
  }

  return NextResponse.json({ sessionId: session.id, reply: result.reply, safety: result.safety });
}
