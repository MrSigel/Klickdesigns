import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { ConfirmSubmitButton } from '../components/ConfirmSubmitButton'

type Invoice = {
  id: string
  invoice_number: string
  title: string
  total_cents: number
  currency: string
  status: string
  invoice_date: string
  due_date: string | null
  sent_at: string | null
  paid_at: string | null
  customer: { name: string; email: string } | null
}

type AcceptedOffer = {
  id: string
  offer_number: string
  title: string
  total_cents: number
  currency?: string
  customer: { name: string } | null
}

async function getInvoices() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      id,
      invoice_number,
      title,
      total_cents,
      currency,
      status,
      invoice_date,
      due_date,
      sent_at,
      paid_at,
      customer:customers (name, email)
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching invoices:', error)
    return []
  }
  return ((data || []) as any) as Invoice[]
}

async function getAcceptedOffersWithoutInvoice() {
  const supabase = await createClient()
  // offers accepted, no invoice yet
  const { data: offers } = await supabase
    .from('offers')
    .select(`
      id,
      offer_number,
      title,
      total_cents,
      customer:customers (name)
    `)
    .not('accepted_at', 'is', null)
    .order('accepted_at', { ascending: false })
    .limit(20)

  if (!offers) return []

  // filter those without invoice (simple, since no join easy, query invoices)
  const offerIds = offers.map(o => o.id)
  const { data: existing } = await supabase
    .from('invoices')
    .select('offer_id')
    .in('offer_id', offerIds)

  const existingIds = new Set((existing || []).map(e => e.offer_id))
  return offers.filter(o => !existingIds.has(o.id)) as any as AcceptedOffer[]
}

async function createInvoiceFromOffer(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const offerId = formData.get('offer_id') as string

  const offer = await (await supabase.from('offers').select('* , customer:customers(*)').eq('id', offerId).single()).data
  if (!offer) return

  // check if invoice exists
  const { data: existing } = await supabase.from('invoices').select('id').eq('offer_id', offerId).maybeSingle()
  if (existing) return

  const invoice_number = 'RE-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.random().toString(36).slice(2,6).toUpperCase()

  const { data: invoice, error } = await supabase.from('invoices').insert({
    invoice_number,
    offer_id: offerId,
    customer_id: offer.customer_id,
    project_id: offer.converted_project_id,
    title: offer.title,
    subtotal_cents: offer.subtotal_cents || offer.total_cents,
    discount_cents: offer.discount_cents || 0,
    total_cents: offer.total_cents,
    currency: offer.currency || 'EUR',
    status: 'open',
    invoice_date: new Date().toISOString().slice(0,10),
    due_date: offer.valid_until, // or +30 days
    payment_terms: offer.payment_terms,
  }).select('id').single()

  if (error || !invoice) {
    console.error('create invoice error', error)
    return
  }

  // copy items from offer_items
  const { data: items } = await supabase.from('offer_items').select('*').eq('offer_id', offerId)
  if (items && items.length) {
    const invItems = items.map(it => ({
      invoice_id: invoice.id,
      offer_item_id: it.id,
      title: it.title,
      description: it.description,
      quantity: it.quantity,
      unit_price_cents: it.unit_price_cents,
      total_cents: it.total_cents,
      sort_order: it.sort_order,
    }))
    await supabase.from('invoice_items').insert(invItems)
  }

  revalidatePath('/admin/rechnung')
  // redirect to detail? but since server action in list, revalidate ok
}

async function deleteInvoice(formData: FormData) {
  'use server'

  const supabase = await createClient()
  const id = formData.get('id') as string
  if (!id) return

  await supabase.from('invoices').delete().eq('id', id)
  revalidatePath('/admin/rechnung')
}

export default async function AdminRechnung() {
  const [invoices, acceptedOffers] = await Promise.all([
    getInvoices(),
    getAcceptedOffersWithoutInvoice(),
  ])

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-[28px] font-bold tracking-[-0.035em] text-anthracite">
            Rechnungen
          </h1>
          <p className="mt-1 text-[15px] text-anthracite/70">
            Rechnungen erstellen, versenden und Zahlungen verfolgen.
          </p>
        </div>
      </div>

      {/* Create from accepted offers */}
      {acceptedOffers.length > 0 && (
        <div className="mb-8">
          <h2 className="font-semibold mb-3 text-anthracite/80">Aus akzeptierten Angeboten erstellen</h2>
          <div className="grid gap-3">
            {acceptedOffers.map(offer => (
              <form key={offer.id} action={createInvoiceFromOffer} className="flex items-center justify-between border border-anthracite/10 rounded p-3 bg-white">
                <div>
                  <div className="font-medium">{offer.offer_number} — {offer.title}</div>
                  <div className="text-xs text-anthracite/60">{offer.customer?.name} · {(offer.total_cents / 100).toFixed(2)} {offer.currency || 'EUR'}</div>
                </div>
                <input type="hidden" name="offer_id" value={offer.id} />
                <button type="submit" className="text-sm border border-ruby text-ruby px-3 py-1 rounded hover:bg-ruby/5">Rechnung erstellen</button>
              </form>
            ))}
          </div>
        </div>
      )}

      {invoices.length === 0 ? (
        <div className="rounded-xl border border-anthracite/10 bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-anthracite/20">
            <span className="text-anthracite/40">🧾</span>
          </div>
          <p className="text-anthracite/70">Noch keine Rechnungen vorhanden.</p>
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
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Rechnungsdatum</th>
                <th className="px-6 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-anthracite/10">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-anthracite/5">
                  <td className="px-6 py-4 font-mono text-xs text-anthracite/80">{inv.invoice_number}</td>
                  <td className="px-6 py-4 text-anthracite/80">{inv.customer?.name || '—'}</td>
                  <td className="px-6 py-4 text-anthracite/80">{inv.title}</td>
                  <td className="px-6 py-4 font-medium tabular-nums">
                    {(inv.total_cents / 100).toFixed(2)} {inv.currency}
                  </td>
                  <td className="px-6 py-4">
                    {inv.paid_at ? (
                      <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">bezahlt</span>
                    ) : inv.sent_at ? (
                      <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">versendet</span>
                    ) : (
                      <span className="inline-flex rounded-full bg-anthracite/10 px-2 py-0.5 text-xs text-anthracite">offen</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-anthracite/60 text-xs">{new Date(inv.invoice_date).toLocaleDateString('de-DE')}</td>
                  <td className="px-6 py-4 text-right text-xs">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/admin/rechnung/${inv.id}`} className="rounded border border-anthracite/15 px-2 py-1 hover:border-ruby/40">Anzeigen</Link>
                      {!inv.paid_at && (
                        <form action={async (fd: FormData) => {
                          'use server'
                          const supabase = await createClient()
                          const id = fd.get('id') as string
                          await supabase.from('invoices').update({ status: 'paid', paid_at: new Date().toISOString() }).eq('id', id)
                          revalidatePath('/admin/rechnung')
                        }}>
                          <input type="hidden" name="id" value={inv.id} />
                          <button type="submit" className="rounded border border-anthracite/15 px-2 py-1 hover:border-green-600 text-green-700">Bezahlt</button>
                        </form>
                      )}
                      <form action={deleteInvoice}>
                        <input type="hidden" name="id" value={inv.id} />
                        <ConfirmSubmitButton
                          message="Rechnung wirklich löschen?"
                          className="rounded border border-red-200 px-2 py-1 text-red-600 hover:bg-red-50"
                        >
                          Löschen
                        </ConfirmSubmitButton>
                      </form>
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
