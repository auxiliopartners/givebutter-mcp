import type { HttpMethod, ToolDef } from "./types.js";
import { clampPerPage } from "./pagination.js";

const PATH_PARAM = /:([A-Za-z_][A-Za-z0-9_]*)/g;

export interface RequestPlan {
  method: HttpMethod;
  /** Path with params substituted. No query string. */
  path: string;
  query: Record<string, string>;
  body?: Record<string, unknown>;
}

export function pathParamNames(template: string): string[] {
  return [...template.matchAll(PATH_PARAM)].map((m) => m[1]!);
}

const SENDS_BODY: ReadonlySet<HttpMethod> = new Set<HttpMethod>(["POST", "PUT", "PATCH"]);

/**
 * Turn a tool definition plus caller arguments into a concrete request. Pure: no I/O, no
 * clock, no randomness — which is what makes the bulk of the test suite trivial.
 */
export function buildRequestPlan(
  def: ToolDef,
  args: Record<string, unknown>,
): RequestPlan {
  const pathParams = new Set(pathParamNames(def.path));

  const path = def.path.replace(PATH_PARAM, (_match, name: string) => {
    const value = args[name];
    if (value === undefined || value === null || value === "") {
      throw new Error(`${def.name}: missing required path parameter "${name}"`);
    }
    return encodeURIComponent(String(value));
  });

  // Everything that is not a path param and not pagination becomes body or query.
  const rest: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(args)) {
    if (pathParams.has(key) || value === undefined) continue;
    if (def.paginated && (key === "page" || key === "per_page")) continue;
    rest[key] = value;
  }

  const query: Record<string, string> = {};
  let body: Record<string, unknown> | undefined;

  if (SENDS_BODY.has(def.method)) {
    // Left undefined when empty so restore_contact still sends a bodyless PATCH.
    body = Object.keys(rest).length > 0 ? rest : undefined;
  } else {
    for (const [key, value] of Object.entries(rest)) {
      // Arrays go out as repeated key[]= entries; the client expands them.
      query[key] = Array.isArray(value) ? value.join(",") : String(value);
    }
  }

  if (def.paginated) {
    if (args.page !== undefined) query.page = String(args.page);
    const perPage = clampPerPage(args.per_page);
    if (perPage !== undefined) query.per_page = String(perPage);
  }

  return { method: def.method, path, query, body };
}
