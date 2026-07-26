import type { ToolDef } from "./types.js";

import { campaignTools } from "./campaigns.js";
import { campaignMemberTools } from "./campaign-members.js";
import { campaignTeamTools } from "./campaign-teams.js";
import { campaignTicketTools } from "./campaign-tickets.js";
import { contactTools } from "./contacts.js";
import { contactActivityTools } from "./contact-activities.js";
import { contactTagTools } from "./contact-tags.js";
import { discountCodeTools } from "./discount-codes.js";
import { fundTools } from "./funds.js";
import { householdTools } from "./households.js";
import { householdContactTools } from "./household-contacts.js";
import { messageTools } from "./messages.js";
import { payoutTools } from "./payouts.js";
import { planTools } from "./plans.js";
import { pledgeTools } from "./pledges.js";
import { ticketTools } from "./tickets.js";
import { transactionTools } from "./transactions.js";
import { webhookTools } from "./webhooks.js";
import { webhookActivityTools } from "./webhook-activities.js";

/** Every tool the server exposes. Imported by both the server and the test suite. */
export const allTools: readonly ToolDef[] = [
  ...campaignTools,
  ...contactTools,
  ...contactActivityTools,
  ...contactTagTools,
  ...transactionTools,
  ...campaignMemberTools,
  ...campaignTeamTools,
  ...campaignTicketTools,
  ...discountCodeTools,
  ...householdTools,
  ...householdContactTools,
  ...messageTools,
  ...webhookTools,
  ...webhookActivityTools,
  ...pledgeTools,
  ...ticketTools,
  ...payoutTools,
  ...planTools,
  ...fundTools,
];
