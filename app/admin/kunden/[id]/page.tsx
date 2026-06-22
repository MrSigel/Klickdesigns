import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

type Customer = {
  id: string
  name: string
  email: string
  phone: string | null
  customer_type: string | null
  company: string | null
  source: string | null
  status: string
  notes: string | null
  created_at: string
  updated_at: string
}

type Inquiry = {
  id: string
  service_type: string
  message: string
  status: string
  created_at: string
}

async function getCustomer(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data as Customer
}

async function getRelatedInquiries(customerId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('inquiries')
    .select('id, service_type, message, status, created_at')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(5)
  return (data || []) as Inquiry[]
}

async function updateCustomer(formData: FormData) {
  'use server'
  const supabase = await createClient()

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string || null
  const customer_type = formData.get('customer_type') as string || null
  const company = formData.get('company') as string || null
  const source = formData.get('source') as string || null
  const status = formData.get('status') as string || 'interessent'
  const notes = formData.get('notes') as string || null

  if (!id || !name || !email) {
    // For simplicity in this task, ignore client error for form
    return
  }

  const { error } = await supabase
    .from('customers')
    .update({ name, email, phone, customer_type, company, source, status, notes })
    .eq('id', id)

  if (error) {
    console.error(error)
    return
  }

  revalidatePath(`/admin/kunden/${id}`)
  revalidatePath('/admin/kunden')
}

export default async function CustomerDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const customer = await getCustomer(id)

  if (!customer) {
    return (
      <div>
        <h1 className="font-display text-[28px] font-bold tracking-[-0.035em] text-anthracite">Kunde nicht gefunden</h1>
        <Link href="/admin/kunden" className="mt-4 inline-block text-ruby hover:underline">Zurück zur Liste</Link>
      </div>
    )
  }

  const relatedInquiries = await getRelatedInquiries(id)

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-[28px] font-bold tracking-[-0.035em] text-anthracite">{customer.name}</h1>
          <p className="text-anthracite/70">{customer.email}</p>
        </div>
        <Link href="/admin/kunden" className="text-sm text-anthracite/60 hover:text-anthracite">← Zurück zur Liste</Link>
      </div>

      {/* Stammdaten */}
      <div className="rounded-xl border border-anthracite/10 bg-white p-6 mb-6">
        <h2 className="font-semibold mb-4">Stammdaten</h2>

        <form action={updateCustomer} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="hidden" name="id" value={customer.id} />

          <div>
            <label className="text-xs text-anthracite/70">Name</label>
            <input name="name" defaultValue={customer.name} className="w-full rounded border border-anthracite/15 px-3 py-2 text-sm mt-1" required />
          </div>
          <div>
            <label className="text-xs text-anthracite/70">E-Mail</label>
            <input type="email" name="email" defaultValue={customer.email} className="w-full rounded border border-anthracite/15 px-3 py-2 text-sm mt-1" required />
          </div>
          <div>
            <label className="text-xs text-anthracite/70">Telefon</label>
            <input name="phone" defaultValue={customer.phone || ''} className="w-full rounded border border-anthracite/15 px-3 py-2 text-sm mt-1" />
          </div>
          <div>
            <label className="text-xs text-anthracite/70">Firma</label>
            <input name="company" defaultValue={customer.company || ''} className="w-full rounded border border-anthracite/15 px-3 py-2 text-sm mt-1" />
          </div>

          <div>
            <label className="text-xs text-anthracite/70">Kundentyp</label>
            <select name="customer_type" defaultValue={customer.customer_type || ''} className="w-full rounded border border-anthracite/15 px-3 py-2 text-sm mt-1">
              <option value="">—</option>
              <option value="unternehmen">Unternehmen</option>
              <option value="verein">Verein</option>
              <option value="creator">Creator</option>
              <option value="privatkunde">Privatkunde</option>
              <option value="shop">Shop</option>
              <option value="sonstiges">Sonstiges</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-anthracite/70">Quelle</label>
            <select name="source" defaultValue={customer.source || ''} className="w-full rounded border border-anthracite/15 px-3 py-2 text-sm mt-1">
              <option value="">—</option>
              <option value="website">Website</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="social_media">Social Media</option>
              <option value="lokal">Lokal</option>
              <option value="empfehlung">Weiterempfehlung</option>
              <option value="google">Google</option>
              <option value="sonstiges">Sonstiges</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-anthracite/70">Status</label>
            <select name="status" defaultValue={customer.status} className="w-full rounded border border-anthracite/15 px-3 py-2 text-sm mt-1">
              <option value="interessent">Interessent</option>
              <option value="kunde">Kunde</option>
              <option value="stammkunde">Stammkunde</option>
              <option value="archiviert">Archiviert</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs text-anthracite/70">Notizen</label>
            <textarea name="notes" defaultValue={customer.notes || ''} rows={4} className="w-full rounded border border-anthracite/15 px-3 py-2 text-sm mt-1" />
          </div>

          <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
            <button type="submit" className="rounded-md bg-ruby px-5 py-2 text-sm font-semibold text-offwhite">Speichern</button>
          </div>
        </form>
      </div>

      {/* Related */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-anthracite/10 bg-white p-6">
          <h3 className="font-medium mb-3">Anfragen dieses Kunden</h3>
          {relatedInquiries.length === 0 ? (
            <p className="text-sm text-anthracite/60">Keine Anfragen.</p>
          ) : (
            <ul className="text-sm space-y-2">
              {relatedInquiries.map((i) => (
                <li key={i.id}>
                  {i.service_type} — {i.status} <span className="text-anthracite/50">({new Date(i.created_at).toLocaleDateString('de-DE')})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-anthracite/10 bg-white p-6">
          <h3 className="font-medium mb-3">Angebote & Rechnungen</h3>
          <p className="text-sm text-anthracite/60">Bereich in Vorbereitung.</p>
        </div>
      </div>

      <div className="mt-8">
        <a href={`mailto:${customer.email}`} className="text-sm text-ruby hover:underline">
          E-Mail an {customer.name} senden
        </a>
        <p className="text-[11px] text-anthracite/50 mt-1">(E-Mail-Versand wird im nächsten Schritt eingerichtet.)</p>
      </div>
    </div>
  )
}
