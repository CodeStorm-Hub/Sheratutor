'use client';

import React, { useState, useTransition } from 'react';
import { Check, ChevronRight, Sparkles } from 'lucide-react';
import { Tag } from '@/components/Tag';
import { PageHeader } from '@/components/PageHeader';
import { generateStudyPlan, togglePlanTask } from '@/app/actions/study-plan';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  checked: boolean;
}

interface PlannerClientProps {
  planId?: string;
  currentDay?: number;
  initialTasks?: Task[];
  recommendationTitle?: string;
  recommendationBody?: string;
  masteryPercent?: number;
}

export function PlannerPageClient({
  planId,
  currentDay = 1,
  initialTasks = [],
  recommendationTitle = 'Sharpen your trigonometry',
  recommendationBody = 'Most recent mistakes are step-based errors.',
  masteryPercent = 72,
}: PlannerClientProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isPending, startTransition] = useTransition();
  const { language, t } = useLanguage();

  const days =
    language === 'bn'
      ? ['সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি', 'রবি']
      : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const handleToggleTask = (index: number) => {
    const task = tasks[index];
    const newChecked = !task.checked;

    setTasks((prev) => prev.map((tk, i) => (i === index ? { ...tk, checked: newChecked } : tk)));

    if (planId) {
      startTransition(async () => {
        const res = await togglePlanTask(planId, currentDay, task.id, newChecked);
        if (res.error) {
          setTasks((prev) => prev.map((tk, i) => (i === index ? { ...tk, checked: !newChecked } : tk)));
          console.error('Failed to toggle task:', res.error);
        }
      });
    }
  };

  const streakCount = 7;

  return (
    <>
      <PageHeader title={t('planner.title')} description={t('planner.desc')}>
        <form action={generateStudyPlan}>
          <button
            type="submit"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-cta px-4 py-2.5 text-xs font-semibold text-cta-foreground shadow-xs transition-colors hover:opacity-90"
          >
            <Sparkles size={16} /> {t('planner.generate_new')}
          </button>
        </form>
      </PageHeader>

      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔥</span>
          <div>
            <b className="block font-heading text-[15px] font-bold">
              {language === 'bn' ? `${streakCount} দিনের স্ট্রিক` : `${streakCount} day streak`}
            </b>
            <p className="text-xs text-muted-foreground">{t('planner.streak_desc')}</p>
          </div>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {days.map((d, i) => (
            <span
              key={`day-${i}`}
              className={cn(
                'grid h-11 w-[38px] flex-none place-items-center rounded-lg font-mono text-[10px]',
                i === 3
                  ? 'bg-foreground text-cta-foreground'
                  : i < 3
                    ? 'bg-surface-2 text-green'
                    : 'text-muted-foreground',
              )}
            >
              <small>{d}</small>
              <b className="text-xs">{17 + i}</b>
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-border bg-surface-1 p-5">
          <h2 className="mb-3 font-heading text-xl font-bold">{t('planner.todays_plan')}</h2>
          {tasks.map((task, i) => (
            <div key={task.id} className="flex items-center gap-3 border-b border-border py-3 last:border-0">
              <button
                type="button"
                onClick={() => handleToggleTask(i)}
                disabled={isPending}
                aria-label={`Mark ${task.title} as ${task.checked ? t('common.incomplete') : t('common.complete')}`}
                className={cn(
                  'grid size-[26px] flex-none place-items-center rounded-md border transition-colors',
                  task.checked
                    ? 'border-accent2 bg-accent2 text-white'
                    : 'border-muted-foreground bg-surface-1',
                )}
              >
                {task.checked && <Check size={15} />}
              </button>
              <div className="min-w-0 flex-1">
                <b className="block text-xs font-semibold">{task.title}</b>
                <small className="text-xs text-muted-foreground">{task.subtitle}</small>
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">{task.time}</span>
            </div>
          ))}
        </section>

        <aside className="rounded-2xl border border-border bg-ochre-soft p-5">
          <Tag color="coral">{t('planner.recommendation_badge')}</Tag>
          <h3 className="mt-3.5 mb-2 font-heading text-xl leading-tight font-bold">{recommendationTitle}</h3>
          <p className="text-xs leading-relaxed text-muted-foreground">{recommendationBody}</p>
          <button type="button" className="mt-1.5 flex items-center gap-1 py-1.5 text-xs font-semibold text-heading hover:text-cta">
            {language === 'bn' ? 'প্রস্তাবিত প্ল্যান দেখুন' : 'See recommended plan'}
            <ChevronRight size={15} />
          </button>
          <div className="mt-6 border-t border-border pt-3.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t('planner.subject_mastery')}</span>
              <b className="font-mono text-[11px] text-foreground">{masteryPercent}%</b>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded bg-surface-2">
              <span className="block h-full rounded bg-accent2" style={{ width: `${masteryPercent}%` }} />
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
