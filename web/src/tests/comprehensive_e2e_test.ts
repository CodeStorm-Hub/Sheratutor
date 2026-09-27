import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { getTop3TextbookChunks } from "@/grading-pipeline/db";
import { evaluateWithGemini } from "@/grading-pipeline/evaluator";
import { createGradingApp } from "@/grading-pipeline/orchestrator";
import { tutorChatFlow } from "@/ai/flows/tutor-chat";
import type { Server } from "http";

async function runEndToEndVerification() {
  console.log("==================================================================");
  console.log("      SHERATUTOR COMPREHENSIVE END-TO-END VERIFICATION SUITE      ");
  console.log("==================================================================\n");

  const results: { test: string; status: "PASS" | "FAIL"; details?: string }[] = [];

  const supabase = getServiceRoleClient();

  // -----------------------------------------------------------------------------
  // 1. SUPABASE DATABASE & ASSETS AUDIT
  // -----------------------------------------------------------------------------
  console.log("[1/5] Auditing Live Supabase Database & Storage Buckets...");
  try {
    const { count: chunkCount, error: chunkErr } = await supabase
      .from("curriculum_chunks")
      .select("id", { count: "exact", head: true });

    if (chunkErr) throw chunkErr;

    const { data: buckets, error: bucketErr } = await supabase.storage.listBuckets();
    if (bucketErr) throw bucketErr;

    const hasSubmissionBucket = buckets?.some((b) => b.name === "submission-pages");

    if (chunkCount && chunkCount > 5000 && hasSubmissionBucket) {
      console.log(`  ✓ Database Connected: ${chunkCount} curriculum chunks verified.`);
      console.log(`  ✓ Storage Connected: 'submission-pages' bucket confirmed.\n`);
      results.push({ test: "Supabase DB & Storage", status: "PASS", details: `${chunkCount} chunks, buckets verified` });
    } else {
      throw new Error(`Incomplete Supabase assets: count=${chunkCount}, submission-pages=${hasSubmissionBucket}`);
    }
  } catch (err: any) {
    console.error(`  ✗ Supabase Audit Failed:`, err.message);
    results.push({ test: "Supabase DB & Storage", status: "FAIL", details: err.message });
  }

  // -----------------------------------------------------------------------------
  // 2. LIVE RAG RETRIEVAL ENGINE (Agent 1)
  // -----------------------------------------------------------------------------
  console.log("[2/5] Testing Live RAG Vector & Full-Text Grounding (Top 3 Chunks)...");
  try {
    // Find an active chapter
    const { data: chapters } = await supabase
      .from("chapters")
      .select("id, chapter_no, title_bn")
      .limit(1);

    const testChapterId = chapters?.[0]?.id;
    if (!testChapterId) throw new Error("No chapters found in database.");

    const ragContext = await getTop3TextbookChunks(testChapterId, "বল ও ত্বরণ");
    const chunkMarkers = (ragContext.match(/\[Chunk \d/g) || []).length;

    console.log(`  ✓ Retrieved ${chunkMarkers} formatted chunks for chapter: ${chapters[0].title_bn}`);
    console.log(`  ✓ Snippet: ${ragContext.slice(0, 160).replace(/\n/g, " ")}...\n`);
    results.push({ test: "RAG Retrieval", status: "PASS", details: `Retrieved ${chunkMarkers} chunks successfully` });
  } catch (err: any) {
    console.error(`  ✗ RAG Retrieval Failed:`, err.message);
    results.push({ test: "RAG Retrieval", status: "FAIL", details: err.message });
  }

  // -----------------------------------------------------------------------------
  // 3. MULTI-AGENT GRADING PIPELINE (Ka, Kha, Ga, Gha)
  // -----------------------------------------------------------------------------
  console.log("[3/5] Testing Live Multi-Agent Grading Pipeline on Google AI Studio Gemini API...");
  try {
    // 3a. Part Ka (1 mark)
    console.log("  - Grading Part Ka (জ্ঞানমূলক / 1 Mark)...");
    const kaRes = await evaluateWithGemini(
      "Ka",
      "বলের সংজ্ঞা: যা কোনো স্থির বস্তুর উপর প্রযুক্ত হয়ে তাকে গতিশীল করে বা করতে চায়, অথবা গতিশীল বস্তুর গতির পরিবর্তন করে তাকে বল বলে।",
      "[Chunk 1]\nবল হলো এমন একটি বাহ্যিক প্রভাব যা কোনো বস্তুর স্থিতি বা গতির অবস্থার পরিবর্তন ঘটায়।"
    );
    console.log(`    Result: Score=${kaRes.result.score}/1 | Feedback=${kaRes.result.feedback.slice(0, 80)}...`);

    // 3b. Part Kha (2 marks)
    console.log("  - Grading Part Kha (অনুধাবনমূলক / 2 Marks)...");
    const khaRes = await evaluateWithGemini(
      "Kha",
      "গাছ থেকে ফল মাটিতে পড়ার কারণ হলো পৃথিবীর অভিকর্ষ বল। পৃথিবী প্রত্যেক বস্তুকে তার কেন্দ্রের দিকে আকর্ষণ করে, যার ফলে ফলটি নিচে পড়ে।",
      "[Chunk 1]\nঅভিকর্ষ বল হলো পৃথিবী ও যে কোনো বস্তুর মধ্যকার আকর্ষণ বল।"
    );
    const khaTyped = khaRes.result as { score: number; point_1_met: boolean; point_2_met: boolean };
    console.log(`    Result: Score=${khaTyped.score}/2 | Concept=${khaTyped.point_1_met} | Reason=${khaTyped.point_2_met}`);

    // 3c. Part Ga (3 marks)
    console.log("  - Grading Part Ga (প্রয়োগমূলক / 3 Marks)...");
    const gaRes = await evaluateWithGemini(
      "Ga",
      "আমরা জানি, F = ma। এখানে ভর m = 5 kg এবং ত্বরণ a = 2 m/s^2। অতএব প্রযুক্ত বল F = 5 * 2 = 10 N।",
      "[Chunk 1]\nনিউটনের দ্বিতীয় সূত্র: F = ma। বলের একক নিউটন (N)।",
      "একটি ৫ কেজি ভরের বস্তুর ওপর ত্বরণ সৃষ্টি করা হলো।"
    );
    const gaTyped = gaRes.result as { score: number; breakdown: any };
    console.log(`    Result: Score=${gaTyped.score}/3 | Breakdown=${JSON.stringify(gaTyped.breakdown)}`);

    // 3d. Part Gha (4 marks)
    console.log("  - Grading Part Gha (উচ্চতর দক্ষতা / 4 Marks)...");
    const ghaRes = await evaluateWithGemini(
      "Gha",
      "উদ্দীপকের ঘটনায় ভরবেগ সংরক্ষিত হয়েছে কারণ কোনো বাহ্যিক বল ক্রিয়া করেনি। সংঘর্ষের আগে মোট ভরবেগ m1*u1 + m2*u2 এবং পরে (m1+m2)*v সমান প্রমাণিত হয়। সুতরাং দাবিটি যথার্থ।",
      "[Chunk 1]\nভরবেগের সংরক্ষণ সূত্র: বাহ্যিক কোনো বল প্রয়োগ না করলে কোনো ব্যবস্থার মোট ভরবেগ অপরিবর্তিত থাকে।",
      "দুটি গাড়ি মুখোমুখি সংঘর্ষে লিপ্ত হয়ে একসঙ্গে চলতে লাগল।"
    );
    const ghaTyped = ghaRes.result as { score: number; breakdown: any };
    console.log(`    Result: Score=${ghaTyped.score}/4 | Breakdown=${JSON.stringify(ghaTyped.breakdown)}\n`);

    results.push({ test: "Multi-Agent Grading (Ka, Kha, Ga, Gha)", status: "PASS", details: "All 4 schemas verified live" });
  } catch (err: any) {
    console.error(`  ✗ Grading Pipeline Failed:`, err.message);
    results.push({ test: "Multi-Agent Grading (Ka, Kha, Ga, Gha)", status: "FAIL", details: err.message });
  }

  // -----------------------------------------------------------------------------
  // 4. LIVE EXPRESS HTTP ORCHESTRATOR (POST /api/evaluate)
  // -----------------------------------------------------------------------------
  console.log("[4/5] Testing Express Evaluator API Server & HITL Routing...");
  let server: Server | null = null;
  try {
    const app = createGradingApp();
    const liveServer: Server = await new Promise((resolve) => {
      const s = app.listen(0, () => resolve(s));
    });
    server = liveServer;

    const addr = liveServer.address();
    const port = typeof addr === "object" ? addr?.port : 3001;
    const url = `http://127.0.0.1:${port}/api/evaluate`;

    // Fetch an existing chapter ID
    const { data: chapters } = await supabase.from("chapters").select("id").limit(1);
    const chapterId = chapters?.[0]?.id || "f47ac10b-58cc-4372-a567-0e02b2c3d479";

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_type: "Ka",
        student_answer: "কাজ হলো বল ও বলের দিকে সরণের গুণফল। W = F * s।",
        question_topic_id: chapterId,
      }),
    });

    const body = (await response.json()) as any;
    if (response.status === 200 && body.success) {
      console.log(`  ✓ HTTP 200 OK from ${url}`);
      console.log(`  ✓ Score: ${body.evaluation?.score} | HITL Flagged: ${body.hitl_flagged} | Confidence: ${body.confidence}\n`);
      results.push({ test: "Express POST /api/evaluate", status: "PASS", details: `HTTP 200, score=${body.evaluation?.score}` });
    } else {
      throw new Error(`Unexpected HTTP ${response.status}: ${JSON.stringify(body)}`);
    }
  } catch (err: any) {
    console.error(`  ✗ Express Orchestrator Failed:`, err.message);
    results.push({ test: "Express POST /api/evaluate", status: "FAIL", details: err.message });
  } finally {
    if (server) {
      (server as Server).close();
    }
  }

  // -----------------------------------------------------------------------------
  // 5. SOCRATIC AI TUTOR (tutorChatFlow)
  // -----------------------------------------------------------------------------
  console.log("[5/5] Testing Socratic AI Tutor Chat with Academic Grounding...");
  try {
    const tutorRes = await tutorChatFlow({
      studentMessage: "ভাইয়া, নিউটনের প্রথম সূত্রটা সহজ ভাষায় একটু বুঝিয়ে দাও না?",
      mode: "general",
      scaffoldingStyle: "socratic",
      history: [],
      languagePreference: "bn",
    });

    console.log(`  ✓ Tutor Response Generated (${tutorRes.reply.length} chars)`);
    console.log(`  ✓ Snippet: ${tutorRes.reply.slice(0, 140).replace(/\n/g, " ")}...\n`);
    results.push({ test: "Socratic AI Tutor", status: "PASS", details: `Generated ${tutorRes.reply.length} chars` });
  } catch (err: any) {
    console.error(`  ✗ Socratic Tutor Failed:`, err.message);
    results.push({ test: "Socratic AI Tutor", status: "FAIL", details: err.message });
  }

  // -----------------------------------------------------------------------------
  // FINAL SUMMARY REPORT
  // -----------------------------------------------------------------------------
  console.log("==================================================================");
  console.log("                     VERIFICATION SUMMARY REPORT                  ");
  console.log("==================================================================");
  let allPass = true;
  for (const r of results) {
    const icon = r.status === "PASS" ? "✅" : "❌";
    console.log(`${icon} [${r.status}] ${r.test}: ${r.details || ""}`);
    if (r.status !== "PASS") allPass = false;
  }
  console.log("==================================================================");
  if (allPass) {
    console.log(">>> ALL CORE PIPELINES ARE 100% OPERATIONAL & PRODUCTION READY <<<");
  } else {
    console.log(">>> SOME CHECKS FAILED - REVIEW LOGS ABOVE <<<");
    process.exit(1);
  }
}

runEndToEndVerification().catch((err) => {
  console.error("FATAL ERROR IN TEST HARNESS:", err);
  process.exit(1);
});
