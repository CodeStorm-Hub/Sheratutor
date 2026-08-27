import { z } from "genkit";
import { ai, MODELS, PROMPT_VERSION } from "@/ai/genkit";
import { RubricEvaluationSchema } from "@/ai/schemas/rubric";

/**
 * Layers 3+4 combined: Bangla-aware reasoning over the transcribed answer,
 * grounded in retrieved NCTB chunks + rubric, forced into the FR-EVAL-02
 * structured JSON schema via Genkit's Zod output enforcement. The model
 * must cite which rubric rule backs each observation (NFR-REL-03).
 *
 * When `pageImageUrls` is provided (the question has pages mapped to it —
 * see grade-submission.ts's question-region mapping), grading runs against
 * the images as well as the transcript, and the model is asked to flag any
 * sign the transcript was silently "corrected" versus what's actually
 * written (docs/review §3 mitigation #3, scoped to whole-page cross-check
 * rather than a separate per-criterion image-crop pass).
 */
export const evaluateRubricFlow = ai.defineFlow(
  {
    name: "evaluateRubric",
    inputSchema: z.object({
      questionId: z.string(),
      questionText: z.string(),
      maxMarks: z.number(),
      transcribedAnswer: z.string(),
      rubricCriteria: z.unknown().describe("The versioned rubric criteria_json for this question."),
      groundingChunks: z
        .array(
          z.object({
            content_chunk: z.string(),
            source_book_page_ref: z.string().nullable(),
          })
        )
        .describe("Retrieved NCTB curriculum chunks from Layer 2."),
      studentLanguagePreference: z.enum(["bn", "en"]).default("bn"),
      pageImageUrls: z.array(z.string()).optional(),
    }),
    outputSchema: RubricEvaluationSchema,
  },
  async ({
    questionId,
    questionText,
    maxMarks,
    transcribedAnswer,
    rubricCriteria,
    groundingChunks,
    studentLanguagePreference,
    pageImageUrls,
  }) => {
    const groundingContext = groundingChunks
      .map((c, i) => `[Source ${i + 1}${c.source_book_page_ref ? ` — ${c.source_book_page_ref}` : ""}]\n${c.content_chunk}`)
      .join("\n\n");

    const imageCrossCheckInstruction = pageImageUrls?.length
      ? `\n\nYou are also given the original photographed page(s) this answer came from. Cross-check ` +
        `the transcribed answer against the image before scoring — if the transcript looks silently ` +
        `corrected or cleaned up versus what's actually written (e.g. a wrong number "fixed" to the ` +
        `right one), set transcript_mismatch_detected to true and explain what differs in ` +
        `transcript_mismatch_note. Grade against what the student actually wrote in the image, not ` +
        `what the transcript claims.`
      : "";

    const promptText =
      `You are a Bangladeshi SSC board examiner grading a student's answer. Grade strictly ` +
      `against the official rubric — do not invent criteria not in the rubric, and every ` +
      `observation must cite which retrieved curriculum source or rubric rule supports it. ` +
      `If the retrieved context doesn't cover a claim you want to make, say so rather than ` +
      `stating it as fact — set grounding_confidence low in that case.${imageCrossCheckInstruction}\n\n` +
      `Write deduction_summary_bn in natural, conversational Bangla suitable for a 15-18 ` +
      `year old (not a literal translation of the English summary), and deduction_summary_en ` +
      `in plain English. The student's preferred language is ${studentLanguagePreference}.\n\n` +
      `MISTAKE TAXONOMY CLASSIFICATION:\n` +
      `- If no marks lost: mistake_category = "NONE"\n` +
      `- If student used wrong formula or missed key formula: mistake_category = "FORMULA_RECALL"\n` +
      `- If student missed units or made unit conversion error (e.g. cm to m, km/h to m/s): mistake_category = "UNIT_CONVERSION"\n` +
      `- If formula was right but arithmetic/calculation was wrong: mistake_category = "CALCULATION_ERROR"\n` +
      `- If student misunderstood core physics principle: mistake_category = "CONCEPTUAL_MISCONCEPTION"\n\n` +
      `Verify all mathematical calculations step-by-step for exact numerical equality and set arithmetic_verified accordingly.\n\n` +
      `QUESTION (max ${maxMarks} marks): ${questionText}\n\n` +
      `OFFICIAL RUBRIC: ${JSON.stringify(rubricCriteria)}\n\n` +
      `RETRIEVED CURRICULUM CONTEXT:\n${groundingContext || "(none retrieved — grade conservatively and flag low grounding_confidence)"}\n\n` +
      `STUDENT'S TRANSCRIBED ANSWER (verbatim, including any errors):\n${transcribedAnswer}`;

    const prompt = pageImageUrls?.length
      ? [{ text: promptText }, ...pageImageUrls.map((url) => ({ media: { url } }))]
      : promptText;

    const { output } = await ai.generate({
      model: pageImageUrls?.length ? MODELS.vision : MODELS.reasoning,
      prompt,
      output: { schema: RubricEvaluationSchema },
      config: { temperature: 0.2 },
    });

    if (!output) throw new Error("evaluateRubric: model returned no structured output");
    return { ...output, question_id: questionId };
  }
);

export { PROMPT_VERSION };
