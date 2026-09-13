import dns from "node:dns";
import { genkit, z } from "genkit/beta";
import { googleAI } from "@genkit-ai/google-genai";
import { ollama } from "genkitx-ollama";

if (typeof dns?.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

/**
 * Provider architecture (Google AI Studio Gemini API):
 * All reasoning, vision OCR, practice paper generation, and embedding pipelines
 * run on Google AI Studio's Gemini models via `@genkit-ai/google-genai`.
 *
 * Automated failover is supported across primary (GEMINI_API_KEY) and secondary
 * (GEMINI_API_KEY_SECONDARY) keys to seamlessly absorb daily free-tier quotas.
 */

export const GEMINI_API_KEYS = [
  process.env.GEMINI_API_KEY || process.env.GCP_API_KEY || "",
  process.env.GEMINI_API_KEY_SECONDARY || "",
  process.env.GEMINI_API_KEY_TERTIARY || process.env.GEMINI_API_KEY_3 || "",
  ...(process.env.GEMINI_API_KEYS ? process.env.GEMINI_API_KEYS.split(",").map((k) => k.trim()) : []),
].filter(Boolean);

let geminiKeyIndex = 0;
export function getNextGeminiApiKey(): string {
  if (GEMINI_API_KEYS.length === 0) return "";
  const key = GEMINI_API_KEYS[geminiKeyIndex % GEMINI_API_KEYS.length];
  geminiKeyIndex++;
  return key;
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY || process.env.GCP_API_KEY,
    }),
    ollama({
      serverAddress: process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434",
      models: [{ name: "qwen3:8b" }, { name: "gemma4:e4b" }, { name: "bge-m3" }],
    }),
  ],
});

/**
 * Standardized Model IDs:
 * - Primary reasoning, vision & paper: gemini-2.5-flash (multimodal, deep Bengali & LaTeX reasoning)
 * - Fallback: gemini-2.0-flash
 */
export const MODELS = {
  vision: process.env.GENKIT_VISION_MODEL ?? "googleai/gemini-2.5-flash",
  reasoning: process.env.GENKIT_REASONING_MODEL ?? "googleai/gemini-2.5-flash",
  fast: process.env.GENKIT_FAST_MODEL ?? "googleai/gemini-2.5-flash",
  paper: process.env.GENKIT_PAPER_MODEL ?? "googleai/gemini-2.5-flash",
} as const;

// Fallback reasoning model
export const FALLBACK_REASONING_MODEL =
  process.env.GENKIT_FALLBACK_REASONING_MODEL ?? "googleai/gemini-2.5-flash-lite";

export const geminiEmbedder = googleAI.embedder("gemini-embedding-2");

// Active embedder: gemini-embedding-2 (1024-dim Matryoshka) matching Supabase curriculum_chunks
export const isLocalOllamaEmbed = false;
export const activeEmbedder = geminiEmbedder;
export const EMBED_MODEL_NAME = "gemini-embedding-2";
export const EMBED_MODEL_VERSION = "v1";

export const PIPELINE_VERSION = "v2.0.0-gemini";
export const PROMPT_VERSION = "v2.0.0";

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
 * Robust batch embedding with automated failover across Gemini API keys
 */
export async function batchEmbedWithGeminiFallback(
  texts: string[],
  outputDimensionality: number = 1024
): Promise<number[][]> {
  if (texts.length === 0) return [];

  // Direct batchEmbedContents API failover across all configured Gemini API keys
  for (const key of GEMINI_API_KEYS) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:batchEmbedContents?key=${key}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              requests: texts.map((text) => ({
                model: "models/gemini-embedding-2",
                content: { parts: [{ text }] },
                outputDimensionality,
              })),
            }),
          }
        );
        if (res.status === 429) {
          // Rate limited, wait 2.5s and retry
          await new Promise((r) => setTimeout(r, 2500));
          continue;
        }
        if (!res.ok) {
          break; // Try next key
        }
        const data = (await res.json()) as {
          embeddings?: { values?: number[] }[];
        };
        if (data.embeddings && data.embeddings.length === texts.length) {
          return data.embeddings.map((e) => e.values ?? []);
        }
      } catch (_) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }

  throw new Error("batchEmbedWithGeminiFallback: All Gemini embedding keys exhausted or failed");
}

/**
 * Robust text generation with automated failover across Gemini models and keys
 */
export async function generateWithGeminiFallback(
  prompt: string,
  config?: { temperature?: number; model?: string }
): Promise<string> {
  const targetModel = config?.model ?? MODELS.reasoning;

  // 1. Try Genkit primary generate
  try {
    const res = await ai.generate({
      model: targetModel,
      prompt,
      config: { temperature: config?.temperature ?? 0.3 },
    });
    if (res.text) return res.text;
  } catch (primaryErr) {
    console.warn("Primary ai.generate failed, trying fallback models / keys:", primaryErr);
  }

  // 2. Try with secondary Gemini API key via Genkit per-request config
  for (const key of GEMINI_API_KEYS) {
    try {
      const res = await ai.generate({
        model: targetModel,
        prompt,
        config: {
          apiKey: key,
          temperature: config?.temperature ?? 0.3,
        },
      });
      if (res.text) return res.text;
    } catch (_) {}
  }

  // 3. Try with FALLBACK_REASONING_MODEL
  try {
    const res = await ai.generate({
      model: FALLBACK_REASONING_MODEL,
      prompt,
      config: { temperature: config?.temperature ?? 0.3 },
    });
    if (res.text) return res.text;
  } catch (_) {}

  // 4. Direct REST failover across all keys using standard Gemini 2.5 Flash / 2.0 Flash
  const fallbackModelName = targetModel.replace(/^googleai\//, "");
  for (const key of GEMINI_API_KEYS) {
    for (const modelToTry of [fallbackModelName, "gemini-2.5-flash", "gemini-2.5-flash-lite"]) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelToTry}:generateContent?key=${key}`,
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
  }

  throw new Error("generateWithGeminiFallback: All Gemini generation keys exhausted or failed");
}

/**
 * Legacy embedders preserved for backward compatibility
 */
export const ollamaEmbedder = ai.defineEmbedder(
  {
    name: "ollama/bge-m3",
    configSchema: z.object({
      inputType: z.enum(["query", "passage"]).default("passage"),
    }),
    info: {
      dimensions: 1024,
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
            model: "bge-m3",
            prompt: prefix + d.text,
          }),
        });
        if (!res.ok) {
          throw new Error(`ollamaEmbedder: ${res.status} ${await res.text()}`);
        }
        const json = (await res.json()) as { embedding: number[] };
        return { embedding: json.embedding };
      })
    );
    return { embeddings };
  }
);

export const nimEmbedder = ai.defineEmbedder(
  {
    name: "nim/llama-nemotron-embed-1b-v2",
    configSchema: z.object({
      inputType: z.enum(["query", "passage"]).default("passage"),
    }),
    info: {
      dimensions: 1024,
      label: "NIM — llama-nemotron-embed-1b-v2",
      supports: { input: ["text"] },
    },
  },
  async (docs) => {
    // Fall back to active Gemini embedder
    const embeddings = await Promise.all(
      docs.map(async (d) => {
        const emb = await embedWithGeminiFallback(d.text, 1024);
        return { embedding: emb };
      })
    );
    return { embeddings };
  }
);
