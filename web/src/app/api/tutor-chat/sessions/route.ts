import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { apiError } from "@/lib/api";

/**
 * GET /api/tutor-chat/sessions
 *   ?mode=general                                        -> list this student's general-mode sessions
 *   ?submissionId=&questionId=&rubricStepIndex=           -> the one rubric session for that step, or null
 */
export async function GET(request: Request) {
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

  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode");

  if (mode === "general") {
    const { data: sessions, error } = await supabase
      .from("tutor_chat_sessions")
      .select("id, title, context_json, updated_at")
      .eq("student_id", profile.id)
      .eq("mode", "general")
      .order("updated_at", { ascending: false })
      .limit(50);
    if (error) return apiError(500, error.message);
    return NextResponse.json({ sessions: sessions ?? [] });
  }

  const submissionId = searchParams.get("submissionId");
  const questionId = searchParams.get("questionId");
  const rubricStepIndex = searchParams.get("rubricStepIndex");

  const stepIndex = Number(rubricStepIndex);
  if (!submissionId || !questionId || rubricStepIndex == null || !Number.isInteger(stepIndex) || stepIndex < 0) {
    return apiError(
      400,
      "pass mode=general, or submissionId+questionId+rubricStepIndex (non-negative integer)",
    );
  }

  const { data: session, error } = await supabase
    .from("tutor_chat_sessions")
    .select("id")
    .eq("student_id", profile.id)
    .eq("submission_id", submissionId)
    .eq("question_id", questionId)
    .eq("rubric_step_index", stepIndex)
    .eq("mode", "rubric")
    .maybeSingle();
  if (error) return apiError(500, error.message);

  return NextResponse.json({ session: session ?? null });
}
