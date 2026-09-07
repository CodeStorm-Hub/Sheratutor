import type {
  SessionStore,
  SessionSnapshot,
  SnapshotMutator,
  SessionStoreOptions,
} from "genkit/beta";
import { GenkitError } from "genkit";
import { diff } from "genkit/beta";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

type GetSnapshotOptions = Parameters<SessionStore["getSnapshot"]>[0];

function normalizeGetSnapshotOptions(opts: GetSnapshotOptions) {
  const { snapshotId, sessionId } = opts;
  if (!snapshotId && !sessionId) {
    throw new GenkitError({
      status: "INVALID_ARGUMENT",
      message: "getSnapshot requires at least one of 'snapshotId' or 'sessionId'.",
    });
  }
  return { snapshotId, sessionId };
}

function extractTextFromContent(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "text" in part && typeof part.text === "string") {
          return part.text;
        }
        return "";
      })
      .join("");
  }
  return "";
}

export function isUuid(id?: string | null): boolean {
  if (!id || typeof id !== "string") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

/**
 * SupabaseSessionStore implements Genkit's SessionStore interface for SheraTutor.
 * It maps conversational snapshots to tutor_chat_sessions and tutor_chat_messages,
 * ensuring zero-downtime compatibility with the existing PostgreSQL database schema.
 */
export class SupabaseSessionStore<S = Record<string, unknown>> implements SessionStore<S> {
  private inMemorySnapshots = new Map<string, SessionSnapshot<S>>();
  private listeners = new Map<string, ((snapshot: SessionSnapshot<S>) => void)[]>();

  async getSnapshot(opts: GetSnapshotOptions): Promise<SessionSnapshot<S> | undefined> {
    const { snapshotId, sessionId } = normalizeGetSnapshotOptions(opts);

    // 1. Fast in-memory cache check
    if (snapshotId && this.inMemorySnapshots.has(snapshotId)) {
      return structuredClone(this.inMemorySnapshots.get(snapshotId));
    }
    if (sessionId) {
      for (const snap of this.inMemorySnapshots.values()) {
        if (snap.sessionId === sessionId || snap.state?.sessionId === sessionId) {
          return structuredClone(snap);
        }
      }
    }

    // 2. Fetch from Supabase
    try {
      const supabase = getServiceRoleClient();
      let sessionRow: {
        id: string;
        student_id: string;
        mode: string;
        title: string | null;
        context_json: Record<string, unknown> | null;
        created_at: string;
        updated_at: string;
      } | null = null;

      if (sessionId) {
        if (isUuid(sessionId)) {
          const { data } = await supabase
            .from("tutor_chat_sessions")
            .select("id, student_id, mode, title, context_json, created_at, updated_at")
            .or(`id.eq.${sessionId},context_json->>sessionId.eq.${sessionId}`)
            .maybeSingle();
          sessionRow = data;
        } else {
          const { data } = await supabase
            .from("tutor_chat_sessions")
            .select("id, student_id, mode, title, context_json, created_at, updated_at")
            .eq("context_json->>sessionId", sessionId)
            .maybeSingle();
          sessionRow = data;
        }
      } else if (snapshotId) {
        if (isUuid(snapshotId)) {
          const { data } = await supabase
            .from("tutor_chat_sessions")
            .select("id, student_id, mode, title, context_json, created_at, updated_at")
            .or(`id.eq.${snapshotId},context_json->>snapshotId.eq.${snapshotId}`)
            .maybeSingle();
          sessionRow = data;
        } else {
          const { data } = await supabase
            .from("tutor_chat_sessions")
            .select("id, student_id, mode, title, context_json, created_at, updated_at")
            .eq("context_json->>snapshotId", snapshotId)
            .maybeSingle();
          sessionRow = data;
        }
      }

      if (!sessionRow) {
        return undefined;
      }

      // Load messages for this session
      const { data: messagesData } = await supabase
        .from("tutor_chat_messages")
        .select("id, role, content, created_at")
        .eq("session_id", sessionRow.id)
        .order("created_at", { ascending: true })
        .order("id", { ascending: true });

      const messages = (messagesData ?? [])
        .filter((m) => m.content && !m.content.includes("LLM streaming failed"))
        .map((m) => ({
          role: m.role === "student" ? ("user" as const) : ("model" as const),
          content: [{ text: m.content }],
        }));

      const contextJson = (sessionRow.context_json ?? {}) as Record<string, unknown>;

      const snapshot: SessionSnapshot<S> = {
        snapshotId: (contextJson.snapshotId as string) || sessionRow.id,
        sessionId: (contextJson.sessionId as string) || sessionRow.id,
        parentId: contextJson.parentId as string | undefined,
        createdAt: sessionRow.created_at,
        updatedAt: sessionRow.updated_at,
        status: (contextJson.status as SessionSnapshot<S>["status"]) || "completed",
        finishReason: (contextJson.finishReason as SessionSnapshot<S>["finishReason"]) || "stop",
        state: {
          sessionId: (contextJson.sessionId as string) || sessionRow.id,
          messages,
          custom: {
            ...contextJson,
            studentId: sessionRow.student_id,
            mode: sessionRow.mode,
            title: sessionRow.title,
          } as S,
          artifacts: (contextJson.artifacts as SessionSnapshot<S>["state"] extends { artifacts?: infer A } ? A : never) ?? [],
        },
      };

      this.inMemorySnapshots.set(snapshot.snapshotId, structuredClone(snapshot));
      return snapshot;
    } catch (err) {
      console.error("SupabaseSessionStore getSnapshot error:", err);
      return undefined;
    }
  }

  async saveSnapshot(
    snapshotId: string | undefined,
    mutator: SnapshotMutator<S>,
    options?: SessionStoreOptions
  ): Promise<string | null> {
    const current = snapshotId ? await this.getSnapshot({ snapshotId }) : undefined;
    const mutated = mutator(current ? structuredClone(current) : undefined);
    if (mutated === null) {
      return null;
    }

    const id = snapshotId || mutated.snapshotId || globalThis.crypto.randomUUID();
    const sessionId = mutated.sessionId || mutated.state?.sessionId || id;

    const fullSnapshot: SessionSnapshot<S> = {
      ...mutated,
      snapshotId: id,
      sessionId,
      updatedAt: new Date().toISOString(),
      createdAt: mutated.createdAt || new Date().toISOString(),
    };

    // Calculate state delta (JSON-Patch) if current existed
    if (current?.state?.custom && mutated.state?.custom) {
      try {
        const patch = diff(current.state.custom, mutated.state.custom);
        if (patch.length > 0) {
          (fullSnapshot as unknown as Record<string, unknown>).lastPatch = patch;
        }
      } catch {
        // Ignore diff serialization issues
      }
    }

    this.inMemorySnapshots.set(id, structuredClone(fullSnapshot));

    // Persist to Supabase asynchronously / resiliently
    try {
      const supabase = getServiceRoleClient();
      const customState = (mutated.state?.custom ?? {}) as Record<string, unknown>;
      const ctx = (options?.context ?? {}) as Record<string, unknown>;

      let dbSessionId = isUuid(sessionId) ? sessionId : undefined;
      let existingSession: { id: string } | null = null;

      if (dbSessionId) {
        const { data } = await supabase
          .from("tutor_chat_sessions")
          .select("id")
          .eq("id", dbSessionId)
          .maybeSingle();
        existingSession = data;
      } else {
        const { data } = await supabase
          .from("tutor_chat_sessions")
          .select("id")
          .eq("context_json->>sessionId", sessionId)
          .maybeSingle();
        existingSession = data;
        if (existingSession) {
          dbSessionId = existingSession.id;
        } else {
          dbSessionId = globalThis.crypto.randomUUID();
        }
      }

      let studentId = (customState.studentId || customState.student_id || ctx.studentId) as string | undefined;
      if (!studentId && ctx.userId) {
        const { data: prof } = await supabase
          .from("student_profiles")
          .select("id")
          .eq("user_id", ctx.userId)
          .maybeSingle();
        if (prof?.id) studentId = prof.id;
      }
      if (!studentId) {
        const { data: firstProf } = await supabase
          .from("student_profiles")
          .select("id")
          .limit(1)
          .maybeSingle();
        if (firstProf?.id) studentId = firstProf.id;
      }

      const mode = (customState.mode || ctx.mode || "general") as string;
      const submissionId = (customState.submissionId || ctx.submissionId || null) as string | null;
      const questionId = (customState.questionId || ctx.questionId || null) as string | null;
      const rubricStepIndex =
        typeof customState.rubricStepIndex === "number"
          ? customState.rubricStepIndex
          : typeof ctx.rubricStepIndex === "number"
          ? ctx.rubricStepIndex
          : null;

      const firstMessageText = mutated.state?.messages?.[0]
        ? extractTextFromContent(mutated.state.messages[0].content)
        : "";
      const title = (
        (customState.title as string) ||
        (customState.studentMessage as string) ||
        firstMessageText ||
        "Tutor Session"
      ).slice(0, 40);

      const contextJsonToSave = {
        ...customState,
        sessionId,
        snapshotId: id,
        parentId: mutated.parentId,
        status: mutated.status,
        finishReason: mutated.finishReason,
        artifacts: mutated.state?.artifacts,
        studentId,
        mode,
      };

      if (existingSession && dbSessionId) {
        await supabase
          .from("tutor_chat_sessions")
          .update({
            updated_at: new Date().toISOString(),
            context_json: contextJsonToSave,
          })
          .eq("id", dbSessionId);
      } else if (dbSessionId && studentId) {
        await supabase.from("tutor_chat_sessions").insert({
          id: dbSessionId,
          student_id: studentId,
          mode,
          title,
          submission_id: submissionId,
          question_id: questionId,
          rubric_step_index: rubricStepIndex,
          context_json: contextJsonToSave,
        });
      }

      // Persist any newly appended textual messages
      if (mutated.state?.messages && mutated.state.messages.length > 0 && dbSessionId) {
        const { count } = await supabase
          .from("tutor_chat_messages")
          .select("id", { count: "exact", head: true })
          .eq("session_id", dbSessionId);

        const existingCount = count ?? 0;
        // Filter to only textual messages so indices align with rows in tutor_chat_messages
        const textualMessages = mutated.state.messages.filter(
          (msg) => extractTextFromContent(msg.content).trim().length > 0
        );
        const newMessages = textualMessages.slice(existingCount);

        if (newMessages.length > 0) {
          const baseTime = Date.now();
          const rowsToInsert = newMessages.map((msg, idx) => ({
            session_id: dbSessionId!,
            role: msg.role === "user" ? "student" : "tutor",
            content: extractTextFromContent(msg.content),
            safety_category: "none",
            created_at: new Date(baseTime + idx * 50).toISOString(),
          }));

          const { error: insertErr } = await supabase.from("tutor_chat_messages").insert(rowsToInsert);
          if (insertErr) {
            console.error("Failed to insert tutor_chat_messages:", insertErr);
          }
        }
      }
    } catch (err) {
      console.error("SupabaseSessionStore saveSnapshot error:", err);
    }

    // Notify listeners
    const listeners = this.listeners.get(id);
    if (listeners) {
      for (const cb of listeners) {
        try {
          cb(structuredClone(fullSnapshot));
        } catch {}
      }
    }

    return id;
  }

  onSnapshotStateChange(
    snapshotId: string,
    callback: (snapshot: SessionSnapshot<S>) => void,
    _options?: SessionStoreOptions
  ): () => void {
    if (!this.listeners.has(snapshotId)) {
      this.listeners.set(snapshotId, []);
    }
    this.listeners.get(snapshotId)!.push(callback);
    return () => {
      const list = this.listeners.get(snapshotId);
      if (list) {
        const idx = list.indexOf(callback);
        if (idx >= 0) list.splice(idx, 1);
      }
    };
  }

  /**
   * Helper method for loading session by ID directly.
   */
  async get(sessionId: string): Promise<SessionSnapshot<S> | undefined> {
    return this.getSnapshot({ sessionId });
  }

  /**
   * Helper method for saving session data directly.
   */
  async save(sessionId: string, snapshot: SessionSnapshot<S>): Promise<string | null> {
    return this.saveSnapshot(snapshot.snapshotId, () => snapshot);
  }
}
