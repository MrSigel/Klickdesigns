import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import PDFDownloadButton from './PDFDownloadButton'

type Invoice = {
  id: string
  invoice_number: string
  title: string
  notes: string | null
  subtotal_cents: number
  discount_cents: number
  total_cents: number
  currency: string
  status: string
  invoice_date: string
  due_date: string | null
  payment_terms: string | null
  sent_at: string | null
  paid_at: string | null
  cancelled_at: string | null
  customer: { name: string; email: string } | null
  items?: any[]
}

async function getInvoice(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('invoices')
    .select(`
      *,
      customer:customers (name, email),
      items:invoice_items (id, title, description, quantity, unit_price_cents, total_cents)
    `)
    .eq('id', id)
    .single()
  return data as Invoice | null
}

async function updateInvoice(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const id = formData.get('id') as string
  const payment_terms = formData.get('payment_terms') as string || null
  const due_date = formData.get('due_date') as string || null
  const notes = formData.get('notes') as string || null

  await supabase.from('invoices').update({ payment_terms, due_date: due_date || null, notes }).eq('id', id)
  revalidatePath(`/admin/rechnung/${id}`)
}

async function markPaid(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const id = formData.get('id') as string
  await supabase.from('invoices').update({ status: 'paid', paid_at: new Date().toISOString() }).eq('id', id)
  revalidatePath(`/admin/rechnung/${id}`)
}

async function cancelInvoice(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const id = formData.get('id') as string
  await supabase.from('invoices').update({ status: 'cancelled', cancelled_at: new Date().toISOString() }).eq('id', id)
  revalidatePath(`/admin/rechnung/${id}`)
}

async function sendInvoiceEmail(formData: FormData) {
  'use server'
  const nodemailer = await import('nodemailer')
  const supabase = await createClient()
  const id = formData.get('id') as string

  const inv = await (await supabase.from('invoices').select('*, customer:customers(name, email)').eq('id', id).single()).data
  if (!inv || !inv.customer?.email) return

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  })

  const { data: settings } = await supabase.from('settings').select('setting_key, setting_value')
  const map = Object.fromEntries((settings || []).map((s: any) => [s.setting_key, s.setting_value || {}]))
  const company = map.company_profile || {}
  const emailSet = map.email_settings || {}
  const billing = map.billing_settings || {}

  const companyName = company.brand_name || 'Klickdesigns'
  const sender = emailSet.sender_name || companyName
  const signature = emailSet.signature || `Mit freundlichen Grüßen\n${companyName}`
  const invoiceHint = emailSet.invoice_email_hint || ''
  const bank = billing.bank_holder ? `Kontoinhaber: ${billing.bank_holder}\nIBAN: ${billing.bank_iban || ''}\nBIC: ${billing.bank_bic || ''}\nBank: ${billing.bank_name || ''}` : ''

  const subject = `Ihre Rechnung von ${companyName} – ${inv.invoice_number}`

  const text = `Sehr geehrte Damen und Herren,\n\nanbei Ihre Rechnung ${inv.invoice_number}.\n\nBetrag: ${(inv.total_cents/100).toFixed(2)} ${inv.currency}\n${inv.due_date ? `Fällig: ${new Date(inv.due_date).toLocaleDateString('de-DE')}\n` : ''}${invoiceHint ? `\n${invoiceHint}\n` : ''}\n${bank ? `\nZahlung:\n${bank}\nVerwendungszweck: ${inv.invoice_number}\n` : ''}\n${signature}`

  const html = `
    <p>Sehr geehrte Damen und Herren,</p>
    <p>anbei Ihre Rechnung ${inv.invoice_number}.</p>
    <p><strong>Betrag:</strong> ${(inv.total_cents/100).toFixed(2)} ${inv.currency}${inv.due_date ? `<br><strong>Fällig:</strong> ${new Date(inv.due_date).toLocaleDateString('de-DE')}` : ''}</p>
    ${invoiceHint ? `<p>${invoiceHint}</p>` : ''}
    ${bank ? `<p><strong>Zahlung:</strong><br>${bank.replace(/\n/g,'<br>')}<br>Verwendungszweck: ${inv.invoice_number}</p>` : ''}
    <p>${signature.replace(/\n/g, '<br>')}</p>
  `

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `${sender} <no-reply@klickdesigns.de>`,
    to: inv.customer.email,
    subject,
    text,
    html,
  })

  await supabase.from('invoices').update({ sent_at: new Date().toISOString() }).eq('id', id)
  revalidatePath(`/admin/rechnung/${id}`)
}

export default async function InvoiceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const invoice = await getInvoice(id)

  if (!invoice) {
    return <div>Rechnung nicht gefunden. <Link href="/admin/rechnung">Zurück</Link></div>
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/rechnung" className="text-sm text-anthracite/60">← Zurück</Link>
      </div>

      <div className="flex justify-between mb-8">
        <div>
          <h1 className="font-display text-[28px] font-bold tracking-[-0.035em] text-anthracite">{invoice.invoice_number}</h1>
          <p className="text-xl text-anthracite/80">{invoice.title}</p>
          <p className="text-sm text-anthracite/60">{invoice.customer?.name} — {invoice.customer?.email}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold tabular-nums">{(invoice.total_cents / 100).toFixed(2)} {invoice.currency}</div>
          <div className="text-sm text-anthracite/60">Fällig: {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('de-DE') : '—'}</div>
        </div>
      </div>

      <div className="mb-8 flex gap-3 flex-wrap">
        <PDFDownloadButton invoice={invoice} />
        <form action={sendInvoiceEmail}>
          <input type="hidden" name="id" value={invoice.id} />
          <button type="submit" className="rounded-md border border-anthracite/20 px-4 py-2 text-sm hover:border-ruby/40">Per E-Mail senden</button>
        </form>
        {invoice.status === 'open' && (
          <>
            <form action={markPaid}>
              <input type="hidden" name="id" value={invoice.id} />
              <button type="submit" className="rounded-md border border-green-600 text-green-700 px-4 py-2 text-sm hover:bg-green-50">Als bezahlt markieren</button>
            </form>
            <form action={cancelInvoice}>
              <input type="hidden" name="id" value={invoice.id} />
              <button type="submit" className="rounded-md border border-red-600 text-red-700 px-4 py-2 text-sm hover:bg-red-50">Stornieren</button>
            </form>
          </>
        )}
      </div>

      <form action={updateInvoice} className="rounded-xl border border-anthracite/10 bg-white p-6 mb-8 space-y-4">
        <input type="hidden" name="id" value={invoice.id} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-anthracite/70">Zahlungsbedingungen</label>
            <input name="payment_terms" defaultValue={invoice.payment_terms || ''} className="w-full rounded border border-anthracite/15 px-3 py-2 text-sm mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-anthracite/70">Fälligkeitsdatum</label>
            <input type="date" name="due_date" defaultValue={invoice.due_date || ''} className="w-full rounded border border-anthracite/15 px-3 py-2 text-sm mt-1" />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-anthracite/70">Notizen</label>
          <textarea name="notes" defaultValue={invoice.notes || ''} rows={3} className="w-full rounded border border-anthracite/15 px-3 py-2 text-sm mt-1" />
        </div>

        <button type="submit" className="rounded-md bg-anthracite text-offwhite px-5 py-2 text-sm">Speichern</button>
      </form>

      {invoice.items && invoice.items.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold mb-2">Positionen</h3>
          <ul className="text-sm space-y-1">
            {invoice.items.map((it: any) => (
              <li key={it.id}>{it.title} × {it.quantity} — {(it.total_cents/100).toFixed(2)} {invoice.currency}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-sm text-anthracite/60">
        Status: {invoice.paid_at ? 'bezahlt' : invoice.cancelled_at ? 'storniert' : 'offen'} · Rechnungsdatum: {new Date(invoice.invoice_date).toLocaleDateString('de-DE')}
      </div>

      <p className="mt-8 text-xs text-anthracite/50">PDF und E-Mail sind implementiert. Markierung als bezahlt/storniert direkt möglich.</p>
    </div>
  )
}
