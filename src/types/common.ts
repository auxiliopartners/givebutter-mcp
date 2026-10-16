import { z } from "zod";

// Shared enums and field fragments. Kept in one place so a docs change is a one-line fix
// rather than a hunt through 19 resource modules.

/** POST /campaigns `type`. */
export const campaignType = z.enum(["general", "collect", "fundraise", "event"]);

/**
 * `scope` on list endpoints. The campaigns page types this as a bare string, but the
 * transactions page enumerates it, and the two share semantics:
 *   (omitted)  → resources your account owns
 *   benefiting → resources you are the beneficiary of
 *   chapters   → resources owned by chapters under your account
 *   all        → everything related to your account
 */
export const listScope = z.enum(["all", "benefiting", "chapters"]);

/** Webhook events. 12 as of Mar 2026, when plan.failed and refund.created were added. */
export const webhookEvent = z.enum([
  "campaign.created",
  "campaign.updated",
  "contact.created",
  "plan.canceled",
  "plan.created",
  "plan.failed",
  "plan.paused",
  "plan.resumed",
  "plan.updated",
  "refund.created",
  "ticket.created",
  "transaction.succeeded",
]);

/** Every activity type that can be READ back from a contact's timeline. */
export const contactActivityType = z.enum([
  "archived",
  "campaign.joined",
  "completed_task",
  "created_task",
  "custom_field.updated",
  "email",
  "email.subscribed",
  "email.unsubscribed",
  "letter",
  "meeting",
  "note",
  "phone_call",
  "recurring_plan.activated",
  "recurring_plan.canceled",
  "recurring_plan.created",
  "signup_form.submitted",
  "sms",
  "sms.subscribed",
  "sms.unsubscribed",
  "soft_credited",
  "subscription_form.submitted",
  "tagged",
  "ticket.issued",
  "transaction.acknowledged",
  // "recieved" is misspelled in the Givebutter API itself. Do not "fix" it.
  "transaction.recieved",
  "transaction.succeeded",
  "transaction.unacknowledged",
  "unarchived",
  "untagged",
  "volunteer_activity",
]);

/** The subset a client may CREATE. The rest are emitted by Givebutter itself. */
export const writableContactActivityType = z.enum([
  "email",
  "meeting",
  "note",
  "phone_call",
  "sms",
  "completed_task",
  "volunteer_activity",
]);

export const paymentMethod = z.enum([
  "ach",
  "card",
  "cash",
  "check",
  "digital_wallet",
  "donor_advised_fund",
  "paypal",
  "venmo",
  "cashapp",
  "terminal",
  "stock",
  "in-kind",
  "property",
  "other",
  "none",
]);

export const contactType = z.enum(["individual", "company"]);

export const dedicationType = z.enum(["in_memory_of", "in_honor_of"]);

/** Structured sub-objects used by the contact update schema. */
export const contactEmailEntry = z.object({
  value: z.string().describe("Email address"),
  type: z.string().optional().describe("Label, e.g. personal or work"),
  is_primary: z.boolean().optional().describe("Make this the primary email"),
});

export const contactPhoneEntry = z.object({
  value: z.string().describe("Phone number"),
  type: z.string().optional().describe("Label, e.g. mobile, home or work"),
  is_primary: z.boolean().optional().describe("Make this the primary phone"),
});

export const contactAddressEntry = z.object({
  id: z.number().optional().describe("Existing address ID; omit to add a new address"),
  address_1: z.string().optional(),
  address_2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipcode: z.string().optional(),
  country: z.string().optional(),
  is_primary: z.boolean().optional().describe("Make this the primary address"),
});

export const customFieldEntry = z
  .object({
    id: z.number().optional().describe("Custom field ID"),
    title: z.string().optional().describe("Custom field title"),
    value: z.unknown().optional().describe("Value to set"),
  })
  .describe("Custom field assignment");
