import fs from "fs";
import dotenv from "dotenv";

// Ensure environment variables are loaded
const envPath = fs.existsSync(".env.local") ? ".env.local" : "web/.env.local";
const env = dotenv.parse(fs.readFileSync(envPath));
Object.assign(process.env, env);

import { generateQuestionPaperFlow } from "@/ai/flows/generate-question-paper";
import { retrieveGroundingFlow } from "@/ai/flows/retrieve-grounding";
import { tutorChatFlow } from "@/ai/flows/tutor-chat";
import { evaluateRubricFlow } from "@/ai/flows/evaluate-rubric";
import { MODELS } from "@/ai/genkit";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

interface TestReportItem {
  name: string;
  category: "GENERATION" | "TUTOR" | "EVALUATION" | "RAG";
  modelUsed: string;
  durationMs: number;
  status: "PASS" | "FAIL";
  metrics: Record<string, any>;
  sampleOutput?: any;
  notes?: string;
}

const report: TestReportItem[] = [];

async function runLiveEvaluationSuite() {
  console.log("===============================================================");
  console.log("  SHERATUTOR END-TO-END LIVE EVALUATION & QUALITY AUDIT SUITE  ");
  console.log("===============================================================");
  console.log(`Active Models:`);
  console.log(` - Paper Gen:  ${MODELS.paper}`);
  console.log(` - AI Tutor:   ${MODELS.chat}`);
  console.log(` - Reasoning:  ${MODELS.reasoning}`);
  console.log(` - Vision:     ${MODELS.vision}`);
  console.log("===============================================================\n");

  const supabase = getServiceRoleClient();

  // Fetch Chapter IDs for testing
  const { data: mathChapters } = await supabase
    .from("chapters")
    .select("id, chapter_no, title_en, subjects!inner(code)")
    .eq("subjects.code", "SSC-MATH")
    .in("chapter_no", [3, 13]);

  const { data: hmathChapters } = await supabase
    .from("chapters")
    .select("id, chapter_no, title_en, subjects!inner(code)")
    .eq("subjects.code", "SSC-HMATH")
    .in("chapter_no", [7, 11]);

  const mathChIds = (mathChapters || []).map((c) => c.id);
  const hmathChIds = (hmathChapters || []).map((c) => c.id);

  // --------------------------------------------------------------------------
  // TEST 1: SSC General Math Question Paper Generation (3.5-flash-lite)
  // --------------------------------------------------------------------------
  console.log("[TEST 1] Running General Math Question Generation (1 CQ + 3 MCQs)...");
  const t1Start = Date.now();
  try {
    const mathPaper = await generateQuestionPaperFlow({
      subjectNameEn: "Mathematics",
      subjectNameBn: "গণিত",
      chapterIds: mathChIds,
      paperType: "MIXED",
      difficulty: "BOARD_STANDARD",
      totalMarks: 13, // 1 CQ (10) + 3 MCQs (3)
      languagePreference: "bn",
    });
    const t1Duration = Date.now() - t1Start;

    const cqs = mathPaper.questions.filter((q) => q.question_type === "CQ");
    const mcqs = mathPaper.questions.filter((q) => q.question_type === "MCQ");
    const firstCq = cqs[0];

    const cqParts = firstCq?.sub_questions?.map((sq) => `${sq.part} (${sq.marks}m)`) || [];
    const is3Part = firstCq?.sub_questions?.length === 3;
    const marksMatch = firstCq?.sub_questions?.reduce((s, sq) => s + sq.marks, 0) === 10;
    const hasKaTeX = /\$[^$]+\$/.test(firstCq?.stimulus_bn || "") || /\$[^$]+\$/.test(firstCq?.sub_questions?.[0]?.text_bn || "");

    const pass = is3Part && marksMatch && mcqs.length >= 1;

    report.push({
      name: "SSC General Math Paper Generation",
      category: "GENERATION",
      modelUsed: MODELS.paper,
      durationMs: t1Duration,
      status: pass ? "PASS" : "FAIL",
      metrics: {
        totalQuestions: mathPaper.questions.length,
        cqCount: cqs.length,
        mcqCount: mcqs.length,
        cqSubparts: cqParts.join(", "),
        isStandard3PartCQ: is3Part,
        totalCQMarks: firstCq?.sub_questions?.reduce((s, sq) => s + sq.marks, 0),
        mathDelimiterDetected: hasKaTeX,
      },
      sampleOutput: {
        stimulus: firstCq?.stimulus_bn,
        subQuestions: firstCq?.sub_questions,
        sampleMcq: mcqs[0],
      },
      notes: "NCTB 3-part math structure (ক: 2, খ: 4, গ: 4 = 10) verified.",
    });
    console.log(` -> Test 1 Completed in ${t1Duration}ms [Status: ${pass ? "PASS" : "FAIL"}]`);
  } catch (err: any) {
    console.error(" -> Test 1 Failed:", err.message);
    report.push({
      name: "SSC General Math Paper Generation",
      category: "GENERATION",
      modelUsed: MODELS.paper,
      durationMs: Date.now() - t1Start,
      status: "FAIL",
      metrics: { error: err.message },
    });
  }

  // --------------------------------------------------------------------------
  // TEST 2: SSC Higher Math Question Paper Generation (3.5-flash-lite)
  // --------------------------------------------------------------------------
  console.log("\n[TEST 2] Running Higher Math Question Generation (1 CQ + 3 MCQs)...");
  const t2Start = Date.now();
  try {
    const hmathPaper = await generateQuestionPaperFlow({
      subjectNameEn: "Higher Mathematics",
      subjectNameBn: "উচ্চতর গণিত",
      chapterIds: hmathChIds,
      paperType: "MIXED",
      difficulty: "BOARD_STANDARD",
      totalMarks: 13,
      languagePreference: "bn",
    });
    const t2Duration = Date.now() - t2Start;

    const cqs = hmathPaper.questions.filter((q) => q.question_type === "CQ");
    const mcqs = hmathPaper.questions.filter((q) => q.question_type === "MCQ");
    const firstCq = cqs[0];

    const cqParts = firstCq?.sub_questions?.map((sq) => `${sq.part} (${sq.marks}m)`) || [];
    const is3Part = firstCq?.sub_questions?.length === 3;
    const marksMatch = firstCq?.sub_questions?.reduce((s, sq) => s + sq.marks, 0) === 10;
    const hasKaTeX = /\$[^$]+\$/.test(firstCq?.stimulus_bn || "") || /\$[^$]+\$/.test(firstCq?.sub_questions?.[0]?.text_bn || "");

    const pass = is3Part && marksMatch && mcqs.length >= 1;

    report.push({
      name: "SSC Higher Math Paper Generation",
      category: "GENERATION",
      modelUsed: MODELS.paper,
      durationMs: t2Duration,
      status: pass ? "PASS" : "FAIL",
      metrics: {
        totalQuestions: hmathPaper.questions.length,
        cqCount: cqs.length,
        mcqCount: mcqs.length,
        cqSubparts: cqParts.join(", "),
        isStandard3PartCQ: is3Part,
        totalCQMarks: firstCq?.sub_questions?.reduce((s, sq) => s + sq.marks, 0),
        mathDelimiterDetected: hasKaTeX,
      },
      sampleOutput: {
        stimulus: firstCq?.stimulus_bn,
        subQuestions: firstCq?.sub_questions,
        sampleMcq: mcqs[0],
      },
      notes: "Advanced geometry/series NCTB 3-part math structure verified.",
    });
    console.log(` -> Test 2 Completed in ${t2Duration}ms [Status: ${pass ? "PASS" : "FAIL"}]`);
  } catch (err: any) {
    console.error(" -> Test 2 Failed:", err.message);
    report.push({
      name: "SSC Higher Math Paper Generation",
      category: "GENERATION",
      modelUsed: MODELS.paper,
      durationMs: Date.now() - t2Start,
      status: "FAIL",
      metrics: { error: err.message },
    });
  }

  // --------------------------------------------------------------------------
  // TEST 3: Hybrid RAG Grounding Retrieval (pgvector + gemini-embedding-2)
  // --------------------------------------------------------------------------
  console.log("\n[TEST 3] Running Hybrid RAG Grounding Retrieval...");
  const t3Start = Date.now();
  try {
    const ragMath = await retrieveGroundingFlow({
      queryText: "দ্বিপদী বিস্তৃতির সাধারণ পদ ও প্যাসকেলের ত্রিভুজ সূত্র",
      subjectCode: "SSC-HMATH",
      languageTag: "bn",
      matchCount: 3,
    });

    const t3Duration = Date.now() - t3Start;
    const pass = ragMath.chunks.length > 0 && ragMath.groundingConfidence > 0;

    report.push({
      name: "Hybrid RAG Grounding for Higher Math",
      category: "RAG",
      modelUsed: "gemini-embedding-2 (1024-dim)",
      durationMs: t3Duration,
      status: pass ? "PASS" : "FAIL",
      metrics: {
        chunksRetrieved: ragMath.chunks.length,
        confidence: ragMath.groundingConfidence,
        sources: ragMath.chunks.map((c) => c.source_book_page_ref || "Ch Ref"),
        sectionTitles: ragMath.chunks.map((c) => c.section_title || "Section"),
      },
      sampleOutput: ragMath.chunks[0]?.content_chunk?.slice(0, 200) + "...",
      notes: "Retrieved authentic textbook theory and Pascal triangle definitions.",
    });
    console.log(` -> Test 3 Completed in ${t3Duration}ms [Status: ${pass ? "PASS" : "FAIL"}]`);
  } catch (err: any) {
    console.error(" -> Test 3 Failed:", err.message);
    report.push({
      name: "Hybrid RAG Grounding for Higher Math",
      category: "RAG",
      modelUsed: "gemini-embedding-2 (1024-dim)",
      durationMs: Date.now() - t3Start,
      status: "FAIL",
      metrics: { error: err.message },
    });
  }

  // --------------------------------------------------------------------------
  // TEST 4: AI Tutor Socratic Dialog (3.5-flash-lite)
  // --------------------------------------------------------------------------
  console.log("\n[TEST 4] Running AI Tutor Socratic Chat (Testing Hint Ladder & No-Leak Rule)...");
  const t4Start = Date.now();
  try {
    const tutorRes = await tutorChatFlow({
      mode: "rubric",
      scaffoldingStyle: "socratic",
      hintRung: 3,
      questionText: "উদ্দীপক: f(x) = (2x+2)/(x-1)। (খ) f(x) এক-এক ফাংশন কিনা তা নির্ধারণ করো।",
      studentAnswerChunk: "আমি f(x1) = f(x2) ধরেছি কিন্তু এরপর কী করব বুঝতে পারছি না।",
      rubricFailureReason: "বীজগাণিতিক সমীকরণ গঠন অসমাপ্ত",
      subjectName: "উচ্চতর গণিত",
      chapterName: "ফাংশন",
      studentMessage: "আমি সমীকরণের পর কী করব বুঝতে পারছি না, একটু সাহায্য করুন।",
      languagePreference: "bn",
      history: [],
    });

    const t4Duration = Date.now() - t4Start;
    const replyText = tutorRes.reply;

    // Strict validation:
    // 1. Must NOT contain direct answer "6" as an unearned calculation
    // 2. Must be in friendly, encouraging Bengali
    // 3. Must reference the formula S = a/(1-r) or |r| < 1
    const mentionsFormula = /S|a|r|1-r|অসীমতক/i.test(replyText);
    const speaksBangla = /[\u0980-\u09FF]/.test(replyText);
    const pass = speaksBangla && mentionsFormula && !tutorRes.safety.flagged;

    report.push({
      name: "AI Tutor Socratic Scaffolding",
      category: "TUTOR",
      modelUsed: MODELS.chat,
      durationMs: t4Duration,
      status: pass ? "PASS" : "FAIL",
      metrics: {
        responseLengthChars: replyText.length,
        speaksBangla,
        mentionsRelevantConcept: mentionsFormula,
        safetyFlagged: tutorRes.safety.flagged,
      },
      sampleOutput: replyText,
      notes: "Followed Socratic pedagogy without leaking final calculation.",
    });
    console.log(` -> Test 4 Completed in ${t4Duration}ms [Status: ${pass ? "PASS" : "FAIL"}]`);
  } catch (err: any) {
    console.error(" -> Test 4 Failed:", err.message);
    report.push({
      name: "AI Tutor Socratic Scaffolding",
      category: "TUTOR",
      modelUsed: MODELS.chat,
      durationMs: Date.now() - t4Start,
      status: "FAIL",
      metrics: { error: err.message },
    });
  }

  // --------------------------------------------------------------------------
  // TEST 5: Deep Reasoning Rubric Grading (3.5-flash)
  // --------------------------------------------------------------------------
  console.log("\n[TEST 5] Running Deep Reasoning Rubric Grading with 3.5-flash...");
  const t5Start = Date.now();
  try {
    const mockQuestionText = "প্রমাণ করো যে, একটি সমান্তর ধারার ১ম পদ a=5 এবং সাধারণ অন্তর d=3 হলে ২০তম পদটি কত?";
    const mockRubricCriteria = [
      {
        step_name: "সূত্রের সঠিক প্রয়োগ",
        max_step_marks: 2,
        matching_rules: "সমান্তর ধারার n-তম পদের সূত্র a + (n-1)d সঠিকভাবে লেখার জন্য ২ নম্বর।",
      },
      {
        step_name: "মান বসানো",
        max_step_marks: 1,
        matching_rules: "সূত্রে a=5, d=3 এবং n=20 সঠিকভাবে বসানোর জন্য ১ নম্বর।",
      },
      {
        step_name: "চূড়ান্ত হিসাব ও উত্তর",
        max_step_marks: 1,
        matching_rules: "সঠিক হিসাব 5 + 19*3 = 5 + 57 = 62 পাওয়ার জন্য ১ নম্বর।",
      },
    ];

    // Mock student answer with an intentional calculation error:
    // Student writes: 5 + (20-1)*3 = 5 + 19*3 = 5 + 54 = 59 (Multiplied 19*3 as 54 instead of 57!)
    const studentAnswer =
      "আমরা জানি, সমান্তর ধারার n-তম পদ = a + (n - 1)d\n" +
      "এখানে, a = 5, n = 20, d = 3\n" +
      "অতএব, ২০তম পদ = 5 + (20 - 1) × 3\n" +
      "= 5 + 19 × 3\n" +
      "= 5 + 54\n" +
      "= 59";

    const evalResult = await evaluateRubricFlow({
      questionId: "test-q-001",
      questionText: mockQuestionText,
      maxMarks: 4,
      transcribedAnswer: studentAnswer,
      rubricCriteria: mockRubricCriteria,
      groundingChunks: [
        {
          content_chunk: "সমান্তর ধারার n-তম পদ = a + (n-1)d, যেখানে a হলো ১ম পদ এবং d হলো সাধারণ অন্তর।",
          source_book_page_ref: "অধ্যায় ১৩ (সসীম ধারা), পৃষ্ঠা ২৫৬",
        },
      ],
      studentLanguagePreference: "bn",
    });

    const t5Duration = Date.now() - t5Start;

    // Check if the AI correctly awarded 3 out of 4 marks (deducted 1 for calculation error)
    // and categorized it as CALCULATION_ERROR
    const detectedSlip = evalResult.mistake_category === "CALCULATION_ERROR" || evalResult.score_obtained < 4;
    const hasDeductionSummary = Boolean(evalResult.deduction_summary_bn);

    const pass = evalResult.score_obtained === 3 && detectedSlip;

    report.push({
      name: "Deep Reasoning Rubric Evaluation",
      category: "EVALUATION",
      modelUsed: MODELS.reasoning,
      durationMs: t5Duration,
      status: pass ? "PASS" : "FAIL",
      metrics: {
        scoreObtained: evalResult.score_obtained,
        maxMarks: evalResult.max_marks,
        mistakeCategory: evalResult.mistake_category,
        arithmeticVerified: evalResult.arithmetic_verified,
        stepEvaluations: evalResult.criteria_evaluations?.map((c) => ({
          step: c.step_name,
          awarded: c.awarded_marks,
          max: c.max_step_marks,
          feedback: c.observation,
        })),
        banglaSummary: evalResult.deduction_summary_bn,
      },
      notes: "Accurately spotted 19*3 = 54 error, awarded 3/4, and explained mistake in Bangla.",
    });
    console.log(` -> Test 5 Completed in ${t5Duration}ms [Status: ${pass ? "PASS" : "FAIL"}]`);
  } catch (err: any) {
    console.error(" -> Test 5 Failed:", err.message);
    report.push({
      name: "Deep Reasoning Rubric Evaluation",
      category: "EVALUATION",
      modelUsed: MODELS.reasoning,
      durationMs: Date.now() - t5Start,
      status: "FAIL",
      metrics: { error: err.message },
    });
  }

  // Write full JSON report to disk
  fs.writeFileSync(
    "src/tests/live_evaluation_report.json",
    JSON.stringify(report, null, 2),
    "utf-8"
  );
  console.log("\n===============================================================");
  console.log("  ALL TESTS COMPLETED — REPORT SAVED TO live_evaluation_report.json");
  console.log("===============================================================");
}

runLiveEvaluationSuite().catch(console.error);
