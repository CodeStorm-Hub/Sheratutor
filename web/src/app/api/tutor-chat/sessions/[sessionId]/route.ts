import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { apiError } from "@/lib/api";

export async function GET(_request: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
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

  // RLS already scopes both selects to the caller's own student_profiles row;
  // the explicit student_id filter is belt-and-suspenders (matches the POST
  // route in ../route.ts).
  const { data: session } = await supabase
    .from("tutor_chat_sessions")
    .select("id, mode, title, context_json")
    .eq("id", sessionId)
    .eq("student_id", profile.id)
    .maybeSingle();
  if (!session) return apiError(404, "not found");

  const { data: messages, error } = await supabase
    .from("tutor_chat_messages")
    .select("id, role, content, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });
  if (error) return apiError(500, error.message);

  return NextResponse.json({ session, messages: messages ?? [] });
}
