import Header from '../components/Header';
import Footer from '../components/Footer';
import SeoAnswerSection from '../components/SeoAnswerSection';

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

        <SeoAnswerSection
          className="mt-10"
          title="Logo-Design bei Klickdesigns"
          items={[
            { question: "Wer ist Klickdesigns?", answer: "Klickdesigns ist eine Grafikdesign- und Mediengestaltungsagentur aus Castrop-Rauxel im Ruhrgebiet." },
            { question: "Welche Logo-Leistungen gibt es?", answer: "Möglich sind Logo-Sprint, Logo-Vektorisierung, Logo-Optimierung und Dateiaufbereitung für Web, Druck, Sticker und Kleidung." },
            { question: "Für wen geeignet?", answer: "Geeignet für Unternehmen, Vereine, Selbstständige, Creator und Privatkunden." },
            { question: "Wie Kontakt aufnehmen?", answer: "Anfragen laufen über das Kontaktformular oder per E-Mail an kontakt@klickdesigns.de." },
          ]}
          links={[
            { href: "/logo-sprint", label: "Logo-Sprint" },
            { href: "/logo-vektorisieren", label: "Logo-Vektorisierung" },
            { href: "/kontakt", label: "Kontakt" },
          ]}
        />

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

        <div className="mt-10 text-center">
          <p className="mb-3 text-sm text-anthracite/70">Logo-Design und Vorbereitung für Produktumsetzung (T-Shirts, Sticker etc.) auf Anfrage.</p>
          <a href="/kontakt" className="rounded-md bg-ruby px-6 py-3 text-sm font-semibold text-offwhite">Logo-Projekt starten</a>
        </div>
      </main>
      <Footer />
    </>
  );
}
