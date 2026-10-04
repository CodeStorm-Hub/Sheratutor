'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Award,
  Sliders,
  HelpCircle,
  CheckSquare,
  Home,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export type StepKey = 'learn' | 'concept' | 'example' | 'try' | 'quiz' | 'check' | 'summary';

interface StepNavigationFooterProps<T extends string = StepKey> {
  currentStep: T;
  onStepChange: (step: T) => void;
  chapterNumberBn?: string;
  chapterNumberEn?: string;
  chapterTitleBn?: string;
  chapterTitleEn?: string;
  subjectHref?: string;
}

const STEPS_CONFIG: {
  key: 'learn' | 'example' | 'try' | 'quiz' | 'summary';
  num: number;
  numBn: string;
  labelBn: string;
  labelEn: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: 'learn', num: 1, numBn: '১', labelBn: 'কনসেপ্ট ল্যাব', labelEn: 'Concept Lab', icon: BookOpen },
  { key: 'example', num: 2, numBn: '২', labelBn: 'বোর্ড উদাহরণ (CQ)', labelEn: 'Board Examples (CQ)', icon: Award },
  { key: 'try', num: 3, numBn: '৩', labelBn: 'নিজে চেষ্টা করুন', labelEn: 'Try Yourself', icon: Sliders },
  { key: 'quiz', num: 4, numBn: '৪', labelBn: 'অনুধাবন যাচাই (MCQ)', labelEn: 'Check Understanding (MCQ)', icon: HelpCircle },
  { key: 'summary', num: 5, numBn: '৫', labelBn: 'সারসংক্ষেপ ও সূত্র', labelEn: 'Summary Vault', icon: CheckSquare },
];

export function StepNavigationFooter<T extends string = StepKey>({
  currentStep,
  onStepChange,
  chapterNumberBn = 'অধ্যায়',
  chapterNumberEn = 'Chapter',
  chapterTitleBn = '',
  chapterTitleEn = '',
  subjectHref = '/dashboard/playground/v2',
}: StepNavigationFooterProps<T>) {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const normalizedKey =
    currentStep === 'concept' ? 'learn' : currentStep === 'check' ? 'quiz' : currentStep;
  const isConceptCheckDialect = currentStep === 'concept' || currentStep === 'check';

  const currentIndex = STEPS_CONFIG.findIndex((s) => s.key === normalizedKey);
  const currentStepData = STEPS_CONFIG[currentIndex] || STEPS_CONFIG[0];
  const prevStepData = currentIndex > 0 ? STEPS_CONFIG[currentIndex - 1] : null;
  const nextStepData = currentIndex < STEPS_CONFIG.length - 1 ? STEPS_CONFIG[currentIndex + 1] : null;

  const progressPercent = Math.round(((currentIndex + 1) / STEPS_CONFIG.length) * 100);

  const handleStepTransition = (targetKey: StepKey) => {
    let outKey: string = targetKey;
    if (isConceptCheckDialect) {
      if (targetKey === 'learn') outKey = 'concept';
      else if (targetKey === 'quiz') outKey = 'check';
    }
    onStepChange(outKey as T);
    // Smooth scroll to top of guidebook content
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Keyboard shortcut listener (1 to 5) for fast teenage desktop flow
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === '1') handleStepTransition('learn');
      else if (e.key === '2') handleStepTransition('example');
      else if (e.key === '3') handleStepTransition('try');
      else if (e.key === '4') handleStepTransition('quiz');
      else if (e.key === '5') handleStepTransition('summary');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isConceptCheckDialect]);

  return (
    <div className="mt-12 pt-8 border-t border-border/70 space-y-4">
      {/* Step Momentum Pill & Progress Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground font-semibold">
          <Sparkles className="h-4 w-4 text-[#FF6B57]" />
          <span>
            {isBn ? 'তোমার শিখন অগ্রগতি:' : 'Learning Progress:'}{' '}
            <strong className="text-foreground font-bold">
              {isBn ? `ধাপ ${currentStepData.numBn}/৫ (${progressPercent}%)` : `Step ${currentStepData.num}/5 (${progressPercent}%)`}
            </strong>
          </span>
          <span className="text-border">|</span>
          <span className="text-primary font-bold">{isBn ? currentStepData.labelBn : currentStepData.labelEn}</span>
        </div>

        {/* Keyboard shortcut hint for teenage desktop students */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px] text-muted-foreground/80 font-mono">
          <span>{isBn ? 'কীবোর্ড শর্টকাট:' : 'Shortcuts:'}</span>
          <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-bold">1</kbd>
          <span>-</span>
          <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-bold">5</kbd>
        </div>
      </div>

      {/* Progress Track */}
      <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#FF6B57] to-amber-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Previous Step Button */}
        {prevStepData ? (
          <button
            onClick={() => handleStepTransition(prevStepData.key)}
            className="flex items-center justify-center sm:justify-start gap-2 px-4 py-3 rounded-2xl border border-border bg-card hover:bg-muted/60 text-foreground text-xs sm:text-sm font-bold transition-all shadow-xs group"
          >
            <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:-translate-x-1 transition-transform" />
            <div className="text-left">
              <span className="block text-[10px] text-muted-foreground font-semibold">
                {isBn ? `← পূর্ববর্তী ধাপ ${prevStepData.numBn}` : `← Previous Step ${prevStepData.num}`}
              </span>
              <span>{isBn ? prevStepData.labelBn : prevStepData.labelEn}</span>
            </div>
          </button>
        ) : (
          <Link
            href={subjectHref as any}
            className="flex items-center justify-center sm:justify-start gap-2 px-4 py-3 rounded-2xl border border-border/60 bg-muted/20 hover:bg-muted/50 text-muted-foreground hover:text-foreground text-xs sm:text-sm font-semibold transition-all"
          >
            <Home className="h-4 w-4" />
            <span>{isBn ? 'লাইব্রেরিতে ফিরে যান' : 'Back to Library Hub'}</span>
          </Link>
        )}

        {/* 5-Step Micro Circles */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/40 border border-border/50">
          {STEPS_CONFIG.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={step.key}
                onClick={() => handleStepTransition(step.key)}
                title={isBn ? `${step.numBn}. ${step.labelBn}` : `${step.num}. ${step.labelEn}`}
                className={`h-7 px-2.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
                  isCurrent
                    ? 'bg-[#FF6B57] text-white shadow-xs scale-105'
                    : isCompleted
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <span>{isBn ? step.numBn : step.num}</span>}
                <span className="text-[10px] hidden xl:inline">{isBn ? step.labelBn : step.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Next Step / Complete Button */}
        {nextStepData ? (
          <button
            onClick={() => handleStepTransition(nextStepData.key)}
            className="flex items-center justify-center sm:justify-end gap-3 px-6 py-3.5 rounded-2xl bg-[#FF6B57] hover:bg-[#e05340] text-white text-xs sm:text-sm font-extrabold transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] group"
          >
            <div className="text-right">
              <span className="block text-[10px] text-white/80 font-semibold">
                {isBn ? `পরবর্তী ধাপ ${nextStepData.numBn} →` : `Next Step ${nextStepData.num} →`}
              </span>
              <span>{isBn ? nextStepData.labelBn : nextStepData.labelEn}</span>
            </div>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <Link
            href={subjectHref as any}
            className="flex items-center justify-center sm:justify-end gap-3 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold transition-all shadow-md hover:shadow-lg hover:scale-[1.02] group"
          >
            <div className="text-right">
              <span className="block text-[10px] text-white/80 font-semibold">
                {isBn ? '🎉 সম্পূর্ণ অধ্যায় সম্পন্ন!' : '🎉 Chapter Completed!'}
              </span>
              <span>{isBn ? 'পরবর্তী অধ্যায়ে যান' : 'Continue to Next Chapter'}</span>
            </div>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
}
