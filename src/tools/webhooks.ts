import { z } from "zod";
import { defineTools } from "./types.js";
import { webhookEvent as webhookEventEnum } from "../types/common.js";

const webhook_id = z.string().describe("The webhook ID");

export const webhookTools = defineTools([
  {
    name: "list_webhooks",
    description: "List all webhooks",
    method: "GET",
    path: "/webhooks",
    paginated: true,
    input: {},
  },
  {
    name: "get_webhook",
    description: "Get details of a specific webhook",
    method: "GET",
    path: "/webhooks/:webhook_id",
    input: { webhook_id },
  },
  {
    name: "create_webhook",
    description: "Create a new webhook",
    method: "POST",
    path: "/webhooks",
    input: {
      url: z.string().url().describe("The webhook endpoint URL"),
      events: z
        .array(webhookEventEnum)
        .optional()
        .describe("Array of event types to subscribe to"),
      event: webhookEventEnum.optional().describe("Single event type to subscribe to"),
      name: z.string().max(255).optional().describe("Webhook name"),
      enabled: z.boolean().optional().describe("Whether the webhook is enabled"),
    },
  },
  {
    name: "update_webhook",
    description: "Update an existing webhook",
    method: "PUT",
    path: "/webhooks/:webhook_id",
    input: {
      webhook_id,
      url: z.string().url().describe("The webhook endpoint URL"),
      events: z
        .array(webhookEventEnum)
        .min(1)
        .describe("Array of event types (required for update)"),
      name: z.string().max(255).optional().describe("Webhook name"),
      enabled: z.boolean().optional().describe("Whether the webhook is enabled"),
    },
  },
  {
    name: "delete_webhook",
    description: "Delete a webhook",
    method: "DELETE",
    path: "/webhooks/:webhook_id",
    input: { webhook_id: z.string().describe("The webhook ID to delete") },
  },
]);
