import express, { Request, Response, Router } from "express";
import { getTop3TextbookChunks } from "./db";
import {
  evaluateStudentAnswer,
  QuestionType,
  EvaluationResult,
} from "./evaluator";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

export interface EvaluateRequestBody {
  question_type: QuestionType;
  student_answer: string;
  question_topic_id: string;
  stem_context?: string;
  question_id?: string;
}

export interface AmbiguityAssessment {
  isAmbiguous: boolean;
  confidence: number;
  reason?: string;
}

/**
 * Evaluates whether the LLM's response or question characteristics indicate ambiguity
 * requiring Human-in-the-Loop (HITL) manual review.
 */
export function assessAmbiguity(
  questionType: QuestionType,
  studentAnswer: string,
  evaluation: EvaluationResult
): AmbiguityAssessment {
  const answerLen = studentAnswer.trim().length;
  const feedbackLower = (evaluation.feedback || "").toLowerCase();

  // Keyword indicators of doubt in English or Bengali
  const ambiguityKeywords = [
    "ambiguous",
    "unclear",
    "borderline",
    "partially unclear",
    "cannot determine",
    "uncertain",
    "অস্পষ্ট",
    "দ্ব্যর্থবোধক",
    "সংশয়",
    "অনিশ্চিত",
  ];

  for (const kw of ambiguityKeywords) {
    if (feedbackLower.includes(kw)) {
      return {
        isAmbiguous: true,
        confidence: 0.55,
        reason: `Feedback contains uncertainty indicator keyword: "${kw}"`,
      };
    }
  }

  // Substantial answer provided (> 30 characters) but scored 0
  if (answerLen >= 30 && evaluation.score === 0) {
    return {
      isAmbiguous: true,
      confidence: 0.6,
      reason: "Significant student answer received zero marks; requires human calibration.",
    };
  }

  // Kha split discrepancy: point_2 met without point_1 (unusual inverted cognition)
  const normType = questionType.trim().toLowerCase();
  if (normType === "kha") {
    const kha = evaluation as { point_1_met?: boolean; point_2_met?: boolean };
    if (!kha.point_1_met && kha.point_2_met) {
      return {
        isAmbiguous: true,
        confidence: 0.65,
        reason: "Kha (অনুধাবন) rationale detected without basic concept identification (জ্ঞান).",
      };
    }
  }

  return {
    isAmbiguous: false,
    confidence: 0.95,
  };
}

/**
 * Creates the Express grading router with POST /api/evaluate.
 */
export function createGradingRouter(): Router {
  const router = Router();

  router.post("/api/evaluate", async (req: Request, res: Response) => {
    try {
      const body = req.body as Partial<EvaluateRequestBody>;
      const {
        question_type,
        student_answer,
        question_topic_id,
        stem_context,
        question_id,
      } = body;

      if (!question_type) {
        return res.status(400).json({
          error: "Missing required parameter: question_type (must be Ka, Kha, Ga, or Gha).",
        });
      }

      if (!student_answer || typeof student_answer !== "string") {
        return res.status(400).json({
          error: "Missing or invalid required parameter: student_answer.",
        });
      }

      if (!question_topic_id || typeof question_topic_id !== "string") {
        return res.status(400).json({
          error: "Missing or invalid required parameter: question_topic_id.",
        });
      }

      const validTypes = ["ka", "kha", "ga", "gha"];
      if (!validTypes.includes(question_type.trim().toLowerCase())) {
        return res.status(400).json({
          error: `Invalid question_type '${question_type}'. Must be one of: Ka, Kha, Ga, Gha.`,
        });
      }

      // Step 1: Agent 1 (RAG Retrieval)
      const textbook_context = await getTop3TextbookChunks(
        question_topic_id,
        student_answer
      );

      // Step 2: Agent 2 (Gemini Free-Tier Evaluation Factory)
      const { result: evaluation } = await evaluateStudentAnswer(
        question_type,
        student_answer,
        textbook_context,
        stem_context
      );

      // Step 3: Ambiguity & HITL Check
      const ambiguity = assessAmbiguity(question_type, student_answer, evaluation);

      if (ambiguity.isAmbiguous) {
        try {
          const supabase = getServiceRoleClient();
          await supabase.from("hitl_corrections").insert({
            question_id: question_id || null,
            question_type: question_type.toUpperCase(),
            question_topic_id,
            student_answer,
            stem_context: stem_context || null,
            textbook_context,
            llm_output: evaluation,
            score: evaluation.score,
            ambiguity_reason: ambiguity.reason || "Uncertainty threshold triggered",
            status: "PENDING_REVIEW",
          });
        } catch (dbErr) {
          console.error("Failed to insert into hitl_corrections table:", dbErr);
        }
      }

      return res.status(200).json({
        success: true,
        question_type,
        question_topic_id,
        evaluation,
        textbook_context_used: textbook_context,
        hitl_flagged: ambiguity.isAmbiguous,
        confidence: ambiguity.confidence,
        hitl_reason: ambiguity.reason || null,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Internal Server Error";
      console.error("Grading Pipeline Error:", err);
      return res.status(500).json({
        error: message,
      });
    }
  });

  return router;
}

/**
 * Creates a fully configured Express app instance mounting the evaluation router.
 */
export function createGradingApp(): express.Application {
  const app = express();
  app.use(express.json());
  app.use(createGradingRouter());
  return app;
}
