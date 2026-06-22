import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type Inquiry = {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  project_name: string | null
  service_type: string | null
  existing_material: string | null
  message: string
  status: string
  priority: string
  source: string | null
  internal_notes: string | null
  customer_id: string | null
  created_at: string
}

type Customer = {
  id: string
  name: string
  email: string
}

async function getInquiry(id: string) {
  const supabase = await createClient()
  const { data } = await supabase.from('inquiries').select('*').eq('id', id).single()
  return data as Inquiry | null
}

async function getCustomers() {
  const supabase = await createClient()
  const { data } = await supabase.from('customers').select('id, name, email').order('name').limit(200)
  return (data || []) as Customer[]
}

async function updateInquiry(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const id = formData.get('id') as string
  const status = formData.get('status') as string
  const priority = formData.get('priority') as string
  const internal_notes = formData.get('internal_notes') as string || null
  const customer_id = formData.get('customer_id') as string || null

  const { error } = await supabase.from('inquiries').update({
    status,
    priority,
    internal_notes,
    customer_id: customer_id || null,
  }).eq('id', id)

  if (error) {
    console.error(error)
  }
  revalidatePath(`/admin/anfragen/${id}`)
}

async function createCustomerFromInquiry(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const inquiryId = formData.get('inquiry_id') as string

  const inquiry = await (await supabase.from('inquiries').select('*').eq('id', inquiryId).single()).data
  if (!inquiry) return

  // check if customer with email exists
  const { data: existing } = await supabase.from('customers').select('id').eq('email', inquiry.email).maybeSingle()
  if (existing) {
    await supabase.from('inquiries').update({ customer_id: existing.id }).eq('id', inquiryId)
    revalidatePath(`/admin/anfragen/${inquiryId}`)
    return
  }

  const { data: newCust, error } = await supabase.from('customers').insert({
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    company: inquiry.company,
    source: inquiry.source || 'website',
    status: 'interessent',
  }).select('id').single()

  if (error || !newCust) return

  await supabase.from('inquiries').update({ customer_id: newCust.id }).eq('id', inquiryId)
  revalidatePath(`/admin/anfragen/${inquiryId}`)
}

export default async function InquiryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const inquiry = await getInquiry(id)
  const customers = await getCustomers()

  if (!inquiry) {
    return <div>Anfrage nicht gefunden. <Link href="/admin/anfragen">Zurück</Link></div>
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/anfragen" className="text-sm text-anthracite/60 hover:text-anthracite">← Zurück zur Liste</Link>
      </div>

      <h1 className="font-display text-[28px] font-bold tracking-[-0.035em] text-anthracite mb-1">{inquiry.name}</h1>
      <p className="text-anthracite/70 mb-6">{inquiry.email} {inquiry.phone ? `· ${inquiry.phone}` : ''}</p>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-xl border border-anthracite/10 bg-white p-6">
            <h2 className="font-semibold mb-4">Anfrage-Details</h2>
            <dl className="space-y-3 text-sm">
              <div><dt className="text-anthracite/60">Firma / Projekt</dt><dd>{inquiry.company || inquiry.project_name || '—'}</dd></div>
              <div><dt className="text-anthracite/60">Leistung</dt><dd>{inquiry.service_type || '—'}</dd></div>
              <div><dt className="text-anthracite/60">Vorhandenes Material</dt><dd>{inquiry.existing_material || '—'}</dd></div>
              <div><dt className="text-anthracite/60">Quelle</dt><dd>{inquiry.source || 'website'}</dd></div>
              <div><dt className="text-anthracite/60">Eingegangen</dt><dd>{new Date(inquiry.created_at).toLocaleString('de-DE')}</dd></div>
            </dl>
          </div>

          <div className="rounded-xl border border-anthracite/10 bg-white p-6">
            <h2 className="font-semibold mb-2">Nachricht</h2>
            <p className="text-sm whitespace-pre-wrap text-anthracite/80">{inquiry.message}</p>
          </div>
        </div>

        <div className="space-y-6">
          <form action={updateInquiry} className="rounded-xl border border-anthracite/10 bg-white p-6 space-y-4">
            <input type="hidden" name="id" value={inquiry.id} />

            <div>
              <label className="block text-xs text-anthracite/70 mb-1">Status</label>
              <select name="status" defaultValue={inquiry.status} className="w-full rounded border border-anthracite/15 px-3 py-2 text-sm">
                {['new','viewed','in_progress','waiting_for_customer','offer_sent','completed','archived'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs text-anthracite/70 mb-1">Priorität</label>
              <select name="priority" defaultValue={inquiry.priority} className="w-full rounded border border-anthracite/15 px-3 py-2 text-sm">
                {['low','normal','high'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs text-anthracite/70 mb-1">Interne Notizen</label>
              <textarea name="internal_notes" defaultValue={inquiry.internal_notes || ''} rows={4} className="w-full rounded border border-anthracite/15 px-3 py-2 text-sm" />
            </div>

            <div>
              <label className="block text-xs text-anthracite/70 mb-1">Kunde zuordnen</label>
              <select name="customer_id" defaultValue={inquiry.customer_id || ''} className="w-full rounded border border-anthracite/15 px-3 py-2 text-sm">
                <option value="">— Kein Kunde</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                ))}
              </select>
            </div>

            <button type="submit" className="mt-2 rounded-md bg-anthracite px-4 py-2 text-sm text-offwhite">Speichern</button>
          </form>

          <div className="rounded-xl border border-anthracite/10 bg-white p-6">
            <h2 className="font-semibold mb-3">Aktionen</h2>
            <div className="space-y-2">
              <form action={createCustomerFromInquiry}>
                <input type="hidden" name="inquiry_id" value={inquiry.id} />
                <button type="submit" className="w-full text-left rounded-md border border-anthracite/20 px-4 py-2 text-sm hover:bg-anthracite/5">
                  Kunde erstellen / verknüpfen
                </button>
              </form>

              <Link href={`/admin/angebot/neu?inquiryId=${inquiry.id}`} className="block w-full text-left rounded-md border border-anthracite/20 px-4 py-2 text-sm hover:bg-anthracite/5">
                Angebot erstellen
              </Link>

              <a href={`mailto:${inquiry.email}`} className="block w-full text-left rounded-md border border-anthracite/20 px-4 py-2 text-sm hover:bg-anthracite/5">
                Antwort senden (E-Mail)
              </a>
              <p className="text-[11px] text-anthracite/50 mt-1">E-Mail-Versand wird im nächsten Schritt eingerichtet.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-anthracite/50 mt-8">
        Status: {inquiry.status} · Priorität: {inquiry.priority} · Quelle: {inquiry.source}
      </div>
    </div>
  )
}
