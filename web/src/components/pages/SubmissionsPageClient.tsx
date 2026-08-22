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
        description={language === 'bn' ? 'তোমার প্রতিটি অনুশীলনের বিস্তারিত মূল্যায়ন ও ফলাফল।' : 'Every practice session, made visible.'}
      >
        <Link href="/dashboard/upload" className="primary-btn">
          <Upload size={15} /> {language === 'bn' ? 'নতুন খাতা জমা দিন' : 'Upload answer sheet'}
        </Link>
      </PageHeader>

      <div className="results-grid">
        <article className="result-feature">
          <Tag color="mint">{language === 'bn' ? 'সর্বশেষ মূল্যায়ন' : 'LATEST ASSESSMENT'}</Tag>
          <h2>{latestTitle}</h2>
          <div className="result-number">
            {latestScore}
            <span>/{latestMax}</span>
          </div>
          <p>{language === 'bn' ? 'পূর্ববর্তী মূল্যায়নের চেয়ে +৯ নম্বর বৃদ্ধি' : '+9 marks from your previous assessment'}</p>
          {latestId ? (
            <Link
              href={`/dashboard/submissions/${latestId}`}
              className="dark-wide"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {language === 'bn' ? 'সম্পূর্ণ ফলাফল দেখুন' : 'See full result'} <ChevronRight size={15} />
            </Link>
          ) : (
            <Link
              href="/dashboard/upload"
              className="dark-wide"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {language === 'bn' ? 'উত্তরপত্র জমা দিন' : 'Submit a paper'} <ChevronRight size={15} />
            </Link>
          )}
        </article>

        <article className="score-history">
          <h3>{language === 'bn' ? 'স্কোর ইতিহাস' : 'Score history'}</h3>
          <BarChart />
        </article>

        <article className="subject-ranks">
          <h3>{language === 'bn' ? 'বিষয়ভিত্তিক অগ্রগতি' : 'Subject performance'}</h3>
          {mockSubjects.map((x) => (
            <div key={x.subject}>
              <span>{x.subject}</span>
              <i>
                <em style={{ width: `${x.value}%` }} />
              </i>
              <b>{x.value}%</b>
            </div>
          ))}
        </article>
      </div>

      {/* Submissions List */}
      <section style={{ marginTop: 32 }}>
        <div className="section-heading" style={{ padding: '0 0 16px 0' }}>
          <div>
            <h2>{language === 'bn' ? 'পূর্ববর্তী মূল্যায়নসমূহ' : 'Past Assessments'}</h2>
            <p>{language === 'bn' ? 'তোমার সম্পূর্ণ উত্তরপত্র জমাদান ও গ্রেডিং ইতিহাস।' : 'Your complete submission and grading history.'}</p>
          </div>
        </div>

        {(!submissions || submissions.length === 0) ? (
          <div
            style={{
              padding: 32,
              textAlign: 'center',
              border: '1px solid var(--border)',
              borderRadius: 16,
              background: '#fff',
              color: 'var(--muted)',
            }}
          >
            {language === 'bn'
              ? 'এখনো কোনো উত্তরপত্র জমা দেওয়া হয়নি। প্রথম বোর্ড স্ট্যান্ডার্ড মূল্যায়ন দেখতে একটি খাতা আপলোড করো!'
              : 'No submissions recorded yet. Upload an answer sheet to get your first board-style grade!'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {submissions.map((s) => (
              <Link
                key={s.id}
                href={`/dashboard/submissions/${s.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  background: '#fff',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div>
                  <b style={{ fontSize: 14, display: 'block' }}>
                    {s.question_papers?.subjects?.name_en || (language === 'bn' ? 'বিষয়' : 'Subject')} —{' '}
                    {s.question_papers?.title || (language === 'bn' ? 'অনুশীলন প্রশ্ন' : 'Practice Paper')}
                  </b>
                  <small style={{ color: 'var(--muted)', fontSize: 11 }}>
                    {language === 'bn' ? 'জমা দেওয়া হয়েছে ' : 'Submitted on '}
                    {new Date(s.submitted_at).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </small>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <Tag color={s.status === 'COMPLETED' ? 'mint' : 'sun'}>
                    {s.status === 'COMPLETED'
                      ? (language === 'bn' ? 'সম্পূর্ণ' : 'COMPLETED')
                      : (language === 'bn' ? 'মূল্যায়ন চলমান' : 'EVALUATING')}
                  </Tag>
                  <strong style={{ fontFamily: 'Space Mono', fontSize: 16 }}>
                    {s.total_score_obtained != null
                      ? `${s.total_score_obtained}/${s.max_possible_score}`
                      : '—'}
                  </strong>
                  <ChevronRight size={16} color="#69718c" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
