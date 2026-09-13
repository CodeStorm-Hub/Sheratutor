import { type NextRequest, NextResponse } from "next/server";
import { appRoute } from "@genkit-ai/next";
import { tutorAgent } from "@/ai/agents/tutor-agent";
import { createClient } from "@/lib/supabase/server";

const abortHandler = appRoute(tutorAgent.abortAgentAction);

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return abortHandler(req);
}
