import { z } from "genkit";

/**
 * Layer 4 output — the FR-EVAL-02 structured JSON rubric. This is the single
 * most load-bearing schema in the product: it's what makes grading auditable
 * and correctable instead of an opaque LLM judgment (docs/review §10 —
 * "structured JSON rubric output... is the single best architectural
 * decision in the documents").
 */
export const CriterionEvaluationSchema = z.object({
  step_name: z.string(),
  max_step_marks: z.number(),
  awarded_marks: z.number(),
  status: z.enum(["MATCHED", "PARTIAL", "MISSING", "INCORRECT"]),
  observation: z.string().describe("Specific, cite-able reason for the mark awarded/deducted."),
  cited_rubric_rule: z
    .string()
    .optional()
    .describe("Which rubric criterion (by id/step) this observation is grounded in — required for NFR-REL-03 citation enforcement."),
});

export const RubricEvaluationSchema = z.object({
  question_id: z.string(),
  max_marks: z.number(),
  score_obtained: z.number(),
  criteria_evaluations: z.array(CriterionEvaluationSchema),
  deduction_summary_bn: z.string(),
  deduction_summary_en: z.string(),
  grounding_confidence: z
    .number()
    .min(0)
    .max(1)
    .describe(
      "How well the retrieved RAG context actually covered this question. Low " +
        "confidence means the model may be grading without solid curriculum grounding " +
        "— route to human review rather than silently trusting the score."
    ),
});

export type RubricEvaluation = z.infer<typeof RubricEvaluationSchema>;
export type CriterionEvaluation = z.infer<typeof CriterionEvaluationSchema>;
