import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { UploadPageClient } from '@/components/pages/UploadPageClient';

export default async function UploadPage({
  searchParams,
}: {
  searchParams: Promise<{ paperId?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: papers } = await supabase
    .from('question_papers')
    .select('id, title, subjects(name_en), questions(id, question_number, question_text_en)')
    .or(`is_public_template.eq.true,created_by_user_id.eq.${user!.id}`)
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <UploadPageClient 
      papers={papers ?? []} 
      initialPaperId={resolvedSearchParams?.paperId} 
    />
  );
}
