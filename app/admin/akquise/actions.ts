'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendAkquiseEmail(leadId: string, email: string, company: string) {
  if (!process.env.SMTP_HOST) {
    return { error: 'SMTP nicht konfiguriert.' }
  }

  const nodemailer = await import('nodemailer')
  const supabase = await createClient()

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'Klickdesigns <no-reply@klickdesigns.de>',
    to: email,
    subject: `Akquise-Angebot für ${company}`,
    text: `Sehr geehrte Damen und Herren,\n\nwir haben Ihr Unternehmen ${company} als potenziellen Kunden identifiziert.\n\nGerne würden wir Ihnen ein individuelles Angebot für Mediengestaltung unterbreiten.\n\nMit freundlichen Grüßen\nKlickdesigns`,
  })

  await supabase
    .from('acquisition_leads')
    .update({ last_email_sent_at: new Date().toISOString(), contacted_at: new Date().toISOString() })
    .eq('id', leadId)

  revalidatePath('/admin/akquise')
  return { success: true }
}

export async function logActivity(entityId: string, action: string, message: string) {
  const supabase = await createClient()
  // simple log if table exists
  try {
    await supabase.from('activity_logs').insert({
      entity_type: 'acquisition_lead',
      entity_id: entityId,
      action,
      message,
    })
  } catch {}
}
