import { z } from "zod";
import { defineTools } from "./types.js";

const webhook_id = z.string().describe("The webhook ID");

const webhookEventEnum = z.enum([
  "campaign.created",
  "campaign.updated",
  "ticket.created",
  "transaction.succeeded",
  "contact.created",
  "plan.canceled",
  "plan.created",
  "plan.paused",
  "plan.resumed",
  "plan.updated",
]);

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
      events: z.array(webhookEventEnum).describe("Array of event types (required for update)"),
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
