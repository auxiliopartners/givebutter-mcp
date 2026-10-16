import { z } from "zod";
import { defineTools } from "./types.js";

export const pledgeTools = defineTools([
  {
    name: "list_pledges",
    description: "List all pledges",
    method: "GET",
    path: "/pledges",
    paginated: true,
    input: {},
  },
  {
    // Unlike funds/plans/tickets/payouts, a pledge ID really is an integer.
    name: "get_pledge",
    description: "Get details of a specific pledge",
    method: "GET",
    path: "/pledges/:pledge_id",
    input: { pledge_id: z.number().describe("The pledge ID") },
  },
]);
