'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Header from '../components/Header'
import Footer from '../components/Footer'

type LogoTemplate = {
  id: string
  title: string
  description: string | null
  png_path: string
  svg_path: string
  category?: string
}

const categoryOptions = [
  { value: 'all', label: 'Alle' },
  { value: 'business', label: 'Business' },
  { value: 'creator', label: 'Creator' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'streetwear', label: 'Streetwear' },
  { value: 'verein', label: 'Verein' },
  { value: 'handwerk', label: 'Handwerk' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'food', label: 'Food' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'other', label: 'Sonstiges' },
]

export default function LogoVorlagenPage() {
  const [templates, setTemplates] = useState<LogoTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<LogoTemplate | null>(null)
  const [selectedType, setSelectedType] = useState<'png' | 'svg' | null>(null)
  const [form, setForm] = useState({ email: '', website: '', first_name: '', last_name: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | string>('all')

  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('logo_templates')
        .select('id, title, description, png_path, svg_path, category')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
      setTemplates((data || []) as LogoTemplate[])
      setLoading(false)
    }
    load()
  }, [supabase])

  // Support initial filter from ?kategorie= param (shareable links)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const k = params.get('kategorie')
      if (k) {
        const match = categoryOptions.find((c) => c.value === k)
        if (match) {
          setActiveFilter(match.value)
        } else if (k === 'all') {
          setActiveFilter('all')
        }
      }
    }
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
        message: `Download Logo-Vorlage: ${selectedTemplate.title} (${selectedType.toUpperCase()})` + (form.website ? ` | Website: ${form.website}` : '') + ` | Kategorie: ${selectedTemplate.category || 'other'}`,
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
      <Header />

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

        {/* Category Filter - modern pills, no page reload, supports ?kategorie= */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categoryOptions.map((cat) => {
            const isActive = activeFilter === cat.value
            return (
              <button
                key={cat.value}
                onClick={() => setActiveFilter(cat.value)}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all border ${
                  isActive
                    ? 'bg-ruby text-offwhite border-ruby shadow-sm'
                    : 'border-anthracite/15 text-anthracite/70 hover:border-ruby/30 hover:text-anthracite bg-white'
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {loading ? (
          <div className="py-20 text-center text-anthracite/50">Lade Vorlagen…</div>
        ) : templates.length === 0 ? (
          <div className="rounded-xl border border-anthracite/10 bg-white p-12 text-center">
            <p className="text-anthracite/70">Aktuell sind noch keine Vorlagen verfügbar.</p>
          </div>
        ) : (
          (() => {
            const filtered = activeFilter === 'all'
              ? templates
              : templates.filter((t) => (t.category || 'other') === activeFilter)
            if (filtered.length === 0) {
              return (
                <div className="rounded-xl border border-anthracite/10 bg-white p-12 text-center">
                  <p className="text-anthracite/70">Für diese Kategorie werden gerade neue Logo-Vorlagen vorbereitet.</p>
                </div>
              )
            }
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((tpl) => {
                  const pngUrl = getPublicUrl(tpl.png_path)
                  return (
                    <div key={tpl.id} className="rounded-xl border border-anthracite/10 bg-white overflow-hidden flex flex-col">
                      <div className="bg-offwhite p-6 flex items-center justify-center h-56">
                        <img 
                          src={pngUrl} 
                          alt="Logo-Vorlage" 
                          className="max-h-44 object-contain" 
                        />
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="mt-auto grid grid-cols-2 gap-2">
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
            )
          })()
        )}
      </main>

      <Footer />

      {/* Download Modal */}
      {modalOpen && selectedTemplate && selectedType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-anthracite/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-anthracite/10 bg-white p-6 shadow-xl">
            <h3 className="font-display text-xl font-semibold mb-1">Download starten</h3>
            <p className="text-sm text-anthracite/70 mb-4">
              Logo-Vorlage – {selectedType.toUpperCase()}
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
