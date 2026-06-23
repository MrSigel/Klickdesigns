import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Grafikdesign für Unternehmen – Logo, Flyer, Social Media & Druckdaten | Klickdesigns',
  description: 'Klickdesigns unterstützt kleine Unternehmen, Selbstständige und Shops mit Logo, Flyer, Social-Media-Grafiken und druckfertigen Dateien für einen einheitlichen Markenauftritt.',
  openGraph: {
    title: 'Grafikdesign für Unternehmen | Klickdesigns',
    description: 'Professionelle Grafikleistungen für Unternehmen und Selbstständige.',
  },
};

export default function GrafikdesignFuerUnternehmenPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <h1 className="font-display text-[2.8rem] font-bold tracking-[-0.04em] text-anthracite">Grafikdesign für Unternehmen</h1>
        <p className="mt-4 max-w-2xl text-[17px] text-anthracite/70">Für kleine Unternehmen, Selbstständige, Dienstleister und Shops. Wir liefern einheitliche Grafiklösungen.</p>

        <div className="mt-10 text-center"><a href="/kontakt" className="rounded-md bg-ruby px-6 py-3 text-sm font-semibold text-offwhite">Projekt anfragen</a></div>
      </main>
      <Footer />
    </>
  );
}
