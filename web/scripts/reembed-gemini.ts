import { batchEmbedWithGeminiFallback, EMBED_MODEL_NAME, EMBED_MODEL_VERSION } from "../src/ai/genkit";
import { getServiceRoleClient } from "../src/lib/supabase/service-role";

/**
 * Backfill all curriculum_chunks rows with embeddings under the active Gemini embedder:
 * model_name: "gemini-embedding-2", model_version: "v1" @ dimensions: 1024.
 *
 * Uses Gemini batchEmbedContents API to embed in batches of 25 chunks per HTTP call,
 * which comfortably respects Google AI Studio rate limits and finishes in seconds.
 *
 * Idempotent: skips chunks that already have an embedding in chunk_embeddings.
 */

const MODEL_NAME = EMBED_MODEL_NAME;
const MODEL_VERSION = EMBED_MODEL_VERSION;
const BATCH_SIZE = 25; // Chunks per batch request
const PAGE = 1000; // PostgREST row cap per fetch

async function main() {
  const supabase = getServiceRoleClient();

  console.log("================================================================");
  console.log(`[*] Starting Gemini Vector Backfill (${MODEL_NAME} @ ${MODEL_VERSION})`);
  console.log("================================================================");

  // 1. Paged fetch of all curriculum_chunks
  const allChunks: { id: string; content_chunk: string }[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("curriculum_chunks")
      .select("id, content_chunk")
      .order("id")
      .range(from, from + PAGE - 1);

    if (error) throw new Error(`fetch curriculum_chunks failed: ${error.message}`);
    allChunks.push(...(data ?? []));
    if (!data || data.length < PAGE) break;
  }
  console.log(`[+] Total curriculum chunks in database: ${allChunks.length}`);

  // 2. Paged fetch of existing gemini embeddings
  const doneIds = new Set<string>();
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("chunk_embeddings")
      .select("chunk_id")
      .eq("model_name", MODEL_NAME)
      .eq("model_version", MODEL_VERSION)
      .order("chunk_id")
      .range(from, from + PAGE - 1);

    if (error) throw new Error(`fetch chunk_embeddings failed: ${error.message}`);
    for (const r of data ?? []) doneIds.add(r.chunk_id as string);
    if (!data || data.length < PAGE) break;
  }
  console.log(`[+] Existing ${MODEL_NAME}@${MODEL_VERSION} embeddings: ${doneIds.size}`);

  const pending = allChunks.filter((c) => !doneIds.has(c.id));
  console.log(`[+] Chunks needing embedding: ${pending.length}`);

  if (pending.length === 0) {
    console.log("[SUCCESS] All chunks are already embedded! No backfill needed.");
    return;
  }

  let embeddedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < pending.length; i += BATCH_SIZE) {
    const batch = pending.slice(i, i + BATCH_SIZE);

    try {
      const embeddings = await batchEmbedWithGeminiFallback(
        batch.map((c) => c.content_chunk),
        1024
      );

      const rows = batch.map((c, idx) => ({
        chunk_id: c.id,
        model_name: MODEL_NAME,
        model_version: MODEL_VERSION,
        embedding: embeddings[idx],
      }));

      const { error: insertErr } = await supabase.from("chunk_embeddings").insert(rows);
      if (insertErr) {
        // Fall back to row-by-row insert for error resilience
        for (const row of rows) {
          const { error: rowErr } = await supabase.from("chunk_embeddings").insert(row);
          if (rowErr) {
            if (/duplicate|conflict/i.test(rowErr.message)) {
              skippedCount++;
            } else {
              console.warn(`[!] Insert error for chunk ${row.chunk_id}: ${rowErr.message}`);
            }
          } else {
            embeddedCount++;
          }
        }
      } else {
        embeddedCount += rows.length;
      }
    } catch (batchErr) {
      console.error(`[!] Batch embedding failed at offset ${i}:`, batchErr);
    }

    const currentTotal = doneIds.size + embeddedCount;
    const pct = ((currentTotal / allChunks.length) * 100).toFixed(1);
    console.log(`--> Progress: embedded ${embeddedCount}/${pending.length} pending (${currentTotal}/${allChunks.length} total, ${pct}%)`);

    // Polite pause between batch requests to stay well within 100 RPM
    await new Promise((r) => setTimeout(r, 600));
  }

  console.log("================================================================");
  console.log(`[SUCCESS] Backfill complete! Added ${embeddedCount} embeddings (skipped ${skippedCount}).`);
  console.log("================================================================");
}

main().catch((err) => {
  console.error("Fatal backfill error:", err);
  process.exit(1);
});
