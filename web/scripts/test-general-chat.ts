process.env.VERCEL = "1"; // force the production (NIM) embedder path, same as on Vercel

import { retrieveGroundingFlow } from "../src/ai/flows/retrieve-grounding";
import { tutorChatFlow } from "../src/ai/flows/tutor-chat";

async function main() {
  console.log("=== retrieveGroundingFlow (production/NIM embedder path) ===");
  const grounding = await retrieveGroundingFlow({
    queryText: "What is the difference between speed and velocity?",
    chapterId: "03b4eda6-f98c-40e3-b77a-c2835515d9fa", // Physics / Motion (en)
    languageTag: "en",
    matchCount: 3,
  });
  console.log("chunks found:", grounding.chunks.length);
  console.log("groundingConfidence:", grounding.groundingConfidence);
  console.log("top chunk preview:", grounding.chunks[0]?.content_chunk?.slice(0, 200));

  console.log("\n=== tutorChatFlow general mode, grounded ===");
  const groundedContext = grounding.chunks.map((c) => c.content_chunk).join("\n\n---\n\n");
  const res = await tutorChatFlow({
    mode: "general",
    scaffoldingStyle: "socratic",
    subjectName: "Physics",
    chapterName: "Motion",
    groundedContext,
    history: [],
    studentMessage: "What is the difference between speed and velocity?",
    languagePreference: "en",
  });
  console.log("\n--- AI Tutor Response ---");
  console.log(res.reply);
  console.log("\nSafety:", res.safety);
}

main().catch((err) => {
  console.error("test failed:", err);
  process.exit(1);
});
