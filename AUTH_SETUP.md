# Klickdesigns Auth Setup (Admin Login Foundation)

Dieses Setup bereitet die Supabase Auth Grundlage für den Adminbereich vor.
Es wird **kein** vollständiges Dashboard gebaut.

## Benötigte Environment-Variablen (in .env.local und Vercel)

NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=https://klickdesigns.de (oder localhost:3000)
SUPABASE_SERVICE_ROLE_KEY=...   (nur serverseitig)
ADMIN_EMAIL=admin@klickdesigns.de

Bereits vorhandene Variablen (SMTP, CRON) bleiben unverändert.

## Admin-User anlegen

1. Im Supabase Dashboard → Authentication → Users → "Add user" (manuell).
2. E-Mail: admin@klickdesigns.de
3. Passwort: (frei wählen, wird nur in Supabase gespeichert – **nicht** in Code oder ENV)
4. Bestätigen (Confirm user).

**Wichtig:** Das Passwort wird **nie** im Code, nie in Vercel ENV und nie in Dokumentation gespeichert.

## Profil mit Admin-Rolle anlegen (SQL)

Nach dem Anlegen des Users in Auth, führe in Supabase SQL Editor aus:

```sql
-- Admin-Profil anlegen / aktualisieren
INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'admin@klickdesigns.de'
ON CONFLICT (id) DO UPDATE SET role = 'admin', email = EXCLUDED.email;
```

Oder einfacher (wenn ID bekannt):

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@klickdesigns.de';
```

## Zugriff

- `/login` → Login mit E-Mail + Passwort (Supabase signInWithPassword)
- Erfolgreich → `/admin`
- `/admin` ist geschützt:
  - Kein User → Redirect zu `/login`
  - User aber keine Admin-Rolle (profiles.role = 'admin' **oder** email == ADMIN_EMAIL) → Logout + Redirect
- Logout → signOut + Redirect zu `/login`

## Technik

- `@supabase/ssr` für sichere Cookie-Sessions in Next.js App Router
- `lib/supabase/client.ts` (Browser)
- `lib/supabase/server.ts` (Server Components / Actions)
- Middleware für Redirects
- Serverseitige Prüfung in `/admin`

Keine Registrierung, kein Passwort-Reset, keine öffentliche Admin-Erstellung.

## Sicherheit

- Service Role Key niemals im Client-Code
- Keine Passwörter irgendwo
- Admin-Prüfung kombiniert Profile + ENV-Fallback
- Keine Kundendaten in öffentlichen Abfragen
