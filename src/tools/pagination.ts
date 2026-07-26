import { z } from "zod";
import { MAX_PER_PAGE } from "../config.js";

/** Injected into every tool marked `paginated`, so no tool hand-rolls these. */
export const paginationShape = {
  page: z
    .number()
    .int()
    .min(1)
    .optional()
    .describe("Page number for pagination (1-indexed, defaults to 1)"),
  per_page: z
    .number()
    .int()
    .min(1)
    .max(MAX_PER_PAGE)
    .optional()
    .describe(
      `Results per page (defaults to 20, maximum ${MAX_PER_PAGE}). Raise this to fetch more rows in a single call.`,
    ),
};

/**
 * Returns undefined when the caller did not ask for a page size, so the query string
 * stays byte-identical to what the server sent before per_page existed.
 */
export function clampPerPage(value: unknown): number | undefined {
  if (value === undefined || value === null) return undefined;
  const n = Number(value);
  if (!Number.isFinite(n)) return undefined;
  return Math.min(Math.max(Math.trunc(n), 1), MAX_PER_PAGE);
}
