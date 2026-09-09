import { retrieveGroundingFlow } from "../src/ai/flows/retrieve-grounding";
import { tutorChatFlow } from "../src/ai/flows/tutor-chat";

async function main() {
  const query = "ড্রাই সেল বা শুষ্ক কোষ কীভাবে তৈরি হয় এবং এর অ্যানোড ও ক্যাথোডে কী রাসায়নিক বিক্রিয়া ঘটে?";
  console.log("============================================================");
  console.log("[*] Testing Live SheraTutor RAG & Chat with Gemini 3.5 Flash Lite");
  console.log(`[*] Query: ${query}`);
  console.log("============================================================");

  console.log("\n[1] Invoking retrieveGroundingFlow (Global Multimodal Search)...");
  const t0 = Date.now();
  const grounding = await retrieveGroundingFlow({
    queryText: query,
    subjectCode: "SSC-CHEM",
    languageTag: "bn",
    matchCount: 3,
  });
  const t1 = Date.now();
  console.log(`--> Grounding retrieved ${grounding.chunks.length} chunks in ${(t1 - t0) / 1000}s`);
  console.log(`--> Grounding Confidence: ${grounding.groundingConfidence.toFixed(4)}`);

  const diagrams: string[] = [];
  grounding.chunks.forEach((c, idx) => {
    console.log(`\n  Chunk #${idx + 1}: Chapter ${c.chapter_no} (${c.chapter_title}), Page ${c.source_book_page_ref}`);
    console.log(`  Similarity: ${c.similarity.toFixed(4)}`);
    if (c.diagram_image_urls && c.diagram_image_urls.length > 0) {
      console.log(`  Diagrams (${c.diagram_image_urls.length}):`, c.diagram_image_urls);
      c.diagram_image_urls.forEach((u) => {
        if (!diagrams.includes(u)) diagrams.push(u);
      });
    }
    console.log(`  Snippet: ${c.content_chunk.slice(0, 140).replace(/\n/g, " ")}...`);
  });

  console.log("\n[2] Invoking tutorChatFlow with Gemini 3.5 Flash Lite...");
  const groundedContext = grounding.chunks.map((c) => c.content_chunk).join("\n\n---\n\n");
  const t2 = Date.now();
  const tutorRes = await tutorChatFlow({
    mode: "general",
    scaffoldingStyle: "direct",
    subjectName: "Chemistry",
    chapterName: "Chemistry & Energy (Chapter 8)",
    groundedContext,
    diagramUrls: diagrams,
    history: [],
    studentMessage: query,
    languagePreference: "bn",
  });
  const t3 = Date.now();

  console.log(`--> Response generated in ${(t3 - t2) / 1000}s`);
  console.log("\n============================================================");
  console.log("AI TUTOR LIVE VERBATIM RESPONSE:");
  console.log("============================================================");
  console.log(tutorRes.reply);
  console.log("\n============================================================");
  console.log("SAFETY STATUS:", tutorRes.safety);
  console.log("============================================================");

  // Assertions
  if (!tutorRes.reply || tutorRes.reply.length < 50) {
    throw new Error("Response was unexpectedly empty or too short");
  }
  if (!tutorRes.reply.includes("Zn")) {
    console.warn("[WARNING] Chemical symbol Zn was not detected in reply");
  }
  console.log("\n[SUCCESS] End-to-end Next.js Genkit Gemini Chat test completed cleanly!");
}

main().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
