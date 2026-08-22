'use client';

import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface MistakeItem {
  type: string;
  type_bn?: string;
  subject: string;
  count: string;
  lostMarks: number;
  color: 'coral' | 'sun' | 'mint';
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

  return (
    <>
      <PageHeader
        title={t('mistakes.title')}
        description={t('mistakes.desc')}
      >
        <button type="button" className="primary-btn">
          {t('mistakes.download_report')} <ArrowUpRight size={15} />
        </button>
      </PageHeader>

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

        {dynamicMistakes.map((x, i) => {
          const typeLabel = language === 'bn' && x.type_bn ? x.type_bn : x.type;
          return (
            <article className="mistake-row" key={`${x.type}-${i}`}>
              <span className={`mistake-dot ${x.color}`} />
              <div>
                <b>{typeLabel}</b>
                <small>
                  {x.subject} · {x.count} · -{x.lostMarks} {language === 'bn' ? 'নম্বর' : 'marks'}
                </small>
              </div>
              <Link
                href="/dashboard/tutor"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <p>
                  {t('mistakes.practice_this')} <ChevronRight size={16} />
                </p>
              </Link>
            </article>
          );
        })}
      </div>
    </>
  );
}
