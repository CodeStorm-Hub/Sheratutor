import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

async function main() {
  // Dynamically import tutorAgent after environment variables are loaded
  const { tutorAgent } = await import("../src/ai/agents/tutor-agent");
  const { getServiceRoleClient } = await import("../src/lib/supabase/service-role");

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
      },
    }
  );

  console.log("Turn 1 Finish Reason:", res1.result.finishReason);
  console.log("Turn 1 Details:", JSON.stringify(res1.result, null, 2));
  if (res1.result.error) {
    console.error("Turn 1 Error:", res1.result.error);
    const msgs = (res1.result.error as any).details?.request?.messages;
    if (msgs) {
      for (const m of msgs) {
        console.log(`Msg [${m.role}]:`, JSON.stringify(m.content));
      }
    }
  }
  const text1 = res1.result.message?.content?.map((c: any) => c.text || "").join("");
  console.log("Turn 1 Reply:\n", text1);

  if (res1.result.finishReason !== "stop") {
    throw new Error(`Turn 1 failed or interrupted with finishReason: ${res1.result.finishReason}`);
  }

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
  if (res2.result.error) {
    console.error("Turn 2 Error:", res2.result.error);
  }
  const text2 = res2.result.message?.content?.map((c: any) => c.text || "").join("");
  console.log("Turn 2 Reply:\n", text2);

  if (res2.result.finishReason !== "stop") {
    throw new Error(`Turn 2 failed with finishReason: ${res2.result.finishReason}`);
  }

  // Deep verification: assert database records were created in Supabase
  console.log("\n=== Verifying Supabase Database Persistence ===");
  const supabase = getServiceRoleClient();
  const { data: sessionRow, error: sessionErr } = await supabase
    .from("tutor_chat_sessions")
    .select("id, student_id, mode, title, created_at, updated_at")
    .eq("id", sessionId)
    .single();

  if (sessionErr || !sessionRow) {
    throw new Error(`Session was not persisted to tutor_chat_sessions: ${sessionErr?.message}`);
  }
  console.log("Verified tutor_chat_sessions row:", sessionRow);

  const { data: messages, error: messagesErr } = await supabase
    .from("tutor_chat_messages")
    .select("id, role, content, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (messagesErr || !messages || messages.length < 4) {
    throw new Error(`Expected at least 4 persisted messages (2 turns), got ${messages?.length}: ${messagesErr?.message}`);
  }
  console.log(`Verified ${messages.length} messages persisted in tutor_chat_messages across 2 turns.`);
  for (const m of messages) {
    console.log(` [${m.role}]: ${m.content.slice(0, 60)}...`);
  }

  console.log("\nMulti-turn tutor agent test completed successfully with verified database persistence!");
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
