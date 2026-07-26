import { setTimeout as delay } from "node:timers/promises";
import { API_BASE_URL, MAX_RETRIES } from "../config.js";
import type { RequestPlan } from "../tools/plan.js";
import { GivebutterApiError } from "./errors.js";
import { delayMs, parseRetryAfter, shouldRetry, shouldRetryNetworkError } from "./retry.js";

export interface ClientOptions {
  apiKey: string;
  baseUrl?: string;
  /** Seams. Defaults are the real thing in production; tests inject fakes. */
  fetch?: typeof globalThis.fetch;
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
  random?: () => number;
  maxRetries?: number;
}

export interface GivebutterClient {
  request<T = unknown>(plan: RequestPlan): Promise<T>;
}

export function createClient(options: ClientOptions): GivebutterClient {
  const {
    apiKey,
    baseUrl = API_BASE_URL,
    fetch: fetchImpl = globalThis.fetch,
    sleep = (ms: number) => delay(ms),
    now = Date.now,
    random = Math.random,
    maxRetries = MAX_RETRIES,
  } = options;

  async function request<T>(plan: RequestPlan): Promise<T> {
    const url = buildUrl(baseUrl, plan);

    const init: RequestInit = {
      method: plan.method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
        ...(plan.body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      ...(plan.body !== undefined ? { body: JSON.stringify(plan.body) } : {}),
    };

    for (let attempt = 0; ; attempt++) {
      let response: Response;
      try {
        response = await fetchImpl(url, init);
      } catch (cause) {
        if (shouldRetryNetworkError(plan.method, attempt, maxRetries)) {
          await sleep(delayMs(attempt, undefined, random));
          continue;
        }
        throw cause;
      }

      if (response.ok) {
        if (response.status === 204) return { success: true } as T;
        return (await response.json()) as T;
      }

      const retryAfterMs = parseRetryAfter(response.headers.get("retry-after"), now());

      if (shouldRetry(response.status, plan.method, attempt, maxRetries)) {
        await sleep(delayMs(attempt, retryAfterMs, random));
        continue;
      }

      throw new GivebutterApiError({
        status: response.status,
        statusText: response.statusText,
        method: plan.method,
        path: plan.path,
        attempts: attempt + 1,
        retryAfterMs,
        body: await response.text().catch(() => undefined),
      });
    }
  }

  return { request };
}

function buildUrl(baseUrl: string, plan: RequestPlan): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(plan.query)) {
    params.append(key, value);
  }
  const qs = params.toString();
  return `${baseUrl}${plan.path}${qs ? `?${qs}` : ""}`;
}
