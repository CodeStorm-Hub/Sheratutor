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

/**
 * Layer 5 / FR-CHAT-01-02: "Explain it simply" — pre-loaded with the exact
 * question, the student's answer chunk, and the rubric failure reason.
 * Scoped system prompt refuses to wander into unrelated territory; a minor
 * talking to an open-ended agent with no topic boundary was flagged as a
 * real risk in review, not just a nice-to-have.
 */
export const tutorChatFlow = ai.defineFlow(
  {
    name: "tutorChat",
    inputSchema: z.object({
      questionText: z.string(),
      studentAnswerChunk: z.string(),
      rubricFailureReason: z.string(),
      studentMessage: z.string(),
      languagePreference: z.enum(["bn", "en"]).default("bn"),
    }),
    outputSchema: z.object({
      reply: z.string(),
      safety: SafetyCheckResult,
    }),
  },
  async ({ questionText, studentAnswerChunk, rubricFailureReason, studentMessage, languagePreference }) => {
    const safety = preFilterSafety(studentMessage);
    if (safety.flagged) {
      return { reply: SAFE_ESCALATION_MESSAGE_BN, safety };
    }

    const { text } = await ai.generate({
      model: MODELS.reasoning,
      prompt:
        `You are SheraTutor's "Explain it simply" AI tutor, talking to a Bangladeshi SSC ` +
        `student (age 13-19). Stay strictly scoped to explaining the academic concept below using ` +
        `plain-language analogies appropriate for a teenager. Reply in ${languagePreference === "bn" ? "natural conversational Bangla" : "plain English"}.\n\n` +
        `If the student asks about anything unrelated to this academic topic (personal advice, ` +
        `other subjects entirely unprompted, anything inappropriate), gently redirect them back to ` +
        `studying this question rather than answering off-topic.\n\n` +
        `QUESTION: ${questionText}\n` +
        `STUDENT'S ANSWER (the part being discussed): ${studentAnswerChunk}\n` +
        `WHY MARKS WERE LOST: ${rubricFailureReason}\n\n` +
        `STUDENT: ${studentMessage}`,
      config: { temperature: 0.5 },
    });

    return { reply: text, safety };
  }
);
