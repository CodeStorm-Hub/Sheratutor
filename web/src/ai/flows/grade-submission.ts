import { z } from "genkit";
import { ai, MODELS, MODEL_VERSIONS, PIPELINE_VERSION, PROMPT_VERSION } from "@/ai/genkit";
import { transcribePageFlow } from "@/ai/flows/transcribe";
import { retrieveGroundingFlow } from "@/ai/flows/retrieve-grounding";
import { evaluateRubricFlow } from "@/ai/flows/evaluate-rubric";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

/**
 * Orchestrates all 4 layers for one submission and writes results with full
 * provenance (model/prompt/pipeline/rubric versions — docs/review §7.12).
 *
 * Runs as an async background job, invoked by the pgmq worker
 * (src/app/api/internal/process-grading-queue/route.ts), never synchronously
 * from an HTTP request handler (docs/review §5.3). Idempotent: a redelivered
 * message for an already-COMPLETED submission (e.g. the worker crashed after
 * finishing but before archiving the queue message) is a safe no-op.
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

    const { data: existing } = await supabase
      .from("exam_submissions")
      .select("status, total_score_obtained, max_possible_score")
      .eq("id", submissionId)
      .maybeSingle();
    if (existing?.status === "COMPLETED") {
      return {
        submissionId,
        questionsGraded: 0,
        totalScore: Number(existing.total_score_obtained ?? 0),
        maxPossibleScore: Number(existing.max_possible_score ?? 0),
      };
    }

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
          ocr_uncertain_spans: transcription.uncertain_spans,
        })
        .eq("id", page.id);

      // Keep the in-memory copy in sync so the transcript builder below
      // (same run, no re-fetch) sees the freshly-written text.
      page.ocr_raw_text = transcription.transcribed_text;
    }

    await supabase.from("exam_submissions").update({ status: "EVALUATING" }).eq("id", submissionId);

    const { data: questions, error: qErr } = await supabase
      .from("questions")
      .select("*, rubrics(id, version, criteria_json)")
      .eq("question_paper_id", submission.question_paper_id)
      .order("question_number");
    if (qErr) throw new Error(`gradeSubmission: ${qErr.message}`);

    const allPages = pages ?? [];
    const fullTranscript = allPages.map((p) => p.ocr_raw_text).join("\n\n---\n\n");

    // Question-region mapping (docs/review §4, B2C option): if the student
    // declared which question at least one page answers, grade each
    // question only against its matched pages (+ any undeclared pages,
    // treated as shared context) instead of the full concatenation. Fully
    // legacy/undeclared submissions (no page has a question_id) keep the
    // original behavior unchanged.
    const hasQuestionMapping = allPages.some((p) => p.question_id != null);

    function transcriptForQuestion(questionId: string): string {
      if (!hasQuestionMapping) return fullTranscript;
      const matched = allPages.filter((p) => p.question_id === questionId || p.question_id == null);
      return matched.map((p) => p.ocr_raw_text).join("\n\n---\n\n");
    }

    function pageImageUrlsForQuestion(questionId: string): string[] | undefined {
      if (!hasQuestionMapping) return undefined;
      const matched = allPages.filter((p) => p.question_id === questionId);
      const urls = matched.map((p) => p.original_image_url);
      return urls.length > 0 ? urls : undefined;
    }

    let totalScore = 0;
    let maxPossibleScore = 0;
    let questionsGraded = 0;

    for (const question of questions ?? []) {
      const transcribedAnswer = transcriptForQuestion(question.id);

      // Layer 2: RAG grounding, scoped to this question's chapter + the
      // paper's language. (Language currently defaults to 'bn'; wire to
      // student_profiles / paper metadata once locale selection ships.)
      const grounding = await retrieveGroundingFlow({
        queryText: `${question.question_text_bn ?? question.question_text_en}\n\n${transcribedAnswer}`,
        chapterId: question.chapter_id,
        languageTag: "bn",
        matchCount: 5,
      });

      // Layers 3+4: grounded rubric evaluation. When this question has
      // pages mapped to it, also pass their images so the evaluator can
      // cross-check the transcript against the actual handwriting
      // (docs/review §3 mitigation #3, scoped to whole-page rather than
      // per-criterion crops).
      const evaluation = await evaluateRubricFlow({
        questionId: question.id,
        questionText: question.question_text_bn ?? question.question_text_en ?? "",
        maxMarks: Number(question.max_marks),
        transcribedAnswer,
        rubricCriteria: question.rubrics?.criteria_json ?? [],
        groundingChunks: grounding.chunks.map((c) => ({
          content_chunk: c.content_chunk,
          source_book_page_ref: c.source_book_page_ref,
        })),
        studentLanguagePreference: "bn",
        pageImageUrls: pageImageUrlsForQuestion(question.id),
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
        model_version: MODEL_VERSIONS.reasoning,
        prompt_version: PROMPT_VERSION,
        rubric_version_id: question.rubrics?.id ?? null,
        pipeline_version: PIPELINE_VERSION,
        transcript_mismatch_detected: evaluation.transcript_mismatch_detected,
        transcript_mismatch_note: evaluation.transcript_mismatch_note,
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
