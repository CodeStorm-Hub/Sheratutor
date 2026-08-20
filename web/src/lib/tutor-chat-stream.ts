export type TutorChatRequestBody = {
  sessionId: string | null;
  mode: "rubric" | "general";
  submissionId?: string;
  questionId?: string;
  rubricStepIndex?: number;
  questionText?: string;
  studentAnswerChunk?: string;
  rubricFailureReason?: string;
  groundedContext?: string;
  subjectId?: string;
  chapterId?: string;
  studentMessage: string;
  languagePreference: "bn" | "en";
};

type StreamCallbacks = {
  onSession?: (sessionId: string) => void;
  onChunk: (text: string) => void;
  onDone: (reply: string) => void;
  onError: (message: string) => void;
  onRateLimited?: (message: string) => void;
};

/**
 * Reads /api/tutor-chat's SSE response (see route.ts's sseLine helper for
 * the event shape) and drives the provided callbacks as events arrive.
 * Shared by tutor-page-client.tsx and explain-simply-button.tsx so the two
 * chat surfaces don't duplicate SSE-parsing logic.
 */
export async function streamTutorChatRequest(body: TutorChatRequestBody, callbacks: StreamCallbacks): Promise<void> {
  const res = await fetch("/api/tutor-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (res.status === 429) {
    const json = await res.json().catch(() => null);
    callbacks.onRateLimited?.(json?.message ?? "আজকের জন্য প্রশ্নের সীমা শেষ, আগামীকাল আবার চেষ্টা করো।");
    return;
  }

  if (!res.ok || !res.body) {
    callbacks.onError("দুঃখিত, সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করো।");
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const payload = line.replace(/^data: /, "").trim();
      if (!payload) continue;

      let event: { type: string; [key: string]: unknown };
      try {
        event = JSON.parse(payload);
      } catch {
        continue;
      }

      if (event.type === "session" && typeof event.sessionId === "string") {
        callbacks.onSession?.(event.sessionId);
      } else if (event.type === "chunk" && typeof event.text === "string") {
        callbacks.onChunk(event.text);
      } else if (event.type === "done" && typeof event.reply === "string") {
        callbacks.onDone(event.reply);
      } else if (event.type === "error") {
        callbacks.onError(typeof event.message === "string" ? event.message : "দুঃখিত, সংযোগে সমস্যা হয়েছে।");
      }
    }
  }
}
