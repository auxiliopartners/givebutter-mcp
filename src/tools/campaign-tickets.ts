import { z } from "zod";
import { defineTools } from "./types.js";

// Ticket *products* offered by a campaign. Distinct from src/tools/tickets.ts, which is
// the tickets actually issued to attendees.
const campaign_id = z.number().describe("The campaign ID");

export const campaignTicketTools = defineTools([
  {
    name: "list_campaign_tickets",
    description: "List all tickets for a campaign",
    method: "GET",
    path: "/campaigns/:campaign_id/items/tickets",
    paginated: true,
    input: { campaign_id },
  },
  {
    name: "get_campaign_ticket",
    description: "Get details of a specific campaign ticket",
    method: "GET",
    path: "/campaigns/:campaign_id/items/tickets/:ticket_id",
    input: { campaign_id, ticket_id: z.number().describe("The ticket ID") },
  },
  {
    name: "create_campaign_ticket",
    description: "Create a new ticket for a campaign",
    method: "POST",
    path: "/campaigns/:campaign_id/items/tickets",
    input: {
      campaign_id,
      name: z.string().max(255).describe("Ticket name"),
      price: z.number().min(0).describe("Ticket price"),
      total_quantity: z.number().min(0).optional().describe("Total quantity available"),
      subtype: z
        .enum(["physical", "digital", "hybrid"])
        .optional()
        .describe("Ticket subtype"),
      active: z.boolean().optional().describe("Whether the ticket is active"),
      retail_price: z.number().min(0).optional().describe("Retail price"),
      description: z
        .string()
        .max(5000)
        .optional()
        .describe("Ticket description (max 5000 chars)"),
      bundle_only: z.boolean().optional().describe("Whether the ticket is bundle-only"),
      hide_remaining: z
        .boolean()
        .optional()
        .describe("Whether to hide remaining quantity"),
      scope: z.enum(["registrant", "event"]).optional().describe("Ticket scope"),
    },
  },
]);
