import { z } from "zod";
import { defineTools } from "./types.js";

// Tickets issued to attendees. For the ticket products a campaign sells, see
// src/tools/campaign-tickets.ts.
export const ticketTools = defineTools([
  {
    name: "list_tickets",
    description: "List all tickets",
    method: "GET",
    path: "/tickets",
    paginated: true,
    input: {
      campaign_id: z.number().optional().describe("Filter by campaign ID"),
    },
  },
  {
    name: "get_ticket",
    description: "Get details of a specific ticket",
    method: "GET",
    path: "/tickets/:ticket_id",
    input: { ticket_id: z.number().describe("The ticket ID") },
  },
]);
