import { z } from "genkit";
import { ai, MODELS, generateWithGeminiFallback } from "@/ai/genkit";

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
  try {
    return JSON.parse(cleanText);
  } catch (_firstErr) {
    try {
      // Fix unescaped backslashes commonly produced in LaTeX / chemistry / math
      // Negative lookahead keeps valid JSON escapes: " \ / b f n r t u####
      const sanitized = cleanText.replace(/\\(?!["\\\/bfnrtu]|u[0-9a-fA-F]{4})/g, "\\\\");
      return JSON.parse(sanitized);
    } catch (_secondErr) {
      // Aggressive: escape ALL backslash-letter sequences (including \t \r \n \b \f)
      // This may lose whitespace semantics but ensures valid JSON
      const aggressiveSanitized = cleanText.replace(/\\([a-zA-Z])/g, "\\\\$1");
      return JSON.parse(aggressiveSanitized);
    }
  }
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

// Schema for CQ-only generation (used in split MIXED generation)
const CQOnlySchema = z.object({
  questions: z.array(
    z.object({
      chapter_id: z.string(),
      question_type: z.literal("CQ"),
      max_marks: z.number(),
      stimulus_bn: z.string().nullable().optional(),
      stimulus_en: z.string().nullable().optional(),
      sub_questions: z.array(CQSubQuestionSchema).min(4),
    })
  ),
});

// Schema for MCQ-only generation (used in split MIXED generation)
const MCQOnlySchema = z.object({
  questions: z.array(
    z.object({
      chapter_id: z.string(),
      question_type: z.literal("MCQ"),
      max_marks: z.number(),
      mcq_question_bn: z.string().nullable().optional(),
      mcq_question_en: z.string().nullable().optional(),
      mcq_options: z.array(z.string()).min(4),
      mcq_correct_option: z.string().nullable().optional(),
    })
  ),
});

/**
 * Generate questions via ai.generate with fallback to raw-text extraction.
 * Works for any output schema that has a `questions` array.
 */
async function generateWithFallback<T>(
  prompt: string,
  schema: z.ZodType<T>,
  maxOutputTokens = 8192
): Promise<T> {
  try {
    const response = await ai.generate({
      model: MODELS.paper,
      prompt,
      output: { schema },
      config: { temperature: 0.2, maxOutputTokens },
    });

    if (response.output) return response.output;

    if (response.text) {
      const parsedJson = extractJsonFromResponse(response.text);
      return schema.parse(parsedJson);
    }
    throw new Error("No output from model");
  } catch (genkitErr: any) {
    console.warn("Direct generation failed, attempting raw-text extraction:", genkitErr?.message ?? genkitErr);

    // Try extracting from error's embedded response text
    const possibleRaw = genkitErr?.response?.text || genkitErr?.text || genkitErr?.rawText;
    if (possibleRaw) {
      try {
        const parsedJson = extractJsonFromResponse(possibleRaw);
        return schema.parse(parsedJson);
      } catch (_parseErr) {
        console.warn("Raw-text extraction failed, running key-rotation fallback:", _parseErr);
      }
    }

    // Last resort: key-rotation fallback
    const rawText = await generateWithGeminiFallback(prompt, {
      temperature: 0.2,
      model: MODELS.paper,
    });
    if (!rawText) throw new Error("generateWithFallback: model returned no output");
    const parsedJson = extractJsonFromResponse(rawText);
    return schema.parse(parsedJson);
  }
}

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
    // Allow up to 15 chapters to support full syllabus papers
    const cappedChapterIds = chapterIds.slice(0, 15);

    const supabase = (await import("@/lib/supabase/service-role")).getServiceRoleClient();
    const { data: chaptersData } = await supabase
      .from("chapters")
      .select("id, chapter_no, title_en, title_bn")
      .in("id", cappedChapterIds);

    const chapterTitles = (chaptersData || [])
      .map((c) => `[ID: ${c.id}] Chapter ${c.chapter_no}: ${c.title_en} (${c.title_bn || ""})`)
      .join("\n");

    const chapterIdsStr = cappedChapterIds.join(", ");
    const firstChapterId = cappedChapterIds[0];

    // ─── MIXED: Two parallel calls to avoid token truncation ───────────────
    if (paperType === "MIXED") {
      const cqCount = Math.max(1, Math.floor((totalMarks * 0.7) / 10));
      const mcqCount = Math.max(2, totalMarks - cqCount * 10);

      const cqPrompt = `You are a senior Bangladeshi NCTB SSC ${subjectNameEn} (${subjectNameBn}) board examiner writing an authentic ${difficulty} exam in Bengali.

MANDATORY: Generate EXACTLY ${cqCount} Creative Questions (CQ), 10 marks each.

CURRICULUM CHAPTERS:
${chapterTitles}

RULES:
1. Each CQ MUST have "question_type": "CQ", "max_marks": 10.
2. Each CQ MUST have a realistic Bengali stimulus (উদ্দীপক) in "stimulus_bn" with numerical data and SI units.
3. Each CQ MUST have "sub_questions" array with EXACTLY 4 items:
   - {"part": "ক", "marks": 1, "text_bn": "জ্ঞানমূলক প্রশ্ন...", "text_en": "...", "rubric_step_rules": "..."}
   - {"part": "খ", "marks": 2, "text_bn": "অনুধাবনমূলক প্রশ্ন...", "text_en": "...", "rubric_step_rules": "..."}
   - {"part": "গ", "marks": 3, "text_bn": "প্রয়োগমূলক গাণিতিক প্রশ্ন...", "text_en": "...", "rubric_step_rules": "..."}
   - {"part": "ঘ", "marks": 4, "text_bn": "উচ্চতর দক্ষতামূলক বিশ্লেষণ...", "text_en": "...", "rubric_step_rules": "..."}
4. Each question MUST have a "chapter_id" chosen from: ${chapterIdsStr}.
5. Distribute questions across chapters. In LaTeX, ALWAYS double-escape backslashes (\\\\Delta, \\\\rightarrow, \\\\text{}).

OUTPUT: Return ONLY valid JSON:
{
  "questions": [
    {
      "chapter_id": "${firstChapterId}",
      "question_type": "CQ",
      "max_marks": 10,
      "stimulus_bn": "সম্পূর্ণ উদ্দীপক (সংখ্যা ও SI একক সহ)...",
      "stimulus_en": "Complete stimulus in English...",
      "sub_questions": [
        {"part": "ক", "text_bn": "...", "text_en": "...", "marks": 1, "rubric_step_rules": "..."},
        {"part": "খ", "text_bn": "...", "text_en": "...", "marks": 2, "rubric_step_rules": "..."},
        {"part": "গ", "text_bn": "...", "text_en": "...", "marks": 3, "rubric_step_rules": "..."},
        {"part": "ঘ", "text_bn": "...", "text_en": "...", "marks": 4, "rubric_step_rules": "..."}
      ]
    }
  ]
}
No markdown, no explanation. Generate all ${cqCount} CQs.`;

      const mcqPrompt = `You are a senior Bangladeshi NCTB SSC ${subjectNameEn} (${subjectNameBn}) board examiner writing ${difficulty} MCQs in Bengali.

MANDATORY: Generate EXACTLY ${mcqCount} Multiple Choice Questions (MCQ), 1 mark each.

CURRICULUM CHAPTERS:
${chapterTitles}

RULES:
1. Each MCQ MUST have "question_type": "MCQ", "max_marks": 1.
2. Each MCQ MUST have "mcq_question_bn" (Bengali question text).
3. Each MCQ MUST have "mcq_options" array with exactly 4 items: ["ক) ...", "খ) ...", "গ) ...", "ঘ) ..."].
4. Each MCQ MUST have "mcq_correct_option" exactly matching one of the 4 options.
5. Each question MUST have a "chapter_id" chosen from: ${chapterIdsStr}.
6. Distribute questions evenly across chapters. In LaTeX, ALWAYS double-escape backslashes (\\\\Delta, \\\\text{}).

OUTPUT: Return ONLY valid JSON:
{
  "questions": [
    {
      "chapter_id": "${firstChapterId}",
      "question_type": "MCQ",
      "max_marks": 1,
      "mcq_question_bn": "প্রশ্নের টেক্সট...",
      "mcq_question_en": "Question text in English...",
      "mcq_options": ["ক) অপশন ১", "খ) অপশন ২", "গ) অপশন ৩", "ঘ) অপশন ৪"],
      "mcq_correct_option": "ক) অপশন ১"
    }
  ]
}
No markdown, no explanation. Generate all ${mcqCount} MCQs.`;

      // Run CQ and MCQ generation in parallel
      console.log(`Generating MIXED paper: ${cqCount} CQs + ${mcqCount} MCQs in parallel...`);
      const [cqResult, mcqResult] = await Promise.all([
        generateWithFallback(cqPrompt, CQOnlySchema, 8192),
        generateWithFallback(mcqPrompt, MCQOnlySchema, 8192),
      ]);

      const allQuestions = [
        ...cqResult.questions.map((q) => ({ ...q, question_type: "CQ" as const })),
        ...mcqResult.questions.map((q) => ({ ...q, question_type: "MCQ" as const })),
      ];

      console.log(`MIXED paper generated: ${cqResult.questions.length} CQs + ${mcqResult.questions.length} MCQs = ${allQuestions.length} total`);

      if (allQuestions.length === 0) {
        throw new Error("generateQuestionPaper: both CQ and MCQ generation returned empty arrays");
      }

      return GeneratedPaperSchema.parse({ questions: allQuestions });
    }

    // ─── CQ-only ────────────────────────────────────────────────────────────
    if (paperType === "CQ") {
      const cqCount = Math.max(1, Math.round(totalMarks / 10));
      const prompt = `You are a senior Bangladeshi NCTB SSC ${subjectNameEn} (${subjectNameBn}) board examiner writing an authentic ${difficulty} board exam in Bengali.

MANDATORY: Generate EXACTLY ${cqCount} Creative Questions (CQ), 10 marks each. Total: ${cqCount * 10} marks.

CURRICULUM CHAPTERS:
${chapterTitles}

RULES:
1. Each CQ MUST have "question_type": "CQ", "max_marks": 10.
2. Each CQ MUST have a realistic Bengali stimulus (উদ্দীপক) in "stimulus_bn" with numerical data and SI units.
3. Each CQ MUST have "sub_questions" array with EXACTLY 4 items:
   - {"part": "ক", "marks": 1} — জ্ঞানমূলক
   - {"part": "খ", "marks": 2} — অনুধাবনমূলক
   - {"part": "গ", "marks": 3} — প্রয়োগমূলক গাণিতিক
   - {"part": "ঘ", "marks": 4} — উচ্চতর দক্ষতামূলক বিশ্লেষণ
   Each must also have "text_bn", "text_en", and "rubric_step_rules".
4. Each question MUST have a "chapter_id" from: ${chapterIdsStr}.
5. Distribute questions across chapters. Double-escape LaTeX backslashes (\\\\Delta, \\\\rightarrow, \\\\text{}).

OUTPUT JSON:
{
  "questions": [
    {
      "chapter_id": "${firstChapterId}",
      "question_type": "CQ",
      "max_marks": 10,
      "stimulus_bn": "উদ্দীপক...",
      "stimulus_en": "Stimulus...",
      "sub_questions": [
        {"part": "ক", "text_bn": "...", "text_en": "...", "marks": 1, "rubric_step_rules": "..."},
        {"part": "খ", "text_bn": "...", "text_en": "...", "marks": 2, "rubric_step_rules": "..."},
        {"part": "গ", "text_bn": "...", "text_en": "...", "marks": 3, "rubric_step_rules": "..."},
        {"part": "ঘ", "text_bn": "...", "text_en": "...", "marks": 4, "rubric_step_rules": "..."}
      ]
    }
  ]
}
No markdown or explanation outside JSON. Generate all ${cqCount} CQs.`;

      const result = await generateWithFallback(prompt, CQOnlySchema, 8192);
      return GeneratedPaperSchema.parse({ questions: result.questions });
    }

    // ─── MCQ-only ───────────────────────────────────────────────────────────
    const mcqCount = Math.min(35, Math.max(5, totalMarks));
    const prompt = `You are a senior Bangladeshi NCTB SSC ${subjectNameEn} (${subjectNameBn}) board examiner writing ${difficulty} MCQs in Bengali.

MANDATORY: Generate EXACTLY ${mcqCount} Multiple Choice Questions (MCQ), 1 mark each. Total: ${mcqCount} marks.

CURRICULUM CHAPTERS:
${chapterTitles}

RULES:
1. Each MCQ MUST have "question_type": "MCQ", "max_marks": 1.
2. Each MCQ MUST have "mcq_question_bn" (Bengali question text).
3. Each MCQ MUST have "mcq_options" with exactly 4 items: ["ক) ...", "খ) ...", "গ) ...", "ঘ) ..."].
4. Each MCQ MUST have "mcq_correct_option" exactly matching one option.
5. Each question MUST have a "chapter_id" from: ${chapterIdsStr}.
6. Distribute questions across chapters. Double-escape LaTeX backslashes (\\\\Delta, \\\\text{}).

OUTPUT JSON:
{
  "questions": [
    {
      "chapter_id": "${firstChapterId}",
      "question_type": "MCQ",
      "max_marks": 1,
      "mcq_question_bn": "প্রশ্ন...",
      "mcq_question_en": "Question...",
      "mcq_options": ["ক) অপশন ১", "খ) অপশন ২", "গ) অপশন ৩", "ঘ) অপশন ৪"],
      "mcq_correct_option": "ক) অপশন ১"
    }
  ]
}
No markdown or explanation. Generate all ${mcqCount} MCQs.`;

    const result = await generateWithFallback(prompt, MCQOnlySchema, 8192);
    return GeneratedPaperSchema.parse({ questions: result.questions });
  }
);
