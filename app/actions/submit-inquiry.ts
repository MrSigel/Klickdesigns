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

  // Handle optional file uploads
  const uploadedFiles: Array<{ name: string; path: string; size: number; type: string }> = []
  const files = formData.getAll('files') as File[]
  const maxSize = 10 * 1024 * 1024 // 10 MB
  const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf', 'image/svg+xml']

  for (const file of files) {
    if (!file || file.size === 0) continue
    if (file.size > maxSize) {
      return { error: 'Eine Datei überschreitet die maximale Größe von 10 MB.' }
    }
    const isSvg = file.name.toLowerCase().endsWith('.svg')
    if (!allowed.includes(file.type) && !isSvg) {
      return { error: 'Ungültiges Dateiformat. Erlaubt: PNG, JPG, SVG, PDF, WEBP.' }
    }
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 60) || 'file'
    const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`
    const { error: upErr } = await supabase.storage.from('inquiry-uploads').upload(path, file, { upsert: false })
    if (upErr) {
      console.error('File upload error:', upErr)
      return { error: 'Datei-Upload fehlgeschlagen. Bitte später erneut versuchen.' }
    }
    uploadedFiles.push({
      name: file.name,
      path,
      size: file.size,
      type: file.type || (isSvg ? 'image/svg+xml' : 'application/octet-stream')
    })
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
    uploaded_files: uploadedFiles.length > 0 ? uploadedFiles : null,
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
