import { Suspense } from 'react';
import { createClient } from "@/lib/supabase/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { notFound } from "next/navigation";
import QuestionPaperViewerClient, {
  type Question,
} from "@/components/pages/QuestionPaperViewerClient";
import DashboardLoading from '../../loading';

async function QuestionPaperContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const selectQuery = `
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
  `;

  let { data: paper } = await supabase
    .from("question_papers")
    .select(selectQuery)
    .eq("id", id)
    .maybeSingle();

  // If not found via user RLS, verify via service role client
  if (!paper) {
    try {
      const service = getServiceRoleClient();
      const { data: servicePaper } = await service
        .from("question_papers")
        .select(selectQuery)
        .eq("id", id)
        .maybeSingle();
      paper = servicePaper;
    } catch (e) {
      console.warn("Could not fetch paper via service role fallback:", e);
    }
  }

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
