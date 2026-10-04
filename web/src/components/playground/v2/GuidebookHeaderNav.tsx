'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Layers, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export type SubjectKey = 'physics' | 'math' | 'higher-math' | 'chemistry' | 'biology';

export interface GuidebookHeaderNavProps {
  /** The subject identifier for theming and library route */
  subjectKey: SubjectKey;
  /** Subject title in Bengali, e.g. "পদার্থবিজ্ঞান", "সাধারণ গণিত" */
  subjectNameBn?: string;
  /** Subject title in English, e.g. "Physics", "General Math" */
  subjectNameEn?: string;
  /** Custom subject icon emoji or lucide icon override */
  subjectIcon?: React.ReactNode;

  /** Chapter number (e.g. 3, "৩", "০৩", "Chapter 3") */
  chapterNum: number | string;
  /** Chapter title in Bengali, e.g. "বল (Force)", "ভৌত রাশি ও পরিমাপ" */
  chapterTitleBn: string;
  /** Chapter title in English (optional) */
  chapterTitleEn?: string;

  /** Active lesson number or label (e.g. 1, "পাঠ ১", "Lesson 1") */
  activeLesson?: number | string;
  /** Active lesson title (optional, e.g. "জড়তা ও বলের ধারণা") */
  activeLessonTitle?: string;

  /** Active step indicator (optional, e.g. "ধারণা", "উদাহরণ", "প্র্যাকটিস") */
  activeStepLabel?: string;

  /** Sidebar toggle state & callback (optional) */
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  sidebarToggleLabelOpen?: string;
  sidebarToggleLabelClosed?: string;

  /** AI Assistant callback & custom label */
  onOpenAi?: () => void;
  aiButtonLabel?: string;

  /** Library return href override, defaults to `/dashboard/playground/v2` */
  libraryHref?: string;
  libraryButtonLabel?: string;

  /** Optional right-side extra items (like step nav, badges, full-screen toggle, etc.) */
  rightExtras?: React.ReactNode;

  /** Optional center custom content (e.g. step tabs on some chapters) */
  centerContent?: React.ReactNode;

  /** Optional sticky or className customization */
  className?: string;
}

const THEME_CONFIG: Record<
  SubjectKey,
  {
    icon: string;
    defaultNameBn: string;
    defaultNameEn: string;
    subjectBadge: string;
    chapterBadge: string;
    activeDot: string;
  }
> = {
  physics: {
    icon: '⚛️',
    defaultNameBn: 'পদার্থবিজ্ঞান',
    defaultNameEn: 'Physics',
    subjectBadge:
      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20',
    chapterBadge:
      'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    activeDot: 'bg-emerald-500',
  },
  math: {
    icon: '🧮',
    defaultNameBn: 'সাধারণ গণিত',
    defaultNameEn: 'General Math',
    subjectBadge:
      'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/25 hover:bg-indigo-500/20',
    chapterBadge:
      'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    activeDot: 'bg-amber-500',
  },
  'higher-math': {
    icon: '📐',
    defaultNameBn: 'উচ্চতর গণিত',
    defaultNameEn: 'Higher Math',
    subjectBadge:
      'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25 hover:bg-purple-500/20',
    chapterBadge:
      'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
    activeDot: 'bg-purple-500',
  },
  chemistry: {
    icon: '🧪',
    defaultNameBn: 'রসায়ন',
    defaultNameEn: 'Chemistry',
    subjectBadge:
      'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/25 hover:bg-cyan-500/20',
    chapterBadge:
      'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
    activeDot: 'bg-cyan-500',
  },
  biology: {
    icon: '🧬',
    defaultNameBn: 'জীববিজ্ঞান',
    defaultNameEn: 'Biology',
    subjectBadge:
      'bg-lime-500/10 text-lime-600 dark:text-lime-400 border-lime-500/25 hover:bg-lime-500/20',
    chapterBadge:
      'bg-lime-500/15 text-lime-700 dark:text-lime-300 border-lime-500/30',
    activeDot: 'bg-lime-500',
  },
};

// Automatic fallback dictionary of English titles across all live syllabus chapters
const CHAPTER_EN_TITLES: Partial<Record<SubjectKey, Record<number | string, string>>> = {
  physics: {
    1: 'Physical Quantities & Measurement',
    2: 'Motion & Kinematics',
    3: 'Force & Dynamics',
    4: 'Work, Power & Energy',
    5: 'States of Matter & Pressure',
    6: 'Effect of Heat on Matter',
    7: 'Waves & Sound',
    8: 'Reflection of Light',
    9: 'Refraction of Light',
    10: 'Static Electricity',
    11: 'Current Electricity',
    12: 'Magnetic Effects of Electric Current',
  },
  math: {
    1: 'Real Numbers',
    2: 'Sets & Functions',
    3: 'Algebraic Expressions',
    4: 'Exponents & Logarithms',
    5: 'Equations in One Variable',
    6: 'Lines, Angles & Triangles',
    7: 'Practical Geometry',
    8: 'Circle',
    9: 'Trigonometric Ratios',
    10: 'Distance & Elevation',
    11: 'Algebraic Ratio & Proportion',
    12: 'Simultaneous Linear Equations',
    13: 'Finite Series',
    14: 'Ratio, Similarity & Symmetry',
    15: 'Area Theorems & Constructions',
    16: 'Mensuration',
    17: 'Statistics',
  },
};

function formatChapterBadge(num: number | string, isBn: boolean): { long: string; short: string } {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const raw = String(num).trim();

  // Parse pure integer
  let intVal: number | null = null;
  const match = raw.match(/\d+/);
  if (match) {
    intVal = parseInt(match[0], 10);
  } else {
    // Check bengali numerals
    const bnMatch = raw.replace(/[০-৯]/g, (d) => String(bnDigits.indexOf(d)));
    const parsedBn = parseInt(bnMatch, 10);
    if (!isNaN(parsedBn)) intVal = parsedBn;
  }

  if (isBn) {
    if (intVal !== null) {
      const padded = intVal < 10 ? `0${intVal}` : `${intVal}`;
      const bnNum = padded.replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
      return {
        long: `অধ্যায় ${bnNum}`,
        short: `অধ্যায় ${bnNum}`,
      };
    }
    return { long: `অধ্যায় ${raw}`, short: `অধ্যায় ${raw}` };
  } else {
    // English badge
    if (intVal !== null) {
      const padded = intVal < 10 ? `0${intVal}` : `${intVal}`;
      return {
        long: `Chapter ${padded}`,
        short: `Ch ${padded}`,
      };
    }
    return { long: `Chapter ${raw}`, short: `Ch ${raw}` };
  }
}

function resolveEnglishTitle(subjectKey: SubjectKey, chapterNum: number | string, chapterTitleBn: string, chapterTitleEn?: string): string {
  if (chapterTitleEn && chapterTitleEn.trim()) {
    return chapterTitleEn.trim();
  }
  // Try lookup in registry
  const numKey = typeof chapterNum === 'number' ? chapterNum : parseInt(String(chapterNum).replace(/\D/g, ''), 10);
  if (!isNaN(numKey) && CHAPTER_EN_TITLES[subjectKey]?.[numKey]) {
    return CHAPTER_EN_TITLES[subjectKey]![numKey]!;
  }
  // Extract parentheses if available (e.g. "গতি (Motion)" -> "Motion")
  const parenMatch = chapterTitleBn.match(/\(([^)]+)\)/);
  if (parenMatch && parenMatch[1] && /[A-Za-z]/.test(parenMatch[1])) {
    return parenMatch[1].trim();
  }
  return chapterTitleBn;
}

export function GuidebookHeaderNav({
  subjectKey,
  subjectNameBn,
  subjectNameEn,
  subjectIcon,
  chapterNum,
  chapterTitleBn,
  chapterTitleEn,
  activeLesson,
  activeLessonTitle,
  activeStepLabel,
  isSidebarOpen,
  onToggleSidebar,
  sidebarToggleLabelOpen,
  sidebarToggleLabelClosed,
  onOpenAi,
  aiButtonLabel,
  libraryHref = '/dashboard/playground/v2',
  libraryButtonLabel,
  rightExtras,
  centerContent,
  className = '',
}: GuidebookHeaderNavProps) {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const theme = THEME_CONFIG[subjectKey] || THEME_CONFIG.physics;
  const chapterBadges = formatChapterBadge(chapterNum, isBn);
  const displaySubjectName = isBn
    ? (subjectNameBn || theme.defaultNameBn)
    : (subjectNameEn || theme.defaultNameEn);

  const displayChapterTitle = isBn
    ? chapterTitleBn
    : resolveEnglishTitle(subjectKey, chapterNum, chapterTitleBn, chapterTitleEn);

  const backLabelDesktop = isBn
    ? (libraryButtonLabel || 'লাইব্রেরিতে ফিরুন')
    : (libraryButtonLabel && !/[\u0980-\u09FF]/.test(libraryButtonLabel) ? libraryButtonLabel : 'Back to Library');

  const backLabelMobile = isBn
    ? (libraryButtonLabel ? 'ফিরুন' : 'লাইব্রেরি')
    : (libraryButtonLabel && !/[\u0980-\u09FF]/.test(libraryButtonLabel) ? 'Back' : 'Library');

  const sidebarOpenLabel = isBn
    ? (sidebarToggleLabelOpen || 'পাঠ তালিকা লুকান')
    : (sidebarToggleLabelOpen && !/[\u0980-\u09FF]/.test(sidebarToggleLabelOpen) ? sidebarToggleLabelOpen : 'Hide Lessons');

  const sidebarClosedLabel = isBn
    ? (sidebarToggleLabelClosed || 'পাঠ তালিকা দেখুন')
    : (sidebarToggleLabelClosed && !/[\u0980-\u09FF]/.test(sidebarToggleLabelClosed) ? sidebarToggleLabelClosed : 'Show Lessons');

  const currentSidebarLabel = isSidebarOpen ? sidebarOpenLabel : sidebarClosedLabel;

  const aiLabel = isBn
    ? (aiButtonLabel || 'AI শিক্ষক')
    : (aiButtonLabel && !/[\u0980-\u09FF]/.test(aiButtonLabel) ? aiButtonLabel : 'AI Tutor');

  // Format lesson label
  let lessonNum = String(activeLesson ?? '');
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  if (isBn) {
    lessonNum = lessonNum.replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
  } else {
    lessonNum = lessonNum.replace(/[০-৯]/g, (d) => String(bnDigits.indexOf(d)));
  }
  const lessonLabel = isBn ? `পাঠ ${lessonNum}` : `Lesson ${lessonNum}`;

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 shadow-2xs ${className}`}
    >
      {/* LEFT CLUSTER: Toggle Button + Back Button + Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 overflow-hidden">
        {/* Sidebar Toggle Button (if provided) */}
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs active:scale-95 shrink-0 ${
              isSidebarOpen
                ? 'bg-muted/70 border-border/80 text-foreground hover:bg-muted'
                : 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20'
            }`}
            title={currentSidebarLabel}
          >
            <Layers className="h-3.5 w-3.5 text-primary" />
            <span className="hidden sm:inline">
              {currentSidebarLabel}
            </span>
          </button>
        )}

        {/* Elevated Back to Library Pill Button */}
        <Link
          href={libraryHref as any}
          className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 bg-card hover:bg-muted/80 text-foreground text-xs font-bold transition-all shadow-2xs hover:shadow-xs hover:border-primary/40 active:scale-95 shrink-0"
          title={isBn ? 'গাইডবুক লাইব্রেরিতে ফিরুন' : 'Back to Guidebook Library'}
        >
          <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-transform group-hover:-translate-x-0.5" />
          <span className="hidden sm:inline">
            {backLabelDesktop}
          </span>
          <span className="sm:hidden inline">
            {backLabelMobile}
          </span>
        </Link>

        {/* DESKTOP BREADCRUMBS (md and up) */}
        <div className="hidden md:flex items-center gap-2 text-xs min-w-0 flex-1 overflow-hidden">
          {/* Subtle Separator */}
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />

          {/* Subject Badge */}
          <Link
            href={`${libraryHref}?subject=${subjectKey}` as any}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold text-xs transition-all hover:scale-105 shrink-0 ${theme.subjectBadge}`}
            title={isBn ? `${displaySubjectName} অধ্যায়সমূহ` : `${displaySubjectName} Chapters`}
          >
            <span>{subjectIcon || theme.icon}</span>
            <span>{displaySubjectName}</span>
          </Link>

          {/* Subtle Separator */}
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />

          {/* Chapter Focus Badge & Title */}
          <div className="flex items-center gap-2 min-w-0 shrink">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md border font-mono font-bold text-xs shrink-0 ${theme.chapterBadge}`}
            >
              {chapterBadges.long}
            </span>
            <span className="font-extrabold text-foreground text-sm tracking-tight truncate max-w-[220px] lg:max-w-[340px] xl:max-w-none">
              {displayChapterTitle}
            </span>
          </div>

          {/* Active Lesson Capsule (hidden on md, visible on lg/xl) */}
          {activeLesson !== undefined && activeLesson !== null && (
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/70 border border-border/80 text-foreground font-semibold text-xs shrink-0">
                <span className={`h-2 w-2 rounded-full ${theme.activeDot} animate-pulse`} />
                <span className="font-bold">{lessonLabel}</span>
                {activeLessonTitle && (
                  <span className="text-muted-foreground font-normal text-[11px] truncate max-w-[120px] xl:max-w-[180px]">
                    : {activeLessonTitle}
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Active Step Capsule (if activeStepLabel is given) */}
          {activeStepLabel && (
            <div className="hidden xl:flex items-center gap-2 shrink-0">
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/25 font-bold text-xs shrink-0">
                {activeStepLabel}
              </span>
            </div>
          )}
        </div>

        {/* MOBILE COMPACT BREADCRUMB (below md) */}
        <div className="flex md:hidden items-center gap-1.5 text-xs min-w-0 truncate max-w-[160px] xs:max-w-[220px] sm:max-w-[340px]">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-bold text-[11px] shrink-0 ${theme.subjectBadge}`}
          >
            <span>{subjectIcon || theme.icon}</span>
            <span>{chapterBadges.short}</span>
          </span>
          <span className="font-bold text-foreground truncate text-xs">
            {displayChapterTitle}
          </span>
        </div>
      </div>

      {/* OPTIONAL CENTER CONTENT (e.g. tabs or step buttons) */}
      {centerContent && (
        <div className="hidden lg:flex items-center justify-center flex-1 mx-2">
          {centerContent}
        </div>
      )}

      {/* RIGHT CLUSTER: AI Tutor Button + Version/Status Badge or Extras */}
      <div className="flex items-center gap-2 shrink-0">
        {onOpenAi && (
          <button
            type="button"
            onClick={onOpenAi}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary/15 to-primary/5 hover:from-primary/25 hover:to-primary/15 text-primary border border-primary/25 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-95"
            title={isBn ? 'SheraTutor AI শিক্ষক সহায়তা' : 'SheraTutor AI Tutor Support'}
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="hidden sm:inline">{aiLabel}</span>
          </button>
        )}

        {rightExtras ? (
          rightExtras
        ) : (
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isBn ? 'ভার্চুয়াল গাইডবুক' : 'Virtual Guidebook'}</span>
          </div>
        )}
      </div>
    </header>
  );
}

export default GuidebookHeaderNav;
