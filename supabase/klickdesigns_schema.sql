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

-- Upgrade for existing installations
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS customer_type text;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'interessent';

-- Constraints for customers
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
  service_type text not null,
  existing_material text,
  message text not null,
  status text not null default 'new',
  priority text not null default 'normal',
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint inquiries_service_type_check check (
    service_type in (
      'logo_sprint',
      'logo_vectorization',
      'design_finalization',
      'business_presence',
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
  entity_type text not null,
  entity_id uuid,
  action text not null,
  message text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

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
  customer_id uuid references public.customers(id) on delete set null,
  inquiry_id uuid references public.inquiries(id) on delete set null,
  title text not null,
  service_type text not null,
  amount_cents integer,
  status text not null default 'draft',
  valid_until date,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint offers_service_type_check check (
    service_type in (
      'logo_sprint',
      'logo_vectorization',
      'design_finalization',
      'business_presence',
      'other'
    )
  ),
  constraint offers_status_check check (
    status in ('draft', 'sent', 'accepted', 'rejected', 'expired')
  ),
  constraint offers_amount_cents_check check (
    amount_cents is null or amount_cents >= 0
  )
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  offer_id uuid references public.offers(id) on delete set null,
  title text not null,
  amount_cents integer not null,
  status text not null default 'draft',
  due_date date,
  paid_at timestamptz,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint invoices_status_check check (
    status in ('draft', 'sent', 'paid', 'overdue', 'cancelled')
  ),
  constraint invoices_amount_cents_check check (amount_cents >= 0)
);

-- =============================================================================
-- Indexes
-- =============================================================================

create index if not exists inquiries_status_idx
  on public.inquiries (status);

create index if not exists inquiries_service_type_idx
  on public.inquiries (service_type);

create index if not exists inquiries_created_at_idx
  on public.inquiries (created_at desc);

create index if not exists customers_email_idx
  on public.customers (email);

create index if not exists projects_status_idx
  on public.projects (status);

create index if not exists project_files_project_id_idx
  on public.project_files (project_id);

create index if not exists activity_logs_entity_idx
  on public.activity_logs (entity_type, entity_id);

create index if not exists offers_customer_id_idx
  on public.offers (customer_id);
create index if not exists offers_inquiry_id_idx
  on public.offers (inquiry_id);
create index if not exists offers_status_idx
  on public.offers (status);
create index if not exists offers_created_at_idx
  on public.offers (created_at desc);

create index if not exists invoices_customer_id_idx
  on public.invoices (customer_id);
create index if not exists invoices_offer_id_idx
  on public.invoices (offer_id);
create index if not exists invoices_status_idx
  on public.invoices (status);
create index if not exists invoices_created_at_idx
  on public.invoices (created_at desc);

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

drop trigger if exists invoices_set_updated_at on public.invoices;
create trigger invoices_set_updated_at
before update on public.invoices
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
alter table public.invoices enable row level security;

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
revoke all on table public.invoices from anon;

grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.customers to authenticated;
grant select, insert, update, delete on table public.inquiries to authenticated;
grant select, insert, update, delete on table public.projects to authenticated;
grant select, insert, update, delete on table public.project_files to authenticated;
grant select, insert, update, delete on table public.activity_logs to authenticated;
grant select, insert, update, delete on table public.service_packages to authenticated;
grant select, insert, update, delete on table public.offers to authenticated;
grant select, insert, update, delete on table public.invoices to authenticated;

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

drop policy if exists "Admins manage invoices" on public.invoices;
create policy "Admins manage invoices"
on public.invoices
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

commit;
