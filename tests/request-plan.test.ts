import test from "node:test";
import assert from "node:assert/strict";

import { allTools } from "../src/tools/registry.js";
import { buildRequestPlan, pathParamNames } from "../src/tools/plan.js";
import type { ToolDef } from "../src/tools/types.js";

const byName = new Map(allTools.map((t) => [t.name, t]));
const tool = (name: string): ToolDef => {
  const found = byName.get(name);
  assert.ok(found, `no such tool: ${name}`);
  return found;
};

test("update_contact: id goes in the path, undefined args are dropped", () => {
  const plan = buildRequestPlan(tool("update_contact"), {
    contact_id: 42,
    first_name: "Ada",
    last_name: undefined,
  });
  assert.equal(plan.path, "/contacts/42");
  assert.deepEqual(plan.query, {});
  // contact_id must NOT be echoed into the body.
  assert.deepEqual(plan.body, { first_name: "Ada" });
});

test("add_household_contact: contact_id is a body field, not a path param", () => {
  const plan = buildRequestPlan(tool("add_household_contact"), {
    household_id: 9,
    contact_id: 3,
  });
  assert.equal(plan.method, "POST");
  assert.equal(plan.path, "/households/9/contacts");
  assert.deepEqual(plan.body, { contact_id: 3 });
});

test("remove_household_contact: same two args, but both are path params", () => {
  const plan = buildRequestPlan(tool("remove_household_contact"), {
    household_id: 9,
    contact_id: 3,
  });
  assert.equal(plan.method, "DELETE");
  assert.equal(plan.path, "/households/9/contacts/3");
  assert.deepEqual(plan.query, {});
  assert.equal(plan.body, undefined);
});

test("campaign_description goes over the wire as description", () => {
  for (const name of ["create_campaign", "update_campaign"]) {
    const plan = buildRequestPlan(tool(name), {
      campaign_id: 7,
      title: "Gala",
      campaign_description: "<p>Join us</p>",
    });
    assert.equal(plan.body?.description, "<p>Join us</p>", `${name}: description not sent`);
    assert.ok(!("campaign_description" in (plan.body ?? {})), `${name}: arg name leaked`);
  }
});

test("restore_contact sends a bodyless PATCH", () => {
  const plan = buildRequestPlan(tool("restore_contact"), { contact_id: 5 });
  assert.equal(plan.method, "PATCH");
  assert.equal(plan.path, "/contacts/5/restore");
  assert.equal(plan.body, undefined);
});

test("GET args become query params, not a body", () => {
  const plan = buildRequestPlan(tool("list_contacts"), { email: "a@b.com", page: 3 });
  assert.equal(plan.body, undefined);
  assert.deepEqual(plan.query, { email: "a@b.com", page: "3" });
});

test("per_page is clamped to the documented maximum of 100", () => {
  const plan = buildRequestPlan(tool("list_campaign_members"), {
    campaign_id: 7,
    per_page: 500,
  });
  assert.equal(plan.path, "/campaigns/7/members");
  assert.equal(plan.query.per_page, "100");
});

test("omitting per_page leaves it out of the query entirely", () => {
  const plan = buildRequestPlan(tool("list_campaigns"), {});
  assert.deepEqual(plan.query, {});
});

test("a missing path param fails loudly instead of producing a bad URL", () => {
  assert.throws(
    () => buildRequestPlan(tool("get_campaign"), {}),
    /missing required path parameter "campaign_id"/,
  );
});

test("path params are URL-encoded", () => {
  const plan = buildRequestPlan(tool("get_fund"), { fund_id: "a/b c" });
  assert.equal(plan.path, "/funds/a%2Fb%20c");
});

test("array args are serialized for query endpoints", () => {
  const plan = buildRequestPlan(tool("add_contact_tags"), {
    contact_id: 1,
    tags: ["donor", "vip"],
  });
  // POST, so tags ride in the body as a real array.
  assert.deepEqual(plan.body, { tags: ["donor", "vip"] });
});

// Sweeps all tools with no per-tool fixtures: path params are the only args that must
// be present, so we can synthesize them for every tool mechanically.
test("no tool leaves an unsubstituted param or leaks a path param into query/body", () => {
  for (const def of allTools) {
    const params = pathParamNames(def.path);
    const args = Object.fromEntries(params.map((p) => [p, 123]));
    const plan = buildRequestPlan(def, args);

    assert.ok(!plan.path.includes(":"), `${def.name}: unsubstituted param in ${plan.path}`);
    for (const p of params) {
      assert.ok(!(p in plan.query), `${def.name}: path param "${p}" leaked into the query`);
      assert.ok(
        !(p in (plan.body ?? {})),
        `${def.name}: path param "${p}" leaked into the body`,
      );
    }
  }
});

test("GET and DELETE tools never produce a body", () => {
  for (const def of allTools) {
    if (def.method !== "GET" && def.method !== "DELETE") continue;
    const args = Object.fromEntries(pathParamNames(def.path).map((p) => [p, 1]));
    assert.equal(buildRequestPlan(def, args).body, undefined, `${def.name} produced a body`);
  }
});
