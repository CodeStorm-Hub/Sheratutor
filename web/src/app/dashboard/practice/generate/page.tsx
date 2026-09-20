import React from 'react';
import { cacheLife } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { GeneratePageClient } from '@/components/pages/GeneratePageClient';

export const maxDuration = 120;

async function getCurriculumMetadata() {
  'use cache';
  cacheLife('days');
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: subjects } = await supabase
    .from('subjects')
    .select('id, name_en, name_bn, code')
    .in('code', ['SSC-PHY', 'SSC-CHEM', 'SSC-MATH', 'SSC-HMATH', 'SSC-ENG'])
    .order('name_en');
  
  const subjectIds = (subjects ?? []).map((s) => s.id);
  const { data: chapters } = subjectIds.length > 0
    ? await supabase
        .from('chapters')
        .select('id, subject_id, chapter_no, title_en, title_bn')
        .in('subject_id', subjectIds)
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
