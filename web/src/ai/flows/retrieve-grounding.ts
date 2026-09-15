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

const BENGALI_CURRICULUM_SYNONYMS: Record<string, string[]> = {
  // Physics concepts
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
  // Chemistry concepts
  "পরমাণু": ["atom", "নিউক্লিয়াস", "রাদারফোর্ড", "বোর", "ইলেকট্রন"],
  "পর্যায়": ["periodic table", "পর্যায় সারণি", "আয়নীকরণ", "পারমাণবিক ব্যাসার্ধ"],
  "বিক্রিয়া": ["reaction", "জারণ", "বিজারণ", "অ্যানোড", "ক্যাথোড", "ড্রাই সেল"],
  "ব্যাপন": ["diffusion", "নিঃসরণ", "অ্যামোনিয়া", "হাইড্রোক্লোরিক"],
  // Mathematics concepts (NCTB Class 9-10 All 17 Chapters)
  "বাস্তব সংখ্যা": ["real numbers", "মূলদ", "অমূলদ", "অনাবৃত দশমিক"],
  "সেট": ["set", "ফাংশন", "উপসেট", "শক্তি সেট", "সংযোগ সেট", "ছেদ সেট"],
  "বীজগাণিতিক": ["algebraic expression", "উৎপাদক", "বর্গ", "ঘন", "সূত্রাবলি"],
  "উৎপাদক": ["factorization", "উৎপাদকে বিশ্লেষণ", "মধ্যপদ"],
  "সূচক": ["exponent", "লগারিদম", "লগ", "ভিত্তি"],
  "সমীকরণ": ["equation", "চলক", "দ্বিঘাত সমীকরণ", "মূল", "সহসমীকরণ"],
  "জ্যামিতি": ["geometry", "ত্রিভুজ", "উপপাদ্য", "সর্বসম", "পীথাগোরাস"],
  "বৃত্ত": ["circle", "স্পর্শক", "জ্যা", "পরিধি", "বৃত্তচাপ", "বৃত্তস্থ কোণ", "কেন্দ্রস্থ কোণ"],
  "ত্রিকোণমিতি": ["trigonometry", "সাইন", "কস", "ট্যান", "উন্নতি কোণ", "অবনতি কোণ", "দূরত্ব ও উচ্চতা"],
  "ধারা": ["series", "সমান্তর ধারা", "গুণোত্তর ধারা", "সসীম ধারা", "পদ সংখ্যা", "সমষ্টি"],
  "অনুপাত": ["ratio", "সমানুপাত", "সদৃশতা", "প্রতিসাম্য"],
  "পরিমিতি": ["mensuration", "আয়তাকার", "ঘনক", "সিলিন্ডার", "বেলন", "গোলক", "ক্ষেত্রফল", "আয়তন"],
  "পরিসংখ্যান": ["statistics", "গড়", "মধ্যক", "প্রচুরক", "গণসংখ্যা", "ক্রমযোজিত গণসংখ্যা", "আয়তলেখ", "অজিব রেখা"],
};

export function expandBengaliPhysicsQuery(query: string): string {
  let expanded = query;
  for (const [term, synonyms] of Object.entries(BENGALI_CURRICULUM_SYNONYMS)) {
    if (query.includes(term)) {
      expanded += ` ${synonyms.join(" ")}`;
    }
  }
  return expanded.trim();
}

export function detectSubjectFromQuery(query: string): string {
  const q = query.toLowerCase();
  // Mathematics signals
  if (
    /সমীকরণ|উৎপাদক|সেট|ফাংশন|জ্যামিতি|উপপাদ্য|বৃত্ত|ত্রিকোণমিতি|কোণ|ধারা|পরিমিতি|পরিসংখ্যান|মধ্যক|প্রচুরক|লগ|লগারিদম|বাস্তব সংখ্যা|অমূলদ|মূলদ|ক্ষেত্রফল|ঘনক|সিলিন্ডার|বেলন|ত্রিভুজ|সমানুপাত|দ্বিঘাত|matrix|sin|cos|tan|cot|sec|cosec|sqrt/i.test(
      q
    )
  ) {
    return "SSC-MATH";
  }
  // Chemistry signals
  if (
    /মৌল|পরমাণু|পর্যায়|যোজনী|ইলেকট্রন|প্রোটন|নিউট্রন|বিক্রিয়া|জারণ|বিজারণ|এসিড|ক্ষারক|লবণ|অক্সাইড|হাইড্রোকার্বন|alkane|alkene|alkyne|mol|molarity|periodic/i.test(
      q
    )
  ) {
    return "SSC-CHEM";
  }
  // Physics signals
  if (
    /ত্বরণ|বেগ|সরণ|বল|ঘর্ষণ|কাজ|ক্ষমতা|শক্তি|চাপ|প্লবতা|আলো|দর্পণ|লেন্স|তরঙ্গ|শব্দ|বিদ্যুৎ|তড়িৎ|রোধ|বর্তনী|চৌম্বক/i.test(
      q
    )
  ) {
    return "SSC-PHY";
  }
  return "SSC-MATH"; // Default to Math as primary completed curriculum
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
  async ({ queryText, chapterId, subjectCode, languageTag = "bn", matchCount = 4 }) => {
    const hasBengali = /[\u0980-\u09FF]/.test(queryText);
    const effectiveLanguageTag = hasBengali ? "bn" : languageTag;
    const enrichedQuery = expandBengaliPhysicsQuery(queryText);
    const effectiveSubjectCode = subjectCode || detectSubjectFromQuery(queryText);

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
            p_subject_code: effectiveSubjectCode,
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
