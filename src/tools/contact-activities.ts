import { z } from "zod";
import { defineTools } from "./types.js";

const contact_id = z.number().describe("The contact ID");

export const contactActivityTools = defineTools([
  {
    name: "list_contact_activities",
    description: "List all activities for a contact",
    method: "GET",
    path: "/contacts/:contact_id/activities",
    input: {
      contact_id,
      type: z
        .enum([
          "archived",
          "campaign.joined",
          "email",
          "email.subscribed",
          "email.unsubscribed",
          "letter",
          "meeting",
          "note",
          "phone_call",
          "recurring_plan.canceled",
          "recurring_plan.created",
          "recurring_plan.activated",
          "signup_form.submitted",
          "sms",
          "sms.subscribed",
          "sms.unsubscribed",
          "subscription_form.submitted",
          "completed_task",
          "ticket.issued",
          "transaction.recieved",
          "transaction.succeeded",
          "transaction.acknowledged",
          "transaction.unacknowledged",
          "unarchived",
          "volunteer_activity",
          "soft_credited",
        ])
        .optional()
        .describe("Filter by activity type"),
    },
  },
  {
    name: "get_contact_activity",
    description: "Get details of a specific contact activity",
    method: "GET",
    path: "/contacts/:contact_id/activities/:activity_id",
    input: { contact_id, activity_id: z.number().describe("The activity ID") },
  },
  {
    name: "delete_contact_activity",
    description: "Delete a contact activity",
    method: "DELETE",
    path: "/contacts/:contact_id/activities/:activity_id",
    input: {
      contact_id,
      activity_id: z.number().describe("The activity ID to delete"),
    },
  },
]);
