begin;

-- =============================================================================
-- Logo Vorlagen (Kostenlose Logos)
-- =============================================================================

create table if not exists public.logo_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  png_path text not null,
  svg_path text not null,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists logo_templates_title_idx on public.logo_templates (title);
create index if not exists logo_templates_is_active_idx on public.logo_templates (is_active);
create index if not exists logo_templates_created_at_idx on public.logo_templates (created_at desc);

-- Trigger for updated_at
drop trigger if exists logo_templates_set_updated_at on public.logo_templates;
create trigger logo_templates_set_updated_at
before update on public.logo_templates
for each row execute function public.set_updated_at();

-- RLS
alter table public.logo_templates enable row level security;

revoke all on table public.logo_templates from anon;

grant select on table public.logo_templates to anon;
grant select, insert, update, delete on table public.logo_templates to authenticated;

-- Admin manage
drop policy if exists "Admins manage logo_templates" on public.logo_templates;
create policy "Admins manage logo_templates"
on public.logo_templates
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Public can view active templates
create policy "Public can view active logo templates"
on public.logo_templates
for select
to anon, authenticated
using (is_active = true);

-- =============================================================================
-- Storage: logo-vorlagen bucket (manuell erstellen!)
-- =============================================================================
-- 1. Supabase Dashboard > Storage > New bucket "logo-vorlagen" (Public empfohlen)
-- 2. Policies (ähnlich wie portfolio-media):
--    - Public SELECT für bucket_id = 'logo-vorlagen'
--    - Admin INSERT/UPDATE/DELETE mit public.is_admin()
--
-- Nur für kostenlose Logo-Vorlagen.
-- =============================================================================

commit;