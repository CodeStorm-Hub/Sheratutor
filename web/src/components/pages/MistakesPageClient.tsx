'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { ArrowUpRight, ChevronRight, Download, Sparkles, Filter } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Tag } from '@/components/Tag';

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

export function MistakesPageClient({
  displayMarksRecoverable,
  topSubject,
  conceptualPercent,
  dynamicMistakes,
}: MistakesClientProps) {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const handleDownloadPdf = () => {
    window.print();
  };

  const categories = [
    { id: 'ALL', label_bn: 'সকল ভুল', label_en: 'All Mistakes' },
    { id: 'FORMULA_RECALL', label_bn: 'সূত্রের ভুল', label_en: 'Formula Errors' },
    { id: 'UNIT_CONVERSION', label_bn: 'এককের ভুল', label_en: 'Unit Errors' },
    { id: 'CALCULATION_ERROR', label_bn: 'গণনার ভুল', label_en: 'Math Slips' },
    { id: 'CONCEPTUAL_MISCONCEPTION', label_bn: 'ধারণাগত ভুল', label_en: 'Conceptual' },
  ];

  const filteredMistakes = dynamicMistakes.filter((m) => {
    if (selectedCategory === 'ALL') return true;
    return m.mistakeCategory === selectedCategory;
  });

  // Aggregate all unique tags from mistakes
  const allTags = Array.from(
    new Set(dynamicMistakes.flatMap((m) => m.tags || []))
  );

  return (
    <div className="print:max-w-full space-y-6">
      <div className="print:hidden">
        <PageHeader
          title={t('mistakes.title')}
          description={t('mistakes.desc')}
        >
          <div className="flex gap-2">
            <Link href="/dashboard/practice/generate" className="secondary-btn">
              <Sparkles size={15} className="mr-1.5" />
              {language === 'bn' ? 'কাস্টম প্র্যাকটিস ড্রিল' : 'Custom Practice Drill'}
            </Link>
            <button type="button" className="primary-btn" onClick={handleDownloadPdf}>
              <Download size={15} className="mr-2" /> {t('mistakes.download_report')}
            </button>
          </div>
        </PageHeader>
      </div>
      
      <div className="hidden print:block mb-8 pb-4 border-b">
        <h1 className="text-2xl font-bold">SheraTutor Mistake Analysis Report</h1>
        <p className="text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      <div className="mistakes">
        <div className="mistake-summary">
          <div>
            <span>{t('mistakes.marks_recoverable')}</span>
            <strong>+{displayMarksRecoverable}</strong>
            <p>
              {language === 'bn'
                ? `তোমার পরবর্তী ${topSubject} মূল্যায়নে`
                : `${t('mistakes.in_next_test')} (${topSubject})`}
            </p>
          </div>
          <div className="mistake-orbit">
            <b>{conceptualPercent}%</b>
            <small>{t('mistakes.conceptual')}</small>
          </div>
        </div>

        {/* Mistake Taxonomy Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 print:hidden">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-card text-muted-foreground hover:bg-muted border border-border'
              }`}
            >
              {language === 'bn' ? cat.label_bn : cat.label_en}
            </button>
          ))}
        </div>

        {allTags.length > 0 && (
          <div className="bg-card p-4 rounded-xl border border-border shadow-xs">
            <h3 className="text-sm font-semibold mb-3 text-foreground">Weakness Tags Aggregator</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <Tag key={tag} color="sun">#{tag}</Tag>
              ))}
            </div>
          </div>
        )}

        {filteredMistakes.length === 0 ? (
          <div className="text-center py-10 bg-card rounded-2xl border border-border">
            <p className="text-sm text-muted-foreground">
              {language === 'bn' ? 'এই ক্যাটাগরিতে কোনো ভুল চিহ্নিত হয়নি।' : 'No mistakes found in this category.'}
            </p>
          </div>
        ) : (
          filteredMistakes.map((x, i) => {
            const typeLabel = language === 'bn' && x.type_bn ? x.type_bn : x.type;
            return (
              <article className="mistake-row break-inside-avoid" key={`${x.type}-${i}`}>
                <span className={`mistake-dot ${x.color}`} />
                <div className="flex-1 min-w-0">
                  <b className="truncate">{typeLabel}</b>
                  <small className="block mt-1">
                    {x.subject} · {x.count} · -{x.lostMarks} {language === 'bn' ? 'নম্বর' : 'marks'}
                  </small>
                  {x.tags && x.tags.length > 0 && (
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {x.tags.map(t => (
                        <span key={t} className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded font-mono font-medium">
                          #{t.replace(/^#+/, '')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="print:hidden flex items-center gap-2">
                  <Link
                    href={`/dashboard/tutor`}
                    className="secondary-btn text-xs py-1.5 px-3"
                  >
                    <span>{language === 'bn' ? 'টিউটরে বোঝো' : 'Explain'}</span>
                  </Link>
                  <Link
                    href={`/dashboard/practice/generate`}
                    className="primary-btn text-xs py-1.5 px-3"
                  >
                    <span>{t('mistakes.practice_this')}</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
