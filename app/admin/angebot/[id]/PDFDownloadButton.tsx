'use client'

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export default function PDFDownloadButton({ offer }: { offer: any }) {
  const handleDownload = async () => {
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const { width, height } = page.getSize()

    const drawText = (text: string, y: number, size = 12) => {
      page.drawText(text, {
        x: 50,
        y: height - y,
        size,
        font,
        color: rgb(0.1, 0.1, 0.1),
      })
    }

    drawText('Klickdesigns - Angebot', 50, 20)
    drawText(offer.offer_number || '', 80)
    drawText(offer.title || '', 100)
    drawText(`Gesamtbetrag: ${((offer.total_cents || 0) / 100).toFixed(2)} ${offer.currency || 'EUR'}`, 120)
    if (offer.valid_until) drawText(`Gültig bis: ${new Date(offer.valid_until).toLocaleDateString('de-DE')}`, 140)
    drawText('Kunde: ' + (offer.customer?.name || ''), 160)

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
