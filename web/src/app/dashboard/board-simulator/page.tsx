import { createClient } from '@/lib/supabase/server';
import { ExamsPageClient } from '@/components/pages/ExamsPageClient';

export default async function BoardSimulatorPage() {
  const supabase = await createClient();
  const { data: papers } = await supabase
    .from('question_papers')
    .select('id, title, total_marks, subjects(name_en)')
    .limit(6);

  return <ExamsPageClient simulator={true} papers={papers ?? []} />;
}
