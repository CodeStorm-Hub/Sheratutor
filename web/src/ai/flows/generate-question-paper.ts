import { z } from "genkit";
import { ai, MODELS, FALLBACK_REASONING_MODEL } from "@/ai/genkit";
import { OpenAI } from "openai";

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

const CQSubQuestionSchema = z.object({
  part: z.enum(["ক", "খ", "গ", "ঘ"]),
  text_bn: z.string(),
  text_en: z.string().optional().default(""),
  marks: z.number(),
  rubric_step_rules: z.string(),
});

const GeneratedQuestionSchema = z.object({
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
  async ({ chapterIds, paperType, difficulty, totalMarks, languagePreference: _languagePreference }) => {
    // Limit to 3 chapters to prevent context overload and timeouts
    const cappedChapterIds = chapterIds.slice(0, 3);

    const supabase = (await import("@/lib/supabase/service-role")).getServiceRoleClient();
    const { data: chaptersData } = await supabase
      .from("chapters")
      .select("id, chapter_no, title_en, title_bn")
      .in("id", cappedChapterIds);

    const chapterTitles = (chaptersData || [])
      .map((c) => `[ID: ${c.id}] Chapter ${c.chapter_no}: ${c.title_en}`)
      .join("\n");

    let questionCountsInstruction = "";
    if (paperType === "CQ") {
      const cqCount = Math.max(1, Math.round(totalMarks / 10));
      questionCountsInstruction = `Generate an array of exactly ${cqCount} distinct Creative Question(s) (CQ) in the "questions" JSON array. Each CQ is worth 10 marks and MUST have a complete Bengali stimulus (উদ্দীপক) and 4 sub-questions: ক (1 mark, জ্ঞানমূলক), খ (2 marks, অনুধাবনমূলক), গ (3 marks, প্রয়োগমূলক গাণিতিক), ঘ (4 marks, উচ্চতর দক্ষতামূলক গাণিতিক/বিশ্লেষণমূলক). The total marks across all ${cqCount} questions must be ${cqCount * 10}.`;
    } else if (paperType === "MCQ") {
      const mcqCount = Math.min(25, Math.max(5, totalMarks));
      questionCountsInstruction = `Generate an array of exactly ${mcqCount} Multiple Choice Question(s) (MCQ) in the "questions" JSON array. Each MCQ is worth 1 mark, with 4 distinct options (ক, খ, গ, ঘ) and 1 correct option.`;
    } else {
      const cqCount = Math.max(1, Math.floor((totalMarks * 0.7) / 10));
      const mcqCount = Math.max(2, totalMarks - cqCount * 10);
      questionCountsInstruction = `Generate an array of exactly ${cqCount} Creative Question(s) (10 marks each) and ${mcqCount} MCQ(s) (1 mark each) in the "questions" JSON array.`;
    }

    // Kept deliberately compact — this runs as a Vercel server action with a
    // hard 60s function limit, so a shorter prompt + capped output is what
    // keeps generation from timing out. No worked example (models copied it).
    const prompt = `You are a senior Bangladeshi NCTB SSC Physics examiner writing an authentic ${difficulty} board mock exam in Bengali.
${questionCountsInstruction}

RULES:
- Every CQ: 10 marks; a realistic Bengali "stimulus_bn" with numbers + SI units; exactly 4 "sub_questions":
  ক (1, জ্ঞানমূলক — a definition/law), খ (2, অনুধাবনমূলক — conceptual), গ (3, প্রয়োগমূলক — a calculation using a standard formula), ঘ (4, উচ্চতর দক্ষতামূলক — analysis/graph/comparison).
  Each sub-question also needs "text_en" and short "rubric_step_rules" (Bengali, how the marks are split).
- Every MCQ: 1 mark; "mcq_question_bn", "mcq_options" (4 distinct: ক/খ/গ/ঘ), "mcq_correct_option" (exact match of one option).
- Every question needs a "chapter_id" from: ${cappedChapterIds.join(", ")}.
- Invent fresh original scenarios and numbers.

Return ONLY a JSON object: {"questions":[{ "chapter_id","question_type":"CQ"|"MCQ","max_marks", ...CQ or MCQ fields as above }]}. No prose, no markdown fences.

CURRICULUM CHAPTERS:
${chapterTitles}
`;

    let generatedPaper: z.infer<typeof GeneratedPaperSchema> | null = null;
    try {
      const response = await ai.generate({
        model: MODELS.paper,
        prompt,
        config: { temperature: 0.2, maxOutputTokens: 2200 },
      });

      if (response.text) {
        const parsedJson = extractJsonFromResponse(response.text);
        generatedPaper = GeneratedPaperSchema.parse(parsedJson);
      }
    } catch (genkitErr) {
      console.warn("Direct generation failed, trying NIM OpenAI-client fallback:", genkitErr);
      // Fall back to a DIFFERENT live NIM model than MODELS.paper so a
      // per-model outage (e.g. the retired nemotron-3-nano-30b-a3b that used
      // to 410 here) still has a working path. Always NIM now — no AgentRouter.
      const fallbackModel = FALLBACK_REASONING_MODEL.replace(/^(?:nim|agentrouter)\//, "");
      const client = new OpenAI({
        apiKey: process.env.NVIDIA_NIM_API_KEY ?? "",
        baseURL: "https://integrate.api.nvidia.com/v1",
        // Stay well under Vercel's 60s function limit — a longer client
        // timeout just means the whole action is killed mid-wait.
        timeout: 40000,
      });

      const completion = await client.chat.completions.create({
        model: fallbackModel,
        messages: [
          {
            role: "system",
            content: "You are a senior Bangladeshi NCTB SSC Physics examiner. Return ONLY a valid JSON object matching the requested schema with NO markdown code block wrappers or commentary.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 2200,
      });

      const parsedCompletion = typeof completion === "string" ? JSON.parse(completion) : completion;
      const rawText = parsedCompletion.choices?.[0]?.message?.content ?? "";
      if (!rawText) throw new Error("generateQuestionPaper: model returned no output");
      const parsedJson = extractJsonFromResponse(rawText);
      generatedPaper = GeneratedPaperSchema.parse(parsedJson);
    }

    if (!generatedPaper || !generatedPaper.questions) {
      throw new Error("generateQuestionPaper: failed to parse or validate generated JSON output from model");
    }

    return generatedPaper;
  }
);
