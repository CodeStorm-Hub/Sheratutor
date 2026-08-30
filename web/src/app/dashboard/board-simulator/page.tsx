import { createClient } from '@/lib/supabase/server';
import { ExamsPageClient } from '@/components/pages/ExamsPageClient';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default async function BoardSimulatorPage({ searchParams }: { searchParams: { paperId?: string } }) {
  const supabase = await createClient();
  
  let query = supabase
    .from('question_papers')
    .select(`
      id, title, total_marks, difficulty, paper_type,
      subjects(name_en, name_bn),
      questions(
        id, question_number, question_type, max_marks,
        stimulus_bn, stimulus_en, sub_questions_json,
        mcq_options_json, mcq_correct_option, question_text_bn, question_text_en
      )
    `);
    
  if (searchParams.paperId) {
    query = query.eq('id', searchParams.paperId);
  }
  
  const { data: papers } = await query.limit(1);

  return <ExamsPageClient simulator={true} papers={papers ?? []} />;
}
