'use client'

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { createClient } from '@/lib/supabase/client'

export default function PDFDownloadButton({ invoice }: { invoice: any }) {
  const handleDownload = async () => {
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const { width, height } = page.getSize()

    // Brand colors
    const anthracite = rgb(0.122, 0.106, 0.106)
    const ruby = rgb(0.6, 0, 0)

    // Load logo
    let logoImage: any = null
    try {
      const logoBytes = await fetch('/brand/klickdesigns-logo.png').then(res => res.arrayBuffer())
      logoImage = await pdfDoc.embedPng(logoBytes)
    } catch (e) {
      console.warn('Logo load failed')
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

    // Header logo
    if (logoImage) {
      page.drawImage(logoImage, {
        x: 50,
        y: height - 70,
        width: 100,
        height: 33,
      })
    }
    drawText('Klickdesigns', 55, 14, ruby)
    drawText('Rechnung', 75, 22, ruby)

    // Accent
    page.drawLine({
      start: { x: 50, y: height - 85 },
      end: { x: width - 50, y: height - 85 },
      thickness: 1.5,
      color: ruby,
    })

    let y = 100

    drawText(invoice.invoice_number || 'Rechnung', y, 12, ruby)
    y += 20
    if (invoice.title) drawText(invoice.title, y, 14)
    y += 20
    if (invoice.due_date) drawText(`Fällig: ${new Date(invoice.due_date).toLocaleDateString('de-DE')}`, y, 10)
    y += 25

    if (invoice.customer?.name) {
      drawText('Kunde:', y, 10)
      y += 15
      drawText(invoice.customer.name, y, 11)
      y += 15
    }
    if (invoice.customer?.email) {
      drawText(invoice.customer.email, y, 10)
      y += 25
    }

    // Items
    if (invoice.items && invoice.items.length > 0) {
      drawText('Positionen', y, 12, ruby)
      y += 20
      invoice.items.forEach((item: any) => {
        const line = `${item.title || ''}  |  ${item.quantity || 1} x ${((item.unit_price_cents || 0)/100).toFixed(2)} € = ${((item.total_cents || 0)/100).toFixed(2)} €`
        drawText(line, y, 9)
        y += 14
      })
      y += 10
    }

    const total = ((invoice.total_cents || 0) / 100).toFixed(2)
    const curr = invoice.currency || 'EUR'
    drawText(`Gesamtbetrag: ${total} ${curr}`, y, 12, ruby)
    y += 30

    // Payment info
    drawText('Zahlungsinformationen', y, 11, ruby)
    y += 16
    drawText('Kontoinhaber: Enrico Gross', y, 9)
    y += 13
    drawText('IBAN: DE17100101788022253533', y, 9)
    y += 13
    drawText('BIC: REVODEB2  •  Bank: Revolut', y, 9)
    y += 13
    drawText(`Verwendungszweck: ${invoice.invoice_number || ''}`, y, 9)
    y += 25

    drawText('Gemäß § 19 Abs. 1 UStG wird keine Umsatzsteuer ausgewiesen.', y, 8)
    y += 30

    // Footer
    drawText('Klickdesigns • Enrico Gross • Gerther Straße 76 • 44577 Castrop-Rauxel', y, 8)
    y += 12
    drawText('kontakt@klickdesigns.de • www.klickdesigns.de', y, 8)

    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([new Uint8Array(pdfBytes as any)], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${invoice.invoice_number || 'rechnung'}.pdf`
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
