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
      // Negative lookahead keeps valid JSON escapes: " \ / b f n r t u
      const sanitized = cleanText.replace(/\\(?!["\\\/bfnrtu]|u[0-9a-fA-F]{4})/g, "\\\\");
      return JSON.parse(sanitized);
    } catch (_secondErr) {
      // Aggressive: escape ALL backslash-letter sequences (including \t \r \n \b \f)
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
          message: "Every CQ MUST contain exactly 4 sub_questions: ক (1), খ (2), গ (3), ঘ (4)",
          path: ["sub_questions"],
        });
      }
    } else if (data.question_type === "MCQ") {
      if (!data.mcq_options || data.mcq_options.length < 4) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Every MCQ MUST have at least 4 options",
          path: ["mcq_options"],
        });
      }
    }
  });

export const GeneratedPaperSchema = z.object({
  questions: z.array(GeneratedQuestionSchema),
});

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
    const possibleRaw = genkitErr?.response?.text || genkitErr?.text || genkitErr?.rawText;
    if (possibleRaw) {
      try {
        const parsedJson = extractJsonFromResponse(possibleRaw);
        return schema.parse(parsedJson);
      } catch (_parseErr) {
        console.warn("Raw-text extraction failed, running key-rotation fallback:", _parseErr);
      }
    }
    const rawText = await generateWithGeminiFallback(prompt, { temperature: 0.2, model: MODELS.paper });
    if (!rawText) throw new Error("generateWithFallback: model returned no output");
    const parsedJson = extractJsonFromResponse(rawText);
    return schema.parse(parsedJson);
  }
}

// ─── Shared CQ prompt rules (used by both CQ-only and MIXED CQ call) ────────
function buildCQPrompt({
  subjectNameEn,
  subjectNameBn,
  difficulty,
  cqCount,
  chapterTitles,
  chapterIdsStr,
  firstChapterId,
}: {
  subjectNameEn: string;
  subjectNameBn: string;
  difficulty: string;
  cqCount: number;
  chapterTitles: string;
  chapterIdsStr: string;
  firstChapterId: string;
}) {
  return `You are a senior NCTB SSC ${subjectNameEn} (${subjectNameBn}) board examiner. Write ${cqCount} authentic ${difficulty} Creative Questions (সৃজনশীল প্রশ্ন) in Bengali following NCTB 2025 board standards exactly.

MANDATORY: Generate EXACTLY ${cqCount} CQs. Each CQ = 10 marks (1+2+3+4).

CURRICULUM CHAPTERS (use these IDs and topics):
${chapterTitles}

══════════════════════════════════════════════════════
CRITICAL RULES — Follow EXACTLY or the output is invalid
══════════════════════════════════════════════════════

RULE 1 — STIMULUS (উদ্দীপক) REQUIREMENTS:
• Must be a concrete real-world scenario with SPECIFIC NUMBERS: atomic numbers (Z=11), percentages (৭৫%), concentrations (0.2 M), temperatures, chemical formulas with ΔH values, or physical quantities with SI units.
• Format: "মৌল A-এর পারমাণবিক সংখ্যা $11$ এবং মৌল B-এর পারমাণবিক সংখ্যা $17$।"
• ALL math, chemical symbols, formulas MUST be wrapped in $...$: use $H_2O$, $\\Delta H = -286\\text{ kJ/mol}$, $^{35}_{17}Cl$
• The stimulus must GROUND parts (গ) and (ঘ) — students must READ the stimulus to answer them.
• Do NOT write a generic stimulus — it must have specific numbers or data.

RULE 2 — PART (ক) — 1 mark — জ্ঞানমূলক (Knowledge):
• MUST be a simple definition question in exactly this pattern: "X কাকে বলে?" OR "X কী?"
• Examples: "আইসোটোপ কাকে বলে?", "মোলারিটি কাকে বলে?", "রেডক্স বিক্রিয়া কী?"
• NEVER ask a calculation in (ক). NEVER reference the stimulus in (ক).
• Rubric: "সঠিক ও সম্পূর্ণ সংজ্ঞার জন্য ১ নম্বর।"

RULE 3 — PART (খ) — 2 marks — অনুধাবনমূলক (Comprehension):
• MUST be a "কেন?" or "ব্যাখ্যা করো" question explaining a concept or phenomenon.
• Examples: "পটাশিয়ামের ১৯তম ইলেকট্রন $3d$ অরবিটালে না গিয়ে $4s$-এ যায় কেন?", "$CO_2$ গ্যাসীয় হলেও $SiO_2$ কঠিন কেন?"
• May or may not reference stimulus — 2 marks for a well-explained reason.
• Rubric: "সঠিক কারণ উল্লেখ করার জন্য ১ নম্বর, ব্যাখ্যার জন্য আরও ১ নম্বর।"

RULE 4 — PART (গ) — 3 marks — প্রয়োগমূলক (Application) — MUST BE NUMERICAL:
• MUST be a calculation/determination directly using the stimulus data.
• MUST contain one of these verbs: "গণনা করো", "নির্ণয় করো", "বের করো", "হিসাব করো", "অঙ্কন করো"
• MUST reference the উদ্দীপক (stimulus): "উদ্দীপকের X মৌলটির আপেক্ষিক পারমাণবিক ভর গণনা করো।"
• Rubric (MUST BE STEP-WISE, 3 separate steps):
  "সূত্র সঠিকভাবে লেখার জন্য ১ নম্বর, উদ্দীপক থেকে সঠিক মান বসানোর জন্য ১ নম্বর, সঠিক উত্তর পাওয়ার জন্য ১ নম্বর।"

RULE 5 — PART (ঘ) — 4 marks — উচ্চতর দক্ষতামূলক (Higher Ability) — MUST BE ANALYSIS:
• MUST compare two things from the stimulus OR analyze a trend/phenomenon.
• MUST contain one of: "বিশ্লেষণ করো", "যুক্তিসহ লেখো", "মূল্যায়ন করো", "তুলনা করো"
• MUST reference the উদ্দীপক: "উদ্দীপকের A ও B মৌলের..."
• Rubric (MUST BE STEP-WISE, 4 separate steps):
  "সংজ্ঞা/নীতি উল্লেখের জন্য ১ নম্বর, উদ্দীপকের তথ্য প্রয়োগের জন্য ১ নম্বর, তুলনামূলক বিশ্লেষণের জন্য ১ নম্বর, সঠিক সিদ্ধান্তের জন্য ১ নম্বর।"

RULE 6 — LaTeX:
• ALL mathematical expressions, chemical formulas, and symbols MUST be in $...$
• Correct: $H_2SO_4$, $\\Delta H = +178\\text{ kJ/mol}$, $^{35}_{17}Cl$, $1s^2 2s^2 2p^6$
• Wrong: H2SO4, ΔH = +178 kJ/mol (bare text without $...$)
• In JSON strings: use $...$ directly — do NOT double-escape the $ sign.

RULE 7 — Distribute questions evenly across these chapter IDs: ${chapterIdsStr}

══════════════════════════════════════════════════════
OUTPUT FORMAT — Return ONLY this valid JSON (no markdown, no text outside JSON):
══════════════════════════════════════════════════════
{
  "questions": [
    {
      "chapter_id": "${firstChapterId}",
      "question_type": "CQ",
      "max_marks": 10,
      "stimulus_bn": "মৌল $A$ এর পারমাণবিক সংখ্যা $11$ এবং মৌল $B$ এর পারমাণবিক সংখ্যা $17$। উভয় মৌল একত্রিত হয়ে একটি যৌগ গঠন করে এবং বিক্রিয়াটির $\\Delta H = -411\\text{ kJ/mol}$।",
      "stimulus_en": "Element A has atomic number 11 and element B has atomic number 17. Both elements combine to form a compound with ΔH = -411 kJ/mol.",
      "sub_questions": [
        {
          "part": "ক",
          "text_bn": "আয়নিক বন্ধন কাকে বলে?",
          "text_en": "What is an ionic bond?",
          "marks": 1,
          "rubric_step_rules": "আয়নিক বন্ধনের সঠিক ও সম্পূর্ণ সংজ্ঞার জন্য ১ নম্বর।"
        },
        {
          "part": "খ",
          "text_bn": "সমযোজী যৌগ বিদ্যুৎ পরিবাহী নয় কেন? ব্যাখ্যা করো।",
          "text_en": "Why are covalent compounds non-conductors of electricity? Explain.",
          "marks": 2,
          "rubric_step_rules": "মুক্ত আয়নের অনুপস্থিতির কারণ উল্লেখ করার জন্য ১ নম্বর, সঠিক ব্যাখ্যার জন্য আরও ১ নম্বর।"
        },
        {
          "part": "গ",
          "text_bn": "উদ্দীপকের $A$ ও $B$ মৌল দ্বারা গঠিত যৌগের সংকেত নির্ণয় করো এবং ইলেকট্রন বিন্যাসের মাধ্যমে বন্ধন গঠন প্রক্রিয়া দেখাও।",
          "text_en": "Determine the formula of the compound formed by elements A and B and show the bond formation process through electron configuration.",
          "marks": 3,
          "rubric_step_rules": "মৌল দুটির ইলেকট্রন বিন্যাস সঠিকভাবে লেখার জন্য ১ নম্বর, ইলেকট্রন আদান-প্রদান দেখানোর জন্য ১ নম্বর, সঠিক যৌগের সংকেত ($NaCl$) নির্ধারণের জন্য ১ নম্বর।"
        },
        {
          "part": "ঘ",
          "text_bn": "উদ্দীপকের যৌগটির গলনাঙ্ক, দ্রাব্যতা ও বিদ্যুৎ পরিবাহিতার বৈশিষ্ট্য বিশ্লেষণ করো এবং দৈনন্দিন জীবনে এর গুরুত্ব মূল্যায়ন করো।",
          "text_en": "Analyze the melting point, solubility, and electrical conductivity of the compound in the stimulus and evaluate its importance in daily life.",
          "marks": 4,
          "rubric_step_rules": "আয়নিক যৌগের উচ্চ গলনাঙ্কের কারণ বিশ্লেষণের জন্য ১ নম্বর, পানিতে দ্রাব্যতা ও বিচ্ছিন্ন আয়নের কারণ ব্যাখ্যার জন্য ১ নম্বর, গলিত বা দ্রবীভূত অবস্থায় বিদ্যুৎ পরিবাহিতার কারণ ব্যাখ্যার জন্য ১ নম্বর, দৈনন্দিন জীবনে গুরুত্ব সঠিকভাবে মূল্যায়নের জন্য ১ নম্বর।"
        }
      ]
    }
  ]
}

Generate all ${cqCount} CQs now. Every CQ must follow RULES 1–7 strictly.`;
}

// ─── Shared MCQ prompt ────────────────────────────────────────────────────────
function buildMCQPrompt({
  subjectNameEn,
  subjectNameBn,
  difficulty,
  mcqCount,
  chapterTitles,
  chapterIdsStr,
  firstChapterId,
}: {
  subjectNameEn: string;
  subjectNameBn: string;
  difficulty: string;
  mcqCount: number;
  chapterTitles: string;
  chapterIdsStr: string;
  firstChapterId: string;
}) {
  return `You are a senior NCTB SSC ${subjectNameEn} (${subjectNameBn}) board examiner. Write ${mcqCount} authentic ${difficulty} Multiple Choice Questions (বহুনির্বাচনী প্রশ্ন) in Bengali.

MANDATORY: Generate EXACTLY ${mcqCount} MCQs. Each MCQ = 1 mark.

CURRICULUM CHAPTERS:
${chapterTitles}

══════════════════════════════════════════════════════
MCQ RULES
══════════════════════════════════════════════════════

RULE 1 — QUESTION TYPES (use variety):
• Direct factual: "নিচের কোনটি সঠিক?"
• Negative: "নিচের কোনটি সঠিক নয়?"
• Assertion-Reason (i, ii, iii then "নিচের কোনটি সঠিক?" with ক) i ও ii, খ) ii ও iii, গ) i ও iii, ঘ) i, ii ও iii)
• Application: Given data, "এক্ষেত্রে কোনটি সঠিক?"

RULE 2 — OPTIONS:
• Exactly 4 options: "ক) ...", "খ) ...", "গ) ...", "ঘ) ..."
• All 4 options must be plausible — avoid obviously wrong distractors.
• Options must be parallel in structure and length.
• mcq_correct_option MUST exactly match one of the 4 options.

RULE 3 — LaTeX:
• Chemical formulas and math in $...$: "$H_2SO_4$", "$\\Delta H$", "$^{35}_{17}Cl$"

RULE 4 — Distribution:
• Distribute questions evenly across chapter IDs: ${chapterIdsStr}
• Vary Bloom levels: ~40% recall, ~35% comprehension, ~25% application.

RULE 5 — NO duplicate questions. Each question must test a different concept.

══════════════════════════════════════════════════════
OUTPUT: Return ONLY valid JSON:
══════════════════════════════════════════════════════
{
  "questions": [
    {
      "chapter_id": "${firstChapterId}",
      "question_type": "MCQ",
      "max_marks": 1,
      "mcq_question_bn": "$H_2O$ অণুতে O-H বন্ধন কোণ কত?",
      "mcq_question_en": "What is the O-H bond angle in the H₂O molecule?",
      "mcq_options": ["ক) $104.5°$", "খ) $109.5°$", "গ) $120°$", "ঘ) $180°$"],
      "mcq_correct_option": "ক) $104.5°$"
    }
  ]
}

Generate all ${mcqCount} MCQs now.`;
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

    const promptArgs = { subjectNameEn, subjectNameBn, difficulty, chapterTitles, chapterIdsStr, firstChapterId };

    // ─── MIXED: Two parallel calls (CQ + MCQ) to avoid token truncation ───────
    if (paperType === "MIXED") {
      const cqCount = Math.max(1, Math.floor((totalMarks * 0.7) / 10));
      const mcqCount = Math.max(2, totalMarks - cqCount * 10);

      console.log(`MIXED paper: generating ${cqCount} CQs + ${mcqCount} MCQs in parallel…`);

      const [cqResult, mcqResult] = await Promise.all([
        generateWithFallback(buildCQPrompt({ ...promptArgs, cqCount }), CQOnlySchema, 8192),
        generateWithFallback(buildMCQPrompt({ ...promptArgs, mcqCount }), MCQOnlySchema, 8192),
      ]);

      const allQuestions = [
        ...cqResult.questions.map((q) => ({ ...q, question_type: "CQ" as const })),
        ...mcqResult.questions.map((q) => ({ ...q, question_type: "MCQ" as const })),
      ];

      console.log(`MIXED complete: ${cqResult.questions.length} CQs + ${mcqResult.questions.length} MCQs = ${allQuestions.length} questions`);

      if (allQuestions.length === 0) throw new Error("generateQuestionPaper: both CQ and MCQ generation returned empty");
      return GeneratedPaperSchema.parse({ questions: allQuestions });
    }

    // ─── CQ-only ──────────────────────────────────────────────────────────────
    if (paperType === "CQ") {
      const cqCount = Math.max(1, Math.round(totalMarks / 10));
      const result = await generateWithFallback(buildCQPrompt({ ...promptArgs, cqCount }), CQOnlySchema, 8192);
      return GeneratedPaperSchema.parse({ questions: result.questions });
    }

    // ─── MCQ-only ─────────────────────────────────────────────────────────────
    const mcqCount = Math.min(35, Math.max(5, totalMarks));
    const result = await generateWithFallback(buildMCQPrompt({ ...promptArgs, mcqCount }), MCQOnlySchema, 8192);
    return GeneratedPaperSchema.parse({ questions: result.questions });
  }
);
