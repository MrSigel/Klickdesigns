"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export const CONSENT_STORAGE_KEY = "klickdesigns-cookie-consent";
export const CONSENT_CHANGE_EVENT = "klickdesigns:consent-change";

export type ConsentPreferences = {
  version: 1;
  necessary: true;
  analytics: boolean;
};

export function readConsent(): ConsentPreferences | null {
  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return null;

    const value = JSON.parse(stored) as Partial<ConsentPreferences>;
    if (
      value.version !== 1 ||
      value.necessary !== true ||
      typeof value.analytics !== "boolean"
    ) {
      return null;
    }

    return value as ConsentPreferences;
  } catch {
    return null;
  }
}

export function saveConsent(analytics: boolean) {
  const preferences: ConsentPreferences = {
    version: 1,
    necessary: true,
    analytics,
  };

  try {
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify(preferences),
    );
  } catch {
    // Die Auswahl bleibt für die aktuelle Sitzung wirksam.
  }

  window.dispatchEvent(
    new CustomEvent<ConsentPreferences>(CONSENT_CHANGE_EVENT, {
      detail: preferences,
    }),
  );

  return preferences;
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    if (stored) {
      setAnalytics(stored.analytics);
    } else {
      setVisible(true);
    }
  }, []);

  function applyConsent(value: boolean) {
    saveConsent(value);
    setAnalytics(value);
    setSettingsOpen(false);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-5">
      <section
        aria-label="Cookie-Einwilligung"
        className="mx-auto max-w-4xl rounded-xl border border-anthracite/15 bg-white p-5 shadow-[0_24px_70px_-24px_rgba(31,27,27,0.55)] sm:p-7"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-display text-xl font-bold tracking-[-0.02em] text-anthracite">
              Cookie-Einstellungen
            </p>
            <p className="mt-2 text-sm leading-6 text-anthracite/70">
              Notwendige lokale Speicherung sichert deine Auswahl. Optionale
              Analyse nutzt Vercel Analytics und Vercel Speed Insights und wird
              nur nach deiner Einwilligung geladen. Mehr dazu in der{" "}
              <Link href="/datenschutz" className="font-semibold text-ruby underline underline-offset-2">
                Datenschutzerklärung
              </Link>
              .
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[430px]">
            <button
              type="button"
              onClick={() => applyConsent(true)}
              className="min-h-11 rounded-md bg-ruby px-4 py-2.5 text-sm font-semibold text-offwhite transition-colors hover:bg-ruby/90"
            >
              Alle akzeptieren
            </button>
            <button
              type="button"
              onClick={() => applyConsent(false)}
              className="min-h-11 rounded-md border border-ruby px-4 py-2.5 text-sm font-semibold text-ruby transition-colors hover:bg-ruby/[0.04]"
            >
              Ablehnen
            </button>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="min-h-11 rounded-md border border-anthracite/20 px-4 py-2.5 text-sm font-semibold text-anthracite transition-colors hover:border-anthracite/40"
            >
              Einstellungen
            </button>
          </div>
        </div>
      </section>

      {settingsOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-end justify-center bg-anthracite/45 p-3 sm:items-center sm:p-6"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setSettingsOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-dialog-title"
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl border border-anthracite/15 bg-offwhite p-5 shadow-2xl sm:p-8"
          >
            <h2 id="cookie-dialog-title" className="font-display text-2xl font-bold text-anthracite">
              Cookie-Auswahl
            </h2>
            <p className="mt-2 text-sm leading-6 text-anthracite/65">
              Du kannst optionale Analyse jederzeit erlauben oder ablehnen.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-start justify-between gap-5 rounded-lg border border-anthracite/10 bg-white p-4">
                <div>
                  <p className="font-semibold text-anthracite">Notwendig</p>
                  <p className="mt-1 text-sm leading-5 text-anthracite/60">
                    Speichert ausschließlich deine Consent-Auswahl lokal.
                  </p>
                </div>
                <span className="rounded-full bg-anthracite/10 px-3 py-1 text-xs font-semibold text-anthracite/65">
                  Immer aktiv
                </span>
              </div>

              <label className="flex cursor-pointer items-start justify-between gap-5 rounded-lg border border-anthracite/10 bg-white p-4">
                <span>
                  <span className="font-semibold text-anthracite">Analyse</span>
                  <span className="mt-1 block text-sm leading-5 text-anthracite/60">
                    Vercel Analytics für anonymisierte Seitenaufrufe und Vercel
                    Speed Insights für anonyme Performance-Messwerte.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(event) => setAnalytics(event.target.checked)}
                  className="mt-1 h-5 w-5 accent-ruby"
                />
              </label>
            </div>

            <div className="mt-7 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => applyConsent(analytics)}
                className="min-h-11 rounded-md bg-ruby px-5 py-2.5 text-sm font-semibold text-offwhite"
              >
                Auswahl speichern
              </button>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="min-h-11 rounded-md border border-anthracite/20 px-5 py-2.5 text-sm font-semibold text-anthracite"
              >
                Zurück
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
