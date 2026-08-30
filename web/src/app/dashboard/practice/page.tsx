import { createClient } from '@/lib/supabase/server';
import { ExamsPageClient } from '@/components/pages/ExamsPageClient';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default async function MockExamsPage() {
  const supabase = await createClient();
  const { data: papers } = await supabase
    .from('question_papers')
    .select('id, title, total_marks, subjects(name_en)')
    .order('created_at', { ascending: false })
    .limit(12);

  return <ExamsPageClient simulator={false} papers={papers ?? []} />;
}
