import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

/**
 * docs/review §3 mitigation #4: student-facing "this isn't what I wrote"
 * flag on a page's OCR transcription.
 */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string; pageId: string }> }) {
  const { id: submissionId, pageId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // RLS (submission_pages_select) scopes this to the caller's own submission —
  // an update on a page that doesn't belong to them affects zero rows.
  const { data: updated, error } = await supabase
    .from("submission_pages")
    .update({ student_flagged_mismatch: true })
    .eq("id", pageId)
    .eq("submission_id", submissionId)
    .select("id")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });

  const service = getServiceRoleClient();
  await service.from("audit_log").insert({
    actor_id: user.id,
    action: "TRANSCRIPTION_FLAGGED",
    entity_type: "submission_page",
    entity_id: pageId,
    detail_json: { submission_id: submissionId },
  });

  return NextResponse.json({ ok: true });
}
