import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { apiError } from "@/lib/api";
import { startOfDhakaDayUtcIso } from "@/lib/time";

const RequestBody = z.object({
  questionPaperId: z.string().min(1),
  pageUrls: z.array(z.string().min(1)).min(1, "at least one page is required").max(50),
  pageQuestionIds: z.array(z.string().min(1).nullable()).optional(),
  submissionType: z.enum(["MOBILE_PHOTO", "WEB_UPLOAD", "BATCH_SCAN"]).default("WEB_UPLOAD"),
  idempotencyKey: z.string().min(1).max(200).optional(),
});

// Each submission triggers OCR + a grading-flow LLM run, so cap the expensive
// path per student per Asia/Dhaka day. Generous for a real practising student;
// deduplicated retries (same idempotency key) do not count against it.
const SUBMISSIONS_DAILY_LIMIT = 20;

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
 *
 * The enqueue RPC runs through the service-role client: the submission row
 * above is already created and ownership-checked under the caller's RLS
 * session, so the queue push is a trusted server-side step and
 * `enqueue_grading_job` no longer needs to be exposed to `authenticated`
 * (migration 00000000000026).
 */
export async function POST(request: Request) {
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

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return apiError(400, "invalid JSON body");
  }
  const parsed = RequestBody.safeParse(rawBody);
  if (!parsed.success) {
    return apiError(400, parsed.error.issues[0]?.message ?? "invalid request");
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

  const { count: todaysSubmissions } = await supabase
    .from("exam_submissions")
    .select("id", { count: "exact", head: true })
    .eq("student_id", profile.id)
    .gte("created_at", startOfDhakaDayUtcIso());
  if ((todaysSubmissions ?? 0) >= SUBMISSIONS_DAILY_LIMIT) {
    return apiError(429, "rate_limited", {
      message: "আজকের জমা দেওয়ার সীমা শেষ হয়েছে, আগামীকাল আবার চেষ্টা করো।",
    });
  }

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
    return apiError(500, subErr?.message ?? "failed to create submission");
  }

  const pageRows = pageUrls.map((url, i) => ({
    submission_id: submission.id,
    page_number: i + 1,
    original_image_url: url,
    question_id: pageQuestionIds?.[i] ?? null,
  }));

  const { error: pagesErr } = await supabase.from("submission_pages").insert(pageRows);
  if (pagesErr) {
    return apiError(500, pagesErr.message);
  }

  const { error: enqueueErr } = await getServiceRoleClient().rpc("enqueue_grading_job", {
    p_submission_id: submission.id,
  });
  if (enqueueErr) {
    console.error(`enqueue_grading_job failed for ${submission.id}:`, enqueueErr);
  }

  return NextResponse.json({ submissionId: submission.id });
}
