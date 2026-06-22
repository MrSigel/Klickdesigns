import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import PDFDownloadButton from './PDFDownloadButton'
import { sendOfferEmail, updateOffer } from '../actions'

type Offer = {
  id: string
  offer_number: string
  title: string
  intro_text: string | null
  notes: string | null
  subtotal_cents: number
  discount_cents: number
  total_cents: number
  currency: string
  valid_until: string | null
  payment_terms: string | null
  public_token: string | null
  sent_at: string | null
  accepted_at: string | null
  rejected_at: string | null
  created_at: string
  customer: { id: string; name: string; email: string } | null
}

async function getOffer(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('offers')
    .select(`
      *,
      customer:customers (id, name, email)
    `)
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data as Offer
}

export default async function OfferDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const offer = await getOffer(id)

  if (!offer) {
    return <div>Angebot nicht gefunden. <Link href="/admin/angebot">Zurück</Link></div>
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/angebot" className="text-sm text-anthracite/60">← Zurück zur Übersicht</Link>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-[28px] font-bold tracking-[-0.035em] text-anthracite">{offer.offer_number}</h1>
          <p className="text-xl text-anthracite/80">{offer.title}</p>
          <p className="text-sm text-anthracite/60 mt-1">{offer.customer?.name} — {offer.customer?.email}</p>
        </div>

        <div className="text-right text-sm">
          <div className="font-mono tabular-nums text-2xl font-semibold">{(offer.total_cents / 100).toFixed(2)} {offer.currency}</div>
          {offer.valid_until && <div className="text-anthracite/60">gültig bis {new Date(offer.valid_until).toLocaleDateString('de-DE')}</div>}
        </div>
      </div>

      <div className="mb-8 flex gap-3">
        <PDFDownloadButton offer={offer} />
        <form action={sendOfferEmail}>
          <input type="hidden" name="id" value={offer.id} />
          <button type="submit" className="rounded-md border border-anthracite/20 px-4 py-2 text-sm hover:border-ruby/40">Per E-Mail senden</button>
        </form>
        {offer.public_token && (
          <Link href={`/angebot/${offer.public_token}`} target="_blank" className="rounded-md border border-anthracite/20 px-4 py-2 text-sm hover:border-ruby/40">Öffentlichen Link öffnen</Link>
        )}
      </div>

      {/* Edit form */}
      <form action={updateOffer} className="rounded-xl border border-anthracite/10 bg-white p-6 mb-8 space-y-4">
        <input type="hidden" name="id" value={offer.id} />

        <div>
          <label className="text-xs font-medium text-anthracite/70">Titel</label>
          <input name="title" defaultValue={offer.title} className="w-full rounded border border-anthracite/15 px-3 py-2 text-sm mt-1" />
        </div>

        <div>
          <label className="text-xs font-medium text-anthracite/70">Einleitung</label>
          <textarea name="intro_text" defaultValue={offer.intro_text || ''} className="w-full rounded border border-anthracite/15 px-3 py-2 text-sm mt-1" rows={3} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-anthracite/70">Gültig bis</label>
            <input type="date" name="valid_until" defaultValue={offer.valid_until || ''} className="w-full rounded border border-anthracite/15 px-3 py-2 text-sm mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-anthracite/70">Zahlungsbedingungen</label>
            <input name="payment_terms" defaultValue={offer.payment_terms || ''} className="w-full rounded border border-anthracite/15 px-3 py-2 text-sm mt-1" />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-anthracite/70">Interne Notizen</label>
          <textarea name="notes" defaultValue={offer.notes || ''} className="w-full rounded border border-anthracite/15 px-3 py-2 text-sm mt-1" rows={2} />
        </div>

        <button type="submit" className="rounded-md bg-anthracite px-5 py-2 text-sm font-semibold text-offwhite">Änderungen speichern</button>
      </form>

      <div className="text-sm text-anthracite/60">
        Status: {offer.accepted_at ? 'Angenommen' : offer.sent_at ? 'Versendet' : 'Entwurf'} · Öffentlicher Link: {offer.public_token ? `${process.env.NEXT_PUBLIC_SITE_URL || ''}/angebot/${offer.public_token}` : '—'}
      </div>

      <p className="mt-8 text-xs text-anthracite/50">PDF und vollständige E-Mail mit Anhang werden im Detail implementiert (Button funktioniert als Link zum öffentlichen Angebot).</p>
    </div>
  )
}
