Beachte die Projektanweisungen in AGENTS.md.

Du arbeitest am Projekt „Klickdesigns“.

Aufgabe:
Baue die Admin-Seite `/admin/akquise` vollständig und sauber aus.

Wichtig:
Dies ist nur die Seite „Akquise“.
Bearbeite keine anderen Admin-Seiten inhaltlich.
Bestehendes Admin-Layout und Sidebar nicht zerstören.
Die Seite muss direkt mit Supabase verbunden werden.

Ziel:
Die Akquise-Seite soll als Lead-Liste und Arbeitsliste für potenzielle Kunden dienen.
Der Nutzer soll Leads schnell sammeln, bewerten, kontaktieren und bei Interesse manuell in Kunden umwandeln können.

Wichtige Regeln:

* keine Fake-Daten
* keine Demo-Daten
* keine Beispiel-Leads
* keine Massenmail-Funktion bauen
* keine aggressive Scraping-Logik bauen
* keine Landingpage verändern
* keine rechtlichen Seiten verändern
* keine `.env.local` bearbeiten oder committen
* keine geheimen Daten ausgeben
* keine unnötigen Libraries installieren

Lies vorher:

* `AGENTS.md`
* `daten.md`, falls vorhanden

Keine sensiblen Daten aus `daten.md` ausgeben.
Keine geheimen Keys in Code schreiben.

────────────────────────

1. Supabase Schema
   ────────────────────────

Prüfe und ergänze ausschließlich:

`supabase/klickdesigns_schema.sql`

Wichtig:

* nur diese eine Schema-Datei bearbeiten
* keine Migration-Dateien erstellen
* keine weiteren SQL-Dateien erstellen
* keine Fake Seed-Daten einfügen
* Service Role Key niemals im Client verwenden

Benötigte Tabelle:

`acquisition_leads`

Felder:

* id uuid primary key default gen_random_uuid()
* company_name text not null
* website_url text nullable
* email text nullable
* phone text nullable
* social_url text nullable
* source text nullable
* detected_problem text nullable
* recommended_service text nullable
* status text default 'open'
* do_not_contact boolean default false
* contacted_at timestamptz nullable
* last_email_sent_at timestamptz nullable
* converted_customer_id uuid references customers(id) on delete set null
* notes text nullable
* created_at timestamptz default now()
* updated_at timestamptz default now()

Mögliche Werte für `source`:

* website
* facebook
* instagram
* social_media
* lokal
* empfehlung
* google
* verein
* creator
* shop
* sonstiges

Mögliche Werte für `recommended_service`:

* logo_sprint
* logo_vectorization
* design_finalization
* business_presence
* sticker_design
* social_media_design
* flyer_design
* other

Mögliche Werte für `status`:

* open
* done
* archived

Ergänze:

* updated_at Trigger
* Index auf email
* Index auf website_url
* Index auf status
* Index auf source
* Index auf do_not_contact
* Index auf created_at

RLS:

* RLS für `acquisition_leads` aktivieren
* nur Admins dürfen Leads lesen, erstellen, bearbeiten und löschen
* Adminprüfung bevorzugt über `public.profiles.role = 'admin'`
* keine öffentliche SELECT Policy
* keine öffentliche INSERT/UPDATE/DELETE Policy

────────────────────────
2. Akquise-Seite `/admin/akquise`
────────────────────────

Baue die Seite `/admin/akquise`.

Inhalt:

* Titel: „Akquise“
* Untertitel: „Potenzielle Kunden sammeln, bewerten und kontaktieren.“
* Button: „+ Neuer Lead“

Liste echter Leads aus Supabase:

* Firma
* Website
* E-Mail
* Telefon
* Social-Link
* Quelle
* erkanntes Designproblem
* empfohlene Leistung
* Status
* Nicht mehr kontaktieren
* erstellt am

Aktionen:

* Bearbeiten
* E-Mail senden
* Als Kunde übernehmen
* Archivieren
* Löschen mit Warnung

Wenn keine Leads vorhanden sind:
„Noch keine Akquise-Leads vorhanden.“

Keine Fake-Leads anzeigen.

────────────────────────
3. Lead manuell anlegen
────────────────────────

Beim Klick auf „+ Neuer Lead“ soll ein Formular oder Modal erscheinen.

Pflichtfeld:

* Firma

Optionale Felder:

* Website
* E-Mail
* Telefon
* Social-Link
* Quelle
* erkanntes Designproblem
* empfohlene Leistung
* Status
* Notizen
* Nicht mehr kontaktieren

Wichtig:

* Speichern direkt in Supabase
* Erfolgsmeldung anzeigen
* Fehler sauber anzeigen
* keine lokale Fake-Speicherung

────────────────────────
4. Lead bearbeiten
────────────────────────

Bearbeitung muss möglich sein für:

* Firma
* Website
* E-Mail
* Telefon
* Social-Link
* Quelle
* erkanntes Problem
* empfohlene Leistung
* Status
* Notizen
* Nicht mehr kontaktieren

Wichtig:
Wenn `do_not_contact = true`:

* Kontakt-Aktionen sichtbar blockieren
* Hinweis anzeigen:
  „Dieser Lead darf nicht mehr kontaktiert werden.“

────────────────────────
5. Suche und Filter
────────────────────────

Suche:

* Firma
* Website
* E-Mail
* Telefon

Filter:

* Status
* Quelle
* empfohlene Leistung
* Nicht mehr kontaktieren

Sortierung:

* neueste zuerst
* optional offene zuerst

────────────────────────
6. E-Mail direkt aus Akquise senden
────────────────────────

Baue eine vorbereitete Aktion:

„E-Mail senden“

Wichtig:

* SMTP nur serverseitig verwenden
* kein SMTP-Passwort im Client
* keine SMTP-Logik in Client Components
* keine Massenmail-Funktion
* nur einzelner Lead pro Versand
* wenn `do_not_contact = true`, Versand blockieren
* wenn keine E-Mail vorhanden ist, Versand blockieren
* wenn SMTP-ENV fehlt, saubere Fehlermeldung anzeigen
* keine Fake-Mail senden

SMTP ENV:

* SMTP_HOST
* SMTP_PORT
* SMTP_SECURE
* SMTP_USER
* SMTP_PASSWORD
* SMTP_FROM
* SMTP_REPLY_TO

E-Mail-Funktion:

* Lead auswählen
* einfache Vorlage auswählen oder Freitext vorbereiten
* Betreff eingeben
* Nachricht prüfen
* einzeln senden
* nach Versand `last_email_sent_at` und `contacted_at` setzen
* optional Activity Log schreiben

Falls E-Mail-Templates noch nicht vorhanden sind:

* keine große Template-Verwaltung bauen
* nur saubere Vorbereitung oder einfache direkte Eingabe
* Template-Modul kommt später

────────────────────────
7. Lead zu Kunde umwandeln
────────────────────────

Aktion:
„Als Kunde übernehmen“

Funktion:

* Prüfen, ob bereits Kunde mit gleicher E-Mail existiert
* wenn vorhanden: `converted_customer_id` setzen
* wenn nicht vorhanden: neuen Customer erstellen

Neuer Kunde:

* name = company_name oder sinnvoller Name
* email
* phone
* company = company_name
* source
* status = interessent
* notes aus Lead übernehmen

Wichtig:

* keine doppelten Kunden erzeugen, wenn E-Mail bereits existiert
* Erfolgsmeldung anzeigen
* Fehler sauber anzeigen

────────────────────────
8. Rechtlich vorsichtige Akquise-Hinweise
────────────────────────

Die Seite soll technisch kein aggressives Spam-/Massenmail-Tool sein.

Wichtig:

* Kein Button „Alle anschreiben“
* Kein Bulk-Mail-Versand
* Kein automatischer Massenversand
* „Nicht mehr kontaktieren“ muss sichtbar und technisch blockierend sein
* Einzelprüfung pro Lead bleibt erhalten

Optional kleiner Hinweis im UI:
„Bitte Kontaktaufnahme nur nach eigener Prüfung und unter Beachtung der geltenden Regeln durchführen.“

────────────────────────
9. Activity Log
────────────────────────

Wenn `activity_logs` vorhanden ist, protokolliere wichtige Aktionen:

* Lead erstellt
* Lead bearbeitet
* Lead kontaktiert
* Lead als Kunde übernommen
* Lead archiviert
* Lead gelöscht
* Nicht-mehr-kontaktieren gesetzt

Keine Fake-Logs.

────────────────────────
10. Design
────────────────────────

Die Akquise-Seite soll hochwertig und passend zum Klickdesigns-Adminbereich wirken.

Design:

* Premium-Look
* schnelle Arbeitsliste
* klare Tabellen/Karten
* gute Filter
* gute Abstände
* responsive sauber
* Anthrazit/Sand/Ruby-Akzent nutzen
* keine generische Standard-Optik

Die Seite soll auf Geschwindigkeit ausgelegt sein:
Lead sehen → bewerten → kontaktieren oder übernehmen.

────────────────────────
11. Sicherheit
────────────────────────

* `/admin/akquise` geschützt
* nicht eingeloggte Nutzer zu `/login`
* nur Admins dürfen Leads sehen/verwalten
* keine Leads öffentlich machen
* keine Kundendaten öffentlich machen
* Service Role Key niemals im Client
* `.env.local` nicht committen

────────────────────────
12. Build/Git
────────────────────────

Nach Umsetzung:

1. `npm run build` ausführen
2. Buildfehler beheben
3. Änderungen committen
4. Änderungen pushen, falls Git-Remote vorhanden ist
5. Falls nötig GitHub-Remote aus `daten.md` verwenden
6. Keine sensiblen Daten aus `daten.md` ausgeben

Arbeite ausschließlich nach diesem Auftrag.
Keine unnötigen Kommentare, Tipps, Erklärungen oder zusätzlichen Vorschläge.

Am Ende bitte kurz zusammenfassen:

* welche Dateien geändert wurden
* ob `/admin/akquise` erstellt/ausgebaut wurde
* ob `acquisition_leads` in `supabase/klickdesigns_schema.sql` vorbereitet wurde
* ob Leads direkt mit Supabase verbunden sind
* ob „Nicht mehr kontaktieren“ technisch blockiert
* ob Lead → Kunde funktioniert
* ob E-Mail-Versand vorbereitet/eingebaut wurde
* ob keine Fake-Daten eingebaut wurden
* ob `npm run build` erfolgreich war
* ob Commit/Push durchgeführt wurde
