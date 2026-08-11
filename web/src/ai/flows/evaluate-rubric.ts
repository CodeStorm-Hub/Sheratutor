import { z } from "genkit";
import { ai, MODELS, PROMPT_VERSION } from "@/ai/genkit";
import { RubricEvaluationSchema } from "@/ai/schemas/rubric";

/**
 * Layers 3+4 combined: Bangla-aware reasoning over the transcribed answer,
 * grounded in retrieved NCTB chunks + rubric, forced into the FR-EVAL-02
 * structured JSON schema via Genkit's Zod output enforcement. The model
 * must cite which rubric rule backs each observation (NFR-REL-03).
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
    }),
    outputSchema: RubricEvaluationSchema,
  },
  async ({ questionId, questionText, maxMarks, transcribedAnswer, rubricCriteria, groundingChunks, studentLanguagePreference }) => {
    const groundingContext = groundingChunks
      .map((c, i) => `[Source ${i + 1}${c.source_book_page_ref ? ` — ${c.source_book_page_ref}` : ""}]\n${c.content_chunk}`)
      .join("\n\n");

    const { output } = await ai.generate({
      model: MODELS.reasoning,
      prompt:
        `You are a Bangladeshi SSC board examiner grading a student's answer. Grade strictly ` +
        `against the official rubric — do not invent criteria not in the rubric, and every ` +
        `observation must cite which retrieved curriculum source or rubric rule supports it. ` +
        `If the retrieved context doesn't cover a claim you want to make, say so rather than ` +
        `stating it as fact — set grounding_confidence low in that case.\n\n` +
        `Write deduction_summary_bn in natural, conversational Bangla suitable for a 15-18 ` +
        `year old (not a literal translation of the English summary), and deduction_summary_en ` +
        `in plain English. The student's preferred language is ${studentLanguagePreference}.\n\n` +
        `QUESTION (max ${maxMarks} marks): ${questionText}\n\n` +
        `OFFICIAL RUBRIC: ${JSON.stringify(rubricCriteria)}\n\n` +
        `RETRIEVED CURRICULUM CONTEXT:\n${groundingContext || "(none retrieved — grade conservatively and flag low grounding_confidence)"}\n\n` +
        `STUDENT'S TRANSCRIBED ANSWER (verbatim, including any errors):\n${transcribedAnswer}`,
      output: { schema: RubricEvaluationSchema },
      config: { temperature: 0.2 },
    });

    if (!output) throw new Error("evaluateRubric: model returned no structured output");
    return { ...output, question_id: questionId };
  }
);

export { PROMPT_VERSION };
