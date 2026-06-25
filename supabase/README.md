# Klickdesigns Supabase Overview

Internal overview for the Supabase schema in `supabase/klickdesigns_schema.sql`.

## Schema File

Use `klickdesigns_schema.sql` as the single source for the Klickdesigns database and storage setup.
It is written to be idempotent and can be re-run in the Supabase SQL editor.

The file ends with:

```sql
notify pgrst, 'reload schema';
```

This reloads the PostgREST schema cache after tables, columns, policies, and storage setup have changed.

## Tables

Core/admin tables:

- `profiles`
- `customers`
- `inquiries`
- `projects`
- `project_files`
- `activity_logs`
- `settings`
- `email_logs`

Acquisition/search:

- `acquisition_leads`
- `search_results`

Social media:

- `social_categories`
- `social_posts`
- `social_templates`

Portfolio/templates:

- `portfolio_references`
- `logo_templates`
- `leads`
- `lead_events`

Offers/invoices:

- `service_packages`
- `offers`
- `offer_items`
- `invoices`
- `invoice_items`

## Storage Buckets

- `portfolio-media`: public read, admin upload/update/delete. Used for intentionally published references.
- `logo-vorlagen`: public read, admin upload/update/delete. Used for free PNG/SVG logo template downloads.
- `inquiry-uploads`: private bucket. Anonymous upload is allowed for the public inquiry form; admins manage files and use signed URLs for access.
- `social-media`: private bucket. Admin-only media for internal social media planning.

## Access Model

Most admin tables are protected by RLS policies using `public.is_admin()`.

Public access is intentionally limited to:

- inserting website inquiries
- inserting lead magnet entries/events
- reading visible portfolio references
- reading active logo templates
- reading and accepting offers by public token
- reading public storage objects in `portfolio-media` and `logo-vorlagen`
- uploading inquiry files into `inquiry-uploads`

No admin UUID or email is hardcoded in the schema.
