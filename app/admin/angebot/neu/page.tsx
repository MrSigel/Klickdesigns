import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

type Customer = { id: string; name: string; email: string }
type Inquiry = {
  id: string
  message: string
  created_at: string
  customer_id: string | null
  product_fulfillment_requested: boolean | null
  product_types: string[] | null
  product_quantity: string | null
  product_target_group: string[] | null
  product_color: string | null
  product_position: string[] | null
  product_notes: string | null
}
type ServicePackage = { id: string; name: string; price_cents: number | null; price_label: string }

function formatProductValue(value: string[] | string | null | undefined) {
  if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : null
  return value || null
}

function buildProductFulfillmentDescription(inquiry: Inquiry) {
  const lines = [
    'Druck & Produktumsetzung auf Anfrage - Details nach Abstimmung',
    formatProductValue(inquiry.product_types) ? `Produktarten: ${formatProductValue(inquiry.product_types)}` : null,
    formatProductValue(inquiry.product_quantity) ? `Menge: ${formatProductValue(inquiry.product_quantity)}` : null,
    formatProductValue(inquiry.product_target_group) ? `Größen / Ausführung: ${formatProductValue(inquiry.product_target_group)}` : null,
    formatProductValue(inquiry.product_color) ? `Farbe: ${formatProductValue(inquiry.product_color)}` : null,
    formatProductValue(inquiry.product_position) ? `Designposition: ${formatProductValue(inquiry.product_position)}` : null,
    formatProductValue(inquiry.product_notes) ? `Hinweise: ${formatProductValue(inquiry.product_notes)}` : null,
  ].filter(Boolean)

  return lines.join('\n')
}
async function getData() {
  const supabase = await createClient()

  const [customersRes, inquiriesRes, packagesRes] = await Promise.all([
    supabase.from('customers').select('id, name, email').order('name').limit(200),
    supabase.from('inquiries').select('id, message, created_at, customer_id, product_fulfillment_requested, product_types, product_quantity, product_target_group, product_color, product_position, product_notes').order('created_at', { ascending: false }).limit(100),
    supabase.from('service_packages').select('id, name, price_cents, price_label').eq('is_active', true).order('sort_order'),
  ])

  return {
    customers: (customersRes.data || []) as Customer[],
    inquiries: (inquiriesRes.data || []) as Inquiry[],
    packages: (packagesRes.data || []) as ServicePackage[],
  }
}

export default async function NewOfferPage({ searchParams }: { searchParams?: Promise<{ inquiryId?: string }> }) {
  const params = await (searchParams || Promise.resolve({ inquiryId: undefined }))
  const { customers, inquiries, packages } = await getData()
  const selectedInquiry = params.inquiryId ? inquiries.find((inquiry) => inquiry.id === params.inquiryId) : null

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/angebot" className="text-sm text-anthracite/60 hover:text-anthracite">← Zurück</Link>
      </div>

      <h1 className="font-display text-[28px] font-bold tracking-[-0.035em] text-anthracite mb-1">Neues Angebot erstellen</h1>
      <p className="text-anthracite/70 mb-8">Angebot aus Kunde/Anfrage erstellen.</p>

      <form action={async (formData: FormData) => {
        'use server'
        const supabase = await createClient()

        const customer_id = formData.get('customer_id') as string
        const inquiry_id = formData.get('inquiry_id') as string || null
        const title = formData.get('title') as string
        const intro_text = formData.get('intro_text') as string || null
        const valid_until = formData.get('valid_until') as string || null
        const payment_terms = formData.get('payment_terms') as string || null
        const notes = formData.get('notes') as string || null
        const includeProductFulfillmentItem = formData.get('include_product_fulfillment_item') === 'on'

        if (!customer_id || !title) {
          return
        }

        const offer_number = 'AN-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.random().toString(36).slice(2,6).toUpperCase()
        const public_token = crypto.randomUUID()

        const { data: offer, error } = await supabase
          .from('offers')
          .insert({
            offer_number,
            customer_id,
            inquiry_id,
            title,
            intro_text,
            notes,
            valid_until: valid_until || null,
            payment_terms,
            public_token,
            subtotal_cents: 0,
            discount_cents: 0,
            total_cents: 0,
            status: 'draft',
          })
          .select('id')
          .single()

        if (error || !offer) {
          console.error('Create offer error', error)
          return
        }

        // simple item from package
        const pkgId = formData.get('package_id') as string
        if (pkgId) {
          const pkg = (await supabase.from('service_packages').select('*').eq('id', pkgId).single()).data
          if (pkg) {
            const unit = pkg.price_cents || 0
            await supabase.from('offer_items').insert({
              offer_id: offer.id,
              service_package_id: pkgId,
              title: pkg.name,
              description: pkg.description,
              quantity: 1,
              unit_price_cents: unit,
              total_cents: unit,
              sort_order: 1,
            })
          }
        }

        if (includeProductFulfillmentItem && inquiry_id) {
          const { data: inquiry } = await supabase
            .from('inquiries')
            .select('id, message, created_at, customer_id, product_fulfillment_requested, product_types, product_quantity, product_target_group, product_color, product_position, product_notes')
            .eq('id', inquiry_id)
            .single()

          if (inquiry?.product_fulfillment_requested) {
            await supabase.from('offer_items').insert({
              offer_id: offer.id,
              title: 'Druck & Produktumsetzung auf Anfrage',
              description: buildProductFulfillmentDescription(inquiry as Inquiry),
              quantity: 1,
              unit_price_cents: 0,
              total_cents: 0,
              sort_order: pkgId ? 2 : 1,
            })
          }
        }

        await supabase.from('offers').update({ subtotal_cents: 0, total_cents: 0 }).eq('id', offer.id)

        revalidatePath('/admin/angebot')
        redirect(`/admin/angebot/${offer.id}`)
      }} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Kunde *</label>
          <select name="customer_id" required defaultValue={selectedInquiry?.customer_id || ''} className="w-full rounded-md border border-anthracite/15 bg-white px-3 py-2 text-sm">
            <option value="">Kunde auswählen</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Anfrage (optional)</label>
          <select name="inquiry_id" defaultValue={selectedInquiry?.id || ''} className="w-full rounded-md border border-anthracite/15 bg-white px-3 py-2 text-sm">
            <option value="">Keine</option>
            {inquiries.map(i => (
              <option key={i.id} value={i.id}>{i.message.slice(0, 60)}... ({new Date(i.created_at).toLocaleDateString('de-DE')})</option>
            ))}
          </select>
        </div>

        {selectedInquiry?.product_fulfillment_requested && (
          <div className="rounded-xl border border-ruby/15 bg-ruby/[0.035] p-5 text-sm text-anthracite/75">
            <div className="font-semibold text-anthracite">Produktumsetzung wurde angefragt</div>
            <dl className="mt-3 grid gap-2 sm:grid-cols-2">
              <div><dt className="text-anthracite/55">Produktarten</dt><dd>{formatProductValue(selectedInquiry.product_types) || '—'}</dd></div>
              <div><dt className="text-anthracite/55">Menge</dt><dd>{formatProductValue(selectedInquiry.product_quantity) || '—'}</dd></div>
              <div><dt className="text-anthracite/55">Größen / Ausführung</dt><dd>{formatProductValue(selectedInquiry.product_target_group) || '—'}</dd></div>
              <div><dt className="text-anthracite/55">Farbe</dt><dd>{formatProductValue(selectedInquiry.product_color) || '—'}</dd></div>
              <div><dt className="text-anthracite/55">Designposition</dt><dd>{formatProductValue(selectedInquiry.product_position) || '—'}</dd></div>
              <div className="sm:col-span-2"><dt className="text-anthracite/55">Hinweise</dt><dd className="whitespace-pre-wrap">{formatProductValue(selectedInquiry.product_notes) || '—'}</dd></div>
            </dl>
            <label className="mt-4 flex items-start gap-2 rounded-md border border-anthracite/10 bg-white px-3 py-2">
              <input type="checkbox" name="include_product_fulfillment_item" defaultChecked className="mt-1 accent-ruby" />
              <span>Als optionale Angebotsposition ohne festen Preis vorbereiten.</span>
            </label>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Titel *</label>
          <input name="title" required className="w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm" placeholder="z.B. Logo-Sprint für Ihr Unternehmen" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Einleitungstext</label>
          <textarea name="intro_text" rows={3} className="w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm" placeholder="Vielen Dank für Ihre Anfrage. Hiermit unterbreiten wir Ihnen folgendes Angebot..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Gültig bis</label>
            <input type="date" name="valid_until" className="w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Zahlungsbedingungen</label>
            <input name="payment_terms" defaultValue="Zahlbar innerhalb von 14 Tagen netto." className="w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notizen (intern)</label>
          <textarea name="notes" rows={2} className="w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Erste Position (einfach)</label>
          <select name="package_id" className="w-full rounded-md border border-anthracite/15 bg-white px-3 py-2 text-sm">
            <option value="">— Paket wählen (später erweiterbar)</option>
            {packages.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.price_label})</option>
            ))}
          </select>
          <p className="text-[11px] text-anthracite/50 mt-1">Hinweis: Vollständige Positionen im Detail bearbeiten.</p>
        </div>

        <div className="pt-4">
          <button type="submit" className="rounded-md bg-ruby px-6 py-2.5 text-sm font-semibold text-offwhite hover:bg-ruby/90">
            Angebot erstellen
          </button>
          <Link href="/admin/angebot" className="ml-4 text-sm text-anthracite/60">Abbrechen</Link>
        </div>
      </form>
    </div>
  )
}
