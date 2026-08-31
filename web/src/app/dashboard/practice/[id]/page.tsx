import { Suspense } from 'react';
import { cacheLife } from 'next/cache';
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { notFound } from "next/navigation";
import QuestionPaperViewerClient, {
  type Question,
} from "@/components/pages/QuestionPaperViewerClient";
import DashboardLoading from '../../loading';

async function getQuestionPaper(id: string) {
  'use cache';
  cacheLife('days');
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const { data: paper } = await supabase
    .from("question_papers")
    .select(`
      *,
      subject:subjects(name_en, name_bn),
      questions(
        id,
        question_number,
        question_type,
        max_marks,
        stimulus_bn,
        stimulus_en,
        sub_questions_json,
        mcq_options_json,
        mcq_correct_option,
        question_text_bn,
        question_text_en
      )
    `)
    .eq("id", id)
    .single();
    
  return paper;
}

async function QuestionPaperContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const paper = await getQuestionPaper(id);

  if (!paper) {
    notFound();
  }

  const sortedQuestions = [...((paper.questions ?? []) as Question[])].sort(
    (a, b) => a.question_number - b.question_number,
  );

  return <QuestionPaperViewerClient paper={paper} questions={sortedQuestions} />;
}

export default function QuestionPaperPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <QuestionPaperContent params={params} />
    </Suspense>
  );
}
