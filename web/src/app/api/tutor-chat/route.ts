import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import {
  tutorChatFlow,
  buildTutorPrompt,
  preFilterSafety,
  normalizeLatexDelimiters,
  stripLeadingGreeting,
  SAFE_ESCALATION_MESSAGE_BN,
} from "@/ai/flows/tutor-chat";
import { retrieveGroundingFlow } from "@/ai/flows/retrieve-grounding";
import { ai, MODELS } from "@/ai/genkit";

// No new env var — a fixed, generous daily cap on a free LLM endpoint
// (docs/review §8.4 item 15 — no abuse/quota design existed at all).
const TUTOR_CHAT_DAILY_LIMIT = 50;

function startOfDhakaDayUtcIso(): string {
  const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000; // Asia/Dhaka is UTC+6, no DST
  const dhakaNow = new Date(Date.now() + DHAKA_OFFSET_MS);
  const dhakaMidnight = Date.UTC(dhakaNow.getUTCFullYear(), dhakaNow.getUTCMonth(), dhakaNow.getUTCDate());
  return new Date(dhakaMidnight - DHAKA_OFFSET_MS).toISOString();
}

type ChatMode = "rubric" | "general";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profile) return NextResponse.json({ error: "complete onboarding first" }, { status: 400 });

  const body = await request.json();
  const {
    sessionId: incomingSessionId,
    mode = "rubric" as ChatMode,
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
    languagePreference = "bn",
    stream = false,
  } = body as {
    sessionId?: string;
    mode?: ChatMode;
    submissionId?: string;
    questionId?: string;
    rubricStepIndex?: number;
    questionText?: string;
    studentAnswerChunk?: string;
    rubricFailureReason?: string;
    groundedContext?: string;
    subjectId?: string;
    chapterId?: string;
    studentMessage: string;
    languagePreference?: "bn" | "en";
    stream?: boolean;
  };

  if (!studentMessage?.trim()) {
    return NextResponse.json({ error: "studentMessage is required" }, { status: 400 });
  }

  // Rate limit: count today's (Asia/Dhaka) student-authored messages across
  // every session this student owns.
  const { count: todaysMessageCount } = await supabase
    .from("tutor_chat_messages")
    .select("id, tutor_chat_sessions!inner(student_id)", { count: "exact", head: true })
    .eq("role", "student")
    .eq("tutor_chat_sessions.student_id", profile.id)
    .gte("created_at", startOfDhakaDayUtcIso());

  if ((todaysMessageCount ?? 0) >= TUTOR_CHAT_DAILY_LIMIT) {
    return NextResponse.json(
      { error: "rate_limited", message: "আজকের জন্য প্রশ্নের সীমা শেষ, আগামীকাল আবার চেষ্টা করো।" },
      { status: 429 }
    );
  }

  type ChatSession = {
    id: string;
    mode: ChatMode;
    context_json: Record<string, unknown> | null;
  };

  // Resolve or create the session.
  let session: ChatSession | null = null;

  if (incomingSessionId) {
    const { data } = await supabase
      .from("tutor_chat_sessions")
      .select("id, mode, context_json")
      .eq("id", incomingSessionId)
      .maybeSingle();
    if (!data) return NextResponse.json({ error: "session not found" }, { status: 404 });
    session = data as ChatSession;
  } else if (mode === "rubric") {
    if (!submissionId || !questionId || rubricStepIndex == null) {
      return NextResponse.json(
        { error: "submissionId, questionId, and rubricStepIndex are required for a new rubric session" },
        { status: 400 }
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
      const { data: created, error } = await supabase
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
        .single();
      if (error || !created) {
        return NextResponse.json({ error: error?.message ?? "failed to create session" }, { status: 500 });
      }
      session = created as ChatSession;
    }
  } else {
    if (!chapterId) {
      return NextResponse.json({ error: "chapterId is required for a new general session" }, { status: 400 });
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
      return NextResponse.json({ error: error?.message ?? "failed to create session" }, { status: 500 });
    }
    session = created as ChatSession;
  }

  if (!session) return NextResponse.json({ error: "failed to resolve session" }, { status: 500 });

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

  let groundedContext = session.mode === "rubric" ? ctx.groundedContext : undefined;

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

    process.stdout.write(`\n--- PROMPT START ---\n${prompt}\n--- PROMPT END ---\n`);

    const encoder = new TextEncoder();
    const resolvedSessionId = session.id;

    const streamResponse = new ReadableStream({
      async start(controller) {
        try {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "start", sessionId: resolvedSessionId })}\n\n`
            )
          );

          const genRes = await ai.generate({
            model: MODELS.reasoning,
            prompt,
            config: { temperature: 0.5 },
          });

          const rawReply = genRes.text || "";
          const finalReply = stripLeadingGreeting(normalizeLatexDelimiters(rawReply));

          // Stream chunks to client in small bursts for realistic fluid typing effect
          const words = finalReply.split(/(\s+)/);
          let tokenBuffer = "";
          for (let i = 0; i < words.length; i++) {
            tokenBuffer += words[i];
            if (i % 3 === 0 || i === words.length - 1) {
              try {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ type: "chunk", text: tokenBuffer })}\n\n`
                  )
                );
              } catch (_) {}
              tokenBuffer = "";
            }
          }

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
          } catch (_) {}
        } catch (streamErr) {
          console.error("SSE stream failed in tutor-chat:", streamErr);
          try {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "error", error: "LLM streaming failed" })}\n\n`
              )
            );
            controller.close();
          } catch (_) {}
        }
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
