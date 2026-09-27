import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { createGradingApp } from "./orchestrator";

export * from "./db";
export * from "./evaluator";
export * from "./orchestrator";

export function startGradingServer(port: number | string = process.env.GRADING_PORT || process.env.PORT || 3001) {
  const app = createGradingApp();
  return app.listen(port, () => {
    console.log(`NCTB Multi-Agent Grading Pipeline server listening on port ${port}`);
  });
}
