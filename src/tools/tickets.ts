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
    // GET /tickets accepts no filters. A campaign_id used to be sent here and was
    // silently ignored, so callers got every ticket back believing it was filtered.
    input: {},
  },
  {
    name: "get_ticket",
    description: "Get details of a specific ticket",
    method: "GET",
    path: "/tickets/:ticket_id",
    input: { ticket_id: z.string().describe("The ticket ID (uid)") },
  },
]);
