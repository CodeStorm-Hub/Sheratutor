/**
 * Shared retry/backoff for ai.generate/ai.embed calls. NIM's free tier has a
 * documented ~40 RPM ceiling (see genkit.ts) and no flow currently has any
 * safety net for a transient rate-limit or network error — grading has an
 * outer pgmq retry, but tutor-chat and paper generation do not.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  { retries = 3, baseDelayMs = 500 }: { retries?: number; baseDelayMs?: number } = {}
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === retries) break;
      const delay = baseDelayMs * 2 ** attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}
