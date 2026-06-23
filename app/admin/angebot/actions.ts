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

  // Load settings for professional template
  const { data: settings } = await supabase.from('settings').select('setting_key, setting_value')
  const map = Object.fromEntries((settings || []).map((s: any) => [s.setting_key, s.setting_value || {}]))
  const company = map.company_profile || {}
  const emailSet = map.email_settings || {}

  const companyName = company.brand_name || 'Klickdesigns'
  const sender = emailSet.sender_name || companyName
  const signature = emailSet.signature || `Mit freundlichen Grüßen\n${companyName}`
  const offerHint = emailSet.offer_email_hint || ''

  const subject = `Ihr Angebot von ${companyName} – ${offer.offer_number}`

  const text = `Sehr geehrte Damen und Herren,\n\nanbei erhalten Sie Ihr Angebot.\n\nAngebotsnummer: ${offer.offer_number}\n${offer.valid_until ? `Gültig bis: ${new Date(offer.valid_until).toLocaleDateString('de-DE')}\n` : ''}${offerHint ? `\n${offerHint}\n` : ''}\nOnline annehmen: ${link}\n\n${signature}`

  const html = `
    <p>Sehr geehrte Damen und Herren,</p>
    <p>anbei erhalten Sie Ihr Angebot.</p>
    <p><strong>Angebotsnummer:</strong> ${offer.offer_number}${offer.valid_until ? `<br><strong>Gültig bis:</strong> ${new Date(offer.valid_until).toLocaleDateString('de-DE')}` : ''}</p>
    ${offerHint ? `<p>${offerHint}</p>` : ''}
    <p><a href="${link}">Online annehmen</a></p>
    <p>${signature.replace(/\n/g, '<br>')}</p>
  `

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `${sender} <no-reply@klickdesigns.de>`,
    to: offer.customer.email,
    subject,
    text,
    html,
  })

  await supabase.from('offers').update({ sent_at: new Date().toISOString() }).eq('id', id)
  // log email
  try {
    await supabase.from('email_logs').insert({
      recipient: offer.customer.email,
      subject,
      template_type: 'offer',
      status: 'sent',
      reference_type: 'offer',
      reference_id: id,
    })
  } catch {}
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
