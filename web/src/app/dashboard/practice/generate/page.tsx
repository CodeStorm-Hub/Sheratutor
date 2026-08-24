import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { GeneratePaperForm } from './generate-paper-form';
import { PageHeader } from '@/components/PageHeader';

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
    <div style={{ maxWidth: 720, margin: '0 auto', width: '100%' }}>
      <PageHeader
        title="Generate question paper"
        description="Choose a subject and chapter — SheraTutor will generate a board-standard mock exam paper tailored to your syllabus."
      />
      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 16,
          background: '#fff',
          padding: 24,
          boxShadow: '0 8px 30px rgba(28, 35, 65, 0.04)',
        }}
      >
        <GeneratePaperForm
          subjects={subjects ?? []}
          chapters={chapters ?? []}
        />
      </div>
    </div>
  );
}
