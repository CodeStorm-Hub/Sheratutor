import { z } from "genkit";
import { ai, MODELS, PIPELINE_VERSION, PROMPT_VERSION } from "@/ai/genkit";
import { transcribePageFlow } from "@/ai/flows/transcribe";
import { retrieveGroundingFlow } from "@/ai/flows/retrieve-grounding";
import { evaluateRubricFlow } from "@/ai/flows/evaluate-rubric";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

/**
 * Orchestrates all 4 layers for one submission and writes results with full
 * provenance (model/prompt/pipeline/rubric versions — docs/review §7.12).
 *
 * This is designed to run as an async background job (queue worker), never
 * as a synchronous HTTP request handler (docs/review §5.3) — grading a
 * multi-page CQ submission against frontier-API latency is not something to
 * hold an HTTP connection open for. The caller is expected to invoke this
 * from a queue consumer keyed by exam_submissions.idempotency_key.
 */
export const gradeSubmissionFlow = ai.defineFlow(
  {
    name: "gradeSubmission",
    inputSchema: z.object({ submissionId: z.string() }),
    outputSchema: z.object({
      submissionId: z.string(),
      questionsGraded: z.number(),
      totalScore: z.number(),
      maxPossibleScore: z.number(),
    }),
  },
  async ({ submissionId }) => {
    const supabase = getServiceRoleClient();

    await supabase
      .from("exam_submissions")
      .update({ status: "OCR_PROCESSING" })
      .eq("id", submissionId);

    const { data: submission, error: subErr } = await supabase
      .from("exam_submissions")
      .select("*, question_papers(subject_id)")
      .eq("id", submissionId)
      .single();
    if (subErr || !submission) throw new Error(`gradeSubmission: submission not found (${subErr?.message})`);

    const { data: pages, error: pagesErr } = await supabase
      .from("submission_pages")
      .select("*")
      .eq("submission_id", submissionId)
      .order("page_number");
    if (pagesErr) throw new Error(`gradeSubmission: ${pagesErr.message}`);

    // Layer 1: transcribe every page, verbatim.
    for (const page of pages ?? []) {
      const transcription = await transcribePageFlow({
        imageUrl: page.processed_image_url ?? page.original_image_url,
        expectedLanguage: "mixed",
      });

      await supabase
        .from("submission_pages")
        .update({
          ocr_raw_text: transcription.transcribed_text,
          ocr_latex_structured: transcription.latex_equations.join("\n"),
          transcription_confidence: transcription.verbatim_confidence,
        })
        .eq("id", page.id);
    }

    await supabase.from("exam_submissions").update({ status: "EVALUATING" }).eq("id", submissionId);

    const { data: questions, error: qErr } = await supabase
      .from("questions")
      .select("*, rubrics(id, version, criteria_json)")
      .eq("question_paper_id", submission.question_paper_id)
      .order("question_number");
    if (qErr) throw new Error(`gradeSubmission: ${qErr.message}`);

    const fullTranscript = (pages ?? []).map((p) => p.ocr_raw_text).join("\n\n---\n\n");

    let totalScore = 0;
    let maxPossibleScore = 0;
    let questionsGraded = 0;

    for (const question of questions ?? []) {
      // Layer 2: RAG grounding, scoped to this question's chapter + the
      // paper's language. (Language currently defaults to 'bn'; wire to
      // student_profiles / paper metadata once locale selection ships.)
      const grounding = await retrieveGroundingFlow({
        queryText: `${question.question_text_bn ?? question.question_text_en}\n\n${fullTranscript}`,
        chapterId: question.chapter_id,
        languageTag: "bn",
        matchCount: 5,
      });

      // Layers 3+4: grounded rubric evaluation.
      const evaluation = await evaluateRubricFlow({
        questionId: question.id,
        questionText: question.question_text_bn ?? question.question_text_en ?? "",
        maxMarks: Number(question.max_marks),
        transcribedAnswer: fullTranscript,
        rubricCriteria: question.rubrics?.criteria_json ?? [],
        groundingChunks: grounding.chunks.map((c) => ({
          content_chunk: c.content_chunk,
          source_book_page_ref: c.source_book_page_ref,
        })),
        studentLanguagePreference: "bn",
      });

      await supabase.from("grading_results").insert({
        submission_id: submissionId,
        question_id: question.id,
        institution_id: submission.institution_id,
        score_obtained: evaluation.score_obtained,
        max_marks: evaluation.max_marks,
        rubric_breakdown_json: evaluation.criteria_evaluations,
        explanation_summary_bn: evaluation.deduction_summary_bn,
        explanation_summary_en: evaluation.deduction_summary_en,
        model_name: MODELS.reasoning,
        model_version: "unpinned", // resolved model version isn't surfaced by the SDK yet; track via Genkit trace ID in the interim
        prompt_version: PROMPT_VERSION,
        rubric_version_id: question.rubrics?.id ?? null,
        pipeline_version: PIPELINE_VERSION,
      });

      totalScore += evaluation.score_obtained;
      maxPossibleScore += evaluation.max_marks;
      questionsGraded += 1;
    }

    await supabase
      .from("exam_submissions")
      .update({
        status: "COMPLETED",
        total_score_obtained: totalScore,
        max_possible_score: maxPossibleScore,
        evaluated_at: new Date().toISOString(),
      })
      .eq("id", submissionId);

    return { submissionId, questionsGraded, totalScore, maxPossibleScore };
  }
);
