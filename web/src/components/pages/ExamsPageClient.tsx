'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  Play,
  RotateCcw,
  Sparkles,
  Timer,
} from 'lucide-react';
import { Tag } from '@/components/Tag';
import { PageHeader } from '@/components/PageHeader';
import { useLanguage } from '@/context/LanguageContext';

interface ExamPaperItem {
  id: string;
  title: string;
  total_marks: number;
  subjects?: { name_en: string } | Array<{ name_en: string }> | null;
}

interface ExamsPageProps {
  simulator?: boolean;
  papers?: ExamPaperItem[];
}

export const ExamsPageClient: React.FC<ExamsPageProps> = ({
  simulator = false,
  papers = [],
}) => {
  const { language, t } = useLanguage();
  const [started, setStarted] = useState(false);
  const [answer, setAnswer] = useState('');

  const mcqOptions =
    language === 'bn'
      ? ['বেগ (Velocity)', 'বল (Force)', 'কাজ (Work)', 'ত্বরণ (Acceleration)']
      : ['Velocity', 'Force', 'Work', 'Acceleration'];

  const defaultExamCards =
    language === 'bn'
      ? [
          'পদার্থবিজ্ঞান ১ম পত্র — মডেল টেস্ট',
          'উচ্চতর গণিত — অধ্যায় ৮',
          'রসায়ন — বোর্ড প্র্যাকটিস',
        ]
      : [
          'Physics 1st Paper — Model Test',
          'Higher Math — Chapter 8',
          'Chemistry — Board Practice',
        ];

  if (simulator && started) {
    return (
      <div className="exam-screen">
        <header>
          <span className="exam-logo">
            SheraTutor <small>{t('simulator.title').toUpperCase()}</small>
          </span>
          <div className="exam-timer">
            <Timer size={17} /> 02:59:48
          </div>
          <button type="button" onClick={() => setStarted(false)}>
            {t('simulator.exit')}
          </button>
        </header>
        <div className="exam-paper">
          <Tag color="sun">
            {language === 'bn' ? 'পদার্থবিজ্ঞান ১ম পত্র' : 'PHYSICS 1ST PAPER'}
          </Tag>
          <h1>{language === 'bn' ? 'এইচএসসি বোর্ড পরীক্ষা' : 'HSC Board Examination'}</h1>
          <p>
            {language === 'bn' ? 'সময়: ৩ ঘণ্টা' : 'Time: 3 hours'} &nbsp; · &nbsp; {language === 'bn' ? 'পূর্ণমান: ১০০' : 'Full marks: 100'}
          </p>
          <hr />
          <h3>{language === 'bn' ? 'ক বিভাগ — বহুনির্বাচনী প্রশ্ন' : 'Part A — Multiple choice questions'}</h3>
          <p>
            <b>১.</b> {language === 'bn' ? 'নিচের কোনটি স্কেলার রাশি?' : 'Which of the following is a scalar quantity?'}
          </p>
          {mcqOptions.map((x, i) => (
            <button
              type="button"
              className={`mcq ${answer === x ? 'selected' : ''}`.trim()}
              onClick={() => setAnswer(x)}
              key={x}
            >
              <span>{'ABCD'[i]}</span>
              {x}
            </button>
          ))}
          {answer && (
            <p className="answer-confirmation">
              <Check size={15} /> {language === 'bn' ? `উত্তর: ${answer} সংরক্ষিত হয়েছে` : `Answer ${answer} selected`}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={simulator ? t('simulator.title') : t('exams.title')}
        description={simulator ? t('simulator.desc') : t('exams.desc')}
      >
        {simulator ? (
          <button
            type="button"
            className="primary-btn"
            onClick={() => setStarted(true)}
          >
            <Play size={16} /> {t('simulator.start_btn')}
          </button>
        ) : (
          <Link href="/dashboard/practice/generate" className="primary-btn">
            <Sparkles size={16} /> {t('exams.generate_btn')}
          </Link>
        )}
      </PageHeader>

      {simulator ? (
        <div className="simulator-hero">
          <div className="simulator-copy">
            <Tag color="sun">{language === 'bn' ? 'বোর্ড সিমুলেশন' : 'BOARD SIMULATION'}</Tag>
            <h2>{language === 'bn' ? 'পদার্থবিজ্ঞান বোর্ড পরীক্ষা' : 'Physics Board Exam'}</h2>
            <p>
              {t('simulator.hero_desc')}
            </p>
            <div>
              <span>
                <Clock3 size={16} /> {t('simulator.3_hours')}
              </span>
              <span>
                <ClipboardCheck size={16} /> {t('simulator.100_marks')}
              </span>
              <span>
                <BookOpen size={16} /> {t('simulator.25_questions')}
              </span>
            </div>
            <button
              type="button"
              className="dark-wide"
              onClick={() => setStarted(true)}
            >
              {language === 'bn' ? 'পরীক্ষা শুরু করো' : 'Begin simulation'} <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="simulator-paper">
            <b>{language === 'bn' ? 'এইচএসসি পরীক্ষা' : 'HSC EXAMINATION'}</b>
            <strong>{language === 'bn' ? 'পদার্থবিজ্ঞান' : 'PHYSICS'}</strong>
            <span>{language === 'bn' ? '১ম পত্র · ২০২৬' : '1st Paper · 2026'}</span>
            <i>01</i>
          </div>
        </div>
      ) : (
        <>
          <div className="filter-row">
            {(language === 'bn'
              ? ['পদার্থবিজ্ঞান', 'সব অধ্যায়', 'ঢাকা বোর্ড', 'মাঝারি', 'সম্পূর্ণ টেস্ট']
              : ['Physics', 'All chapters', 'Dhaka Board', 'Medium', 'Full test']
            ).map((f) => (
              <span className="chip" key={f}>
                {f} <ChevronDown size={14} />
              </span>
            ))}
            <button type="button" className="ghost-btn">
              <RotateCcw size={14} /> {t('common.reset')}
            </button>
          </div>

          <div className="exam-cards">
            {papers.length > 0
              ? papers.map((p) => {
                  const subObj = Array.isArray(p.subjects) ? p.subjects[0] : p.subjects;
                  return (
                    <article className="exam-card-full" key={p.id}>
                      <div className="exam-top">
                        <Tag color="mint">
                          {subObj?.name_en || (language === 'bn' ? 'এইচএসসি' : 'HSC')}
                        </Tag>
                        <time>{p.total_marks || 100} {language === 'bn' ? 'মার্কস' : 'marks'}</time>
                      </div>
                      <h3>{p.title}</h3>
                      <p>
                        {language === 'bn'
                          ? 'আসল বোর্ড কাঠামোর বহুনির্বাচনী ও সৃজনশীল প্রশ্ন সেট।'
                          : 'Board-standard question set with official NCTB marking rubric.'}
                      </p>
                      <div className="exam-card-foot">
                        <span>
                          <FileCheck2 size={16} /> {p.total_marks || 100} {language === 'bn' ? 'নম্বর' : 'Marks'}
                        </span>
                        <Link
                          href={`/dashboard/practice/${p.id}`}
                          className="start-link"
                        >
                          {language === 'bn' ? 'পরীক্ষা দাও' : 'Start exam'} <ChevronRight size={15} />
                        </Link>
                      </div>
                    </article>
                  );
                })
              : defaultExamCards.map((title, i) => (
                  <article className="exam-card-full" key={title}>
                    <div className="exam-top">
                      <Tag color={i === 0 ? 'mint' : i === 1 ? 'sun' : 'coral'}>
                        {language === 'bn' ? 'এইচএসসি' : 'HSC'}
                      </Tag>
                      <time>100 {language === 'bn' ? 'মার্কস' : 'marks'}</time>
                    </div>
                    <h3>{title}</h3>
                    <p>
                      {language === 'bn'
                        ? 'আসল বোর্ড কাঠামোর বহুনির্বাচনী ও সৃজনশীল প্রশ্ন সেট।'
                        : 'Board-standard question set with official NCTB marking rubric.'}
                    </p>
                    <div className="exam-card-foot">
                      <span>
                        <FileCheck2 size={16} /> 100 {language === 'bn' ? 'নম্বর' : 'Marks'}
                      </span>
                      <Link
                        href="/dashboard/board-simulator"
                        className="start-link"
                      >
                        {language === 'bn' ? 'পরীক্ষা দাও' : 'Start exam'} <ChevronRight size={15} />
                      </Link>
                    </div>
                  </article>
                ))}
          </div>
        </>
      )}
    </>
  );
};
