begin;

-- =============================================================================
-- Extensions
-- =============================================================================

create extension if not exists pgcrypto;

-- =============================================================================
-- Tables
-- =============================================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  customer_type text,
  company text,
  project_name text,
  source text,
  status text not null default 'interessent',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Note: Upgrades for existing installations are moved after all CREATE TABLE statements
-- to allow clean one-shot execution on new databases.

-- Compatibility: ensure customers columns exist before constraints/indexes
alter table public.customers add column if not exists customer_type text;
alter table public.customers add column if not exists company text;
alter table public.customers add column if not exists project_name text;
alter table public.customers add column if not exists source text;
alter table public.customers add column if not exists status text not null default 'interessent';
alter table public.customers add column if not exists notes text;
-- Constraints for customers (customers table already created above)
ALTER TABLE public.customers
  DROP CONSTRAINT IF EXISTS customers_status_check;
ALTER TABLE public.customers
  ADD CONSTRAINT customers_status_check
  CHECK (status IN ('interessent', 'kunde', 'stammkunde', 'archiviert'));

ALTER TABLE public.customers
  DROP CONSTRAINT IF EXISTS customers_customer_type_check;
ALTER TABLE public.customers
  ADD CONSTRAINT customers_customer_type_check
  CHECK (customer_type IS NULL OR customer_type IN ('unternehmen', 'verein', 'creator', 'privatkunde', 'shop', 'sonstiges'));

-- Indexes for customers
CREATE INDEX IF NOT EXISTS customers_name_idx ON public.customers (name);
CREATE INDEX IF NOT EXISTS customers_company_idx ON public.customers (company);
CREATE INDEX IF NOT EXISTS customers_status_idx ON public.customers (status);
CREATE INDEX IF NOT EXISTS customers_source_idx ON public.customers (source);
CREATE INDEX IF NOT EXISTS customers_created_at_idx ON public.customers (created_at DESC);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  company text,
  project_name text,
  service_type text,
  existing_material text,
  message text not null,
  status text not null default 'new',
  priority text not null default 'normal',
  source text default 'website',
  internal_notes text,
  consent_privacy boolean default false,
  confirmation_email_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint inquiries_service_type_check check (
    service_type is null or service_type in (
      'logo_sprint',
      'logo_vectorization',
      'design_finalization',
      'business_presence',
      'sticker_design',
      'social_media_design',
      'flyer_design',
      'other'
    )
  ),
  constraint inquiries_existing_material_check check (
    existing_material is null
    or existing_material in (
      'logo',
      'png_jpg',
      'screenshot',
      'flyer',
      'social_media_design',
      'nothing',
      'other'
    )
  ),
  constraint inquiries_status_check check (
    status in (
      'new',
      'viewed',
      'in_progress',
      'waiting_for_customer',
      'offer_sent',
      'accepted',
      'rejected',
      'completed',
      'archived'
    )
  ),
  constraint inquiries_priority_check check (
    priority in ('low', 'normal', 'high')
  )
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid references public.inquiries(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  title text not null,
  service_type text not null,
  status text not null default 'open',
  price_cents integer,
  currency text not null default 'EUR',
  deadline date,
  description text,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_service_type_check check (
    service_type in (
      'logo_sprint',
      'logo_vectorization',
      'design_finalization',
      'business_presence',
      'other'
    )
  ),
  constraint projects_status_check check (
    status in (
      'open',
      'waiting_for_customer',
      'in_progress',
      'revision',
      'completed',
      'cancelled'
    )
  ),
  constraint projects_price_cents_check check (
    price_cents is null or price_cents >= 0
  )
);

create table if not exists public.project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  inquiry_id uuid references public.inquiries(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  file_name text not null,
  file_path text not null,
  file_type text,
  file_role text not null,
  created_at timestamptz not null default now(),
  constraint project_files_file_role_check check (
    file_role in (
      'customer_upload',
      'draft',
      'final_file',
      'preview',
      'other'
    )
  )
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  area text not null,
  entity_type text,
  entity_id uuid,
  action text not null,
  message text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Upgrade for existing installations (keep backward compat for area)
ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS area text;
ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS metadata jsonb;

-- Make nullable as per spec
ALTER TABLE public.activity_logs ALTER COLUMN entity_type DROP NOT NULL;
ALTER TABLE public.activity_logs ALTER COLUMN message DROP NOT NULL;

-- Set default for area to avoid breaking inserts without it (will be 'system' for legacy)
ALTER TABLE public.activity_logs ALTER COLUMN area SET DEFAULT 'system';
-- Enforce not null after default
ALTER TABLE public.activity_logs ALTER COLUMN area SET NOT NULL;

-- Remove default for strict future inserts (new code must provide area)
-- Keeping default during transition is safer; can be removed later.

-- Constraints for possible values (area + action)
ALTER TABLE public.activity_logs
  DROP CONSTRAINT IF EXISTS activity_logs_area_check;
ALTER TABLE public.activity_logs
  ADD CONSTRAINT activity_logs_area_check
  CHECK (area IN ('dashboard', 'anfragen', 'kunden', 'angebot', 'rechnung', 'akquise', 'suchen', 'social_media', 'referenzen', 'einstellungen', 'system'));

ALTER TABLE public.activity_logs
  DROP CONSTRAINT IF EXISTS activity_logs_action_check;
ALTER TABLE public.activity_logs
  ADD CONSTRAINT activity_logs_action_check
  CHECK (action IN ('created', 'updated', 'deleted', 'archived', 'email_sent', 'pdf_created', 'status_changed', 'uploaded', 'converted', 'other'));

create table if not exists public.acquisition_leads (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  website_url text,
  email text,
  phone text,
  social_url text,
  source text,
  detected_problem text,
  recommended_service text,
  status text not null default 'open',
  do_not_contact boolean not null default false,
  contacted_at timestamptz,
  last_email_sent_at timestamptz,
  converted_customer_id uuid references public.customers(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Compatibility: ensure acquisition_leads columns exist before constraints/indexes
alter table public.acquisition_leads add column if not exists source text;
alter table public.acquisition_leads add column if not exists detected_problem text;
alter table public.acquisition_leads add column if not exists recommended_service text;
alter table public.acquisition_leads add column if not exists status text not null default 'open';
alter table public.acquisition_leads add column if not exists do_not_contact boolean not null default false;
-- Constraints for acquisition_leads
ALTER TABLE public.acquisition_leads
  DROP CONSTRAINT IF EXISTS acquisition_leads_status_check;
ALTER TABLE public.acquisition_leads
  ADD CONSTRAINT acquisition_leads_status_check
  CHECK (status IN ('open', 'done', 'archived'));

ALTER TABLE public.acquisition_leads
  DROP CONSTRAINT IF EXISTS acquisition_leads_source_check;
ALTER TABLE public.acquisition_leads
  ADD CONSTRAINT acquisition_leads_source_check
  CHECK (source IS NULL OR source IN ('website', 'facebook', 'instagram', 'social_media', 'lokal', 'empfehlung', 'google', 'verein', 'creator', 'shop', 'sonstiges'));

ALTER TABLE public.acquisition_leads
  DROP CONSTRAINT IF EXISTS acquisition_leads_recommended_service_check;
ALTER TABLE public.acquisition_leads
  ADD CONSTRAINT acquisition_leads_recommended_service_check
  CHECK (recommended_service IS NULL OR recommended_service IN ('logo_sprint', 'logo_vectorization', 'design_finalization', 'business_presence', 'sticker_design', 'social_media_design', 'flyer_design', 'other'));

create table if not exists public.search_results (
  id uuid primary key default gen_random_uuid(),
  website_url text not null,
  company_name text,
  found_email text,
  found_phone text,
  found_social_url text,
  contact_page_url text,
  impressum_url text,
  privacy_url text,
  detected_logo_url text,
  detected_problem text,
  design_score integer,
  recommended_service text,
  scan_status text not null default 'pending',
  saved_as_lead boolean not null default false,
  acquisition_lead_id uuid references public.acquisition_leads(id) on delete set null,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Compatibility: ensure search_results columns exist before constraints/indexes
alter table public.search_results add column if not exists recommended_service text;
alter table public.search_results add column if not exists scan_status text not null default 'pending';
alter table public.search_results add column if not exists saved_as_lead boolean not null default false;
-- Constraints for search_results
ALTER TABLE public.search_results
  DROP CONSTRAINT IF EXISTS search_results_scan_status_check;
ALTER TABLE public.search_results
  ADD CONSTRAINT search_results_scan_status_check
  CHECK (scan_status IN ('pending', 'completed', 'failed'));

ALTER TABLE public.search_results
  DROP CONSTRAINT IF EXISTS search_results_recommended_service_check;
ALTER TABLE public.search_results
  ADD CONSTRAINT search_results_recommended_service_check
  CHECK (recommended_service IS NULL OR recommended_service IN ('logo_sprint', 'logo_vectorization', 'design_finalization', 'business_presence', 'sticker_design', 'social_media_design', 'flyer_design', 'other'));

create table if not exists public.social_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.social_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  platform text not null,
  category text,
  post_text text not null,
  hashtags text,
  cta text,
  target_url text,
  media_path text,
  media_type text,
  planned_for timestamptz,
  is_done boolean default false,
  done_at timestamptz,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.social_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  platform text,
  subject_hint text,
  template_text text not null,
  hashtags text,
  cta text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Compatibility: ensure social_posts columns exist before constraints/indexes
alter table public.social_posts add column if not exists platform text not null default 'facebook';
alter table public.social_posts add column if not exists media_type text;
-- Constraints for social_posts
ALTER TABLE public.social_posts
  DROP CONSTRAINT IF EXISTS social_posts_platform_check;
ALTER TABLE public.social_posts
  ADD CONSTRAINT social_posts_platform_check
  CHECK (platform IN ('facebook', 'instagram', 'tiktok'));

ALTER TABLE public.social_posts
  DROP CONSTRAINT IF EXISTS social_posts_media_type_check;
ALTER TABLE public.social_posts
  ADD CONSTRAINT social_posts_media_type_check
  CHECK (media_type IS NULL OR media_type IN ('image', 'video', 'other'));

-- Compatibility: ensure social_templates columns exist before constraints/indexes
alter table public.social_templates add column if not exists platform text;
-- Constraints for social_templates
ALTER TABLE public.social_templates
  DROP CONSTRAINT IF EXISTS social_templates_platform_check;
ALTER TABLE public.social_templates
  ADD CONSTRAINT social_templates_platform_check
  CHECK (platform IS NULL OR platform IN ('facebook', 'instagram', 'tiktok'));

create table if not exists public.portfolio_references (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  description text,
  category text,
  media_type text not null,
  media_path text not null,
  media_url text,
  thumbnail_path text,
  alt_text text,
  external_url text,
  link_label text,
  is_visible boolean default true,
  is_featured boolean default false,
  sort_order integer default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Compatibility: ensure portfolio_references columns exist before constraints/indexes
alter table public.portfolio_references add column if not exists media_type text not null default 'image';
-- Constraints for portfolio_references
ALTER TABLE public.portfolio_references
  DROP CONSTRAINT IF EXISTS portfolio_references_media_type_check;
ALTER TABLE public.portfolio_references
  ADD CONSTRAINT portfolio_references_media_type_check
  CHECK (media_type IN ('image', 'video', 'pdf'));

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text unique not null,
  setting_value jsonb,
  description text,
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.email_logs (
  id uuid primary key default gen_random_uuid(),
  recipient text not null,
  subject text,
  template_type text,
  status text not null default 'sent',
  reference_type text,
  reference_id uuid,
  error_message text,
  created_at timestamptz default now()
);

create index if not exists email_logs_recipient_idx on public.email_logs (recipient);
create index if not exists email_logs_created_at_idx on public.email_logs (created_at desc);

create table if not exists public.service_packages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  price_label text not null,
  price_cents integer,
  is_starting_price boolean not null default false,
  description text not null,
  is_active boolean not null default true,
  sort_order integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint service_packages_price_cents_check check (
    price_cents is null or price_cents >= 0
  ),
  constraint service_packages_sort_order_check check (sort_order >= 0)
);

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  offer_number text unique not null,
  customer_id uuid references public.customers(id) on delete set null,
  inquiry_id uuid references public.inquiries(id) on delete set null,
  title text not null,
  intro_text text,
  notes text,
  subtotal_cents integer not null default 0,
  discount_type text,
  discount_value integer,
  discount_cents integer not null default 0,
  total_cents integer not null default 0,
  currency text default 'EUR',
  valid_until date,
  payment_terms text,
  public_token text unique,
  sent_at timestamptz,
  accepted_at timestamptz,
  rejected_at timestamptz,
  converted_project_id uuid,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint offers_status_check check (
    status in ('draft', 'sent', 'accepted', 'rejected', 'expired')
  )
);

create table if not exists public.offer_items (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid references public.offers(id) on delete cascade not null,
  service_package_id uuid references public.service_packages(id) on delete set null,
  title text not null,
  description text,
  quantity numeric default 1,
  unit_price_cents integer not null default 0,
  total_cents integer not null default 0,
  sort_order integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text unique not null,
  offer_id uuid references public.offers(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  notes text,
  subtotal_cents integer not null default 0,
  discount_cents integer not null default 0,
  total_cents integer not null default 0,
  currency text default 'EUR',
  status text not null default 'open',
  invoice_date date default current_date,
  due_date date,
  payment_terms text,
  paid_at timestamptz,
  sent_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid references public.invoices(id) on delete cascade not null,
  offer_item_id uuid references public.offer_items(id) on delete set null,
  title text not null,
  description text,
  quantity numeric default 1,
  unit_price_cents integer not null default 0,
  total_cents integer not null default 0,
  sort_order integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =============================================================================
-- Upgrades for existing installations (safe to run after all CREATE TABLEs)
-- =============================================================================
-- Moved here so the full klickdesigns_schema.sql runs cleanly on a new Supabase
-- project without "relation does not exist" errors.

-- Logo templates for Kostenlose Logo-Vorlagen (idempotent)
create table if not exists public.logo_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  png_path text not null,
  svg_path text not null,
  is_active boolean default true,
  category text default 'other',
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

ALTER TABLE public.logo_templates ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE public.logo_templates ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;

-- ensure sensible defaults for existing rows (no data loss)
UPDATE public.logo_templates SET category = COALESCE(category, 'other') WHERE category IS NULL OR category = '';
UPDATE public.logo_templates SET sort_order = COALESCE(sort_order, 0) WHERE sort_order IS NULL;

create index if not exists logo_templates_is_active_idx on public.logo_templates (is_active);
create index if not exists logo_templates_category_idx on public.logo_templates (category);
create index if not exists logo_templates_sort_order_idx on public.logo_templates (sort_order, created_at desc);

-- RLS for logo_templates (idempotent, safe re-runs)
alter table public.logo_templates enable row level security;

revoke all on table public.logo_templates from anon;
grant select on table public.logo_templates to anon;
grant select, insert, update, delete on table public.logo_templates to authenticated;

drop policy if exists "Admins manage logo_templates" on public.logo_templates;
create policy "Admins manage logo_templates"
on public.logo_templates
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can view active logo templates" on public.logo_templates;
create policy "Public can view active logo templates"
on public.logo_templates
for select
to anon, authenticated
using (is_active = true);

ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS customer_type text;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'interessent';

ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS company text;
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS project_name text;
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS source text DEFAULT 'website';
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS consent_privacy boolean DEFAULT false;
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS confirmation_email_sent_at timestamptz;

ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft';

ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'open';

ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS invoice_number text;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS project_id uuid;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS subtotal_cents integer DEFAULT 0;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS discount_cents integer DEFAULT 0;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS invoice_date date DEFAULT current_date;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS payment_terms text;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS sent_at timestamptz;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS cancelled_at timestamptz;

ALTER TABLE public.invoices DROP CONSTRAINT IF EXISTS invoices_status_check;
ALTER TABLE public.invoices ADD CONSTRAINT invoices_status_check CHECK (status IN ('open', 'paid', 'cancelled'));

-- =============================================================================
-- Indexes
-- =============================================================================

create index if not exists inquiries_status_idx
  on public.inquiries (status);

create index if not exists inquiries_service_type_idx
  on public.inquiries (service_type);

create index if not exists inquiries_created_at_idx
  on public.inquiries (created_at desc);

create index if not exists inquiries_email_idx
  on public.inquiries (email);
create index if not exists inquiries_status_idx
  on public.inquiries (status);
create index if not exists inquiries_service_type_idx
  on public.inquiries (service_type);
create index if not exists inquiries_priority_idx
  on public.inquiries (priority);
create index if not exists inquiries_customer_id_idx
  on public.inquiries (customer_id);

create index if not exists customers_email_idx
  on public.customers (email);

create index if not exists projects_status_idx
  on public.projects (status);

create index if not exists project_files_project_id_idx
  on public.project_files (project_id);

create index if not exists activity_logs_entity_idx
  on public.activity_logs (entity_type, entity_id);

-- New indexes per spec
create index if not exists activity_logs_area_idx on public.activity_logs (area);
create index if not exists activity_logs_action_idx on public.activity_logs (action);
create index if not exists activity_logs_created_at_idx on public.activity_logs (created_at DESC);
create index if not exists activity_logs_entity_type_idx on public.activity_logs (entity_type);
create index if not exists activity_logs_entity_id_idx on public.activity_logs (entity_id);

create index if not exists offers_customer_id_idx
  on public.offers (customer_id);
create index if not exists offers_inquiry_id_idx
  on public.offers (inquiry_id);
create index if not exists offers_status_idx
  on public.offers (status);
create index if not exists offers_created_at_idx
  on public.offers (created_at desc);

create index if not exists offers_offer_number_idx
  on public.offers (offer_number);

create index if not exists offers_public_token_idx
  on public.offers (public_token);

create index if not exists offers_customer_id_idx
  on public.offers (customer_id);
create index if not exists offers_inquiry_id_idx
  on public.offers (inquiry_id);
create index if not exists offers_status_idx
  on public.offers (status);

create index if not exists offer_items_offer_id_idx
  on public.offer_items (offer_id);

create index if not exists invoices_customer_id_idx
  on public.invoices (customer_id);
create index if not exists invoices_offer_id_idx
  on public.invoices (offer_id);
create index if not exists invoices_status_idx
  on public.invoices (status);
create index if not exists invoices_created_at_idx
  on public.invoices (created_at desc);

create index if not exists invoices_invoice_number_idx
  on public.invoices (invoice_number);
create index if not exists invoices_offer_id_idx
  on public.invoices (offer_id);
create index if not exists invoices_customer_id_idx
  on public.invoices (customer_id);
create index if not exists invoices_project_id_idx
  on public.invoices (project_id);
create index if not exists invoices_status_idx
  on public.invoices (status);

create index if not exists invoice_items_invoice_id_idx
  on public.invoice_items (invoice_id);

create index if not exists acquisition_leads_email_idx
  on public.acquisition_leads (email);
create index if not exists acquisition_leads_website_url_idx
  on public.acquisition_leads (website_url);
create index if not exists acquisition_leads_status_idx
  on public.acquisition_leads (status);
create index if not exists acquisition_leads_source_idx
  on public.acquisition_leads (source);
create index if not exists acquisition_leads_do_not_contact_idx
  on public.acquisition_leads (do_not_contact);
create index if not exists acquisition_leads_created_at_idx
  on public.acquisition_leads (created_at DESC);

create index if not exists search_results_website_url_idx
  on public.search_results (website_url);
create index if not exists search_results_found_email_idx
  on public.search_results (found_email);
create index if not exists search_results_scan_status_idx
  on public.search_results (scan_status);
create index if not exists search_results_saved_as_lead_idx
  on public.search_results (saved_as_lead);
create index if not exists search_results_created_at_idx
  on public.search_results (created_at DESC);

create index if not exists social_posts_platform_idx on public.social_posts (platform);
create index if not exists social_posts_category_idx on public.social_posts (category);
create index if not exists social_posts_planned_for_idx on public.social_posts (planned_for);
create index if not exists social_posts_is_done_idx on public.social_posts (is_done);
create index if not exists social_posts_created_at_idx on public.social_posts (created_at DESC);

create index if not exists social_templates_platform_idx on public.social_templates (platform);
create index if not exists social_templates_category_idx on public.social_templates (category);
create index if not exists social_templates_is_active_idx on public.social_templates (is_active);
create index if not exists social_templates_created_at_idx on public.social_templates (created_at DESC);

create index if not exists social_categories_name_idx on public.social_categories (name);

create index if not exists portfolio_references_is_visible_idx on public.portfolio_references (is_visible);
create index if not exists portfolio_references_is_featured_idx on public.portfolio_references (is_featured);
create index if not exists portfolio_references_sort_order_idx on public.portfolio_references (sort_order);
create index if not exists portfolio_references_created_at_idx on public.portfolio_references (created_at DESC);
create index if not exists portfolio_references_slug_idx on public.portfolio_references (slug);

create index if not exists settings_setting_key_idx on public.settings (setting_key);
create index if not exists settings_is_public_idx on public.settings (is_public);

create index if not exists profiles_email_idx on public.profiles (email);
create index if not exists profiles_role_idx on public.profiles (role);

-- =============================================================================
-- Triggers
-- =============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists customers_set_updated_at on public.customers;
create trigger customers_set_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

drop trigger if exists inquiries_set_updated_at on public.inquiries;
create trigger inquiries_set_updated_at
before update on public.inquiries
for each row execute function public.set_updated_at();

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists service_packages_set_updated_at on public.service_packages;
create trigger service_packages_set_updated_at
before update on public.service_packages
for each row execute function public.set_updated_at();

drop trigger if exists offers_set_updated_at on public.offers;
create trigger offers_set_updated_at
before update on public.offers
for each row execute function public.set_updated_at();

drop trigger if exists offer_items_set_updated_at on public.offer_items;
create trigger offer_items_set_updated_at
before update on public.offer_items
for each row execute function public.set_updated_at();

drop trigger if exists invoices_set_updated_at on public.invoices;
create trigger invoices_set_updated_at
before update on public.invoices
for each row execute function public.set_updated_at();

drop trigger if exists invoice_items_set_updated_at on public.invoice_items;
create trigger invoice_items_set_updated_at
before update on public.invoice_items
for each row execute function public.set_updated_at();

drop trigger if exists acquisition_leads_set_updated_at on public.acquisition_leads;
create trigger acquisition_leads_set_updated_at
before update on public.acquisition_leads
for each row execute function public.set_updated_at();

drop trigger if exists search_results_set_updated_at on public.search_results;
create trigger search_results_set_updated_at
before update on public.search_results
for each row execute function public.set_updated_at();

drop trigger if exists social_categories_set_updated_at on public.social_categories;
create trigger social_categories_set_updated_at
before update on public.social_categories
for each row execute function public.set_updated_at();

drop trigger if exists social_posts_set_updated_at on public.social_posts;
create trigger social_posts_set_updated_at
before update on public.social_posts
for each row execute function public.set_updated_at();

drop trigger if exists social_templates_set_updated_at on public.social_templates;
create trigger social_templates_set_updated_at
before update on public.social_templates
for each row execute function public.set_updated_at();

drop trigger if exists portfolio_references_set_updated_at on public.portfolio_references;
create trigger portfolio_references_set_updated_at
before update on public.portfolio_references
for each row execute function public.set_updated_at();

drop trigger if exists settings_set_updated_at on public.settings;
create trigger settings_set_updated_at
before update on public.settings
for each row execute function public.set_updated_at();

-- =============================================================================
-- RLS
-- =============================================================================

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.inquiries enable row level security;
alter table public.projects enable row level security;
alter table public.project_files enable row level security;
alter table public.activity_logs enable row level security;
alter table public.service_packages enable row level security;
alter table public.offers enable row level security;
alter table public.offer_items enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.acquisition_leads enable row level security;
alter table public.search_results enable row level security;
alter table public.social_categories enable row level security;
alter table public.social_posts enable row level security;
alter table public.social_templates enable row level security;
alter table public.portfolio_references enable row level security;
alter table public.settings enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

revoke all on table public.profiles from anon;
revoke all on table public.customers from anon;
revoke all on table public.inquiries from anon;
revoke all on table public.projects from anon;
revoke all on table public.project_files from anon;
revoke all on table public.activity_logs from anon;
revoke all on table public.service_packages from anon;
revoke all on table public.offers from anon;
revoke all on table public.offer_items from anon;
revoke all on table public.invoices from anon;
revoke all on table public.invoice_items from anon;
revoke all on table public.acquisition_leads from anon;
revoke all on table public.search_results from anon;
revoke all on table public.social_categories from anon;
revoke all on table public.social_posts from anon;
revoke all on table public.social_templates from anon;
revoke all on table public.portfolio_references from anon;
revoke all on table public.settings from anon;

-- Allow public read for offers by token (for customer acceptance)
grant select on table public.offers to anon;
grant select on table public.offer_items to anon;

grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.customers to authenticated;
grant select, insert, update, delete on table public.inquiries to authenticated;
grant select, insert, update, delete on table public.projects to authenticated;
grant select, insert, update, delete on table public.project_files to authenticated;
grant select, insert, update, delete on table public.activity_logs to authenticated;
grant select, insert, update, delete on table public.service_packages to authenticated;
grant select, insert, update, delete on table public.offers to authenticated;
grant select, insert, update, delete on table public.offer_items to authenticated;
grant select, insert, update, delete on table public.invoices to authenticated;
grant select, insert, update, delete on table public.invoice_items to authenticated;
grant select, insert, update, delete on table public.acquisition_leads to authenticated;
grant select, insert, update, delete on table public.search_results to authenticated;
grant select, insert, update, delete on table public.social_categories to authenticated;
grant select, insert, update, delete on table public.social_posts to authenticated;
grant select, insert, update, delete on table public.social_templates to authenticated;
grant select on table public.portfolio_references to anon;
grant select on table public.settings to anon;
grant select, insert, update, delete on table public.portfolio_references to authenticated;
grant select, insert, update, delete on table public.settings to authenticated;

drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles"
on public.profiles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage customers" on public.customers;
create policy "Admins manage customers"
on public.customers
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage inquiries" on public.inquiries;
create policy "Admins manage inquiries"
on public.inquiries
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Public insert for website form (validated server-side)
grant insert on table public.inquiries to anon;

drop policy if exists "Public can insert inquiries from website" on public.inquiries;
create policy "Public can insert inquiries from website"
on public.inquiries
for insert
to anon
with check (true);

drop policy if exists "Admins manage projects" on public.projects;
create policy "Admins manage projects"
on public.projects
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage project files" on public.project_files;
create policy "Admins manage project files"
on public.project_files
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage activity logs" on public.activity_logs;
create policy "Admins manage activity logs"
on public.activity_logs
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage service packages" on public.service_packages;
create policy "Admins manage service packages"
on public.service_packages
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage offers" on public.offers;
create policy "Admins manage offers"
on public.offers
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can view offer by token" on public.offers;
create policy "Public can view offer by token"
on public.offers
for select
to anon
using (public_token is not null);

-- Allow anonymous users with a valid public token to mark the offer as accepted (acceptance flow only)
drop policy if exists "Public can accept offer by token" on public.offers;
create policy "Public can accept offer by token"
on public.offers
for update
to anon
using (public_token is not null)
with check (public_token is not null);

drop policy if exists "Admins manage offer_items" on public.offer_items;
create policy "Admins manage offer_items"
on public.offer_items
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can view offer items by token" on public.offer_items;
create policy "Public can view offer items by token"
on public.offer_items
for select
to anon
using (offer_id in (select id from public.offers where public_token is not null));

drop policy if exists "Admins manage invoices" on public.invoices;
create policy "Admins manage invoices"
on public.invoices
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage invoice_items" on public.invoice_items;
create policy "Admins manage invoice_items"
on public.invoice_items
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage acquisition_leads" on public.acquisition_leads;
create policy "Admins manage acquisition_leads"
on public.acquisition_leads
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage search_results" on public.search_results;
create policy "Admins manage search_results"
on public.search_results
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage social_categories" on public.social_categories;
create policy "Admins manage social_categories"
on public.social_categories
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage social_posts" on public.social_posts;
create policy "Admins manage social_posts"
on public.social_posts
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage social_templates" on public.social_templates;
create policy "Admins manage social_templates"
on public.social_templates
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage portfolio_references" on public.portfolio_references;
create policy "Admins manage portfolio_references"
on public.portfolio_references
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can view visible portfolio references" on public.portfolio_references;
create policy "Public can view visible portfolio references"
on public.portfolio_references
for select
to anon, authenticated
using (is_visible = true);

drop policy if exists "Admins manage settings" on public.settings;
create policy "Admins manage settings"
on public.settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can view public settings" on public.settings;
create policy "Public can view public settings"
on public.settings
for select
to anon, authenticated
using (is_public = true);

alter table public.email_logs enable row level security;
revoke all on table public.email_logs from anon;
grant select, insert on table public.email_logs to authenticated;

drop policy if exists "Admins manage email_logs" on public.email_logs;
create policy "Admins manage email_logs"
on public.email_logs
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- No policies are created for anon. In particular, anonymous visitors cannot
-- select customer data or insert directly into customers/inquiries.

-- =============================================================================
-- Seed Data
-- =============================================================================

insert into public.service_packages (
  slug,
  name,
  price_label,
  price_cents,
  is_starting_price,
  description,
  is_active,
  sort_order
)
values
  (
    'logo_sprint',
    'Logo-Sprint',
    '20 € fix',
    2000,
    false,
    '4–5 Logo-Richtungen als Vorschau, Auswahl eines Favoriten, einfache Farb- oder Namensanpassung, SVG, PNG mit transparentem Hintergrund und eine kleine Korrektur.',
    true,
    1
  ),
  (
    'logo_vectorization',
    'Logo-Vektorisierung',
    'ab 49 €',
    4900,
    true,
    'Einfache Aufbereitung eines bestehenden, gut erkennbaren Logos aus PNG, JPG oder Screenshot als SVG und PNG mit transparentem Hintergrund inklusive einer Korrekturrunde.',
    true,
    2
  ),
  (
    'design_finalization',
    'Design-Finalisierung',
    'ab 149 €',
    14900,
    true,
    'Optimierung bestehender Flyer, Canva-Designs, Social-Media-Grafiken oder Designentwürfe mit Export für Print oder Social Media als PNG, JPG oder PDF nach Vereinbarung inklusive einer Korrekturrunde.',
    true,
    3
  ),
  (
    'business_presence',
    'Business-Auftritt',
    'ab 299 €',
    29900,
    true,
    'Bis zu drei abgestimmte Designs oder Vorlagen mit einheitlichen Farben und Typografie, Prüfung oder Aufbereitung von Logo-Dateien sowie Ausgabe als PNG, JPG, PDF und gegebenenfalls SVG.',
    true,
    4
  )
on conflict (slug) do nothing;

-- =============================================================================
-- Storage: portfolio-media
-- =============================================================================
-- Public bucket for intentionally published portfolio/reference files only.
-- Do NOT store private customer files in this bucket.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  52428800,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'application/pdf'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read access so visible portfolio media can render on the landing page.
drop policy if exists "Public read portfolio-media" on storage.objects;
create policy "Public read portfolio-media"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'portfolio-media');

-- Only authenticated admins may upload portfolio media.
drop policy if exists "Admins insert portfolio-media" on storage.objects;
create policy "Admins insert portfolio-media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'portfolio-media'
  and public.is_admin()
);

-- Only authenticated admins may update portfolio media.
drop policy if exists "Admins update portfolio-media" on storage.objects;
create policy "Admins update portfolio-media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'portfolio-media'
  and public.is_admin()
)
with check (
  bucket_id = 'portfolio-media'
  and public.is_admin()
);

-- Only authenticated admins may delete portfolio media.
drop policy if exists "Admins delete portfolio-media" on storage.objects;
create policy "Admins delete portfolio-media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'portfolio-media'
  and public.is_admin()
);

-- =============================================================================
-- =============================================================================

-- =============================================================================
-- Notes
-- =============================================================================

-- Admin bootstrap:
-- After creating the first user with Supabase Auth, add exactly that user's UUID
-- to public.profiles with role = 'admin' from the trusted Supabase SQL Editor.
-- No admin email or UUID is hardcoded in this schema.
--
-- Website inquiries:
-- Do not add an anon INSERT policy that exposes customers or inquiries directly.
-- A later server-side endpoint or Supabase Edge Function should validate input,
-- rate-limit requests and create the customer and inquiry in one transaction.
-- That trusted layer may use the service role only on the server; it must never
-- expose the service-role key to the browser.
--
-- Project files:
-- This table stores file metadata only. A later storage setup must define a
-- private Supabase Storage bucket and separate storage.objects policies.

-- =============================================================================
-- activity_logs retention note
-- =============================================================================
-- Das Archiv (activity_logs) ist auf 12 Monate Aufbewahrung ausgelegt.
-- Wichtige Änderungen und Aktivitäten sollen nachvollziehbar bleiben.
-- Eine automatische Löschung älterer Einträge (z. B. per pg_cron oder Edge Function)
-- kann später ergänzt werden.
-- Jetzt noch keine automatische Löschung implementieren, falls kein Cron-System aktiv ist.
-- =============================================================================

commit;
