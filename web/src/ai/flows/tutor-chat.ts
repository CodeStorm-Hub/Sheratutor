import { z } from "genkit";
import { ai, MODELS } from "@/ai/genkit";
import { OpenAI } from "openai";

const SELF_HARM_PATTERNS = [
  /suicid/i, /kill myself/i, /self.?harm/i, /want to die/i, /আত্মহত্যা/, /মরে যেতে/,
  /মারধর/, /অত্যাচার/, /abuse/i, /bullying/i, /হতাশ হয়ে গেছি/,
];

export const SafetyCheckResult = z.object({
  flagged: z.boolean(),
  category: z.enum(["none", "self_harm", "abuse_disclosure", "off_topic_unsafe"]),
});

/**
 * Cheap pre-filter for a minor-safety escalation path (docs/review §8.4 —
 * the original spec had zero moderation on an open-ended chatbot talking to
 * 13-year-olds). This is NOT a substitute for a real moderation API before
 * scale; it's a floor, not a ceiling. Any hit routes to a fixed safe-response
 * plus an audit_log entry rather than reaching the LLM.
 */
export function preFilterSafety(message: string): z.infer<typeof SafetyCheckResult> {
  if (SELF_HARM_PATTERNS.some((p) => p.test(message))) {
    return { flagged: true, category: "self_harm" };
  }
  return { flagged: false, category: "none" };
}

export const SAFE_ESCALATION_MESSAGE_BN =
  "তোমার কথা শুনে আমি চিন্তিত। আমি একজন AI টিউটর, এই বিষয়ে সাহায্য করতে পারবো না। " +
  "অনুগ্রহ করে এখনই কাছের কোনো বিশ্বস্ত বড় মানুষ, শিক্ষক বা Kaan Pete Roi (হেল্পলাইন: ০৯৬১৩৪২৭৮০০) এর সাথে কথা বলো।";

/**
 * Safety net for models that ignore rule #2 and wrap math in plain ()/[]
 * instead of $/$$ — remark-math only recognizes dollar delimiters, so
 * anything else renders as literal text. Only touches parens/brackets that
 * contain a LaTeX command (a backslash + letters, e.g. \frac, \Delta) so
 * ordinary prose parentheses are left alone.
 */
export function normalizeLatexDelimiters(text: string): string {
  return text
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, inner) => `$$${inner}$$`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, inner) => `$${inner}$`)
    .replace(/\(([^()\n]*\\[a-zA-Z][^()\n]*)\)/g, (_, inner) => `$${inner}$`)
    .replace(/\[([^[\]\n]*\\[a-zA-Z][^[\]\n]*)\]/g, (_, inner) => `$$${inner}$$`);
}

/**
 * Safety net for models that ignore rule #1 and open with a greeting anyway
 * (নমস্কার!, আসসালামু আলাইকুম!, হ্যালো, etc.) — strips one leading greeting
 * clause so replies start on the actual answer instead of small talk.
 */
export function stripLeadingGreeting(text: string): string {
  return text.replace(
    /^\s*(নমস্কার|আসসালামু আলাইকুম|হ্যালো|হাই|প্রিয় শিক্ষার্থী)[^,।!\n]*[,।!]\s*/i,
    ""
  );
}

export function buildTutorPrompt(params: {
  mode: "rubric" | "general";
  scaffoldingStyle?: "socratic" | "direct";
  questionText?: string;
  studentAnswerChunk?: string;
  rubricFailureReason?: string;
  subjectName?: string;
  chapterName?: string;
  groundedContext?: string;
  history?: { role: "student" | "tutor"; text: string }[];
  studentMessage: string;
  languagePreference: "bn" | "en";
}): string {
  const {
    mode,
    scaffoldingStyle = "socratic",
    questionText,
    studentAnswerChunk,
    rubricFailureReason,
    subjectName,
    chapterName,
    groundedContext,
    history = [],
    studentMessage,
    languagePreference,
  } = params;

  const historyPrompt =
    history.length > 0
      ? `\n\nCONVERSATION HISTORY:\n` +
        history
          .map(
            (m) =>
              `${m.role === "student" ? "STUDENT" : "AI TUTOR"}: ${m.text}`
          )
          .join("\n")
      : "";

  const sanitizedContext = groundedContext
    ? groundedContext.replace(/(?:বোমা|মারণাস্ত্র|হিরোশিমা|নাগাসাকি|bomb|weapon)/gi, "").trim()
    : "";

  const textbookSection = sanitizedContext
    ? `\n\nOFFICIAL NCTB TEXTBOOK CONTEXT:\n${sanitizedContext}\n`
    : "";

  const socraticInstruction =
    scaffoldingStyle === "socratic"
      ? `SOCRATIC PEDAGOGY RULES:\n` +
        `- Do NOT reveal the full direct solution or final mathematical calculation immediately.\n` +
        `- Help the student discover their mistake by asking ONE clear, guiding question at a time.\n` +
        `- Point them towards the relevant physical law or equation without solving it for them.\n` +
        `- Encourage them to think: "উদ্দীপকে কী কী মান দেওয়া আছে এবং কোন সূত্রটি প্রযোজ্য?"\n\n`
      : `DIRECT EXPLANATION RULES:\n` +
        `- Give a clear, direct, and complete step-by-step breakdown of the concept and formula.\n\n`;

  const roleIntro =
    mode === "rubric"
      ? `Your job is to explain why marks were deducted and help the student understand ` +
        `the underlying concept thoroughly using plain-language analogies, clear step-by-step logic, and encouraging feedback.`
      : `Your job is to answer the student's subject questions directly and thoroughly, using plain-language ` +
        `analogies, clear step-by-step logic, and encouraging feedback — like a patient one-on-one tutor.`;

  const academicContext =
    mode === "rubric"
      ? `ACADEMIC CONTEXT:\n` +
        `QUESTION: ${questionText ?? ""}\n` +
        `STUDENT'S ANSWER (discussed snippet): ${studentAnswerChunk ?? ""}\n` +
        `WHY MARKS WERE LOST / RUBRIC DEDUCTION: ${rubricFailureReason ?? ""}`
      : `ACADEMIC CONTEXT:\n` +
        `SUBJECT: ${subjectName ?? "General"}\n` +
        `CHAPTER: ${chapterName ?? "General"}\n` +
        `The student is asking a free-form question about this chapter — there is no graded answer to reference.`;

  const rule6 =
    mode === "rubric"
      ? `6. If the student asks about anything off-topic, gently redirect them back to studying this question.\n\n`
      : `6. If the student asks about anything off-topic, gently redirect them back to studying ${chapterName ?? "this chapter"}.\n\n`;

  return (
    `You are SheraTutor's "Explain it simply" AI tutor for Bangladeshi SSC/HSC Physics students. ${roleIntro}\n\n` +
    socraticInstruction +
    `CORE RULES:\n` +
    `1. Reply in ${languagePreference === "bn" ? "natural conversational Bangla (সহজ ও সাবলীল বাংলা)" : "clear plain English"}. ` +
    `Do NOT open with greetings or introductory salutations — start immediately with the explanation or guiding question.\n` +
    `2. Keep the response concise and focused (under 250 words, 2-3 short paragraphs or bullet points).\n` +
    `3. Write in Bengali script and English for scientific terminology, units, and LaTeX notation.\n` +
    `4. Every formula, physical quantity, and equation MUST be wrapped in LaTeX dollar delimiters ($...$ for inline, $$...$$ for block formulas). ` +
    `Example: $F = ma$, $s = ut + \\frac{1}{2}at^2$, $\\text{ms}^{-1}$.\n` +
    `5. Adhere to official NCTB textbook curriculum definitions and formulas.\n` +
    `6. Provide relatable real-life Bangladeshi analogies (e.g. Dhaka traffic, bicycle/rickshaw motion, cricket balls).\n` +
    rule6 +
    academicContext +
    textbookSection +
    historyPrompt +
    `\n\nSTUDENT: ${studentMessage}\n\nAI TUTOR:`
  );
}

export const ChatMessageSchema = z.object({
  role: z.enum(["student", "tutor"]),
  text: z.string(),
});

/**
 * Layer 5 / FR-CHAT-01-02: "Explain it simply" AI tutor. Two modes:
 *   'rubric'  — pre-loaded with the exact question, the student's answer
 *               chunk, and rubric deduction details (the original per-step panel).
 *   'general' — open subject tutoring from the standalone /dashboard/tutor
 *               page, grounded against a chosen subject/chapter instead of
 *               a specific graded question.
 * Both support multi-turn history, render formulas in LaTeX, and share the
 * same minor-safety pre-filter and off-topic redirect rules.
 */
export const tutorChatFlow = ai.defineFlow(
  {
    name: "tutorChat",
    inputSchema: z.object({
      mode: z.enum(["rubric", "general"]).optional().default("rubric"),
      scaffoldingStyle: z.enum(["socratic", "direct"]).optional().default("socratic"),
      questionText: z.string().optional(),
      studentAnswerChunk: z.string().optional(),
      rubricFailureReason: z.string().optional(),
      subjectName: z.string().optional(),
      chapterName: z.string().optional(),
      groundedContext: z.string().optional(),
      history: z.array(ChatMessageSchema).optional().default([]),
      studentMessage: z.string(),
      languagePreference: z.enum(["bn", "en"]).default("bn"),
    }),
    outputSchema: z.object({
      reply: z.string(),
      safety: SafetyCheckResult,
    }),
  },
  async ({
    mode,
    scaffoldingStyle = "socratic",
    questionText,
    studentAnswerChunk,
    rubricFailureReason,
    subjectName,
    chapterName,
    groundedContext,
    history = [],
    studentMessage,
    languagePreference,
  }) => {
    const safety = preFilterSafety(studentMessage);
    if (safety.flagged) {
      return { reply: SAFE_ESCALATION_MESSAGE_BN, safety };
    }

    const prompt = buildTutorPrompt({
      mode,
      scaffoldingStyle,
      questionText,
      studentAnswerChunk,
      rubricFailureReason,
      subjectName,
      chapterName,
      groundedContext,
      history,
      studentMessage,
      languagePreference,
    });

    let text: string = "";
    try {
      const res = await ai.generate({
        model: MODELS.reasoning,
        prompt,
        config: { temperature: 0.5 },
      });
      text = res.text;
    } catch (err) {
      console.warn("tutorChatFlow ai.generate failed, falling back to direct NIM client:", err);
      const isNim = (process.env.GENKIT_REASONING_MODEL ?? "").startsWith("nim/") || Boolean(process.env.NVIDIA_NIM_API_KEY);
      const modelName = (process.env.GENKIT_REASONING_MODEL ?? "nim/openai/gpt-oss-20b").replace(/^(?:nim|agentrouter)\//, "");
      const client = new OpenAI({
        apiKey: isNim
          ? (process.env.NVIDIA_NIM_API_KEY ?? "")
          : (process.env.AGENTROUTER_API_KEY ?? ""),
        baseURL: isNim
          ? "https://integrate.api.nvidia.com/v1"
          : (process.env.AGENTROUTER_BASE_URL ?? "https://agentrouter.org/v1"),
        defaultHeaders: isNim ? undefined : { "User-Agent": "Cline/3.0.0" },
      });
      const completion = await client.chat.completions.create({
        model: modelName,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
      });
      text = completion.choices?.[0]?.message?.content || "";
    }

    return { reply: stripLeadingGreeting(normalizeLatexDelimiters(text)), safety };
  }
);
