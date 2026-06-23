'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendOfferEmail(formData: FormData) {
  const nodemailer = await import('nodemailer')
  const supabase = await createClient()

  const id = formData.get('id') as string
  let offer = await (await supabase.from('offers').select('*, customer:customers(name, email)').eq('id', id).single()).data
  if (!offer || !offer.customer?.email) return

  // Ensure public_token exists for acceptance link
  if (!offer.public_token) {
    const newToken = crypto.randomUUID()
    await supabase.from('offers').update({ public_token: newToken }).eq('id', id)
    offer.public_token = newToken
  }

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
  const web = company.website_url || 'https://www.klickdesigns.de'

  const subject = `Ihr Angebot von ${companyName} – ${offer.offer_number}`

  const greetingName = offer.customer?.name ? `Hallo ${offer.customer.name},` : 'Sehr geehrte Damen und Herren,'
  const amount = offer.total_cents ? `${(offer.total_cents / 100).toFixed(2)} ${offer.currency || 'EUR'}` : ''

  const text = `${greetingName}\n\nvielen Dank für Ihr Interesse an einer Zusammenarbeit mit ${companyName}.\n\nAnbei erhalten Sie Ihr individuelles Angebot:\n\nAngebotsnummer: ${offer.offer_number}\n${offer.title ? `Titel: ${offer.title}\n` : ''}${amount ? `Gesamtbetrag: ${amount}\n` : ''}${offer.valid_until ? `Gültig bis: ${new Date(offer.valid_until).toLocaleDateString('de-DE')}\n` : ''}${offerHint ? `\n${offerHint}\n` : ''}\nSie können das Angebot bequem online annehmen: ${link}\n\n${signature}`

  const html = `
    <p>${greetingName}</p>
    <p>vielen Dank für Ihr Interesse an einer Zusammenarbeit mit ${companyName}.</p>
    <p>Anbei erhalten Sie Ihr individuelles Angebot:</p>
    <p>
      <strong>Angebotsnummer:</strong> ${offer.offer_number}<br>
      ${offer.title ? `<strong>Titel:</strong> ${offer.title}<br>` : ''}
      ${amount ? `<strong>Gesamtbetrag:</strong> ${amount}<br>` : ''}
      ${offer.valid_until ? `<strong>Gültig bis:</strong> ${new Date(offer.valid_until).toLocaleDateString('de-DE')}<br>` : ''}
    </p>
    ${offerHint ? `<p>${offerHint}</p>` : ''}
    <p><a href="${link}" style="background:#990000;color:white;padding:10px 20px;text-decoration:none;border-radius:4px;display:inline-block;">Angebot online annehmen</a></p>
    <p style="margin-top:20px;">${signature.replace(/\n/g, '<br>')}</p>
    <hr style="margin:20px 0;border:none;border-top:1px solid #ccc;">
    <p style="font-size:12px;color:#666;">${companyName} • Gerther Straße 76 • 44577 Castrop-Rauxel • ${web}</p>
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
