'use client';

import React, { useState, useTransition } from 'react';
import { Check, ChevronRight, Sparkles } from 'lucide-react';
import { Tag } from '@/components/Tag';
import { PageHeader } from '@/components/PageHeader';
import { generateStudyPlan, togglePlanTask } from '@/app/actions/study-plan';
import { useLanguage } from '@/context/LanguageContext';

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

  const days = language === 'bn' ? ['সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি', 'রবি'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const handleToggleTask = (index: number) => {
    const task = tasks[index];
    const newChecked = !task.checked;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t, i) => (i === index ? { ...t, checked: newChecked } : t))
    );

    if (planId) {
      startTransition(async () => {
        const res = await togglePlanTask(planId, currentDay, task.id, newChecked);
        if (res.error) {
          // Revert on error
          setTasks((prev) =>
            prev.map((t, i) => (i === index ? { ...t, checked: !newChecked } : t))
          );
          console.error('Failed to toggle task:', res.error);
        }
      });
    }
  };

  const streakCount = 7; // In a real app, calculate this dynamically based on completed tasks across days.

  return (
    <>
      <PageHeader
        title={t('planner.title')}
        description={t('planner.desc')}
      >
        <form action={generateStudyPlan}>
          <button type="submit" className="primary-btn">
            <Sparkles size={16} /> {t('planner.generate_new')}
          </button>
        </form>
      </PageHeader>

      <div className="planner-top">
        <div className="streak">
          <span>🔥</span>
          <div>
            <b>{language === 'bn' ? `${streakCount} দিনের স্ট্রিক` : `${streakCount} day streak`}</b>
            <p>{t('planner.streak_desc')}</p>
          </div>
        </div>
        <div className="calendar-strip">
          {days.map((d, i) => (
            <span
              className={i === 3 ? 'today' : i < 3 ? 'done' : ''}
              key={`day-${i}`}
            >
              <small>{d}</small>
              <b>{17 + i}</b>
            </span>
          ))}
        </div>
      </div>

      <div className="planner-grid">
        <section className="planner-tasks">
          <h2>{t('planner.todays_plan')}</h2>
          {tasks.map((task, i) => (
            <div className="plan-task" key={task.id}>
              <button
                type="button"
                className={task.checked ? 'checked' : ''}
                onClick={() => handleToggleTask(i)}
                disabled={isPending}
                aria-label={`Mark ${task.title} as ${
                  task.checked ? t('common.incomplete') : t('common.complete')
                }`}
              >
                {task.checked && <Check size={15} />}
              </button>
              <div>
                <b>{task.title}</b>
                <small>{task.subtitle}</small>
              </div>
              <span>{task.time}</span>
            </div>
          ))}
        </section>

        <aside className="recommendation">
          <Tag color="coral">{t('planner.recommendation_badge')}</Tag>
          <h3>{recommendationTitle}</h3>
          <p>{recommendationBody}</p>
          <button type="button">
            {language === 'bn' ? 'প্রস্তাবিত প্ল্যান দেখুন' : 'See recommended plan'}{' '}
            <ChevronRight size={15} />
          </button>
          <div className="mastery">
            <span>{t('planner.subject_mastery')}</span>
            <b>{masteryPercent}%</b>
            <i>
              <em style={{ width: `${masteryPercent}%` }} />
            </i>
          </div>
        </aside>
      </div>
    </>
  );
}
