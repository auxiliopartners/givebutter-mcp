import { z } from "zod";
import { defineTools } from "./types.js";
import {
  contactAddressEntry,
  contactEmailEntry,
  contactPhoneEntry,
  contactType,
  customFieldEntry,
} from "../types/common.js";

const contact_id = z.number().describe("The contact ID");

const sortKey = z.enum([
  "name_or_company",
  "primary_email",
  "point_of_contact",
  "created_at",
  "total_contributions",
  "recurring_contributions",
  "last_donation_amount",
]);

/** Identity fields shared by create and update. */
const identity = {
  prefix: z.string().max(32).optional().describe("Name prefix, e.g. Dr."),
  first_name: z.string().optional().describe("Contact first name"),
  middle_name: z.string().optional().describe("Contact middle name"),
  last_name: z.string().optional().describe("Contact last name"),
  suffix: z.string().max(32).optional().describe("Name suffix, e.g. Jr."),
  preferred_name: z.string().optional().describe("Preferred name"),
  pronouns: z.string().optional().describe("Contact pronouns"),
  gender: z.enum(["male", "female", "other"]).optional().describe("Contact gender"),
  dob: z.string().optional().describe("Date of birth (YYYY-MM-DD)"),
  type: contactType.optional().describe("Whether this is an individual or a company"),
  company_name: z.string().optional().describe("Company name (for company contacts)"),
  company: z.string().optional().describe("Company the contact is associated with"),
  employer: z.string().optional().describe("Contact employer"),
  title: z.string().optional().describe("Job title"),
  note: z.string().optional().describe("Note about the contact"),
  external_id: z.string().max(255).optional().describe("Your own identifier for this contact"),
  contact_since: z.string().optional().describe("Contact-since date in ISO 8601 format"),
  twitter_url: z.string().optional().describe("Twitter/X profile URL"),
  linkedin_url: z.string().optional().describe("LinkedIn profile URL"),
  facebook_url: z.string().optional().describe("Facebook profile URL"),
  tiktok_url: z.string().optional().describe("TikTok profile URL"),
  instagram_url: z.string().optional().describe("Instagram profile URL"),
  tags: z.array(z.string().max(64)).optional().describe("Tags to apply to the contact"),
  custom_fields: z.array(customFieldEntry).optional().describe("Custom field values"),
};

export const contactTools = defineTools([
  {
    name: "list_contacts",
    description: "List all contacts in your Givebutter account",
    method: "GET",
    path: "/contacts",
    paginated: true,
    input: {
      // Note the camelCase filters — Givebutter uses snake_case bodies but camelCase
      // query parameters on this endpoint.
      email: z.string().optional().describe("Filter by any email address on the contact"),
      primaryEmail: z.string().optional().describe("Filter by primary email address"),
      firstName: z.string().max(1000).optional().describe("Filter by first name"),
      lastName: z.string().max(1000).optional().describe("Filter by last name"),
      type: contactType.optional().describe("Filter by individual or company"),
      tags: z.string().optional().describe("Filter by tag"),
      createdAfter: z.string().optional().describe("Only contacts created after this ISO 8601 date"),
      createdBefore: z.string().optional().describe("Only contacts created before this ISO 8601 date"),
      updatedAfter: z.string().optional().describe("Only contacts updated after this ISO 8601 date"),
      updatedBefore: z.string().optional().describe("Only contacts updated before this ISO 8601 date"),
      totalContributionsMin: z.number().optional().describe("Minimum total contributions"),
      totalContributionsMax: z.number().optional().describe("Maximum total contributions"),
      recurringContributionsMin: z.number().optional().describe("Minimum recurring contributions"),
      recurringContributionsMax: z.number().optional().describe("Maximum recurring contributions"),
      sortBy: sortKey.optional().describe("Sort ascending by this field"),
      sortByDesc: sortKey.optional().describe("Sort descending by this field"),
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
    description:
      "Create a new contact. By default a submitted contact matching an existing one is merged into it; set force_create to skip de-duplication.",
    method: "POST",
    path: "/contacts",
    input: {
      ...identity,
      primary_email: z.string().optional().describe("Primary email address"),
      primary_phone: z.string().optional().describe("Primary phone number"),
      emails: z.array(z.string()).optional().describe("Additional email addresses"),
      phones: z.array(z.string()).optional().describe("Additional phone numbers"),
      // The create schema takes flat address fields; the update schema does not.
      address_1: z.string().optional().describe("Street address line 1"),
      address_2: z.string().optional().describe("Street address line 2"),
      city: z.string().optional().describe("City"),
      state: z.string().optional().describe("State/Province"),
      zipcode: z.string().optional().describe("ZIP/Postal code"),
      country: z.string().optional().describe("Country code (e.g., US)"),
      addresses: z
        .array(contactAddressEntry)
        .optional()
        .describe("Additional addresses beyond the primary one"),
      email_subscription: z.boolean().optional().describe("Subscribe the contact to email"),
      phone_subscription: z.boolean().optional().describe("Subscribe the contact to SMS"),
      address_subscription: z.boolean().optional().describe("Subscribe the contact to mail"),
      force_create: z
        .boolean()
        .optional()
        .describe("Skip de-duplication and always create a new contact (default false)"),
    },
  },
  {
    name: "update_contact",
    description:
      "Update an existing contact. Emails, phones and addresses are structured here — there are no flat address fields on update.",
    method: "PUT",
    path: "/contacts/:contact_id",
    input: {
      contact_id,
      ...identity,
      bio: z.string().max(2000).optional().describe("Contact biography"),
      website_url: z.string().optional().describe("Personal website URL"),
      emails: z
        .array(contactEmailEntry)
        .optional()
        .describe("Emails to add or update, each with an optional type and is_primary flag"),
      phones: z
        .array(contactPhoneEntry)
        .optional()
        .describe("Phones to add or update, each with an optional type and is_primary flag"),
      addresses: z
        .array(contactAddressEntry)
        .optional()
        .describe("Addresses to add or update; include an id to modify an existing one"),
      remove_emails: z.array(z.string()).optional().describe("Email addresses to remove"),
      remove_phones: z.array(z.string()).optional().describe("Phone numbers to remove"),
      remove_address_ids: z.array(z.number()).optional().describe("Address IDs to remove"),
      email_opt_in: z.boolean().optional().describe("Email subscription status"),
      sms_opt_in: z.boolean().optional().describe("SMS subscription status"),
      address_subscription: z.boolean().optional().describe("Mail subscription status"),
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
