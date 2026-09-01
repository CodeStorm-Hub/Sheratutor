import React, { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/auth';
import { MistakesPageClient, MistakeItem } from '@/components/pages/MistakesPageClient';
import DashboardLoading from '../loading';

async function MistakesContent() {
  const supabase = await createClient();
  const { user } = await getUser();

  const { data: profile } = await supabase
    .from('student_profiles')
    .select('id, education_board, exam_type')
    .eq('user_id', user?.id ?? '')
    .maybeSingle();

  // Fetch real weakness logs
  const { data: weaknesses } = await supabase
    .from('weakness_logs')
    .select('*, chapters(title_en, title_bn, subjects(name_en, name_bn))')
    .eq('student_id', profile?.id ?? '')
    .order('weakness_score', { ascending: false });

  // Calculate real marks recoverable
  let marksRecoverable = 0;

  (weaknesses || []).forEach((w) => {
    marksRecoverable += Number(w.total_marks_lost || 0);
  });

  const displayMarksRecoverable =
    marksRecoverable > 0 ? Math.round(marksRecoverable) : 12;

  const topSubject = weaknesses?.[0]?.chapters?.subjects?.name_en || 'Core Curriculum';

  const dynamicMistakes: MistakeItem[] =
    weaknesses && weaknesses.length > 0
      ? weaknesses.map((w, idx) => ({
          type: `${w.chapters?.title_en || 'Topic'} gap`,
          type_bn: `${w.chapters?.title_bn || 'অধ্যায়'} ঘাটতি`,
          subject: w.chapters?.subjects?.name_en || 'Subject',
          count: `${Math.round(Number(w.weakness_score) * 10)} mistakes`,
          lostMarks: Math.round(Number(w.total_marks_lost || 0)),
          color: (idx === 0 ? 'coral' : idx === 1 ? 'sun' : 'mint') as 'coral' | 'sun' | 'mint',
          tags: w.tags || [],
        }))
      : [
          {
            type: 'Step-based equation derivations',
            type_bn: 'ধাপভিত্তিক সমীকরণ প্রতিপাদন',
            subject: 'Physics',
            count: '8 mistakes',
            lostMarks: 6,
            color: "coral", tags: ["Calculation", "Formula"] as const,
          },
          {
            type: 'Missing SI units in final answer',
            type_bn: 'হিসাবে শেষ SI একক বাদ দেওয়া',
            subject: 'Physics',
            count: '5 mistakes',
            lostMarks: 4,
            color: 'sun' as const,
            tags: ["Units", "Marks Loss"] as const,
          },
          {
            type: 'Vector sign and direction convention',
            type_bn: 'ভেক্টরের দিক ও চিহ্নের ভুল',
            subject: 'Physics',
            count: '4 mistakes',
            lostMarks: 3,
            color: 'mint' as const,
            tags: ["Motion", "Concept"] as const,
          },
        ];

  return (
    <MistakesPageClient
      displayMarksRecoverable={displayMarksRecoverable}
      topSubject={topSubject}
      conceptualPercent={weaknesses && weaknesses.length > 0 ? 78 : 76}
      dynamicMistakes={dynamicMistakes}
    />
  );
}

export default function MistakeAnalysisPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <MistakesContent />
    </Suspense>
  );
}
