import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle } from "lucide-react";
import { ExplainSimplyButton } from "@/components/explain-simply-button";
import { PageTranscriptionCard } from "@/components/page-transcription-card";
import { submissionStatusLabel } from "@/lib/submission-status";

export default async function SubmissionPage({ params }: PageProps<"/dashboard/submissions/[id]">) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: submission } = await supabase
    .from("exam_submissions")
    .select("*, question_papers(title, subjects(name_en))")
    .eq("id", id)
    .maybeSingle();

  if (!submission) notFound();

  const { data: results } = await supabase
    .from("grading_results")
    .select("*, questions(question_number, question_text_bn, question_text_en)")
    .eq("submission_id", id)
    .order("created_at");

  const { data: pages } = await supabase
    .from("submission_pages")
    .select("id, page_number, original_image_url, ocr_raw_text, transcription_confidence, student_flagged_mismatch")
    .eq("submission_id", id)
    .order("page_number");

  const pct =
    submission.max_possible_score && submission.max_possible_score > 0
      ? (Number(submission.total_score_obtained ?? 0) / Number(submission.max_possible_score)) * 100
      : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl">
          {submission.question_papers?.subjects?.name_en ?? "Submission"}
        </h1>
        <p className="text-sm text-muted-foreground">{submission.question_papers?.title}</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="eyebrow text-xs text-muted-foreground">Status</CardTitle>
            <Badge variant={submission.status === "COMPLETED" ? "default" : "secondary"}>
              {submissionStatusLabel(submission.status)}
            </Badge>
          </div>
        </CardHeader>
        {submission.status === "COMPLETED" && (
          <CardContent>
            <p className="font-heading font-extrabold text-3xl text-primary">
              {submission.total_score_obtained} / {submission.max_possible_score}
            </p>
            <Progress value={pct} className="mt-3" />
          </CardContent>
        )}
      </Card>

      {(results ?? []).map((r) => (
        <Card key={r.id} className="shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-base font-heading">
                Question {r.questions?.question_number} — {r.score_obtained}/{r.max_marks}
              </CardTitle>
              {r.transcript_mismatch_detected && (
                <Badge variant="outline" className="bg-coral/20 text-coral-deep border-coral/30 gap-1 text-[11px]">
                  <AlertTriangle className="w-3 h-3" />
                  Transcript may not match handwriting
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{r.questions?.question_text_en}</p>
            {r.transcript_mismatch_note && (
              <p className="text-xs text-coral-deep dark:text-coral">{r.transcript_mismatch_note}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {(r.rubric_breakdown_json as Array<Record<string, unknown>>)?.map(
              (criterion, idx: number) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 border-b border-border last:border-0 pb-2 last:pb-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{String(criterion.step_name)}</p>
                    <p className="text-xs text-muted-foreground">{String(criterion.observation)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline">
                      {String(criterion.awarded_marks)}/{String(criterion.max_step_marks)}
                    </Badge>
                    <ExplainSimplyButton
                      questionText={r.questions?.question_text_bn || r.questions?.question_text_en || ""}
                      stepName={String(criterion.step_name)}
                      observation={String(criterion.observation)}
                      studentAnswerChunk={String(criterion.observation)}
                      submissionId={id}
                      questionId={r.question_id}
                      rubricStepIndex={idx}
                    />
                  </div>
                </div>
              )
            )}
            <p className="text-sm bg-muted rounded-lg p-3 mt-2">{r.explanation_summary_bn}</p>
          </CardContent>
        </Card>
      ))}

      {(pages ?? []).length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="eyebrow text-xs text-muted-foreground">Your scanned pages</CardTitle>
            <p className="text-xs text-muted-foreground">
              This is what we read from your handwriting. If something looks wrong, flag it.
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {(pages ?? []).map((p) => (
              <PageTranscriptionCard key={p.id} submissionId={id} page={p} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
