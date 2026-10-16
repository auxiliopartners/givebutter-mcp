import test from "node:test";
import assert from "node:assert/strict";

import { clampPerPage, paginationShape } from "../src/tools/pagination.js";
import { parseRetryAfter, shouldRetry, delayMs } from "../src/http/retry.js";
import { toolResult, toolError } from "../src/format.js";
import { MAX_PER_PAGE } from "../src/config.js";

test("clampPerPage bounds to [1, 100] and passes through absent values", () => {
  assert.equal(clampPerPage(undefined), undefined);
  assert.equal(clampPerPage(null), undefined);
  assert.equal(clampPerPage("not a number"), undefined);
  assert.equal(clampPerPage(0), 1);
  assert.equal(clampPerPage(-5), 1);
  assert.equal(clampPerPage(50), 50);
  assert.equal(clampPerPage(MAX_PER_PAGE + 1), MAX_PER_PAGE);
  assert.equal(clampPerPage(12.7), 12);
});

test("paginationShape exposes exactly page and per_page", () => {
  assert.deepEqual(Object.keys(paginationShape).sort(), ["page", "per_page"]);
});

test("parseRetryAfter handles delta-seconds, HTTP-dates, and junk", () => {
  const now = Date.parse("2026-07-26T00:00:00Z");
  assert.equal(parseRetryAfter("30", now), 30_000);
  assert.equal(parseRetryAfter("  7 ", now), 7_000);
  assert.equal(parseRetryAfter("Sun, 26 Jul 2026 00:00:10 GMT", now), 10_000);
  // A date in the past clamps to zero rather than going negative.
  assert.equal(parseRetryAfter("Sun, 26 Jul 2026 00:00:00 GMT", now + 5000), 0);
  assert.equal(parseRetryAfter(null, now), undefined);
  assert.equal(parseRetryAfter("", now), undefined);
  assert.equal(parseRetryAfter("soon", now), undefined);
});

test("shouldRetry: 429 for any method, 5xx only for idempotent methods", () => {
  assert.equal(shouldRetry(429, "POST", 0, 3), true);
  assert.equal(shouldRetry(429, "GET", 0, 3), true);
  assert.equal(shouldRetry(502, "GET", 0, 3), true);
  assert.equal(shouldRetry(502, "DELETE", 0, 3), true);
  assert.equal(shouldRetry(502, "POST", 0, 3), false);
  assert.equal(shouldRetry(502, "PUT", 0, 3), false);
  assert.equal(shouldRetry(502, "PATCH", 0, 3), false);
  assert.equal(shouldRetry(404, "GET", 0, 3), false);
  assert.equal(shouldRetry(422, "POST", 0, 3), false);
  // Attempt budget is respected.
  assert.equal(shouldRetry(429, "GET", 3, 3), false);
});

test("delayMs prefers Retry-After, otherwise backs off exponentially with jitter", () => {
  assert.equal(delayMs(0, 2000, () => 0.5), 2250);
  // Clamped to the 30s ceiling before the pad.
  assert.equal(delayMs(0, 999_999, () => 0.5), 30_250);
  // No header: 500 * 2^attempt, scaled into the 50-100% jitter band.
  assert.equal(delayMs(0, undefined, () => 0), 250);
  assert.equal(delayMs(0, undefined, () => 1), 500);
  assert.equal(delayMs(2, undefined, () => 1), 2000);
});

test("toolResult appends a next-page hint only when more results remain", () => {
  const more = toolResult(
    { data: [], meta: { current_page: 1, last_page: 40, per_page: 20, total: 800 } },
    true,
  );
  assert.match(more.content[0]!.text, /More results remain — request page 2/);

  const last = toolResult(
    { data: [], meta: { current_page: 40, last_page: 40, per_page: 20, total: 800 } },
    true,
  );
  assert.match(last.content[0]!.text, /This is the last page/);
});

test("toolResult stays untouched for non-paginated tools and unusual payloads", () => {
  const single = toolResult({ data: { id: 1 } });
  assert.equal(single.content[0]!.text, JSON.stringify({ data: { id: 1 } }, null, 2));
  assert.ok(!single.content[0]!.text.includes("[pagination]"));

  // Households list returns a bare array rather than the standard envelope.
  const bare = toolResult([{ id: 1 }], true);
  assert.ok(!bare.content[0]!.text.includes("[pagination]"));
});

test("toolError flags isError and names the failing tool", () => {
  const result = toolError("get_campaign", new Error("boom"));
  assert.equal(result.isError, true);
  assert.match(result.content[0]!.text, /get_campaign failed: boom/);
});
