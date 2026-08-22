import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Tag } from '@/components/Tag';
import { PageHeader } from '@/components/PageHeader';
import { Check, ChevronRight, Maximize2, Upload } from 'lucide-react';
import { ExplainSimplyButton } from '@/components/explain-simply-button';

const defaultGradingSteps = [
  'Upload sheet',
  'Scan handwriting',
  'Analyze answers',
  'Apply board rubric',
  'Generate feedback',
];

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

  const { data: results } = await supabase
    .from('grading_results')
    .select('*, questions(id, question_number, question_text_bn, question_text_en, max_marks)')
    .eq('submission_id', id)
    .order('created_at');

  const { data: pages } = await supabase
    .from('submission_pages')
    .select('id, page_number, original_image_url, ocr_raw_text, transcription_confidence, student_flagged_mismatch')
    .eq('submission_id', id)
    .order('page_number');

  const subjectName =
    submission.question_papers?.subjects?.name_en || 'Physics';

  const scoreObtained = submission.total_score_obtained ?? 8;
  const maxScore = submission.max_possible_score ?? 10;
  const scorePercent = maxScore > 0 ? Math.round((Number(scoreObtained) / Number(maxScore)) * 100) : 80;

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
  const allCriteria: Array<{ name: string; awarded: number; max: number; pct: number }> = [];
  (results ?? []).forEach((r) => {
    const list = (r.rubric_breakdown_json as Array<Record<string, unknown>>) || [];
    list.forEach((c) => {
      const awarded = Number(c.awarded_marks || 0);
      const max = Number(c.max_step_marks || 1);
      allCriteria.push({
        name: String(c.step_name || 'Step evaluation'),
        awarded,
        max,
        pct: Math.min(100, Math.round((awarded / Math.max(1, max)) * 100)),
      });
    });
  });

  return (
    <>
      <PageHeader
        title="AI grading"
        description="Review your evaluated answer script and board-style step deductions."
      >
        <Link href="/dashboard/upload" className="primary-btn">
          <Upload size={16} /> Upload new sheet
        </Link>
      </PageHeader>

      <div className="grading-layout">
        {/* Left column: Steps */}
        <aside className="grading-steps">
          <Tag color="coral">CURRENT REVIEW</Tag>
          <h3>{subjectName} Model Test</h3>
          {defaultGradingSteps.map((s, i) => {
            const isDone = isComplete || i < 3;
            const isCurrent = !isComplete && i === 3;
            return (
              <div
                className={`grade-step ${
                  isDone ? 'done' : isCurrent ? 'current' : ''
                }`.trim()}
                key={s}
              >
                <span>{isDone ? <Check size={14} /> : i + 1}</span>
                <div>
                  <b>{s}</b>
                  <small>
                    {isDone ? 'Complete' : isCurrent ? 'In progress' : 'Waiting'}
                  </small>
                </div>
              </div>
            );
          })}
        </aside>

        {/* Center column: Paper view & answer script */}
        <section className="paper-view">
          <div className="viewer-tools">
            <span>
              <Maximize2 size={15} /> Page 1 of {pages?.length || 1}
            </span>
            <div>
              <button type="button">−</button>
              <b>100%</b>
              <button type="button">+</button>
            </div>
          </div>

          <div className="answer-sheet">
            <div className="paper-head">
              <b>HSC MODEL TEST EXAMINATION — 2026</b>
              <span>
                {subjectName} 1st Paper · Full marks: {maxScore}
              </span>
            </div>

            {pages && pages.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                {pages.map((p) => (
                  <div key={p.id} style={{ marginBottom: 15 }}>
                    <p style={{ fontWeight: 600, fontSize: 11, color: '#68708a' }}>
                      PAGE {p.page_number} TRANSCRIBED SCRIPT:
                    </p>
                    <div className="handwriting">
                      {p.ocr_raw_text ? (
                        p.ocr_raw_text
                          .split('\n')
                          .slice(0, 8)
                          .map((line: string, lIdx: number) => (
                            <React.Fragment key={lIdx}>
                              {line}
                              <br />
                            </React.Fragment>
                          ))
                      ) : (
                        <>
                          Given, mass m = 5 kg &nbsp; and &nbsp; velocity v = 10 ms⁻¹
                          <br />
                          <br />
                          We know, KE = ½mv²
                          <br />= ½ × 5 × (10)²
                          <br />= <mark>250 J</mark>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Questions & Feedback */}
            {(results ?? []).map((r, qIdx) => (
              <div key={r.id} style={{ marginTop: 15, position: 'relative' }}>
                <p>
                  <b>{qIdx + 1}. </b>
                  {r.questions?.question_text_bn ||
                    r.questions?.question_text_en ||
                    'Calculate the kinetic energy.'}
                </p>

                <div className="paper-mark good" style={{ position: 'static', display: 'inline-block', marginRight: 8, marginTop: 6 }}>
                  ✓ Score: {r.score_obtained}/{r.max_marks} marks awarded
                </div>

                {r.explanation_summary_bn && (
                  <p style={{ fontSize: 11, color: '#68708a', marginTop: 8, fontStyle: 'italic' }}>
                    Examiner note: {r.explanation_summary_bn}
                  </p>
                )}

                <div style={{ marginTop: 8 }}>
                  <ExplainSimplyButton
                    questionText={
                      r.questions?.question_text_bn ||
                      r.questions?.question_text_en ||
                      ''
                    }
                    stepName={`Question ${r.questions?.question_number || qIdx + 1}`}
                    observation={r.explanation_summary_bn || 'Step-by-step review'}
                    submissionId={id}
                    questionId={r.question_id}
                    rubricStepIndex={0}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right column: Examiner Result */}
        <aside className="result-panel">
          <Tag color="mint">EXAMINER RESULT</Tag>
          <div className="grade-score">
            <b>{scoreObtained}</b>
            <span>/{maxScore}</span>
            <strong>{letterGrade}</strong>
          </div>

          <div className="breakdown">
            <h4>Performance breakdown</h4>
            {(allCriteria.length > 0
              ? allCriteria.slice(0, 4)
              : [
                  { name: 'Content', awarded: 9, max: 10, pct: 90 },
                  { name: 'Concept accuracy', awarded: 8, max: 10, pct: 80 },
                  { name: 'Method', awarded: 7.5, max: 10, pct: 75 },
                  { name: 'Presentation', awarded: 9.2, max: 10, pct: 92 },
                ]
            ).map((c, i) => (
              <div key={i}>
                <span>{c.name}</span>
                <b>{c.pct}%</b>
                <i>
                  <em style={{ width: `${c.pct}%` }} />
                </i>
              </div>
            ))}
          </div>

          <div className="notes">
            <h4>Examiner notes</h4>
            <p className="positive">✓ Formula correctly applied</p>
            <p className="positive">✓ Strong presentation</p>
            <p className="negative">✕ Explain your final answer</p>
            <p className="negative">✕ Diagram label missing</p>
          </div>

          <Link
            href="/dashboard/tutor"
            className="dark-wide"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            Ask tutor about this test <ChevronRight size={16} />
          </Link>
        </aside>
      </div>
    </>
  );
}
