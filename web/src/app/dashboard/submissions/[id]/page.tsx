import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  SubmissionDetailClient,
  CriterionItem,
  QuestionResultItem,
  PageItem,
} from '@/components/pages/SubmissionDetailClient';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: submission } = await supabase
    .from('exam_submissions')
    .select('*, question_papers(title, total_marks, subjects(name_en))')
    .eq('id', id)
    .maybeSingle();

  if (!submission) notFound();

  const [{ data: results }, { data: pages }] = await Promise.all([
    supabase
      .from('grading_results')
      .select('*, questions(id, question_number, question_text_bn, question_text_en, max_marks)')
      .eq('submission_id', id)
      .order('created_at'),
    supabase
      .from('submission_pages')
      .select('id, page_number, original_image_url, ocr_raw_text, transcription_confidence, student_flagged_mismatch')
      .eq('submission_id', id)
      .order('page_number'),
  ]);

  const subjectName =
    submission.question_papers?.subjects?.name_en || 'Physics';

  const scoreObtained = Number(submission.total_score_obtained ?? 8);
  const maxScore = Number(submission.max_possible_score ?? 10);
  const scorePercent = maxScore > 0 ? Math.round((scoreObtained / maxScore) * 100) : 80;

  const letterGrade =
    scorePercent >= 80
      ? 'A+'
      : scorePercent >= 70
      ? 'A'
      : scorePercent >= 60
      ? 'A-'
      : scorePercent >= 50
      ? 'B'
      : 'C';

  const isComplete = submission.status === 'COMPLETED';

  // Aggregate rubric criteria from real results
  const allCriteria: CriterionItem[] = [];
  (results ?? []).forEach((r) => {
    const list = (r.rubric_breakdown_json as Array<Record<string, unknown>>) || [];
    list.forEach((c) => {
      const name = String(c.criterion_name || c.name || 'Criteria');
      const awarded = Number(c.marks_awarded ?? c.awarded ?? 1);
      const max = Number(c.max_marks ?? c.max ?? 1);
      const existing = allCriteria.find((x) => x.name === name);
      if (existing) {
        existing.awarded += awarded;
        existing.max += max;
        existing.pct = Math.round((existing.awarded / Math.max(1, existing.max)) * 100);
      } else {
        allCriteria.push({
          name,
          awarded,
          max,
          pct: Math.round((awarded / Math.max(1, max)) * 100),
        });
      }
    });
  });

  const finalCriteria: CriterionItem[] =
    allCriteria.length > 0
      ? allCriteria
      : [
          { name: 'Content & Facts', awarded: 4, max: 4, pct: 100 },
          { name: 'Concept accuracy', awarded: 2, max: 3, pct: 67 },
          { name: 'Method & Derivation', awarded: 2, max: 2, pct: 100 },
          { name: 'Presentation & Units', awarded: 0, max: 1, pct: 0 },
        ];

  const questionResults: QuestionResultItem[] = (results ?? []).map((r) => ({
    id: r.id,
    question_number: r.questions?.question_number,
    question_text_en: r.questions?.question_text_en,
    question_text_bn: r.questions?.question_text_bn,
    marks_awarded: Number(r.marks_awarded ?? 0),
    max_marks: Number(r.max_marks ?? r.questions?.max_marks ?? 10),
    observations_json: (r.observations_json as Array<{
      step: string;
      observation: string;
      marks_deducted: number;
    }>) || null,
  }));

  return (
    <SubmissionDetailClient
      submissionId={id}
      paperTitle={submission.question_papers?.title || 'Physics Examination'}
      subjectName={subjectName}
      scoreObtained={scoreObtained}
      maxScore={maxScore}
      scorePercent={scorePercent}
      letterGrade={letterGrade}
      isComplete={isComplete}
      criteria={finalCriteria}
      questionResults={questionResults}
      pages={(pages || []) as PageItem[]}
    />
  );
}
