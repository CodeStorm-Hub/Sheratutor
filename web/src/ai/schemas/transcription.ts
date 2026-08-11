import { z } from "genkit";

/**
 * Layer 1 output. Includes a fidelity signal specifically because VLMs are
 * documented to silently "correct" handwritten errors instead of
 * transcribing them verbatim (BanglaWild benchmark, see docs/review §3) —
 * for a grading product that's inverted and dangerous: it awards marks for
 * mistakes the student never actually made right. `verbatim_confidence`
 * and `uncertain_spans` exist so a downstream fidelity check can run
 * independent of, and before, grading.
 */
export const TranscriptionSchema = z.object({
  transcribed_text: z.string().describe(
    "Verbatim transcription of the handwritten content. Preserve errors, " +
      "crossed-out text (marked with strikethrough notation), and non-standard " +
      "notation exactly as written. Do NOT silently correct spelling, unit " +
      "conversions, or arithmetic — the grading step needs to see the mistake."
  ),
  latex_equations: z.array(z.string()).describe(
    "Any mathematical equations found, transcribed as LaTeX, preserving the " +
      "student's actual working even if incorrect."
  ),
  diagram_descriptions: z
    .array(
      z.object({
        description: z.string(),
        approximate_region: z.string().optional(),
      })
    )
    .describe("Semantic descriptions of any diagrams/drawings on the page."),
  detected_language: z.enum(["bn", "en", "mixed"]),
  verbatim_confidence: z
    .number()
    .min(0)
    .max(1)
    .describe(
      "Self-reported confidence that this transcription is verbatim (not " +
        "silently corrected/normalized). Low confidence should route to human review."
    ),
  uncertain_spans: z
    .array(z.string())
    .describe("Substrings the model was unsure how to read — illegible or ambiguous handwriting."),
});

export type Transcription = z.infer<typeof TranscriptionSchema>;
