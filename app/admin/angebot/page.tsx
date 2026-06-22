import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

type Offer = {
  id: string
  offer_number: string
  title: string
  total_cents: number
  currency: string
  valid_until: string | null
  created_at: string
  sent_at: string | null
  accepted_at: string | null
  customer: { name: string; email: string } | null
}

async function getOffers() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('offers')
    .select(`
      id,
      offer_number,
      title,
      total_cents,
      currency,
      valid_until,
      created_at,
      sent_at,
      accepted_at,
      customer:customers (name, email)
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching offers:', error)
    return []
  }

  return ((data || []) as any) as Offer[]
}

export default async function AdminAngebot() {
  const offers = await getOffers()

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-[28px] font-bold tracking-[-0.035em] text-anthracite">
            Angebote
          </h1>
          <p className="mt-1 text-[15px] text-anthracite/70">
            Angebote erstellen, versenden und in Aufträge überführen.
          </p>
        </div>
        <Link
          href="/admin/angebot/neu"
          className="inline-flex items-center rounded-md bg-ruby px-4 py-2 text-sm font-semibold text-offwhite hover:bg-ruby/90"
        >
          + Neues Angebot
        </Link>
      </div>

      {offers.length === 0 ? (
        <div className="rounded-xl border border-anthracite/10 bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-anthracite/20">
            <span className="text-anthracite/40">📄</span>
          </div>
          <p className="text-anthracite/70">Noch keine Angebote vorhanden.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-anthracite/10 bg-white">
          <table className="min-w-full divide-y divide-anthracite/10 text-sm">
            <thead>
              <tr className="text-left text-anthracite/60">
                <th className="px-6 py-3 font-medium">Nr.</th>
                <th className="px-6 py-3 font-medium">Kunde</th>
                <th className="px-6 py-3 font-medium">Titel</th>
                <th className="px-6 py-3 font-medium">Betrag</th>
                <th className="px-6 py-3 font-medium">Gültig bis</th>
                <th className="px-6 py-3 font-medium">Erstellt</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-anthracite/10">
              {offers.map((offer) => (
                <tr key={offer.id} className="hover:bg-anthracite/5">
                  <td className="px-6 py-4 font-mono text-xs text-anthracite/80">{offer.offer_number}</td>
                  <td className="px-6 py-4 text-anthracite/80">{offer.customer?.name || '—'}</td>
                  <td className="px-6 py-4 text-anthracite/80">{offer.title}</td>
                  <td className="px-6 py-4 font-medium tabular-nums">
                    {(offer.total_cents / 100).toFixed(2)} {offer.currency}
                  </td>
                  <td className="px-6 py-4 text-anthracite/80">
                    {offer.valid_until ? new Date(offer.valid_until).toLocaleDateString('de-DE') : '—'}
                  </td>
                  <td className="px-6 py-4 text-anthracite/60 text-xs">
                    {new Date(offer.created_at).toLocaleDateString('de-DE')}
                  </td>
                  <td className="px-6 py-4">
                    {offer.accepted_at ? (
                      <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">angenommen</span>
                    ) : offer.sent_at ? (
                      <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">versendet</span>
                    ) : (
                      <span className="inline-flex rounded-full bg-anthracite/10 px-2 py-0.5 text-xs text-anthracite">Entwurf</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-xs">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/admin/angebot/${offer.id}`} className="rounded border border-anthracite/15 px-2 py-1 hover:border-ruby/40">Anzeigen</Link>
                      <a href={`/admin/angebot/${offer.id}?pdf=1`} className="rounded border border-anthracite/15 px-2 py-1 hover:border-ruby/40">PDF</a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
