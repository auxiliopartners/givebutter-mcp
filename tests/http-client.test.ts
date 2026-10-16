import test from "node:test";
import assert from "node:assert/strict";

import { createClient } from "../src/http/client.js";
import { GivebutterApiError } from "../src/http/errors.js";
import { fakeFetch } from "./helpers/fake-fetch.js";

const base = { apiKey: "secret", sleep: async () => {}, random: () => 0.5 };

test("builds the URL, sends bearer auth, and omits an empty query string", async () => {
  const { fn, calls } = fakeFetch([{ status: 200, body: { data: [] } }]);
  const client = createClient({ ...base, fetch: fn });

  await client.request({ method: "GET", path: "/campaigns", query: {} });

  assert.equal(calls[0]!.url, "https://api.givebutter.com/v1/campaigns");
  assert.equal(calls[0]!.headers.Authorization, "Bearer secret");
  assert.equal(calls[0]!.body, undefined);
});

test("serializes query params and JSON bodies", async () => {
  const { fn, calls } = fakeFetch([{ status: 200, body: { data: {} } }]);
  const client = createClient({ ...base, fetch: fn });

  await client.request({
    method: "POST",
    path: "/campaigns",
    query: { per_page: "100" },
    body: { title: "Gala" },
  });

  assert.equal(calls[0]!.url, "https://api.givebutter.com/v1/campaigns?per_page=100");
  assert.equal(calls[0]!.headers["Content-Type"], "application/json");
  assert.equal(calls[0]!.body, JSON.stringify({ title: "Gala" }));
});

test("204 No Content resolves rather than failing to parse JSON", async () => {
  const { fn } = fakeFetch([{ status: 204 }]);
  const client = createClient({ ...base, fetch: fn });

  const result = await client.request({ method: "DELETE", path: "/funds/abc", query: {} });
  assert.deepEqual(result, { success: true });
});

test("200 with an empty body resolves rather than failing to parse JSON", async () => {
  // DELETE /campaigns/:id does this in production: the delete lands, then a naive
  // response.json() throws and the tool reports a failure that did not happen.
  const { fn } = fakeFetch([{ status: 200 }]);
  const client = createClient({ ...base, fetch: fn });

  const result = await client.request({ method: "DELETE", path: "/campaigns/7", query: {} });
  assert.deepEqual(result, { success: true });
});

test("429 is retried after Retry-After, then succeeds", async () => {
  const { fn, calls } = fakeFetch([
    { status: 429, headers: { "retry-after": "2" } },
    { status: 200, body: { data: { id: 1 } } },
  ]);
  const slept: number[] = [];
  const client = createClient({
    ...base,
    fetch: fn,
    sleep: async (ms) => void slept.push(ms),
  });

  const result = await client.request({ method: "GET", path: "/campaigns", query: {} });

  assert.equal(calls.length, 2);
  assert.deepEqual(result, { data: { id: 1 } });
  // 2s from the header, plus the clock-skew pad.
  assert.equal(slept[0], 2250);
});

test("Retry-After given as an HTTP-date is honored", async () => {
  const now = Date.parse("2026-07-26T00:00:00Z");
  const { fn } = fakeFetch([
    { status: 429, headers: { "retry-after": "Sun, 26 Jul 2026 00:00:05 GMT" } },
    { status: 200, body: {} },
  ]);
  const slept: number[] = [];
  const client = createClient({
    ...base,
    fetch: fn,
    now: () => now,
    sleep: async (ms) => void slept.push(ms),
  });

  await client.request({ method: "GET", path: "/campaigns", query: {} });
  assert.equal(slept[0], 5250);
});

test("a 429 is retried even for POST, since the request never executed", async () => {
  const { fn, calls } = fakeFetch([
    { status: 429, headers: { "retry-after": "1" } },
    { status: 200, body: { data: {} } },
  ]);
  const client = createClient({ ...base, fetch: fn });

  await client.request({ method: "POST", path: "/campaigns", query: {}, body: { a: 1 } });
  assert.equal(calls.length, 2);
});

test("a 502 on POST is NOT replayed — the mutation may have landed", async () => {
  const { fn, calls } = fakeFetch([{ status: 502 }]);
  const client = createClient({ ...base, fetch: fn });

  await assert.rejects(() =>
    client.request({ method: "POST", path: "/campaigns", query: {}, body: { a: 1 } }),
  );
  assert.equal(calls.length, 1);
});

test("a 502 on GET IS retried", async () => {
  const { fn, calls } = fakeFetch([{ status: 502 }, { status: 200, body: { data: [] } }]);
  const client = createClient({ ...base, fetch: fn });

  await client.request({ method: "GET", path: "/campaigns", query: {} });
  assert.equal(calls.length, 2);
});

test("exhausting retries throws a typed error carrying the attempt count", async () => {
  const { fn, calls } = fakeFetch([{ status: 429, headers: { "retry-after": "1" } }]);
  const client = createClient({ ...base, fetch: fn, maxRetries: 3 });

  await assert.rejects(
    () => client.request({ method: "GET", path: "/transactions", query: {} }),
    (error: unknown) => {
      assert.ok(error instanceof GivebutterApiError);
      assert.equal(error.status, 429);
      assert.equal(error.attempts, 4);
      assert.match(error.message, /Rate limited by Givebutter \(429\)/);
      return true;
    },
  );
  assert.equal(calls.length, 4);
});

test("a 401 is not retried and explains that the key is the problem", async () => {
  const { fn, calls } = fakeFetch([{ status: 401 }]);
  const client = createClient({ ...base, fetch: fn });

  await assert.rejects(
    () => client.request({ method: "GET", path: "/campaigns", query: {} }),
    (error: unknown) => {
      assert.ok(error instanceof GivebutterApiError);
      assert.match(error.message, /API key/);
      return true;
    },
  );
  assert.equal(calls.length, 1);
});

test("a 422 surfaces the validation body so the caller can fix the request", async () => {
  const { fn } = fakeFetch([
    { status: 422, body: { message: "invalid", errors: { title: ["required"] } } },
  ]);
  const client = createClient({ ...base, fetch: fn });

  await assert.rejects(
    () => client.request({ method: "POST", path: "/campaigns", query: {}, body: {} }),
    (error: unknown) => {
      assert.ok(error instanceof GivebutterApiError);
      assert.match(error.message, /title/);
      return true;
    },
  );
});

test("network errors are retried on GET but not on POST", async () => {
  const getCall = fakeFetch([{ status: 0, networkError: true }, { status: 200, body: {} }]);
  await createClient({ ...base, fetch: getCall.fn }).request({
    method: "GET",
    path: "/campaigns",
    query: {},
  });
  assert.equal(getCall.calls.length, 2);

  const postCall = fakeFetch([{ status: 0, networkError: true }]);
  await assert.rejects(() =>
    createClient({ ...base, fetch: postCall.fn }).request({
      method: "POST",
      path: "/campaigns",
      query: {},
      body: {},
    }),
  );
  assert.equal(postCall.calls.length, 1);
});
