import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { GeneratePageClient } from '@/components/pages/GeneratePageClient';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const maxDuration = 60;

export default async function GeneratePracticePaperPage() {
  const supabase = await createClient();
  const { data: subjects } = await supabase
    .from('subjects')
    .select('id, name_en, name_bn')
    .order('name_en');
  const { data: chapters } = await supabase
    .from('chapters')
    .select('id, subject_id, chapter_no, title_en, title_bn')
    .order('chapter_no');

  return (
    <GeneratePageClient
      subjects={subjects ?? []}
      chapters={chapters ?? []}
    />
  );
}
