import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { ExamsPageClient } from '@/components/pages/ExamsPageClient';
import DashboardLoading from '../loading';

async function MockExamsContent() {
  const supabase = await createClient();
  const { data: papers } = await supabase
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
    .order('created_at', { ascending: false })
    .limit(30);

  return <ExamsPageClient simulator={false} papers={papers ?? []} />;
}

export default function MockExamsPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <MockExamsContent />
    </Suspense>
  );
}
