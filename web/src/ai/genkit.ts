import dns from "node:dns";
import { genkit, z } from "genkit/beta";
import { googleAI } from "@genkit-ai/google-genai";
import { openAICompatible } from "@genkit-ai/compat-oai";
import { ollama } from "genkitx-ollama";

if (typeof dns?.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

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
const AGENTROUTER_BASE_URL = process.env.AGENTROUTER_BASE_URL ?? "https://agentrouter.org/v1";

/**
 * Normalizer fetch for AgentRouter endpoints.
 * Injects required WAF User-Agent header, catches upstream HTTP errors cleanly,
 * and converts text/plain chat completion responses to application/json.
 */
export const agentRouterFetch = async (url: string | URL | Request, init?: RequestInit) => {
  const res = await fetch(url, init);
  if (!res.ok) {
    const errorBody = await res.text();
    let parsedMsg = errorBody;
    try {
      const json = JSON.parse(errorBody);
      if (json.error?.message) {
        parsedMsg = `${json.error.code ?? "API_ERROR"}: ${json.error.message}`;
      }
    } catch (_) {}
    throw new Error(`AgentRouter HTTP ${res.status} (${res.statusText}): ${parsedMsg}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("text/plain")) {
    const headers = new Headers(res.headers);
    headers.set("content-type", "application/json");
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
  }
  return res;
};

export const GEMINI_API_KEYS = [
  process.env.GEMINI_API_KEY || process.env.GCP_API_KEY || "",
  process.env.GEMINI_API_KEY_SECONDARY || "",
].filter(Boolean);

let geminiKeyIndex = 0;
export function getNextGeminiApiKey(): string {
  if (GEMINI_API_KEYS.length === 0) return "";
  const key = GEMINI_API_KEYS[geminiKeyIndex % GEMINI_API_KEYS.length];
  geminiKeyIndex++;
  return key;
}

/**
 * Robust embedding with automated failover across Gemini API keys
 */
export async function embedWithGeminiFallback(
  text: string,
  outputDimensionality: number = 1024
): Promise<number[]> {
  // 1. Try Genkit primary embedder first
  try {
    const embedResponse = await ai.embed({
      embedder: activeEmbedder,
      content: text,
      options: { outputDimensionality },
    });
    if (embedResponse[0]?.embedding) {
      return embedResponse[0].embedding;
    }
  } catch (primaryErr) {
    console.warn("Primary ai.embed failed, checking secondary Gemini keys:", primaryErr);
  }

  // 2. Failover across all configured Gemini API keys directly
  for (const key of GEMINI_API_KEYS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: { parts: [{ text }] },
            outputDimensionality,
          }),
        }
      );
      if (!res.ok) continue;
      const data = (await res.json()) as { embedding?: { values?: number[] } };
      if (data.embedding?.values) {
        return data.embedding.values;
      }
    } catch (_) {}
  }

  throw new Error("embedWithGeminiFallback: All Gemini embedding keys exhausted or failed");
}

/**
 * Robust text generation with automated failover across Gemini API keys and NIM
 */
export async function generateWithGeminiFallback(
  prompt: string,
  config?: { temperature?: number }
): Promise<string> {
  // 1. Try Genkit primary generate
  try {
    const res = await ai.generate({
      model: MODELS.reasoning,
      prompt,
      config: { temperature: config?.temperature ?? 0.3 },
    });
    if (res.text) return res.text;
  } catch (primaryErr) {
    console.warn("Primary ai.generate failed, checking secondary Gemini keys:", primaryErr);
  }

  // 2. Failover across all configured Gemini API keys directly
  for (const key of GEMINI_API_KEYS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: config?.temperature ?? 0.3,
            },
          }),
        }
      );
      if (!res.ok) continue;
      const data = (await res.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (_) {}
  }

  throw new Error("generateWithGeminiFallback: All Gemini generation keys exhausted or failed");
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY || process.env.GCP_API_KEY,
    }),
    openAICompatible({
      name: "agentrouter",
      apiKey: process.env.AGENTROUTER_API_KEY ?? "",
      baseURL: AGENTROUTER_BASE_URL,
      fetch: agentRouterFetch,
      defaultHeaders: { "User-Agent": "Cline/3.0.0" },
    }),
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

/**
 * Model IDs: Powered by Google Gemini.
 * - Primary reasoning/fast: gemini-3.5-flash-lite (500 RPD, ~3s latency, full LaTeX/KaTeX).
 * - Fallback: gemini-2.5-flash.
 */
export const MODELS = {
  vision: process.env.GENKIT_VISION_MODEL ?? "googleai/gemini-3.5-flash-lite",
  reasoning: process.env.GENKIT_REASONING_MODEL ?? "googleai/gemini-3.5-flash-lite",
  fast: process.env.GENKIT_FAST_MODEL ?? "googleai/gemini-3.5-flash-lite",
  paper: process.env.GENKIT_PAPER_MODEL ?? "googleai/gemini-3.5-flash-lite",
} as const;

// Fallback reasoning model
export const FALLBACK_REASONING_MODEL =
  process.env.GENKIT_FALLBACK_REASONING_MODEL ?? "googleai/gemini-2.5-flash";

// NIM's hosted llama-nemotron-embed-vl-1b-v2 with `dimensions: 1024`
// (Matryoshka truncation, verified) — successor to the retired
// llama-nemotron-embed-1b-v2, same vector(1024) column. Used for BOTH local
// dev and production (no Ollama split) so dev exercises the exact prod path.
const NIM_EMBED_MODEL = "nvidia/llama-nemotron-embed-vl-1b-v2";
const NIM_EMBED_MODEL_VERSION = "v2";
const NIM_EMBED_DIMENSIONS = 1024;

const OLLAMA_EMBED_MODEL = "bge-m3";
const OLLAMA_EMBED_DIMENSIONS = 1024;

/**
 * Custom embedder using Ollama's /api/embeddings endpoint (for offline fallback).
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

import https from "node:https";

/**
 * Query embedder using NVIDIA NIM's hosted llama-nemotron-embed-1b-v2 (/embeddings,
 * 1024-dim Matryoshka). Standard default for all live environments.
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
    const inputType = options?.inputType ?? "passage";
    const body = JSON.stringify({
      model: NIM_EMBED_MODEL,
      input: docs.map((d) => d.text),
      input_type: inputType,
      dimensions: NIM_EMBED_DIMENSIONS,
    });

    const data = await new Promise<string>((resolve, reject) => {
      const req = https.request(
        `${NIM_BASE_URL}/embeddings`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NVIDIA_NIM_API_KEY ?? "unset"}`,
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(body),
          },
        },
        (res) => {
          let responseText = "";
          res.on("data", (chunk) => (responseText += chunk));
          res.on("end", () => {
            if (res.statusCode && res.statusCode >= 400) {
              reject(new Error(`nimEmbedder HTTP ${res.statusCode}: ${responseText}`));
            } else {
              resolve(responseText);
            }
          });
        }
      );
      req.on("error", reject);
      req.write(body);
      req.end();
    });

    const json = JSON.parse(data) as { data: { embedding: number[] }[] };
    return { embeddings: json.data.map((d) => ({ embedding: d.embedding })) };
  }
);

export const geminiEmbedder = googleAI.embedder("gemini-embedding-2");

// Active embedder: gemini-embedding-2 matching our 304 ingested Supabase curriculum chunks
export const isLocalOllamaEmbed = false;
export const activeEmbedder = geminiEmbedder;
export const EMBED_MODEL_NAME = "gemini-embedding-2";
export const EMBED_MODEL_VERSION = "v1";

export const PIPELINE_VERSION = "v1.5.0-gemini";
export const PROMPT_VERSION = "v1.2.0";
