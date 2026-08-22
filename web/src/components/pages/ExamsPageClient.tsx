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

const mcqOptions = ['Velocity', 'Force', 'Work', 'Acceleration'];
const defaultExamCards = [
  'Physics 1st Paper — Model Test',
  'Higher Math — Chapter 8',
  'Chemistry — Board Practice',
];

export const ExamsPageClient: React.FC<ExamsPageProps> = ({
  simulator = false,
  papers = [],
}) => {
  const [started, setStarted] = useState(false);
  const [answer, setAnswer] = useState('');

  if (simulator && started) {
    return (
      <div className="exam-screen">
        <header>
          <span className="exam-logo">
            SheraTutor <small>BOARD SIMULATOR</small>
          </span>
          <div className="exam-timer">
            <Timer size={17} /> 02:59:48
          </div>
          <button type="button" onClick={() => setStarted(false)}>
            Exit exam
          </button>
        </header>
        <div className="exam-paper">
          <Tag color="sun">PHYSICS 1ST PAPER</Tag>
          <h1>HSC Board Examination</h1>
          <p>Time: 3 hours &nbsp; · &nbsp; Full marks: 100</p>
          <hr />
          <h3>Part A — Multiple choice questions</h3>
          <p>
            <b>1.</b> Which of the following is a scalar quantity?
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
              <Check size={15} /> Answer {answer} selected
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={simulator ? 'Board simulator' : 'Mock exams'}
        description={
          simulator
            ? 'Step into a real board exam environment.'
            : 'Build board-standard papers tailored to your syllabus.'
        }
      >
        {simulator ? (
          <button
            type="button"
            className="primary-btn"
            onClick={() => setStarted(true)}
          >
            <Play size={16} /> Start simulation
          </button>
        ) : (
          <Link href="/dashboard/practice/generate" className="primary-btn">
            <Sparkles size={16} /> Generate exam
          </Link>
        )}
      </PageHeader>

      {simulator ? (
        <div className="simulator-hero">
          <div className="simulator-copy">
            <Tag color="sun">PREMIUM PRACTICE</Tag>
            <h2>Physics Board Exam</h2>
            <p>
              Experience a full HSC exam with the timing, format and pressure of
              the real thing.
            </p>
            <div>
              <span>
                <Clock3 size={16} /> 3 Hours
              </span>
              <span>
                <ClipboardCheck size={16} /> 100 Marks
              </span>
              <span>
                <BookOpen size={16} /> 25 Questions
              </span>
            </div>
            <button
              type="button"
              className="dark-wide"
              onClick={() => setStarted(true)}
            >
              Begin simulation <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="simulator-paper">
            <b>HSC EXAMINATION</b>
            <strong>PHYSICS</strong>
            <span>1st Paper · 2026</span>
            <i>01</i>
          </div>
        </div>
      ) : (
        <>
          <div className="filter-row">
            {[
              'Physics',
              'All chapters',
              'Dhaka Board',
              'Medium',
              'Full test',
            ].map((x) => (
              <button type="button" key={x}>
                {x}
                <ChevronDown size={14} />
              </button>
            ))}
            <button type="button" className="filter-clear">
              <RotateCcw size={14} /> Reset
            </button>
          </div>
          <div className="exam-grid">
            {(papers.length > 0
              ? papers
              : defaultExamCards.map((title) => ({
                  id: title,
                  title,
                  total_marks: 100,
                  subjects: { name_en: 'Physics' },
                }))
            ).map((x, i) => (
              <article key={x.id}>
                <div className={`exam-icon i${i % 3}`}>
                  <FileCheck2 size={24} />
                </div>
                <Tag color={i === 0 ? 'coral' : 'mint'}>
                  {i === 0 ? 'RECENTLY GENERATED' : 'READY TO PRACTICE'}
                </Tag>
                <h3>{x.title}</h3>
                <p>
                  {i === 0
                    ? `${x.total_marks || 100} marks · 3 hours · Dhaka Board`
                    : '30 marks · 45 minutes · HSC standard'}
                </p>
                <div>
                  <span>25 questions</span>
                  <Link
                    href={`/dashboard/upload?paperId=${x.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <button type="button">
                      Open <ChevronRight size={15} />
                    </button>
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
