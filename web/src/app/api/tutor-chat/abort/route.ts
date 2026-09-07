import { appRoute } from "@genkit-ai/next";
import { tutorAgent } from "@/ai/agents/tutor-agent";

export const POST = appRoute(tutorAgent.abortAgentAction);
