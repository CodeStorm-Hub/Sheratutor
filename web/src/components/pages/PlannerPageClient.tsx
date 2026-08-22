'use client';

import React, { useState } from 'react';
import { Check, ChevronRight, Sparkles } from 'lucide-react';
import { Tag } from '@/components/Tag';
import { PageHeader } from '@/components/PageHeader';
import { generateStudyPlan } from '@/app/actions/study-plan';

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

interface Task {
  title: string;
  subtitle: string;
  time: string;
  checked: boolean;
}

interface PlannerClientProps {
  initialTasks?: Task[];
  recommendationTitle?: string;
  recommendationBody?: string;
  masteryPercent?: number;
}

export function PlannerPageClient({
  initialTasks = [
    {
      title: 'Physics MCQ practice',
      subtitle: '25 min · Work & Energy',
      time: '09:30',
      checked: true,
    },
    {
      title: 'Math: Chapter 8 review',
      subtitle: '35 min · Trigonometry',
      time: '11:00',
      checked: true,
    },
    {
      title: 'Chemistry revision',
      subtitle: '20 min · Periodic table',
      time: '16:30',
      checked: false,
    },
    {
      title: 'English writing drill',
      subtitle: '15 min · Formal letters',
      time: '19:00',
      checked: false,
    },
  ],
  recommendationTitle = 'Sharpen your trigonometry',
  recommendationBody = 'Most recent mistakes are step-based errors. A focused 30-minute review will help you recover marks.',
  masteryPercent = 72,
}: PlannerClientProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const toggleTask = (index: number) => {
    setTasks((prev) =>
      prev.map((task, i) =>
        i === index ? { ...task, checked: !task.checked } : task
      )
    );
  };

  return (
    <>
      <PageHeader
        title="Study planner"
        description="A simple plan, shaped around your exam goals."
      >
        <form action={generateStudyPlan}>
          <button type="submit" className="primary-btn">
            <Sparkles size={16} /> Generate new plan
          </button>
        </form>
      </PageHeader>

      <div className="planner-top">
        <div className="streak">
          <span>🔥</span>
          <div>
            <b>7 day streak</b>
            <p>Your longest streak is 12 days — keep it up.</p>
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
          <h2>Today&apos;s Plan</h2>
          {tasks.map((task, i) => (
            <div className="plan-task" key={task.title}>
              <button
                type="button"
                className={task.checked ? 'checked' : ''}
                onClick={() => toggleTask(i)}
                aria-label={`Mark ${task.title} as ${
                  task.checked ? 'incomplete' : 'complete'
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
          <Tag color="coral">AI RECOMMENDATION</Tag>
          <h3>{recommendationTitle}</h3>
          <p>{recommendationBody}</p>
          <button type="button">
            See recommended plan <ChevronRight size={15} />
          </button>
          <div className="mastery">
            <span>Subject mastery</span>
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
