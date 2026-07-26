export class GivebutterApiError extends Error {
  readonly status: number;
  readonly method: string;
  readonly path: string;
  readonly attempts: number;
  readonly retryAfterMs?: number;
  readonly body?: string;

  constructor(init: {
    status: number;
    statusText?: string;
    method: string;
    path: string;
    attempts: number;
    retryAfterMs?: number;
    body?: string;
  }) {
    super(buildMessage(init));
    this.name = "GivebutterApiError";
    this.status = init.status;
    this.method = init.method;
    this.path = init.path;
    this.attempts = init.attempts;
    this.retryAfterMs = init.retryAfterMs;
    this.body = init.body;
  }
}

function buildMessage(init: {
  status: number;
  statusText?: string;
  method: string;
  path: string;
  attempts: number;
  retryAfterMs?: number;
  body?: string;
}): string {
  const where = `${init.method} ${init.path}`;
  const tries = init.attempts > 1 ? ` after ${init.attempts} attempts` : "";

  // The model reads these strings and decides what to do next, so say what went wrong
  // and what would fix it rather than dumping a bare status code.
  switch (init.status) {
    case 401:
      return `Givebutter rejected the API key (401) on ${where}. The key is missing, invalid, or revoked.`;
    case 403:
      return `Givebutter denied access (403) on ${where}. The key is valid but lacks permission for this resource, or the resource is archived.`;
    case 404:
      return `Not found (404): ${where}. Check the ID — note that funds, plans, tickets, payouts and transactions use opaque string IDs, not integers.`;
    case 422:
      return `Givebutter rejected the request body (422) on ${where}.${detail(init.body)}`;
    case 429:
      return `Rate limited by Givebutter (429) on ${where}${tries}.${
        init.retryAfterMs ? ` Retry after ~${Math.ceil(init.retryAfterMs / 1000)}s.` : ""
      } The limit is 500 requests/minute.`;
    default:
      return `Givebutter API request failed (${init.status}${
        init.statusText ? ` ${init.statusText}` : ""
      }) on ${where}${tries}.${detail(init.body)}`;
  }
}

function detail(body?: string): string {
  if (!body) return "";
  const trimmed = body.trim();
  if (!trimmed) return "";
  return ` ${trimmed.length > 800 ? `${trimmed.slice(0, 800)}…` : trimmed}`;
}
