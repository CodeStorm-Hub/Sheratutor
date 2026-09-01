import React from 'react';
import { cacheLife } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { GeneratePageClient } from '@/components/pages/GeneratePageClient';

export const maxDuration = 60;

async function getCurriculumMetadata() {
  'use cache';
  cacheLife('days');
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: subjects } = await supabase
    .from('subjects')
    .select('id, name_en, name_bn')
    .eq('code', 'SSC-PHY')
    .order('name_en');
  
  const physicsSubjectId = subjects?.[0]?.id;
  const { data: chapters } = physicsSubjectId
    ? await supabase
        .from('chapters')
        .select('id, subject_id, chapter_no, title_en, title_bn')
        .eq('subject_id', physicsSubjectId)
        .order('chapter_no')
    : { data: [] };

  return { subjects: subjects ?? [], chapters: chapters ?? [] };
}

export default async function GeneratePracticePaperPage() {
  const { subjects, chapters } = await getCurriculumMetadata();

  return (
    <GeneratePageClient
      subjects={subjects ?? []}
      chapters={chapters ?? []}
    />
  );
}
