import test from "node:test";
import assert from "node:assert/strict";

import { allTools } from "../src/tools/registry.js";
import { pathParamNames } from "../src/tools/plan.js";
import { EXPECTED_ROUTES, type ExpectedRoute } from "./fixtures/expected-routes.js";

const sorted = (rows: readonly ExpectedRoute[]): ExpectedRoute[] =>
  [...rows].sort((a, b) => a[0].localeCompare(b[0]));

test("route table matches the golden fixture exactly", () => {
  const actual: ExpectedRoute[] = allTools.map((t) => [
    t.name,
    t.method,
    t.path,
    t.paginated === true,
  ]);
  assert.deepEqual(sorted(actual), sorted(EXPECTED_ROUTES));
});

test("tool count matches the fixture", () => {
  assert.equal(allTools.length, EXPECTED_ROUTES.length);
});

test("tool names are unique", () => {
  const names = allTools.map((t) => t.name);
  assert.deepEqual([...new Set(names)].sort(), [...names].sort());
});

test("every :param in a path is declared in that tool's input schema", () => {
  for (const tool of allTools) {
    for (const param of pathParamNames(tool.path)) {
      assert.ok(
        param in tool.input,
        `${tool.name}: path param ":${param}" is not declared in inputSchema`,
      );
    }
  }
});

test("no tool hand-rolls pagination", () => {
  for (const tool of allTools) {
    assert.ok(!("page" in tool.input), `${tool.name}: use paginated:true instead of a page arg`);
    assert.ok(
      !("per_page" in tool.input),
      `${tool.name}: use paginated:true instead of a per_page arg`,
    );
  }
});

test("paths are well-formed", () => {
  for (const tool of allTools) {
    assert.ok(tool.path.startsWith("/"), `${tool.name}: path must start with "/"`);
    assert.ok(!tool.path.includes("?"), `${tool.name}: query strings belong in input, not path`);
    assert.ok(!tool.path.endsWith("/"), `${tool.name}: path must not have a trailing slash`);
  }
});

test("every tool has a non-empty description", () => {
  for (const tool of allTools) {
    assert.ok(tool.description.trim().length > 0, `${tool.name}: missing description`);
  }
});
