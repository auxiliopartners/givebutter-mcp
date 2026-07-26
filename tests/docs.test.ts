import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { allTools } from "../src/tools/registry.js";

// Compiled to dist-test/tests/, so the repo root is two levels up.
const readme = readFileSync(new URL("../../README.md", import.meta.url), "utf8");

const documented = [...readme.matchAll(/^\| `([a-z_]+)` \|/gm)].map((m) => m[1]!);

test("README documents every registered tool, and no tools that do not exist", () => {
  const registered = allTools.map((t) => t.name).sort();
  assert.deepEqual(
    [...documented].sort(),
    registered,
    "README tool tables are out of sync with src/tools/registry.ts",
  );
});

test("README tool count heading matches reality", () => {
  const match = readme.match(/## Available Tools \((\d+)\)/);
  assert.ok(match, "README is missing its 'Available Tools (N)' heading");
  assert.equal(
    Number(match[1]),
    allTools.length,
    `README says ${match[1]} tools but ${allTools.length} are registered`,
  );
});

test("README does not list a tool twice", () => {
  assert.deepEqual(
    documented,
    [...new Set(documented)],
    "a tool appears in more than one README table",
  );
});
