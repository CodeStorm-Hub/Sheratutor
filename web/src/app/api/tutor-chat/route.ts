import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { streamTutorChat } from "@/ai/flows/tutor-chat";
import { retrieveGroundingFlow } from "@/ai/flows/retrieve-grounding";

type SseEvent =
  | { type: "session"; sessionId: string }
  | { type: "chunk"; text: string }
  | { type: "done"; reply: string; safety: { flagged: boolean; category: string } }
  | { type: "error"; message: string };

function sseLine(event: SseEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

const TutorChatBodySchema = z.object({
  sessionId: z.string().optional(),
  mode: z.enum(["rubric", "general"]).default("rubric"),
  submissionId: z.string().optional(),
  questionId: z.string().optional(),
  rubricStepIndex: z.number().int().optional(),
  questionText: z.string().optional(),
  studentAnswerChunk: z.string().optional(),
  rubricFailureReason: z.string().optional(),
  groundedContext: z.string().optional(),
  subjectId: z.string().optional(),
  chapterId: z.string().optional(),
  studentMessage: z.string().min(1, "studentMessage is required"),
  languagePreference: z.enum(["bn", "en"]).default("bn"),
});

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

  const rawBody = await request.json().catch(() => null);
  const parsedBody = TutorChatBodySchema.safeParse(rawBody);
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "invalid_request", message: parsedBody.error.issues[0]?.message ?? "Invalid request body" },
      { status: 400 }
    );
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
  } = parsedBody.data;

  if (!studentMessage.trim()) {
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
    // Defense-in-depth: filter by student_id explicitly rather than relying
    // solely on RLS, since other paths in this codebase (retrieveGroundingFlow)
    // use the service-role client that bypasses RLS entirely.
    const { data } = await supabase
      .from("tutor_chat_sessions")
      .select("id, mode, context_json")
      .eq("id", incomingSessionId)
      .eq("student_id", profile.id)
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

  const history = (priorMessages ?? []).map((m) => ({
    role: m.role as "student" | "tutor",
    text: m.content,
  }));

  // General mode re-grounds against the chosen chapter on every turn since
  // the question changes turn to turn (rubric mode's grounding is frozen at
  // session creation — it's tied to one fixed graded question).
  let groundedContext = ctx.groundedContext;
  if (session.mode === "general" && ctx.chapterId) {
    try {
      const grounding = await retrieveGroundingFlow({
        queryText: studentMessage,
        chapterId: ctx.chapterId,
        languageTag: languagePreference,
        matchCount: 3,
      });
      groundedContext = grounding.chunks.map((c) => c.content_chunk).join("\n\n---\n\n");
    } catch (err) {
      console.error(`retrieveGroundingFlow failed for session ${session.id}:`, err);
    }
  }

  const sessionId = session.id;
  const sessionMode = session.mode;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (event: SseEvent) => controller.enqueue(encoder.encode(sseLine(event)));

      send({ type: "session", sessionId });

      try {
        let finalReply = "";
        let finalSafety: { flagged: boolean; category: string } = { flagged: false, category: "none" };

        for await (const event of streamTutorChat({
          mode: sessionMode,
          questionText: ctx.questionText,
          studentAnswerChunk: ctx.studentAnswerChunk,
          rubricFailureReason: ctx.rubricFailureReason,
          subjectName: ctx.subjectName,
          chapterName: ctx.chapterName,
          groundedContext,
          history,
          studentMessage,
          languagePreference,
        })) {
          if (event.type === "chunk") {
            send({ type: "chunk", text: event.text });
          } else {
            finalReply = event.reply;
            finalSafety = event.safety;
            send({ type: "done", reply: event.reply, safety: event.safety });
          }
        }

        await supabase.from("tutor_chat_messages").insert([
          { session_id: sessionId, role: "student", content: studentMessage, safety_category: finalSafety.category },
          { session_id: sessionId, role: "tutor", content: finalReply, safety_category: "none" },
        ]);

        await supabase.from("tutor_chat_sessions").update({ updated_at: new Date().toISOString() }).eq("id", sessionId);

        if (finalSafety.flagged) {
          const service = getServiceRoleClient();
          await service.from("audit_log").insert({
            actor_id: user.id,
            action: "SAFETY_ESCALATION",
            entity_type: "tutor_chat",
            entity_id: user.id,
            detail_json: { category: finalSafety.category, session_id: sessionId },
          });
        }
      } catch (err) {
        console.error(`tutor-chat stream failed for session ${sessionId}:`, err);
        send({ type: "error", message: "দুঃখিত, সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করো।" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
