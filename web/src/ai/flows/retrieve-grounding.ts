import { z } from "genkit";
import { ai, activeEmbedder, EMBED_MODEL_NAME, EMBED_MODEL_VERSION } from "@/ai/genkit";
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

const BENGALI_PHYSICS_SYNONYMS: Record<string, string[]> = {
  "ত্বরণ": ["acceleration", "বেগের পরিবর্তন", "মন্দন"],
  "বেগ": ["velocity", "দ্রুতি", "সরণ"],
  "গতি": ["motion", "গতির সমীকরণ", "গতিবিদ্যা"],
  "কাজ": ["work", "বল ও সরণ", "জুল"],
  "শক্তি": ["energy", "গতিশক্তি", "বিভবশক্তি", "সংরক্ষণশীলতা"],
  "ক্ষমতা": ["power", "কাজের হার", "ওয়াট"],
  "চাপ": ["pressure", "ক্ষেত্রফল", "প্যাস্কেল"],
  "ঘনত্ব": ["density", "ভর", "আয়তন"],
  "আলো": ["light", "প্রতিফলন", "প্রতিসরণ", "দর্পণ"],
  "শব্দ": ["sound", "তরঙ্গ", "কম্পাঙ্ক", "প্রতিধ্বনি"],
  "বিদ্যুৎ": ["electricity", "তড়িৎ", "রোধ", "বর্তনী", "ওহমের সূত্র"],
};

export function expandBengaliPhysicsQuery(query: string): string {
  let expanded = query;
  for (const [term, synonyms] of Object.entries(BENGALI_PHYSICS_SYNONYMS)) {
    if (query.includes(term)) {
      expanded += ` ${synonyms.join(" ")}`;
    }
  }
  return expanded.trim();
}

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
    const enrichedQuery = expandBengaliPhysicsQuery(queryText);

    // 1. Embed query with BGE-M3
    const embedResponse = await ai.embed({
      embedder: activeEmbedder,
      content: enrichedQuery,
      options: { inputType: "query" },
    });
    const embedding = embedResponse[0]?.embedding;
    if (!embedding) throw new Error("retrieveGrounding: embedding failed");

    const supabase = getServiceRoleClient();
    
    // 2. Execute Hybrid Search (Dense HNSW + Sparse FTS) via RPC
    const { data, error } = await supabase.rpc("match_curriculum_chunks", {
      query_embedding: embedding,
      p_chapter_id: chapterId,
      p_language_tag: languageTag,
      match_count: matchCount,
      p_model_name: EMBED_MODEL_NAME,
      p_model_version: EMBED_MODEL_VERSION,
      query_text: enrichedQuery,
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
