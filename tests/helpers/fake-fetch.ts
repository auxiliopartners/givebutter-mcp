export interface ScriptedResponse {
  status: number;
  headers?: Record<string, string>;
  body?: unknown;
  /** Throw a transport-level error instead of responding. */
  networkError?: boolean;
}

export interface RecordedCall {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
}

/**
 * A fetch stand-in that replays a fixed script. The last entry repeats, so a one-element
 * script models "always fails this way".
 */
export function fakeFetch(script: ScriptedResponse[]): {
  fn: typeof globalThis.fetch;
  calls: RecordedCall[];
} {
  const calls: RecordedCall[] = [];
  let index = 0;

  const fn = (async (url: unknown, init: RequestInit = {}) => {
    calls.push({
      url: String(url),
      method: init.method ?? "GET",
      headers: (init.headers ?? {}) as Record<string, string>,
      body: init.body as string | undefined,
    });

    const step = script[Math.min(index++, script.length - 1)]!;
    if (step.networkError) throw new TypeError("fetch failed");

    return new Response(step.body === undefined ? null : JSON.stringify(step.body), {
      status: step.status,
      headers: { "content-type": "application/json", ...step.headers },
    });
  }) as unknown as typeof globalThis.fetch;

  return { fn, calls };
}
