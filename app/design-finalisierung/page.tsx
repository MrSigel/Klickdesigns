import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Design-Finalisierung – bestehende Entwürfe, Flyer & Social-Media-Grafiken optimieren | Klickdesigns',
  description: 'Klickdesigns finalisiert und optimiert bestehende Flyer, Canva-Designs und Social-Media-Grafiken. Layout, Farben, Typografie und Lesbarkeit für Print und Web.',
  openGraph: {
    title: 'Design-Finalisierung ab 149 € | Klickdesigns',
    description: 'Bestehende Designs professionell aufbereiten – für Druck und Social Media.',
  },
};

export default function DesignFinalisierungPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <h1 className="font-display text-[2.8rem] font-bold tracking-[-0.04em] text-anthracite">Design-Finalisierung</h1>
        <p className="mt-4 max-w-2xl text-[17px] text-anthracite/70">Sie haben bereits einen Entwurf, ein Canva-Design oder einen Flyer? Wir verbessern Layout, Farben, Typografie und bereiten druck- oder webfertige Dateien vor.</p>

        <div className="mt-10">
          <h2 className="text-xl font-semibold">Was wir optimieren</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-sm text-anthracite/70">
            <li>• Layout und Struktur</li>
            <li>• Farbharmonie und Kontraste</li>
            <li>• Typografie und Lesbarkeit</li>
            <li>• CTA-Positionierung</li>
            <li>• Dateiformate für Print und Social</li>
          </ul>
        </div>

        <div className="mt-10 rounded-xl border p-6">
          <p className="font-semibold">Preis: Design-Finalisierung ab 149 €</p>
          <p className="text-sm mt-1">Inklusive 1 Korrekturrunde. Export als PNG, JPG oder PDF nach Vereinbarung.</p>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Häufige Fragen</h2>
          <details className="border-b py-3"><summary>Kann ich ein Canva-Design einsenden?</summary><p className="mt-1 text-sm">Ja, wir arbeiten mit Canva-Designs und anderen Entwürfen.</p></details>
          <details className="border-b py-3"><summary>Bekomme ich druckfertige PDF?</summary><p className="mt-1 text-sm">Ja, je nach Projekt als PDF für Druck oder für Social Media.</p></details>
          <details className="border-b py-3"><summary>Wie viele Korrekturen gibt es?</summary><p className="mt-1 text-sm">Eine Korrekturrunde ist im Preis enthalten.</p></details>
        </div>

        <div className="mt-10 text-center"><a href="/kontakt" className="rounded-md bg-ruby px-6 py-3 text-sm font-semibold text-offwhite">Design finalisieren lassen</a></div>
      </main>
      <Footer />
    </>
  );
}
