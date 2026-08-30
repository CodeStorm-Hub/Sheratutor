import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { SubmissionsPageClient, SubmissionItem } from '@/components/pages/SubmissionsPageClient';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default async function SubmissionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('student_profiles')
    .select('id')
    .eq('user_id', user!.id)
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
