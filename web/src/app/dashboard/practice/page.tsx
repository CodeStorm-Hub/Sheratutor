import { cacheLife } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { ExamsPageClient } from '@/components/pages/ExamsPageClient';

async function getPracticePapers() {
  'use cache';
  cacheLife('hours');
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: papers } = await supabase
    .from('question_papers')
    .select('id, title, total_marks, subjects!inner(code, name_en)')
    .eq('subjects.code', 'SSC-PHY')
    .order('created_at', { ascending: false })
    .limit(12);
  
  return papers;
}

export default async function MockExamsPage() {
  const papers = await getPracticePapers();
  return <ExamsPageClient simulator={false} papers={papers ?? []} />;
}
