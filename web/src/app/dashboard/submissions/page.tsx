import React, { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/auth';
import { SubmissionsPageClient, SubmissionItem } from '@/components/pages/SubmissionsPageClient';
import DashboardLoading from '../loading';

async function SubmissionsContent() {
  const supabase = await createClient();
  const { user } = await getUser();

  const { data: profile } = await supabase
    .from('student_profiles')
    .select('id')
    .eq('user_id', user?.id ?? '')
    .maybeSingle();

  const { data: submissions } = await supabase
    .from('exam_submissions')
    .select('*, question_papers(title, total_marks, subjects(name_en))')
    .eq('student_id', profile?.id ?? '')
    .order('submitted_at', { ascending: false })
    .limit(10);

  const latest = submissions?.[0];
  const latestScore = latest?.total_score_obtained ?? 82;
  const latestMax = latest?.max_possible_score ?? 100;
  const latestTitle =
    latest?.question_papers?.title || 'Physics Model Test Examination';

  return (
    <SubmissionsPageClient
      submissions={(submissions || []) as SubmissionItem[]}
      latestTitle={latestTitle}
      latestScore={Number(latestScore)}
      latestMax={Number(latestMax)}
      latestId={latest?.id}
    />
  );
}

export default function SubmissionsPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <SubmissionsContent />
    </Suspense>
  );
}
