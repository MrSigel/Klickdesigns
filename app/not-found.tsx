import type { Metadata } from "next";
import ErrorPageShell from "./components/ErrorPageShell";

export const metadata: Metadata = {
  title: "Diese Seite existiert nicht",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <ErrorPageShell
      eyebrow="Seite nicht gefunden"
      headline="Diese Seite existiert nicht"
      text="Entschuldige, du rufst gerade eine Seite auf, die noch nicht oder gar nicht existiert."
      primaryHref="/"
      primaryLabel="Zur Startseite"
      secondaryHref="/kontakt"
      secondaryLabel="Kontakt aufnehmen"
    />
  );
}
