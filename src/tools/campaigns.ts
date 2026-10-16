import { z } from "zod";
import { defineTools } from "./types.js";
import { campaignType, listScope } from "../types/common.js";

const campaign_id = z.number().describe("The campaign ID");

const campaignSetting = z
  .object({
    name: z.string().describe("Setting name, e.g. theme_color or minimum_donation"),
    value: z.unknown().describe("Setting value; the accepted type depends on the name"),
  })
  .describe("A single campaign setting");

/** Maps each API type to the option it corresponds to in the dashboard's "create" chooser. */
const campaignTypeDescription = `Campaign type. Maps to the Givebutter dashboard creation options as follows:

- 'collect' → 'Fundraising Page' in the dashboard. Standalone donation page with goal, donation tiers, and updates feed. Most common type.
- 'fundraise' → 'Peer-to-Peer Fundraiser' in the dashboard. Like 'collect' but supports team and member sub-pages. Can be linked to an event via event_id.
- 'event' → 'Event' in the dashboard. Ticketed events with registration. Pairs with the campaign-ticket tools.
- 'general' → NOT shown in the dashboard creation chooser. Represents the account's primary donation page (singleton — only one per account, accessible at givebutter.com/[account-slug]). Attempting to create a second one returns 422: 'You can only have one general donations campaign.'

If creating campaigns programmatically and unsure, 'collect' is the right default for most use cases.`;

/** Fields accepted by both create and update. */
const shared = {
  subtitle: z.string().max(255).optional().describe("Campaign subtitle"),
  website: z.string().max(255).optional().describe("Campaign website URL"),
  goal: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe(
      "Fundraising goal in whole dollars (e.g. 1200 for a $1,200 goal — the API does NOT use cents). Set to 0 to clear the goal; Givebutter stores 0 as null.",
    ),
  // Sent as `description` (see wireNames). Renamed so LLM callers stop putting tool-call
  // metadata into what becomes the public campaign page.
  campaign_description: z
    .string()
    .optional()
    .describe(
      "The campaign body HTML. This becomes the public donor-facing content on givebutter.com — write the actual content, not metadata or reasoning notes.",
    ),
  end_at: z.string().optional().describe("End date in ISO 8601 format"),
  slug: z
    .string()
    .max(255)
    .optional()
    .describe(
      "URL slug for the campaign page. Givebutter may append the auto-generated campaign code as a suffix if the slug conflicts with an existing campaign (observed empirically; not in the official docs).",
    ),
  beneficiary_id: z.number().optional().describe("Beneficiary account ID"),
  timezone: z.string().max(255).optional().describe("Campaign timezone, e.g. America/New_York"),
  currency: z.enum(["USD"]).optional().describe("Campaign currency (USD is the only option)"),
  settings: z
    .array(campaignSetting)
    .optional()
    .describe(
      "Campaign settings as {name, value} pairs. Plain strings are rejected by the live API with 'settings.0.name field is required'.",
    ),
};

const wireNames = { campaign_description: "description" } as const;

export const campaignTools = defineTools([
  {
    name: "list_campaigns",
    description: "List all campaigns associated with your Givebutter account",
    method: "GET",
    path: "/campaigns",
    paginated: true,
    input: {
      scope: listScope
        .optional()
        .describe(
          "Filter by scope. Omit for campaigns you own; 'benefiting' for ones you are the beneficiary of; 'chapters' for chapter-owned; 'all' for everything.",
        ),
    },
  },
  {
    name: "get_campaign",
    description: "Get details of a specific campaign by ID",
    method: "GET",
    path: "/campaigns/:campaign_id",
    input: { campaign_id },
  },
  {
    name: "create_campaign",
    description:
      "Create a new campaign. A cover cannot be set at creation; set it afterwards with update_campaign's cover field (by URL — the API has no file upload).",
    method: "POST",
    path: "/campaigns",
    wireNames,
    input: {
      title: z.string().max(150).describe("Campaign title"),
      type: campaignType.describe(campaignTypeDescription),
      ...shared,
    },
  },
  {
    name: "update_campaign",
    description:
      "Update an existing campaign. Partial updates supported — only supply the fields you want to change. (The endpoint is documented as PUT but Givebutter applies it as a partial update; omitted fields are preserved.)",
    method: "PUT",
    path: "/campaigns/:campaign_id",
    wireNames,
    input: {
      campaign_id,
      title: z.string().max(150).optional().describe("Campaign title"),
      type: campaignType.optional().describe(campaignTypeDescription),
      ...shared,
      published: z.boolean().optional().describe("Whether the campaign is published"),
      public: z.boolean().optional().describe("Whether the campaign is publicly visible"),
      short_code: z.string().optional().describe("Campaign short code"),
      default_appeal_id: z.number().optional().describe("Default appeal ID"),
      cover: z
        .object({
          source: z
            .enum(["upload", "youtube", "vimeo", "twitch", "facebook"])
            .describe("Where the cover media comes from"),
          type: z.enum(["image", "video"]).describe("Cover media type"),
          url: z.string().describe("Cover media URL"),
        })
        .optional()
        .describe("Campaign cover media"),
    },
  },
  {
    name: "delete_campaign",
    description:
      "Delete a campaign. Constraints: (1) the API key must own the campaign — campaigns from sub-accounts, beneficiaries, or chapters return 404 even if visible elsewhere; (2) campaigns that have raised money cannot be deleted (the API returns 409 'This campaign has already raised money, and can not be deleted.'). A 404 typically means scope/permission, not a wrapper bug.",
    method: "DELETE",
    path: "/campaigns/:campaign_id",
    input: { campaign_id: z.number().describe("The campaign ID to delete") },
  },
]);
