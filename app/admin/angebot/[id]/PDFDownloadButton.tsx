'use client'

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { createClient } from '@/lib/supabase/client'

export default function PDFDownloadButton({ offer }: { offer: any }) {
  const handleDownload = async () => {
    const pdfDoc = await PDFDocument.create()
    let page = pdfDoc.addPage([595, 842])
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const { width, height } = page.getSize()

    // Brand colors
    const anthracite = rgb(0.122, 0.106, 0.106)
    const ruby = rgb(0.6, 0, 0)
    const gray = rgb(0.48, 0.48, 0.48)
    const lightLine = rgb(0.82, 0.8, 0.8)

    // Load settings
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

    const bankInfo = billing.bank_holder
      ? `Kontoinhaber: ${billing.bank_holder}\nIBAN: ${billing.bank_iban || ''}\nBIC: ${billing.bank_bic || ''}\nBank: ${billing.bank_name || 'Revolut'}`
      : ''

    const smallHint = billing.small_business_notice_enabled
      ? (billing.small_business_notice_text || 'Gemäß § 19 Abs. 1 UStG wird keine Umsatzsteuer ausgewiesen.')
      : ''

    const paymentDefault = billing.payment_terms || (billing.payment_due_days ? `Zahlbar innerhalb von ${billing.payment_due_days} Tagen netto` : 'Zahlbar innerhalb von 7 Tagen netto')

    // Load logo (existing asset)
    let logoImage: any = null
    try {
      const logoBytes = await fetch('/brand/klickdesigns-logo.png').then(res => res.arrayBuffer())
      logoImage = await pdfDoc.embedPng(logoBytes)
    } catch (e) {
      // no logo fallback
    }

    const formatEUR = (n: number) => n.toFixed(2).replace('.', ',') + ' €'

    const drawWrap = (txt: string, x: number, maxW: number, sz: number, cy: number, col: any): number => {
      const words = (txt || '').split(/\s+/).filter(Boolean)
      let line = ''
      let ly = cy
      const lh = sz + 2.8
      for (const w of words) {
        const t = line ? line + ' ' + w : w
        if (font.widthOfTextAtSize(t, sz) > maxW && line) {
          page.drawText(line, { x, y: height - ly, size: sz, font, color: col })
          ly += lh
          line = w
        } else {
          line = t
        }
      }
      if (line) {
        page.drawText(line, { x, y: height - ly, size: sz, font, color: col })
        ly += lh
      }
      return ly
    }

    let y = 42
    let pageNum = 1
    const left = 50
    const right = width - 50
    const contentW = right - left

    // HEADER: logo + type + meta + accent (no overlap)
    if (logoImage) {
      page.drawImage(logoImage, {
        x: left,
        y: height - y - 32,
        width: 128,
        height: 32,
      })
    }
    y += 38

    page.drawText('Angebot', {
      x: left,
      y: height - y,
      size: 19,
      font,
      color: ruby,
    })
    y += 18

    if (offer.offer_number) {
      page.drawText(offer.offer_number, {
        x: left,
        y: height - y,
        size: 10,
        font,
        color: anthracite,
      })
      y += 12
    }

    const created = offer.created_at ? new Date(offer.created_at).toLocaleDateString('de-DE') : ''
    page.drawText(`Datum: ${created}`, { x: left, y: height - y, size: 8.5, font, color: anthracite })
    y += 11

    if (offer.valid_until) {
      const vu = new Date(offer.valid_until).toLocaleDateString('de-DE')
      page.drawText(`Gültig bis: ${vu}`, { x: left, y: height - y, size: 8.5, font, color: anthracite })
      y += 11
    }

    y += 2
    page.drawLine({
      start: { x: left, y: height - y },
      end: { x: right, y: height - y },
      thickness: 1.2,
      color: ruby,
    })
    y += 11

    // Absenderzeile klein
    page.drawText(`${companyName} · ${operator} · ${street} · ${city}`, {
      x: left, y: height - y, size: 7, font, color: gray
    })
    y += 10

    // Kunde
    page.drawText('Kunde', { x: left, y: height - y, size: 8.5, font, color: ruby })
    y += 10
    const cust = offer.customer || {}
    if (cust.name) {
      page.drawText(cust.name, { x: left, y: height - y, size: 9, font, color: anthracite })
      y += 10
    }
    if (cust.company) {
      page.drawText(cust.company, { x: left, y: height - y, size: 8, font, color: anthracite })
      y += 9
    }
    if (cust.email) {
      page.drawText(cust.email, { x: left, y: height - y, size: 8, font, color: anthracite })
      y += 9
    }
    if (cust.phone) {
      page.drawText(cust.phone, { x: left, y: height - y, size: 8, font, color: anthracite })
      y += 9
    }
    y += 5

    // Betreff / Einleitung
    if (offer.title) {
      page.drawText(`Betreff: ${offer.title}`, { x: left, y: height - y, size: 9, font, color: anthracite })
      y += 11
    }
    if (offer.intro_text) {
      y = drawWrap(offer.intro_text, left, contentW - 5, 8, y, anthracite)
      y += 4
    }

    // Positionen
    page.drawText('Positionen', { x: left, y: height - y, size: 9.5, font, color: ruby })
    y += 10

    page.drawLine({ start: { x: left, y: height - y }, end: { x: right, y: height - y }, thickness: 0.5, color: anthracite })
    y += 8

    const cPos = left
    const cDesc = left + 24
    const cMenge = 298
    const cEinzel = 388
    const cGes = 490

    page.drawText('Pos.', { x: cPos, y: height - y, size: 7.5, font, color: anthracite })
    page.drawText('Beschreibung', { x: cDesc, y: height - y, size: 7.5, font, color: anthracite })
    page.drawText('Menge', { x: cMenge, y: height - y, size: 7.5, font, color: anthracite })
    const eL = 'Einzelpreis'
    page.drawText(eL, { x: cEinzel - font.widthOfTextAtSize(eL, 7.5), y: height - y, size: 7.5, font, color: anthracite })
    const gL = 'Gesamt'
    page.drawText(gL, { x: cGes - font.widthOfTextAtSize(gL, 7.5), y: height - y, size: 7.5, font, color: anthracite })
    y += 8

    page.drawLine({ start: { x: left, y: height - y }, end: { x: right, y: height - y }, thickness: 0.3, color: lightLine })
    y += 7

    // Items + calc from positions
    let subtotal = 0
    const items = (offer.items || []).map((it: any, i: number) => {
      const qty = Number(it.quantity || 1)
      const upC = Number(it.unit_price_cents || 0)
      let tC = Number(it.total_cents || 0)
      if (!tC || tC <= 0) tC = Math.round(qty * upC)
      const unit = upC / 100
      const tot = tC / 100
      subtotal += tot
      return {
        pos: i + 1,
        title: it.title || (it.description || ''),
        qty,
        unit,
        tot
      }
    })

    const discount = (offer.discount_cents || 0) / 100
    const grand = subtotal - discount

    for (const it of items) {
      if (y + 38 > height - 92) {
        drawFooter(pageNum)
        page = pdfDoc.addPage([595, 842])
        pageNum++
        y = 48
        page.drawText(`${companyName} – ${offer.offer_number || ''} (Fortsetzung)`, {
          x: left, y: height - y, size: 7, font, color: gray
        })
        y += 12
        page.drawLine({ start: { x: left, y: height - y }, end: { x: right, y: height - y }, thickness: 0.4, color: anthracite })
        y += 8
      }

      const baseY = y
      page.drawText(String(it.pos), { x: cPos, y: height - baseY, size: 8.5, font, color: anthracite })
      const afterD = drawWrap(it.title, cDesc, 212, 8, baseY, anthracite)
      page.drawText(String(it.qty), { x: cMenge, y: height - baseY, size: 8.5, font, color: anthracite })
      const uStr = formatEUR(it.unit)
      const uw = font.widthOfTextAtSize(uStr, 8.5)
      page.drawText(uStr, { x: cEinzel - uw, y: height - baseY, size: 8.5, font, color: anthracite })
      const tStr = formatEUR(it.tot)
      const tw = font.widthOfTextAtSize(tStr, 8.5)
      page.drawText(tStr, { x: cGes - tw, y: height - baseY, size: 8.5, font, color: anthracite })
      y = Math.max(afterD + 1, baseY + 11)
    }

    y += 4
    page.drawLine({ start: { x: 275, y: height - y }, end: { x: right, y: height - y }, thickness: 0.5, color: anthracite })
    y += 8

    const sumLX = 305
    const sumVX = 490

    const drawSum = (lbl: string, val: string, sz = 8.5, col = anthracite) => {
      page.drawText(lbl, { x: sumLX, y: height - y, size: sz, font, color: col })
      const vw = font.widthOfTextAtSize(val, sz)
      page.drawText(val, { x: sumVX - vw, y: height - y, size: sz, font, color: col })
      y += 11
    }

    drawSum('Zwischensumme', formatEUR(subtotal))
    if (discount > 0) {
      drawSum('Rabatt', '-' + formatEUR(discount))
    }
    drawSum('Gesamtbetrag', formatEUR(grand), 9.5, ruby)

    y += 6

    // Zahlung / Hinweise
    const payTerm = offer.payment_terms || paymentDefault
    if (payTerm) {
      if (y + 18 > height - 92) {
        drawFooter(pageNum)
        page = pdfDoc.addPage([595, 842])
        pageNum++
        y = 48
      }
      page.drawText(payTerm, { x: left, y: height - y, size: 8, font, color: anthracite })
      y += 11
    }

    const addNote = 'Zusätzliche Leistungen oder Änderungswünsche außerhalb des beschriebenen Umfangs werden separat angeboten.'
    y = drawWrap(addNote, left, contentW - 10, 7, y, gray)
    y += 6

    if (smallHint) {
      if (y + 14 > height - 92) {
        drawFooter(pageNum)
        page = pdfDoc.addPage([595, 842])
        pageNum++
        y = 48
      }
      page.drawText(smallHint, { x: left, y: height - y, size: 7, font, color: gray })
      y += 10
    }

    // Final footer
    drawFooter(pageNum)

    function drawFooter(pn: number) {
      const fY = 54
      page.drawLine({
        start: { x: left, y: fY + 16 },
        end: { x: right, y: fY + 16 },
        thickness: 0.5,
        color: anthracite,
      })
      page.drawText(`${companyName} · ${operator} · ${street} · ${city}`, {
        x: left, y: fY + 5, size: 6.5, font, color: anthracite
      })
      page.drawText(`${emailC} · ${phoneC} · ${web}`, {
        x: left, y: fY - 4, size: 6.5, font, color: anthracite
      })
      if (bankInfo) {
        const b = bankInfo.replace(/\n/g, ' · ')
        page.drawText(b, { x: left, y: fY - 12, size: 5.5, font, color: gray })
      }
      const pgt = `Seite ${pn}`
      const pgw = font.widthOfTextAtSize(pgt, 6.5)
      page.drawText(pgt, { x: right - pgw, y: fY + 5, size: 6.5, font, color: anthracite })
    }

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
