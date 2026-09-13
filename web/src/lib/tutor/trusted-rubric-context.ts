import { getServiceRoleClient } from "@/lib/supabase/service-role";

export type TrustedRubricContext = {
  questionText: string;
  studentAnswerChunk: string;
  rubricFailureReason: string;
  groundedContext: string;
  subjectName?: string;
  chapterName?: string;
};

/**
 * Load tutor "Explain it simply" academic frame from owned grading data.
 * Never trust client-supplied question/answer/rubric text for rubric mode.
 */
export async function loadTrustedRubricContext(opts: {
  studentProfileId: string;
  submissionId: string;
  questionId: string;
  rubricStepIndex: number | null;
}): Promise<TrustedRubricContext | null> {
  const service = getServiceRoleClient();

  const { data: submission } = await service
    .from("exam_submissions")
    .select("id, student_id")
    .eq("id", opts.submissionId)
    .eq("student_id", opts.studentProfileId)
    .maybeSingle();
  if (!submission) return null;

  const { data: result } = await service
    .from("grading_results")
    .select(
      "rubric_breakdown_json, explanation_summary_bn, explanation_summary_en, questions(id, question_text_bn, question_text_en, chapter_id, chapters(title_bn, title_en, subjects(name_bn, name_en)))"
    )
    .eq("submission_id", opts.submissionId)
    .eq("question_id", opts.questionId)
    .maybeSingle();
  if (!result) return null;

  const question = result.questions as {
    question_text_bn?: string | null;
    question_text_en?: string | null;
    chapters?: {
      title_bn?: string | null;
      title_en?: string | null;
      subjects?: { name_bn?: string | null; name_en?: string | null } | null;
    } | null;
  } | null;

  const breakdown = (result.rubric_breakdown_json as Array<Record<string, unknown>>) ?? [];
  const step =
    opts.rubricStepIndex != null && opts.rubricStepIndex >= 0
      ? breakdown[opts.rubricStepIndex]
      : breakdown.find((s) => {
          const awarded = Number(s.awarded_marks ?? s.awarded ?? 0);
          const max = Number(s.max_step_marks ?? s.max ?? 0);
          return max > awarded;
        }) ?? breakdown[0];

  const observation = String(step?.observation ?? step?.comment ?? "");
  const studentChunk = String(
    step?.student_answer_span ?? step?.student_excerpt ?? observation
  );

  const chapter = question?.chapters;
  const subject = chapter?.subjects;

  return {
    questionText: question?.question_text_bn || question?.question_text_en || "",
    studentAnswerChunk: studentChunk,
    rubricFailureReason: observation,
    groundedContext:
      result.explanation_summary_bn ||
      result.explanation_summary_en ||
      "",
    subjectName: subject?.name_bn || subject?.name_en || undefined,
    chapterName: chapter?.title_bn || chapter?.title_en || undefined,
  };
}
