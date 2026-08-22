import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { UploadForm } from '@/components/upload-form';
import { PageHeader } from '@/components/PageHeader';
import { Sparkles } from 'lucide-react';

export default async function UploadPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: papers } = await supabase
    .from('question_papers')
    .select('id, title, subjects(name_en), questions(id, question_number, question_text_en)')
    .or(`is_public_template.eq.true,created_by_user_id.eq.${user!.id}`)
    .limit(20);

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', width: '100%' }}>
      <PageHeader
        title="Upload answer sheet"
        description="Take clear photos of your handwritten answer script in chronological order."
      >
        <Link href="/dashboard/practice/generate" className="primary-btn">
          <Sparkles size={15} /> Generate question paper
        </Link>
      </PageHeader>

      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 16,
          background: '#fff',
          padding: 24,
          boxShadow: '0 8px 30px rgba(28, 35, 65, 0.04)',
        }}
      >
        <UploadForm papers={papers ?? []} />
      </div>
    </div>
  );
}
