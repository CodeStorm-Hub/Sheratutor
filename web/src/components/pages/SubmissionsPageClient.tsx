'use client';

import React from 'react';
import Link from 'next/link';
import { Tag } from '@/components/Tag';
import { PageHeader } from '@/components/PageHeader';
import { BarChart } from '@/components/BarChart';
import { ChevronRight, Upload } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface SubmissionItem {
  id: string;
  status: string;
  total_score_obtained: number | null;
  max_possible_score: number | null;
  submitted_at: string;
  question_papers?: {
    title: string;
    total_marks: number;
    subjects?: { name_en: string } | null;
  } | null;
}

interface SubmissionsClientProps {
  submissions: SubmissionItem[];
  latestTitle: string;
  latestScore: number;
  latestMax: number;
  latestId?: string;
}

const cardClass = 'rounded-2xl border border-border bg-surface-1 p-5';

export function SubmissionsPageClient({
  submissions,
  latestTitle,
  latestScore,
  latestMax,
  latestId,
}: SubmissionsClientProps) {
  const { language, t } = useLanguage();

  const mockSubjects = [
    { subject: language === 'bn' ? 'পদার্থবিজ্ঞান' : 'Physics', value: 84 },
    { subject: language === 'bn' ? 'উচ্চতর গণিত' : 'Higher Math', value: 78 },
    { subject: language === 'bn' ? 'রসায়ন' : 'Chemistry', value: 71 },
    { subject: language === 'bn' ? 'ইংরেজি' : 'English', value: 92 },
  ];

  return (
    <>
      <PageHeader
        title={t('nav.results')}
        description={
          language === 'bn'
            ? 'তোমার প্রতিটি অনুশীলনের বিস্তারিত মূল্যায়ন ও ফলাফল।'
            : 'Every practice session, made visible.'
        }
      >
        <Link
          href="/dashboard/upload"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-cta px-4 py-2.5 text-xs font-semibold text-cta-foreground shadow-xs transition-colors hover:opacity-90"
        >
          <Upload size={15} /> {language === 'bn' ? 'নতুন খাতা জমা দিন' : 'Upload answer sheet'}
        </Link>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.2fr_0.9fr]">
        <article className="flex flex-col justify-between rounded-2xl border border-border bg-surface-2 p-5">
          <div>
            <Tag color="mint">{language === 'bn' ? 'সর্বশেষ মূল্যায়ন' : 'LATEST ASSESSMENT'}</Tag>
            <h2 className="mt-4 font-heading text-xl font-bold">{latestTitle}</h2>
            <div className="mt-3 mb-1 font-mono text-[42px] leading-none font-bold tracking-[-0.06em]">
              {latestScore}
              <span className="text-sm tracking-normal text-muted-foreground">/{latestMax}</span>
            </div>
            <p className="mb-3.5 text-xs text-green">
              {language === 'bn' ? 'পূর্ববর্তী মূল্যায়নের চেয়ে +৯ নম্বর বৃদ্ধি' : '+9 marks from your previous assessment'}
            </p>
          </div>
          <Link
            href={latestId ? `/dashboard/submissions/${latestId}` : '/dashboard/upload'}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-cta px-4 py-2.5 text-xs font-semibold text-cta-foreground transition-colors hover:opacity-90"
          >
            {latestId
              ? language === 'bn'
                ? 'সম্পূর্ণ ফলাফল দেখুন'
                : 'See full result'
              : language === 'bn'
                ? 'উত্তরপত্র জমা দিন'
                : 'Submit a paper'}
            <ChevronRight size={15} />
          </Link>
        </article>

        <article className={cardClass}>
          <h3 className="mb-3 font-heading text-[17px] font-bold">
            {language === 'bn' ? 'স্কোর ইতিহাস' : 'Score history'}
          </h3>
          <BarChart />
        </article>

        <article className={cardClass}>
          <h3 className="mb-3 font-heading text-[17px] font-bold">
            {language === 'bn' ? 'বিষয়ভিত্তিক অগ্রগতি' : 'Subject performance'}
          </h3>
          {mockSubjects.map((x) => (
            <div
              key={x.subject}
              className="my-4 grid grid-cols-[80px_1fr_36px] items-center gap-2 text-xs text-muted-foreground"
            >
              <span>{x.subject}</span>
              <span className="h-1 overflow-hidden rounded bg-surface-2">
                <span className="block h-full rounded bg-accent2" style={{ width: `${x.value}%` }} />
              </span>
              <b className="text-right font-mono text-foreground">{x.value}%</b>
            </div>
          ))}
        </article>
      </div>

      <section className="mt-8">
        <div className="flex items-end justify-between pb-4">
          <div>
            <h2 className="font-heading text-xl leading-tight font-bold">
              {language === 'bn' ? 'পূর্ববর্তী মূল্যায়নসমূহ' : 'Past Assessments'}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {language === 'bn'
                ? 'তোমার সম্পূর্ণ উত্তরপত্র জমাদান ও গ্রেডিং ইতিহাস।'
                : 'Your complete submission and grading history.'}
            </p>
          </div>
        </div>

        {!submissions || submissions.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            {language === 'bn'
              ? 'এখনো কোনো উত্তরপত্র জমা দেওয়া হয়নি। প্রথম বোর্ড স্ট্যান্ডার্ড মূল্যায়ন দেখতে একটি খাতা আপলোড করো!'
              : 'No submissions recorded yet. Upload an answer sheet to get your first board-style grade!'}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {submissions.map((s) => (
              <Link
                key={s.id}
                href={`/dashboard/submissions/${s.id}`}
                className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:bg-accent"
              >
                <div className="min-w-0">
                  <b className="block truncate text-sm text-foreground">
                    {s.question_papers?.subjects?.name_en || (language === 'bn' ? 'বিষয়' : 'Subject')} —{' '}
                    {s.question_papers?.title || (language === 'bn' ? 'অনুশীলন প্রশ্ন' : 'Practice Paper')}
                  </b>
                  <small className="text-2xs text-muted-foreground">
                    {language === 'bn' ? 'জমা দেওয়া হয়েছে ' : 'Submitted on '}
                    {new Date(s.submitted_at).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </small>
                </div>

                <div className="flex flex-none items-center gap-4">
                  <Tag color={s.status === 'COMPLETED' ? 'mint' : 'sun'}>
                    {s.status === 'COMPLETED'
                      ? language === 'bn'
                        ? 'সম্পূর্ণ'
                        : 'COMPLETED'
                      : language === 'bn'
                        ? 'মূল্যায়ন চলমান'
                        : 'EVALUATING'}
                  </Tag>
                  <strong className="font-mono text-base text-foreground">
                    {s.total_score_obtained != null
                      ? `${s.total_score_obtained}/${s.max_possible_score}`
                      : '—'}
                  </strong>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
