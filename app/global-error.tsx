"use client";

import { useEffect } from "react";
import ErrorPageShell from "./components/ErrorPageShell";
import "./globals.css";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="de">
      <body className="font-body antialiased">
        <ErrorPageShell
          eyebrow="Fehler"
          headline="Etwas ist schiefgelaufen"
          text="Bitte versuche es später erneut oder kontaktiere uns per E-Mail."
          email="kontakt@klickdesigns.de"
          primaryHref="/"
          primaryLabel="Zur Startseite"
        />
      </body>
    </html>
  );
}
