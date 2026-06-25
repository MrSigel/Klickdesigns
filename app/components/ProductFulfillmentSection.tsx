import Link from 'next/link'

type ProductFulfillmentSectionProps = {
  className?: string
}

const productTypes = [
  'T-Shirts',
  'Pullover',
  'Sticker',
  'Autoaufkleber',
  'Flyer',
]

export default function ProductFulfillmentSection({ className = '' }: ProductFulfillmentSectionProps) {
  return (
    <section className={`rounded-xl border border-anthracite/10 bg-white p-6 shadow-[0_18px_45px_-36px_rgba(31,27,27,0.45)] sm:p-8 ${className}`}>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <span className="inline-flex rounded-full border border-ruby/15 bg-ruby/[0.04] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ruby">
            Auf Anfrage
          </span>
          <h2 className="mt-5 font-display text-[2rem] font-bold leading-tight tracking-[-0.035em] text-anthracite sm:text-[2.5rem]">
            Druck &amp; Produktumsetzung auf Anfrage
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-anthracite/70">
            Auf Wunsch bereitet Klickdesigns Logos, Motive und Designs nicht nur
            digital auf, sondern unterstützt auch bei der Umsetzung auf Produkten
            wie T-Shirts, Pullovern, Stickern, Autoaufklebern oder Flyern. Die
            Umsetzung erfolgt individuell nach Anfrage, Menge, Produktart und
            gewünschter Ausführung.
          </p>
          <p className="mt-4 text-[14px] font-semibold text-anthracite">
            Design, Druckdaten &amp; Produktumsetzung aus einer Hand.
          </p>
        </div>

        <div className="rounded-lg border border-anthracite/10 bg-offwhite/70 p-5">
          <div className="grid grid-cols-2 gap-2">
            {productTypes.map((type) => (
              <span
                key={type}
                className="rounded-md border border-anthracite/10 bg-white px-3 py-2 text-center text-[12px] font-semibold text-anthracite/70"
              >
                {type}
              </span>
            ))}
            <span className="rounded-md border border-dashed border-ruby/25 bg-ruby/[0.035] px-3 py-2 text-center text-[12px] font-semibold text-ruby">
              Weitere Produkte
            </span>
          </div>
          <p className="mt-5 text-[13px] leading-relaxed text-anthracite/60">
            Mindestmengen können je nach Produkt gelten. Die Umsetzung ist keine
            direkte Bestellung und erfolgt erst nach individueller Prüfung und
            Angebot.
          </p>
          <Link
            href="/versand-lieferung"
            className="mt-4 inline-flex text-[13px] font-semibold text-ruby underline underline-offset-4"
          >
            Versand &amp; Lieferung ansehen
          </Link>
        </div>
      </div>
    </section>
  )
}
