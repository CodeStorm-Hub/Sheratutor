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
 *
 * Embedder pivot (2026-08-19): local Ollama (bge-m3) has no reachable
 * equivalent on Vercel — 127.0.0.1:11434 only exists on a dev machine, and
 * Ollama can't be hosted ON Vercel either (needs a persistent daemon holding
 * model weights in memory; Vercel functions are stateless/short-lived). True
 * bge-m3 isn't available hosted for free anywhere reachable from Vercel
 * either (checked NIM's and Alibaba's live /v1/models catalogs — neither
 * carries it). Tried Alibaba Model Studio's text-embedding-v4 first, but its
 * free quota status turned out to be uncertain (pay-as-you-go pricing behind
 * it) — reverted in favor of NIM. Tried nv-embedqa-e5-v5 next (1024-dim
 * native) but it has only a 512-token context — most real textbook chunks
 * here (median 1579 chars) blew past that and got rejected outright. Settled
 * on llama-nemotron-embed-1b-v2 with `dimensions: 1024` in the request body
 * (Matryoshka truncation — verified live against the actual longest chunk in
 * this corpus, 3261 chars, no error) — same 1024-dim column, real context
 * room, and NIM's free tier is a fixed request/credit allowance with no card
 * on file, so no billing-surprise risk. `process.env.VERCEL` is set
 * automatically on every Vercel environment, so no new env var is needed to
 * pick the right embedder.
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
  // nvidia/nemotron-nano-12b-v2-vl (2026-08-13 pick) carries a `deprecation:
  // 2026-08-26T09:00:00Z` response header — confirmed live 2026-08-19, one
  // week before it stops working. Replaced with
  // nvidia/nemotron-3-nano-omni-30b-a3b-reasoning: no deprecation header,
  // and verified live against this NIM account — image_url content, text
  // chat, and response_format json_schema all confirmed working. NOT
  // qwen/qwen3.6-* — that model does not exist on this account's /v1/models
  // catalog (404), despite web documentation suggesting it should. NIM's
  // catalog is account/region-gated; verify against the live /v1/models
  // endpoint before trusting third-party docs on model availability again.
  vision: process.env.GENKIT_VISION_MODEL ?? "nim/nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
  reasoning: process.env.GENKIT_REASONING_MODEL ?? "nim/nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
} as const;

// Local dev uses BGE-M3 via Ollama (no rate limit, native 1024-dim, strong
// Bengali support). Production (no reachable Ollama) uses NIM's
// llama-nemotron-embed-1b-v2, native 2048-dim truncated to 1024 via the
// `dimensions` param — see the embedder-pivot note above for why, and why
// not nv-embedqa-e5-v5 (1024 native, but 512-token context, too small for
// this corpus's real chunks).
const OLLAMA_EMBED_MODEL = "bge-m3";
const OLLAMA_EMBED_MODEL_VERSION = "v1";
const OLLAMA_EMBED_DIMENSIONS = 1024; // matches chunk_embeddings.embedding vector(1024) — no migration needed

const NIM_EMBED_MODEL = "nvidia/llama-nemotron-embed-1b-v2";
const NIM_EMBED_MODEL_VERSION = "v1";
const NIM_EMBED_DIMENSIONS = 1024; // truncated via `dimensions` param — native is 2048; matches OLLAMA_EMBED_DIMENSIONS

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

/**
 * Query embedder using NIM's hosted llama-nemotron-embed-1b-v2 (/embeddings,
 * OpenAI-style body, native 2048-dim truncated to 1024 via `dimensions`).
 * Used instead of ollamaEmbedder wherever Ollama isn't reachable — i.e.
 * every Vercel environment. NIM's input_type values differ from Ollama's, so
 * this is a separate embedder rather than a baseUrl swap on ollamaEmbedder.
 */
export const nimEmbedder = ai.defineEmbedder(
  {
    name: "nim/llama-nemotron-embed-1b-v2",
    configSchema: z.object({
      inputType: z.enum(["query", "passage"]).default("passage"),
    }),
    info: {
      dimensions: NIM_EMBED_DIMENSIONS,
      label: "NIM — llama-nemotron-embed-1b-v2",
      supports: { input: ["text"] },
    },
  },
  async (docs, options) => {
    const res = await fetch(`${NIM_BASE_URL}/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NVIDIA_NIM_API_KEY ?? "unset"}`,
      },
      body: JSON.stringify({
        model: NIM_EMBED_MODEL,
        input: docs.map((d) => d.text),
        input_type: options?.inputType ?? "passage",
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

// Vercel sets `VERCEL` on every deployed environment (production, preview,
// and its own dev proxy) — nothing exists at that address there, so this is
// the one reliable signal to route embeddings to NIM instead of Ollama.
const IS_VERCEL = Boolean(process.env.VERCEL);

export const activeEmbedder = IS_VERCEL ? nimEmbedder : ollamaEmbedder;
export const EMBED_MODEL_NAME = IS_VERCEL ? NIM_EMBED_MODEL : OLLAMA_EMBED_MODEL;
export const EMBED_MODEL_VERSION = IS_VERCEL ? NIM_EMBED_MODEL_VERSION : OLLAMA_EMBED_MODEL_VERSION;

export const PIPELINE_VERSION = "v1.2.0-bge-m3-pivot";
export const PROMPT_VERSION = "v1.0.0";
