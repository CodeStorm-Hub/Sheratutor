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
      models: [{ name: "qwen3:8b" }, { name: "gemma4:e4b" }, { name: "bge-m3" }],
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
// retired 2026-05-18. llama-nemotron-embed-1b-v2 was its replacement but is
// severely bottlenecked by NIM's free tier 40 RPM limit. We have pivoted to
// using the local BGE-M3 model via Ollama, removing all rate limits and
// providing native 1024-dim support, which matches our existing Supabase schema,
// and offers phenomenal multilingual (Bengali) support.
const OLLAMA_EMBED_MODEL = "bge-m3";
const OLLAMA_EMBED_MODEL_VERSION = "v1";
const OLLAMA_EMBED_DIMENSIONS = 1024; // matches chunk_embeddings.embedding vector(1024) — no migration needed

/**
 * Custom embedder using Ollama's /api/embeddings endpoint. We define this 
 * manually so we can handle options like inputType natively if desired.
 * This runs locally on the same box, eliminating the 40 RPM bottleneck.
 */
export const ollamaEmbedder = ai.defineEmbedder(
  {
    name: "ollama/bge-m3",
    configSchema: z.object({
      inputType: z.enum(["query", "passage"]).default("passage"),
    }),
    info: {
      dimensions: OLLAMA_EMBED_DIMENSIONS,
      label: "Ollama — bge-m3",
      supports: { input: ["text"] },
    },
  },
  async (docs, options) => {
    // BGE-M3 is powerful enough for direct mapping, but we can prepend an instruction for query type if needed.
    const prefix = options?.inputType === "query" ? "Represent this sentence for searching relevant passages: " : "";
    const baseUrl = process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434";

    const embeddings = await Promise.all(
      docs.map(async (d) => {
        const res = await fetch(`${baseUrl}/api/embeddings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: OLLAMA_EMBED_MODEL,
            prompt: prefix + d.text,
          }),
        });
        if (!res.ok) {
          throw new Error(`ollamaEmbedder: ${res.status} ${await res.text()}`);
        }
        const json = await res.json() as { embedding: number[] };
        return { embedding: json.embedding };
      })
    );
    return { embeddings };
  }
);

export const EMBED_MODEL_NAME = OLLAMA_EMBED_MODEL;
export const EMBED_MODEL_VERSION = OLLAMA_EMBED_MODEL_VERSION;

export const PIPELINE_VERSION = "v1.2.0-bge-m3-pivot";
export const PROMPT_VERSION = "v1.0.0";
