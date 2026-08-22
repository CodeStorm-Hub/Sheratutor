import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ScoreRing } from '@/components/ScoreRing';
import { BarChart } from '@/components/BarChart';
import { subjects as defaultSubjects } from '@/data/mockData';
import {
  BookOpen,
  ChevronRight,
  ChevronDown,
  FileCheck2,
  MoreHorizontal,
  Play,
  Sparkles,
} from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('user_id', user!.id)
    .maybeSingle();

  const { data: submissions } = await supabase
    .from('exam_submissions')
    .select('*')
    .eq('student_id', profile?.id ?? '')
    .order('submitted_at', { ascending: false })
    .limit(5);

  const firstName =
    (user?.user_metadata?.full_name as string)?.split(' ')[0] ||
    profile?.full_name?.split(' ')[0] ||
    'Anam';

  const readinessScore = profile?.overall_momentum_score
    ? Math.round(Number(profile.overall_momentum_score))
    : 82;

  const todayFormatted = new Date()
    .toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
    .toUpperCase();

  return (
    <>
      <section className="welcome">
        <div>
          <div className="eyebrow">
            <span /> {todayFormatted}
          </div>
          <h1>
            Good day, {firstName} <em>👋</em>
          </h1>
          <p>Your board-exam journey is looking stronger every day.</p>
        </div>
        <button type="button" className="focus-button">
          <span className="focus-icon">
            <Play size={16} fill="currentColor" />
          </span>
          Start focus session
        </button>
      </section>

      <section className="stat-grid">
        <article className="prediction">
          <div className="stat-top">
            <span className="tag coral">BOARD PREDICTION</span>
            <MoreHorizontal size={20} />
          </div>
          <div className="prediction-main">
            <div>
              <div className="big-grade">A-</div>
              <p>
                Based on your last {submissions?.length ? submissions.length : 14}{' '}
                assessments
              </p>
            </div>
            <div className="percentile">
              <b>Top 12%</b>
              <span>among HSC students</span>
              <div className="tiny-bars">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i className="on" />
                <i className="on" />
                <i className="on" />
                <i className="on" />
                <i className="on" />
                <i className="on" />
                <i className="on" />
              </div>
            </div>
          </div>
          <div className="prediction-footer">
            <span>
              <Sparkles size={15} /> Keep this momentum going
            </span>
            <Link href="/dashboard/submissions">
              View forecast <ChevronRight size={15} />
            </Link>
          </div>
        </article>

        <article className="readiness">
          <div className="stat-top">
            <span className="tag mint">EXAM READINESS</span>
            <MoreHorizontal size={20} />
          </div>
          <div className="readiness-content">
            <ScoreRing value={readinessScore} />
            <div>
              <b>You&apos;re on track</b>
              <p>+6% from last week</p>
              <div className="mini-progress">
                <i />
              </div>
            </div>
          </div>
        </article>

        <article className="next-exam">
          <div className="stat-top">
            <span className="tag sun">NEXT EXAM</span>
            <MoreHorizontal size={20} />
          </div>
          <div className="exam-info">
            <div className="physics-icon">ϟ</div>
            <div>
              <b>Physics</b>
              <p>1st Paper · Model Test</p>
            </div>
          </div>
          <div className="exam-date">
            <strong>12</strong>
            <span>
              days
              <br />
              remaining
            </span>
            <Link href="/dashboard/practice">
              <ChevronRight size={19} />
            </Link>
          </div>
        </article>
      </section>

      <section className="section-heading">
        <div>
          <h2>Continue learning</h2>
          <p>Pick up where you left off.</p>
        </div>
        <Link href="/dashboard/tutor">
          See all subjects <ChevronRight size={16} />
        </Link>
      </section>

      <section className="subjects">
        {defaultSubjects.map((s) => (
          <article className={`subject ${s.color}`} key={s.subject}>
            <div className="subject-top">
              <div className="subject-icon">{s.icon}</div>
              <button type="button" aria-label="More options">
                <MoreHorizontal size={18} />
              </button>
            </div>
            <h3>{s.subject}</h3>
            <p>{s.chapter}</p>
            <div className="subject-bottom">
              <div className="progress">
                <span>
                  <i style={{ width: `${s.value}%` }} />
                </span>
                <b>{s.value}%</b>
              </div>
              <small>{s.lesson}</small>
            </div>
          </article>
        ))}
      </section>

      <section className="lower-grid">
        <article className="focus-panel">
          <div className="panel-header">
            <div>
              <h2>Today&apos;s focus</h2>
              <p>AI-curated for your best score.</p>
            </div>
            <button
              type="button"
              className="icon-button"
              aria-label="Focus panel options"
            >
              <MoreHorizontal size={19} />
            </button>
          </div>
          <div className="task-list">
            <div className="task complete">
              <span>
                <FileCheck2 size={16} />
              </span>
              <div>
                <b>Physics MCQ practice</b>
                <small>20 questions · Work & Energy</small>
              </div>
              <time>25 min</time>
              <button type="button" aria-label="Open task">
                <ChevronRight size={17} />
              </button>
            </div>
            <div className="task complete">
              <span>
                <BookOpen size={16} />
              </span>
              <div>
                <b>Math: Chapter 8 review</b>
                <small>Trigonometric ratios</small>
              </div>
              <time>35 min</time>
              <button type="button" aria-label="Open task">
                <ChevronRight size={17} />
              </button>
            </div>
            <div className="task">
              <span>3</span>
              <div>
                <b>Chemistry revision</b>
                <small>Periodic table & bonding</small>
              </div>
              <time>20 min</time>
              <button type="button" aria-label="Open task">
                <ChevronRight size={17} />
              </button>
            </div>
            <div className="task">
              <span>4</span>
              <div>
                <b>English writing drill</b>
                <small>Formal letter practice</small>
              </div>
              <time>15 min</time>
              <button type="button" aria-label="Open task">
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
          <button
            type="button"
            className="continue"
          >
            <Play size={15} fill="currentColor" /> Continue today&apos;s plan{' '}
            <span>1h 35m left</span>
          </button>
        </article>

        <article className="progress-panel">
          <div className="panel-header">
            <div>
              <h2>Weekly progress</h2>
              <p>You&apos;re ahead of your usual pace.</p>
            </div>
            <button type="button" className="week-select">
              This week <ChevronDown size={15} />
            </button>
          </div>
          <div className="chart-stat">
            <div>
              <strong>11h 20m</strong>
              <span>study time</span>
            </div>
            <div className="up">↗ 18%</div>
          </div>
          <BarChart />
          <div className="chart-footer">
            <span>
              <i /> Study time
            </span>
            <b>Goal: 14h</b>
          </div>
        </article>
      </section>
    </>
  );
}
