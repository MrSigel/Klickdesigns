"use client";

import { useEffect, useState } from "react";
import {
  CONSENT_CHANGE_EVENT,
  readConsent,
  saveConsent,
  type ConsentPreferences,
} from "./cookie-consent";

export function CookieSettings() {
  const [analytics, setAnalytics] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    if (stored) setAnalytics(stored.analytics);

    function handleChange(event: Event) {
      const preferences = (event as CustomEvent<ConsentPreferences>).detail;
      setAnalytics(preferences.analytics);
    }

    window.addEventListener(CONSENT_CHANGE_EVENT, handleChange);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, handleChange);
  }, []);

  function apply(value: boolean) {
    saveConsent(value);
    setAnalytics(value);
    setSaved(true);
  }

  return (
    <div>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-5 rounded-lg border border-anthracite/10 bg-offwhite/45 p-4 sm:p-5">
          <div>
            <h3 className="font-semibold text-anthracite">Notwendig</h3>
            <p className="mt-1 text-sm leading-6 text-anthracite/65">
              Speichert deine Cookie-Consent-Auswahl im Browser. Diese
              Kategorie ist immer aktiv.
            </p>
          </div>
          <span className="whitespace-nowrap rounded-full bg-anthracite/10 px-3 py-1 text-xs font-semibold text-anthracite/65">
            Immer aktiv
          </span>
        </div>

        <label className="flex cursor-pointer items-start justify-between gap-5 rounded-lg border border-anthracite/10 bg-offwhite/45 p-4 sm:p-5">
          <span>
            <span className="font-semibold text-anthracite">Analyse</span>
            <span className="mt-1 block text-sm leading-6 text-anthracite/65">
              Vercel Analytics erfasst anonymisierte Seitenaufrufe. Vercel
              Speed Insights erfasst anonyme Performance-Messwerte. Beides wird
              nur nach deiner Zustimmung geladen.
            </span>
          </span>
          <input
            type="checkbox"
            checked={analytics}
            onChange={(event) => {
              setAnalytics(event.target.checked);
              setSaved(false);
            }}
            className="mt-1 h-5 w-5 flex-shrink-0 accent-ruby"
          />
        </label>
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => apply(true)}
          className="min-h-11 rounded-md bg-ruby px-4 py-2.5 text-sm font-semibold text-offwhite"
        >
          Alle akzeptieren
        </button>
        <button
          type="button"
          onClick={() => apply(false)}
          className="min-h-11 rounded-md border border-ruby px-4 py-2.5 text-sm font-semibold text-ruby"
        >
          Alle ablehnen
        </button>
        <button
          type="button"
          onClick={() => apply(analytics)}
          className="min-h-11 rounded-md border border-anthracite/20 px-4 py-2.5 text-sm font-semibold text-anthracite"
        >
          Auswahl speichern
        </button>
      </div>

      <p role="status" className="mt-4 min-h-6 text-sm font-semibold text-ruby">
        {saved ? "Deine Auswahl wurde gespeichert." : ""}
      </p>
    </div>
  );
}
