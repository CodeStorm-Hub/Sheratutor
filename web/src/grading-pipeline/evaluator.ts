import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { GEMINI_API_KEYS, getNextGeminiApiKey } from "@/ai/genkit";

export type QuestionType = "Ka" | "Kha" | "Ga" | "Gha" | "ka" | "kha" | "ga" | "gha";

export interface KaEvaluation {
  score: number;
  feedback: string;
}

export interface KhaEvaluation {
  score: number;
  point_1_met: boolean;
  point_2_met: boolean;
  feedback: string;
}

export interface GaEvaluation {
  score: number;
  breakdown: {
    knowledge: 0 | 1;
    comprehension: 0 | 1;
    application: 0 | 1;
  };
  feedback: string;
}

export interface GhaEvaluation {
  score: number;
  breakdown: {
    K: 0 | 1;
    C: 0 | 1;
    A: 0 | 1;
    H: 0 | 1;
  };
  feedback: string;
}

export type EvaluationResult = KaEvaluation | KhaEvaluation | GaEvaluation | GhaEvaluation;

export interface EvaluationPromptConfig {
  systemPrompt: string;
  schema: Record<string, unknown>;
}

export const KA_SCHEMA: Record<string, unknown> = {
  type: "object",
  properties: {
    score: {
      type: "number",
      description: "0 or 1 mark for knowledge fact-matching.",
    },
    feedback: {
      type: "string",
      description: "Detailed evaluation explaining whether the fact/definition matched NCTB textbook context.",
    },
  },
  required: ["score", "feedback"],
};

export const KHA_SCHEMA: Record<string, unknown> = {
  type: "object",
  properties: {
    score: {
      type: "number",
      description: "0, 1, or 2 marks based on concept identification and explanation.",
    },
    point_1_met: {
      type: "boolean",
      description: "True if the student correctly identified the core concept or definition (জ্ঞানস্তর).",
    },
    point_2_met: {
      type: "boolean",
      description: "True if the student accurately explained or reasoned the concept (অনুধাবনস্তর).",
    },
    feedback: {
      type: "string",
      description: "Clear pedagogical feedback in Bengali/English detailing which points were satisfied.",
    },
  },
  required: ["score", "point_1_met", "point_2_met", "feedback"],
};

export const GA_SCHEMA: Record<string, unknown> = {
  type: "object",
  properties: {
    score: {
      type: "number",
      description: "Total marks earned (0 to 3) across the three cognitive dimensions.",
    },
    breakdown: {
      type: "object",
      properties: {
        knowledge: {
          type: "integer",
          description: "1 if relevant formula/principle is stated, 0 otherwise.",
        },
        comprehension: {
          type: "integer",
          description: "1 if relationship to stimulus is understood and values mapped, 0 otherwise.",
        },
        application: {
          type: "integer",
          description: "1 if mathematical calculation/solution is executed accurately, 0 otherwise.",
        },
      },
      required: ["knowledge", "comprehension", "application"],
    },
    feedback: {
      type: "string",
      description: "Step-by-step breakdown of knowledge, comprehension, and application accuracy.",
    },
  },
  required: ["score", "breakdown", "feedback"],
};

export const GHA_SCHEMA: Record<string, unknown> = {
  type: "object",
  properties: {
    score: {
      type: "number",
      description: "Total marks earned (0 to 4) for higher-order thinking.",
    },
    breakdown: {
      type: "object",
      properties: {
        K: {
          type: "integer",
          description: "Knowledge (জ্ঞান): 1 if relevant theory/law identified, 0 otherwise.",
        },
        C: {
          type: "integer",
          description: "Comprehension (অনুধাবন): 1 if context interpreted correctly, 0 otherwise.",
        },
        A: {
          type: "integer",
          description: "Application (প্রয়োগ): 1 if mathematical modeling or analytical procedure applied, 0 otherwise.",
        },
        H: {
          type: "integer",
          description: "Higher Order Thinking (উচ্চতর দক্ষতা): 1 if synthesis, comparative judgment, or critical conclusion present, 0 otherwise.",
        },
      },
      required: ["K", "C", "A", "H"],
    },
    feedback: {
      type: "string",
      description: "Comprehensive critique addressing all 4 tiers of the NCTB creative rubric.",
    },
  },
  required: ["score", "breakdown", "feedback"],
};

/**
 * Factory pattern routing question_type to one of four distinct system prompts & JSON schemas.
 */
export function getPromptConfigForQuestionType(questionType: QuestionType): EvaluationPromptConfig {
  const normalized = questionType.trim().toLowerCase();

  switch (normalized) {
    case "ka":
      return {
        systemPrompt: `You are an expert NCTB Creative Question (CQ) Examiner specializing in Part 'Ka' (ক - জ্ঞানমূলক প্রশ্ন, 1 Mark).
Your mandate:
1. Strict fact-matching against the authoritative NCTB textbook context.
2. If the student's answer contains the exact definition, law, name, formula, or factual statement required by the curriculum, assign score = 1.
3. If the definition is fundamentally missing, erroneous, or factually contradictory, assign score = 0.
4. Do not penalize minor spelling variations if the core scientific/factual meaning is unambiguous.
5. Provide constructive feedback citing the textbook grounding.`,
        schema: KA_SCHEMA,
      };

    case "kha":
      return {
        systemPrompt: `You are an expert NCTB Creative Question (CQ) Examiner specializing in Part 'Kha' (খ - অনুধাবনমূলক প্রশ্ন, 2 Marks).
Your mandate:
1. Point 1 (Knowledge/জ্ঞান - 1 Mark): Has the student correctly named, defined, or identified the underlying scientific principle/concept?
2. Point 2 (Comprehension/অনুধাবন - 1 Mark): Has the student explained the concept or answered 'why'/'how' with coherent scientific reasoning?
3. Set point_1_met = true if the concept is identified.
4. Set point_2_met = true if the rationale/explanation is sound.
5. Score must equal (point_1_met ? 1 : 0) + (point_2_met ? 1 : 0).
6. Provide specific pedagogical feedback citing both points.`,
        schema: KHA_SCHEMA,
      };

    case "ga":
      return {
        systemPrompt: `You are an expert NCTB Creative Question (CQ) Examiner specializing in Part 'Ga' (গ - প্রয়োগমূলক প্রশ্ন, 3 Marks).
Your mandate:
1. Evaluate 3 distinct cognitive steps:
   - knowledge (1 mark): Stating correct formula, units, or law required for the scenario.
   - comprehension (1 mark): Correctly interpreting the stimulus (উদ্দীপক) and mapping variables.
   - application (1 mark): Carrying out calculations, algebraic manipulation, or procedure to arrive at the solution.
2. Consequential grading applies: If a prior arithmetic slip occurs but subsequent logic holds, reward partial steps.
3. Total score = knowledge + comprehension + application (0 to 3).
4. Provide structured diagnostic feedback detailing each step.`,
        schema: GA_SCHEMA,
      };

    case "gha":
      return {
        systemPrompt: `You are an expert NCTB Creative Question (CQ) Examiner specializing in Part 'Gha' (ঘ - উচ্চতর দক্ষতামূলক প্রশ্ন, 4 Marks).
Your mandate:
1. Evaluate all 4 cognitive tiers:
   - K (Knowledge - 1 mark): Theoretical baseline, identification of governing laws.
   - C (Comprehension - 1 mark): Deep contextual interpretation of the stem scenario.
   - A (Application - 1 mark): Quantitative computation, comparative analysis, or simulation of conditions.
   - H (Higher-order thinking - 1 mark): Critical synthesis, evaluation of claims, justification, and reasoned final verdict.
2. Total score = K + C + A + H (0 to 4).
3. Do not award H if A or C are completely absent or invalid.
4. Provide authoritative feedback highlighting reasoning strengths and gaps.`,
        schema: GHA_SCHEMA,
      };

    default:
      throw new Error(`Unsupported question type: ${questionType}. Must be Ka, Kha, Ga, or Gha.`);
  }
}

/**
 * Free-tier Google AI Studio Gemini API models with native JSON Schema output support.
 */
const FREE_TIER_GEMINI_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-2.5-flash",
];

/**
 * Executes evaluation using Google AI Studio's Gemini API (Free Tier) with native responseSchema.
 * Automatically fails over across rotating free keys on rate limits.
 */
export async function evaluateWithGemini(
  questionType: QuestionType,
  studentAnswer: string,
  textbookContext: string,
  stemContext?: string,
  overrideApiKey?: string
): Promise<{ result: EvaluationResult; rawText: string }> {
  const config = getPromptConfigForQuestionType(questionType);

  const userPrompt = `
=== NCTB CURRICULUM TEXTBOOK GROUNDING ===
${textbookContext || "No specific textbook chunk provided."}

=== STEM / STIMULUS (উদ্দীপক) ===
${stemContext || "No stem provided for this standalone question."}

=== STUDENT SUBMITTED ANSWER ===
${studentAnswer}

Evaluate the student answer strictly against the textbook grounding and rubric rules. Return only valid JSON strictly matching the requested schema.
`.trim();

  // Assemble list of candidate free-tier API keys
  const keysToTry: string[] = [];
  if (overrideApiKey) {
    keysToTry.push(overrideApiKey);
  }
  const nextKey = getNextGeminiApiKey();
  if (nextKey && !keysToTry.includes(nextKey)) {
    keysToTry.push(nextKey);
  }
  for (const k of GEMINI_API_KEYS) {
    if (k && !keysToTry.includes(k)) {
      keysToTry.push(k);
    }
  }

  // Fallback if no keys defined in local dev
  if (keysToTry.length === 0) {
    keysToTry.push(process.env.GEMINI_API_KEY || "dummy_free_gemini_key");
  }

  let lastError: Error | null = null;

  for (const key of keysToTry) {
    for (const model of FREE_TIER_GEMINI_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: config.systemPrompt }],
            },
            contents: [
              {
                role: "user",
                parts: [{ text: userPrompt }],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: config.schema,
              temperature: 0.1,
            },
          }),
        });

        if (!response.ok) {
          const errBody = await response.text();
          // If rate limit (429) or model error, failover to next key/model
          lastError = new Error(`Gemini API error (${response.status}): ${errBody}`);
          continue;
        }

        const data = (await response.json()) as {
          candidates?: Array<{
            content?: {
              parts?: Array<{ text?: string }>;
            };
          }>;
        };

        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) {
          lastError = new Error("Gemini returned empty candidate content.");
          continue;
        }

        const parsed = JSON.parse(rawText) as EvaluationResult;
        return { result: parsed, rawText };
      } catch (err: unknown) {
        lastError = err instanceof Error ? err : new Error(String(err));
      }
    }
  }

  throw lastError || new Error("Failed to evaluate using Google AI Studio Gemini API.");
}

// Aliases for unified imports
export const evaluateStudentAnswer = evaluateWithGemini;
export const evaluateWithAnthropic = evaluateWithGemini;
