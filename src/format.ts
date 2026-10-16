import { GivebutterApiError } from "./http/errors.js";

export interface ToolResponse {
  // The SDK's CallToolResult carries an index signature for protocol extensions; without
  // it here, these objects are not assignable to a tool callback's return type.
  [key: string]: unknown;
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}

const text = (value: string): ToolResponse => ({ content: [{ type: "text", text: value }] });

export function toolResult(result: unknown, paginated?: boolean): ToolResponse {
  const body = JSON.stringify(result, null, 2);
  const hint = paginated ? paginationHint(result) : undefined;
  return text(hint ? `${body}\n\n${hint}` : body);
}

/**
 * Givebutter returns pagination state in `meta`, but it is easy to miss at the bottom of
 * a long JSON blob — which is how callers end up silently treating page 1 of 40 as the
 * whole dataset. Restate it explicitly when there is more to fetch.
 */
function paginationHint(result: unknown): string | undefined {
  if (typeof result !== "object" || result === null) return undefined;
  const meta = (result as { meta?: unknown }).meta;
  if (typeof meta !== "object" || meta === null) return undefined;

  const { current_page, last_page, per_page, total } = meta as Record<string, unknown>;
  if (typeof current_page !== "number" || typeof last_page !== "number") return undefined;

  const scope = typeof total === "number" ? ` of ${total} total` : "";
  const size = typeof per_page === "number" ? `, ${per_page} per page` : "";

  return current_page < last_page
    ? `[pagination] Page ${current_page} of ${last_page}${size}${scope}. More results remain — request page ${current_page + 1}, or raise per_page (max 100).`
    : `[pagination] Page ${current_page} of ${last_page}${size}${scope}. This is the last page.`;
}

export function toolError(toolName: string, error: unknown): ToolResponse {
  const message =
    error instanceof GivebutterApiError || error instanceof Error
      ? error.message
      : String(error);
  return { ...text(`${toolName} failed: ${message}`), isError: true };
}
