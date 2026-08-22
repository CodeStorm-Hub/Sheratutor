import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
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

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Fetch real student & user profile
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user?.id ?? '')
    .maybeSingle();

  const { data: studentProfile } = await supabase
    .from('student_profiles')
    .select('id, exam_type, academic_group, education_board, target_exam_year, overall_momentum_score')
    .eq('user_id', user?.id ?? '')
    .maybeSingle();

  // 2. Fetch real student submissions
  const { data: submissions } = await supabase
    .from('exam_submissions')
    .select('*, question_papers(title, total_marks, subjects(name_en))')
    .eq('student_id', studentProfile?.id ?? '')
    .order('submitted_at', { ascending: false });

  // 3. Fetch real curriculum subjects for student's level
  const { data: dbSubjects } = await supabase
    .from('subjects')
    .select('id, name_en, name_bn, code, level, subject_group')
    .order('name_en');

  // 4. Fetch real weakness logs to compute per-subject mastery
  const { data: weaknesses } = await supabase
    .from('weakness_logs')
    .select('*, chapters(title_en, subjects(id, name_en))')
    .eq('student_id', studentProfile?.id ?? '');

  // 5. Fetch real active study plan
  const { data: activePlan } = await supabase
    .from('study_plans')
    .select('daily_schedule_json, start_date, end_date')
    .eq('student_id', studentProfile?.id ?? '')
    .eq('is_active', true)
    .maybeSingle();

  // First name
  const fullName =
    userProfile?.full_name ||
    (user?.user_metadata?.full_name as string) ||
    (user?.email ? user.email.split('@')[0] : 'Student');
  const firstName = fullName.split(' ')[0] || 'Student';

  // Calculate real metrics from completed submissions
  const completedSubs = (submissions || []).filter((s) => s.status === 'COMPLETED');
  const totalCompleted = completedSubs.length;

  let totalObtained = 0;
  let totalPossible = 0;
  completedSubs.forEach((s) => {
    totalObtained += Number(s.total_score_obtained || 0);
    totalPossible += Number(s.max_possible_score || 10);
  });

  const avgScorePct =
    totalPossible > 0 ? Math.round((totalObtained / totalPossible) * 100) : null;

  // Grade Letter calculation
  let gradeLetter = '—';
  let gradeLabel = 'Complete an exam to see prediction';
  if (avgScorePct !== null) {
    if (avgScorePct >= 80) gradeLetter = 'A+';
    else if (avgScorePct >= 70) gradeLetter = 'A';
    else if (avgScorePct >= 60) gradeLetter = 'A-';
    else if (avgScorePct >= 50) gradeLetter = 'B';
    else if (avgScorePct >= 40) gradeLetter = 'C';
    else gradeLetter = 'F';

    gradeLabel = `Based on your ${totalCompleted} assessment${
      totalCompleted === 1 ? '' : 's'
    }`;
  }

  // Momentum / Readiness Score
  const momentumScore = studentProfile?.overall_momentum_score
    ? Math.round(Number(studentProfile.overall_momentum_score))
    : avgScorePct !== null
    ? avgScorePct
    : 0;

  // Format today's date
  const todayFormatted = new Date()
    .toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
    .toUpperCase();

  // Build real subject progress cards
  const colorMap = ['mint', 'sun', 'coral', 'lilac'] as const;
  const iconMap: Record<string, string> = {
    Physics: '⌁',
    Chemistry: '⚗',
    Mathematics: '∿',
    English: 'Aa',
  };

  const displaySubjects = (dbSubjects && dbSubjects.length > 0 ? dbSubjects : []).map(
    (subj, idx) => {
      // Check if student has weakness or scores for this subject
      const subjectWeakness = (weaknesses || []).filter(
        (w) => w.chapters?.subjects?.id === subj.id
      );
      const avgWeakness =
        subjectWeakness.length > 0
          ? subjectWeakness.reduce((acc, curr) => acc + Number(curr.weakness_score), 0) /
            subjectWeakness.length
          : 0.2;

      const progressVal = Math.max(10, Math.min(100, Math.round((1 - avgWeakness) * 100)));

      return {
        subject: subj.name_en,
        chapter: subj.name_bn || 'Core Curriculum',
        value: progressVal,
        color: colorMap[idx % colorMap.length],
        icon: iconMap[subj.name_en] || '✦',
        lesson: `${subj.level} · ${subj.subject_group || 'General'}`,
      };
    }
  );

  // Extract today's tasks from real active study plan if available
  type PlanDay = { day: number; chapters: Array<{ title: string; subject: string; weaknessScore?: number }> };
  const scheduleJson = activePlan?.daily_schedule_json as { days?: PlanDay[] } | null;
  const day1Chapters = scheduleJson?.days?.[0]?.chapters || [];

  const realTasks =
    day1Chapters.length > 0
      ? day1Chapters.slice(0, 4).map((ch, i) => ({
          id: `task-${i}`,
          title: `${ch.subject}: ${ch.title}`,
          subtitle: `Focused revision · ${studentProfile?.education_board || 'Dhaka'} standard`,
          time: `${20 + i * 10} min`,
          complete: i === 0 && totalCompleted > 0,
        }))
      : [
          {
            id: 'task-0',
            title: 'Physics: Motion & Force Review',
            subtitle: '20 questions · NCTB standard',
            time: '25 min',
            complete: totalCompleted > 0,
          },
          {
            id: 'task-1',
            title: 'Chemistry: Structure of Matter',
            subtitle: 'Concept review & chemical equations',
            time: '30 min',
            complete: false,
          },
          {
            id: 'task-2',
            title: 'Math: Problem Solving Practice',
            subtitle: 'Formulas & step-by-step solutions',
            time: '35 min',
            complete: false,
          },
          {
            id: 'task-3',
            title: 'English: Sentence Structure Drill',
            subtitle: 'Grammar & written exercises',
            time: '15 min',
            complete: false,
          },
        ];

  // Target exam details
  const targetYear = studentProfile?.target_exam_year || 2026;
  const examLevel = studentProfile?.exam_type || 'HSC';

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
          <p>
            {totalCompleted > 0
              ? `You have completed ${totalCompleted} evaluated assessment${
                  totalCompleted === 1 ? '' : 's'
                }. Keep your momentum going!`
              : 'Welcome to your board exam prep workspace. Take your first practice test!'}
          </p>
        </div>
        <Link
          href="/dashboard/practice"
          className="focus-button"
          style={{ textDecoration: 'none' }}
        >
          <span className="focus-icon">
            <Play size={16} fill="currentColor" />
          </span>
          Start focus session
        </Link>
      </section>

      {/* Stats row */}
      <section className="stat-grid">
        {/* Prediction Card */}
        <article className="prediction">
          <div className="stat-top">
            <span className="tag coral">BOARD PREDICTION</span>
            <MoreHorizontal size={20} />
          </div>
          <div className="prediction-main">
            <div>
              <div className="big-grade">{gradeLetter}</div>
              <p>{gradeLabel}</p>
            </div>
            <div className="percentile">
              <b>{avgScorePct !== null ? `${avgScorePct}% Avg` : 'Ready'}</b>
              <span>
                {totalCompleted > 0
                  ? `in ${studentProfile?.education_board || 'Dhaka'} Board`
                  : 'Start 1st assessment'}
              </span>
              <div className="tiny-bars">
                <i className={momentumScore > 10 ? 'on' : ''} />
                <i className={momentumScore > 20 ? 'on' : ''} />
                <i className={momentumScore > 30 ? 'on' : ''} />
                <i className={momentumScore > 40 ? 'on' : ''} />
                <i className={momentumScore > 50 ? 'on' : ''} />
                <i className={momentumScore > 60 ? 'on' : ''} />
                <i className={momentumScore > 70 ? 'on' : ''} />
                <i className={momentumScore > 80 ? 'on' : ''} />
                <i className={momentumScore > 90 ? 'on' : ''} />
                <i className={momentumScore >= 95 ? 'on' : ''} />
              </div>
            </div>
          </div>
          <div className="prediction-footer">
            <span>
              <Sparkles size={15} />{' '}
              {totalCompleted > 0
                ? 'Evaluated via official board rubrics'
                : 'AI-evaluated feedback ready'}
            </span>
            <Link href="/dashboard/submissions">
              View results <ChevronRight size={15} />
            </Link>
          </div>
        </article>

        {/* Readiness Card */}
        <article className="readiness">
          <div className="stat-top">
            <span className="tag mint">EXAM READINESS</span>
            <MoreHorizontal size={20} />
          </div>
          <div className="readiness-content">
            <ScoreRing value={momentumScore} />
            <div>
              <b>{momentumScore >= 70 ? "You're on track" : 'Building momentum'}</b>
              <p>
                {momentumScore > 0
                  ? `${momentumScore}% syllabus mastery`
                  : 'Take a test to calculate'}
              </p>
              <div className="mini-progress">
                <i style={{ width: `${Math.max(5, momentumScore)}%` }} />
              </div>
            </div>
          </div>
        </article>

        {/* Next Exam Card */}
        <article className="next-exam">
          <div className="stat-top">
            <span className="tag sun">TARGET EXAM</span>
            <MoreHorizontal size={20} />
          </div>
          <div className="exam-info">
            <div className="physics-icon">ϟ</div>
            <div>
              <b>{examLevel} Examination</b>
              <p>{studentProfile?.education_board || 'Dhaka'} Board · {targetYear}</p>
            </div>
          </div>
          <div className="exam-date">
            <strong>{targetYear}</strong>
            <span>
              Batch
              <br />
              Target
            </span>
            <Link href="/dashboard/practice">
              <ChevronRight size={19} />
            </Link>
          </div>
        </article>
      </section>

      {/* Continue Learning Subjects */}
      <section className="section-heading">
        <div>
          <h2>Curriculum subjects</h2>
          <p>Practice board standard questions and chapters.</p>
        </div>
        <Link href="/dashboard/tutor">
          Ask AI Tutor <ChevronRight size={16} />
        </Link>
      </section>

      <section className="subjects">
        {displaySubjects.map((s) => (
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

      {/* Lower grid: Today's focus & Weekly progress */}
      <section className="lower-grid">
        <article className="focus-panel">
          <div className="panel-header">
            <div>
              <h2>Today&apos;s focus</h2>
              <p>
                {activePlan
                  ? 'AI-curated adaptive study schedule.'
                  : 'Personalized revision plan for your syllabus.'}
              </p>
            </div>
            <Link href="/dashboard/study-plan" style={{ color: 'inherit' }}>
              <button
                type="button"
                className="icon-button"
                aria-label="View study plan"
              >
                <MoreHorizontal size={19} />
              </button>
            </Link>
          </div>

          <div className="task-list">
            {realTasks.map((t, idx) => (
              <div
                className={`task ${t.complete ? 'complete' : ''}`}
                key={t.id}
              >
                <span>
                  {t.complete ? (
                    <FileCheck2 size={16} />
                  ) : (
                    idx + 1
                  )}
                </span>
                <div>
                  <b>{t.title}</b>
                  <small>{t.subtitle}</small>
                </div>
                <time>{t.time}</time>
                <Link href="/dashboard/practice">
                  <button type="button" aria-label="Open task">
                    <ChevronRight size={17} />
                  </button>
                </Link>
              </div>
            ))}
          </div>

          <Link
            href="/dashboard/study-plan"
            style={{ textDecoration: 'none' }}
          >
            <button type="button" className="continue">
              <Play size={15} fill="currentColor" /> Go to full study planner{' '}
              <span>{realTasks.length} tasks</span>
            </button>
          </Link>
        </article>

        <article className="progress-panel">
          <div className="panel-header">
            <div>
              <h2>Assessment activity</h2>
              <p>
                {totalCompleted > 0
                  ? `${totalCompleted} tests evaluated by AI examiner.`
                  : 'Upload your first answer sheet to track score history.'}
              </p>
            </div>
            <button type="button" className="week-select">
              This term <ChevronDown size={15} />
            </button>
          </div>

          <div className="chart-stat">
            <div>
              <strong>{totalCompleted}</strong>
              <span>tests submitted</span>
            </div>
            <div className="up">
              {totalCompleted > 0 ? `Avg ${avgScorePct ?? 0}%` : 'New student'}
            </div>
          </div>

          <BarChart />

          <div className="chart-footer">
            <span>
              <i /> Assessment momentum
            </span>
            <Link
              href="/dashboard/submissions"
              style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}
            >
              View all results &rarr;
            </Link>
          </div>
        </article>
      </section>
    </>
  );
}
