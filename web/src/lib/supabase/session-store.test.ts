import { describe, it, expect, vi } from 'vitest';
import { SupabaseSessionStore, isUuid } from './session-store';

describe('SupabaseSessionStore', () => {
  it('identifies valid and invalid UUIDs correctly', () => {
    expect(isUuid('f2b091a3-3f3f-410e-8ab5-c934803acb1d')).toBe(true);
    expect(isUuid('not-a-uuid')).toBe(false);
    expect(isUuid('')).toBe(false);
    expect(isUuid(undefined)).toBe(false);
  });

  it('throws INVALID_ARGUMENT when neither snapshotId nor sessionId is provided', async () => {
    const store = new SupabaseSessionStore();
    await expect(
      store.getSnapshot({} as Parameters<typeof store.getSnapshot>[0])
    ).rejects.toThrow('getSnapshot requires at least one');
  });

  it('saves and retrieves snapshots in cache and computes snapshot IDs', async () => {
    const store = new SupabaseSessionStore();
    const sessionId = 'test-session-123';

    // Save initial snapshot
    const savedId = await store.saveSnapshot(undefined, () => ({
      sessionId,
      createdAt: new Date().toISOString(),
      status: 'completed',
      state: {
        sessionId,
        messages: [{ role: 'user', content: [{ text: 'Hello tutor' }] }],
        custom: { mode: 'general', studentMessage: 'Hello tutor' },
        artifacts: [],
      },
    }));

    expect(savedId).toBeDefined();

    // Retrieve by sessionId
    const snapshotBySession = await store.getSnapshot({ sessionId });
    expect(snapshotBySession).toBeDefined();
    expect(snapshotBySession?.sessionId).toBe(sessionId);
    expect(snapshotBySession?.state?.messages).toHaveLength(1);
    const firstMsg = snapshotBySession?.state?.messages?.[0];
    const textPart = Array.isArray(firstMsg?.content) ? (firstMsg?.content[0] as { text?: string })?.text : '';
    expect(textPart).toBe('Hello tutor');

    // Retrieve by snapshotId
    const snapshotById = await store.getSnapshot({ snapshotId: savedId! });
    expect(snapshotById).toBeDefined();
    expect(snapshotById?.snapshotId).toBe(savedId);
  });

  it('notifies listeners registered with onSnapshotStateChange', async () => {
    const store = new SupabaseSessionStore();
    const snapshotId = 'snap-listen-test';
    const listener = vi.fn();

    const unsubscribe = store.onSnapshotStateChange(snapshotId, listener);

    await store.saveSnapshot(snapshotId, () => ({
      snapshotId,
      sessionId: 'sess-listen-test',
      createdAt: new Date().toISOString(),
      status: 'completed',
      state: {
        sessionId: 'sess-listen-test',
        messages: [],
        custom: {},
        artifacts: [],
      },
    }));

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        snapshotId,
        sessionId: 'sess-listen-test',
      })
    );

    unsubscribe();

    // Second save should not trigger listener after unsubscribe
    await store.saveSnapshot(snapshotId, (cur) => cur ?? null);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('supports helper methods get and save directly', async () => {
    const store = new SupabaseSessionStore();
    const sessionId = 'helper-test-id';

    const testSnapshot = {
      snapshotId: 'helper-snap-id',
      sessionId,
      createdAt: new Date().toISOString(),
      status: 'completed' as const,
      state: {
        sessionId,
        messages: [{ role: 'user' as const, content: [{ text: 'Testing helpers' }] }],
        custom: {},
        artifacts: [],
      },
    };

    await store.save(sessionId, testSnapshot);
    const retrieved = await store.get(sessionId);

    expect(retrieved).toBeDefined();
    expect(retrieved?.sessionId).toBe(sessionId);
  });
});
