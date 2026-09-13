/**
 * Pure, dependency-free text scrubbers for tutor replies. Lives in `lib/` (not
 * `ai/`) so it is safe to import from client components — `ai/flows/tutor-chat`
 * pulls in genkit / node built-ins and must never reach the browser bundle.
 * `ai/flows/tutor-chat` re-exports these for the server side.
 */

/**
 * Normalizes standard LaTeX delimiters (\[ ... \] and \( ... \)) to the dollar
 * delimiters remark-math understands. Deliberately does NOT touch bare
 * parentheses/brackets so it can't corrupt \left(...\right) or Bengali text.
 */
export function normalizeLatexDelimiters(text: string): string {
  if (!text) return "";
  return text
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, inner) => `\n$$\n${String(inner).trim()}\n$$\n`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, inner) => `$${String(inner).trim()}$`);
}

/** Strips one leading greeting clause ("নমস্কার!", "আসসালামু আলাইকুম," …). */
export function stripLeadingGreeting(text: string): string {
  return (text ?? "").replace(
    /^\s*(নমস্কার|আসসালামু আলাইকুম|হ্যালো|হাই|প্রিয় শিক্ষার্থী)[^,।!\n]*[,।!]\s*/i,
    ""
  );
}

/**
 * Final scrub applied to every tutor reply — the flow path AND the raw agent
 * path, which previously returned model output untouched and leaked things
 * like `The final answer is \boxed{20}`.
 */
export function sanitizeTutorReply(text: string): string {
  if (!text) return "";
  let t = text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<\|(?:start|end|channel|message|assistant|final)\|>/g, "")
    .replace(/\\boxed\s*\{([^{}]*)\}/g, "$$$1$$")
    .trim();
  t = stripLeadingGreeting(normalizeLatexDelimiters(t));
  return t.trim();
}

/**
 * True when a tutor reply is so short/bare it clearly isn't the "2-3 short
 * paragraphs + a guiding question" the tutor is meant to give.
 */
export function isLowEffortTutorReply(text: string): boolean {
  const t = (text ?? "").trim();
  if (t.length < 120) return true;
  if (/^(the\s+)?(final\s+)?answer\s+is\b/i.test(t)) return true;
  return false;
}

export type HintRung = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface ExitTicketOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface ParsedExitTicket {
  id: string;
  question: string;
  options: ExitTicketOption[];
  explanation?: string;
}

export interface ParsedDiagramDirective {
  url: string;
  caption: string;
}

export interface ParsedAnalogousExample {
  title: string;
  content: string;
}

/**
 * Deterministic Solution Detector (Pisan et al. arXiv:2608.12292)
 * Ensures that when hintRung < 7, the tutor does not emit unearned final numerical
 * calculations or "the answer is X" conclusions to live exam questions.
 */
export function detectSolutionLeak(text: string, hintRung: HintRung = 3): {
  hasLeak: boolean;
  sanitizedText: string;
} {
  if (hintRung >= 7 || !text) {
    return { hasLeak: false, sanitizedText: text };
  }

  const solutionPatterns = [
    /(?:the\s+)?(?:final\s+)?(?:answer|result|kinetic energy|velocity|work done|acceleration|force)\s+(?:is|=|:)\s*([$]?\s*[0-9\u09E6-\u09EF][^\n.,]*)/gi,
    /(?:সুতরাং,?\s+)?(?:গাড়িটির\s+|বস্তুটির\s+)?(?:নির্ণেয়\s+|চূড়ান্ত\s+)?(?:উত্তর|গতিশক্তি|বেগ|বল|ত্বরণ|কাজ|দূরত্ব|ভর)\s*(?:হলো|হবে|:|ই হলো|=)\s*([$]?\s*[0-9\u09E6-\u09EF][^\n.,]*)/gi,
    /\\boxed\s*\{([^}]+)\}/gi,
  ];

  let leaked = false;
  let sanitized = text;

  for (const pattern of solutionPatterns) {
    if (pattern.test(sanitized)) {
      leaked = true;
      sanitized = sanitized.replace(
        pattern,
        "**[মানটি সূত্রে বসিয়ে নিজেই চূড়ান্ত উত্তরটি বের করো]**"
      );
    }
  }

  return {
    hasLeak: leaked,
    sanitizedText: sanitized,
  };
}

/**
 * Parse structured directives from tutor markdown replies.
 */
export function parseTutorDirectives(rawText: string): {
  cleanText: string;
  exitTicket?: ParsedExitTicket;
  diagrams: ParsedDiagramDirective[];
  analogousExamples: ParsedAnalogousExample[];
} {
  let cleanText = rawText || "";
  let exitTicket: ParsedExitTicket | undefined;
  const diagrams: ParsedDiagramDirective[] = [];
  const analogousExamples: ParsedAnalogousExample[] = [];

  // Parse :::exitticket[...]:::
  const exitTicketRegex = /:::exitticket\s*\[(.*?)\]:::/s;
  const etMatch = cleanText.match(exitTicketRegex);
  if (etMatch) {
    try {
      const paramStr = etMatch[1];
      const getParam = (key: string) => {
        const m = paramStr.match(new RegExp(`${key}\\s*=\\s*["']?([^"'\n\\]]+)["']?`));
        return m ? m[1].trim() : "";
      };
      const id = getParam("id") || `et-${Date.now()}`;
      const question = getParam("q") || getParam("question");
      const optA = getParam("optA");
      const optB = getParam("optB");
      const optC = getParam("optC");
      const correct = getParam("correct");
      const explanation = getParam("exp") || getParam("explanation");

      if (question && optA && optB) {
        exitTicket = {
          id,
          question,
          options: [
            { id: "A", label: optA, isCorrect: correct === "A" },
            { id: "B", label: optB, isCorrect: correct === "B" },
            ...(optC ? [{ id: "C", label: optC, isCorrect: correct === "C" }] : []),
          ],
          explanation,
        };
      }
      cleanText = cleanText.replace(exitTicketRegex, "").trim();
    } catch {
      // Ignore malformed directive
    }
  }

  // Parse :::analogous[title="..."] content :::
  const analogousRegex = /:::analogous(?:\[title=["'](.*?)["']\])?\s*([\s\S]*?):::/g;
  let anMatch: RegExpExecArray | null;
  while ((anMatch = analogousRegex.exec(cleanText)) !== null) {
    analogousExamples.push({
      title: anMatch[1] || "সমান্তরাল উদাহরণ (Analogous Example)",
      content: anMatch[2].trim(),
    });
  }
  cleanText = cleanText.replace(analogousRegex, "").trim();

  // Parse standard markdown diagrams if present
  const diagramImgRegex = /!\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g;
  let diagMatch: RegExpExecArray | null;
  while ((diagMatch = diagramImgRegex.exec(cleanText)) !== null) {
    diagrams.push({
      caption: diagMatch[1] || "পাঠ্যবইয়ের চিত্র",
      url: diagMatch[2],
    });
  }

  return {
    cleanText,
    exitTicket,
    diagrams,
    analogousExamples,
  };
}

