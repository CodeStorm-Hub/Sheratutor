import { z } from "genkit";
import { ai, MODELS } from "@/ai/genkit";
import { retrieveGroundingFlow } from "@/ai/flows/retrieve-grounding";

/**
 * FR-GEN-01 (Custom Mock Paper Generation) only — no past-paper replication
 * (FR-GEN-02) or PDF export / QR answer-sheet convention (FR-GEN-03, which
 * docs/review §4 says to decide before building further). Grounded per
 * chapter via the same retrieveGroundingFlow the grading pipeline already
 * depends on, so generated questions stay tied to real NCTB content rather
 * than the model inventing topics.
 *
 * rubric_criteria mirrors rubrics.criteria_json's existing documented shape
 * ([{step_name, max_step_marks, matching_rules}]) so generated questions are
 * gradeable by the same evaluateRubricFlow unchanged. For MCQ, options are
 * embedded in question_text (the schema has no separate options field —
 * acceptable for this pass since only CQ-style step grading is exercised
 * end-to-end today).
 */
const GeneratedQuestionSchema = z.object({
  chapter_id: z.string(),
  question_text_bn: z.string(),
  question_text_en: z.string(),
  max_marks: z.coerce.number(),
  rubric_criteria: z.array(
    z.object({
      step_name: z.string(),
      max_step_marks: z.coerce.number(),
      matching_rules: z.string(),
    })
  ),
});

export const GeneratedPaperSchema = z.object({
  questions: z.array(GeneratedQuestionSchema),
});

export const generateQuestionPaperFlow = ai.defineFlow(
  {
    name: "generateQuestionPaper",
    inputSchema: z.object({
      chapterIds: z.array(z.string()).min(1),
      paperType: z.enum(["MCQ", "CQ", "MIXED"]),
      difficulty: z.enum(["EASY", "MEDIUM", "HARD", "BOARD_STANDARD"]),
      totalMarks: z.number(),
      languagePreference: z.enum(["bn", "en"]).default("bn"),
    }),
    outputSchema: GeneratedPaperSchema,
  },
  async ({ chapterIds, paperType, difficulty, totalMarks, languagePreference }) => {
    console.log(`[generateQuestionPaper] Starting for chapterIds=${chapterIds}, totalMarks=${totalMarks}`);
    const groundingByChapter = await Promise.all(
      chapterIds.map(async (chapterId) => {
        console.log(`[generateQuestionPaper] Retrieving grounding for ${chapterId}`);
        const grounding = await retrieveGroundingFlow({
          queryText: "important board-exam topics, formulas, and concepts for this chapter",
          chapterId,
          languageTag: languagePreference,
          matchCount: 4,
        });
        console.log(`[generateQuestionPaper] Retrieved ${grounding.chunks.length} chunks for ${chapterId}`);
        return { chapterId, chunks: grounding.chunks };
      })
    );

    const groundingContext = groundingByChapter
      .map(
        ({ chapterId, chunks }) =>
          `[Chapter ${chapterId}]\n` +
          (chunks.length > 0
            ? chunks.map((c) => c.content_chunk).join("\n\n")
            : "(no retrieved content — invent conservatively from general NCTB knowledge and keep this chapter's questions simple)")
      )
      .join("\n\n---\n\n");

    console.log(`[generateQuestionPaper] Built grounding context, length: ${groundingContext.length}. Calling ai.generate...`);
    const { text } = await ai.generate({
      model: MODELS.reasoning,
      prompt:
        `You are writing a ${difficulty} board-standard ${paperType} mock exam paper for a Bangladeshi ` +
        `SSC (grade 9-10) student, worth exactly ${totalMarks} total marks, covering these chapters. ` +
        `Base every question on the retrieved curriculum context below — do not invent topics outside it.\n\n` +
        `For each question, write both question_text_bn (natural Bangla, NCTB terminology) and ` +
        `question_text_en (plain English). Assign each question to the chapter_id its content is grounded in. ` +
        `Give each question a rubric_criteria array of grading steps whose max_step_marks sum to that ` +
        `question's max_marks, and whose max_marks across all questions sum to exactly ${totalMarks}.\n\n` +
        `You MUST output a valid JSON object matching this schema exactly, with NO markdown formatting or other text:\n` +
        `{\n  "questions": [\n    {\n      "chapter_id": "string",\n      "question_text_bn": "string",\n      "question_text_en": "string",\n      "max_marks": number,\n      "rubric_criteria": [\n        {\n          "step_name": "string",\n          "max_step_marks": number,\n          "matching_rules": "string"\n        }\n      ]\n    }\n  ]\n}\n\n` +
        `RETRIEVED CURRICULUM CONTEXT:\n${groundingContext}`,
      config: { temperature: 0.6 },
    });
    console.log(`[generateQuestionPaper] ai.generate completed.`);

    if (!text) throw new Error("generateQuestionPaper: model returned no text");
    
    // Clean markdown code blocks if the model wrapped it
    let jsonStr = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
    console.log("Raw LLM Output:\n", jsonStr);
    
    // Fix invalid escapes that 8B models sometimes produce for LaTeX (e.g. \sqrt instead of \\sqrt)
    // This doubles any backslash that isn't part of a valid JSON escape sequence.
    jsonStr = jsonStr.replace(/\\(?!["\\/bfnrtu])/g, "\\\\");

    const output = JSON.parse(jsonStr);
    
    return GeneratedPaperSchema.parse(output);
  }
);
