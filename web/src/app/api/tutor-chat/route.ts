import { NextResponse } from "next/server";
import { appRoute } from "@genkit-ai/next";
import { GenkitError } from "genkit";
import { tutorAgent } from "@/ai/agents/tutor-agent";
import { createClient } from "@/lib/supabase/server";
import { startOfDhakaDayUtcIso } from "@/lib/time";
import { preFilterSafety, SAFE_ESCALATION_MESSAGE_BN } from "@/ai/flows/tutor-chat";

import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { isUuid } from "@/lib/supabase/session-store";

export const maxDuration = 60;
const TUTOR_CHAT_DAILY_LIMIT = 50;

/**
 * Context provider: executes before the agent runs, enforcing authentication,
 * student onboarding status, and daily quota limits in Asia/Dhaka time.
 */
const contextProvider = async (_req: { method: string; headers: Record<string, string>; input?: unknown }) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new GenkitError({
      status: "UNAUTHENTICATED",
      message: "unauthorized",
    });
  }

  const { data: profile } = await supabase
    .from("student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    throw new GenkitError({
      status: "FAILED_PRECONDITION",
      message: "complete onboarding first",
    });
  }

  // Rate limit: count today's messages in Asia/Dhaka
  const { count: todaysMessageCount } = await supabase
    .from("tutor_chat_messages")
    .select("id, tutor_chat_sessions!inner(student_id)", { count: "exact", head: true })
    .eq("role", "student")
    .eq("tutor_chat_sessions.student_id", profile.id)
    .gte("created_at", startOfDhakaDayUtcIso());

  if ((todaysMessageCount ?? 0) >= TUTOR_CHAT_DAILY_LIMIT) {
    throw new GenkitError({
      status: "RESOURCE_EXHAUSTED",
      message: "আজকের জন্য প্রশ্নের সীমা শেষ, আগামীকাল আবার চেষ্টা করো।",
    });
  }

  return {
    auth: { user, uid: user.id },
    userId: user.id,
    studentId: profile.id,
  };
};

const agentRouteHandler = appRoute(tutorAgent, { contextProvider });

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

  // Normalize message to Genkit MessageSchema ({ role: "user", content: [{ text }] })
  let normalizedMessage: { role: "user"; content: { text: string }[] };
  if (rawInputMessage && typeof rawInputMessage === "object" && "role" in rawInputMessage && "content" in rawInputMessage) {
    normalizedMessage = rawInputMessage as { role: "user"; content: { text: string }[] };
  } else {
    normalizedMessage = {
      role: "user",
      content: [{ text: rawText }],
    };
  }

  const rawInit = (body?.init as Record<string, unknown> | undefined) || {};
  const rawState = (rawInit.state as Record<string, unknown> | undefined) || {};
  const rawCustom = (rawState.custom as Record<string, unknown> | undefined) || {};

  const normalizedInit = {
    ...rawInit,
    sessionId: resolvedSessionId,
    state: {
      ...rawState,
      sessionId: resolvedSessionId,
      custom: {
        ...rawCustom,
        studentId: profile.id,
        sessionId: resolvedSessionId,
        mode: rawCustom.mode || body?.mode || "general",
        studentMessage: rawText,
        submissionId: rawCustom.submissionId || body?.submissionId,
        questionId: rawCustom.questionId || body?.questionId,
        rubricStepIndex: rawCustom.rubricStepIndex ?? body?.rubricStepIndex,
        questionText: rawCustom.questionText || body?.questionText,
        studentAnswerChunk: rawCustom.studentAnswerChunk || body?.studentAnswerChunk,
        rubricFailureReason: rawCustom.rubricFailureReason || body?.rubricFailureReason,
        groundedContext: rawCustom.groundedContext || body?.groundedContext,
        subjectId: rawCustom.subjectId || body?.subjectId,
        chapterId: rawCustom.chapterId || body?.chapterId,
      },
    },
  };

  const rawData = (body?.data as Record<string, unknown> | undefined) || {};
  const normalizedPayload = {
    data: {
      message: normalizedMessage,
      resume: rawData.resume || body?.resume,
      detach: rawData.detach || body?.detach,
    },
    init: normalizedInit,
  };

  const adaptedReq = new Request(req.url, {
    method: req.method,
    headers: req.headers,
    body: JSON.stringify(normalizedPayload),
    signal: req.signal,
  });

  const res = await agentRouteHandler(adaptedReq as unknown as Parameters<typeof agentRouteHandler>[0]);

  // If client is a standard JSON caller expecting { sessionId, reply }
  if (req.headers.get("accept") !== "text/event-stream" && res.status === 200) {
    const json = (await res.json()) as { result?: { message?: unknown; sessionId?: string } };
    const msg = json.result?.message;
    let text = "";
    if (typeof msg === "string") {
      text = msg;
    } else if (msg && typeof msg === "object" && "content" in msg && Array.isArray((msg as { content?: unknown[] }).content)) {
      text = ((msg as { content: unknown[] }).content)
        .map((c) => (c && typeof c === "object" && "text" in c ? String((c as { text?: unknown }).text || "") : ""))
        .join("");
    }
    return NextResponse.json({
      sessionId: json.result?.sessionId || resolvedSessionId,
      reply: text,
      safety: { flagged: false, category: "none" },
      result: json.result,
    });
  }

  return res;
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
