'use client';

import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { ArrowUpRight, ChevronRight, Download } from 'lucide-react';
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

  const handleDownloadPdf = () => {
    window.print();
  };

  // Aggregate all unique tags from mistakes
  const allTags = Array.from(
    new Set(dynamicMistakes.flatMap((m) => m.tags || []))
  );

  return (
    <div className="print:max-w-full">
      <div className="print:hidden">
        <PageHeader
          title={t('mistakes.title')}
          description={t('mistakes.desc')}
        >
          <button type="button" className="primary-btn" onClick={handleDownloadPdf}>
            <Download size={15} className="mr-2" /> {t('mistakes.download_report')}
          </button>
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

        {allTags.length > 0 && (
          <div className="mb-6 bg-white p-4 rounded-xl border border-border shadow-sm">
            <h3 className="text-sm font-semibold mb-3 text-navy">Weakness Tags Aggregator</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <Tag key={tag} color="sun">#{tag}</Tag>
              ))}
            </div>
          </div>
        )}

        {dynamicMistakes.map((x, i) => {
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
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {x.tags.map(t => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">#{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="print:hidden">
                <Link
                  href="/dashboard/tutor"
                  style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}
                >
                  <p className="whitespace-nowrap flex items-center text-sm font-medium">
                    {t('mistakes.practice_this')} <ChevronRight size={16} />
                  </p>
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
