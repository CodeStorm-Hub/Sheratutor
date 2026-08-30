'use client';

import React from 'react';
import Link from 'next/link';
import { ScoreRing } from '@/components/ScoreRing';
import { BarChart } from '@/components/BarChart';
import {
  ChevronRight,
  ChevronDown,
  FileCheck2,
  MoreHorizontal,
  Play,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

export interface DashboardClientProps {
  firstName: string;
  totalCompleted: number;
  gradeLetter: string;
  avgScorePct: number | null;
  percentileRank: number;
  momentumScore: number;
  targetExamYear: number;
  targetExamBoard: string;
  examType: string;
  displaySubjects: Array<{
    id: string;
    name_en: string;
    name_bn: string;
    code: string;
    progress: number;
    chapterCount: number;
  }>;
  todayTasks: Array<{ title: string; subtitle: string; time: string; checked: boolean }>;
  hasActivePlan: boolean;
  submissionsCount: number;
  hasSubmissions: boolean;
}

const cardClass = 'rounded-2xl border border-border bg-surface-1 p-5';
const cardLabelClass = 'font-mono text-[10px] font-bold tracking-[0.08em] text-muted-foreground uppercase';
const iconBtnClass =
  'grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground';
const panelFooterLinkClass = 'flex items-center gap-1 pt-3 text-[13px] font-semibold hover:text-cta';

const subjectIconColor: Record<string, string> = {
  mint: 'bg-green-soft text-green',
  coral: 'bg-coral-soft text-cta',
  sun: 'bg-ochre-soft text-ochre',
};

export function DashboardPageClient({
  firstName,
  totalCompleted,
  gradeLetter,
  avgScorePct,
  percentileRank,
  momentumScore,
  targetExamYear,
  targetExamBoard,
  examType,
  displaySubjects,
  todayTasks,
  hasActivePlan,
  submissionsCount,
  hasSubmissions,
}: DashboardClientProps) {
  const { language, t } = useLanguage();

  return (
    <div className="space-y-7">
      {/* Welcome & action banner */}
      <section className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-[clamp(1.75rem,4vw,2.25rem)] leading-tight font-extrabold">
            {t('dashboard.greeting')} {firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalCompleted > 0
              ? `${language === 'bn' ? 'তোমার' : 'You have'} ${totalCompleted} ${t('dashboard.welcome_active')}`
              : t('dashboard.welcome_new')}
          </p>
        </div>
        <Link
          href="/dashboard/practice"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-cta px-4 py-2.5 text-xs font-semibold text-cta-foreground shadow-xs transition-colors hover:opacity-90"
        >
          <Play size={16} fill="currentColor" />
          <span>{t('dashboard.focus_btn')}</span>
        </Link>
      </section>

      {/* Overview stat grid */}
      <section className="grid gap-4 lg:grid-cols-[1.28fr_0.9fr_0.9fr]">
        {/* Board prediction */}
        <article
          className={cn(cardClass, 'flex min-h-[186px] flex-col')}
          style={{
            backgroundImage: 'linear-gradient(120deg, var(--surface-1) 69%, var(--red-wash))',
          }}
        >
          <header className="flex items-start justify-between gap-2">
            <div>
              <span className={cardLabelClass}>{t('dashboard.prediction_title')}</span>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {totalCompleted > 0
                  ? `${t('dashboard.prediction_desc')} (${totalCompleted})`
                  : t('dashboard.prediction_new')}
              </p>
            </div>
            <button type="button" className={iconBtnClass} aria-label="Prediction options">
              <MoreHorizontal size={17} />
            </button>
          </header>

          <div className="mt-auto flex items-center gap-4 pt-4">
            <div className="flex items-baseline gap-2 font-heading text-[56px] leading-none font-extrabold tracking-tighter">
              {gradeLetter}
              <span className="text-xl font-semibold">{avgScorePct !== null ? `(${avgScorePct}%)` : 'N/A'}</span>
            </div>
            <div className="w-[131px] shrink-0 rounded-lg border border-border bg-surface-1 px-2.5 pt-2.5 pb-1.5">
              <label className="block text-[10px] leading-tight text-muted-foreground">
                {totalCompleted > 0
                  ? `${t('dashboard.percentile_top')} ${percentileRank}% ${t('dashboard.percentile_board')}`
                  : t('dashboard.percentile_ready')}
              </label>
              <div className="mt-2 h-1 overflow-hidden rounded bg-surface-2">
                <span
                  className="block h-full rounded bg-cta"
                  style={{
                    width: `${totalCompleted > 0 ? Math.max(15, 100 - percentileRank) : 20}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
            <span>
              {totalCompleted > 0
                ? t('dashboard.prediction_footer_rubric')
                : t('dashboard.prediction_footer_ready')}
            </span>
            <Link href="/dashboard/submissions" className="flex items-center gap-1 font-semibold hover:text-cta">
              {t('dashboard.view_results')} <ChevronRight size={14} />
            </Link>
          </div>
        </article>

        {/* Exam readiness */}
        <article className={cn(cardClass, 'flex min-h-[186px] flex-col')}>
          <header className="flex items-start justify-between gap-2">
            <div>
              <span className={cardLabelClass}>{t('dashboard.readiness_title')}</span>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {momentumScore > 0 ? t('dashboard.readiness_track') : t('dashboard.readiness_building')}
              </p>
            </div>
            <button type="button" className={iconBtnClass} aria-label="Readiness options">
              <MoreHorizontal size={17} />
            </button>
          </header>
          <div className="flex flex-1 items-center justify-center gap-4">
            <ScoreRing value={momentumScore} />
            <p className="max-w-[120px] text-xs text-muted-foreground">
              {momentumScore > 0 ? t('dashboard.readiness_mastery') : t('dashboard.readiness_calc')}
            </p>
          </div>
        </article>

        {/* Target exam */}
        <article className={cn(cardClass, 'flex min-h-[186px] flex-col')}>
          <header className="flex items-start justify-between gap-2">
            <div>
              <span className={cardLabelClass}>{t('dashboard.target_exam_title')}</span>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {targetExamYear} {t('dashboard.target_batch')}
              </p>
            </div>
            <button type="button" className={iconBtnClass} aria-label="Exam details">
              <MoreHorizontal size={17} />
            </button>
          </header>
          <div className="mt-auto">
            <b className="text-sm">
              {examType} · {targetExamBoard}
            </b>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>{language === 'bn' ? 'বোর্ড পরীক্ষা' : 'Board Exam'}</span>
              <span className="font-mono font-semibold text-foreground">{targetExamYear}</span>
            </div>
          </div>
        </article>
      </section>

      {/* Curriculum subjects */}
      <section className="flex items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl leading-tight font-bold">{t('dashboard.subjects_title')}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t('dashboard.subjects_desc')}</p>
        </div>
        <Link href="/dashboard/tutor" className="flex shrink-0 items-center gap-1 text-xs font-semibold text-green hover:underline">
          {t('dashboard.ask_tutor')} <ChevronRight size={15} />
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {displaySubjects.map((sub, idx) => {
          const color = ['mint', 'coral', 'sun', 'mint'][idx % 4];
          const displayName = language === 'bn' ? sub.name_bn || sub.name_en : sub.name_en;
          const subTitle = language === 'bn' ? sub.name_en : sub.name_bn || sub.code;

          return (
            <Link key={sub.id} href="/dashboard/practice">
              <article
                className={cn(
                  cardClass,
                  'flex min-h-[183px] flex-col justify-between transition-colors hover:border-cta/40',
                )}
              >
                <div className={cn('grid size-9 place-items-center rounded-lg', subjectIconColor[color])}>
                  <Sparkles size={20} />
                </div>
                <div className="mt-3">
                  <h3 className="font-heading font-bold">{displayName}</h3>
                  <small className="text-xs text-muted-foreground">{subTitle}</small>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="h-1.5 flex-1 overflow-hidden rounded bg-border">
                    <span className="block h-full rounded bg-accent2" style={{ width: `${sub.progress}%` }} />
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span>{sub.progress}% {language === 'bn' ? 'দক্ষতা' : 'mastery'}</span>
                  <span>·</span>
                  <span>{sub.chapterCount} {language === 'bn' ? 'টি অধ্যায়' : 'chapters'}</span>
                </div>
              </article>
            </Link>
          );
        })}
      </section>

      {/* Lower dual grid */}
      <section className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
        {/* Today's focus checklist */}
        <article className={cardClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-heading text-xl leading-tight font-bold">{t('dashboard.todays_focus_title')}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {hasActivePlan ? t('dashboard.todays_focus_adaptive') : t('dashboard.todays_focus_custom')}
              </p>
            </div>
            <Link
              href="/dashboard/study-plan"
              className="flex shrink-0 items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:bg-accent"
            >
              {todayTasks.length} {t('dashboard.tasks_count')} <ChevronDown size={14} />
            </Link>
          </div>

          <div className="mt-4">
            {todayTasks.map((tItem, i) => (
              <div key={`${tItem.title}-${i}`} className="flex items-center gap-2.5 border-b border-border py-2.5 last:border-0">
                <span
                  className={cn(
                    'grid size-[26px] flex-none place-items-center rounded-md border text-xs',
                    tItem.checked
                      ? 'border-accent2 bg-accent2 text-white'
                      : 'border-muted-foreground text-muted-foreground',
                  )}
                >
                  {tItem.checked ? '✓' : ''}
                </span>
                <div className="min-w-0 flex-1">
                  <b className="block text-xs font-semibold">{tItem.title}</b>
                  <small className="text-xs text-muted-foreground">{tItem.subtitle}</small>
                </div>
                <time className="font-mono text-[10px] text-muted-foreground">{tItem.time}</time>
                <button type="button" aria-label="More task options" className="text-muted-foreground">
                  <ChevronRight size={15} />
                </button>
              </div>
            ))}
          </div>

          <Link href="/dashboard/study-plan" className={panelFooterLinkClass}>
            {t('dashboard.view_full_plan')} <ChevronRight size={14} />
          </Link>
        </article>

        {/* Assessment tracker */}
        <article className={cardClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-heading text-xl leading-tight font-bold">{t('dashboard.activity_title')}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {hasSubmissions
                  ? `${submissionsCount} ${t('dashboard.activity_desc')}`
                  : t('dashboard.activity_empty')}
              </p>
            </div>
            <Link
              href="/dashboard/upload"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-cta px-3 py-1.5 text-xs font-semibold text-cta-foreground transition-colors hover:opacity-90"
            >
              <FileCheck2 size={14} /> {language === 'bn' ? 'খাতা জমা' : 'Upload'}
            </Link>
          </div>

          <BarChart data={hasSubmissions ? undefined : [0, 0, 0, 0, 0, 0, 0]} />

          <div className="mt-4 grid grid-cols-3 gap-3 font-tabular">
            {[
              {
                label: t('dashboard.tests_submitted'),
                value: `${submissionsCount}${language === 'bn' ? 'টি' : ''}`,
                sub: t('dashboard.this_term'),
              },
              {
                label: t('dashboard.avg_score'),
                value: avgScorePct !== null ? `${avgScorePct}%` : '—',
                sub:
                  totalCompleted > 0
                    ? `${totalCompleted}${language === 'bn' ? 'টি মূল্যায়ন' : ' tests'}`
                    : t('dashboard.new_student'),
              },
              {
                label: t('dashboard.momentum_label'),
                value: `${momentumScore}%`,
                sub: language === 'bn' ? 'সক্রিয়' : 'Active',
              },
            ].map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <strong className="text-xl">{s.value}</strong>
                <small className="text-xs text-muted-foreground">{s.sub}</small>
              </div>
            ))}
          </div>

          <Link href="/dashboard/submissions" className={panelFooterLinkClass}>
            {t('dashboard.view_all_results')}
          </Link>
        </article>
      </section>
    </div>
  );
}
