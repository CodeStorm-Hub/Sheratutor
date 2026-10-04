import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const chapter = parseInt(searchParams.get('chapter') || '1');

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Default progress state
    let progress = {
      chapter,
      completedLessons: [1, 2],
      currentLesson: 1,
      percent: 40,
      stars: 2,
      lastUpdated: new Date().toISOString(),
    };

    if (user) {
      // Check if student profile exists
      const { data: profile } = await supabase
        .from('student_profiles')
        .select('id, overall_momentum_score')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile) {
        // Return profile momentum or chapter progress
        progress.percent = Math.min(100, Math.max(40, Math.round(Number(profile.overall_momentum_score || 40))));
      }
    }

    return NextResponse.json({
      status: 'ok',
      progress,
    });
  } catch (error) {
    console.error('Playground progress GET error:', error);
    return NextResponse.json({
      status: 'fallback',
      progress: {
        chapter: 1,
        completedLessons: [1, 2],
        currentLesson: 1,
        percent: 40,
        stars: 2,
      },
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const chapter = parseInt(body?.chapter || '1');
    const completedLessons = Array.isArray(body?.completedLessons) ? body.completedLessons : [1];
    const currentLesson = parseInt(body?.currentLesson || '1');
    const percent = Math.min(100, Math.round((completedLessons.length / 5) * 100));

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from('student_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile) {
        // Update momentum score
        await supabase
          .from('student_profiles')
          .update({
            overall_momentum_score: percent,
          })
          .eq('id', profile.id);
      }
    }

    return NextResponse.json({
      status: 'ok',
      progress: {
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
