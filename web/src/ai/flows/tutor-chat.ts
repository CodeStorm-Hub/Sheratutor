import { z } from "genkit";
import { ai, MODELS } from "@/ai/genkit";

const SELF_HARM_PATTERNS = [
  /suicid/i, /kill myself/i, /self.?harm/i, /want to die/i, /আত্মহত্যা/, /মরে যেতে/,
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
function preFilterSafety(message: string): z.infer<typeof SafetyCheckResult> {
  if (SELF_HARM_PATTERNS.some((p) => p.test(message))) {
    return { flagged: true, category: "self_harm" };
  }
  return { flagged: false, category: "none" };
}

export const SAFE_ESCALATION_MESSAGE_BN =
  "তোমার কথা শুনে আমি চিন্তিত। আমি একজন AI টিউটর, এই বিষয়ে সাহায্য করতে পারবো না। " +
  "অনুগ্রহ করে এখনই কাছের কোনো বিশ্বস্ত বড় মানুষ, শিক্ষক বা Kaan Pete Roi (হেল্পলাইন: ০৯৬১৩৪২৭৮০০) এর সাথে কথা বলো।";

export const ChatMessageSchema = z.object({
  role: z.enum(["student", "tutor"]),
  text: z.string(),
});

/**
 * Layer 5 / FR-CHAT-01-02: "Explain it simply" — pre-loaded with the exact
 * question, the student's answer chunk, rubric deduction details, and grounded textbook context.
 * Supports multi-turn conversation history and renders formulas using LaTeX.
 * Scoped system prompt refuses to wander into unrelated territory; minor-safety pre-filter protects against distress.
 */
export const tutorChatFlow = ai.defineFlow(
  {
    name: "tutorChat",
    inputSchema: z.object({
      questionText: z.string(),
      studentAnswerChunk: z.string(),
      rubricFailureReason: z.string(),
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
    questionText,
    studentAnswerChunk,
    rubricFailureReason,
    groundedContext,
    history = [],
    studentMessage,
    languagePreference,
  }) => {
    const safety = preFilterSafety(studentMessage);
    if (safety.flagged) {
      return { reply: SAFE_ESCALATION_MESSAGE_BN, safety };
    }

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

    const textbookSection = groundedContext
      ? `\n\nOFFICIAL NCTB TEXTBOOK CONTEXT:\n${groundedContext}\n`
      : "";

    const prompt =
      `You are SheraTutor's "Explain it simply" AI tutor, talking to a Bangladeshi SSC ` +
      `student (age 13-19). Your job is to explain why marks were deducted and help the student understand ` +
      `the underlying concept thoroughly using plain-language analogies, clear step-by-step logic, and encouraging feedback.\n\n` +
      `RULES:\n` +
      `1. Reply in ${languagePreference === "bn" ? "natural conversational Bangla (সহজ ও সাবলীল বাংলা)" : "clear plain English"}.\n` +
      `2. Format any mathematical formulas, physical quantities, and equations using standard LaTeX ($...$ for inline, $$...$$ for block equations). Examples: $s = ut + \\frac{1}{2}at^2$, $F = ma$, $v = \\frac{s}{t}$, $\\text{ms}^{-1}$.\n` +
      `3. Always adhere to official NCTB textbook physics terminology.\n` +
      `4. If the student asks for real-life analogies, give relatable examples (e.g. Dhaka traffic, bicycle motion, cricket ball throwing, electric fans).\n` +
      `5. If the student asks about anything unrelated to this academic topic (personal advice, unrelated subjects, inappropriate topics), gently redirect them back to studying this question.\n\n` +
      `ACADEMIC CONTEXT:\n` +
      `QUESTION: ${questionText}\n` +
      `STUDENT'S ANSWER (discussed snippet): ${studentAnswerChunk}\n` +
      `WHY MARKS WERE LOST / RUBRIC DEDUCTION: ${rubricFailureReason}` +
      textbookSection +
      historyPrompt +
      `\n\nSTUDENT: ${studentMessage}\n\nAI TUTOR:`;

    const { text } = await ai.generate({
      model: MODELS.reasoning,
      prompt,
      config: { temperature: 0.5 },
    });

    return { reply: text, safety };
  }
);
