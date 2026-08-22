'use client';

import React from 'react';
import Link from 'next/link';
import { Tag } from '@/components/Tag';
import { PageHeader } from '@/components/PageHeader';
import { Check, ChevronRight, Maximize2, Sparkles, Upload } from 'lucide-react';
import { ExplainSimplyButton } from '@/components/explain-simply-button';
import { useLanguage } from '@/context/LanguageContext';

export interface CriterionItem {
  name: string;
  name_bn?: string;
  awarded: number;
  max: number;
  pct: number;
}

export interface QuestionResultItem {
  id: string;
  question_number?: number;
  question_text_en?: string | null;
  question_text_bn?: string | null;
  marks_awarded: number;
  max_marks: number;
  observations_json?: Array<{
    step: string;
    observation: string;
    marks_deducted: number;
  }> | null;
}

export interface PageItem {
  id: string;
  page_number: number;
  original_image_url: string;
}

interface SubmissionDetailClientProps {
  submissionId: string;
  paperTitle: string;
  subjectName: string;
  scoreObtained: number;
  maxScore: number;
  scorePercent: number;
  letterGrade: string;
  isComplete: boolean;
  criteria: CriterionItem[];
  questionResults: QuestionResultItem[];
  pages: PageItem[];
}

export function SubmissionDetailClient({
  submissionId,
  paperTitle,
  scoreObtained,
  maxScore,
  scorePercent,
  letterGrade,
  isComplete,
  criteria,
  questionResults,
  pages,
}: SubmissionDetailClientProps) {
  const { language, t } = useLanguage();

  const gradingSteps = [
    { en: 'Upload sheet', bn: 'খাতা আপলোড' },
    { en: 'Scan handwriting', bn: 'হস্তলিপি স্ক্যান' },
    { en: 'Analyze answers', bn: 'উত্তর বিশ্লেষণ' },
    { en: 'Apply board rubric', bn: 'বোর্ড রুব্রিক প্রয়োগ' },
    { en: 'Generate feedback', bn: 'ফিডব্যাক প্রস্তুত' },
  ];

  return (
    <>
      <PageHeader
        title={language === 'bn' ? 'মূল্যায়ন ও ফলাফল' : 'Evaluation & Feedback'}
        description={
          language === 'bn'
            ? `${paperTitle} — তোমার উত্তরপত্রের প্রতিটি ধাপের বিস্তারিত বিশ্লেষণ।`
            : `${paperTitle} — Step-by-step breakdown of your written answers.`
        }
      >
        <Link href="/dashboard/upload" className="primary-btn">
          <Upload size={15} /> {language === 'bn' ? 'আরেকটি খাতা আপলোড' : 'Upload another sheet'}
        </Link>
      </PageHeader>

      {/* 5-Step Evaluation Progression */}
      <section className="grading-steps">
        {gradingSteps.map((step, i) => {
          const isDone = isComplete || i < 4;
          return (
            <div
              key={step.en}
              className={`step-item ${isDone ? 'done' : ''}`}
            >
              <div className="step-circle">
                {isDone ? <Check size={14} /> : i + 1}
              </div>
              <span>{language === 'bn' ? step.bn : step.en}</span>
            </div>
          );
        })}
      </section>

      <div className="eval-grid">
        {/* Main Scorecard & Breakdown */}
        <section className="eval-card">
          <div className="eval-score-hero">
            <div>
              <Tag color="mint">{t('grading.examiner_result')}</Tag>
              <h2>
                {scoreObtained}
                <small>/{maxScore}</small>
              </h2>
              <p>
                {language === 'bn'
                  ? `বোর্ড মানদণ্ডে অর্জিত গ্রেড: ${letterGrade} (${scorePercent}%)`
                  : `Achieved Grade ${letterGrade} (${scorePercent}%) against standard NCTB rubric.`}
              </p>
            </div>
            <div className="grade-stamp">
              <b>{letterGrade}</b>
              <small>{language === 'bn' ? 'বোর্ড মান' : 'Board Grade'}</small>
            </div>
          </div>

          <hr />

          <div className="rubric-breakdown">
            <h3>{t('grading.performance_breakdown')}</h3>
            <div className="rubric-bars">
              {criteria.map((c) => (
                <div className="rubric-bar-item" key={c.name}>
                  <div>
                    <span>{c.name}</span>
                    <b>
                      {c.awarded}/{c.max}
                    </b>
                  </div>
                  <div className="bar-track">
                    <span style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <Link
              href="/dashboard/tutor"
              className="primary-btn"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Sparkles size={15} /> {language === 'bn' ? 'টিউটরের সাথে রিভিশন করুন' : 'Review with AI Tutor'}
            </Link>
          </div>
        </section>

        {/* Photographed Script Preview */}
        <aside className="script-preview-card">
          <div className="script-header">
            <h3>{language === 'bn' ? 'আসল উত্তরপত্র' : 'Transcribed Script'}</h3>
            <button type="button" aria-label="Expand image view">
              <Maximize2 size={16} />
            </button>
          </div>

          <div className="script-viewport">
            {pages?.[0]?.original_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={pages[0].original_image_url}
                alt="Original script page"
                style={{ width: '100%', height: 'auto', borderRadius: 8 }}
              />
            ) : (
              <div className="mock-sheet">
                <div className="sheet-line" style={{ width: '60%' }} />
                <div className="sheet-line" style={{ width: '90%' }} />
                <div className="sheet-line" style={{ width: '75%' }} />
                <div className="sheet-line" style={{ width: '85%' }} />
                <div className="sheet-annotation">
                  <span>✓ {language === 'bn' ? 'সঠিক পদ্ধতি' : 'Correct approach'}</span>
                </div>
                <div className="sheet-line" style={{ width: '70%' }} />
                <div className="sheet-line" style={{ width: '95%' }} />
                <div className="sheet-annotation error">
                  <span>✗ {language === 'bn' ? '-১ সমতাকরণে ভুল' : '-1 Missing final unit'}</span>
                </div>
              </div>
            )}
          </div>

          <div className="script-footer">
            <small>
              {language === 'bn'
                ? 'পৃষ্ঠা ১ — AI দৃষ্টির মাধ্যমে স্ক্যানকৃত'
                : 'Page 1 — Scanned via Vision AI'}
            </small>
            <Link href="/dashboard/tutor" className="tutor-cta">
              {language === 'bn' ? 'টিউটরের সাথে রিভিশন' : 'Review with Tutor'} <ChevronRight size={14} />
            </Link>
          </div>
        </aside>
      </div>

      {/* Detailed Question Step-by-Step Breakdown */}
      {questionResults && questionResults.length > 0 && (
        <section style={{ marginTop: 32 }}>
          <div className="section-heading" style={{ padding: '0 0 16px 0' }}>
            <div>
              <h2>{language === 'bn' ? 'প্রশ্নভিত্তিক মূল্যায়নের ধাপ' : 'Question Step-by-Step Breakdown'}</h2>
              <p>{language === 'bn' ? 'প্রতিটি প্রশ্নের প্রাপ্ত নম্বর ও চিহ্নিত ভুলসমূহ।' : 'Mark deductions and suggestions per question.'}</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {questionResults.map((q, qIndex) => {
              const qText =
                language === 'bn'
                  ? q.question_text_bn || q.question_text_en || `প্রশ্ন ${q.question_number || qIndex + 1}`
                  : q.question_text_en || q.question_text_bn || `Question ${q.question_number || qIndex + 1}`;

              const firstObs = q.observations_json?.[0];

              return (
                <div
                  key={q.id}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 14,
                    background: '#fff',
                    padding: '20px 22px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                      gap: 12,
                    }}
                  >
                    <b style={{ fontSize: 15, color: 'var(--navy)', flex: 1 }}>
                      {language === 'bn' ? `প্রশ্ন ${q.question_number || qIndex + 1}: ` : `Question ${q.question_number || qIndex + 1}: `}
                      {qText}
                    </b>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Tag color={q.marks_awarded >= q.max_marks ? 'mint' : 'coral'}>
                        {q.marks_awarded}/{q.max_marks} {language === 'bn' ? 'মার্কস' : 'Marks'}
                      </Tag>
                      <ExplainSimplyButton
                        questionText={qText}
                        stepName={firstObs?.step || (language === 'bn' ? 'ধাপ বিশ্লেষণ' : 'Step evaluation')}
                        observation={firstObs?.observation || (language === 'bn' ? 'বোর্ড রুব্রিক অনুযায়ী পর্যবেক্ষণ' : 'Evaluation note')}
                        submissionId={submissionId}
                        questionId={q.id}
                        rubricStepIndex={0}
                      />
                    </div>
                  </div>

                  {q.observations_json && q.observations_json.length > 0 && (
                    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {q.observations_json.map((obs, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 10,
                            fontSize: 13,
                            color: 'var(--muted)',
                            background: '#f8f9fc',
                            padding: '10px 14px',
                            borderRadius: 8,
                          }}
                        >
                          <span style={{ color: obs.marks_deducted > 0 ? 'var(--coral)' : 'var(--mint)', fontWeight: 700 }}>
                            {obs.marks_deducted > 0 ? `-${obs.marks_deducted}` : '✓'}
                          </span>
                          <div>
                            <b style={{ color: 'var(--navy)', display: 'block' }}>{obs.step}</b>
                            <p style={{ margin: 0 }}>{obs.observation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
