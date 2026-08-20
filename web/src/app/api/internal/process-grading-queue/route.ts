import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { gradeSubmissionFlow } from "@/ai/flows/grade-submission";

const MAX_ATTEMPTS = 3;
const BATCH_SIZE = 5;
const VISIBILITY_TIMEOUT_SECONDS = 120;

type QueueMessage = {
  msg_id: number;
  read_ct: number;
  enqueued_at: string;
  vt: string;
  message: { submissionId: string };
};

async function drainGradingQueue() {
  const supabase = getServiceRoleClient();

  const { data: messages, error } = await supabase.rpc("read_grading_jobs", {
    p_qty: BATCH_SIZE,
    p_vt: VISIBILITY_TIMEOUT_SECONDS,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const results: { submissionId: string; status: "graded" | "failed" | "failed_terminal" }[] = [];

  for (const msg of (messages ?? []) as QueueMessage[]) {
    const submissionId = msg.message?.submissionId;
    if (!submissionId) {
      await supabase.rpc("archive_grading_job", { p_msg_id: msg.msg_id });
      continue;
    }

    try {
      await gradeSubmissionFlow({ submissionId });
      await supabase.rpc("archive_grading_job", { p_msg_id: msg.msg_id });
      results.push({ submissionId, status: "graded" });
    } catch (err) {
      console.error(`gradeSubmissionFlow failed for ${submissionId}:`, err);

      const { data: submission } = await supabase
        .from("exam_submissions")
        .select("attempt_count")
        .eq("id", submissionId)
        .maybeSingle();
      const attemptCount = (submission?.attempt_count ?? 0) + 1;
      const errorDetail = err instanceof Error ? err.message.slice(0, 2000) : String(err).slice(0, 2000);

      if (attemptCount >= MAX_ATTEMPTS) {
        // Give up: mark terminally failed and stop pgmq from redelivering.
        await supabase
          .from("exam_submissions")
          .update({ status: "FAILED", attempt_count: attemptCount, error_detail: errorDetail })
          .eq("id", submissionId);
        await supabase.rpc("archive_grading_job", { p_msg_id: msg.msg_id });
        results.push({ submissionId, status: "failed_terminal" });
      } else {
        // Leave the message alone — its visibility timeout will expire and
        // pgmq will make it re-readable for another attempt.
        await supabase
          .from("exam_submissions")
          .update({ attempt_count: attemptCount, error_detail: errorDetail })
          .eq("id", submissionId);
        results.push({ submissionId, status: "failed" });
      }
    }
  }

  return NextResponse.json({ processed: results.length, results });
}

/**
 * Drains the `grading_queue` pgmq queue (supabase/migrations/
 * 00000000000018_grading_queue.sql). Two entry points, both gated:
 *   - POST + x-worker-secret: manual/external-scheduler invocation.
 *   - GET + Vercel Cron's Authorization: Bearer CRON_SECRET header: the
 *     scheduled trigger wired in vercel.json (crons always send GET).
 */
export async function POST(request: Request) {
  const secret = request.headers.get("x-worker-secret");
  if (!secret || secret !== process.env.INTERNAL_WORKER_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return drainGradingQueue();
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return drainGradingQueue();
}
