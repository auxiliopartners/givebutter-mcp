import { z } from "zod";
import { defineTools } from "./types.js";
import { customFieldEntry, dedicationType, listScope, paymentMethod } from "../types/common.js";

const sortKey = z.enum(["amount", "transacted_at", "created_at", "contact_name"]);

export const transactionTools = defineTools([
  {
    name: "list_transactions",
    description: "List all transactions",
    method: "GET",
    path: "/transactions",
    paginated: true,
    input: {
      // There is no campaign filter on this endpoint. Passing one is silently ignored
      // by the API, which returns every transaction as if it had been filtered.
      contacts: z.string().optional().describe("Filter by contact ID, or comma-separated IDs"),
      method: paymentMethod.optional().describe("Filter by payment method"),
      scope: listScope
        .optional()
        .describe(
          "Omit for your own account; 'benefiting' where you are the beneficiary; 'chapters' for chapter-owned; 'all' for everything.",
        ),
      transactedAfter: z.string().optional().describe("Transacted after this ISO 8601 date"),
      transactedBefore: z.string().optional().describe("Transacted before this ISO 8601 date"),
      createdAfter: z.string().optional().describe("Created after this ISO 8601 date"),
      createdBefore: z.string().optional().describe("Created before this ISO 8601 date"),
      updatedAfter: z.string().optional().describe("Updated after this ISO 8601 date"),
      updatedBefore: z.string().optional().describe("Updated before this ISO 8601 date"),
      checkDepositedAfter: z.string().optional().describe("Check deposited after this ISO 8601 date"),
      checkDepositedBefore: z.string().optional().describe("Check deposited before this ISO 8601 date"),
      sortBy: sortKey.optional().describe("Sort ascending by this field"),
      sortByDesc: sortKey.optional().describe("Sort descending by this field"),
    },
  },
  {
    name: "get_transaction",
    description: "Get details of a specific transaction by ID",
    method: "GET",
    path: "/transactions/:transaction_id",
    input: { transaction_id: z.string().describe("The transaction ID (tid)") },
  },
  {
    name: "create_transaction",
    description:
      "Record an offline or external transaction, such as a cash, check, stock or in-kind gift",
    method: "POST",
    path: "/transactions",
    input: {
      method: paymentMethod.describe("How the gift was given"),
      amount: z.string().describe("Transaction amount"),
      transacted_at: z.string().describe("When the gift was given, in ISO 8601 format"),
      timezone: z.string().optional().describe("Timezone for transacted_at"),
      // Attribution
      campaign_code: z.string().optional().describe("Campaign code to attribute the gift to"),
      campaign_title: z.string().max(255).optional().describe("Campaign title"),
      campaign_team_id: z.number().optional().describe("Campaign team ID"),
      team_member_id: z.number().optional().describe("Team member ID"),
      fund_code: z.string().max(255).optional().describe("Fund code to designate the gift to"),
      // Donor
      contact_id: z.number().optional().describe("Existing contact ID for the donor"),
      contact_external_id: z.string().max(255).optional().describe("Your own donor identifier"),
      contact_contact_since: z.string().optional().describe("Contact-since date in ISO 8601 format"),
      first_name: z.string().max(255).optional().describe("Donor first name"),
      last_name: z.string().max(255).optional().describe("Donor last name"),
      email: z.string().max(255).optional().describe("Donor email address"),
      phone: z.string().optional().describe("Donor phone number"),
      company: z.string().max(255).optional().describe("Donor company"),
      address_1: z.string().max(255).optional().describe("Street address line 1"),
      address_2: z.string().max(255).optional().describe("Street address line 2"),
      city: z.string().max(255).optional().describe("City"),
      state: z.string().max(255).optional().describe("State/Province"),
      zipcode: z.string().max(255).optional().describe("ZIP/Postal code"),
      country: z.string().optional().describe("Country code"),
      // Money handling
      fee_covered: z.boolean().optional().describe("Whether the donor covered fees"),
      platform_fee: z.string().optional().describe("Platform fee amount"),
      processing_fee: z.string().optional().describe("Processing fee amount"),
      mark_deposited: z.boolean().optional().describe("Mark the gift as deposited"),
      check_number: z.string().max(255).optional().describe("Check number"),
      check_deposited_at: z.string().optional().describe("Check deposit date in ISO 8601 format"),
      // Metadata
      acknowledged_at: z.string().optional().describe("Acknowledgement date in ISO 8601 format"),
      external_label: z.string().max(255).optional().describe("External source label"),
      external_id: z.string().max(255).optional().describe("Your own identifier for this gift"),
      internal_note: z.string().max(131070).optional().describe("Internal note"),
      giving_space_message: z.string().max(65535).optional().describe("Public giving space message"),
      // Dedication
      dedication_type: dedicationType.optional().describe("Dedication type"),
      dedication_name: z.string().max(255).optional().describe("Who the gift is dedicated to"),
      dedication_recipient_name: z.string().max(255).optional().describe("Dedication notification recipient"),
      dedication_recipient_email: z.string().optional().describe("Dedication notification email"),
      // Appeal
      appeal_code: z.string().max(255).optional().describe("Appeal code"),
      appeal_name: z.string().max(255).optional().describe("Appeal name"),
      appeal_status: z.string().optional().describe("Appeal status"),
    },
  },
  {
    name: "update_transaction",
    description: "Update an existing transaction",
    method: "PUT",
    path: "/transactions/:transaction_id",
    input: {
      transaction_id: z.string().describe("The transaction ID (tid)"),
      internal_note: z.string().max(131070).optional().describe("Internal note"),
      check_number: z.string().max(255).optional().describe("Check number (max 255 chars)"),
      check_deposited_at: z.string().optional().describe("Check deposited date in ISO 8601 format"),
      offline_payment_received: z.boolean().optional().describe("Whether the offline payment was received"),
      team_id: z.string().optional().describe("Team ID"),
      campaign_member_id: z.string().optional().describe("Campaign member ID"),
      fund_id: z.string().optional().describe("Fund ID"),
      campaign_id: z.string().optional().describe("Campaign ID"),
      method: z.string().optional().describe("Payment method"),
      transacted_at: z.string().optional().describe("Transaction date"),
      appeal_id: z.string().optional().describe("Appeal ID"),
      custom_fields: z.array(customFieldEntry).optional().describe("Custom field values"),
      dedication: z
        .object({
          type: dedicationType.optional().describe("Dedication type"),
          name: z.string().max(255).optional().describe("Who the gift is dedicated to"),
          recipient_name: z.string().max(255).optional().describe("Notification recipient name"),
          recipient_email: z.string().optional().describe("Notification recipient email"),
        })
        .optional()
        .describe("Dedication details"),
    },
  },
]);
