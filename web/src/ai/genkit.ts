import { genkit, z } from "genkit";
import { openAICompatible } from "@genkit-ai/compat-oai";
import { ollama } from "genkitx-ollama";

/**
 * Provider pivot (2026-08-13): no Google GenAI API key is available. Every
 * layer now runs on providers that are actually reachable: NVIDIA NIM (free,
 * OpenAI-compatible, ~40 RPM) as the default for vision + reasoning + the
 * dedicated embedder below, local Ollama for offline dev iteration, and
 * Fireworks AI configured but NOT wired as a default model — it's paid
 * (finite $ credit) and deliberately held back until the golden set exists
 * and shows where NIM quality actually falls short (see ingestion/README.md
 * "Golden dataset" section). Swap a MODELS.* value to `fireworks/...` any
 * time; the plugin is already registered below.
 */

const NIM_BASE_URL = "https://integrate.api.nvidia.com/v1";
const FIREWORKS_BASE_URL = "https://api.fireworks.ai/inference/v1";

export const ai = genkit({
  plugins: [
    openAICompatible({
      name: "nim",
      apiKey: process.env.NVIDIA_NIM_API_KEY ?? "unset",
      baseURL: NIM_BASE_URL,
    }),
    // Registered, not defaulted — see provider-pivot note above.
    openAICompatible({
      name: "fireworks",
      apiKey: process.env.FIREWORKS_API_KEY ?? "unset",
      baseURL: FIREWORKS_BASE_URL,
    }),
    ollama({
      serverAddress: process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434",
      models: [{ name: "qwen3:8b" }, { name: "gemma4:e4b" }],
    }),
  ],
});

export const MODELS = {
  // nvidia/nemotron-nano-12b-v2-vl — verified live against this NIM account
  // 2026-08-13: image_url content, text chat, and response_format
  // json_schema all confirmed working via direct curl tests. NOT
  // qwen/qwen3.6-* — that model does not exist on this account's /v1/models
  // catalog (404), despite web documentation suggesting it should. NIM's
  // catalog is account/region-gated; verify against the live /v1/models
  // endpoint before trusting third-party docs on model availability again.
  vision: process.env.GENKIT_VISION_MODEL ?? "nim/nvidia/nemotron-nano-12b-v2-vl",
  reasoning: process.env.GENKIT_REASONING_MODEL ?? "nim/nvidia/nemotron-nano-12b-v2-vl",
} as const;

// nvidia/llama-3.2-nv-embedqa-1b-v2 (last turn's choice) returned HTTP 410 —
// retired 2026-05-18. llama-nemotron-embed-1b-v2 is its replacement: verified
// live, native 2048-dim, `dimensions: 1024` truncation confirmed working.
// Bengali-support claim for this specific successor model is NOT yet
// re-verified against a source (only the retired predecessor's 26-language
// list was documented) — treat as unconfirmed until benchmarked via the
// golden-set harness.
const NIM_EMBED_MODEL = "nvidia/llama-nemotron-embed-1b-v2";
const NIM_EMBED_MODEL_VERSION = "v2";
const NIM_EMBED_DIMENSIONS = 1024; // matches chunk_embeddings.embedding vector(1024) — no migration needed

/**
 * Custom embedder (not the generic openAICompatible model registry) because
 * NV-EmbedQA is an asymmetric retrieval model: it requires `input_type`
 * ("query" at grading time vs. "passage" at ingestion time) and accepts a
 * `dimensions` truncation param the generic OpenAI embeddings shape doesn't
 * know about. Bengali is one of this model's 26 documented evaluated
 * languages — a real, sourced advantage over the untested bge-m3 /
 * gemini-embedding-001 choice this replaces (docs/review §7.2 asked for an
 * empirical benchmark before committing; this is a better-evidenced
 * candidate than either original finalist, still worth re-validating against
 * the golden set once it exists).
 */
export const nimEmbedder = ai.defineEmbedder(
  {
    name: "nim/llama-nemotron-embed-1b-v2",
    configSchema: z.object({
      inputType: z.enum(["query", "passage"]).default("passage"),
    }),
    info: {
      dimensions: NIM_EMBED_DIMENSIONS,
      label: "NVIDIA NIM — llama-nemotron-embed-1b-v2",
      supports: { input: ["text"] },
    },
  },
  async (docs, options) => {
    const res = await fetch(`${NIM_BASE_URL}/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NVIDIA_NIM_API_KEY ?? ""}`,
      },
      body: JSON.stringify({
        input: docs.map((d) => d.text),
        model: NIM_EMBED_MODEL,
        input_type: options?.inputType ?? "passage",
        truncate: "END",
        dimensions: NIM_EMBED_DIMENSIONS,
      }),
    });
    if (!res.ok) {
      throw new Error(`nimEmbedder: ${res.status} ${await res.text()}`);
    }
    const json = (await res.json()) as { data: { embedding: number[] }[] };
    return { embeddings: json.data.map((d) => ({ embedding: d.embedding })) };
  }
);

export const EMBED_MODEL_NAME = NIM_EMBED_MODEL;
export const EMBED_MODEL_VERSION = NIM_EMBED_MODEL_VERSION;

export const PIPELINE_VERSION = "v1.1.0-nim-pivot";
export const PROMPT_VERSION = "v1.0.0";
