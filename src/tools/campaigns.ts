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

/** Fields accepted by both create and update. */
const shared = {
  subtitle: z.string().max(255).optional().describe("Campaign subtitle"),
  website: z.string().max(255).optional().describe("Campaign website URL"),
  goal: z.number().min(0).optional().describe("Fundraising goal"),
  description: z.string().optional().describe("Campaign description"),
  end_at: z.string().optional().describe("End date in ISO 8601 format"),
  slug: z.string().optional().describe("URL slug for the campaign page"),
  beneficiary_id: z.number().optional().describe("Beneficiary account ID"),
  timezone: z.string().max(255).optional().describe("Campaign timezone, e.g. America/New_York"),
  currency: z.enum(["USD"]).optional().describe("Campaign currency (USD is the only option)"),
  settings: z.array(campaignSetting).optional().describe("Campaign settings to apply"),
};

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
    description: "Create a new campaign",
    method: "POST",
    path: "/campaigns",
    input: {
      title: z.string().max(150).describe("Campaign title"),
      type: campaignType.describe(
        "Campaign type: general, collect, fundraise or event",
      ),
      ...shared,
    },
  },
  {
    name: "update_campaign",
    description: "Update an existing campaign",
    method: "PUT",
    path: "/campaigns/:campaign_id",
    input: {
      campaign_id,
      title: z.string().max(150).optional().describe("Campaign title"),
      type: campaignType.optional().describe("Campaign type"),
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
    description: "Delete a campaign",
    method: "DELETE",
    path: "/campaigns/:campaign_id",
    input: { campaign_id: z.number().describe("The campaign ID to delete") },
  },
]);
