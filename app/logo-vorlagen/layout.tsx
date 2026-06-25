import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Kostenlose Logo-Vorlagen | Klickdesigns",
  description: "Kostenlose Logo-Vorlagen als PNG und SVG herunterladen. Einstieg für Web, Druck, Sticker, Kleidung und Social Media. Einfach E-Mail angeben und starten.",
  openGraph: {
    title: "Kostenlose Logo-Vorlagen | Klickdesigns",
    description: "Professionelle kostenlose Logo-Vorlagen zum Download. PNG und SVG für Web, Print und Merchandise.",
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
