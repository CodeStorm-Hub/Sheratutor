import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ExplainSimplyButton } from "@/components/explain-simply-button";
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

      <Card>
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
        <Card key={r.id}>
          <CardHeader>
            <CardTitle className="text-base font-heading">
              Question {r.questions?.question_number} — {r.score_obtained}/{r.max_marks}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{r.questions?.question_text_en}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {(r.rubric_breakdown_json as Array<Record<string, unknown>>)?.map(
              (criterion, idx: number) => (
                <div key={idx} className="flex items-start justify-between gap-3 border-b border-border last:border-0 pb-2 last:pb-0">
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
    </div>
  );
}
