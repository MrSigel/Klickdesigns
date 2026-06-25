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
  product_fulfillment_requested: boolean | null
  product_types: string[] | null
  product_quantity: string | null
  product_target_group: string[] | null
  product_color: string | null
  product_position: string[] | null
  product_notes: string | null
  uploaded_files?: Array<{ name: string; path: string; size?: number; type?: string }> | null
}

type Customer = {
  id: string
  name: string
  email: string
}
function formatProductValue(value: string[] | string | null | undefined) {
  if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : '—'
  return value || '—'
}

async function getInquiry(id: string) {
  const supabase = await createClient()
  const { data } = await supabase.from('inquiries').select('*').eq('id', id).single()
  return data as Inquiry | null
}

async function sendInquiryEmail(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const id = formData.get('id') as string

  const inquiry = await (await supabase.from('inquiries').select('*').eq('id', id).single()).data
  if (!inquiry || !inquiry.email) return

  if (!process.env.SMTP_HOST) {
    console.error('SMTP not configured')
    return
  }

  const nodemailer = await import('nodemailer')

  const { data: settingsData } = await supabase.from('settings').select('setting_key, setting_value')
  const map = Object.fromEntries((settingsData || []).map((s: any) => [s.setting_key, s.setting_value || {}]))
  const emailSet = map.email_settings || {}
  const company = map.company_profile || {}

  const companyName = company.brand_name || 'Klickdesigns'
  const senderName = emailSet.sender_name || companyName
  const signature = emailSet.signature || `Mit freundlichen Grüßen\n${companyName}`
  const hint = emailSet.inquiry_confirmation_hint || 'Wir melden uns in Kürze bei Ihnen.'

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  const subject = `Ihre Anfrage bei ${companyName}`
  const text = `Hallo ${inquiry.name},\n\nvielen Dank für Ihre Anfrage${inquiry.project_name ? ` zu "${inquiry.project_name}"` : ''}.\n\n${hint}\n\n${signature}`
  const html = `<p>Hallo ${inquiry.name},</p><p>vielen Dank für Ihre Anfrage${inquiry.project_name ? ` zu "${inquiry.project_name}"` : ''}.</p><p>${hint}</p><p>${signature.replace(/\n/g, '<br>')}</p>`

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `${senderName} <no-reply@klickdesigns.de>`,
    to: inquiry.email,
    subject,
    text,
    html,
  })

  // update status to viewed if still new
  if (inquiry.status === 'new') {
    await supabase.from('inquiries').update({ status: 'viewed' }).eq('id', id)
  }

  redirect(`/admin/anfragen/${id}?success=email`)
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
  redirect(`/admin/anfragen/${id}?success=updated`)
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
    redirect(`/admin/anfragen/${inquiryId}?success=customer`)
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
  redirect(`/admin/anfragen/${inquiryId}?success=customer`)
}

export default async function InquiryDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams?: Promise<{ success?: string }> }) {
  const { id } = await params
  const sp = await (searchParams || Promise.resolve({ success: undefined }))
  const success = sp.success
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

      {success && (
        <div className="mb-4 rounded-md bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
          {success === 'updated' && 'Änderungen gespeichert.'}
          {success === 'customer' && 'Kunde erstellt/verknüpft.'}
          {success === 'email' && 'E-Mail gesendet.'}
        </div>
      )}

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
            <h2 className="font-semibold mb-4">Produktumsetzung</h2>
            {inquiry.product_fulfillment_requested ? (
              <dl className="space-y-3 text-sm">
                <div><dt className="text-anthracite/60">Produktumsetzung gewünscht</dt><dd>Ja</dd></div>
                <div><dt className="text-anthracite/60">Produktarten</dt><dd>{formatProductValue(inquiry.product_types)}</dd></div>
                <div><dt className="text-anthracite/60">Menge</dt><dd>{formatProductValue(inquiry.product_quantity)}</dd></div>
                <div><dt className="text-anthracite/60">Größen / Ausführung</dt><dd>{formatProductValue(inquiry.product_target_group)}</dd></div>
                <div><dt className="text-anthracite/60">Farbe</dt><dd>{formatProductValue(inquiry.product_color)}</dd></div>
                <div><dt className="text-anthracite/60">Designposition</dt><dd>{formatProductValue(inquiry.product_position)}</dd></div>
                <div><dt className="text-anthracite/60">Zusätzliche Hinweise</dt><dd className="whitespace-pre-wrap">{formatProductValue(inquiry.product_notes)}</dd></div>
              </dl>
            ) : (
              <p className="text-sm text-anthracite/55">Nicht angefragt</p>
            )}
          </div>

          <div className="rounded-xl border border-anthracite/10 bg-white p-6">
            <h2 className="font-semibold mb-2">Nachricht</h2>
            <p className="text-sm whitespace-pre-wrap text-anthracite/80">{inquiry.message}</p>
          </div>

          {inquiry.uploaded_files && inquiry.uploaded_files.length > 0 && (
            <div>
              <label className="block text-xs text-anthracite/70 mb-1">Hochgeladene Dateien</label>
              <ul className="text-sm space-y-1">
                {inquiry.uploaded_files.map((f, i) => {
                  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/inquiry-uploads/${f.path}`
                  return (
                    <li key={i}>
                      <a href={url} target="_blank" rel="noopener" className="text-ruby hover:underline">
                        {f.name} {f.size ? `(${(f.size/1024/1024).toFixed(1)} MB)` : ''}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <form action={updateInquiry} className="rounded-xl border border-anthracite/10 bg-white p-6 space-y-4">
            <input type="hidden" name="id" value={inquiry.id} />

            <div>
              <label className="block text-xs text-anthracite/70 mb-1">Status</label>
              <select name="status" defaultValue={inquiry.status} className="w-full rounded border border-anthracite/15 px-3 py-2 text-sm">
                {[
                  {value: 'new', label: 'Neu'},
                  {value: 'viewed', label: 'Gesehen'},
                  {value: 'in_progress', label: 'In Bearbeitung'},
                  {value: 'waiting_for_customer', label: 'Warte auf Kunden'},
                  {value: 'offer_sent', label: 'Angebot gesendet'},
                  {value: 'completed', label: 'Abgeschlossen'},
                  {value: 'archived', label: 'Archiviert'},
                ].map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs text-anthracite/70 mb-1">Priorität</label>
              <select name="priority" defaultValue={inquiry.priority} className="w-full rounded border border-anthracite/15 px-3 py-2 text-sm">
                {[
                  {value: 'low', label: 'Niedrig'},
                  {value: 'normal', label: 'Normal'},
                  {value: 'high', label: 'Hoch'},
                ].map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
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

              <form action={sendInquiryEmail}>
                <input type="hidden" name="id" value={inquiry.id} />
                <button type="submit" className="w-full text-left rounded-md border border-anthracite/20 px-4 py-2 text-sm hover:bg-anthracite/5">
                  Antwort per E-Mail senden
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-anthracite/50 mt-8">
        Status: {[
          {value: 'new', label: 'Neu'},
          {value: 'viewed', label: 'Gesehen'},
          {value: 'in_progress', label: 'In Bearbeitung'},
          {value: 'waiting_for_customer', label: 'Warte auf Kunden'},
          {value: 'offer_sent', label: 'Angebot gesendet'},
          {value: 'completed', label: 'Abgeschlossen'},
          {value: 'archived', label: 'Archiviert'},
        ].find(s => s.value === inquiry.status)?.label || inquiry.status} · Priorität: {[
          {value: 'low', label: 'Niedrig'},
          {value: 'normal', label: 'Normal'},
          {value: 'high', label: 'Hoch'},
        ].find(p => p.value === inquiry.priority)?.label || inquiry.priority} · Quelle: {inquiry.source}
      </div>
    </div>
  )
}
