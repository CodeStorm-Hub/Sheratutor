// Run via `npm run reembed:nim`, which passes --env-file=.env.local to tsx.
// That's a runtime flag applied before any module in this file's import
// graph executes — unlike a top-level `dotenv.config()` call here, which
// would run too late: static imports are hoisted above it, so genkit.ts's
// module-level `process.env.NVIDIA_NIM_API_KEY` read would already be "".
import { ai, nimEmbedder, EMBED_MODEL_NAME, EMBED_MODEL_VERSION } from "../src/ai/genkit";
import { getServiceRoleClient } from "../src/lib/supabase/service-role";

/**
 * Backfill every curriculum_chunks row with an embedding under the CURRENTLY
 * ACTIVE embedder (genkit.ts `EMBED_MODEL_NAME` / `EMBED_MODEL_VERSION`).
 * `match_curriculum_chunks` filters strictly by model_name+version, so any
 * chunk missing a row for the active model is invisible to RAG in every
 * environment. Idempotent: skips chunks that already have a matching row, so
 * a killed run can just be re-invoked. Re-run this whenever the embedder ID
 * or version changes in genkit.ts.
 */
const MODEL_NAME = EMBED_MODEL_NAME;
const MODEL_VERSION = EMBED_MODEL_VERSION;
const BATCH_SIZE = 16; // verified live against this NIM account
const PAGE = 1000; // PostgREST hard row cap per response

async function main() {
  const supabase = getServiceRoleClient();

  // Both reads MUST be paged — PostgREST silently caps every response at
  // 1000 rows. (The first run of this script only covered 1000 of ~2300
  // chunks for exactly this reason.)
  const allChunks: { id: string; content_chunk: string }[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("curriculum_chunks")
      .select("id, content_chunk")
      .order("id") // stable ordering — required for correct .range() paging
      .range(from, from + PAGE - 1);
    if (error) throw new Error(`fetch curriculum_chunks: ${error.message}`);
    allChunks.push(...(data ?? []));
    if (!data || data.length < PAGE) break;
  }

  const doneIds = new Set<string>();
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("chunk_embeddings")
      .select("chunk_id")
      .eq("model_name", MODEL_NAME)
      .eq("model_version", MODEL_VERSION)
      .order("chunk_id")
      .range(from, from + PAGE - 1);
    if (error) throw new Error(`fetch chunk_embeddings: ${error.message}`);
    for (const r of data ?? []) doneIds.add(r.chunk_id as string);
    if (!data || data.length < PAGE) break;
  }

  let skipped = 0;
  const pending = allChunks.filter((c) => !doneIds.has(c.id));
  console.log(
    `${pending.length} of ${allChunks.length} chunks need a ${MODEL_NAME}@${MODEL_VERSION} embedding.`
  );

  for (let i = 0; i < pending.length; i += BATCH_SIZE) {
    const batch = pending.slice(i, i + BATCH_SIZE);
    const embeddings = await ai.embedMany({
      embedder: nimEmbedder,
      content: batch.map((c) => c.content_chunk),
      options: { inputType: "passage" },
    });

    const rows = batch.map((c, idx) => ({
      chunk_id: c.id,
      model_name: MODEL_NAME,
      model_version: MODEL_VERSION,
      embedding: embeddings[idx].embedding,
    }));

    const { error: insertErr } = await supabase.from("chunk_embeddings").insert(rows);
    if (insertErr) {
      // A concurrent ingestion run can delete a curriculum_chunks row between
      // our fetch and this insert (FK violation on chunk_id). Fall back to
      // per-row inserts so one vanished parent doesn't abort the whole run;
      // count the skips and report them at the end.
      if (/foreign key|violates/i.test(insertErr.message)) {
        for (const row of rows) {
          const { error: rowErr } = await supabase.from("chunk_embeddings").insert(row);
          if (rowErr) {
            if (/foreign key|violates|duplicate/i.test(rowErr.message)) skipped++;
            else throw new Error(`insert chunk_embeddings row ${row.chunk_id}: ${rowErr.message}`);
          }
        }
      } else {
        throw new Error(`insert chunk_embeddings batch at ${i}: ${insertErr.message}`);
      }
    }

    console.log(`embedded ${Math.min(i + BATCH_SIZE, pending.length)}/${pending.length}`);
  }

  console.log(`done.${skipped ? ` (${skipped} chunks skipped — deleted by a concurrent run; re-run when ingestion is idle)` : ""}`);
}

main().catch((err) => {
  console.error("reembed-nim failed:", err);
  process.exit(1);
});
