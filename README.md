# Givebutter MCP Server

A Model Context Protocol (MCP) server that provides integration with the [Givebutter](https://givebutter.com) fundraising platform API. This allows AI assistants like Claude to interact with your Givebutter account to manage campaigns, contacts, transactions, and more.

## Features

- **Campaigns**: List, create, update, and delete fundraising campaigns
- **Contacts**: Manage donor contacts, tags, and activity history (including logging notes, calls and meetings)
- **Transactions**: List, record offline gifts, and update donation transactions
- **Campaign Members**: Manage peer-to-peer fundraising members
- **Campaign Teams**: View, manage, and delete fundraising teams
- **Campaign Tickets**: Create and manage event tickets per campaign
- **Discount Codes**: Create and manage campaign discount codes
- **Households**: Group contacts into households
- **Messages**: View sent messages
- **Webhooks**: Create and manage webhook subscriptions
- **Pledges**: View pledge commitments
- **Tickets**: Access event ticket information
- **Payouts**: View payout history
- **Plans**: Manage recurring donation plans
- **Funds**: Create, update, and delete fund designations

## API limitations

Two workflows that exist in the Givebutter dashboard are **not fully exposed by the public API**:

- **Cover images**: there is no `/media`, `/uploads`, or `/files` endpoint, so a file cannot be uploaded. A cover can only be set on `update_campaign`, by URL (`cover.source` of `upload`, `youtube`, `vimeo`, `twitch` or `facebook`); `create_campaign` does not accept one.
- **Campaign updates / posts**: the dashboard's "Updates" feature (which auto-emails sponsors) has no public API endpoint.

## Breaking change in 1.2.0

`create_campaign` and `update_campaign`: the parameter previously named `description` is now `campaign_description`. The Givebutter API field is still `description` over the wire — only the MCP-facing parameter name changed, to disambiguate from the MCP envelope's `description` and stop LLM consumers from putting metadata into the campaign body. Callers passing `description` will need to rename.

## Installation

```bash
git clone https://github.com/johnnylinsf/givebutter-mcp.git
cd givebutter-mcp
npm install
npm run build
```

## Configuration

### Get Your Givebutter API Key

1. Log in to your [Givebutter account](https://givebutter.com)
2. Go to **Settings** > **Developers** > **API Keys**
3. Generate a new API key or copy your existing one

### Configure with Claude Desktop

Add the following to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "givebutter": {
      "command": "node",
      "args": ["/path/to/givebutter-mcp/dist/index.js"],
      "env": {
        "GIVEBUTTER_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Configure with Claude Code

```bash
claude mcp add givebutter -e GIVEBUTTER_API_KEY=your-api-key -- node /path/to/givebutter-mcp/dist/index.js
```

## Available Tools (68)

### Campaigns

| Tool | Description |
|------|-------------|
| `list_campaigns` | List campaigns, optionally scoped to `benefiting`, `chapters` or `all` |
| `get_campaign` | Get details of a specific campaign |
| `create_campaign` | Create a new campaign (page body goes in `campaign_description`) |
| `update_campaign` | Partially update an existing campaign, including its cover |
| `delete_campaign` | Delete a campaign |

### Contacts

| Tool | Description |
|------|-------------|
| `list_contacts` | List contacts, filterable by name, email, type, tags, contribution totals and date ranges |
| `get_contact` | Get details of a specific contact |
| `create_contact` | Create a new contact |
| `update_contact` | Update an existing contact |
| `delete_contact` | Archive a contact (soft delete) |
| `restore_contact` | Restore an archived contact |

### Contact Activities

| Tool | Description |
|------|-------------|
| `list_contact_activities` | List activities for a contact, with optional type filter |
| `get_contact_activity` | Get details of a specific contact activity |
| `create_contact_activity` | Log a note, meeting, phone call, email, SMS, task or volunteer activity |
| `update_contact_activity` | Update an existing contact activity |
| `delete_contact_activity` | Delete a contact activity |

### Contact Tags

| Tool | Description |
|------|-------------|
| `add_contact_tags` | Add tags to a contact |
| `remove_contact_tags` | Remove tags from a contact |
| `sync_contact_tags` | Sync tags for a contact (replaces all existing tags) |

### Transactions

| Tool | Description |
|------|-------------|
| `list_transactions` | List transactions, filterable by contact, method, scope, and date ranges |
| `get_transaction` | Get details of a specific transaction |
| `create_transaction` | Record an offline or external gift (cash, check, stock, in-kind) |
| `update_transaction` | Update a transaction (notes, check info, fund, team, etc.) |

### Campaign Members

| Tool | Description |
|------|-------------|
| `list_campaign_members` | List all members of a campaign |
| `get_campaign_member` | Get details of a specific member |
| `delete_campaign_member` | Remove a member from a campaign |

### Campaign Teams

| Tool | Description |
|------|-------------|
| `list_campaign_teams` | List all teams in a campaign |
| `get_campaign_team` | Get details of a specific team |
| `delete_campaign_team` | Delete a team from a campaign |

### Campaign Tickets

| Tool | Description |
|------|-------------|
| `list_campaign_tickets` | List all tickets for a campaign |
| `get_campaign_ticket` | Get details of a specific campaign ticket |
| `create_campaign_ticket` | Create a new ticket for a campaign |

### Discount Codes

| Tool | Description |
|------|-------------|
| `list_discount_codes` | List all discount codes for a campaign |
| `get_discount_code` | Get details of a specific discount code |
| `create_discount_code` | Create a new discount code for a campaign |
| `update_discount_code` | Update an existing discount code |
| `delete_discount_code` | Delete a discount code |

### Households

| Tool | Description |
|------|-------------|
| `list_households` | List all households |
| `get_household` | Get details of a specific household |
| `create_household` | Create a new household |
| `update_household` | Update an existing household |
| `delete_household` | Delete a household |

### Household Contacts

| Tool | Description |
|------|-------------|
| `list_household_contacts` | List all contacts in a household |
| `get_household_contact` | Get a specific contact in a household |
| `add_household_contact` | Add a contact to a household |
| `remove_household_contact` | Remove a contact from a household |

### Messages

| Tool | Description |
|------|-------------|
| `list_messages` | List all messages |
| `get_message` | Get details of a specific message |

### Webhooks

| Tool | Description |
|------|-------------|
| `list_webhooks` | List all webhooks |
| `get_webhook` | Get details of a specific webhook |
| `create_webhook` | Create a new webhook |
| `update_webhook` | Update an existing webhook |
| `delete_webhook` | Delete a webhook |

### Webhook Activities

| Tool | Description |
|------|-------------|
| `list_webhook_activities` | List all activities for a webhook |
| `get_webhook_activity` | Get details of a specific webhook activity |

### Pledges

| Tool | Description |
|------|-------------|
| `list_pledges` | List all pledges |
| `get_pledge` | Get details of a specific pledge |

### Tickets

| Tool | Description |
|------|-------------|
| `list_tickets` | List all tickets with optional campaign filter |
| `get_ticket` | Get details of a specific ticket |

### Payouts

| Tool | Description |
|------|-------------|
| `list_payouts` | List all payouts |
| `get_payout` | Get details of a specific payout |

### Plans (Recurring Donations)

| Tool | Description |
|------|-------------|
| `list_plans` | List all recurring donation plans |
| `get_plan` | Get details of a specific plan |

### Funds

| Tool | Description |
|------|-------------|
| `list_funds` | List all funds/designations |
| `get_fund` | Get details of a specific fund |
| `create_fund` | Create a new fund/designation |
| `update_fund` | Update an existing fund/designation |
| `delete_fund` | Delete a fund/designation |

## Example Usage

Once configured, you can ask Claude questions like:

- "How many donors do we have for our end-of-year campaign?"
- "Show me the top donors this month"
- "List all our active campaigns"
- "What's the total raised for campaign ID 12345?"
- "Create a new campaign called 'Spring Fundraiser' with a goal of $10,000"
- "Show me the transaction details for donation #67890"
- "Add the tag 'major-donor' to contact #123"
- "Create a webhook for transaction.succeeded events"
- "List all households and their contacts"
- "Create a 20% discount code for our gala campaign"
- "Record a $500 check we received last Tuesday from Jane Doe"
- "Log a note on contact #123 that I met them at the gala"

## Notes on behavior

**Pagination.** List tools accept `page` and `per_page` (default 20, max 100). When more
pages remain, the response says so explicitly rather than leaving it buried in `meta`.

**Rate limits.** Givebutter allows 500 requests/minute. A `429` is retried automatically,
honoring `Retry-After`. A `5xx` is retried only for `GET` and `DELETE` — a failed `POST`
or `PUT` is never replayed, since the write may have landed before the response was lost.

**ID types.** Campaigns, contacts, households and pledges use integer IDs. Transactions,
funds, plans, tickets, payouts and webhooks use opaque **string** IDs (tid/fid/uid).

## Development

```bash
npm run build      # compile to dist/
npm test           # typecheck + run the test suite (no network required)
npm run typecheck  # types only
npm run smoke      # live API smoke test; needs GIVEBUTTER_API_KEY, creates and deletes real records
```

`tests/fixtures/expected-routes.ts` is a golden table of every tool's method and path.
Any change to routing shows up as a diff there, which is intentional: it makes an
accidental route change impossible to merge unnoticed. If you add or change a tool,
update that table in the same commit and the diff will document exactly what moved.

## API Documentation

For more information about the Givebutter API, see the [official API documentation](https://docs.givebutter.com/api-reference).

> The OpenAPI artifacts served alongside those docs (`api.json`, `givebutter-api.json`)
> are stale — they omit `/pledges`, narrow the webhook event enum, and list a wrong
> campaign-tickets path. This server is built against the rendered `/api-reference` pages.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

- For issues with this MCP server, please [open an issue](https://github.com/johnnylinsf/givebutter-mcp/issues)
- For Givebutter API questions, contact [Givebutter Support](https://givebutter.com/support)
