'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { usePathname } from 'next/navigation'

export default function WhatsappButton() {
  const pathname = usePathname()
  const legalPages = ['/impressum', '/datenschutz', '/agb', '/widerruf', '/cookie-einstellungen']
  if (legalPages.includes(pathname)) return null

  const supabase = createClient()

  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
  const message = encodeURIComponent('Hallo! Ich interessiere mich für ein Design bei Klickdesigns.')

  const handleClick = async () => {
    if (!number) {
      window.open('https://wa.me/', '_blank')
      return
    }

    // Track event
    try {
      await supabase.from('lead_events').insert({
        event_type: 'whatsapp_click',
        page_path: window.location.pathname,
      })
    } catch (e) {
      // non critical
    }

    window.open(`https://wa.me/${number}?text=${message}`, '_blank')
  }

  if (!number) return null

  return (
    <button
      onClick={handleClick}
      aria-label="Kontakt via WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.372-.025-.521-.075-.149-.67-.248-1.02-.372-.35-.124-.67-.198-.74-.198-.07 0-.298.074-.446.372-.148.297-.595.92-.595 2.207 0 1.288.595 2.582.67 2.68.074.099 1.164 1.76 2.83 2.48 1.667.72 1.92.72 2.59.72.67 0 1.09-.595 1.24-1.04.15-.446.15-.82.1-.92-.05-.1-.2-.15-.42-.3z" />
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm5.5 14.3c-.3.7-1.2 1.4-2 1.6-.5.1-1.1.2-1.9-.3-1.6-1-2.6-2.3-3-2.7-.3-.3-.7-.8-.7-1.2 0-.4.2-.7.5-.9.2-.2.5-.3.7-.3.2 0 .4.1.6.4.3.4.7 1.1.8 1.2.1.1.2.3.1.5-.1.2-.2.3-.3.4-.2.2-.3.3-.2.6.1.3.6 1.2 1.3 1.9.8.8 1.5 1 1.8 1.1.3.1.5.1.7-.1.2-.2.8-.9.9-1.2.1-.3.1-.5 0-.7-.1-.2-.4-.4-.6-.5z" />
      </svg>
    </button>
  )
}
