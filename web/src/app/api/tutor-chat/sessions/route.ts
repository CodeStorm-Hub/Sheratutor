import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profile) return NextResponse.json({ error: "complete onboarding first" }, { status: 400 });

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
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ sessions: sessions ?? [] });
  }

  const submissionId = searchParams.get("submissionId");
  const questionId = searchParams.get("questionId");
  const rubricStepIndex = searchParams.get("rubricStepIndex");

  if (!submissionId || !questionId || rubricStepIndex == null) {
    return NextResponse.json(
      { error: "pass mode=general, or submissionId+questionId+rubricStepIndex" },
      { status: 400 }
    );
  }

  const { data: session, error } = await supabase
    .from("tutor_chat_sessions")
    .select("id")
    .eq("student_id", profile.id)
    .eq("submission_id", submissionId)
    .eq("question_id", questionId)
    .eq("rubric_step_index", Number(rubricStepIndex))
    .eq("mode", "rubric")
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ session: session ?? null });
}
