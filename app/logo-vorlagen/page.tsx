'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type LogoTemplate = {
  id: string
  title: string
  description: string | null
  png_path: string
  svg_path: string
}

export default function LogoVorlagenPage() {
  const [templates, setTemplates] = useState<LogoTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<LogoTemplate | null>(null)
  const [selectedType, setSelectedType] = useState<'png' | 'svg' | null>(null)
  const [form, setForm] = useState({ email: '', website: '', first_name: '', last_name: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('logo_templates')
        .select('id, title, description, png_path, svg_path')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      setTemplates((data || []) as LogoTemplate[])
      setLoading(false)
    }
    load()
  }, [])

  const openDownload = (tpl: LogoTemplate, type: 'png' | 'svg') => {
    setSelectedTemplate(tpl)
    setSelectedType(type)
    setForm({ email: '', website: '', first_name: '', last_name: '' })
    setError('')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedTemplate(null)
    setSelectedType(null)
  }

  const getPublicUrl = (path: string) => {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL
    return `${base}/storage/v1/object/public/logo-vorlagen/${path}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTemplate || !selectedType) return

    if (!form.email.trim()) {
      setError('E-Mail ist erforderlich.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      // Create inquiry / Anfrage
      const { error: insertErr } = await supabase.from('inquiries').insert({
        name: [form.first_name, form.last_name].filter(Boolean).join(' ') || null,
        email: form.email.trim(),
        company: null,
        project_name: selectedTemplate.title,
        service_type: 'other',
        existing_material: null,
        message: `Download Logo-Vorlage: ${selectedTemplate.title} (${selectedType.toUpperCase()})` + (form.website ? ` | Website: ${form.website}` : ''),
        status: 'new',
        priority: 'normal',
        source: 'logo_vorlagen',
        consent_privacy: true,
      })

      if (insertErr) {
        console.error('Inquiry error', insertErr)
        // Continue with download even if inquiry fails (but try)
      }

      // Start download directly
      const path = selectedType === 'png' ? selectedTemplate.png_path : selectedTemplate.svg_path
      const url = getPublicUrl(path)
      const filename = `${selectedTemplate.title}.${selectedType}`

      // Trigger download
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Close and reset
      setTimeout(() => {
        closeModal()
      }, 800)
    } catch (err: any) {
      setError('Fehler beim Verarbeiten. Bitte erneut versuchen.')
    }

    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-offwhite">
      {/* Simple Navigation matching style */}
      <header className="sticky top-0 z-50 border-b border-anthracite/10 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-display text-lg font-semibold tracking-tight text-anthracite">Klickdesigns</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/#leistungen" className="text-anthracite/80 hover:text-anthracite">Leistungen</Link>
              <Link href="/#pakete" className="text-anthracite/80 hover:text-anthracite">Pakete</Link>
              <Link href="/#beispiele" className="text-anthracite/80 hover:text-anthracite">Beispiele</Link>
              <Link href="/logo-vorlagen" className="text-anthracite/80 hover:text-anthracite">Logo Vorlagen</Link>
              <Link href="/#kontakt" className="text-anthracite/80 hover:text-anthracite">Kontakt</Link>
            </nav>
            <Link 
              href="/#kontakt" 
              className="rounded-md bg-ruby px-4 py-1.5 text-sm font-semibold text-offwhite hover:bg-ruby/90"
            >
              Anfrage stellen
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-ruby/15 bg-ruby/[0.04] px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ruby">
            Kostenlos
          </div>
          <h1 className="mt-4 font-display text-[2.5rem] font-bold tracking-[-0.04em] text-anthracite sm:text-[3.2rem]">
            Kostenlose Logo-Vorlagen
          </h1>
          <p className="mt-3 max-w-xl mx-auto text-[16px] text-anthracite/65">
            Lade fertige Logo-Vorlagen als PNG und SVG herunter. Einfach E-Mail angeben und sofort loslegen.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-anthracite/50">Lade Vorlagen…</div>
        ) : templates.length === 0 ? (
          <div className="rounded-xl border border-anthracite/10 bg-white p-12 text-center">
            <p className="text-anthracite/70">Aktuell sind noch keine Vorlagen verfügbar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((tpl) => {
              const pngUrl = getPublicUrl(tpl.png_path)
              return (
                <div key={tpl.id} className="rounded-xl border border-anthracite/10 bg-white overflow-hidden flex flex-col">
                  <div className="bg-offwhite p-6 flex items-center justify-center h-56">
                    <img 
                      src={pngUrl} 
                      alt={tpl.title} 
                      className="max-h-44 object-contain" 
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="font-semibold text-lg text-anthracite">{tpl.title}</div>
                    {tpl.description && (
                      <p className="mt-2 text-sm text-anthracite/70 line-clamp-3 flex-1">{tpl.description}</p>
                    )}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => openDownload(tpl, 'png')}
                        className="rounded-md border border-anthracite/15 py-2 text-sm font-medium hover:bg-anthracite/5 transition"
                      >
                        PNG herunterladen
                      </button>
                      <button
                        onClick={() => openDownload(tpl, 'svg')}
                        className="rounded-md bg-ruby text-offwhite py-2 text-sm font-semibold hover:bg-ruby/90 transition"
                      >
                        SVG herunterladen
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-anthracite/10 bg-white mt-16">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 text-sm text-anthracite/60 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} Klickdesigns. Alle Rechte vorbehalten.</div>
          <div className="flex gap-4">
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutz</Link>
            <Link href="/agb">AGB</Link>
          </div>
        </div>
      </footer>

      {/* Download Modal */}
      {modalOpen && selectedTemplate && selectedType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-anthracite/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-anthracite/10 bg-white p-6 shadow-xl">
            <h3 className="font-display text-xl font-semibold mb-1">Download starten</h3>
            <p className="text-sm text-anthracite/70 mb-4">
              {selectedTemplate.title} – {selectedType.toUpperCase()}
            </p>

            {error && <div className="mb-4 rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-anthracite/70 text-xs mb-1">E-Mail *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-md border border-anthracite/15 px-3 py-2 focus:border-ruby/40 outline-none"
                  placeholder="deine@email.de"
                />
              </div>

              <div>
                <label className="block text-anthracite/70 text-xs mb-1">Website (optional)</label>
                <input
                  type="text"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className="w-full rounded-md border border-anthracite/15 px-3 py-2 focus:border-ruby/40 outline-none"
                  placeholder="deine-website.de"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-anthracite/70 text-xs mb-1">Vorname (optional)</label>
                  <input
                    type="text"
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    className="w-full rounded-md border border-anthracite/15 px-3 py-2 focus:border-ruby/40 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-anthracite/70 text-xs mb-1">Nachname (optional)</label>
                  <input
                    type="text"
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    className="w-full rounded-md border border-anthracite/15 px-3 py-2 focus:border-ruby/40 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  disabled={submitting}
                  className="flex-1 rounded-md border border-anthracite/20 py-2 hover:bg-anthracite/5 disabled:opacity-50"
                >
                  Abbrechen
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="flex-1 rounded-md bg-ruby py-2 font-semibold text-offwhite hover:bg-ruby/90 disabled:opacity-50"
                >
                  {submitting ? 'Wird heruntergeladen...' : 'Download starten'}
                </button>
              </div>
            </form>

            <p className="mt-4 text-[11px] text-anthracite/50 text-center">
              Mit der Eingabe deiner E-Mail stimmst du zu, dass wir deine Daten zur Kontaktaufnahme speichern dürfen.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
