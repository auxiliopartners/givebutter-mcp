import { z } from "zod";
import { defineTools } from "./types.js";

const campaign_id = z.number().describe("The campaign ID");
const discount_code_id = z.number().describe("The discount code ID");

const shared = {
  code: z.string().max(255).describe("The discount code string"),
  type: z.enum(["percentage", "fixed"]).describe("Discount type"),
  active: z.boolean().describe("Whether the code is active"),
  uses: z.number().min(1).optional().describe("Maximum number of uses (omit for unlimited)"),
  starts_at: z.string().optional().describe("Start date in ISO 8601 format"),
  expires_at: z.string().optional().describe("Expiry date in ISO 8601 format"),
  items: z
    .array(z.number())
    .optional()
    .describe("Ticket/item IDs the code applies to; omit to apply to all"),
};

export const discountCodeTools = defineTools([
  {
    name: "list_discount_codes",
    description: "List all discount codes for a campaign",
    method: "GET",
    path: "/campaigns/:campaign_id/discount-codes",
    paginated: true,
    input: { campaign_id },
  },
  {
    name: "get_discount_code",
    description: "Get details of a specific discount code",
    method: "GET",
    path: "/campaigns/:campaign_id/discount-codes/:discount_code_id",
    input: { campaign_id, discount_code_id },
  },
  {
    name: "create_discount_code",
    description: "Create a new discount code for a campaign",
    method: "POST",
    path: "/campaigns/:campaign_id/discount-codes",
    input: {
      campaign_id,
      ...shared,
      amount: z.number().min(1).max(100).describe("Discount amount"),
    },
  },
  {
    name: "update_discount_code",
    description: "Update an existing discount code",
    method: "PUT",
    path: "/campaigns/:campaign_id/discount-codes/:discount_code_id",
    input: {
      campaign_id,
      discount_code_id,
      amount: z.number().min(1).max(100).describe("Discount amount (required for update)"),
      code: shared.code.optional(),
      type: shared.type.optional(),
      active: shared.active.optional(),
      uses: shared.uses,
      starts_at: shared.starts_at,
      expires_at: shared.expires_at,
      items: shared.items,
    },
  },
  {
    name: "delete_discount_code",
    description:
      "Delete a discount code. Constraints: (1) the API returns 422 'Cannot delete a discount code that has been used. Please update its status to inactive.' if the code has been used — call update_discount_code with active:false instead; (2) a 404 typically means scope/permission, not a wrapper bug.",
    method: "DELETE",
    path: "/campaigns/:campaign_id/discount-codes/:discount_code_id",
    input: {
      campaign_id,
      discount_code_id: z.number().describe("The discount code ID to delete"),
    },
  },
]);
