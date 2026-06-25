import ExtractorClient from './ExtractorClient'

export default function AdminExtractorPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-[28px] font-bold tracking-[-0.035em] text-anthracite">
          Daten-Extractor
        </h1>
        <p className="mt-1 max-w-3xl text-[15px] text-anthracite/70">
          Füge kopierten Text ein. Es werden automatisch nur Websites und E-Mail-Adressen extrahiert und gespeichert.
        </p>
      </div>

      <ExtractorClient />
    </div>
  )
}
