import { z } from "zod";
import { defineTools } from "./types.js";

export const payoutTools = defineTools([
  {
    name: "list_payouts",
    description: "List all payouts",
    method: "GET",
    path: "/payouts",
    paginated: true,
    input: {},
  },
  {
    name: "get_payout",
    description: "Get details of a specific payout",
    method: "GET",
    path: "/payouts/:payout_id",
    input: { payout_id: z.string().describe("The payout ID (payout number)") },
  },
]);
