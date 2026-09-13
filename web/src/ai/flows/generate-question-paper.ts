import { z } from "genkit";
import { ai, MODELS, FALLBACK_REASONING_MODEL, generateWithGeminiFallback } from "@/ai/genkit";

// Helper to extract JSON from model output that might include markdown or commentary
export function extractJsonFromResponse(response: string): unknown {
  let cleanText = response.replace(/<thought>[\s\S]*?<\/thought>/gi, "").trim();
  const match = cleanText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (match && match[1]) {
    cleanText = match[1].trim();
  }
  const start = cleanText.indexOf("{");
  const end = cleanText.lastIndexOf("}");
  if (start !== -1 && end !== -1) {
    cleanText = cleanText.substring(start, end + 1);
  }
  return JSON.parse(cleanText);
}

export const CQSubQuestionSchema = z.object({
  part: z.enum(["ক", "খ", "গ", "ঘ"]),
  text_bn: z.string().min(1),
  text_en: z.string().optional().default(""),
  marks: z.number().int().min(1).max(4),
  rubric_step_rules: z.string().optional().default(""),
});

export const GeneratedQuestionSchema = z
  .object({
    chapter_id: z.string(),
    question_type: z.enum(["CQ", "MCQ"]),
    max_marks: z.number(),
    stimulus_bn: z.string().nullable().optional(),
    stimulus_en: z.string().nullable().optional(),
    sub_questions: z.array(CQSubQuestionSchema).optional(),
    mcq_question_bn: z.string().nullable().optional(),
    mcq_question_en: z.string().nullable().optional(),
    mcq_options: z.array(z.string()).optional(),
    mcq_correct_option: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.question_type === "CQ") {
      if (!data.sub_questions || data.sub_questions.length < 4) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Every CQ question MUST contain exactly 4 sub_questions: ক (1 mark), খ (2 marks), গ (3 marks), ঘ (4 marks)",
          path: ["sub_questions"],
        });
      }
    } else if (data.question_type === "MCQ") {
      if (!data.mcq_options || data.mcq_options.length < 4) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Every MCQ MUST have at least 4 options (ক, খ, গ, ঘ)",
          path: ["mcq_options"],
        });
      }
    }
  });

export const GeneratedPaperSchema = z.object({
  questions: z.array(GeneratedQuestionSchema),
});

export const generateQuestionPaperFlow = ai.defineFlow(
  {
    name: "generateQuestionPaper",
    inputSchema: z.object({
      subjectNameEn: z.string().optional().default("Physics"),
      subjectNameBn: z.string().optional().default("পদার্থবিজ্ঞান"),
      chapterIds: z.array(z.string()).min(1),
      paperType: z.enum(["MCQ", "CQ", "MIXED"]),
      difficulty: z.enum(["EASY", "MEDIUM", "HARD", "BOARD_STANDARD"]),
      totalMarks: z.number(),
      languagePreference: z.enum(["bn", "en"]).default("bn"),
    }),
    outputSchema: GeneratedPaperSchema,
  },
  async ({ subjectNameEn, subjectNameBn, chapterIds, paperType, difficulty, totalMarks, languagePreference: _languagePreference }) => {
    // Limit to 3 chapters to prevent context overload and timeouts
    const cappedChapterIds = chapterIds.slice(0, 3);

    const supabase = (await import("@/lib/supabase/service-role")).getServiceRoleClient();
    const { data: chaptersData } = await supabase
      .from("chapters")
      .select("id, chapter_no, title_en, title_bn")
      .in("id", cappedChapterIds);

    const chapterTitles = (chaptersData || [])
      .map((c) => `[ID: ${c.id}] Chapter ${c.chapter_no}: ${c.title_en} (${c.title_bn || ""})`)
      .join("\n");

    let questionCountsInstruction = "";
    if (paperType === "CQ") {
      const cqCount = Math.max(1, Math.round(totalMarks / 10));
      questionCountsInstruction = `Generate an array of exactly ${cqCount} distinct Creative Question(s) (CQ) in the "questions" JSON array. Each CQ is worth 10 marks and MUST have a complete Bengali stimulus (উদ্দীপক) and exactly 4 sub-questions:
- ক (1 mark, জ্ঞানমূলক — direct factual definition or scientific law)
- খ (2 marks, অনুধাবনমূলক — conceptual explanation with reasoning)
- গ (3 marks, প্রয়োগমূলক — mathematical calculation or application directly derived from stimulus)
- ঘ (4 marks, উচ্চতর দক্ষতামূলক — comparative analysis, graphical deduction, or evaluating hypothesis from stimulus).
The total marks across all ${cqCount} questions must be ${cqCount * 10}.`;
    } else if (paperType === "MCQ") {
      const mcqCount = Math.min(25, Math.max(5, totalMarks));
      questionCountsInstruction = `Generate an array of exactly ${mcqCount} Multiple Choice Question(s) (MCQ) in the "questions" JSON array. Each MCQ is worth 1 mark, with 4 distinct options (ক, খ, গ, ঘ) and 1 correct option.`;
    } else {
      const cqCount = Math.max(1, Math.floor((totalMarks * 0.7) / 10));
      const mcqCount = Math.max(2, totalMarks - cqCount * 10);
      questionCountsInstruction = `Generate an array of exactly ${cqCount} Creative Question(s) (10 marks each) and ${mcqCount} MCQ(s) (1 mark each) in the "questions" JSON array.`;
    }

    const prompt = `You are a senior Bangladeshi NCTB SSC ${subjectNameEn} (${subjectNameBn}) board examiner writing an authentic ${difficulty} board mock exam in Bengali.
${questionCountsInstruction}

CURRICULUM CHAPTERS:
${chapterTitles}

CRITICAL RULES:
1. Every CQ MUST have "question_type": "CQ", "max_marks": 10, a realistic Bengali "stimulus_bn" with numerical data and SI units, and an array "sub_questions" containing EXACTLY 4 sub-questions:
   - Part "ক": marks 1 (জ্ঞানমূলক)
   - Part "খ": marks 2 (অনুধাবনমূলক)
   - Part "গ": marks 3 (প্রয়োগমূলক গাণিতিক)
   - Part "ঘ": marks 4 (উচ্চতর দক্ষতামূলক বিশ্লেষণ)
   Each sub-question must also have "text_bn", "text_en", and "rubric_step_rules" (Bengali explanation of mark allocation).
2. Every MCQ MUST have "question_type": "MCQ", "max_marks": 1, "mcq_question_bn", an array "mcq_options" with 4 items labeled "ক) ...", "খ) ...", "গ) ...", "ঘ) ...", and "mcq_correct_option" exactly matching one of the options.
3. Every question must have a "chapter_id" chosen from: ${cappedChapterIds.join(", ")}.

OUTPUT JSON STRUCTURE:
Return ONLY a valid JSON object matching this schema:
{
  "questions": [
    {
      "chapter_id": "${cappedChapterIds[0]}",
      "question_type": "CQ",
      "max_marks": 10,
      "stimulus_bn": "সম্পূর্ণ উদ্দীপক দৃশ্যকল্প (সংখ্যা এবং SI একক সহ)...",
      "stimulus_en": "Complete stimulus text in English...",
      "sub_questions": [
        {"part": "ক", "text_bn": "জ্ঞানমূলক প্রশ্ন...", "text_en": "Knowledge question...", "marks": 1, "rubric_step_rules": "১ নম্বরের রুব্রিক নিয়ম..."},
        {"part": "খ", "text_bn": "অনুধাবনমূলক প্রশ্ন...", "text_en": "Comprehension question...", "marks": 2, "rubric_step_rules": "২ নম্বরের রুব্রিক নিয়ম..."},
        {"part": "গ", "text_bn": "প্রয়োগমূলক গাণিতিক প্রশ্ন...", "text_en": "Application calculation...", "marks": 3, "rubric_step_rules": "৩ নম্বরের রুব্রিক নিয়ম..."},
        {"part": "ঘ", "text_bn": "উচ্চতর দক্ষতামূলক বিশ্লেষণ...", "text_en": "Higher ability analysis...", "marks": 4, "rubric_step_rules": "৪ নম্বরের রুব্রিক নিয়ম..."}
      ]
    }
  ]
}
No markdown text outside JSON, no explanations.`;

    let generatedPaper: z.infer<typeof GeneratedPaperSchema> | null = null;
    try {
      const response = await ai.generate({
        model: MODELS.paper,
        prompt,
        output: { schema: GeneratedPaperSchema },
        config: { temperature: 0.2, maxOutputTokens: 3500 },
      });

      if (response.output) {
        generatedPaper = response.output;
      } else if (response.text) {
        const parsedJson = extractJsonFromResponse(response.text);
        generatedPaper = GeneratedPaperSchema.parse(parsedJson);
      }
    } catch (genkitErr) {
      console.warn("Direct generation failed, trying Gemini fallback with key rotation:", genkitErr);
      const rawText = await generateWithGeminiFallback(prompt, {
        temperature: 0.2,
        model: FALLBACK_REASONING_MODEL,
      });
      if (!rawText) throw new Error("generateQuestionPaper: model returned no output");
      const parsedJson = extractJsonFromResponse(rawText);
      generatedPaper = GeneratedPaperSchema.parse(parsedJson);
    }

    if (!generatedPaper || !generatedPaper.questions || generatedPaper.questions.length === 0) {
      throw new Error("generateQuestionPaper: failed to parse or validate generated JSON output from model");
    }

    return generatedPaper;
  }
);
