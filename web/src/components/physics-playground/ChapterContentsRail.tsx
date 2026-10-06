'use client';

import React from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  FlaskConical,
  GitFork,
  HelpCircle,
  ShieldAlert,
  Sigma,
  Clock,
  Award,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { PhysicsChapterMetadata } from '@/lib/physics-playground/types';
import { useLanguage } from '@/context/LanguageContext';
import { toBengaliNumber } from './PhysicsCatalogView';
import { Progress } from '@/components/ui/progress';

interface ChapterContentsRailProps {
  metadata: PhysicsChapterMetadata;
  currentStep: number;
  completedSteps: Set<number>;
  onSelectStep: (step: number) => void;
  className?: string;
}

const STEPS = [
  {
    stepNumber: 1,
    titleBn: '১. কনসেপ্ট ইউনিভার্স',
    titleEn: '1. Concept Universe',
    descBn: 'মূল ধারণার সংযোগ',
    descEn: 'Core ideas & intuition',
    icon: GitFork,
  },
  {
    stepNumber: 2,
    titleBn: '২. স্যান্ডবক্স ল্যাব',
    titleEn: '2. Interactive Sandbox',
    descBn: 'ভার্চুয়াল হাতে-কলমে সিমুলেশন',
    descEn: 'Hands-on visual simulation',
    icon: FlaskConical,
  },
  {
    stepNumber: 3,
    titleBn: '৩. সূত্র ও প্যাটার্ন ডিকোডার',
    titleEn: '3. Formula Decoder',
    descBn: 'প্রতিপাদন ও চলকের অর্থ',
    descEn: 'Derivation & variable breakdown',
    icon: Sigma,
  },
  {
    stepNumber: 4,
    titleBn: '৪. রেড লাইন বোর্ড ট্র্যাপ',
    titleEn: '4. "Red Line" Board Traps',
    descBn: 'যেসব ভুলে পরীক্ষক নম্বর কাটেন',
    descEn: 'Examiner mark deduction traps',
    icon: ShieldAlert,
  },
  {
    stepNumber: 5,
    titleBn: '৫. ডায়াগনস্টিক কুইজ',
    titleEn: '5. Rapid Board Quiz',
    descBn: 'বোর্ড স্ট্যান্ডার্ড যাচাই',
    descEn: 'Diagnostic board assessment',
    icon: HelpCircle,
  },
];

export function ChapterContentsRail({
  metadata,
  currentStep,
  completedSteps,
  onSelectStep,
  className = '',
}: ChapterContentsRailProps) {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const progressPercent = Math.round((completedSteps.size / STEPS.length) * 100);

  return (
    <div className={`flex flex-col h-full bg-card/60 border-r border-border/80 ${className}`}>
      {/* Top back link */}
      <div className="p-4 border-b border-border/80">
        <Link
          href={'/dashboard/playground/physics' as Route}
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group mb-3"
        >
          <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>{isBn ? 'সকল অধ্যায়ে ফিরে যান' : 'Back to All Chapters'}</span>
        </Link>

        {/* Chapter Header */}
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
              {isBn ? `অধ্যায় ${toBengaliNumber(metadata.chapterNo)}` : `CH ${String(metadata.chapterNo).padStart(2, '0')}`}
            </span>
            <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
              {isBn ? metadata.divisionTitleBn : metadata.divisionTitleEn}
            </span>
          </div>

          <h2 className="text-base font-bold text-foreground leading-snug pt-1">
            {isBn ? metadata.titleBn : metadata.titleEn}
          </h2>
          <p className="text-xs text-muted-foreground font-medium">
            {isBn ? metadata.titleEn : metadata.titleBn}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground text-[11px]">
              {isBn ? 'অধ্যায়ের অগ্রগতি' : 'Progress'}
            </span>
            <span className="font-mono text-[11px] font-semibold text-primary">
              {isBn ? `${toBengaliNumber(progressPercent)}%` : `${progressPercent}%`}
            </span>
          </div>
          <Progress value={progressPercent} className="h-1.5" />
        </div>
      </div>

      {/* 5-Step Navigation List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {isBn ? 'লার্নিং স্টেপস' : 'Learning Steps'}
        </div>

        {STEPS.map((step) => {
          const isActive = currentStep === step.stepNumber;
          const isDone = completedSteps.has(step.stepNumber);
          const Icon = step.icon;

          return (
            <button
              key={step.stepNumber}
              onClick={() => onSelectStep(step.stepNumber)}
              className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 border ${
                isActive
                  ? 'bg-primary/10 border-primary/30 text-foreground shadow-xs'
                  : 'bg-card/40 hover:bg-surface-2 border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <div
                className={`mt-0.5 size-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : isDone
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  <Icon className="size-3.5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold truncate ${
                      isActive ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {isBn ? step.titleBn : step.titleEn}
                  </span>
                  {isActive && (
                    <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                  {isBn ? step.descBn : step.descEn}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Chapter Specs Quick Card */}
      <div className="p-4 border-t border-border/80 bg-surface-1/50 space-y-2 text-xs">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {isBn ? 'আনুমানিক সময়' : 'Est. Time'}
          </span>
          <span className="font-medium text-foreground">
            {isBn ? `${toBengaliNumber(metadata.estimatedMinutes)} মিনিট` : `${metadata.estimatedMinutes} mins`}
          </span>
        </div>

        <div className="flex items-center justify-between text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Award className="size-3.5" />
            {isBn ? 'বোর্ড নম্বর' : 'Board Marks'}
          </span>
          <span className="font-medium text-foreground text-right truncate max-w-[130px]" title={metadata.boardMarksAllocation}>
            {metadata.boardMarksAllocation}
          </span>
        </div>
      </div>
    </div>
  );
}
