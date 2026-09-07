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
