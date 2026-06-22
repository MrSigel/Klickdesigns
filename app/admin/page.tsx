export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-[28px] font-bold tracking-[-0.035em] text-anthracite">
          Dashboard
        </h1>
        <p className="mt-1 text-[15px] text-anthracite/70">
          Schneller Überblick über Klickdesigns.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Kunden' },
          { label: 'Anfragen' },
          { label: 'Angebote' },
          { label: 'Rechnungen' },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-anthracite/10 bg-white p-6"
          >
            <div className="text-sm font-medium text-anthracite">{item.label}</div>
            <div className="mt-8 text-[13px] leading-relaxed text-anthracite/55">
              Bereich in Vorbereitung.
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
