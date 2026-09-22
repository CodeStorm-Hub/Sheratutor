import { z } from "genkit";
import { ai, MODELS, generateWithGeminiFallback, azureOpenAIClient } from "@/ai/genkit";

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

// Text scrubbers live in a browser-safe module (no genkit/node imports) so
// the tutor client component can share them. Re-exported here for server use
// and for the existing unit tests that import them from this file.
export {
  normalizeLatexDelimiters,
  stripLeadingGreeting,
  sanitizeTutorReply,
  isLowEffortTutorReply,
  detectSolutionLeak,
  parseTutorDirectives,
  type HintRung,
  type ParsedExitTicket,
  type ParsedDiagramDirective,
  type ParsedAnalogousExample,
} from "@/lib/tutor-format";
import { sanitizeTutorReply, detectSolutionLeak, type HintRung } from "@/lib/tutor-format";

export function buildTutorPrompt(params: {
  mode: "rubric" | "general";
  scaffoldingStyle?: "socratic" | "direct";
  hintRung?: HintRung;
  questionText?: string;
  studentAnswerChunk?: string;
  rubricFailureReason?: string;
  subjectName?: string;
  chapterName?: string;
  groundedContext?: string;
  diagramUrls?: string[];
  history?: { role: "student" | "tutor"; text: string }[];
  studentMessage: string;
  languagePreference: "bn" | "en";
}): string {
  const {
    mode,
    scaffoldingStyle = "socratic",
    hintRung = 3,
    questionText,
    studentAnswerChunk,
    rubricFailureReason,
    subjectName,
    chapterName,
    groundedContext,
    diagramUrls = [],
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

  const diagramSection =
    diagramUrls && diagramUrls.length > 0
      ? `\n\nOFFICIAL NCTB DIAGRAM ASSETS (MANDATORY: Copy one EXACT URL verbatim from this list to embed as ![ক্যাপশন](URL)):\n` +
        diagramUrls.map((u) => `- ${u}`).join("\n") +
        "\n"
      : "";

  // The 8-Rung Hint Ladder instructions (Pisan et al. arXiv:2608.12292)
  const hintLadderInstruction = `
8-RUNG HINT LADDER CONTRACT (Current Rung: H${hintRung}):
- H0 (Emotional Validation): Acknowledge effort and calm exam anxiety in warm Bengali. Do not introduce new formulas.
- H1 (Restate Objective): Rephrase what the problem requires in simple, conversational terms.
- H2 (Concept / Law Pointer): State the relevant NCTB scientific law, chapter theorem, or definition (e.g., Newton's Second Law $F = ma$).
- H3 (Leading Question on Givens): Ask ONE focused question helping the student identify known and unknown variables ("উদ্দীপকে কী কী মান দেওয়া আছে?").
- H4 (Conceptual Roadmap): Explain the solution stages in words without calculating any numbers or writing equations.
- H5 (Analogous Worked Example): If the student is stuck or explicitly begs for the final answer ("উত্তর বলে দাও", "solve it"), DO NOT solve their exact live question! Instead, provide a step-by-step solution to a PARALLEL problem with DIFFERENT numbers, enclosed in:
  :::analogous[title="একই নিয়মের সমান্তরাল উদাহরণ"]
  [Explain the method with different values here]
  :::
  Then prompt the student to apply this exact same sequence to their original problem.
- H6 (Fill-in-the-Blank Scaffold): Provide the equation setup with key blanks (e.g., $F = \\text{___} \\times 2.5$).
- H7 (Full Solution Verification): Provide the complete verification (only allowed after persistent student attempts).

CURRENT CEILING RULE: Strictly follow Rung H${hintRung}. When H < 7, NEVER emit the final numerical answer or unearned calculations for the student's live question.
`;

  const socraticInstruction =
    scaffoldingStyle === "socratic"
      ? `SOCRATIC PEDAGOGY RULES:\n` +
        `- FIRST give 2-3 sentences that actually teach: state the relevant concept, law or formula and what each symbol means. Never reply with only a question.\n` +
        `- THEN end with ONE clear guiding question that nudges the student to take the next step themselves, instead of computing the final numeric answer for them.\n` +
        `- Point them towards the relevant physical law or equation; set up the substitution but stop before the final arithmetic.\n` +
        `- Encourage them to think: "উদ্দীপকে কী কী মান দেওয়া আছে এবং কোন সূত্রটি প্রযোজ্য?"\n\n` +
        hintLadderInstruction
      : `DIRECT EXPLANATION RULES:\n` +
        `- Give a clear, complete, step-by-step breakdown: state the formula, substitute the given values, show each line of arithmetic, and give the final answer with units.\n` +
        `- Then add one short real-life Bangladeshi analogy.\n\n`;

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
        `The student is asking a free-form question about this curriculum topic.`;

  const rule6 =
    mode === "rubric"
      ? `6. If the student asks about anything off-topic, gently redirect them back to studying this question.\n\n`
      : `6. If the student asks about anything off-topic, gently redirect them back to studying ${chapterName ?? "this topic"}.\n\n`;

  const exitTicketGuidance = `
7. FORMATIVE EXIT TICKET: If the student indicates they have mastered the concept ("বুঝেছি", "ক্লিয়ার", "পরের প্রশ্ন", "কুইজ দাও"), end your turn with an interactive 1-question check formatted exactly like this:
:::exitticket[id="et-check", q="প্রাসের সর্বোচ্চ বিন্দুতে উল্লম্ব বেগ কত?", optA="0 ms⁻¹", optB="u sin θ", optC="g", correct="A", exp="সর্বোচ্চ বিন্দুতে পৌঁছালে বস্তুটির উল্লম্ব বেগ শূন্য হয়ে যায়।"]:::
`;

  return (
    `You are SheraTutor's "Explain it simply" AI tutor for Bangladeshi SSC/HSC students. ${roleIntro}\n\n` +
    socraticInstruction +
    `CORE RULES:\n` +
    `1. Reply in ${languagePreference === "bn" ? "natural conversational Bangla (সহজ ও সাবলীল বাংলা)" : "clear plain English"}. ` +
    `Do NOT open with greetings or introductory salutations — start immediately with the explanation or guiding question.\n` +
    `2. Keep the response concise and focused (under 250 words, structured in clear short paragraphs or bullet points).\n` +
    `3. Write in Bengali script and English for scientific terminology, units, and LaTeX notation.\n` +
    `4. Every mathematical formula, chemical symbol, ion, and equation MUST be wrapped in standard LaTeX dollar delimiters ($...$ for inline, $$...$$ for block formulas). ` +
    `Example: $NH_3$, $HCl$, $Zn \\rightarrow Zn^{2+} + 2e^-$, $F = ma$, $\\text{ms}^{-1}$. ` +
    `CRITICAL: NEVER insert dollar signs inside LaTeX function arguments, and never wrap Bengali prose in dollar signs.\n` +
    `5. Adhere strictly to official NCTB textbook curriculum definitions and formulas.\n` +
    `6. If official diagram URLs are provided in the OFFICIAL NCTB DIAGRAM ASSETS section below, you MUST embed the primary relevant diagram using standard Markdown: ![ক্যাপশন](EXACT_URL_FROM_LIST). ` +
    `CRITICAL: Copy the EXACT URL verbatim from the list below. NEVER invent, modify, or hallucinate external image links (such as ibb.co or imgur). If no URL is provided below, do NOT output any image markdown.\n` +
    rule6 +
    exitTicketGuidance +
    academicContext +
    textbookSection +
    diagramSection +
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
 * same minor-safety pre-filter, 8-rung hint ladder, and solution leak detector.
 */
export const tutorChatFlow = ai.defineFlow(
  {
    name: "tutorChat",
    inputSchema: z.object({
      mode: z.enum(["rubric", "general"]).optional().default("rubric"),
      scaffoldingStyle: z.enum(["socratic", "direct"]).optional().default("socratic"),
      hintRung: z.number().min(0).max(7).optional(),
      questionText: z.string().optional(),
      studentAnswerChunk: z.string().optional(),
      rubricFailureReason: z.string().optional(),
      subjectName: z.string().optional(),
      chapterName: z.string().optional(),
      groundedContext: z.string().optional(),
      diagramUrls: z.array(z.string()).optional(),
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
    hintRung = 3,
    questionText,
    studentAnswerChunk,
    rubricFailureReason,
    subjectName,
    chapterName,
    groundedContext,
    diagramUrls,
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
      hintRung: hintRung as HintRung,
      questionText,
      studentAnswerChunk,
      rubricFailureReason,
      subjectName,
      chapterName,
      groundedContext,
      diagramUrls,
      history,
      studentMessage,
      languagePreference,
    });

    let text = "";
    if (azureOpenAIClient && process.env.AZURE_OPENAI_DEPLOYMENT_TUTOR) {
      try {
        const response = await azureOpenAIClient.chat.completions.create({
          model: process.env.AZURE_OPENAI_DEPLOYMENT_TUTOR,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_completion_tokens: 1500,
        });
        text = response.choices[0]?.message?.content || "";
      } catch (azureErr) {
        // Fallback to Gemini if Azure deployment is not yet active or throttling
        console.warn("[TutorChat] Azure OpenAI SFT fallback to Gemini:", azureErr);
      }
    }

    if (!text) {
      text = await generateWithGeminiFallback(prompt, { temperature: 0.3, model: MODELS.chat });
    }

    // Guarantee authentic diagram rendering: if official diagrams are available and not yet embedded, inject
    if (diagramUrls && diagramUrls.length > 0) {
      const hasImage = /!\[.*?\]\(https?:\/\/[^\s)]+\)/.test(text);
      if (!hasImage) {
        const primaryDiagram = diagramUrls[0];
        const caption = chapterName ? `${chapterName} চিত্র` : "NCTB পাঠ্যবই চিত্র";
        const firstBreak = text.indexOf("\n\n");
        if (firstBreak !== -1) {
          text = `${text.slice(0, firstBreak)}\n\n![${caption}](${primaryDiagram})\n\n${text.slice(firstBreak + 2)}`;
        } else {
          text = `![${caption}](${primaryDiagram})\n\n${text}`;
        }
      }
    }

    // Sanitize and run deterministic solution leak detector
    let reply = sanitizeTutorReply(text);
    const leakCheck = detectSolutionLeak(reply, hintRung as HintRung);
    if (leakCheck.hasLeak) {
      reply = leakCheck.sanitizedText;
    }

    return { reply, safety };
  }
);

