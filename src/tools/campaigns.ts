import { z } from "zod";
import { defineTools } from "./types.js";

const campaign_id = z.number().describe("The campaign ID");

export const campaignTools = defineTools([
  {
    name: "list_campaigns",
    description: "List all campaigns associated with your Givebutter account",
    method: "GET",
    path: "/campaigns",
    paginated: true,
    input: {
      scope: z
        .enum(["owned", "beneficiary", "chapter"])
        .optional()
        .describe("Filter by campaign scope"),
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
      title: z.string().describe("Campaign title"),
      type: z
        .enum(["standard", "event", "sweepstakes", "p2p"])
        .describe("Campaign type - affects pricing tier"),
      goal: z.number().optional().describe("Fundraising goal in cents"),
      description: z.string().optional().describe("Campaign description"),
      end_at: z.string().optional().describe("End date in ISO 8601 format"),
    },
  },
  {
    name: "update_campaign",
    description: "Update an existing campaign",
    method: "PATCH",
    path: "/campaigns/:campaign_id",
    input: {
      campaign_id,
      title: z.string().optional().describe("Campaign title"),
      goal: z.number().optional().describe("Fundraising goal in cents"),
      description: z.string().optional().describe("Campaign description"),
      end_at: z.string().optional().describe("End date in ISO 8601 format"),
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
