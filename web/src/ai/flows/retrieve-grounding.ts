import { z } from "genkit";
import { ai, activeEmbedder, EMBED_MODEL_NAME, EMBED_MODEL_VERSION } from "@/ai/genkit";
import { withRetry } from "@/ai/retry";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

const GroundingChunkSchema = z.object({
  chunk_id: z.string(),
  content_chunk: z.string(),
  chunk_type: z.string().nullable().optional(),
  parent_chunk_id: z.string().nullable().optional(),
  section_no: z.string().nullable().optional(),
  section_title: z.string().nullable().optional(),
  official_rubric_rules: z.unknown().nullable(),
  source_book_page_ref: z.string().nullable(),
  similarity: z.number(),
});

/**
 * Layer 2: Bilingual Hybrid RAG grounding.
 * Combines dense BGE-M3 (1024-dim) vector similarity with PostgreSQL full-text search (tsvector)
 * via Reciprocal Rank Fusion (RRF), scoped to (chapter, language).
 * Automatically resolves parent stimulus context for Creative Question (CQ) sub-questions.
 */
export const retrieveGroundingFlow = ai.defineFlow(
  {
    name: "retrieveGrounding",
    inputSchema: z.object({
      queryText: z.string(),
      chapterId: z.string(),
      languageTag: z.enum(["bn", "en"]),
      matchCount: z.number().default(5),
    }),
    outputSchema: z.object({
      chunks: z.array(GroundingChunkSchema),
      groundingConfidence: z.number().min(0).max(1),
    }),
  },
  async ({ queryText, chapterId, languageTag, matchCount }) => {
    // 1. Embed query with BGE-M3
    const embedResponse = await withRetry(() =>
      ai.embed({
        embedder: activeEmbedder,
        content: queryText,
        options: { inputType: "query" },
      })
    );
    const embedding = embedResponse[0]?.embedding;
    if (!embedding) throw new Error("retrieveGrounding: embedding failed");

    // Service-role (RLS-bypassing) client is intentional here, not an
    // oversight: curriculum_chunks is global NCTB reference content with no
    // per-student or per-tenant column — every student reads the same rows,
    // so there is no tenant-scoping policy for this read to bypass. If a
    // tenant-scoped field is ever added to this table, switch to the
    // request-scoped user client instead.
    const supabase = getServiceRoleClient();

    // 2. Execute Hybrid Search (Dense HNSW + Sparse FTS) via RPC
    const { data, error } = await supabase.rpc("match_curriculum_chunks", {
      query_embedding: embedding,
      p_chapter_id: chapterId,
      p_language_tag: languageTag,
      match_count: matchCount,
      p_model_name: EMBED_MODEL_NAME,
      p_model_version: EMBED_MODEL_VERSION,
      query_text: queryText,
    });

    if (error) throw new Error(`retrieveGrounding: ${error.message}`);

    let chunks = (data ?? []) as z.infer<typeof GroundingChunkSchema>[];

    // 3. Hierarchical CQ Context: If any retrieved chunk is a subquestion with a parent stimulus, fetch parent stimulus
    const parentIdsToFetch = chunks
      .map((c) => c.parent_chunk_id)
      .filter((id): id is string => Boolean(id));

    if (parentIdsToFetch.length > 0) {
      const { data: parentRows } = await supabase
        .from("curriculum_chunks")
        .select("id, content_chunk")
        .in("id", parentIdsToFetch);

      if (parentRows && parentRows.length > 0) {
        const parentMap = new Map(parentRows.map((r: { id: string; content_chunk: string }) => [r.id, r.content_chunk]));
        chunks = chunks.map((c) => {
          if (c.parent_chunk_id && parentMap.has(c.parent_chunk_id)) {
            const stimulus = parentMap.get(c.parent_chunk_id);
            return {
              ...c,
              content_chunk: `[উদ্দীপক / Stimulus Context]:\n${stimulus}\n\n[প্রশ্ন / Sub-Question]:\n${c.content_chunk}`,
            };
          }
          return c;
        });
      }
    }

    const groundingConfidence = chunks.length > 0 ? Math.max(...chunks.map((c) => c.similarity)) : 0;

    return { chunks, groundingConfidence };
  }
);
