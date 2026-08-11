import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

/**
 * Central Genkit instance. Model IDs are read from env, never hardcoded —
 * Gemini generations have been retiring roughly every 4-6 months (1.5 -> 2.0
 * -> 2.5, see docs/review §1.4); pin the version here via env so a
 * deprecation is a config change, not a code change.
 */
export const ai = genkit({
  plugins: [googleAI()],
});

export const MODELS = {
  vision: process.env.GENKIT_VISION_MODEL ?? "googleai/gemini-3.5-flash",
  reasoning: process.env.GENKIT_REASONING_MODEL ?? "googleai/gemini-3.5-flash",
  embedding: process.env.GENKIT_EMBEDDING_MODEL ?? "googleai/gemini-embedding-001",
} as const;

export const PIPELINE_VERSION = "v1.0.0-vertical-slice";
export const PROMPT_VERSION = "v1.0.0";
