import { z } from "genkit";
import { ai, MODELS } from "@/ai/genkit";
import { withRetry } from "@/ai/retry";

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
 * Safety net for models that ignore rule #2 and wrap math in plain ()/[]
 * instead of $/$$ — remark-math only recognizes dollar delimiters, so
 * anything else renders as literal text. Only touches parens/brackets that
 * contain a LaTeX command (a backslash + letters, e.g. \frac, \Delta) so
 * ordinary prose parentheses are left alone.
 */
function normalizeLatexDelimiters(text: string): string {
  return text
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, inner) => `$$${inner}$$`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, inner) => `$${inner}$`)
    .replace(/\(([^()\n]*\\[a-zA-Z][^()\n]*)\)/g, (_, inner) => `$${inner}$`)
    .replace(/\[([^[\]\n]*\\[a-zA-Z][^[\]\n]*)\]/g, (_, inner) => `$$${inner}$$`);
}

export const ChatMessageSchema = z.object({
  role: z.enum(["student", "tutor"]),
  text: z.string(),
});

const TutorChatInputSchema = z.object({
  mode: z.enum(["rubric", "general"]).default("rubric"),
  questionText: z.string().optional(),
  studentAnswerChunk: z.string().optional(),
  rubricFailureReason: z.string().optional(),
  subjectName: z.string().optional(),
  chapterName: z.string().optional(),
  groundedContext: z.string().optional(),
  history: z.array(ChatMessageSchema).optional().default([]),
  studentMessage: z.string(),
  languagePreference: z.enum(["bn", "en"]).default("bn"),
});
type TutorChatInput = z.infer<typeof TutorChatInputSchema>;

function buildPrompt({
  mode,
  questionText,
  studentAnswerChunk,
  rubricFailureReason,
  subjectName,
  chapterName,
  groundedContext,
  history = [],
  studentMessage,
  languagePreference,
}: TutorChatInput): string {
  const historyPrompt =
    history.length > 0
      ? `\n\nCONVERSATION HISTORY:\n` +
        history
          .map((m) => `${m.role === "student" ? "STUDENT" : "AI TUTOR"}: ${m.text}`)
          .join("\n")
      : "";

  const textbookSection = groundedContext
    ? `\n\nOFFICIAL NCTB TEXTBOOK CONTEXT:\n${groundedContext}\n`
    : "";

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

  const rule5 =
    mode === "rubric"
      ? `5. If the student asks about anything unrelated to this academic topic (personal advice, unrelated subjects, inappropriate topics), gently redirect them back to studying this question.\n\n`
      : `5. If the student asks about anything unrelated to this subject/chapter (personal advice, unrelated subjects, inappropriate topics), gently redirect them back to studying ${chapterName ?? "this chapter"}.\n\n`;

  return (
    `You are SheraTutor's "Explain it simply" AI tutor, talking to a Bangladeshi SSC ` +
    `student (age 13-19). ${roleIntro}\n\n` +
    `RULES:\n` +
    `1. Reply in ${languagePreference === "bn" ? "natural conversational Bangla (সহজ ও সাবলীল বাংলা)" : "clear plain English"}.\n` +
    `2. Every formula, physical quantity, and equation MUST be wrapped in LaTeX dollar delimiters — $...$ for inline, $$...$$ for a standalone block equation. NEVER wrap math in plain parentheses () or square brackets [] instead of $ — those render as literal text, not math, and are wrong. ` +
    `Correct: $a = \\frac{\\Delta v}{\\Delta t}$, $s = ut + \\frac{1}{2}at^2$, $F = ma$, $\\text{ms}^{-1}$. ` +
    `Incorrect — do not do this: (a = \\frac{\\Delta v}{\\Delta t}), [F = ma].\n` +
    `3. Always adhere to official NCTB textbook physics terminology.\n` +
    `4. If the student asks for real-life analogies, give relatable examples (e.g. Dhaka traffic, bicycle motion, cricket ball throwing, electric fans).\n` +
    rule5 +
    academicContext +
    textbookSection +
    historyPrompt +
    `\n\nSTUDENT: ${studentMessage}\n\nAI TUTOR:`
  );
}

/**
 * Layer 5 / FR-CHAT-01-02: "Explain it simply" AI tutor. Two modes:
 *   'rubric'  — pre-loaded with the exact question, the student's answer
 *               chunk, and rubric deduction details (the original per-step panel).
 *   'general' — open subject tutoring from the standalone /dashboard/tutor
 *               page, grounded against a chosen subject/chapter instead of
 *               a specific graded question.
 * Both support multi-turn history, render formulas in LaTeX, and share the
 * same minor-safety pre-filter and off-topic redirect rules.
 *
 * Non-streaming — kept for the manual smoke-test scripts
 * (scripts/test-tutor-chat.ts, scripts/test-general-chat.ts). The live
 * /api/tutor-chat route uses streamTutorChat below instead.
 */
export const tutorChatFlow = ai.defineFlow(
  {
    name: "tutorChat",
    inputSchema: TutorChatInputSchema,
    outputSchema: z.object({
      reply: z.string(),
      safety: SafetyCheckResult,
    }),
  },
  async (input) => {
    const safety = preFilterSafety(input.studentMessage);
    if (safety.flagged) {
      return { reply: SAFE_ESCALATION_MESSAGE_BN, safety };
    }

    let text: string;
    try {
      ({ text } = await withRetry(() =>
        ai.generate({
          model: MODELS.reasoning,
          prompt: buildPrompt(input),
          config: { temperature: 0.5 },
        })
      ));
    } catch (err) {
      console.error("tutorChatFlow: ai.generate failed", {
        message: err instanceof Error ? err.message : err,
        cause: err instanceof Error ? err.cause : undefined,
      });
      throw err;
    }

    return { reply: normalizeLatexDelimiters(text), safety };
  }
);

export type TutorChatStreamEvent =
  | { type: "chunk"; text: string }
  | { type: "done"; reply: string; safety: z.infer<typeof SafetyCheckResult> };

/**
 * Streaming counterpart to tutorChatFlow, used by /api/tutor-chat. Yields the
 * full normalized reply text so far on every chunk (not a delta) — running
 * normalizeLatexDelimiters on a partial delta risks corrupting a regex match
 * that spans a chunk boundary, so re-running it on the accumulated text each
 * time is the simplest correct approach even though it re-does small work.
 */
export async function* streamTutorChat(input: TutorChatInput): AsyncGenerator<TutorChatStreamEvent> {
  const safety = preFilterSafety(input.studentMessage);
  if (safety.flagged) {
    yield { type: "chunk", text: SAFE_ESCALATION_MESSAGE_BN };
    yield { type: "done", reply: SAFE_ESCALATION_MESSAGE_BN, safety };
    return;
  }

  try {
    // Not wrapped in withRetry: ai.generateStream is synchronous and lazy —
    // the actual request only fires once the stream is consumed below, so
    // retrying the call itself wouldn't retry the network I/O that can
    // actually fail. Resuming a partially-streamed response is out of scope.
    const { stream, response } = ai.generateStream({
      model: MODELS.reasoning,
      prompt: buildPrompt(input),
      config: { temperature: 0.5 },
    });

    for await (const chunk of stream) {
      yield { type: "chunk", text: normalizeLatexDelimiters(chunk.accumulatedText) };
    }

    const finalResponse = await response;
    const reply = normalizeLatexDelimiters(finalResponse.text);
    yield { type: "done", reply, safety };
  } catch (err) {
    console.error("streamTutorChat: ai.generateStream failed", {
      message: err instanceof Error ? err.message : err,
      cause: err instanceof Error ? err.cause : undefined,
    });
    throw err;
  }
}
