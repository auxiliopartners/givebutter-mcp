import { z } from "zod";
import { defineTools } from "./types.js";

const contact_id = z.number().describe("The contact ID");
const tags = (verb: string) =>
  z.array(z.string().max(64)).min(1).describe(`Array of tag strings to ${verb}`);

export const contactTagTools = defineTools([
  {
    name: "add_contact_tags",
    description: "Add tags to a contact",
    method: "POST",
    path: "/contacts/:contact_id/tags/add",
    input: { contact_id, tags: tags("add") },
  },
  {
    name: "remove_contact_tags",
    description: "Remove tags from a contact",
    method: "POST",
    path: "/contacts/:contact_id/tags/remove",
    input: { contact_id, tags: tags("remove") },
  },
  {
    name: "sync_contact_tags",
    description: "Sync tags for a contact (replaces all existing tags)",
    method: "POST",
    path: "/contacts/:contact_id/tags/sync",
    input: {
      contact_id,
      tags: z
        .array(z.string().max(64))
        .min(1)
        .describe("Array of tag strings to sync (replaces existing tags)"),
    },
  },
]);
