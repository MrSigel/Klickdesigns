'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function checkWebsite(websiteUrl: string) {
  if (!websiteUrl) return { error: 'URL erforderlich' }

  let url = websiteUrl.trim()
  if (!url.startsWith('http')) url = 'https://' + url

  try {
    // Fetch main page
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'Klickdesigns-Scanner/1.0' } })
    clearTimeout(timeout)

    if (!res.ok) throw new Error('Seite nicht erreichbar')

    const html = await res.text()
    const lower = html.toLowerCase()

    // Simple extraction
    const emailMatch = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
    const foundEmail = emailMatch ? emailMatch[0] : null

    const phoneMatch = html.match(/(\+?\d[\d\s-]{8,}\d)/)
    const foundPhone = phoneMatch ? phoneMatch[0].trim() : null

    // Find social
    const socialMatch = html.match(/https?:\/\/(www\.)?(facebook|instagram|linkedin|twitter|x)\.com\/[^\s"'<>]+/i)
    const foundSocial = socialMatch ? socialMatch[0] : null

    // Find contact/impressum/privacy
    const contactLink = extractLink(html, ['kontakt', 'contact', 'impressum', 'imprint', 'datenschutz', 'privacy', 'legal'])
    const impressumLink = extractLink(html, ['impressum', 'imprint', 'legal'])
    const privacyLink = extractLink(html, ['datenschutz', 'privacy', 'datenschutzerklärung'])

    // Simple logo detection
    const logoMatch = html.match(/<img[^>]*src=["']([^"']*(logo|brand|logo-mark)[^"']*)["'][^>]*>/i)
    const detectedLogo = logoMatch ? new URL(logoMatch[1], url).href : null

    // Simple problem detection
    let detectedProblem = null
    let designScore = 70
    if (!detectedLogo) {
      detectedProblem = 'Kein klares Logo gefunden'
      designScore = 40
    } else if (detectedLogo.includes('.jpg') || detectedLogo.includes('.png')) {
      detectedProblem = 'Logo als Rastergrafik (JPG/PNG), SVG empfohlen'
      designScore = 55
    } else if (lower.includes('alt="logo"') && !lower.includes('.svg')) {
      detectedProblem = 'Mögliches kleines oder veraltetes Logo'
      designScore = 60
    }

    // Try to get company from title or h1
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i)
    let companyName = titleMatch ? titleMatch[1].split('|')[0].trim() : null
    if (!companyName) {
      const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)
      companyName = h1 ? h1[1].trim() : null
    }

    // Recommend service based on problem
    let recommended = 'design_finalization'
    if (detectedProblem && detectedProblem.includes('Logo')) recommended = 'logo_vectorization'
    if (detectedProblem && detectedProblem.includes('Logo') && !detectedLogo) recommended = 'logo_sprint'

    const result = {
      website_url: url,
      company_name: companyName,
      found_email: foundEmail,
      found_phone: foundPhone,
      found_social_url: foundSocial,
      contact_page_url: contactLink,
      impressum_url: impressumLink,
      privacy_url: privacyLink,
      detected_logo_url: detectedLogo,
      detected_problem: detectedProblem,
      design_score: designScore,
      recommended_service: recommended,
      scan_status: 'completed'
    }

    // Save search result
    const supabase = await createClient()
    const { data: saved, error: saveErr } = await supabase.from('search_results').insert({
      ...result,
      scan_status: 'completed'
    }).select('id').single()

    if (saveErr) console.error('Save search result:', saveErr)

    revalidatePath('/admin/suchen')
    return { success: true, result, searchId: saved?.id }
  } catch (e: any) {
    // Save failed scan
    const supabase = await createClient()
    await supabase.from('search_results').insert({
      website_url: url,
      scan_status: 'failed',
      error_message: e.message || 'Unbekannter Fehler'
    })
    revalidatePath('/admin/suchen')
    return { error: e.message || 'Fehler beim Abrufen der Website. Bitte URL prüfen.' }
  }
}

function extractLink(html: string, keywords: string[]): string | null {
  const lowerHtml = html.toLowerCase()
  for (const kw of keywords) {
    const regex = new RegExp(`<a[^>]*href=["']([^"']*${kw}[^"']*)["'][^>]*>`, 'i')
    const m = html.match(regex)
    if (m) {
      let link = m[1]
      if (link.startsWith('/')) link = 'https://' + new URL('https://dummy').hostname + link // rough, but will be relative fix later if needed
      try { new URL(link); return link } catch { }
    }
  }
  return null
}

export async function saveAsLead(searchResultId: string) {
  'use server'
  const supabase = await createClient()

  const { data: sr } = await supabase.from('search_results').select('*').eq('id', searchResultId).single()
  if (!sr) return { error: 'Ergebnis nicht gefunden' }

  // Check if do_not_contact
  if (sr.found_email) {
    const { data: existingLead } = await supabase
      .from('acquisition_leads')
      .select('id, do_not_contact')
      .eq('email', sr.found_email)
      .maybeSingle()
    if (existingLead?.do_not_contact) {
      return { error: 'Dieser Kontakt ist als "nicht kontaktieren" markiert.' }
    }
    if (existingLead) {
      // already lead
      await supabase.from('search_results').update({ saved_as_lead: true, acquisition_lead_id: existingLead.id }).eq('id', searchResultId)
      return { success: true, message: 'Bereits als Lead vorhanden.' }
    }
  }

  // create lead
  const { data: newLead, error: leadErr } = await supabase.from('acquisition_leads').insert({
    company_name: sr.company_name || new URL(sr.website_url).hostname,
    website_url: sr.website_url,
    email: sr.found_email,
    phone: sr.found_phone,
    social_url: sr.found_social_url,
    source: 'website',
    detected_problem: sr.detected_problem,
    recommended_service: sr.recommended_service,
    status: 'open',
    do_not_contact: false,
    notes: sr.detected_problem
  }).select('id').single()

  if (leadErr || !newLead) {
    return { error: 'Fehler beim Speichern als Lead.' }
  }

  await supabase.from('search_results').update({ saved_as_lead: true, acquisition_lead_id: newLead.id }).eq('id', searchResultId)

  revalidatePath('/admin/suchen')
  revalidatePath('/admin/akquise')
  return { success: true, leadId: newLead.id }
}

export async function deleteSearchResult(id: string) {
  'use server'
  const supabase = await createClient()
  await supabase.from('search_results').delete().eq('id', id)
  revalidatePath('/admin/suchen')
}
