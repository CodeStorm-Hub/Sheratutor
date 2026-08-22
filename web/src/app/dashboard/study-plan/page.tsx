import { createClient } from '@/lib/supabase/server';
import { PlannerPageClient } from '@/components/pages/PlannerPageClient';

type ScheduleDay = {
  day: number;
  chapters: { chapterId: string; title: string; subject: string; weaknessScore: number }[];
};

export default async function StudyPlanPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('student_profiles')
    .select('id')
    .eq('user_id', user!.id)
    .maybeSingle();

  const { data: plans } = profile
    ? await supabase
        .from('study_plans')
        .select('*')
        .eq('student_id', profile.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
    : { data: null };

  const plan = plans?.[0];
  const schedule = plan?.daily_schedule_json as { cycleDays: number; days: ScheduleDay[] } | undefined;

  let dynamicTasks = [
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
  ];

  if (schedule?.days?.[0]?.chapters?.length) {
    dynamicTasks = schedule.days[0].chapters.map((c, i) => ({
      title: `${c.subject}: ${c.title}`,
      subtitle: `${20 + i * 10} min · Adaptive Revision`,
      time: `${9 + i * 2}:00`,
      checked: i === 0,
    }));
  }

  return (
    <PlannerPageClient
      initialTasks={dynamicTasks}
      recommendationTitle={
        schedule?.days?.[0]?.chapters?.[0]
          ? `Sharpen your ${schedule.days[0].chapters[0].title}`
          : 'Sharpen your trigonometry'
      }
      recommendationBody="Most recent mistakes are step-based errors. A focused 30-minute review will help you recover marks."
      masteryPercent={72}
    />
  );
}
