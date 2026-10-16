import { z } from "zod";
import { defineTools } from "./types.js";

export const planTools = defineTools([
  {
    name: "list_plans",
    description: "List all recurring donation plans",
    method: "GET",
    path: "/plans",
    paginated: true,
    input: {
      contacts: z.string().optional().describe("Filter by contact ID, or comma-separated IDs"),
    },
  },
  {
    name: "get_plan",
    description: "Get details of a specific recurring donation plan",
    method: "GET",
    path: "/plans/:plan_id",
    input: { plan_id: z.string().describe("The plan ID (uid)") },
  },
]);
