import { z } from "zod";
import { defineTools } from "./types.js";

export const messageTools = defineTools([
  {
    name: "list_messages",
    description: "List all messages",
    method: "GET",
    path: "/messages",
    paginated: true,
    input: {},
  },
  {
    name: "get_message",
    description: "Get details of a specific message",
    method: "GET",
    path: "/messages/:message_id",
    input: { message_id: z.number().describe("The message ID") },
  },
]);
