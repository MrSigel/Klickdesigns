'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendOfferEmail(formData: FormData) {
  const nodemailer = await import('nodemailer')
  const supabase = await createClient()

  const id = formData.get('id') as string
  const offer = await (await supabase.from('offers').select('*, customer:customers(name, email)').eq('id', id).single()).data
  if (!offer || !offer.customer?.email) return

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  const link = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/angebot/${offer.public_token}`

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'Klickdesigns <no-reply@klickdesigns.de>',
    to: offer.customer.email,
    subject: `Ihr Angebot von Klickdesigns - ${offer.offer_number}`,
    text: `Sehr geehrte Damen und Herren,\n\nanbei Ihr Angebot.\n\nAngebotsnummer: ${offer.offer_number}\nGültig bis: ${offer.valid_until || '—'}\n\nOnline annehmen: ${link}\n\nMit freundlichen Grüßen\nKlickdesigns`,
    html: `<p>Sehr geehrte Damen und Herren,</p><p>anbei Ihr Angebot.</p><p><strong>Angebotsnummer:</strong> ${offer.offer_number}<br><strong>Gültig bis:</strong> ${offer.valid_until || '—'}</p><p><a href="${link}">Online annehmen</a></p><p>Mit freundlichen Grüßen<br>Klickdesigns</p>`,
  })

  await supabase.from('offers').update({ sent_at: new Date().toISOString() }).eq('id', id)
  revalidatePath(`/admin/angebot/${id}`)
}

export async function updateOffer(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const intro_text = formData.get('intro_text') as string || null
  const valid_until = formData.get('valid_until') as string || null
  const payment_terms = formData.get('payment_terms') as string || null
  const notes = formData.get('notes') as string || null

  if (!id || !title) return

  await supabase.from('offers').update({
    title,
    intro_text,
    valid_until: valid_until || null,
    payment_terms,
    notes,
  }).eq('id', id)

  revalidatePath(`/admin/angebot/${id}`)
}
