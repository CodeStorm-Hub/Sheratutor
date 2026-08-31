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
  const [{ data: subjects }, { data: chapters }] = await Promise.all([
    supabase.from('subjects').select('id, name_en, name_bn').order('name_en'),
    supabase.from('chapters').select('id, subject_id, chapter_no, title_en, title_bn').order('chapter_no')
  ]);
  return { subjects, chapters };
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
