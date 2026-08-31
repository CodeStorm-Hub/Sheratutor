import React, { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/auth';
import { UploadPageClient } from '@/components/pages/UploadPageClient';
import DashboardLoading from '../loading';

async function UploadContent({
  searchParams,
}: {
  searchParams: Promise<{ paperId?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  
  const supabase = await createClient();
  const { user } = await getUser();

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

export default function UploadPage({
  searchParams,
}: {
  searchParams: Promise<{ paperId?: string }>;
}) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <UploadContent searchParams={searchParams} />
    </Suspense>
  );
}
