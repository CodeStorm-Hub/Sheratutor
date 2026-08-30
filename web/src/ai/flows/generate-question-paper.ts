import { z } from "genkit";
import { ai, MODELS } from "@/ai/genkit";
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

    const prompt = `You are a senior Bangladeshi NCTB SSC Physics examiner preparing an authentic ${difficulty} board mock exam in Bengali.
${questionCountsInstruction}

CORE NCTB PHYSICS RULES:
1. Every Creative Question (CQ) MUST be 10 marks and have:
   - "stimulus_bn": A realistic scientific scenario with numerical quantities and physical units ($ms^{-1}$, $ms^{-2}$, $kg$, $N$, $J$, $W$, $Pa$, $m^3$, $s$).
   - "sub_questions": Exactly 4 sub-questions:
     * Part "ক" (1 mark): জ্ঞানমূলক (Direct Physics definition or law, e.g. "ত্বরণ কাকে বলে?", "জড়তা কাকে বলে?", "কাজের মাত্রা কী?").
     * Part "খ" (2 marks): অনুধাবনমূলক (Conceptual explanation, e.g. "সুষম দ্রুতিতে চলমান বস্তুর ত্বরণ থাকতে পারে কি না ব্যাখ্যা করো।").
     * Part "গ" (3 marks): প্রয়োগমূলক (Direct mathematical calculation using standard formulas like $s = ut + \\frac{1}{2}at^2$, $v^2 = u^2 + 2as$, $F = ma$, $E_k = \\frac{1}{2}mv^2$).
     * Part "ঘ" (4 marks): উচ্চতর দক্ষতামূলক (Comparative analysis, energy conservation verification, or velocity-time graph analysis).
2. Every MCQ MUST be 1 mark with:
   - "mcq_question_bn": Clear question stem.
   - "mcq_options": Array of 4 distinct choices (ক, খ, গ, ঘ).
   - "mcq_correct_option": Exact string matching one of the options.
3. Assign each question a valid "chapter_id" from: ${cappedChapterIds.join(", ")}.
4. Return ONLY valid JSON matching this schema:

{
  "questions": [
    {
      "chapter_id": "${cappedChapterIds[0]}",
      "question_type": "CQ",
      "max_marks": 10,
      "stimulus_bn": "একটি স্থির অবস্থান থেকে যাত্রা শুরু করে 1200 kg ভরের একটি গাড়ি 2 ms^-2 সুষম ত্বরণে 10 s চলে। এরপর গাড়িটি 1 মিনিট সমবেগে চলে 5 সেকেন্ডে থেমে গেল।",
      "stimulus_en": "A car of mass 1200 kg starts from rest with uniform acceleration of 2 ms^-2 for 10 s, then moves with uniform velocity for 1 minute and stops in 5 s.",
      "sub_questions": [
        { "part": "ক", "text_bn": "ত্বরণ কাকে বলে?", "text_en": "What is acceleration?", "marks": 1, "rubric_step_rules": "সময়ের সাথে বস্তুর বেগের পরিবর্তনের হারকে ত্বরণ বলে।" },
        { "part": "খ", "text_bn": "সুষম দ্রুতিতে চলমান বস্তুর ত্বরণ থাকতে পারে কি না ব্যাখ্যা করো।", "text_en": "Explain whether an object moving with uniform speed can have acceleration.", "marks": 2, "rubric_step_rules": "সঠিক ব্যাখ্যা ও বৃত্তাকার গতির উদাহরণ দিলে ২ নম্বর।" },
        { "part": "গ", "text_bn": "গাড়িটির প্রথম 10 সেকেন্ডে অতিক্রান্ত দূরত্ব নির্ণয় করো।", "text_en": "Calculate the distance travelled by the car in the first 10 seconds.", "marks": 3, "rubric_step_rules": "s = ut + 1/2 at^2 সূত্র প্রয়োগে ১, মান বসিয়ে গণনায় ১, সঠিক এককসহ উত্তরে ১।" },
        { "part": "ঘ", "text_bn": "গাড়িটির সম্পূর্ণ যাত্রাপথের গড় দ্রুতি নির্ণয় করো এবং গতিপথের বেগ-সময় লেখচিত্র অঙ্কনপূর্বক বিশ্লেষণ করো।", "text_en": "Determine the average speed of the entire journey and analyze the velocity-time graph.", "marks": 4, "rubric_step_rules": "মোট দূরত্ব ও মোট সময় বের করে গড় দ্রুতি নির্ণয়ে ২, বেগ-সময় লেখচিত্রের বিশ্লেষণ ও যুক্তিতে ২।" }
      ]
    }
  ]
}

CURRICULUM CHAPTERS:
${chapterTitles}
`;

    let generatedPaper: z.infer<typeof GeneratedPaperSchema> | null = null;
    try {
      const response = await ai.generate({
        model: MODELS.paper,
        prompt,
        config: { temperature: 0.2 },
      });

      if (response.text) {
        const parsedJson = extractJsonFromResponse(response.text);
        generatedPaper = GeneratedPaperSchema.parse(parsedJson);
      }
    } catch (genkitErr) {
      console.warn("Direct generation failed, trying OpenAI client fallback:", genkitErr);
      const isNim = (process.env.GENKIT_PAPER_MODEL ?? "").startsWith("nim/") || Boolean(process.env.NVIDIA_NIM_API_KEY);
      const fallbackModel = (process.env.GENKIT_PAPER_MODEL ?? "nim/nvidia/nemotron-3-nano-30b-a3b").replace(/^(?:nim|agentrouter)\//, "");
      const client = new OpenAI({
        apiKey: isNim
          ? (process.env.NVIDIA_NIM_API_KEY ?? "")
          : (process.env.AGENTROUTER_API_KEY ?? "sk-fyHCgfRhMoqHHOzdjK8vYfC0rcXQjqRUkMKTrMkVRbIfyVXA"),
        baseURL: isNim
          ? "https://integrate.api.nvidia.com/v1"
          : (process.env.AGENTROUTER_BASE_URL ?? "https://agentrouter.org/v1"),
        defaultHeaders: isNim ? undefined : { "User-Agent": "Cline/3.0.0" },
        timeout: 120000,
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
