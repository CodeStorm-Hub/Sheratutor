import { NextResponse } from "next/server";
import { tutorAgent } from "@/ai/agents/tutor-agent";
import { createClient } from "@/lib/supabase/server";
import { startOfDhakaDayUtcIso } from "@/lib/time";
import {
  preFilterSafety,
  SAFE_ESCALATION_MESSAGE_BN,
  sanitizeTutorReply,
  tutorChatFlow,
} from "@/ai/flows/tutor-chat";
import { retrieveGroundingFlow } from "@/ai/flows/retrieve-grounding";

import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { isUuid } from "@/lib/supabase/session-store";
import { loadTrustedRubricContext } from "@/lib/tutor/trusted-rubric-context";

export const maxDuration = 60;
const TUTOR_CHAT_DAILY_LIMIT = 50;
const HISTORY_TURNS = 20;

export async function POST(req: Request) {
  const cloned = req.clone();
  let body: Record<string, unknown> | null = null;
  try {
    body = (await cloned.json()) as Record<string, unknown>;
  } catch {
    // let base handler deal with bad json
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ error: "complete onboarding first" }, { status: 400 });
  }

  // Rate limit check
  const { count: todaysMessageCount } = await supabase
    .from("tutor_chat_messages")
    .select("id, tutor_chat_sessions!inner(student_id)", { count: "exact", head: true })
    .eq("role", "student")
    .eq("tutor_chat_sessions.student_id", profile.id)
    .gte("created_at", startOfDhakaDayUtcIso());

  if ((todaysMessageCount ?? 0) >= TUTOR_CHAT_DAILY_LIMIT) {
    return NextResponse.json(
      { error: "আজকের জন্য প্রশ্নের সীমা শেষ, আগামীকাল আবার চেষ্টা করো।" },
      { status: 429 }
    );
  }

  // Extract raw student message text
  const rawInputMessage = (body?.data as Record<string, unknown> | undefined)?.message ?? body?.studentMessage ?? body?.message;
  let rawText = "";
  if (typeof rawInputMessage === "string") {
    rawText = rawInputMessage;
  } else if (rawInputMessage && typeof rawInputMessage === "object" && "content" in rawInputMessage) {
    const content = (rawInputMessage as { content?: unknown }).content;
    if (Array.isArray(content)) {
      rawText = content.map((c) => (c && typeof c === "object" && "text" in c ? String(c.text || "") : "")).join("");
    }
  }

  const resolvedSessionId = (body?.sessionId as string | undefined) || ((body?.init as Record<string, unknown> | undefined)?.sessionId as string | undefined);

  // Check safety pre-filter on incoming student message
  if (rawText) {
    const safety = preFilterSafety(rawText);
    if (safety.flagged) {
      // Restore required safety audit log
      try {
        const service = getServiceRoleClient();
        await service.from("audit_log").insert({
          actor_id: user.id,
          action: "SAFETY_ESCALATION",
          entity_type: "tutor_chat",
          entity_id: user.id,
          detail_json: { category: safety.category, session_id: resolvedSessionId },
        });

        if (resolvedSessionId && isUuid(resolvedSessionId)) {
          await service.from("tutor_chat_messages").insert([
            { session_id: resolvedSessionId, role: "student", content: rawText, safety_category: safety.category },
            { session_id: resolvedSessionId, role: "tutor", content: SAFE_ESCALATION_MESSAGE_BN, safety_category: "none" },
          ]);
        }
      } catch (auditErr) {
        console.error("Failed to persist safety escalation audit/messages:", auditErr);
      }

      if (req.headers.get("accept") === "text/event-stream") {
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  message: { modelChunk: { content: [{ text: SAFE_ESCALATION_MESSAGE_BN }] } },
                })}\n\n`
              )
            );
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  result: {
                    message: { role: "model", content: [{ text: SAFE_ESCALATION_MESSAGE_BN }] },
                    finishReason: "stop",
                  },
                })}\n\nEND`
              )
            );
            controller.close();
          },
        });
        return new NextResponse(stream, {
          status: 200,
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      }

      return NextResponse.json({
        sessionId: resolvedSessionId,
        reply: SAFE_ESCALATION_MESSAGE_BN,
        safety,
      });
    }
  }

  // ------------------------------------------------------------------
  // Direct flow path. The Genkit tool-agent (`tutorAgent` via
  // `@genkit-ai/next` `appRoute`) returned JSON-schema dumps / empty streams
  // on free-tier NIM models, so the request now runs `tutorChatFlow`
  // directly and this route owns session + message persistence.
  // ------------------------------------------------------------------
  const rawInit = (body?.init as Record<string, unknown> | undefined) || {};
  const rawState = (rawInit.state as Record<string, unknown> | undefined) || {};
  const rawCustom = (rawState.custom as Record<string, unknown> | undefined) || {};
  const rawData = (body?.data as Record<string, unknown> | undefined) || {};
  const inlineMeta = (rawData.metadata as Record<string, unknown> | undefined) || {};
  const rawInput = (body?.input as Record<string, unknown> | undefined) || {};
  const inputMeta = (rawInput.metadata as Record<string, unknown> | undefined) || {};
  const bodyMeta = (body?.metadata as Record<string, unknown> | undefined) || {};

  const pick = <T = string>(key: string): T | undefined =>
    (rawCustom[key] ??
      (body as Record<string, unknown> | null)?.[key] ??
      inlineMeta[key] ??
      inputMeta[key] ??
      bodyMeta[key] ??
      rawInput[key] ??
      rawData[key]) as T | undefined;

  const mode: "rubric" | "general" = pick("mode") === "rubric" ? "rubric" : "general";
  const languagePreference: "bn" | "en" =
    (pick("languagePreference") ?? rawCustom.language) === "en" ? "en" : "bn";
  // "Explain it simply" general chat → a full worked explanation by default.
  // Rubric mode (talking through one graded deduction) → Socratic nudges.
  const scaffoldingStyle: "socratic" | "direct" =
    (pick("scaffoldingStyle") as "socratic" | "direct" | undefined) ??
    (mode === "rubric" ? "socratic" : "direct");

  const chapterId = pick("chapterId");
  const rawSubjectCode = pick("subjectCode") as string | undefined;
  let subjectName = pick("subjectName") as string | undefined;
  let chapterName = pick("chapterName") as string | undefined;

  let subjectCode = rawSubjectCode;
  if (!subjectCode && subjectName) {
    if (/math|গণিত/i.test(subjectName)) subjectCode = "SSC-MATH";
    else if (/chem|রসায়ন/i.test(subjectName)) subjectCode = "SSC-CHEM";
    else if (/phys|পদার্থ/i.test(subjectName)) subjectCode = "SSC-PHY";
  }
  // Client-supplied academic frame is ignored for rubric mode (loaded from DB).
  let questionText = pick("questionText") as string | undefined;
  let studentAnswerChunk = pick("studentAnswerChunk") as string | undefined;
  let rubricFailureReason = pick("rubricFailureReason") as string | undefined;
  let groundedContext = (pick("groundedContext") as string) || "";
  const rawHintRung = pick<number | string>("hintRung");
  const hintRung = typeof rawHintRung === "number" ? rawHintRung : (typeof rawHintRung === "string" ? parseInt(rawHintRung, 10) : 3);

  const service = getServiceRoleClient();

  const submissionIdPick = pick("submissionId") as string | undefined;
  const questionIdPick = pick("questionId") as string | undefined;
  const rubricStepRaw = pick<number | string>("rubricStepIndex");
  const rubricStepIndex =
    rubricStepRaw == null || rubricStepRaw === "" ? NaN : Number(rubricStepRaw);

  // ---- Resolve or create the chat session
  let sessionId: string | null = null;
  let sessionContext: Record<string, unknown> | null = null;
  if (resolvedSessionId && isUuid(resolvedSessionId)) {
    const { data: s } = await service
      .from("tutor_chat_sessions")
      .select("id, context_json, mode, submission_id, question_id, rubric_step_index")
      .eq("id", resolvedSessionId)
      .eq("student_id", profile.id)
      .maybeSingle();
    if (s) {
      sessionId = s.id;
      sessionContext = (s.context_json as Record<string, unknown>) ?? null;
    }
  }
  if (!sessionId) {
    let insertData: Record<string, unknown> = {
      student_id: profile.id,
      mode,
      title: (rawText || "Tutor Session").slice(0, 40),
      submission_id: mode === "rubric" ? (submissionIdPick ?? null) : null,
      question_id: mode === "rubric" ? (questionIdPick ?? null) : null,
      rubric_step_index:
        mode === "rubric" && Number.isInteger(rubricStepIndex) ? rubricStepIndex : null,
      context_json: { subjectName, chapterName, subjectId: pick("subjectId"), chapterId },
    };

    if (
      mode === "rubric" &&
      submissionIdPick &&
      questionIdPick &&
      isUuid(submissionIdPick) &&
      isUuid(questionIdPick)
    ) {
      const trusted = await loadTrustedRubricContext({
        studentProfileId: profile.id,
        submissionId: submissionIdPick,
        questionId: questionIdPick,
        rubricStepIndex: Number.isInteger(rubricStepIndex) ? rubricStepIndex : null,
      });
      if (!trusted) {
        return NextResponse.json({ error: "grading context not found" }, { status: 404 });
      }
      questionText = trusted.questionText;
      studentAnswerChunk = trusted.studentAnswerChunk;
      rubricFailureReason = trusted.rubricFailureReason;
      groundedContext = trusted.groundedContext;
      subjectName = trusted.subjectName ?? subjectName;
      chapterName = trusted.chapterName ?? chapterName;
      insertData = {
        ...insertData,
        context_json: {
          subjectName,
          chapterName,
          subjectId: pick("subjectId"),
          chapterId,
          questionText,
          studentAnswerChunk,
          rubricFailureReason,
          groundedContext,
          trustedFromGrading: true,
        },
      };
    } else if (mode === "rubric") {
      // Rubric mode requires owned submission + question — never accept free-form client frame alone.
      return NextResponse.json(
        { error: "rubric mode requires submissionId and questionId" },
        { status: 400 }
      );
    }

    let { data: created, error: createErr } = await service
      .from("tutor_chat_sessions")
      .insert(insertData)
      .select("id, context_json")
      .single();

    if (createErr && createErr.code === "23503") {
      if (mode === "rubric") {
        console.error("tutor-chat: rubric session FK invalid:", createErr);
        return NextResponse.json({ error: "invalid submission or question" }, { status: 400 });
      }
      // General-mode mock IDs in demos: strip foreign keys and retry
      const safeInsert = { ...insertData, submission_id: null, question_id: null };
      const retry = await service
        .from("tutor_chat_sessions")
        .insert(safeInsert)
        .select("id, context_json")
        .single();
      created = retry.data;
      createErr = retry.error;
    }

    if (createErr || !created) {
      console.error("tutor-chat: session create failed:", createErr);
      return NextResponse.json({ error: "could not start chat session" }, { status: 500 });
    }
    sessionId = created.id;
    sessionContext = (created.context_json as Record<string, unknown>) ?? null;
  }

  // Continuing rubric sessions: prefer server-stored trusted context over client body.
  if (mode === "rubric" && sessionContext?.trustedFromGrading) {
    questionText = (sessionContext.questionText as string) || questionText;
    studentAnswerChunk = (sessionContext.studentAnswerChunk as string) || studentAnswerChunk;
    rubricFailureReason = (sessionContext.rubricFailureReason as string) || rubricFailureReason;
    groundedContext = (sessionContext.groundedContext as string) || groundedContext;
    subjectName = (sessionContext.subjectName as string) || subjectName;
    chapterName = (sessionContext.chapterName as string) || chapterName;
  } else if (
    mode === "rubric" &&
    submissionIdPick &&
    questionIdPick &&
    isUuid(submissionIdPick) &&
    isUuid(questionIdPick)
  ) {
    const trusted = await loadTrustedRubricContext({
      studentProfileId: profile.id,
      submissionId: submissionIdPick,
      questionId: questionIdPick,
      rubricStepIndex: Number.isInteger(rubricStepIndex) ? rubricStepIndex : null,
    });
    if (trusted) {
      questionText = trusted.questionText;
      studentAnswerChunk = trusted.studentAnswerChunk;
      rubricFailureReason = trusted.rubricFailureReason;
      groundedContext = trusted.groundedContext;
      subjectName = trusted.subjectName ?? subjectName;
      chapterName = trusted.chapterName ?? chapterName;
    }
  }

  // General mode may still receive subject/chapter metadata from the client;
  // curriculum grounding is always re-fetched server-side below when empty.
  if (mode === "general") {
    groundedContext = "";
  }

  // ---- All pre-LLM work runs concurrently: history load, student-message
  // write, and RAG grounding. For general tutoring, every query is grounded
  // against the official NCTB curriculum chunks and authentic diagrams.
  const wantGrounding = !groundedContext && mode === "general";

  const historyP = service
    .from("tutor_chat_messages")
    .select("role, content")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true })
    .limit(HISTORY_TURNS)
    .then(({ data }) =>
      (data ?? []).map((m) => ({
        role: (m.role === "student" ? "student" : "tutor") as "student" | "tutor",
        text: m.content as string,
      }))
    );

  const studentInsertP = service
    .from("tutor_chat_messages")
    .insert({ session_id: sessionId, role: "student", content: rawText, safety_category: "none" });

  let diagramUrls: string[] = [];
  const groundingP: Promise<{ context: string; diagrams: string[] }> = wantGrounding
    ? Promise.race([
        retrieveGroundingFlow({
          queryText: rawText,
          chapterId: typeof chapterId === "string" ? chapterId : undefined,
          subjectCode,
          languageTag: languagePreference,
          matchCount: 3,
        }).then((g) => {
          const diagrams = g.chunks
            .flatMap((c) => c.diagram_image_urls ?? [])
            .filter((u): u is string => Boolean(u));
          return {
            context: g.chunks.map((c) => c.content_chunk).join("\n\n---\n\n"),
            diagrams,
          };
        }),
        new Promise<{ context: string; diagrams: string[] }>((resolve) =>
          setTimeout(() => resolve({ context: "", diagrams: [] }), 12_000)
        ),
      ]).catch((gErr) => {
        console.error("tutor-chat: grounding failed (continuing ungrounded):", gErr);
        return { context: "", diagrams: [] };
      })
    : Promise.resolve({ context: "", diagrams: [] });

  const [history, ragResult] = await Promise.all([historyP, groundingP, studentInsertP]);
  console.log("tutor-chat route resolved chapterId:", chapterId, "diagrams:", ragResult.diagrams);
  if (ragResult.context) groundedContext = ragResult.context;
  if (ragResult.diagrams && ragResult.diagrams.length > 0) diagramUrls = ragResult.diagrams;

  // ---- Generate
  // ---- Generate via resilient tutorChatFlow with 8-Rung Hint Ladder and multi-key failover
  let reply = "";
  let toolRequest: { name?: string; input?: unknown } | undefined;

  try {
    const out = await tutorChatFlow({
      mode,
      scaffoldingStyle,
      hintRung: isNaN(hintRung) ? 3 : hintRung,
      questionText: questionText as string | undefined,
      studentAnswerChunk: studentAnswerChunk as string | undefined,
      rubricFailureReason: rubricFailureReason as string | undefined,
      subjectName: subjectName as string | undefined,
      chapterName: chapterName as string | undefined,
      groundedContext: groundedContext || undefined,
      diagramUrls: diagramUrls.length > 0 ? diagramUrls : undefined,
      history,
      studentMessage: rawText,
      languagePreference,
    });
    reply = sanitizeTutorReply(out.reply);
  } catch (genErr) {
    console.error("tutor-chat: tutorChatFlow failed:", genErr);
  }

  if (!reply) {
    reply =
      languagePreference === "bn"
        ? "দুঃখিত, এই মুহূর্তে উত্তর তৈরি করা গেল না। একটু পরে আবার চেষ্টা করো।"
        : "Sorry, I couldn't put together an answer just now. Please try again.";
  }

  // Persist model reply and update session timestamp
  await Promise.all([
    service
      .from("tutor_chat_messages")
      .insert({ session_id: sessionId, role: "tutor", content: reply, safety_category: "none" }),
    service
      .from("tutor_chat_sessions")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", sessionId),
  ]);

  // ---- Respond (SSE stream matching client's streamFlow parser)
  if (req.headers.get("accept") === "text/event-stream") {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ message: { modelChunk: { content: [{ text: reply }] } } })}\n\n`
          )
        );
        const contentArr: any[] = [{ text: reply }];
        if (toolRequest) {
          contentArr.push({ toolRequest });
        }
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              result: {
                message: { role: "model", content: contentArr },
                sessionId,
                finishReason: toolRequest ? "interrupt" : "stop",
              },
            })}\n\nEND`
          )
        );
        controller.close();
      },
    });
    return new NextResponse(stream, {
      status: 200,
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
    });
  }

  return NextResponse.json({
    sessionId,
    reply,
    safety: { flagged: false, category: "none" },
    toolRequest,
  });
}

/**
 * Snapshot lookup / resumption endpoint.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId");
  const snapshotId = url.searchParams.get("snapshotId");

  if (!sessionId && !snapshotId) {
    return NextResponse.json({ error: "sessionId or snapshotId required" }, { status: 400 });
  }

  try {
    const snapshot = await tutorAgent.getSnapshotData({
      sessionId: sessionId ?? undefined,
      snapshotId: snapshotId ?? undefined,
    });
    return NextResponse.json({ result: snapshot });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to retrieve snapshot";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
