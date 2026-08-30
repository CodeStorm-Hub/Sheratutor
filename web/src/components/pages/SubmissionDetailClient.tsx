'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Tag } from '@/components/Tag';
import { PageHeader } from '@/components/PageHeader';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Sparkles,
  Upload,
  Printer,
  AlertTriangle,
} from 'lucide-react';
import { ExplainSimplyButton } from '@/components/explain-simply-button';
import { useLanguage } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

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
  mistake_category?: string | null;
  transcript_mismatch_detected?: boolean;
  transcript_mismatch_note?: string | null;
  observations_json?: Array<{ step: string; observation: string; marks_deducted: number }> | null;
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

const btnPrimary =
  'inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-cta px-4 py-2.5 text-xs font-semibold text-cta-foreground shadow-xs transition-colors hover:opacity-90';
const btnOutline =
  'inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-accent';
const cardClass = 'rounded-2xl border border-border bg-surface-1 p-5';

export function SubmissionDetailClient({
  submissionId,
  paperTitle,
  scoreObtained,
  maxScore,
  scorePercent,
  letterGrade,
  isComplete: initialIsComplete,
  criteria,
  questionResults,
  pages,
}: SubmissionDetailClientProps) {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(initialIsComplete);

  useEffect(() => {
    if (isComplete) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`submission-realtime-${submissionId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'exam_submissions', filter: `id=eq.${submissionId}` },
        (payload: { new?: { status?: string } }) => {
          if (payload.new && payload.new.status === 'COMPLETED') {
            setIsComplete(true);
            router.refresh();
          }
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [submissionId, isComplete, router]);

  const gradingSteps = [
    { en: 'Upload sheet', bn: 'খাতা আপলোড' },
    { en: 'Scan handwriting', bn: 'হস্তলিপি স্ক্যান' },
    { en: 'Analyze answers', bn: 'উত্তর বিশ্লেষণ' },
    { en: 'Apply board rubric', bn: 'বোর্ড রুব্রিক প্রয়োগ' },
    { en: 'Generate feedback', bn: 'ফিডব্যাক প্রস্তুত' },
  ];

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

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
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={handlePrint} className={btnOutline}>
            <Printer size={15} /> {language === 'bn' ? 'প্রিন্ট / PDF' : 'Print / PDF'}
          </button>
          <Link href="/dashboard/upload" className={btnPrimary}>
            <Upload size={15} /> {language === 'bn' ? 'আরেকটি খাতা আপলোড' : 'Upload another sheet'}
          </Link>
        </div>
      </PageHeader>

      {/* Grading progress */}
      <section className="flex flex-wrap gap-x-6 gap-y-3 rounded-2xl border border-border bg-surface-1 p-5">
        {gradingSteps.map((step, i) => {
          const isDone = isComplete || i < 4;
          return (
            <div key={step.en} className="flex items-center gap-2">
              <span
                className={cn(
                  'grid size-6 flex-none place-items-center rounded-full text-[11px] font-bold',
                  isDone ? 'bg-accent2 text-white' : 'bg-surface-2 text-muted-foreground',
                )}
              >
                {isDone ? <Check size={13} /> : i + 1}
              </span>
              <span className={cn('text-xs', isDone ? 'font-medium text-foreground' : 'text-muted-foreground')}>
                {language === 'bn' ? step.bn : step.en}
              </span>
            </div>
          );
        })}
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className={cardClass}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <Tag color="mint">{t('grading.examiner_result')}</Tag>
              <h2 className="mt-3 font-mono text-4xl font-bold">
                {scoreObtained}
                <small className="text-lg text-muted-foreground">/{maxScore}</small>
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {language === 'bn'
                  ? `বোর্ড মানদণ্ডে অর্জিত গ্রেড: ${letterGrade} (${scorePercent}%)`
                  : `Achieved Grade ${letterGrade} (${scorePercent}%) against standard NCTB rubric.`}
              </p>
            </div>
            <div className="grid size-16 flex-none place-items-center rounded-xl border-2 border-mark text-center">
              <b className="font-heading text-xl leading-none text-mark">{letterGrade}</b>
              <small className="text-[9px] text-muted-foreground">
                {language === 'bn' ? 'বোর্ড মান' : 'Board Grade'}
              </small>
            </div>
          </div>

          <hr className="my-5 border-border" />

          <h3 className="text-sm font-semibold">{t('grading.performance_breakdown')}</h3>
          <div className="mt-3 space-y-3">
            {criteria.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{c.name}</span>
                  <b className="font-mono">
                    {c.awarded}/{c.max}
                  </b>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded bg-surface-2">
                  <span className="block h-full rounded bg-accent2" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <Link href="/dashboard/tutor" className={cn(btnPrimary, 'mt-6 w-full justify-center')}>
            <Sparkles size={15} /> {language === 'bn' ? 'টিউটরের সাথে রিভিশন করুন' : 'Review with AI Tutor'}
          </Link>
        </section>

        <aside className={cn(cardClass, 'flex flex-col')}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">
              {language === 'bn' ? 'আসল উত্তরপত্র' : 'Transcribed Script'}
            </h3>
            <button type="button" aria-label="Expand image view" className="text-muted-foreground hover:text-foreground">
              <Maximize2 size={16} />
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-between">
            {pages && pages.length > 0 ? (
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pages[currentPageIndex].original_image_url}
                  alt={`Original script page ${currentPageIndex + 1}`}
                  className="h-auto w-full rounded-lg border border-border"
                />
                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    disabled={currentPageIndex === 0}
                    onClick={() => setCurrentPageIndex((p) => p - 1)}
                    aria-label={language === 'bn' ? 'পূর্ববর্তী পৃষ্ঠা' : 'Previous page'}
                    className="rounded-lg bg-muted p-2 transition-colors hover:bg-accent disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm font-medium">
                    Page {currentPageIndex + 1} of {pages.length}
                  </span>
                  <button
                    type="button"
                    disabled={currentPageIndex === pages.length - 1}
                    onClick={() => setCurrentPageIndex((p) => p + 1)}
                    aria-label={language === 'bn' ? 'পরবর্তী পৃষ্ঠা' : 'Next page'}
                    className="rounded-lg bg-muted p-2 transition-colors hover:bg-accent disabled:opacity-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 rounded-xl border border-border bg-surface-2 p-5">
                <div className="h-2 rounded bg-border" style={{ width: '60%' }} />
                <div className="h-2 rounded bg-border" style={{ width: '90%' }} />
                <div className="h-2 rounded bg-border" style={{ width: '75%' }} />
                <div className="rounded-md border-l-2 border-accent2 bg-green-soft px-2 py-1 text-xs text-green">
                  ✓ Correct approach
                </div>
                <div className="h-2 rounded bg-border" style={{ width: '70%' }} />
                <div className="rounded-md border-l-2 border-mark bg-red-soft px-2 py-1 text-xs text-mark">
                  ✗ -1 Missing final unit
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {questionResults && questionResults.length > 0 && (
        <section className="mt-8">
          <div className="pb-4">
            <h2 className="font-heading text-xl leading-tight font-bold">
              {language === 'bn' ? 'প্রশ্নভিত্তিক মূল্যায়নের ধাপ' : 'Question Step-by-Step Breakdown'}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {language === 'bn'
                ? 'প্রতিটি প্রশ্নের প্রাপ্ত নম্বর ও চিহ্নিত ভুলসমূহ।'
                : 'Mark deductions and suggestions per question.'}
            </p>
          </div>

          <div className="flex flex-col gap-3.5">
            {questionResults.map((q, qIndex) => {
              const qText =
                language === 'bn'
                  ? q.question_text_bn || q.question_text_en || `প্রশ্ন ${q.question_number || qIndex + 1}`
                  : q.question_text_en || q.question_text_bn || `Question ${q.question_number || qIndex + 1}`;
              const firstObs = q.observations_json?.[0];

              return (
                <div key={q.id} className="rounded-2xl border border-border bg-card px-5 py-5">
                  <div className="mb-2.5 flex flex-wrap items-center justify-between gap-3">
                    <b className="min-w-0 flex-1 text-[15px] text-foreground">
                      {language === 'bn'
                        ? `প্রশ্ন ${q.question_number || qIndex + 1}: `
                        : `Question ${q.question_number || qIndex + 1}: `}
                      {qText}
                    </b>
                    <div className="flex flex-wrap items-center gap-2.5">
                      {q.mistake_category && q.mistake_category !== 'NONE' && (
                        <Tag color="sun">
                          {q.mistake_category === 'FORMULA_RECALL' && (language === 'bn' ? 'সূত্রের ভুল' : 'Formula Error')}
                          {q.mistake_category === 'UNIT_CONVERSION' && (language === 'bn' ? 'এককের ভুল' : 'Unit Error')}
                          {q.mistake_category === 'CALCULATION_ERROR' && (language === 'bn' ? 'গণনার ভুল' : 'Math Slip')}
                          {q.mistake_category === 'CONCEPTUAL_MISCONCEPTION' && (language === 'bn' ? 'ধারণাগত ভুল' : 'Concept')}
                        </Tag>
                      )}
                      <Tag color={q.marks_awarded >= q.max_marks ? 'mint' : 'coral'}>
                        {q.marks_awarded}/{q.max_marks} {language === 'bn' ? 'মার্কস' : 'Marks'}
                      </Tag>
                      <ExplainSimplyButton
                        questionText={qText}
                        stepName={firstObs?.step || 'Step evaluation'}
                        observation={firstObs?.observation || 'Evaluation note'}
                        submissionId={submissionId}
                        questionId={q.id}
                        rubricStepIndex={0}
                      />
                    </div>
                  </div>

                  {q.transcript_mismatch_detected && (
                    <div className="mb-2.5 flex items-center gap-2 rounded-lg border border-warning/45 bg-warning/10 px-3 py-2 text-xs text-warning">
                      <AlertTriangle size={14} />
                      <span>
                        {q.transcript_mismatch_note ||
                          (language === 'bn'
                            ? 'হাতে লেখা উত্তর ও ট্রান্সক্রিপশনের মধ্যে অমিল শনাক্ত হয়েছে।'
                            : 'Handwriting vs OCR mismatch detected.')}
                      </span>
                    </div>
                  )}

                  {q.observations_json && q.observations_json.length > 0 ? (
                    <div className="mt-3 flex flex-col gap-2">
                      {q.observations_json.map((obs, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 rounded-lg bg-muted px-3.5 py-2.5 text-[13px] text-muted-foreground"
                        >
                          <span className={cn('font-bold', obs.marks_deducted > 0 ? 'text-mark' : 'text-accent2')}>
                            {obs.marks_deducted > 0 ? `-${obs.marks_deducted}` : '✓'}
                          </span>
                          <div>
                            <b className="block text-foreground">{obs.step}</b>
                            <p className="text-muted-foreground">{obs.observation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-dashed border-border bg-muted/20 p-3.5 text-xs text-muted-foreground">
                      <span>
                        {language === 'bn'
                          ? 'এই প্রশ্নের প্রতিটি ধাপের বিস্তারিত AI মূল্যায়ন প্রক্রিয়াধীন রয়েছে বা কোনো নম্বর কর্তন চিহ্নিত হয়নি।'
                          : 'Detailed step-by-step rubric evaluation is processing or no deductions were recorded.'}
                      </span>
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
