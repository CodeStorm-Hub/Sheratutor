import { z } from "genkit";
import { ai, embedWithGeminiFallback, EMBED_MODEL_NAME, EMBED_MODEL_VERSION } from "@/ai/genkit";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

const GroundingChunkSchema = z.object({
  chunk_id: z.string(),
  content_chunk: z.string(),
  chunk_type: z.string().nullable().optional(),
  parent_chunk_id: z.string().nullable().optional(),
  section_no: z.string().nullable().optional(),
  section_title: z.string().nullable().optional(),
  chapter_no: z.number().nullable().optional(),
  chapter_title: z.string().nullable().optional(),
  diagram_image_urls: z.array(z.string()).nullable().optional(),
  official_rubric_rules: z.unknown().nullable().optional(),
  source_book_page_ref: z.string().nullable(),
  similarity: z.number(),
});

const isUuid = (val?: string | null): boolean =>
  !!val && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

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
  // Chemistry expansion
  "পরমাণু": ["atom", "নিউক্লিয়াস", "রাদারফোর্ড", "বোর", "ইলেকট্রন"],
  "পর্যায়": ["periodic table", "পর্যায় সারণি", "আয়নীকরণ", "পারমাণবিক ব্যাসার্ধ"],
  "বিক্রিয়া": ["reaction", "জারণ", "বিজারণ", "অ্যানোড", "ক্যাথোড", "ড্রাই সেল"],
  "ব্যাপন": ["diffusion", "নিঃসরণ", "অ্যামোনিয়া", "হাইড্রোক্লোরিক"],
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
 * Layer 2: Multimodal Bilingual Hybrid RAG grounding.
 * Uses gemini-embedding-2 (1024-dim) with pgvector HNSW + full-text search.
 * Supports both chapter-scoped and global curriculum-wide queries with authentic diagrams.
 */
export const retrieveGroundingFlow = ai.defineFlow(
  {
    name: "retrieveGrounding",
    inputSchema: z.object({
      queryText: z.string(),
      chapterId: z.string().nullable().optional(),
      subjectCode: z.string().optional(),
      languageTag: z.enum(["bn", "en"]).optional(),
      matchCount: z.number().optional(),
    }),
    outputSchema: z.object({
      chunks: z.array(GroundingChunkSchema),
      groundingConfidence: z.number().min(0).max(1),
    }),
  },
  async ({ queryText, chapterId, subjectCode = "SSC-CHEM", languageTag = "bn", matchCount = 4 }) => {
    const hasBengali = /[\u0980-\u09FF]/.test(queryText);
    const effectiveLanguageTag = hasBengali ? "bn" : languageTag;
    const enrichedQuery = expandBengaliPhysicsQuery(queryText);

    // 1. Embed query with gemini-embedding-2 (1024 dimensions) with automatic key failover
    const embedding = await embedWithGeminiFallback(enrichedQuery, 1024);
    if (!embedding || embedding.length === 0) throw new Error("retrieveGrounding: embedding failed");

    const supabase = getServiceRoleClient();
    
    // 2. Execute Hybrid Search via RPC (Chapter-specific or Global)
    const runRpc = (lang: string) =>
      isUuid(chapterId)
        ? supabase.rpc("match_curriculum_chunks", {
            query_embedding: embedding,
            p_chapter_id: chapterId as string,
            p_language_tag: lang,
            match_count: matchCount,
            p_model_name: EMBED_MODEL_NAME,
            p_model_version: EMBED_MODEL_VERSION,
            query_text: enrichedQuery,
          })
        : supabase.rpc("match_curriculum_chunks_global", {
            query_embedding: embedding,
            p_subject_code: subjectCode,
            p_language_tag: lang,
            match_count: matchCount,
            p_model_name: EMBED_MODEL_NAME,
            p_model_version: EMBED_MODEL_VERSION,
            query_text: enrichedQuery,
          });

    let { data, error } = await runRpc(effectiveLanguageTag);
    // Fallback: If 0 chunks retrieved and language was en, retry with bn
    if ((!data || data.length === 0) && effectiveLanguageTag !== "bn") {
      const fallbackRes = await runRpc("bn");
      if (fallbackRes.data && fallbackRes.data.length > 0) {
        data = fallbackRes.data;
        error = fallbackRes.error;
      }
    }
    console.log("retrieveGroundingFlow RPC result count:", data?.length, "error:", error?.message, "diagrams:", data?.map((d: any) => d.diagram_image_urls));

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
