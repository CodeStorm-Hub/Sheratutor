'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Tag } from '@/components/Tag';
import { PageHeader } from '@/components/PageHeader';
import { Check, ChevronRight, ChevronLeft, Maximize2, Sparkles, Upload, Printer, AlertTriangle } from 'lucide-react';
import { ExplainSimplyButton } from '@/components/explain-simply-button';
import { useLanguage } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

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
  subjectName,
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
  const [isZoomed, setIsZoomed] = useState(false);

  // Supabase Realtime channel subscription for zero-latency status transitions
  useEffect(() => {
    if (isComplete) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`submission-realtime-${submissionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'exam_submissions',
          filter: `id=eq.${submissionId}`,
        },
        (payload: any) => {
          if (payload.new && payload.new.status === 'COMPLETED') {
            setIsComplete(true);
            router.refresh();
          }
        }
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
    if (typeof window !== 'undefined') {
      window.print();
    }
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
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" onClick={handlePrint} className="secondary-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Printer size={15} /> {language === 'bn' ? 'প্রিন্ট / PDF' : 'Print / PDF'}
          </button>
          <Link href="/dashboard/upload" className="primary-btn">
            <Upload size={15} /> {language === 'bn' ? 'আরেকটি খাতা আপলোড' : 'Upload another sheet'}
          </Link>
        </div>
      </PageHeader>

      <section className="grading-steps">
        {gradingSteps.map((step, i) => {
          const isDone = isComplete || i < 4;
          return (
            <div key={step.en} className={`step-item ${isDone ? 'done' : ''}`}>
              <div className="step-circle">{isDone ? <Check size={14} /> : i + 1}</div>
              <span>{language === 'bn' ? step.bn : step.en}</span>
            </div>
          );
        })}
      </section>

      <div className="eval-grid">
        <section className="eval-card">
          <div className="eval-score-hero">
            <div>
              <Tag color="mint">{t('grading.examiner_result')}</Tag>
              <h2>{scoreObtained}<small>/{maxScore}</small></h2>
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
                    <b>{c.awarded}/{c.max}</b>
                  </div>
                  <div className="bar-track"><span style={{ width: `${c.pct}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            <Link href="/dashboard/tutor" className="primary-btn" style={{ width: '100%', justifyContent: 'center' }}>
              <Sparkles size={15} /> {language === 'bn' ? 'টিউটরের সাথে রিভিশন করুন' : 'Review with AI Tutor'}
            </Link>
          </div>
        </section>

        <aside className="script-preview-card flex flex-col h-full">
          <div className="script-header">
            <h3>{language === 'bn' ? 'আসল উত্তরপত্র' : 'Transcribed Script'}</h3>
            <button type="button" aria-label="Expand image view"><Maximize2 size={16} /></button>
          </div>
          
          <div className="script-viewport flex-1 flex flex-col justify-between">
            {pages && pages.length > 0 ? (
              <div className="relative">
                <img
                  src={pages[currentPageIndex].original_image_url}
                  alt={`Original script page ${currentPageIndex + 1}`}
                  className="w-full h-auto rounded-lg"
                />
                <div className="flex justify-between mt-4">
                  <button 
                    type="button"
                    disabled={currentPageIndex === 0} 
                    onClick={() => setCurrentPageIndex(p => p - 1)}
                    aria-label={language === 'bn' ? 'পূর্ববর্তী পৃষ্ঠা' : 'Previous page'}
                    className="p-2 rounded bg-muted hover:bg-muted/80 disabled:opacity-50 transition-colors"
                  ><ChevronLeft size={16} /></button>
                  <span className="text-sm font-medium pt-2">Page {currentPageIndex + 1} of {pages.length}</span>
                  <button 
                    type="button"
                    disabled={currentPageIndex === pages.length - 1} 
                    onClick={() => setCurrentPageIndex(p => p + 1)}
                    aria-label={language === 'bn' ? 'পরবর্তী পৃষ্ঠা' : 'Next page'}
                    className="p-2 rounded bg-muted hover:bg-muted/80 disabled:opacity-50 transition-colors"
                  ><ChevronRight size={16} /></button>
                </div>
              </div>
            ) : (
              <div className="mock-sheet">
                <div className="sheet-line" style={{ width: '60%' }} />
                <div className="sheet-line" style={{ width: '90%' }} />
                <div className="sheet-line" style={{ width: '75%' }} />
                <div className="sheet-annotation"><span>✓ Correct approach</span></div>
                <div className="sheet-line" style={{ width: '70%' }} />
                <div className="sheet-annotation error"><span>✗ -1 Missing final unit</span></div>
              </div>
            )}
          </div>
        </aside>
      </div>

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
              const qText = language === 'bn'
                  ? q.question_text_bn || q.question_text_en || `প্রশ্ন ${q.question_number || qIndex + 1}`
                  : q.question_text_en || q.question_text_bn || `Question ${q.question_number || qIndex + 1}`;
              const firstObs = q.observations_json?.[0];

              return (
                <div key={q.id} style={{ border: '1px solid var(--border)', borderRadius: 14, background: 'var(--card)', padding: '20px 22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, gap: 12 }}>
                    <b style={{ fontSize: 15, color: 'var(--foreground)', flex: 1 }}>
                      {language === 'bn' ? `প্রশ্ন ${q.question_number || qIndex + 1}: ` : `Question ${q.question_number || qIndex + 1}: `}
                      {qText}
                    </b>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
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
                    <div style={{ background: 'var(--color-ochre-soft, #fbf3dc)', border: '1px solid var(--color-ochre, #b97f08)', padding: '8px 12px', borderRadius: 8, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--color-ochre, #b97f08)' }}>
                      <AlertTriangle size={14} />
                      <span>{q.transcript_mismatch_note || (language === 'bn' ? 'হাতে লেখা উত্তর ও ট্রান্সক্রিপশনের মধ্যে অমিল শনাক্ত হয়েছে।' : 'Handwriting vs OCR mismatch detected.')}</span>
                    </div>
                  )}
                  {q.observations_json && q.observations_json.length > 0 ? (
                    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {q.observations_json.map((obs, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--muted-foreground)', background: 'var(--muted)', padding: '10px 14px', borderRadius: 8 }}>
                          <span style={{ color: obs.marks_deducted > 0 ? 'var(--coral)' : 'var(--mint)', fontWeight: 700 }}>
                            {obs.marks_deducted > 0 ? `-${obs.marks_deducted}` : '✓'}
                          </span>
                          <div>
                            <b style={{ color: 'var(--foreground)', display: 'block' }}>{obs.step}</b>
                            <p style={{ margin: 0, color: 'var(--muted-foreground)' }}>{obs.observation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3 p-3.5 rounded-xl border border-dashed border-border bg-muted/20 flex items-center justify-between gap-3 text-xs text-muted-foreground">
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
