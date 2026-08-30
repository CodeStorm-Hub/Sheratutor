import { createClient } from '@/lib/supabase/server';
import { TutorPageClient } from '@/components/tutor-page-client';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default async function TutorPage() {
  const supabase = await createClient();

  const [{ data: subjects }, { data: sessionsData }] = await Promise.all([
    supabase
      .from('subjects')
      .select('id, name_en, name_bn, chapters(id, chapter_no, title_en, title_bn)')
      .order('name_en'),
    supabase
      .from('tutor_chat_sessions')
      .select('id, title, context_json, updated_at')
      .eq('mode', 'general')
      .order('updated_at', { ascending: false })
      .limit(50),
  ]);

  return (
    <TutorPageClient
      subjects={subjects ?? []}
      initialSessions={sessionsData ?? []}
    />
  );
}
