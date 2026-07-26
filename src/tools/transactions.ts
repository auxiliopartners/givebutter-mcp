import { z } from "zod";
import { defineTools } from "./types.js";

export const transactionTools = defineTools([
  {
    name: "list_transactions",
    description: "List all transactions",
    method: "GET",
    path: "/transactions",
    paginated: true,
    input: {
      campaign_id: z.number().optional().describe("Filter by campaign ID"),
      contact_id: z.number().optional().describe("Filter by contact ID"),
    },
  },
  {
    name: "get_transaction",
    description: "Get details of a specific transaction by ID",
    method: "GET",
    path: "/transactions/:transaction_id",
    input: { transaction_id: z.number().describe("The transaction ID") },
  },
  {
    name: "update_transaction",
    description: "Update an existing transaction",
    method: "PUT",
    path: "/transactions/:transaction_id",
    input: {
      transaction_id: z.string().describe("The transaction ID"),
      internal_note: z.string().max(255).optional().describe("Internal note (max 255 chars)"),
      check_number: z.string().max(255).optional().describe("Check number (max 255 chars)"),
      check_deposited_at: z
        .string()
        .optional()
        .describe("Check deposited date in ISO 8601 format"),
      team_id: z.string().optional().describe("Team ID"),
      campaign_member_id: z.string().optional().describe("Campaign member ID"),
      fund_id: z.string().optional().describe("Fund ID"),
      campaign_id: z.string().optional().describe("Campaign ID"),
      method: z.string().optional().describe("Payment method"),
      transacted_at: z.string().optional().describe("Transaction date"),
      appeal_id: z.string().optional().describe("Appeal ID"),
    },
  },
]);
