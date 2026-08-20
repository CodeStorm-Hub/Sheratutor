import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const CreateSubmissionSchema = z.object({
  questionPaperId: z.string().min(1),
  pageUrls: z.array(z.string().min(1)).min(1),
  pageQuestionIds: z.array(z.string().nullable()).optional(),
  submissionType: z.enum(["MOBILE_PHOTO", "WEB_UPLOAD", "BATCH_SCAN"]).default("WEB_UPLOAD"),
  idempotencyKey: z.string().optional(),
});

/**
 * Creates a submission + its pages, then enqueues grading.
 *
 * Grading is dispatched via the `enqueue_grading_job` SECURITY DEFINER
 * wrapper (supabase/migrations/00000000000018_grading_queue.sql), which
 * calls `pgmq.send()` on the `grading_queue` — the real production path
 * docs/review §5.3 called for, replacing the previous same-process `after()`
 * dispatch so a crashed request can't silently drop a submission stuck in
 * QUEUED. A worker (src/app/api/internal/process-grading-queue/route.ts)
 * drains the queue; wiring it to run automatically needs a pg_cron schedule
 * pointed at the deployed app's URL — see that migration's commented-out
 * cron block. Until that's activated, the queue must be drained manually
 * (or by an external scheduler hitting the worker route).
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

  const rawBody = await request.json().catch(() => null);
  const parsed = CreateSubmissionSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_request", message: parsed.error.issues[0]?.message ?? "Invalid request body" },
      { status: 400 }
    );
  }
  const { questionPaperId, pageUrls, pageQuestionIds, submissionType, idempotencyKey } = parsed.data;

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
      submission_type: submissionType,
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
    question_id: pageQuestionIds?.[i] ?? null,
  }));

  const { error: pagesErr } = await supabase.from("submission_pages").insert(pageRows);
  if (pagesErr) {
    return NextResponse.json({ error: pagesErr.message }, { status: 500 });
  }

  const { error: enqueueErr } = await supabase.rpc("enqueue_grading_job", { p_submission_id: submission.id });
  if (enqueueErr) {
    console.error(`enqueue_grading_job failed for ${submission.id}:`, enqueueErr);
  }

  return NextResponse.json({ submissionId: submission.id });
}
