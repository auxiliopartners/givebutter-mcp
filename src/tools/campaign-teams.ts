import { z } from "zod";
import { defineTools } from "./types.js";

const campaign_id = z.number().describe("The campaign ID");

export const campaignTeamTools = defineTools([
  {
    name: "list_campaign_teams",
    description: "List all teams in a campaign",
    method: "GET",
    path: "/campaigns/:campaign_id/teams",
    paginated: true,
    input: { campaign_id },
  },
  {
    name: "get_campaign_team",
    description: "Get details of a specific team in a campaign",
    method: "GET",
    path: "/campaigns/:campaign_id/teams/:team_id",
    input: { campaign_id, team_id: z.number().describe("The team ID") },
  },
  {
    name: "delete_campaign_team",
    description:
      "Delete a team from a campaign. A 404 typically means the campaign or team is not in this API key's scope, not a wrapper bug.",
    method: "DELETE",
    path: "/campaigns/:campaign_id/teams/:team_id",
    input: { campaign_id, team_id: z.number().describe("The team ID to delete") },
  },
]);
