'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { submitInquiry } from '../actions/submit-inquiry';

export default function KontaktPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(formData: FormData) {
    setError('');
    const result = await submitInquiry(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setSubmitted(true);
      try { sessionStorage.setItem('contactSubmitted', 'true') } catch {}
    }
  }

  const services = [
    'Logo-Sprint',
    'Logo-Vektorisierung',
    'Design-Finalisierung',
    'Sticker-Design',
    'Social-Media-Design',
    'Flyer-Design',
    'Sonstiges',
  ];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <div className="text-center mb-12">
          <h1 className="font-display text-[2.5rem] font-bold tracking-[-0.04em] text-anthracite sm:text-[3rem]">
            Kontakt &amp; Anfrage
          </h1>
          <p className="mt-4 text-[16px] text-anthracite/65 max-w-xl mx-auto">
            Erzählen Sie uns von Ihrem Projekt. Wir melden uns schnell mit einem passenden Vorschlag.
          </p>
          <p className="mt-3 text-sm text-anthracite/60">
            Klickdesigns aus Castrop-Rauxel (Ruhrgebiet, NRW) arbeitet deutschlandweit mit Unternehmen, Vereinen und Creatorn. Je nach Umfang in der Regel innerhalb weniger Werktage erste Rückmeldung.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
            <h2 className="text-xl font-semibold text-green-800">Vielen Dank für Ihre Anfrage!</h2>
            <p className="mt-2 text-green-700">Wir prüfen Ihre Nachricht und melden uns in Kürze bei Ihnen.</p>
          </div>
        ) : (
          <form action={handleSubmit} className="space-y-6 bg-white border border-anthracite/10 rounded-xl p-8">
            <div>
              <label className="block text-sm font-medium text-anthracite mb-1">Gewünschte Leistung</label>
              <select name="service" className="w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm focus:border-ruby/40">
                {services.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-anthracite mb-1">Name *</label>
                <input type="text" name="name" required className="w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm focus:border-ruby/40" />
              </div>
              <div>
                <label className="block text-sm font-medium text-anthracite mb-1">E-Mail *</label>
                <input type="email" name="email" required className="w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm focus:border-ruby/40" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-anthracite mb-1">Telefon (optional)</label>
                <input type="tel" name="phone" className="w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm focus:border-ruby/40" />
              </div>
              <div>
                <label className="block text-sm font-medium text-anthracite mb-1">Unternehmen / Projekt (optional)</label>
                <input type="text" name="company" className="w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm focus:border-ruby/40" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-anthracite mb-1">Kurze Beschreibung Ihres Projekts *</label>
              <textarea name="message" required rows={5} className="w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm focus:border-ruby/40" placeholder="Beschreiben Sie kurz, was Sie benötigen..."></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-anthracite mb-1">Logo / Entwurf / Dateien (optional)</label>
              <input
                type="file"
                name="files"
                multiple
                accept=".png,.jpg,.jpeg,.svg,.pdf,.webp"
                className="w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-anthracite file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-offwhite"
              />
              <p className="text-[11px] text-anthracite/50 mt-1">PNG, JPG, SVG, PDF, WEBP erlaubt. Max. 10 MB pro Datei. Du kannst vorhandene Logos oder Entwürfe direkt mitsenden.</p>
            </div>

            <div className="flex items-start gap-2 text-sm">
              <input type="checkbox" name="consent" required className="mt-1 accent-ruby" />
              <span className="text-anthracite/70">Ich stimme der Verarbeitung meiner Daten gemäß der Datenschutzerklärung zu. *</span>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button type="submit" className="w-full rounded-md bg-ruby px-6 py-3 text-sm font-semibold text-offwhite hover:bg-ruby/90 transition">
              Anfrage absenden
            </button>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}
