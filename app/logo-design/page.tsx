import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Logo-Design – neue Logo-Ideen und Einstieg mit Logo-Sprint | Klickdesigns',
  description: 'Klickdesigns bietet mit dem Logo-Sprint schnelle Logo-Richtungen oder bereitet bestehende Logos auf. Wählen Sie den richtigen Einstieg für Ihr Projekt.',
  openGraph: {
    title: 'Logo-Design | Klickdesigns',
    description: 'Neue Logo-Ideen oder Aufbereitung bestehender Logos.',
  },
};

export default function LogoDesignPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <h1 className="font-display text-[2.8rem] font-bold tracking-[-0.04em] text-anthracite">Logo-Design</h1>
        <p className="mt-4 max-w-2xl text-[17px] text-anthracite/70">Ob neue Logo-Ideen oder Verbesserung eines bestehenden Logos – wir haben den passenden Einstieg.</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="border p-6 rounded-xl">
            <h3 className="font-semibold">Neues Logo</h3>
            <p className="text-sm mt-2">Logo-Sprint: 4–5 Richtungen als Vorschau für 20 €.</p>
            <a href="/logo-sprint" className="text-ruby text-sm mt-2 inline-block">Zum Logo-Sprint →</a>
          </div>
          <div className="border p-6 rounded-xl">
            <h3 className="font-semibold">Bestehendes Logo verbessern</h3>
            <p className="text-sm mt-2">Logo-Vektorisierung: Aufbereitung als SVG/PNG ab 49 €.</p>
            <a href="/logo-vektorisieren" className="text-ruby text-sm mt-2 inline-block">Logo vektorisieren →</a>
          </div>
        </div>

        <div className="mt-10 text-center"><a href="/kontakt" className="rounded-md bg-ruby px-6 py-3 text-sm font-semibold text-offwhite">Logo-Projekt starten</a></div>
      </main>
      <Footer />
    </>
  );
}
