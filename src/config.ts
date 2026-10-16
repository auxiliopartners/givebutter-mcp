export const API_BASE_URL = "https://api.givebutter.com/v1";

/** Givebutter's documented page size: defaults to 20, hard cap of 100. */
export const DEFAULT_PER_PAGE = 20;
export const MAX_PER_PAGE = 100;

/** Total attempts = 1 initial + MAX_RETRIES retries. */
export const MAX_RETRIES = 3;
export const BASE_DELAY_MS = 500;
export const MAX_DELAY_MS = 30_000;

export interface Config {
  apiKey: string;
  baseUrl: string;
}

/**
 * Resolved once at startup rather than per request. The previous implementation read
 * the env var inside every call, so a missing key surfaced as 65 different tool-call
 * failures instead of one clean startup error.
 */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const apiKey = env.GIVEBUTTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GIVEBUTTER_API_KEY environment variable is required. " +
        "Create a key at Givebutter → Settings → Developers → API Keys.",
    );
  }
  return { apiKey, baseUrl: env.GIVEBUTTER_API_BASE_URL ?? API_BASE_URL };
}
