import { z } from "zod";
import { defineTools } from "./types.js";

export const fundTools = defineTools([
  {
    name: "list_funds",
    description: "List all funds/designations",
    method: "GET",
    path: "/funds",
    paginated: true,
    input: {},
  },
  {
    name: "get_fund",
    description: "Get details of a specific fund",
    method: "GET",
    path: "/funds/:fund_id",
    input: { fund_id: z.string().describe("The fund ID (fid)") },
  },
  {
    name: "create_fund",
    description: "Create a new fund/designation",
    method: "POST",
    path: "/funds",
    input: {
      name: z.string().max(255).describe("Fund name"),
      code: z.string().max(255).optional().describe("Fund code"),
    },
  },
  {
    name: "update_fund",
    description: "Update an existing fund/designation",
    method: "PUT",
    path: "/funds/:fund_id",
    input: {
      fund_id: z.string().describe("The fund ID"),
      name: z.string().max(255).describe("Fund name"),
      code: z.string().max(255).optional().describe("Fund code"),
    },
  },
  {
    name: "delete_fund",
    description:
      "Delete a fund/designation. A 404 typically means the fund is not in this API key's scope, not a wrapper bug.",
    method: "DELETE",
    path: "/funds/:fund_id",
    input: { fund_id: z.string().describe("The fund ID to delete") },
  },
]);
