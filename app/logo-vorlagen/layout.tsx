import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Kostenlose Logo-Vorlagen | Klickdesigns",
  description: "Lade kostenlose Logo-Vorlagen als PNG und SVG herunter. Perfekt für Web, Druck, Sticker und Kleidung. Einfach E-Mail angeben und sofort starten.",
  openGraph: {
    title: "Kostenlose Logo-Vorlagen | Klickdesigns",
    description: "Professionelle kostenlose Logo-Vorlagen zum Download. PNG und SVG – sofort verfügbar nach kurzer Registrierung per E-Mail.",
    images: [{ url: "/brand/klickdesigns-logo.svg" }],
  },
};

export default function LogoVorlagenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
