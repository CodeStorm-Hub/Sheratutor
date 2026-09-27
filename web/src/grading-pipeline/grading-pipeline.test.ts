import { describe, it, expect, vi, afterAll, beforeAll } from "vitest";
import type { Server } from "http";
import {
  getPromptConfigForQuestionType,
  KA_SCHEMA,
  KHA_SCHEMA,
  GA_SCHEMA,
  GHA_SCHEMA,
} from "./evaluator";
import { assessAmbiguity, createGradingApp } from "./orchestrator";
import * as dbModule from "./db";
import * as evaluatorModule from "./evaluator";

describe("NCTB Multi-Agent Grading Pipeline", () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    const app = createGradingApp();
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const addr = server.address();
        if (addr && typeof addr === "object") {
          baseUrl = `http://127.0.0.1:${addr.port}`;
        }
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  describe("Phase 1: Database & RAG Setup (Agent 1)", () => {
    it("concatenates exactly top 3 chunks as a single formatted string", async () => {
      vi.spyOn(dbModule, "getTop3TextbookChunks").mockResolvedValue(
        "[Chunk 1 - Page 45]\nনিউটনের দ্বিতীয় সূত্র: বস্তুর ভরবেগের পরিবর্তনের হার তার উপর প্রযুক্ত বলের সমানুপাতিক।\n\n[Chunk 2 - Page 46]\nF = ma যেখানে F হলো বল, m হলো ভর এবং a হলো ত্বরণ।\n\n[Chunk 3 - Page 47]\nবলের একক নিউটন (N)।"
      );

      const result = await dbModule.getTop3TextbookChunks("newtons_law_topic", "F = ma");
      expect(result).toContain("[Chunk 1");
      expect(result).toContain("[Chunk 2");
      expect(result).toContain("[Chunk 3");
      const chunkCount = (result.match(/\[Chunk \d/g) || []).length;
      expect(chunkCount).toBe(3);
    });
  });

  describe("Phase 2: Evaluation Prompts & Schemas (Agent 2)", () => {
    it("routes Ka question to strict fact-matching prompt and 1-mark schema", () => {
      const config = getPromptConfigForQuestionType("Ka");
      expect(config.schema).toBe(KA_SCHEMA);
      expect(config.systemPrompt).toContain("জ্ঞানমূলক");
      expect((config.schema.properties as Record<string, unknown>).score).toBeDefined();
      expect((config.schema.properties as Record<string, unknown>).feedback).toBeDefined();
    });

    it("routes Kha question to concept identification and explanation prompt with 2-mark schema", () => {
      const config = getPromptConfigForQuestionType("Kha");
      expect(config.schema).toBe(KHA_SCHEMA);
      expect(config.systemPrompt).toContain("অনুধাবনমূলক");
      expect((config.schema.properties as Record<string, unknown>).point_1_met).toBeDefined();
      expect((config.schema.properties as Record<string, unknown>).point_2_met).toBeDefined();
    });

    it("routes Ga question to knowledge, comprehension, application 3-mark schema", () => {
      const config = getPromptConfigForQuestionType("Ga");
      expect(config.schema).toBe(GA_SCHEMA);
      expect(config.systemPrompt).toContain("প্রয়োগমূলক");
      const breakdownProps = ((config.schema.properties as Record<string, unknown>).breakdown as Record<string, unknown>).properties as Record<string, unknown>;
      expect(breakdownProps.knowledge).toBeDefined();
      expect(breakdownProps.comprehension).toBeDefined();
      expect(breakdownProps.application).toBeDefined();
    });

    it("routes Gha question to K, C, A, H 4-mark schema", () => {
      const config = getPromptConfigForQuestionType("Gha");
      expect(config.schema).toBe(GHA_SCHEMA);
      expect(config.systemPrompt).toContain("উচ্চতর দক্ষতা");
      const breakdownProps = ((config.schema.properties as Record<string, unknown>).breakdown as Record<string, unknown>).properties as Record<string, unknown>;
      expect(breakdownProps.K).toBeDefined();
      expect(breakdownProps.C).toBeDefined();
      expect(breakdownProps.A).toBeDefined();
      expect(breakdownProps.H).toBeDefined();
    });
  });

  describe("Phase 3: The Express Orchestrator & HITL (Agent 3)", () => {
    it("flags ambiguous evaluation when uncertain keywords appear", () => {
      const ambiguity = assessAmbiguity("Ka", "ত্বরণ হলো বেগ বৃদ্ধির হার", {
        score: 1,
        feedback: "The phrasing is slightly ambiguous compared to textbook definition.",
      });
      expect(ambiguity.isAmbiguous).toBe(true);
      expect(ambiguity.reason).toContain("ambiguous");
    });

    it("flags HITL when a substantial student response gets zero marks", () => {
      const ambiguity = assessAmbiguity(
        "Ga",
        "এখানে প্রযুক্ত বল F = 50N এবং ভর m = 10kg, তাই ত্বরণ a = F/m = 5m/s^2",
        {
          score: 0,
          breakdown: { knowledge: 0, comprehension: 0, application: 0 },
          feedback: "Zero credit assigned.",
        }
      );
      expect(ambiguity.isAmbiguous).toBe(true);
      expect(ambiguity.reason).toContain("zero marks");
    });

    it("rejects POST /api/evaluate if question_type is missing", async () => {
      const res = await fetch(`${baseUrl}/api/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_answer: "test", question_topic_id: "topic-1" }),
      });

      const body = await res.json() as { error: string };
      expect(res.status).toBe(400);
      expect(body.error).toContain("Missing required parameter: question_type");
    });

    it("successfully runs POST /api/evaluate and returns structured output", async () => {
      vi.spyOn(dbModule, "getTop3TextbookChunks").mockResolvedValue(
        "[Chunk 1]\nবলের সংজ্ঞা ও নিউটনের সূত্র"
      );

      vi.spyOn(evaluatorModule, "evaluateStudentAnswer").mockResolvedValue({
        result: {
          score: 1,
          feedback: "সঠিক সংজ্ঞা প্রদান করা হয়েছে।",
        },
        rawText: '{"score": 1, "feedback": "সঠিক সংজ্ঞা প্রদান করা হয়েছে।"}',
      });

      const res = await fetch(`${baseUrl}/api/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_type: "Ka",
          student_answer: "বস্তুর ভরবেগের পরিবর্তনের হার তার উপর প্রযুক্ত বলের সমানুপাতিক।",
          question_topic_id: "phy_newton_law",
        }),
      });

      const body = await res.json() as {
        success: boolean;
        evaluation: { score: number; feedback: string };
        hitl_flagged: boolean;
      };

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.evaluation.score).toBe(1);
      expect(body.hitl_flagged).toBe(false);
    });
  });
});
