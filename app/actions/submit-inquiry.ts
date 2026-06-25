'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

function cleanText(value: FormDataEntryValue | null) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function cleanList(formData: FormData, key: string) {
  const values = formData
    .getAll(key)
    .filter((value): value is string => typeof value === 'string')
    .map((value) => value.trim())
    .filter(Boolean)

  return values.length > 0 ? values : null
}

function normalizeServiceType(value: string | null) {
  if (!value) return null
  const map: Record<string, string> = {
    'Logo-Sprint': 'logo_sprint',
    'Logo-Vektorisierung': 'logo_vectorization',
    'Design-Finalisierung': 'design_finalization',
    'Business-Auftritt': 'business_presence',
    'Sticker-Design': 'sticker_design',
    'Social-Media-Design': 'social_media_design',
    'Flyer-Design': 'flyer_design',
    Sonstiges: 'other',
  }

  return map[value] || value
}

function normalizeExistingMaterial(value: string | null) {
  if (!value) return null
  const map: Record<string, string> = {
    Logo: 'logo',
    'PNG/JPG': 'png_jpg',
    Screenshot: 'screenshot',
    Flyer: 'flyer',
    'Social-Media-Design': 'social_media_design',
    'Noch nichts': 'nothing',
    Sonstiges: 'other',
  }

  return map[value] || value
}

export async function submitInquiry(formData: FormData) {
  const supabase = await createClient()

  const name = cleanText(formData.get('name'))
  const email = cleanText(formData.get('email'))
  const phone = cleanText(formData.get('phone'))
  const company = cleanText(formData.get('company'))
  const service = normalizeServiceType(cleanText(formData.get('service')))
  const have = normalizeExistingMaterial(cleanText(formData.get('have')))
  const message = cleanText(formData.get('message'))
  const productFulfillmentRequested = formData.get('product_fulfillment_requested') === 'true'
  const productTypes = productFulfillmentRequested ? cleanList(formData, 'product_types') : null
  const productQuantity = productFulfillmentRequested ? cleanText(formData.get('product_quantity')) : null
  const productTargetGroup = productFulfillmentRequested ? cleanList(formData, 'product_target_group') : null
  const productColor = productFulfillmentRequested ? cleanText(formData.get('product_color')) : null
  const productPosition = productFulfillmentRequested ? cleanList(formData, 'product_position') : null
  const productNotes = productFulfillmentRequested ? cleanText(formData.get('product_notes')) : null

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
    phone,
    company,
    service_type: service,
    existing_material: have,
    message,
    product_fulfillment_requested: productFulfillmentRequested,
    product_types: productTypes,
    product_quantity: productQuantity,
    product_target_group: productTargetGroup,
    product_color: productColor,
    product_position: productPosition,
    product_notes: productNotes,
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
