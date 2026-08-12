import { z } from "genkit";
import { ai, nimEmbedder, EMBED_MODEL_NAME, EMBED_MODEL_VERSION } from "@/ai/genkit";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

const GroundingChunkSchema = z.object({
  chunk_id: z.string(),
  content_chunk: z.string(),
  official_rubric_rules: z.unknown().nullable(),
  source_book_page_ref: z.string().nullable(),
  similarity: z.number(),
});

/**
 * Layer 2: RAG grounding. Embeds the transcribed answer + question text and
 * pulls the nearest NCTB curriculum chunks + official rubric rules via
 * pgvector HNSW search, scoped to (chapter, language) — see the partial-index
 * note in supabase/migrations/00000000000003_curriculum.sql. This is what
 * keeps Layer 4 from hallucinating a rubric instead of citing one.
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
    // input_type: "query" — NV-EmbedQA is an asymmetric retrieval model, and
    // ingestion embeds with input_type "passage" (see ingest.py). Using the
    // wrong side measurably hurts retrieval quality for this model family.
    const embedResponse = await ai.embed({
      embedder: nimEmbedder,
      content: queryText,
      options: { inputType: "query" },
    });
    const embedding = embedResponse[0]?.embedding;
    if (!embedding) throw new Error("retrieveGrounding: embedding failed");

    const supabase = getServiceRoleClient();
    const { data, error } = await supabase.rpc("match_curriculum_chunks", {
      query_embedding: embedding,
      p_chapter_id: chapterId,
      p_language_tag: languageTag,
      match_count: matchCount,
      p_model_name: EMBED_MODEL_NAME,
      p_model_version: EMBED_MODEL_VERSION,
    });

    if (error) throw new Error(`retrieveGrounding: ${error.message}`);

    const chunks = (data ?? []) as z.infer<typeof GroundingChunkSchema>[];
    // Cheap proxy for grounding quality: how similar is the *best* match.
    // Low top-similarity means we're grading without solid curriculum
    // support and should flag for human review (NFR-REL-03 / docs/review §6.2).
    const groundingConfidence = chunks.length > 0 ? Math.max(...chunks.map((c) => c.similarity)) : 0;

    return { chunks, groundingConfidence };
  }
);
