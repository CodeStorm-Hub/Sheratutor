'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight, BookOpen, Check, ChevronRight,
  ClipboardCheck, Clock3, FileCheck2, Play, RotateCcw,
  Sparkles, Timer
} from 'lucide-react';
import { Tag } from '@/components/Tag';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { RenderMathText } from '@/components/render-math-text';
import { useLanguage } from '@/context/LanguageContext';

type SimSubject = { name_en?: string; name_bn?: string };
type SimSubQuestion = { part: string; text_bn: string; text_en?: string; marks: number };

type SimQuestion = {
  id: string;
  question_number: number;
  question_type: 'CQ' | 'MCQ';
  max_marks: number;
  stimulus_bn?: string | null;
  question_text_bn?: string | null;
  mcq_correct_option?: string | null;
  sub_questions_json?: string | SimSubQuestion[] | null;
  mcq_options_json?: string | string[] | null;
};

type SimPaper = {
  id: string;
  title: string;
  total_marks: number;
  difficulty?: string | null;
  paper_type?: string | null;
  subjects?: SimSubject | SimSubject[] | null;
  questions?: SimQuestion[];
};

type ExamsPageClientProps = { simulator?: boolean; papers?: SimPaper[] };

const subjectOf = (s: SimPaper['subjects']): SimSubject | undefined =>
  Array.isArray(s) ? s[0] : s ?? undefined;

export const ExamsPageClient: React.FC<ExamsPageClientProps> = ({ simulator = false, papers = [] }) => {
  const { language, t } = useLanguage();
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(3 * 60 * 60); // Default 3 hours

  const paper = papers[0];
  const questions = [...(paper?.questions ?? [])].sort(
    (a, b) => a.question_number - b.question_number,
  );

  // Restore auto-saved answers on mount/start
  useEffect(() => {
    if (paper?.id) {
      try {
        const saved = localStorage.getItem(`sheratutor_sim_${paper.id}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.answers && Object.keys(parsed.answers).length > 0) {
            setAnswers(parsed.answers);
            if (parsed.timeLeft) setTimeLeft(parsed.timeLeft);
          }
        }
      } catch {}
    }
  }, [paper?.id]);

  // Periodic LocalStorage auto-save
  useEffect(() => {
    if (started && paper?.id) {
      try {
        localStorage.setItem(
          `sheratutor_sim_${paper.id}`,
          JSON.stringify({ answers, timeLeft, savedAt: new Date().toISOString() })
        );
      } catch {}
    }
  }, [answers, timeLeft, started, paper?.id]);

  useEffect(() => {
    if (started && timeLeft > 0) {
      const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timerId);
    }
  }, [started, timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleMCQSelect = (questionId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };


  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');

  // Filter papers based on active state
  const filteredPapers = papers.filter((p) => {
    const subObj = subjectOf(p.subjects);
    const subName = subObj?.name_en || '';
    if (selectedSubject !== 'ALL' && !subName.toLowerCase().includes(selectedSubject.toLowerCase())) {
      return false;
    }
    if (selectedDifficulty !== 'ALL' && p.difficulty !== selectedDifficulty) {
      return false;
    }
    return true;
  });

  const subjectOptions = [
    { value: 'ALL', label_en: 'All Subjects', label_bn: 'সকল বিষয়' },
    { value: 'Physics', label_en: 'Physics', label_bn: 'পদার্থবিজ্ঞান' },
    { value: 'Chemistry', label_en: 'Chemistry', label_bn: 'রসায়ন' },
    { value: 'Mathematics', label_en: 'Mathematics', label_bn: 'গণিত' },
    { value: 'English', label_en: 'English', label_bn: 'ইংরেজি' },
  ];

  const difficultyOptions = [
    { value: 'ALL', label_en: 'All Difficulties', label_bn: 'সকল মান' },
    { value: 'EASY', label_en: 'Easy', label_bn: 'সহজ' },
    { value: 'MEDIUM', label_en: 'Medium', label_bn: 'মাঝারি' },
    { value: 'HARD', label_en: 'Hard', label_bn: 'কঠিন' },
    { value: 'BOARD_STANDARD', label_en: 'Board Standard', label_bn: 'বোর্ড মান' },
  ];

  const handleResetFilters = () => {
    setSelectedSubject('ALL');
    setSelectedDifficulty('ALL');
  };

  const isFiltered = selectedSubject !== 'ALL' || selectedDifficulty !== 'ALL';

  const screenClass = 'fixed inset-0 z-50 overflow-y-auto bg-surface-2';
  const screenHeaderClass =
    'sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-surface-1 px-6 py-3 sm:px-10';
  const logoClass = 'font-heading text-xl font-bold';
  const exitBtnClass =
    'rounded-lg border border-border bg-surface-1 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent';
  const paperClass =
    'mx-auto my-10 max-w-[730px] rounded-2xl bg-surface-1 px-6 py-10 shadow-lg sm:px-14 sm:py-12';

  if (simulator && started) {
    if (!paper) {
      return (
        <div className={screenClass}>
          <header className={screenHeaderClass}>
            <span className={logoClass}>
              SheraTutor <small className="ml-1.5 font-mono text-3xs text-muted-foreground">SIMULATOR</small>
            </span>
            <button type="button" className={exitBtnClass} onClick={() => setStarted(false)}>
              {t('simulator.exit')}
            </button>
          </header>
          <div className={paperClass}>
            <h2 className="font-heading text-lg font-bold">
              {language === 'bn' ? 'সিমুলেট করার মতো কোনো প্রশ্নপত্র নেই।' : 'No paper available to simulate.'}
            </h2>
          </div>
        </div>
      );
    }

    return (
      <div className={screenClass}>
        <header className={screenHeaderClass}>
          <span className={logoClass}>
            SheraTutor{' '}
            <small className="ml-1.5 font-mono text-3xs text-muted-foreground">
              {t('simulator.title').toUpperCase()}
            </small>
          </span>
          <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-mark">
            <Timer size={17} /> {formatTime(timeLeft)}
          </div>
          <button type="button" className={exitBtnClass} onClick={() => setStarted(false)}>
            {t('simulator.exit')}
          </button>
        </header>
        <div className={paperClass}>
          <Tag color="sun">
            {subjectOf(paper.subjects)?.name_en || 'MOCK EXAM'}
          </Tag>
          <h1 className="mt-4 mb-0.5 font-heading text-[clamp(1.5rem,4vw,2rem)] font-extrabold">
            {paper.title}
          </h1>
          <p className="text-xs text-muted-foreground">
            {language === 'bn'
              ? `সময়: ${Math.round(paper.total_marks * 1.5)} মিনিট · পূর্ণমান: ${paper.total_marks}`
              : `Time: ${Math.round(paper.total_marks * 1.5)} Minutes · Full marks: ${paper.total_marks}`}
          </p>
          <hr className="my-6 border-t border-border" />

          <div className="space-y-12">
            {questions.map((q) => {
              const subQuestions: SimSubQuestion[] =
                typeof q.sub_questions_json === "string"
                  ? JSON.parse(q.sub_questions_json)
                  : q.sub_questions_json ?? [];
              const mcqOptions: string[] =
                typeof q.mcq_options_json === "string"
                  ? JSON.parse(q.mcq_options_json)
                  : q.mcq_options_json ?? [];
              const prompt =
                (q.question_type === "CQ" ? q.stimulus_bn || q.question_text_bn : q.question_text_bn) || "";

              return (
                <div key={q.id} className="mb-8">
                  <div className="flex font-medium text-lg mb-4">
                    <span className="w-8">{q.question_number}.</span>
                    <div className="flex-1 whitespace-pre-wrap">
                      <RenderMathText text={prompt} />
                    </div>
                    {q.question_type === "MCQ" && (
                      <span className="text-right w-12 text-sm text-muted-foreground">[{q.max_marks}]</span>
                    )}
                  </div>

                  {q.question_type === "CQ" && subQuestions && (
                    <div className="pl-8 space-y-4">
                      {subQuestions.map((sq: SimSubQuestion) => (
                        <div key={sq.part} className="flex border border-border p-4 rounded-lg bg-muted">
                          <span className="font-bold mr-3">({sq.part})</span>
                          <div className="flex-1"><RenderMathText text={sq.text_bn || ""} /></div>
                          <span className="text-right font-bold text-muted-foreground">{sq.marks}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {q.question_type === "MCQ" && mcqOptions && (
                    <div className="pl-8 grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      {mcqOptions.map((opt, idx) => {
                        const prefix = ["ক", "খ", "গ", "ঘ"][idx] || idx + 1;
                        const isSelected = answers[q.id] === opt;
                        return (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => handleMCQSelect(q.id, opt)}
                            className={`flex items-center p-3 border rounded-lg transition-colors text-left ${isSelected ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted'}`}
                          >
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 font-medium ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                              {prefix}
                            </span>
                            <span className="flex-1"><RenderMathText text={opt || ""} /></span>
                            {isSelected && <Check size={16} className="text-primary" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-12 flex justify-end">
            <Link
              href={`/dashboard/upload?paperId=${paper.id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-cta px-4 py-2.5 text-xs font-semibold text-cta-foreground shadow-xs transition-colors hover:opacity-90"
            >
              {language === 'bn' ? 'উত্তরপত্র জমা দাও' : 'Submit Answers'} <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={simulator ? t('simulator.title') : t('exams.title')}
        description={simulator ? t('simulator.desc') : t('exams.desc')}
      >
        {simulator ? (
          <Button 
            type="button" 
            onClick={() => {
              if (paper) setTimeLeft(paper.total_marks * 1.5 * 60);
              setStarted(true);
            }}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 shadow-xs"
          >
            <Play size={16} /> {t('simulator.start_btn')}
          </Button>
        ) : (
          <Link href="/dashboard/practice/generate">
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 shadow-xs">
              <Sparkles size={16} /> {t('exams.generate_btn')}
            </Button>
          </Link>
        )}
      </PageHeader>

      {simulator ? (
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs relative overflow-hidden flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="space-y-4 max-w-xl">
            <Tag color="sun">{language === 'bn' ? 'বোর্ড সিমুলেশন' : 'BOARD SIMULATION'}</Tag>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              {paper?.title || (language === 'bn' ? 'পদার্থবিজ্ঞান বোর্ড পরীক্ষা' : 'Physics Board Exam')}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{t('simulator.hero_desc')}</p>
            <div className="flex flex-wrap gap-4 text-xs font-medium text-muted-foreground pt-1">
              <span className="flex items-center gap-1.5 bg-muted/40 px-3 py-1.5 rounded-full border border-border/50">
                <Clock3 size={15} className="text-primary" /> {paper ? `${Math.round(paper.total_marks * 1.5)} Min` : t('simulator.3_hours')}
              </span>
              <span className="flex items-center gap-1.5 bg-muted/40 px-3 py-1.5 rounded-full border border-border/50">
                <ClipboardCheck size={15} className="text-primary" /> {paper?.total_marks || 100} {language === 'bn' ? 'নম্বর' : 'Marks'}
              </span>
              <span className="flex items-center gap-1.5 bg-muted/40 px-3 py-1.5 rounded-full border border-border/50">
                <BookOpen size={15} className="text-primary" /> {questions.length} {language === 'bn' ? 'টি প্রশ্ন' : 'Questions'}
              </span>
            </div>
            <div className="pt-2">
              <Button 
                type="button" 
                size="lg"
                onClick={() => {
                  if (paper) setTimeLeft(paper.total_marks * 1.5 * 60);
                  setStarted(true);
                }}
                className="gap-2 bg-foreground text-background hover:bg-foreground/90 rounded-full px-6 font-semibold shadow-xs"
              >
                {language === 'bn' ? 'পরীক্ষা শুরু করো' : 'Begin simulation'} <ArrowUpRight size={16} />
              </Button>
            </div>
          </div>

          <div className="w-full md:w-64 h-48 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col items-center justify-center text-center p-4 relative select-none">
            <span className="text-xs font-mono tracking-widest text-primary/80 uppercase mb-1">
              {language === 'bn' ? 'এসএসসি পরীক্ষা' : 'SSC EXAMINATION'}
            </span>
            <strong className="text-lg font-bold text-foreground">
              {subjectOf(paper?.subjects)?.name_en?.toUpperCase() || 'PHYSICS'}
            </strong>
            <span className="text-xs text-muted-foreground mt-1">SSC · 2026</span>
            <span className="absolute bottom-3 right-4 font-mono font-bold text-2xl text-primary/20">01</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border/70 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <label htmlFor="filter-subject" className="text-xs font-semibold text-muted-foreground ml-1">
                  {language === 'bn' ? 'বিষয়:' : 'Subject:'}
                </label>
                <select
                  id="filter-subject"
                  name="subject"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="bg-muted/40 border border-border text-foreground text-xs font-medium py-1.5 px-3 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
                  aria-label="Filter by subject"
                >
                  {subjectOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {language === 'bn' ? opt.label_bn : opt.label_en}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <label htmlFor="filter-difficulty" className="text-xs font-semibold text-muted-foreground">
                  {language === 'bn' ? 'কঠিনতা:' : 'Difficulty:'}
                </label>
                <select
                  id="filter-difficulty"
                  name="difficulty"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="bg-muted/40 border border-border text-foreground text-xs font-medium py-1.5 px-3 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
                  aria-label="Filter by difficulty"
                >
                  {difficultyOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {language === 'bn' ? opt.label_bn : opt.label_en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isFiltered && (
              <button 
                type="button" 
                onClick={handleResetFilters} 
                className="text-xs font-semibold flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors py-1 px-2.5 rounded-md hover:bg-muted/50"
              >
                <RotateCcw size={13} /> {t('common.reset')}
              </button>
            )}
          </div>

          {filteredPapers.length === 0 ? (
            <div className="text-center py-16 px-4 border border-dashed border-border rounded-3xl my-6 bg-card/40">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                <BookOpen size={22} />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                {language === 'bn' ? 'কোনো প্রশ্নপত্র পাওয়া যায়নি' : 'No Practice Papers Found'}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4 leading-relaxed">
                {language === 'bn'
                  ? 'তোমার নির্বাচিত ফিল্টারে কোনো প্রশ্নপত্র নেই। নতুন কাস্টম প্রশ্নপত্র তৈরি করতে পারো।'
                  : 'No papers match the selected filters. You can generate a brand new custom practice paper.'}
              </p>
              <Link href="/dashboard/practice/generate">
                <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                  <Sparkles size={14} /> {language === 'bn' ? 'কাস্টম প্রশ্নপত্র তৈরি করো' : 'Generate Custom Paper'}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPapers.map((p) => {
                const subObj = subjectOf(p.subjects);
                const subName = language === 'bn' ? (subObj?.name_bn || subObj?.name_en || 'পদার্থবিজ্ঞান') : (subObj?.name_en || 'Physics');
                
                const diffKey = p.difficulty || 'BOARD_STANDARD';
                const difficultyBadge = {
                  EASY: { label: language === 'bn' ? 'সহজ' : 'Easy', color: 'mint' as const },
                  MEDIUM: { label: language === 'bn' ? 'মাঝারি' : 'Medium', color: 'sun' as const },
                  HARD: { label: language === 'bn' ? 'কঠিন' : 'Hard', color: 'coral' as const },
                  BOARD_STANDARD: { label: language === 'bn' ? 'বোর্ড মান' : 'Board Std', color: 'mint' as const },
                }[diffKey as string] || { label: language === 'bn' ? 'বোর্ড মান' : 'Board Std', color: 'mint' as const };

                return (
                  <article 
                    key={p.id}
                    className="group bg-card border border-border/80 hover:border-primary/50 shadow-xs hover:shadow-md transition-all duration-200 rounded-2xl p-5 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <Tag color={difficultyBadge.color}>{subName}</Tag>
                        <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border/50">
                          {difficultyBadge.label}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {p.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                          {language === 'bn'
                            ? 'এনসিটিবি পাঠ্যক্রম ও অফিশিয়াল মার্কিং রুব্রিক সমন্বিত বোর্ড মান প্রশ্নপত্র।'
                            : 'Board-standard question set with official NCTB marking rubric.'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 font-mono">
                        <FileCheck2 size={15} className="text-primary" /> {p.total_marks} {language === 'bn' ? 'নম্বর' : 'Marks'}
                      </span>
                      <Link 
                        href={`/dashboard/practice/${p.id}`} 
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                      >
                        <span>{language === 'bn' ? 'পরীক্ষা শুরু' : 'Start exam'}</span>
                        <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
