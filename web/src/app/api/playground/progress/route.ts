import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function normalizeSubjectKey(sub?: string | null): string {
  const s = (sub || 'math').toLowerCase();
  if (s.includes('chem') || s.includes('রসায়ন')) return 'chemistry';
  if (s.includes('phy') || s.includes('পদার্থ')) return 'physics';
  if (s.includes('hmath') || s.includes('উচ্চতর')) return 'higher-math';
  return 'math';
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const chapter = parseInt(searchParams.get('chapter') || '1', 10);
    const subject = normalizeSubjectKey(searchParams.get('subject'));

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Default baseline progress
    let completedLessons: number[] = [1];
    let currentLesson = 1;
    let percent = 20;

    if (user) {
      const { data: profile } = await supabase
        .from('student_profiles')
        .select('id, overall_momentum_score')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile) {
        // Query active study plan for persisted lesson completions
        const { data: plan } = await supabase
          .from('study_plans')
          .select('completed_tasks_json')
          .eq('student_id', profile.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        const taskKey = `playground_${subject}_ch${chapter}`;
        const tasks = (plan?.completed_tasks_json as Record<string, any>) || {};

        if (tasks[taskKey] && Array.isArray(tasks[taskKey].completedLessons)) {
          completedLessons = tasks[taskKey].completedLessons;
          currentLesson = tasks[taskKey].currentLesson || completedLessons[completedLessons.length - 1] || 1;
          percent = Math.min(100, Math.round((completedLessons.length / 5) * 100));
        } else if (profile.overall_momentum_score) {
          // If no specific chapter task saved yet, estimate from momentum score
          const momentum = Number(profile.overall_momentum_score);
          if (momentum >= 80) completedLessons = [1, 2, 3, 4];
          else if (momentum >= 60) completedLessons = [1, 2, 3];
          else if (momentum >= 40) completedLessons = [1, 2];
          percent = Math.min(100, Math.round((completedLessons.length / 5) * 100));
        }
      }
    }

    return NextResponse.json({
      status: 'ok',
      progress: {
        subject,
        chapter,
        completedLessons,
        currentLesson,
        percent,
        stars: completedLessons.length,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Playground progress GET error:', error);
    return NextResponse.json({
      status: 'fallback',
      progress: {
        subject: 'math',
        chapter: 1,
        completedLessons: [1],
        currentLesson: 1,
        percent: 20,
        stars: 1,
      },
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const chapter = parseInt(body?.chapter || '1', 10);
    const subject = normalizeSubjectKey(body?.subject);
    const completedLessons = Array.isArray(body?.completedLessons) && body.completedLessons.length > 0
      ? body.completedLessons
      : [1];
    const currentLesson = parseInt(body?.currentLesson || '1', 10);
    const percent = Math.min(100, Math.round((completedLessons.length / 5) * 100));

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from('student_profiles')
        .select('id, overall_momentum_score')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile) {
        // 1. Update overall student momentum score
        const currentScore = Number(profile.overall_momentum_score || 40);
        const newScore = Math.max(currentScore, percent);
        await supabase
          .from('student_profiles')
          .update({
            overall_momentum_score: newScore,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profile.id);

        // 2. Persist chapter and lesson completions into active study plan
        const { data: activePlans } = await supabase
          .from('study_plans')
          .select('id, completed_tasks_json')
          .eq('student_id', profile.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1);

        const activePlan = activePlans?.[0];
        const taskKey = `playground_${subject}_ch${chapter}`;

        if (activePlan) {
          const currentTasks = (activePlan.completed_tasks_json as Record<string, any>) || {};
          currentTasks[taskKey] = {
            subject,
            chapter,
            completedLessons,
            currentLesson,
            percent,
            savedAt: new Date().toISOString(),
          };

          await supabase
            .from('study_plans')
            .update({
              completed_tasks_json: currentTasks,
            })
            .eq('id', activePlan.id);
        } else {
          // If no active study plan exists, create one with default 30-day schedule
          const now = new Date();
          const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          await supabase.from('study_plans').insert({
            student_id: profile.id,
            start_date: now.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0],
            daily_schedule_json: { cycleDays: 7, days: [] },
            is_active: true,
            completed_tasks_json: {
              [taskKey]: {
                subject,
                chapter,
                completedLessons,
                currentLesson,
                percent,
                savedAt: new Date().toISOString(),
              },
            },
          });
        }
      }
    }

    return NextResponse.json({
      status: 'ok',
      progress: {
        subject,
        chapter,
        completedLessons,
        currentLesson,
        percent,
        stars: completedLessons.length,
        savedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Playground progress POST error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Could not save progress to database',
      },
      { status: 500 }
    );
  }
}
