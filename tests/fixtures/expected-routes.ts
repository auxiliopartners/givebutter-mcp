// GOLDEN ROUTE TABLE — the drift guard for all 65 tools.
//
// Transcribed mechanically from the pre-refactor src/index.ts, so it pins BEHAVIOR
// THAT WAS ACTUALLY WORKING rather than anyone's memory of it. tests/routes.test.ts
// asserts the live registry deep-equals this table.
//
// Changing a route MUST show up as a diff here. That diff is the review artifact:
// a refactor PR should touch this file zero times, and a fix PR should touch it in
// exactly the ways its description claims.
//
// Columns: [tool name, HTTP method, path template, paginated]

export type ExpectedRoute = readonly [
  name: string,
  method: string,
  path: string,
  paginated: boolean,
];

export const EXPECTED_ROUTES: readonly ExpectedRoute[] = [
  ["list_campaigns"          , "GET"   , "/campaigns"                                              , true ],
  ["get_campaign"            , "GET"   , "/campaigns/:campaign_id"                                 , false],
  ["create_campaign"         , "POST"  , "/campaigns"                                              , false],
  ["update_campaign"         , "PATCH" , "/campaigns/:campaign_id"                                 , false],
  ["delete_campaign"         , "DELETE", "/campaigns/:campaign_id"                                 , false],
  ["list_contacts"           , "GET"   , "/contacts"                                               , true ],
  ["get_contact"             , "GET"   , "/contacts/:contact_id"                                   , false],
  ["create_contact"          , "POST"  , "/contacts"                                               , false],
  ["update_contact"          , "PATCH" , "/contacts/:contact_id"                                   , false],
  ["delete_contact"          , "DELETE", "/contacts/:contact_id"                                   , false],
  ["restore_contact"         , "PATCH" , "/contacts/:contact_id/restore"                           , false],
  ["list_contact_activities" , "GET"   , "/contacts/:contact_id/activities"                        , false],
  ["get_contact_activity"    , "GET"   , "/contacts/:contact_id/activities/:activity_id"           , false],
  ["delete_contact_activity" , "DELETE", "/contacts/:contact_id/activities/:activity_id"           , false],
  ["add_contact_tags"        , "POST"  , "/contacts/:contact_id/tags/add"                          , false],
  ["remove_contact_tags"     , "POST"  , "/contacts/:contact_id/tags/remove"                       , false],
  ["sync_contact_tags"       , "POST"  , "/contacts/:contact_id/tags/sync"                         , false],
  ["list_transactions"       , "GET"   , "/transactions"                                           , true ],
  ["get_transaction"         , "GET"   , "/transactions/:transaction_id"                           , false],
  ["update_transaction"      , "PUT"   , "/transactions/:transaction_id"                           , false],
  ["list_campaign_members"   , "GET"   , "/campaigns/:campaign_id/members"                         , true ],
  ["get_campaign_member"     , "GET"   , "/campaigns/:campaign_id/members/:member_id"              , false],
  ["delete_campaign_member"  , "DELETE", "/campaigns/:campaign_id/members/:member_id"              , false],
  ["list_campaign_teams"     , "GET"   , "/campaigns/:campaign_id/teams"                           , true ],
  ["get_campaign_team"       , "GET"   , "/campaigns/:campaign_id/teams/:team_id"                  , false],
  ["delete_campaign_team"    , "DELETE", "/campaigns/:campaign_id/teams/:team_id"                  , false],
  ["list_campaign_tickets"   , "GET"   , "/campaigns/:campaign_id/items/tickets"                   , true ],
  ["get_campaign_ticket"     , "GET"   , "/campaigns/:campaign_id/items/tickets/:ticket_id"        , false],
  ["create_campaign_ticket"  , "POST"  , "/campaigns/:campaign_id/items/tickets"                   , false],
  ["list_discount_codes"     , "GET"   , "/campaigns/:campaign_id/discount-codes"                  , true ],
  ["get_discount_code"       , "GET"   , "/campaigns/:campaign_id/discount-codes/:discount_code_id", false],
  ["create_discount_code"    , "POST"  , "/campaigns/:campaign_id/discount-codes"                  , false],
  ["update_discount_code"    , "PUT"   , "/campaigns/:campaign_id/discount-codes/:discount_code_id", false],
  ["delete_discount_code"    , "DELETE", "/campaigns/:campaign_id/discount-codes/:discount_code_id", false],
  ["list_households"         , "GET"   , "/households"                                             , true ],
  ["get_household"           , "GET"   , "/households/:household_id"                               , false],
  ["create_household"        , "POST"  , "/households"                                             , false],
  ["update_household"        , "PUT"   , "/households/:household_id"                               , false],
  ["delete_household"        , "DELETE", "/households/:household_id"                               , false],
  ["list_household_contacts" , "GET"   , "/households/:household_id/contacts"                      , true ],
  ["get_household_contact"   , "GET"   , "/households/:household_id/contacts/:contact_id"          , false],
  ["add_household_contact"   , "POST"  , "/households/:household_id/contacts"                      , false],
  ["remove_household_contact", "DELETE", "/households/:household_id/contacts/:contact_id"          , false],
  ["list_messages"           , "GET"   , "/messages"                                               , true ],
  ["get_message"             , "GET"   , "/messages/:message_id"                                   , false],
  ["list_webhooks"           , "GET"   , "/webhooks"                                               , true ],
  ["get_webhook"             , "GET"   , "/webhooks/:webhook_id"                                   , false],
  ["create_webhook"          , "POST"  , "/webhooks"                                               , false],
  ["update_webhook"          , "PUT"   , "/webhooks/:webhook_id"                                   , false],
  ["delete_webhook"          , "DELETE", "/webhooks/:webhook_id"                                   , false],
  ["list_webhook_activities" , "GET"   , "/webhooks/:webhook_id/activities"                        , true ],
  ["get_webhook_activity"    , "GET"   , "/webhooks/:webhook_id/activities/:activity_id"           , false],
  ["list_pledges"            , "GET"   , "/pledges"                                                , true ],
  ["get_pledge"              , "GET"   , "/pledges/:pledge_id"                                     , false],
  ["list_tickets"            , "GET"   , "/tickets"                                                , true ],
  ["get_ticket"              , "GET"   , "/tickets/:ticket_id"                                     , false],
  ["list_payouts"            , "GET"   , "/payouts"                                                , true ],
  ["get_payout"              , "GET"   , "/payouts/:payout_id"                                     , false],
  ["list_plans"              , "GET"   , "/plans"                                                  , true ],
  ["get_plan"                , "GET"   , "/plans/:plan_id"                                         , false],
  ["list_funds"              , "GET"   , "/funds"                                                  , true ],
  ["get_fund"                , "GET"   , "/funds/:fund_id"                                         , false],
  ["create_fund"             , "POST"  , "/funds"                                                  , false],
  ["update_fund"             , "PUT"   , "/funds/:fund_id"                                         , false],
  ["delete_fund"             , "DELETE", "/funds/:fund_id"                                         , false],
] as const;
