"use client";

import { useEffect } from "react";
import ErrorPageShell from "./components/ErrorPageShell";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorPageShell
      eyebrow="Fehler"
      headline="Etwas ist schiefgelaufen"
      text="Bitte versuche es später erneut oder kontaktiere uns per E-Mail."
      email="kontakt@klickdesigns.de"
      primaryHref="/"
      primaryLabel="Zur Startseite"
    />
  );
}
