import { BASE_DELAY_MS, MAX_DELAY_MS } from "../config.js";
import type { HttpMethod } from "../tools/types.js";

/** Methods we are willing to replay after a 5xx or a network failure. */
const IDEMPOTENT: ReadonlySet<HttpMethod> = new Set<HttpMethod>(["GET", "DELETE"]);

const RETRYABLE_STATUS: ReadonlySet<number> = new Set([429, 500, 502, 503, 504]);

/**
 * Parse a Retry-After header. RFC 7231 permits either delta-seconds or an HTTP-date,
 * and Givebutter is not documented as guaranteeing which, so handle both.
 * Returns undefined when absent or unparseable.
 */
export function parseRetryAfter(header: string | null, nowMs: number): number | undefined {
  if (!header) return undefined;
  const raw = header.trim();
  if (!raw) return undefined;

  const seconds = Number(raw);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.round(seconds * 1000);

  const at = Date.parse(raw);
  if (Number.isNaN(at)) return undefined;
  return Math.max(0, at - nowMs);
}

export function shouldRetry(
  status: number,
  method: HttpMethod,
  attempt: number,
  maxRetries: number,
): boolean {
  if (attempt >= maxRetries) return false;
  // A 429 is a pre-execution rejection: the request never ran, so replaying it is safe
  // even for a POST.
  if (status === 429) return true;
  // A 5xx might mean the mutation landed and the response was lost. Never replay one.
  if (!IDEMPOTENT.has(method)) return false;
  return RETRYABLE_STATUS.has(status);
}

/** A transport-level failure (DNS, socket reset) — same replay rule as a 5xx. */
export function shouldRetryNetworkError(
  method: HttpMethod,
  attempt: number,
  maxRetries: number,
): boolean {
  return attempt < maxRetries && IDEMPOTENT.has(method);
}

export function delayMs(
  attempt: number,
  retryAfterMs: number | undefined,
  random: () => number,
): number {
  if (retryAfterMs !== undefined) {
    // Pad past clock skew so we do not wake a hair too early and burn a whole attempt.
    return Math.min(retryAfterMs, MAX_DELAY_MS) + 250;
  }
  const base = Math.min(BASE_DELAY_MS * 2 ** attempt, MAX_DELAY_MS);
  return Math.round(base * (0.5 + random() * 0.5)); // 50–100% jitter
}
