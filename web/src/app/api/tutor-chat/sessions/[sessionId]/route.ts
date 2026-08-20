import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
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

  // Filtered by student_id explicitly, not just RLS, as defense-in-depth —
  // see the same fix in /api/tutor-chat/route.ts.
  const { data: session } = await supabase
    .from("tutor_chat_sessions")
    .select("id, mode, title, context_json")
    .eq("id", sessionId)
    .eq("student_id", profile.id)
    .maybeSingle();
  if (!session) return NextResponse.json({ error: "not found" }, { status: 404 });

  const { data: messages, error } = await supabase
    .from("tutor_chat_messages")
    .select("id, role, content, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ session, messages: messages ?? [] });
}
