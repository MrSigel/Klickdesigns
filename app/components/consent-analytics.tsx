"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect, useState } from "react";
import {
  CONSENT_CHANGE_EVENT,
  readConsent,
  type ConsentPreferences,
} from "./cookie-consent";

export function ConsentAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    setEnabled(stored?.analytics === true);

    function handleChange(event: Event) {
      const preferences = (event as CustomEvent<ConsentPreferences>).detail;
      setEnabled(preferences.analytics);
    }

    window.addEventListener(CONSENT_CHANGE_EVENT, handleChange);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, handleChange);
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
