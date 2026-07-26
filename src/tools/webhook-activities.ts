import { z } from "zod";
import { defineTools } from "./types.js";

const webhook_id = z.string().describe("The webhook ID");

export const webhookActivityTools = defineTools([
  {
    name: "list_webhook_activities",
    description: "List all activities for a webhook",
    method: "GET",
    path: "/webhooks/:webhook_id/activities",
    paginated: true,
    input: { webhook_id },
  },
  {
    name: "get_webhook_activity",
    description: "Get details of a specific webhook activity",
    method: "GET",
    path: "/webhooks/:webhook_id/activities/:activity_id",
    input: { webhook_id, activity_id: z.string().describe("The activity ID") },
  },
]);
