import { NextResponse, after } from "next/server";
import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { gradeSubmissionFlow } from "@/ai/flows/grade-submission";

/**
 * Creates a submission + its pages, then kicks off grading.
 *
 * Grading itself is dispatched via `after()` so the upload response returns
 * immediately rather than holding the HTTP connection open for the full
 * OCR->RAG->grade pipeline (docs/review §5.3 — grading must be async, never
 * a synchronous request). This is still a same-process dispatch, adequate
 * for the vertical slice; the production path is a real queue (Supabase
 * pgmq) consumed by a separate worker so a crashed request can't silently
 * drop a submission stuck in QUEUED — swap `after()` for a pgmq `send()`
 * call once that worker exists.
 */
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

  const body = await request.json();
  const { questionPaperId, pageUrls, submissionType, idempotencyKey } = body as {
    questionPaperId: string;
    pageUrls: string[];
    submissionType: "MOBILE_PHOTO" | "WEB_UPLOAD" | "BATCH_SCAN";
    idempotencyKey?: string;
  };

  if (!questionPaperId || !pageUrls?.length) {
    return NextResponse.json({ error: "questionPaperId and pageUrls are required" }, { status: 400 });
  }

  const key = idempotencyKey ?? randomUUID();

  // Idempotent on retry: a duplicate request with the same key returns the
  // existing submission instead of creating (and re-billing inference for) a second one.
  const { data: existing } = await supabase
    .from("exam_submissions")
    .select("id")
    .eq("idempotency_key", key)
    .maybeSingle();
  if (existing) return NextResponse.json({ submissionId: existing.id, deduped: true });

  const { data: submission, error: subErr } = await supabase
    .from("exam_submissions")
    .insert({
      student_id: profile.id,
      question_paper_id: questionPaperId,
      submission_type: submissionType ?? "WEB_UPLOAD",
      idempotency_key: key,
      status: "QUEUED",
    })
    .select("id")
    .single();

  if (subErr || !submission) {
    return NextResponse.json({ error: subErr?.message ?? "failed to create submission" }, { status: 500 });
  }

  const pageRows = pageUrls.map((url, i) => ({
    submission_id: submission.id,
    page_number: i + 1,
    original_image_url: url,
  }));

  const { error: pagesErr } = await supabase.from("submission_pages").insert(pageRows);
  if (pagesErr) {
    return NextResponse.json({ error: pagesErr.message }, { status: 500 });
  }

  after(async () => {
    try {
      await gradeSubmissionFlow({ submissionId: submission.id });
    } catch (err) {
      console.error(`gradeSubmissionFlow failed for ${submission.id}:`, err);
    }
  });

  return NextResponse.json({ submissionId: submission.id });
}
