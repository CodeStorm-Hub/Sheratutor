import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/auth';
import { AchievementsPageClient, BadgeItem } from '@/components/pages/AchievementsPageClient';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default async function AchievementsPage() {
  const supabase = await createClient();
  const { user } = await getUser();

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

  const badges: BadgeItem[] = [
    {
      icon: '🔥',
      value: count > 0 ? `${count} Tests` : 'Ready',
      title: 'Practice Consistency',
      title_bn: 'ধারাবাহিক অনুশীলন',
      description:
        count > 0
          ? `Submitted ${count} exam answer scripts for AI evaluation.`
          : 'Complete your first practice test to unlock.',
      description_bn:
        count > 0
          ? `এআই মূল্যায়নের জন্য ${count}টি উত্তরপত্র জমা দেওয়া হয়েছে।`
          : 'আনলক করতে তোমার প্রথম মক টেস্ট সম্পন্ন করো।',
      unlocked: count >= 1,
    },
    {
      icon: '⚡',
      value: avgPct > 0 ? `${avgPct}% Avg` : 'Pending',
      title: 'Accuracy Milestone',
      title_bn: 'সঠিকতার মাইলফলক',
      description: hasHighScore
        ? 'Scored 80%+ (A+) on an evaluated board-standard paper.'
        : 'Score 80%+ on any mock exam to unlock.',
      description_bn: hasHighScore
        ? 'বোর্ড স্ট্যান্ডার্ড মূল্যায়নে ৮০%+ (A+) স্কোর অর্জন।'
        : 'আনলক করতে যেকোনো মক পরীক্ষায় ৮০%+ নম্বর পাও।',
      unlocked: hasHighScore,
    },
    {
      icon: '✦',
      value: `${earnedXp} XP`,
      title: 'XP Growth',
      title_bn: 'এক্সপি বৃদ্ধি',
      description: `Earned ${earnedXp} total learning experience points.`,
      description_bn: `মোট ${earnedXp} এক্সপি পয়েন্ট অর্জিত হয়েছে।`,
      unlocked: earnedXp >= 100,
    },
    {
      icon: '✓',
      value: momentum >= 60 ? 'Ready' : 'In Progress',
      title: 'Board Exam Readiness',
      title_bn: 'বোর্ড পরীক্ষার পূর্ণ প্রস্তুতি',
      description:
        momentum >= 60
          ? `Achieved ${momentum}% readiness for ${studentProfile?.education_board || 'Dhaka'} Board.`
          : 'Reach 60%+ syllabus readiness to earn board ready badge.',
      description_bn:
        momentum >= 60
          ? `${studentProfile?.education_board || 'Dhaka'} বোর্ডের জন্য ${momentum}% প্রস্তুতি সম্পন্ন।`
          : 'বোর্ড রেডি ব্যাজ পেতে ৬০%+ প্রস্তুতি অর্জন করো।',
      unlocked: momentum >= 60,
    },
  ];

  return (
    <AchievementsPageClient
      currentLevel={currentLevel}
      earnedXp={earnedXp}
      xpNeeded={xpNeeded}
      progressPct={progressPct}
      badges={badges}
    />
  );
}
