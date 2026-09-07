import { config } from "dotenv";
config({ path: ".env.local" });
import { tutorAgent } from "../src/ai/agents/tutor-agent";

async function main() {
  console.log("=== Testing tutorAgent Turn 1 ===");
  const sessionId = globalThis.crypto.randomUUID();
  const res1 = await tutorAgent.run(
    {
      message: {
        role: "user",
        content: [{ text: "আদিবেগ u = 0, ত্বরণ a = 2, সময় t = 10 হলে শেষ বেগ v কীভাবে বের করব?" }],
      },
    },
    {
      init: {
        sessionId,
        state: {
          sessionId,
          custom: {
            sessionId,
            mode: "general",
            studentMessage: "শেষ বেগ v কীভাবে বের করব?",
          },
        },
      },
    }
  );

  console.log("Turn 1 Finish Reason:", res1.result.finishReason);
  const text1 = res1.result.message?.content?.map((c: any) => c.text || "").join("");
  console.log("Turn 1 Reply:\n", text1);

  console.log("\n=== Testing tutorAgent Turn 2 (Session continuity) ===");
  const res2 = await tutorAgent.run(
    {
      message: {
        role: "user",
        content: [{ text: "সূত্র v = u + at ব্যবহার করলে মান কত আসে?" }],
      },
    },
    {
      init: {
        sessionId,
      },
    }
  );

  console.log("Turn 2 Finish Reason:", res2.result.finishReason);
  const text2 = res2.result.message?.content?.map((c: any) => c.text || "").join("");
  console.log("Turn 2 Reply:\n", text2);
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
