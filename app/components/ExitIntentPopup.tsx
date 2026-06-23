'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function ExitIntentPopup() {
  const pathname = usePathname()
  const legalPages = ['/impressum', '/datenschutz', '/agb', '/widerruf', '/cookie-einstellungen']
  const isLegal = legalPages.includes(pathname)

  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  useEffect(() => {
    // Don't show if already shown this session or after form submit
    const shown = sessionStorage.getItem('exitPopupShown')
    const contactSubmitted = sessionStorage.getItem('contactSubmitted')
    if (shown || contactSubmitted) return

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    let scrollTriggered = false
    let mouseLeaveHandler: (e: MouseEvent) => void

    const showPopup = () => {
      if (sessionStorage.getItem('exitPopupShown') || sessionStorage.getItem('contactSubmitted')) return
      setIsOpen(true)
      sessionStorage.setItem('exitPopupShown', 'true')
    }

    if (!isMobile) {
      // Desktop: exit intent
      mouseLeaveHandler = (e: MouseEvent) => {
        if (e.clientY <= 0) {
          showPopup()
          document.removeEventListener('mouseleave', mouseLeaveHandler)
        }
      }
      document.addEventListener('mouseleave', mouseLeaveHandler)
    } else {
      // Mobile: scroll trigger ~65%
      const handleScroll = () => {
        if (scrollTriggered) return
        const scrollPercent = (window.scrollY + window.innerHeight) / document.body.scrollHeight
        if (scrollPercent > 0.65) {
          scrollTriggered = true
          showPopup()
          window.removeEventListener('scroll', handleScroll)
        }
      }
      window.addEventListener('scroll', handleScroll, { passive: true })
    }

    return () => {
      document.removeEventListener('mouseleave', mouseLeaveHandler)
      window.removeEventListener('scroll', () => {})
    }
  }, [])

  if (isLegal) return null

  const close = () => {
    setIsOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Bitte E-Mail angeben.')
      return
    }
    if (!consent) {
      setError('Bitte der Datenschutzerklärung zustimmen.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const { error: insertErr } = await supabase.from('leads').insert({
        email: email.trim(),
        source: 'exit_popup',
        consent_given: true,
        metadata: { page: window.location.pathname },
      })

      if (insertErr) {
        console.error('Lead insert error', insertErr)
        setError('Fehler beim Senden. Bitte später erneut versuchen.')
      } else {
        setSubmitted(true)
        // Hide for session
        sessionStorage.setItem('exitPopupShown', 'true')
      }
    } catch (err) {
      setError('Fehler beim Senden. Bitte später erneut versuchen.')
    }

    setSubmitting(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-anthracite/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-anthracite/10 bg-white p-6 shadow-xl">
        {!submitted ? (
          <>
            <h3 className="font-display text-xl font-semibold text-anthracite">Kostenlose Logo-Vorlage + 1 Korrektur</h3>
            <p className="mt-2 text-sm text-anthracite/70">
              Gib deine E-Mail an und erhalte eine fertige Logo-Vorlage zum Download plus eine kostenlose Korrektur.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="deine@email.de"
                className="w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm focus:border-ruby/40"
              />

              <div className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 accent-ruby"
                  required
                />
                <span className="text-anthracite/70">
                  Ich stimme der Verarbeitung meiner Daten gemäß der{' '}
                  <Link href="/datenschutz" className="underline">Datenschutzerklärung</Link> zu.
                </span>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md bg-ruby py-2.5 text-sm font-semibold text-offwhite hover:bg-ruby/90 disabled:opacity-50"
              >
                {submitting ? 'Wird gesendet...' : 'Vorlage + Korrektur anfordern'}
              </button>
            </form>

            <button
              onClick={close}
              className="mt-3 w-full text-center text-xs text-anthracite/50 hover:text-anthracite/70"
            >
              Nein danke
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="font-semibold text-anthracite">Danke!</p>
            <p className="mt-1 text-sm text-anthracite/70">Du bekommst gleich eine E-Mail mit deiner Vorlage.</p>
            <button onClick={close} className="mt-4 text-sm underline">Schließen</button>
          </div>
        )}
      </div>
    </div>
  )
}
