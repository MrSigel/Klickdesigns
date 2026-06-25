import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductFulfillmentSection from '../components/ProductFulfillmentSection';

export const metadata = {
  title: 'Autoaufkleber-Design – Dateien für Fahrzeugbeschriftung und Sticker | Klickdesigns',
  description: 'Klickdesigns bereitet Logo- und Schriftzug-Dateien für Autoaufkleber und einfache Fahrzeugbeschriftung auf. Saubere SVG/PDF für Folien.',
  openGraph: {
    title: 'Autoaufkleber-Design | Klickdesigns',
    description: 'Design-Dateien für Fahrzeug-Sticker und Beschriftung.',
  },
};

export default function AutoaufkleberDesignPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <h1 className="font-display text-[2.8rem] font-bold tracking-[-0.04em] text-anthracite">Autoaufkleber-Design</h1>
        <p className="mt-4 max-w-2xl text-[17px] text-anthracite/70">Design-Dateien für Autoaufkleber, Fahrzeugbeschriftung oder einfache Fahrzeug-Sticker. Für Dienstleister, Vereine, Creator und lokale Firmen.</p>

        <ProductFulfillmentSection className="mt-12" />

        <div className="mt-10 rounded-xl border border-anthracite/10 bg-white p-6">
          <h2 className="text-xl font-semibold text-anthracite">Passende Lösungen</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <a href="/loesungen/handwerker-logo-optimieren" className="rounded-lg border border-anthracite/10 bg-offwhite/70 p-4 text-sm font-semibold text-ruby hover:border-ruby/30">
              Handwerker Logo optimieren
            </a>
            <a href="/loesungen/vektorgrafik-fuer-textildruck" className="rounded-lg border border-anthracite/10 bg-offwhite/70 p-4 text-sm font-semibold text-ruby hover:border-ruby/30">
              Vektorgrafik für Textildruck
            </a>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="mb-3 text-sm text-anthracite/70">Gestaltung und Vorbereitung für Autoaufkleber auf Anfrage, inklusive Produktumsetzung.</p>
          <a href="/kontakt" className="rounded-md bg-ruby px-6 py-3 text-sm font-semibold text-offwhite">Dateien für Aufkleber anfragen</a>
        </div>
      </main>
      <Footer />
    </>
  );
}
