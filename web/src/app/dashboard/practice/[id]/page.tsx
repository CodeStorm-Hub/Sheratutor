import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import QuestionPaperViewerClient, {
  type Question,
} from "@/components/pages/QuestionPaperViewerClient";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default async function QuestionPaperPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
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

  if (!paper) {
    notFound();
  }

  const sortedQuestions = [...((paper.questions ?? []) as Question[])].sort(
    (a, b) => a.question_number - b.question_number,
  );

  return <QuestionPaperViewerClient paper={paper} questions={sortedQuestions} />;
}
