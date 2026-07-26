import { z } from "zod";
import { defineTools } from "./types.js";

const household_id = z.number().describe("The household ID");

export const householdContactTools = defineTools([
  {
    name: "list_household_contacts",
    description: "List all contacts associated with a household",
    method: "GET",
    path: "/households/:household_id/contacts",
    paginated: true,
    input: { household_id },
  },
  {
    name: "get_household_contact",
    description: "Get a specific contact associated with a household",
    method: "GET",
    path: "/households/:household_id/contacts/:contact_id",
    input: { household_id, contact_id: z.number().describe("The contact ID") },
  },
  {
    // contact_id is a BODY field here, not a path param — the only tool where the same
    // name means something different depending on the verb.
    name: "add_household_contact",
    description: "Add a contact to a household",
    method: "POST",
    path: "/households/:household_id/contacts",
    input: { household_id, contact_id: z.number().describe("The contact ID to add") },
  },
  {
    name: "remove_household_contact",
    description: "Remove a contact from a household",
    method: "DELETE",
    path: "/households/:household_id/contacts/:contact_id",
    input: { household_id, contact_id: z.number().describe("The contact ID to remove") },
  },
]);
