'use client'

import { useState } from 'react'

const productTypeOptions = [
  'T-Shirts',
  'Pullover',
  'Sticker',
  'Autoaufkleber',
  'Flyer',
  'Sonstiges',
]

const targetGroupOptions = [
  'Herren',
  'Damen',
  'Unisex',
  'Kinder',
  'Verschiedene Größen / bitte im Text angeben',
]

const positionOptions = [
  'Brust',
  'Rücken',
  'Ärmel',
  'Vorderseite',
  'Rückseite',
  'Sonstiges',
]

function CheckboxPill({ name, value }: { name: string; value: string }) {
  return (
    <label className="flex items-center gap-2 rounded-md border border-anthracite/10 bg-white px-3 py-2 text-[13px] font-medium text-anthracite/75">
      <input type="checkbox" name={name} value={value} className="accent-ruby" />
      <span>{value}</span>
    </label>
  )
}

export default function ProductFulfillmentFields() {
  const [requested, setRequested] = useState(false)

  return (
    <div className="mt-7 rounded-lg border border-anthracite/10 bg-offwhite/45 p-5">
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          name="product_fulfillment_requested"
          value="true"
          checked={requested}
          onChange={(event) => setRequested(event.target.checked)}
          className="mt-1 accent-ruby"
        />
        <span>
          <span className="block text-[14px] font-semibold text-anthracite/80">
            Produktumsetzung gewünscht?
          </span>
          <span className="mt-1 block text-[13px] leading-relaxed text-anthracite/60">
            Ja, ich interessiere mich zusätzlich für Druck &amp;
            Produktumsetzung.
          </span>
        </span>
      </label>

      {requested && (
        <div className="mt-6 space-y-5 border-t border-anthracite/10 pt-6">
          <div>
            <span className="block text-[13px] font-semibold text-anthracite/75">
              Produktart
            </span>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {productTypeOptions.map((option) => (
                <CheckboxPill key={option} name="product_types" value={option} />
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-[13px] font-semibold text-anthracite/75">
              Menge
            </span>
            <input
              type="text"
              name="product_quantity"
              className="briefing-input mt-2 w-full"
              placeholder="z. B. 25 Stück oder noch offen"
            />
            <span className="mt-1 block text-[11px] text-anthracite/50">
              Mindestmengen können je nach Produkt gelten.
            </span>
          </label>

          <div>
            <span className="block text-[13px] font-semibold text-anthracite/75">
              Ausführung / Größen
            </span>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {targetGroupOptions.map((option) => (
                <CheckboxPill key={option} name="product_target_group" value={option} />
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-[13px] font-semibold text-anthracite/75">
              Farbe
            </span>
            <input
              type="text"
              name="product_color"
              className="briefing-input mt-2 w-full"
              placeholder="Schwarz, Weiß, Beige, andere"
            />
          </label>

          <div>
            <span className="block text-[13px] font-semibold text-anthracite/75">
              Designposition
            </span>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {positionOptions.map((option) => (
                <CheckboxPill key={option} name="product_position" value={option} />
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-[13px] font-semibold text-anthracite/75">
              Zusätzliche Hinweise
            </span>
            <textarea
              name="product_notes"
              rows={4}
              className="briefing-input mt-2 min-h-[110px] w-full resize-none"
              placeholder="Wünsche, Maße, Produktdetails oder besondere Anforderungen"
            />
          </label>

          <p className="rounded-md border border-ruby/15 bg-white px-4 py-3 text-[12px] leading-relaxed text-anthracite/60">
            Die Produktumsetzung ist optional und erfolgt erst nach individueller
            Prüfung und Angebot. Es findet keine direkte Bestellung über das
            Formular statt.
          </p>
        </div>
      )}
    </div>
  )
}
