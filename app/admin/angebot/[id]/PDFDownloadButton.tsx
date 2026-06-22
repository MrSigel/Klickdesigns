'use client'

import { jsPDF } from 'jspdf'

export default function PDFDownloadButton({ offer }: { offer: any }) {
  const handleDownload = () => {
    const doc = new jsPDF()
    doc.text('Klickdesigns - Angebot', 20, 20)
    doc.text(offer.offer_number || '', 20, 30)
    doc.text(offer.title || '', 20, 40)
    doc.text(`Gesamtbetrag: ${((offer.total_cents || 0) / 100).toFixed(2)} ${offer.currency || 'EUR'}`, 20, 50)
    if (offer.valid_until) {
      doc.text(`Gültig bis: ${new Date(offer.valid_until).toLocaleDateString('de-DE')}`, 20, 60)
    }
    doc.text(`Kunde: ${offer.customer?.name || ''}`, 20, 70)
    doc.save(`${offer.offer_number || 'angebot'}.pdf`)
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
