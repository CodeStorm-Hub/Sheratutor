'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { ChevronRight, Download, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Tag } from '@/components/Tag';
import { cn } from '@/lib/utils';

export interface MistakeItem {
  type: string;
  type_bn?: string;
  subject: string;
  count: string;
  lostMarks: number;
  color: 'coral' | 'sun' | 'mint';
  tags?: string[];
  mistakeCategory?: string;
}

interface MistakesClientProps {
  displayMarksRecoverable: number;
  topSubject: string;
  conceptualPercent: number;
  dynamicMistakes: MistakeItem[];
}

const btnPrimary =
  'inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-cta px-4 py-2.5 text-xs font-semibold text-cta-foreground shadow-xs transition-colors hover:opacity-90';
const btnOutline =
  'inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-accent';
const dotColor: Record<MistakeItem['color'], string> = {
  coral: 'bg-cta',
  sun: 'bg-warning',
  mint: 'bg-accent2',
};

export function MistakesPageClient({
  displayMarksRecoverable,
  topSubject,
  conceptualPercent,
  dynamicMistakes,
}: MistakesClientProps) {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const handleDownloadPdf = () => window.print();

  const categories = [
    { id: 'ALL', label_bn: 'সকল ভুল', label_en: 'All Mistakes' },
    { id: 'FORMULA_RECALL', label_bn: 'সূত্রের ভুল', label_en: 'Formula Errors' },
    { id: 'UNIT_CONVERSION', label_bn: 'এককের ভুল', label_en: 'Unit Errors' },
    { id: 'CALCULATION_ERROR', label_bn: 'গণনার ভুল', label_en: 'Math Slips' },
    { id: 'CONCEPTUAL_MISCONCEPTION', label_bn: 'ধারণাগত ভুল', label_en: 'Conceptual' },
  ];

  const filteredMistakes = dynamicMistakes.filter((m) =>
    selectedCategory === 'ALL' ? true : m.mistakeCategory === selectedCategory,
  );

  const allTags = Array.from(new Set(dynamicMistakes.flatMap((m) => m.tags || [])));

  return (
    <div className="mx-auto max-w-[800px] space-y-4 print:max-w-full">
      <div className="print:hidden">
        <PageHeader title={t('mistakes.title')} description={t('mistakes.desc')}>
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard/practice/generate" className={btnOutline}>
              <Sparkles size={15} />
              {language === 'bn' ? 'কাস্টম প্র্যাকটিস ড্রিল' : 'Custom Practice Drill'}
            </Link>
            <button type="button" className={btnPrimary} onClick={handleDownloadPdf}>
              <Download size={15} /> {t('mistakes.download_report')}
            </button>
          </div>
        </PageHeader>
      </div>

      <div className="mb-8 hidden border-b pb-4 print:block">
        <h1 className="text-2xl font-bold">SheraTutor Mistake Analysis Report</h1>
        <p className="text-muted-foreground">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      <div className="flex flex-col gap-5 rounded-2xl bg-foreground px-7 py-6 text-cta-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="font-mono text-3xs tracking-wide text-cta-foreground/70 uppercase">
            {t('mistakes.marks_recoverable')}
          </span>
          <strong className="my-1.5 block font-mono text-4xl font-bold">+{displayMarksRecoverable}</strong>
          <p className="text-xs text-cta-foreground/70">
            {language === 'bn'
              ? `তোমার পরবর্তী ${topSubject} মূল্যায়নে`
              : `${t('mistakes.in_next_test')} (${topSubject})`}
          </p>
        </div>
        <div
          className="grid size-[92px] flex-none place-content-center rounded-full border-[7px] border-cta text-center"
          style={{ borderLeftColor: 'var(--heading)' }}
        >
          <b className="font-mono text-base">{conceptualPercent}%</b>
          <small className="text-xs text-cta-foreground/70">{t('mistakes.conceptual')}</small>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 print:hidden">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              'shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
              selectedCategory === cat.id
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'border border-border bg-card text-muted-foreground hover:bg-muted',
            )}
          >
            {language === 'bn' ? cat.label_bn : cat.label_en}
          </button>
        ))}
      </div>

      {allTags.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <h3 className="mb-3 text-sm font-semibold">Weakness Tags Aggregator</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Tag key={tag} color="sun">#{tag}</Tag>
            ))}
          </div>
        </div>
      )}

      {filteredMistakes.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card py-10 text-center">
          <p className="text-sm text-muted-foreground">
            {language === 'bn' ? 'এই ক্যাটাগরিতে কোনো ভুল চিহ্নিত হয়নি।' : 'No mistakes found in this category.'}
          </p>
        </div>
      ) : (
        filteredMistakes.map((x, i) => {
          const typeLabel = language === 'bn' && x.type_bn ? x.type_bn : x.type;
          return (
            <article
              key={`${x.type}-${i}`}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-4 break-inside-avoid"
            >
              <span className={cn('size-3 flex-none rounded', dotColor[x.color])} />
              <div className="min-w-0 flex-1">
                <b className="block truncate text-xs">{typeLabel}</b>
                <small className="mt-0.5 block text-xs text-muted-foreground">
                  {x.subject} · {x.count} · -{x.lostMarks} {language === 'bn' ? 'নম্বর' : 'marks'}
                </small>
                {x.tags && x.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {x.tags.map((tg) => (
                      <span
                        key={tg}
                        className="rounded bg-muted px-2 py-0.5 font-mono text-xs font-medium text-muted-foreground"
                      >
                        #{tg.replace(/^#+/, '')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 print:hidden">
                <Link href="/dashboard/tutor" className={cn(btnOutline, 'px-3 py-1.5')}>
                  <span>{language === 'bn' ? 'টিউটরে বোঝো' : 'Explain'}</span>
                </Link>
                <Link href="/dashboard/practice/generate" className={cn(btnPrimary, 'px-3 py-1.5')}>
                  <span>{t('mistakes.practice_this')}</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </article>
          );
        })
      )}
    </div>
  );
}
