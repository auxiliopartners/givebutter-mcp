import { z } from "zod";
import { defineTools } from "./types.js";

const campaign_id = z.number().describe("The campaign ID");

export const campaignMemberTools = defineTools([
  {
    name: "list_campaign_members",
    description: "List all members of a campaign",
    method: "GET",
    path: "/campaigns/:campaign_id/members",
    paginated: true,
    input: { campaign_id },
  },
  {
    name: "get_campaign_member",
    description: "Get details of a specific campaign member",
    method: "GET",
    path: "/campaigns/:campaign_id/members/:member_id",
    input: { campaign_id, member_id: z.number().describe("The member ID") },
  },
  {
    name: "delete_campaign_member",
    description:
      "Remove a member from a campaign. A 404 typically means the campaign or member is not in this API key's scope, not a wrapper bug.",
    method: "DELETE",
    path: "/campaigns/:campaign_id/members/:member_id",
    input: { campaign_id, member_id: z.number().describe("The member ID to remove") },
  },
]);
