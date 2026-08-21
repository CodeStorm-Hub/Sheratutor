import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { ExplainSimplyButton } from "@/components/explain-simply-button";
import { PageTranscriptionCard } from "@/components/page-transcription-card";
import { submissionStatusLabel } from "@/lib/submission-status";
import { MarkGlyph, type MasteryLevel } from "@/components/mark-glyph";

function stepLevel(awarded: number, max: number): MasteryLevel {
  if (max <= 0) return "review";
  const ratio = awarded / max;
  if (ratio >= 1) return "mastered";
  if (ratio > 0) return "review";
  return "gap";
}

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
          {submission.question_papers?.subjects?.name_en ?? "মূল্যায়ন"}
        </h1>
        <p className="text-sm text-muted-foreground">{submission.question_papers?.title}</p>
      </div>

      {/* Score card, ruled like the khata's marked total — the examiner-red
          margin rule is reserved for exactly this: the mark, made final. */}
      <div className="margin-rule rounded-r-2xl border border-l-0 border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4">
          <span className="eyebrow text-xs text-muted-foreground">অবস্থা</span>
          <Badge variant={submission.status === "COMPLETED" ? "default" : "secondary"}>
            {submissionStatusLabel(submission.status)}
          </Badge>
        </div>
        {submission.status === "COMPLETED" && (
          <div className="px-5 pb-5 pt-2">
            <p className="font-heading font-extrabold text-5xl text-red font-tabular">
              {submission.total_score_obtained}
              <span className="text-2xl font-semibold text-muted-foreground">/{submission.max_possible_score}</span>
            </p>
            <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-red rounded-full transition-all" style={{ width: `${Math.min(100, pct)}%` }} />
            </div>
          </div>
        )}
      </div>

      {(results ?? []).map((r) => (
        <Card key={r.id}>
          <CardHeader>
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-base font-heading font-tabular">
                প্রশ্ন {r.questions?.question_number} — {r.score_obtained}/{r.max_marks}
              </CardTitle>
              {r.transcript_mismatch_detected && (
                <Badge variant="outline" className="bg-red-soft text-red-deep border-red/30 gap-1 text-[11px]">
                  <AlertTriangle className="w-3 h-3" />
                  লেখা সঠিকভাবে পড়া হয়নি হতে পারে
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{r.questions?.question_text_bn || r.questions?.question_text_en}</p>
            {r.transcript_mismatch_note && (
              <p className="text-xs text-red-deep dark:text-red">{r.transcript_mismatch_note}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {(r.rubric_breakdown_json as Array<Record<string, unknown>>)?.map(
              (criterion, idx: number) => {
                const awarded = Number(criterion.awarded_marks) || 0;
                const max = Number(criterion.max_step_marks) || 0;
                const level = stepLevel(awarded, max);
                return (
                  <div key={idx} className="flex items-start gap-3 border-b border-border last:border-0 pb-3 last:pb-0">
                    <MarkGlyph level={level} className="mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{String(criterion.step_name)}</p>
                      <p className="text-xs text-muted-foreground">{String(criterion.observation)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className="font-tabular">
                        {awarded}/{max}
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
                );
              }
            )}
            <p className="text-sm bg-muted rounded-lg p-3 mt-2">{r.explanation_summary_bn}</p>
          </CardContent>
        </Card>
      ))}

      {(pages ?? []).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="eyebrow text-xs text-muted-foreground">তোমার স্ক্যান করা পৃষ্ঠাগুলো</CardTitle>
            <p className="text-xs text-muted-foreground">
              তোমার হাতের লেখা থেকে আমরা যা পড়েছি এটাই তা। কিছু ভুল মনে হলে ফ্ল্যাগ করো।
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
