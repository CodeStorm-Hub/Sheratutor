import { getServiceRoleClient } from "@/lib/supabase/service-role";

export interface CurriculumChunkResult {
  chunk_id: string;
  content_chunk: string;
  source_book_page_ref?: string | null;
  similarity?: number;
}

/**
 * Fetches textbook context chunks based on question_topic_id using Supabase pgvector / curriculum queries.
 * Returns exactly the top 3 most relevant chunks concatenated as a single string.
 */
export async function getTop3TextbookChunks(
  questionTopicId: string,
  queryText?: string,
  queryEmbedding?: number[]
): Promise<string> {
  const supabase = getServiceRoleClient();

  let chunks: CurriculumChunkResult[] = [];

  // 1. If an embedding vector is provided, execute pgvector RPC matching
  if (queryEmbedding && queryEmbedding.length > 0) {
    const { data: rpcData, error: rpcError } = await supabase.rpc("match_curriculum_chunks", {
      query_embedding: queryEmbedding,
      p_chapter_id: questionTopicId,
      p_language_tag: "bn",
      match_count: 3,
    });

    if (!rpcError && rpcData && rpcData.length > 0) {
      chunks = rpcData.map((row: { chunk_id: string; content_chunk: string; source_book_page_ref?: string | null; similarity?: number }) => ({
        chunk_id: row.chunk_id,
        content_chunk: row.content_chunk,
        source_book_page_ref: row.source_book_page_ref,
        similarity: row.similarity,
      }));
    }
  }

  // 2. If vector RPC yielded fewer than 3 chunks, query curriculum_chunks directly by topic/chapter
  if (chunks.length < 3) {
    const needed = 3 - chunks.length;
    let query = supabase
      .from("curriculum_chunks")
      .select("id, content_chunk, source_book_page_ref, chunk_index")
      .eq("chapter_id", questionTopicId);

    if (queryText && queryText.trim().length > 0) {
      query = query.textSearch("content_chunk", queryText, { type: "websearch", config: "simple" });
    }

    const { data: directData } = await query.limit(needed);

    if (directData && directData.length > 0) {
      const existingIds = new Set(chunks.map((c) => c.chunk_id));
      for (const row of directData) {
        if (!existingIds.has(row.id)) {
          chunks.push({
            chunk_id: row.id,
            content_chunk: row.content_chunk,
            source_book_page_ref: row.source_book_page_ref,
          });
          if (chunks.length === 3) break;
        }
      }
    }
  }

  // 3. Fallback: If still under 3, query by primary id or any matching chunks
  if (chunks.length < 3) {
    const { data: fallbackData } = await supabase
      .from("curriculum_chunks")
      .select("id, content_chunk, source_book_page_ref")
      .eq("chapter_id", questionTopicId)
      .order("chunk_index", { ascending: true })
      .limit(3);

    if (fallbackData && fallbackData.length > 0) {
      const existingIds = new Set(chunks.map((c) => c.chunk_id));
      for (const row of fallbackData) {
        if (!existingIds.has(row.id)) {
          chunks.push({
            chunk_id: row.id,
            content_chunk: row.content_chunk,
            source_book_page_ref: row.source_book_page_ref,
          });
          if (chunks.length === 3) break;
        }
      }
    }
  }

  // Ensure exactly top 3 chunks are selected
  const top3 = chunks.slice(0, 3);

  if (top3.length === 0) {
    return "";
  }

  return top3
    .map(
      (chunk, idx) =>
        `[Chunk ${idx + 1}${chunk.source_book_page_ref ? ` - Page ${chunk.source_book_page_ref}` : ""}]\n${chunk.content_chunk.trim()}`
    )
    .join("\n\n");
}
