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

        <div className="mt-10 text-center"><a href="/kontakt" className="rounded-md bg-ruby px-6 py-3 text-sm font-semibold text-offwhite">Dateien für Aufkleber anfragen</a></div>
      </main>
      <Footer />
    </>
  );
}
