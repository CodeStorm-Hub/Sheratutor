/**
 * Distinguishes "the model call succeeded but returned no structured output"
 * from other failures (network, auth, rate limit) so route handlers can
 * respond appropriately instead of a generic 500 either way.
 */
export class FlowOutputError extends Error {
  constructor(flowName: string) {
    super(`${flowName}: model returned no structured output`);
    this.name = "FlowOutputError";
  }
}
