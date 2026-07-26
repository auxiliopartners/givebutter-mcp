import { z } from "zod";
import { defineTools } from "./types.js";

const contact_id = z.number().describe("The contact ID");

const contactFields = {
  first_name: z.string().optional().describe("Contact first name"),
  last_name: z.string().optional().describe("Contact last name"),
  phone: z.string().optional().describe("Contact phone number"),
  address_line1: z.string().optional().describe("Street address line 1"),
  address_line2: z.string().optional().describe("Street address line 2"),
  city: z.string().optional().describe("City"),
  state: z.string().optional().describe("State/Province"),
  zipcode: z.string().optional().describe("ZIP/Postal code"),
};

export const contactTools = defineTools([
  {
    name: "list_contacts",
    description: "List all contacts in your Givebutter account",
    method: "GET",
    path: "/contacts",
    paginated: true,
    input: {
      email: z.string().optional().describe("Filter by email address"),
    },
  },
  {
    name: "get_contact",
    description: "Get details of a specific contact by ID",
    method: "GET",
    path: "/contacts/:contact_id",
    input: { contact_id },
  },
  {
    name: "create_contact",
    description: "Create a new contact",
    method: "POST",
    path: "/contacts",
    input: {
      email: z.string().describe("Contact email address"),
      ...contactFields,
      country: z.string().optional().describe("Country code (e.g., US)"),
    },
  },
  {
    name: "update_contact",
    description: "Update an existing contact",
    method: "PATCH",
    path: "/contacts/:contact_id",
    input: {
      contact_id,
      email: z.string().optional().describe("Contact email address"),
      ...contactFields,
      country: z.string().optional().describe("Country code"),
    },
  },
  {
    name: "delete_contact",
    description: "Archive a contact (soft delete)",
    method: "DELETE",
    path: "/contacts/:contact_id",
    input: { contact_id: z.number().describe("The contact ID to archive") },
  },
  {
    name: "restore_contact",
    description: "Restore an archived contact",
    method: "PATCH",
    path: "/contacts/:contact_id/restore",
    input: { contact_id: z.number().describe("The contact ID to restore") },
  },
]);
