import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { tutorChatFlow } from "@/ai/flows/tutor-chat";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const {
    questionText,
    studentAnswerChunk,
    rubricFailureReason,
    groundedContext,
    history,
    studentMessage,
    languagePreference,
  } = await request.json();

  const result = await tutorChatFlow({
    questionText,
    studentAnswerChunk,
    rubricFailureReason,
    groundedContext,
    history: history ?? [],
    studentMessage,
    languagePreference: languagePreference ?? "bn",
  });

  if (result.safety.flagged) {
    const service = getServiceRoleClient();
    await service.from("audit_log").insert({
      actor_id: user.id,
      action: "SAFETY_ESCALATION",
      entity_type: "tutor_chat",
      entity_id: user.id,
      detail_json: { category: result.safety.category },
    });
  }

  return NextResponse.json(result);
}
