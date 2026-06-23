'use client'

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { createClient } from '@/lib/supabase/client'

export default function PDFDownloadButton({ offer }: { offer: any }) {
  const handleDownload = async () => {
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const { width, height } = page.getSize()

    // Brand colors
    const anthracite = rgb(0.122, 0.106, 0.106)
    const ruby = rgb(0.6, 0, 0)

    // Load settings for dynamic company data
    const supabase = createClient()
    const { data: settingsData } = await supabase.from('settings').select('setting_key, setting_value')
    const map = Object.fromEntries((settingsData || []).map((s: any) => [s.setting_key, s.setting_value || {}]))
    const company = map.company_profile || {}
    const billing = map.billing_settings || {}

    const companyName = company.brand_name || 'Klickdesigns'
    const operator = company.operator || 'Enrico Gross'
    const street = company.street || 'Gerther Straße 76'
    const city = `${company.postal_code || '44577'} ${company.city || 'Castrop-Rauxel'}`
    const emailC = company.email || 'kontakt@klickdesigns.de'
    const phoneC = company.phone || '+49 155 63535989'
    const web = company.website_url || 'https://www.klickdesigns.de'

    const bankInfo = billing.bank_holder ? `Kontoinhaber: ${billing.bank_holder}\nIBAN: ${billing.bank_iban || ''}\nBIC: ${billing.bank_bic || ''}` : 'IBAN: DE17100101788022253533\nBIC: REVODEB2 (Revolut)'

    const smallHint = billing.small_business_notice_enabled ? (billing.small_business_notice_text || 'Gemäß § 19 Abs. 1 UStG wird keine Umsatzsteuer ausgewiesen.') : ''

    // Load logo
    let logoImage: any = null
    try {
      const logoBytes = await fetch('/brand/klickdesigns-logo.png').then(res => res.arrayBuffer())
      logoImage = await pdfDoc.embedPng(logoBytes)
    } catch (e) {
      console.warn('Logo load failed, using text only')
    }

    const drawText = (text: string, y: number, size = 11, color = anthracite) => {
      page.drawText(text, {
        x: 50,
        y: height - y,
        size,
        font,
        color,
      })
    }

    let y = 40

    // Header with logo
    if (logoImage) {
      page.drawImage(logoImage, {
        x: 50,
        y: height - 70,
        width: 100,
        height: 33,
      })
    }
    drawText(companyName, 55, 14, ruby)
    drawText('Angebot', 75, 22, ruby)

    // Accent line
    page.drawLine({
      start: { x: 50, y: height - 85 },
      end: { x: width - 50, y: height - 85 },
      thickness: 1.5,
      color: ruby,
    })

    y = 100

    // Angebot info
    drawText(offer.offer_number || 'Angebot', y, 12, ruby)
    y += 20
    if (offer.title) drawText(offer.title, y, 14)
    y += 25
    if (offer.valid_until) drawText(`Gültig bis: ${new Date(offer.valid_until).toLocaleDateString('de-DE')}`, y, 10)
    y += 25

    // Customer
    if (offer.customer?.name) {
      drawText('Kunde:', y, 10)
      y += 15
      drawText(offer.customer.name, y, 11)
      y += 15
    }
    if (offer.customer?.email) {
      drawText(offer.customer.email, y, 10)
      y += 25
    }

    // Absender
    drawText('Absender:', y, 9)
    y += 13
    drawText(`${companyName} • ${operator}`, y, 8)
    y += 12
    drawText(`${street} • ${city}`, y, 8)
    y += 12
    drawText(`${emailC} • ${phoneC} • ${web}`, y, 8)
    y += 25

    // Intro
    if (offer.intro_text) {
      drawText(offer.intro_text, y, 10)
      y += 30
    }

    // Items
    if (offer.items && offer.items.length > 0) {
      drawText('Positionen', y, 12, ruby)
      y += 20
      offer.items.forEach((item: any) => {
        const line = `${item.title || ''}  |  ${item.quantity || 1} x ${((item.unit_price_cents || 0)/100).toFixed(2)} € = ${((item.total_cents || 0)/100).toFixed(2)} €`
        drawText(line, y, 9)
        y += 14
      })
      y += 10
    }

    // Totals
    const subtotal = ((offer.subtotal_cents || 0) / 100).toFixed(2)
    const discount = ((offer.discount_cents || 0) / 100).toFixed(2)
    const total = ((offer.total_cents || 0) / 100).toFixed(2)
    const curr = offer.currency || 'EUR'

    drawText(`Zwischensumme: ${subtotal} ${curr}`, y, 10)
    y += 14
    if (offer.discount_cents > 0) {
      drawText(`Rabatt: -${discount} ${curr}`, y, 10)
      y += 14
    }
    drawText(`Gesamtbetrag: ${total} ${curr}`, y, 12, ruby)
    y += 30

    // Notes / terms
    if (offer.notes) {
      drawText(offer.notes, y, 9)
      y += 25
    }
    if (offer.payment_terms) {
      drawText(offer.payment_terms, y, 9)
      y += 25
    }

    // Kleinunternehmer hint
    if (smallHint) {
      drawText(smallHint, y, 8)
      y += 20
    } else {
      drawText('Gemäß § 19 Abs. 1 UStG wird keine Umsatzsteuer ausgewiesen.', y, 8)
      y += 20
    }

    // Footer
    drawText(`${companyName} • ${operator} • ${street} • ${city}`, y, 8)
    y += 12
    drawText(`${emailC} • ${phoneC} • ${web}`, y, 8)
    y += 12
    drawText(bankInfo, y, 8)

    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([new Uint8Array(pdfBytes as any)], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${offer.offer_number || 'angebot'}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleDownload}
      className="rounded-md border border-anthracite/20 px-4 py-2 text-sm hover:border-ruby/40"
    >
      PDF herunterladen
    </button>
  )
}
