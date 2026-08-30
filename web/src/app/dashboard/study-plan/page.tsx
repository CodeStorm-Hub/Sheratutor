import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/auth';
import { PlannerPageClient } from '@/components/pages/PlannerPageClient';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

type ScheduleDay = {
  day: number;
  chapters: { chapterId: string; title: string; subject: string; weaknessScore: number }[];
};

export default async function StudyPlanPage() {
  const supabase = await createClient();
  const { user } = await getUser();

  const { data: profile } = await supabase
    .from('student_profiles')
    .select('id, education_board, exam_type')
    .eq('user_id', user?.id ?? '')
    .maybeSingle();

  const [{ data: plans }, { data: weaknesses }] = profile
    ? await Promise.all([
        supabase
          .from('study_plans')
          .select('*')
          .eq('student_id', profile.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1),
        supabase
          .from('weakness_logs')
          .select('*, chapters(title_en, subjects(name_en))')
          .eq('student_id', profile.id)
          .order('weakness_score', { ascending: false }),
      ])
    : [{ data: null }, { data: null }];

  const plan = plans?.[0];
  const schedule = plan?.daily_schedule_json as { cycleDays: number; days: ScheduleDay[] } | undefined;
  const completedTasks = (plan?.completed_tasks_json as Record<string, boolean>) || {};

  // For this exercise, assume today is day 1 of the cycle. In a real app, calculate offset from start_date.
  const currentDay = 1;

  let dynamicTasks = [
    {
      id: "fallback-1",
      title: 'Physics: Motion & Measurements Practice',
      subtitle: '25 min · NCTB syllabus standard',
      time: '09:30',
      checked: true,
    },
    {
      id: "fallback-2",
      title: 'Chemistry: Chemical Reactions Review',
      subtitle: '35 min · Balancing equations',
      time: '11:00',
      checked: true,
    },
    {
      id: "fallback-3",
      title: 'Mathematics: Problem Solving Practice',
      subtitle: '20 min · Board question drill',
      time: '16:30',
      checked: false,
    },
    {
      id: "fallback-4",
      title: 'English: Written Expression & Grammar',
      subtitle: '15 min · Formal letter format',
      time: '19:00',
      checked: false,
    },
  ];

  if (schedule?.days?.[currentDay - 1]?.chapters?.length) {
    dynamicTasks = schedule.days[currentDay - 1].chapters.map((c, i) => {
      const taskId = `task-${i}`;
      const isChecked = !!completedTasks[`${currentDay}-${taskId}`];
      return {
        id: taskId,
        title: `${c.subject}: ${c.title}`,
        subtitle: `${20 + (i % 3) * 10} min · Adaptive Revision`,
        time: `${9 + (i % 5) * 2}:30`,
        checked: isChecked,
      };
    });
  }

  let masteryPercent = 75;
  if (weaknesses && weaknesses.length > 0) {
    const totalScore = weaknesses.reduce((acc, curr) => acc + Number(curr.weakness_score), 0);
    const avgWeakness = totalScore / weaknesses.length;
    masteryPercent = Math.max(10, Math.min(100, Math.round((1 - avgWeakness) * 100)));
  }

  const topWeakness = weaknesses?.[0];
  const recTitle = topWeakness?.chapters?.title_en
    ? `Sharpen your ${topWeakness.chapters.title_en}`
    : schedule?.days?.[0]?.chapters?.[0]
    ? `Sharpen your ${schedule.days[0].chapters[0].title}`
    : 'Sharpen your core topics';

  const recBody = topWeakness
    ? `Identified conceptual gaps in ${topWeakness.chapters?.subjects?.name_en || 'this subject'}. A focused 30-minute review will help recover up to ${Math.round(Number(topWeakness.total_marks_lost || 6))} marks.`
    : 'Step-based practice on recent topics will help strengthen board rubric alignment.';

  return (
    <PlannerPageClient
      planId={plan?.id}
      currentDay={currentDay}
      initialTasks={dynamicTasks}
      recommendationTitle={recTitle}
      recommendationBody={recBody}
      masteryPercent={masteryPercent}
    />
  );
}
