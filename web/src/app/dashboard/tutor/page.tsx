import { Suspense } from 'react';
import { cacheLife } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { TutorPageClient } from '@/components/tutor-page-client';
import DashboardLoading from '../loading';

async function getSubjects() {
  'use cache';
  cacheLife('days');
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: subjects } = await supabase
    .from('subjects')
    .select('id, name_en, name_bn, chapters(id, chapter_no, title_en, title_bn)')
    .eq('code', 'SSC-PHY')
    .order('name_en');
  return subjects ?? [];
}

async function TutorContent() {
  const supabase = await createClient();

  const [subjects, { data: sessionsData }] = await Promise.all([
    getSubjects(),
    supabase
      .from('tutor_chat_sessions')
      .select('id, title, context_json, updated_at')
      .eq('mode', 'general')
      .order('updated_at', { ascending: false })
      .limit(50),
  ]);

  return (
    <TutorPageClient
      subjects={subjects}
      initialSessions={sessionsData ?? []}
    />
  );
}

export default function TutorPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <TutorContent />
    </Suspense>
  );
}
