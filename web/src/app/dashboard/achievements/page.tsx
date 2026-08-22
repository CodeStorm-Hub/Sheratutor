import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { Tag } from '@/components/Tag';
import { PageHeader } from '@/components/PageHeader';
import { ArrowUpRight } from 'lucide-react';

export default async function AchievementsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: studentProfile } = await supabase
    .from('student_profiles')
    .select('id, overall_momentum_score, education_board, exam_type')
    .eq('user_id', user?.id ?? '')
    .maybeSingle();

  // Fetch real submissions
  const { data: submissions } = await supabase
    .from('exam_submissions')
    .select('total_score_obtained, max_possible_score, status')
    .eq('student_id', studentProfile?.id ?? '');

  const completed = (submissions || []).filter((s) => s.status === 'COMPLETED');
  const count = completed.length;

  let totalScore = 0;
  let maxScore = 0;
  let hasHighScore = false;

  completed.forEach((s) => {
    const ob = Number(s.total_score_obtained || 0);
    const mx = Number(s.max_possible_score || 10);
    totalScore += ob;
    maxScore += mx;
    if (mx > 0 && ob / mx >= 0.8) {
      hasHighScore = true;
    }
  });

  const avgPct = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const momentum = studentProfile?.overall_momentum_score
    ? Math.round(Number(studentProfile.overall_momentum_score))
    : avgPct;

  // Calculate real XP & Level
  const earnedXp = count * 150 + Math.round(totalScore * 10);
  const currentLevel = Math.max(1, Math.floor(earnedXp / 300) + 1);
  const levelProgress = earnedXp % 300;
  const xpNeeded = 300 - levelProgress;
  const progressPct = Math.min(100, Math.round((levelProgress / 300) * 100));

  const badges = [
    {
      icon: '🔥',
      value: count > 0 ? `${count} Tests` : 'Ready',
      title: 'Practice Consistency',
      description:
        count > 0
          ? `Submitted ${count} exam answer scripts for AI evaluation.`
          : 'Complete your first practice test to unlock.',
      unlocked: count >= 1,
    },
    {
      icon: '⚡',
      value: avgPct > 0 ? `${avgPct}% Avg` : 'Pending',
      title: 'Accuracy Milestone',
      description: hasHighScore
        ? 'Scored 80%+ (A+) on an evaluated board-standard paper.'
        : 'Score 80%+ on any mock exam to unlock.',
      unlocked: hasHighScore,
    },
    {
      icon: '✦',
      value: `${earnedXp} XP`,
      title: 'XP Growth',
      description: `Earned ${earnedXp} total learning experience points.`,
      unlocked: earnedXp >= 100,
    },
    {
      icon: '✓',
      value: momentum >= 60 ? 'Ready' : 'In Progress',
      title: 'Board Exam Readiness',
      description:
        momentum >= 60
          ? `Achieved ${momentum}% readiness for ${studentProfile?.education_board || 'Dhaka'} Board.`
          : 'Reach 60%+ syllabus readiness to earn board ready badge.',
      unlocked: momentum >= 60,
    },
  ];

  return (
    <>
      <PageHeader
        title="Achievements"
        description="Milestones and progress on your path to board examination excellence."
      >
        <button type="button" className="primary-btn">
          Share achievements <ArrowUpRight size={15} />
        </button>
      </PageHeader>

      <section className="achievement-hero">
        <div>
          <Tag color="sun">LEVEL {currentLevel}</Tag>
          <h2>
            {currentLevel >= 5
              ? 'Board Scholar'
              : currentLevel >= 3
              ? 'Rising Scholar'
              : 'Apprentice Learner'}
          </h2>
          <p>
            {earnedXp} XP earned &nbsp;&middot;&nbsp; {xpNeeded} XP to Level {currentLevel + 1}
          </p>
          <i>
            <em style={{ width: `${progressPct}%` }} />
          </i>
        </div>
        <span>🏆</span>
      </section>

      <section className="achievement-grid">
        {badges.map((a) => (
          <article
            key={a.title}
            style={{ opacity: a.unlocked ? 1 : 0.65 }}
          >
            <span>{a.icon}</span>
            <Tag color={a.unlocked ? 'mint' : 'lilac'}>{a.value}</Tag>
            <h3>{a.title}</h3>
            <b>{a.unlocked ? 'Unlocked' : 'Locked'}</b>
            <p>{a.description}</p>
          </article>
        ))}
      </section>
    </>
  );
}
