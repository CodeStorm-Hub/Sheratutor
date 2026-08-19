// Run via `npm run reembed:nim`, which passes --env-file=.env.local to tsx.
// That's a runtime flag applied before any module in this file's import
// graph executes — unlike a top-level `dotenv.config()` call here, which
// would run too late: static imports are hoisted above it, so genkit.ts's
// module-level `process.env.NVIDIA_NIM_API_KEY` read would already be "".
import { ai, nimEmbedder } from "../src/ai/genkit";
import { getServiceRoleClient } from "../src/lib/supabase/service-role";

/**
 * One-off backfill: curriculum_chunks were originally embedded only under
 * model_name="bge-m3" (local Ollama). Production now queries with
 * model_name="nvidia/nv-embedqa-e5-v5" (NIM — see genkit.ts's embedder
 * pivot note), and match_curriculum_chunks filters strictly by
 * model_name+version, so without this, prod grounding silently returns zero
 * matches. Idempotent: skips chunks that already have a matching row, so a
 * killed run can just be re-invoked.
 */
const MODEL_NAME = "nvidia/llama-nemotron-embed-1b-v2";
const MODEL_VERSION = "v1";
const BATCH_SIZE = 20; // verified live against this NIM account

async function main() {
  const supabase = getServiceRoleClient();

  const { data: allChunks, error: chunksErr } = await supabase
    .from("curriculum_chunks")
    .select("id, content_chunk");
  if (chunksErr) throw new Error(`fetch curriculum_chunks: ${chunksErr.message}`);

  const { data: done, error: doneErr } = await supabase
    .from("chunk_embeddings")
    .select("chunk_id")
    .eq("model_name", MODEL_NAME)
    .eq("model_version", MODEL_VERSION);
  if (doneErr) throw new Error(`fetch chunk_embeddings: ${doneErr.message}`);
  const doneIds = new Set((done ?? []).map((r) => r.chunk_id));

  const pending = (allChunks ?? []).filter((c) => !doneIds.has(c.id));
  console.log(`${pending.length} of ${allChunks?.length ?? 0} chunks need a ${MODEL_NAME} embedding.`);

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
    if (insertErr) throw new Error(`insert chunk_embeddings batch at ${i}: ${insertErr.message}`);

    console.log(`embedded ${Math.min(i + BATCH_SIZE, pending.length)}/${pending.length}`);
  }

  console.log("done.");
}

main().catch((err) => {
  console.error("reembed-nim failed:", err);
  process.exit(1);
});
