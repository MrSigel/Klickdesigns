'use client'

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export default function PDFDownloadButton({ invoice }: { invoice: any }) {
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

    drawText('Klickdesigns - Rechnung', 50, 20)
    drawText(invoice.invoice_number || '', 80)
    drawText(invoice.title || '', 100)
    drawText(`Gesamtbetrag: ${((invoice.total_cents || 0) / 100).toFixed(2)} ${invoice.currency || 'EUR'}`, 120)
    if (invoice.due_date) drawText(`Fällig: ${new Date(invoice.due_date).toLocaleDateString('de-DE')}`, 140)
    drawText('Kunde: ' + (invoice.customer?.name || ''), 160)

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
