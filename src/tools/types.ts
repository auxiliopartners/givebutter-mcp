import type { ZodRawShape } from "zod";
import type { GivebutterClient } from "../http/client.js";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * A tool is data, not a closure.
 *
 * Every Givebutter endpoint follows the same shape: substitute the path params, drop
 * undefined args, then put whatever is left in the query string (GET/DELETE) or the JSON
 * body (POST/PUT/PATCH). Describing that declaratively — instead of hiding it inside 65
 * handler closures — is what lets tests assert the entire routing surface without a
 * network, a mock, or a single argument fixture.
 */
export interface ToolDef {
  readonly name: string;
  readonly description: string;
  readonly method: HttpMethod;
  /** Path template; each ":name" segment is filled from the arg of the same name. */
  readonly path: string;
  /** Zod raw shape for every argument EXCEPT page/per_page. */
  readonly input: ZodRawShape;
  /** Paginated list endpoint: the registrar injects page/per_page and surfaces meta. */
  readonly paginated?: boolean;
  /**
   * Arg name → API field name, for args exposed under a different name than the wire
   * field (e.g. campaign_description → description, so an LLM caller cannot confuse the
   * campaign body with the MCP envelope's own "description").
   */
  readonly wireNames?: Readonly<Record<string, string>>;
  /**
   * Escape hatch for an endpoint that does not fit the generic path. All 65 current
   * tools do fit, so this is unused — it exists so the pattern can never become a
   * reason to avoid adding a tool.
   */
  readonly execute?: (
    args: Record<string, unknown>,
    client: GivebutterClient,
  ) => Promise<unknown>;
}

/** Identity helper that preserves literal types through the resource modules. */
export const defineTools = <const T extends readonly ToolDef[]>(tools: T): T => tools;
