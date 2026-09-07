import { ai } from "@/ai/genkit";
import { createMcpServer } from "@genkit-ai/mcp";
// Ensure grounding and evaluation flows are loaded and registered with Genkit
import "@/ai/flows/retrieve-grounding";
import "@/ai/flows/evaluate-rubric";

/**
 * Creates and configures the SheraTutor Model Context Protocol (MCP) server.
 * Exposes verified Bangladeshi NCTB curriculum search and Socratic rubric grading
 * as standardized MCP tools for AI clients (Cursor, Claude Desktop, Antigravity).
 */
export function createSheraTutorMcpServer() {
  return createMcpServer(ai, {
    name: "sheratutor-mcp",
    version: "1.0.0",
  });
}

export const mcpServer = createSheraTutorMcpServer();

// Start stdio transport when executed directly via CLI
if (typeof process !== "undefined" && process.argv[1]?.endsWith("server.ts")) {
  mcpServer.start().catch((err) => {
    console.error("Failed to start SheraTutor MCP server:", err);
    process.exit(1);
  });
}
