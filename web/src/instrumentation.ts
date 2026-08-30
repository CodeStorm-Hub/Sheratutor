import { type Instrumentation } from 'next';

/**
 * Runs once per server instance. Drop an OTel / APM registration in here when
 * one is added (e.g. `registerOTel('sheratutor')` from `@vercel/otel`).
 */
export function register() {}

/**
 * Server-side error hook. Emits a single structured line per captured error so
 * it correlates with the `ref: <digest>` surfaced in the error boundaries.
 * Swap the `console.error` for a provider call (Sentry, etc.) when available.
 */
export const onRequestError: Instrumentation.onRequestError = (err, request, context) => {
  const message = err instanceof Error ? err.message : String(err);
  const digest =
    typeof err === 'object' && err !== null && 'digest' in err
      ? String((err as { digest?: unknown }).digest)
      : undefined;

  console.error('[onRequestError]', {
    message,
    digest,
    path: request.path,
    method: request.method,
    routeType: context.routeType,
    renderSource: context.renderSource,
    stack: err instanceof Error ? err.stack : undefined,
  });
};
