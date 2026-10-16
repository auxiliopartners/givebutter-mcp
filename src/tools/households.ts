import { z } from "zod";
import { defineTools } from "./types.js";

const household_id = z.number().describe("The household ID");

const fields = {
  head_contact_id: z.number().optional().describe("Head contact ID"),
  note: z.string().optional().describe("Note about the household"),
  envelope_name: z.string().max(255).optional().describe("Envelope name for mailings"),
};

export const householdTools = defineTools([
  {
    name: "list_households",
    description: "List all households",
    method: "GET",
    path: "/households",
    paginated: true,
    input: {
      headContactId: z.number().optional().describe("Filter by head contact ID"),
      contacts: z.string().optional().describe("Filter by contact ID, or comma-separated IDs"),
      query: z.string().optional().describe("Free-text search across households"),
      sortBy: z.string().optional().describe("Sort ascending by this field"),
      sortByDesc: z.string().optional().describe("Sort descending by this field"),
    },
  },
  {
    name: "get_household",
    description: "Get details of a specific household",
    method: "GET",
    path: "/households/:household_id",
    input: { household_id },
  },
  {
    name: "create_household",
    description: "Create a new household",
    method: "POST",
    path: "/households",
    input: { name: z.string().max(255).describe("Household name"), ...fields },
  },
  {
    name: "update_household",
    description: "Update an existing household",
    method: "PUT",
    path: "/households/:household_id",
    input: {
      household_id,
      name: z.string().max(255).optional().describe("Household name"),
      ...fields,
    },
  },
  {
    name: "delete_household",
    description:
      "Delete a household. A 404 typically means the household is not in this API key's scope, not a wrapper bug.",
    method: "DELETE",
    path: "/households/:household_id",
    input: { household_id: z.number().describe("The household ID to delete") },
  },
]);
