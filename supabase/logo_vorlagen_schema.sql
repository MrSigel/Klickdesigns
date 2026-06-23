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
drop policy if exists "Public can view active logo templates" on public.logo_templates;
create policy "Public can view active logo templates"
on public.logo_templates
for select
to anon, authenticated
using (is_active = true);

-- =============================================================================
-- WICHTIG: Storage Bucket "logo-vorlagen" muss manuell erstellt werden!
-- =============================================================================
-- Ohne diesen Bucket schlägt der Upload fehl mit "png upload fehlgeschlagen" / "Bucket not found".
--
-- Schritte:
-- 1. Supabase Dashboard → Storage → "New bucket"
-- 2. Name: logo-vorlagen
-- 3. Public Bucket aktivieren (für direkte Downloads auf /logo-vorlagen)
-- 4. Create
--
-- 5. Policies anlegen (Bucket → Policies oder SQL Editor):
--
-- -- Öffentliches Lesen (für öffentliche Downloads)
-- CREATE POLICY "Public can read logo-vorlagen"
-- ON storage.objects FOR SELECT
-- TO anon, authenticated
-- USING (bucket_id = 'logo-vorlagen');
--
-- -- Nur Admins dürfen hochladen/ändern/löschen
-- CREATE POLICY "Admins upload to logo-vorlagen"
-- ON storage.objects FOR INSERT
-- TO authenticated
-- WITH CHECK (bucket_id = 'logo-vorlagen' AND public.is_admin());
--
-- CREATE POLICY "Admins manage logo-vorlagen"
-- ON storage.objects FOR UPDATE, DELETE
-- TO authenticated
-- USING (bucket_id = 'logo-vorlagen' AND public.is_admin());
--
-- Nur für kostenlose Logo-Vorlagen.
-- Service Role Key wird NIE im Client verwendet.
-- =============================================================================

commit;