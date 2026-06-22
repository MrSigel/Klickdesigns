'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitInquiry(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const company = formData.get('company') as string || null
  const service = formData.get('service') as string || null
  const have = formData.get('have') as string || null
  const message = formData.get('message') as string

  if (!name || !email || !message) {
    return { error: 'Bitte Name, E-Mail und Beschreibung angeben.' }
  }

  const { error } = await supabase.from('inquiries').insert({
    name,
    email,
    company,
    service_type: service,
    existing_material: have,
    message,
    status: 'new',
    priority: 'normal',
    source: 'website',
    consent_privacy: true,
  })

  if (error) {
    console.error('Inquiry insert error:', error)
    return { error: 'Fehler beim Senden der Anfrage. Bitte später erneut versuchen.' }
  }

  // optional confirmation email
  if (process.env.SMTP_HOST) {
    try {
      const nodemailer = await import('nodemailer')
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
      })
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'Klickdesigns <no-reply@klickdesigns.de>',
        to: email,
        subject: 'Ihre Anfrage bei Klickdesigns ist eingegangen',
        text: `Hallo ${name},\n\nvielen Dank für Ihre Anfrage. Wir prüfen diese und melden uns in Kürze.\n\nMit freundlichen Grüßen\nKlickdesigns`,
      })
      await supabase.from('inquiries').update({ confirmation_email_sent_at: new Date().toISOString() }).eq('email', email).eq('message', message)
    } catch (e) {
      console.error('Confirmation email failed (non-critical):', e)
    }
  }

  revalidatePath('/admin/anfragen')
  return { success: true }
}
