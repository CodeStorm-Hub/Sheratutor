import { z } from "genkit";
import { ai, MODELS } from "@/ai/genkit";
import { withRetry } from "@/ai/retry";
import { FlowOutputError } from "@/ai/errors";
import { TranscriptionSchema } from "@/ai/schemas/transcription";

/**
 * Layer 1: Vision/OCR. Transcribes a single page image of a handwritten
 * answer script. Bangla + English + equations + diagram labels.
 *
 * Verbatim-transcription is enforced in the prompt (see docs/review §3):
 * silent VLM "correction" of student errors is the single biggest
 * unaddressed risk in the original spec, because it inverts the grading
 * promise in a way score-correlation metrics can't detect.
 */
export const transcribePageFlow = ai.defineFlow(
  {
    name: "transcribePage",
    inputSchema: z.object({
      imageUrl: z.string().describe("Public or signed URL to the page image."),
      expectedLanguage: z.enum(["bn", "en", "mixed"]).default("mixed"),
    }),
    outputSchema: TranscriptionSchema,
  },
  async ({ imageUrl, expectedLanguage }) => {
    const { output } = await withRetry(() =>
      ai.generate({
        model: MODELS.vision,
        prompt: [
          {
            text:
              `You are transcribing a photograph of a handwritten exam answer script ` +
              `written by a Bangladeshi SSC (grade 9-10) student. Expected language: ${expectedLanguage}.\n\n` +
              `CRITICAL: Transcribe EXACTLY what is written, including mistakes. Do not ` +
              `fix incorrect unit conversions, arithmetic errors, misspellings, or wrong ` +
              `formulas — the grading system needs to see the actual error to grade fairly. ` +
              `If the student wrote "÷100" transcribe "÷100" even if the correct step is "÷1000". ` +
              `If text is crossed out, note it but still transcribe what's legible underneath if relevant. ` +
              `Report your own confidence that this transcription is truly verbatim (not silently ` +
              `auto-corrected) in verbatim_confidence, and list any illegible/ambiguous spans.`,
          },
          { media: { url: imageUrl } },
        ],
        output: { schema: TranscriptionSchema },
        config: { temperature: 0.1 },
      })
    );

    if (!output) throw new FlowOutputError("transcribePage");
    return output;
  }
);
