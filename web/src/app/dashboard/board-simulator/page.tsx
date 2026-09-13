import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { ExamsPageClient } from '@/components/pages/ExamsPageClient';
import DashboardLoading from '../loading';

async function BoardSimulatorContent({ searchParams }: { searchParams: Promise<{ paperId?: string }> }) {
  const supabase = await createClient();
  const { paperId } = await searchParams;
  
  let query = supabase
    .from('question_papers')
    .select(`
      id, title, total_marks, difficulty, paper_type, created_at,
      subjects(name_en, name_bn),
      questions(
        id, question_number, question_type, max_marks,
        stimulus_bn, stimulus_en, sub_questions_json,
        mcq_options_json, mcq_correct_option, question_text_bn, question_text_en
      )
    `)
    .order('created_at', { ascending: false });
    
  if (paperId) {
    query = query.eq('id', paperId);
  }
  
  const { data: papers } = await query.limit(10);

  return <ExamsPageClient simulator={true} papers={papers ?? []} />;
}

export default function BoardSimulatorPage({ searchParams }: { searchParams: Promise<{ paperId?: string }> }) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <BoardSimulatorContent searchParams={searchParams} />
    </Suspense>
  );
}
