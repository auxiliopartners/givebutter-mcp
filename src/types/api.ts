// Response shapes for the Givebutter API.
//
// Hand-written on purpose. The published OpenAPI artifacts are stale in ways that would
// make generated types actively harmful: api.json omits /pledges entirely, narrows the
// webhook event enum below what the API accepts, and gives a wrong campaign-tickets
// path. A generated type that looks authoritative and is wrong costs more than no type.
//
// Two rules keep these honest:
//   1. Types never filter the payload. The client casts the raw response body, so fields
//      Givebutter adds later still reach the caller even though they are not declared.
//   2. Anything the docs do not guarantee is optional. Over-confident non-optional fields
//      under `strict` are how you get runtime reads of undefined.

export interface Envelope<T> {
  data: T;
}

export interface PageMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  from: number | null;
  to: number | null;
  total: number;
  path?: string;
  /** Present on the campaigns and transactions lists only. */
  unfiltered_total?: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PageMeta;
  links?: Record<string, string | null>;
}

export interface Campaign {
  id: number;
  code?: string;
  account_id?: number;
  type?: string;
  title?: string;
  subtitle?: string | null;
  description?: string | null;
  slug?: string;
  url?: string;
  goal?: number | null;
  raised?: number;
  donors?: number;
  currency?: string;
  status?: string;
  timezone?: string | null;
  end_at?: string | null;
  settings?: Array<{ name: string; value: unknown }>;
  created_at?: string;
  updated_at?: string;
}

export interface ContactEmail {
  type?: string | null;
  value: string;
}

export interface ContactPhone {
  type?: string | null;
  value: string;
}

export interface ContactAddress {
  address_1?: string | null;
  address_2?: string | null;
  city?: string | null;
  state?: string | null;
  zipcode?: string | null;
  country?: string | null;
  type?: string | null;
  is_primary?: boolean;
}

export interface Contact {
  id: number;
  external_id?: string | null;
  type?: string;
  prefix?: string | null;
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  suffix?: string | null;
  preferred_name?: string | null;
  primary_email?: string | null;
  primary_phone?: string | null;
  emails?: ContactEmail[];
  phones?: ContactPhone[];
  addresses?: ContactAddress[];
  primary_address?: ContactAddress | null;
  company_name?: string | null;
  tags?: string[];
  custom_fields?: Array<Record<string, unknown>>;
  stats?: { total_contributions?: number; recurring_contributions?: number };
  last_donation_amount?: number | null;
  is_email_subscribed?: boolean;
  is_phone_subscribed?: boolean;
  is_address_subscribed?: boolean;
  email_opt_in?: boolean;
  sms_opt_in?: boolean;
  archived_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Transaction {
  id: string;
  number?: string;
  amount?: number;
  fee?: number;
  donated?: number;
  campaign_id?: number | null;
  campaign_code?: string | null;
  contact_id?: number | null;
  fund_id?: number | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  status?: string;
  method?: string | null;
  payment_method?: string | null;
  is_offline?: boolean;
  currency?: string;
  refunded?: boolean;
  refunded_at?: string | null;
  check_number?: string | null;
  check_deposited_at?: string | null;
  internal_note?: string | null;
  plan_id?: string | null;
  pledge_id?: number | null;
  payout_id?: string | null;
  transacted_at?: string;
  created_at?: string;
  updated_at?: string;
  line_items?: Array<Record<string, unknown>>;
  custom_fields?: Array<Record<string, unknown>>;
  dedication?: Record<string, unknown> | null;
  giving_space?: Record<string, unknown> | null;
}

export interface Fund {
  id: number;
  code?: string | null;
  name?: string;
  raised?: number;
  supporters?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Plan {
  id: string;
  contact_id?: number | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  frequency?: string;
  status?: string;
  method?: string | null;
  amount?: number;
  fee_covered?: boolean;
  start_at?: string | null;
  canceled_at?: string | null;
  next_bill_date?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Pledge {
  id: number;
  contact_id?: number | null;
  campaign_id?: number | null;
  fund_id?: number | null;
  type?: string;
  status?: string;
  amount?: number;
  amount_fulfilled?: number;
  amount_remaining?: number;
  installment_frequency?: string | null;
  next_installment_date?: string | null;
  pledged_at?: string | null;
  canceled_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Ticket {
  id: string;
  id_suffix?: string;
  transaction_id?: string | null;
  name?: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  price?: number;
  retail_price?: number | null;
  checked_in_at?: string | null;
  pdf?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Payout {
  id: string;
  campaign_id?: number | null;
  method?: string;
  status?: string;
  amount?: number;
  fee?: number;
  tip?: number;
  payout?: number;
  currency?: string;
  expected_at?: string | null;
  paid_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Household {
  id: number;
  name?: string;
  head_contact_id?: number | null;
  account_id?: number;
  envelope_name?: string | null;
  note?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Webhook {
  id: string;
  name?: string | null;
  /** The shared secret used to verify delivery payloads. */
  signature?: string;
  events?: string[];
  enabled?: boolean;
  url?: string;
  last_status?: string | null;
  last_used_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface WebhookActivity {
  id: string;
  webhook_id?: string;
  status?: string;
  status_description?: string | null;
  event?: string;
  url?: string;
  payload?: unknown;
  response?: unknown;
  created_at?: string;
  updated_at?: string;
}

export interface ContactActivity {
  id: number;
  type?: string;
  source?: string | null;
  data?: unknown;
  resource?: unknown;
  resource_type?: string | null;
  created_by?: { id?: number; first_name?: string; last_name?: string; email?: string } | null;
  occurred_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Message {
  id: number;
  status?: string;
  channel?: string;
  internal_name?: string | null;
  subject?: string | null;
  body?: string | null;
  recipient_count?: number;
  sent_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CampaignMember {
  id: number;
  first_name?: string | null;
  last_name?: string | null;
  display_name?: string | null;
  email?: string | null;
  raised?: number;
  goal?: number | null;
  donors?: number;
  url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CampaignTeam {
  id: number;
  name?: string;
  slug?: string;
  url?: string;
  raised?: number;
  goal?: number | null;
  supporters?: number;
  members?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DiscountCode {
  id: number;
  campaign_id?: number;
  code?: string;
  type?: string;
  amount?: number;
  used?: number;
  uses?: number | null;
  active?: boolean;
  all_items?: boolean;
  starts_at?: string | null;
  expires_at?: string | null;
  created_at?: string;
  updated_at?: string;
}
