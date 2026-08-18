import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import { tutorChatFlow } from "../src/ai/flows/tutor-chat";

async function run() {
  console.log("=== Testing Tutor Chat Flow ===");
  const res = await tutorChatFlow({
    mode: "rubric",
    questionText: "একটি গাড়ি স্থির অবস্থান থেকে 2 ms⁻² সমত্বরণে চলা শুরু করলো। 10 সেকেন্ড পর গাড়িটি কত দূরত্ব অতিক্রম করবে?",
    studentAnswerChunk: "s = 20 m",
    rubricFailureReason: "হিসাবের শেষ লাইনে বর্গ করতে গিয়ে t² = 10² = 100 এর জায়গায় 20 লিখে ফেলায় দূরত্ব s = 20 m বের হয়েছে।",
    history: [
      { role: "student", text: "আমাকে এই ম্যাথটা সহজ করে বুঝিয়ে বলো।" },
      {
        role: "tutor",
        text: "এখানে গাড়িটি স্থির অবস্থান থেকে শুরু করেছে, তাই আদিবেগ $u = 0\\text{ ms}^{-1}$। ত্বরণ $a = 2\\text{ ms}^{-2}$ এবং সময় $t = 10\\text{ s}$। দূরত্বের সূত্র হলো $s = ut + \\frac{1}{2}at^2$।",
      },
    ],
    studentMessage: "তাহলে t এর মান বসালে সঠিক দূরত্ব s কত বের হবে?",
    languagePreference: "bn",
  });

  console.log("\n--- AI Tutor Response ---");
  console.log(res.reply);
  console.log("\nSafety Status:", res.safety);
}

run().catch((err) => {
  console.error("Test Error:", err);
  process.exit(1);
});
