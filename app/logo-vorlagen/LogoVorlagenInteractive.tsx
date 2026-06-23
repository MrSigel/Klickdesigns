'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type LogoTemplate = {
  id: string
  title: string
  description: string | null
  png_path: string
  svg_path: string
  category?: string
}

export default function LogoVorlagenInteractive({ tpl, type }: { tpl: LogoTemplate; type: 'png' | 'svg' }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ email: '', website: '', first_name: '', last_name: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  const getPublicUrl = (path: string) => {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL
    return `${base}/storage/v1/object/public/logo-vorlagen/${path}`
  }

  const open = () => {
    setForm({ email: '', website: '', first_name: '', last_name: '' })
    setError('')
    setModalOpen(true)
  }

  const close = () => {
    setModalOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email.trim()) {
      setError('E-Mail ist erforderlich.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const { error: insertErr } = await supabase.from('inquiries').insert({
        name: [form.first_name, form.last_name].filter(Boolean).join(' ') || null,
        email: form.email.trim(),
        company: null,
        project_name: tpl.title,
        service_type: 'other',
        existing_material: null,
        message: `Download Logo-Vorlage: ${tpl.title} (${type.toUpperCase()})` + (form.website ? ` | Website: ${form.website}` : '') + ` | Kategorie: ${tpl.category || 'other'}`,
        status: 'new',
        priority: 'normal',
        source: 'logo_vorlagen',
        consent_privacy: true,
      })
      if (insertErr) console.error('Inquiry error', insertErr)

      const path = type === 'png' ? tpl.png_path : tpl.svg_path
      const url = getPublicUrl(path)
      const filename = `${tpl.title}.${type}`
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setTimeout(close, 800)
    } catch (err: any) {
      setError('Fehler beim Verarbeiten. Bitte erneut versuchen.')
    }
    setSubmitting(false)
  }

  return (
    <>
      <button
        onClick={open}
        className={type === 'png' ? "rounded-md border border-anthracite/15 py-2 text-sm font-medium hover:bg-anthracite/5 transition" : "rounded-md bg-ruby text-offwhite py-2 text-sm font-semibold hover:bg-ruby/90 transition"}
      >
        {type === 'png' ? 'PNG herunterladen' : 'SVG herunterladen'}
      </button>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-anthracite/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-anthracite/10 bg-white p-6 shadow-xl">
            <h3 className="font-display text-xl font-semibold mb-1">Download starten</h3>
            <p className="text-sm text-anthracite/70 mb-4">Logo-Vorlage – {type.toUpperCase()}</p>
            {error && <div className="mb-4 rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-anthracite/70 text-xs mb-1">E-Mail *</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-md border border-anthracite/15 px-3 py-2 focus:border-ruby/40 outline-none" placeholder="deine@email.de" />
              </div>
              <div>
                <label className="block text-anthracite/70 text-xs mb-1">Website (optional)</label>
                <input type="text" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="w-full rounded-md border border-anthracite/15 px-3 py-2 focus:border-ruby/40 outline-none" placeholder="deine-website.de" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-anthracite/70 text-xs mb-1">Vorname (optional)</label>
                  <input type="text" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className="w-full rounded-md border border-anthracite/15 px-3 py-2 focus:border-ruby/40 outline-none" />
                </div>
                <div>
                  <label className="block text-anthracite/70 text-xs mb-1">Nachname (optional)</label>
                  <input type="text" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className="w-full rounded-md border border-anthracite/15 px-3 py-2 focus:border-ruby/40 outline-none" />
                </div>
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={close} disabled={submitting} className="flex-1 rounded-md border border-anthracite/20 py-2 hover:bg-anthracite/5 disabled:opacity-50">Abbrechen</button>
                <button type="submit" disabled={submitting} className="flex-1 rounded-md bg-ruby py-2 font-semibold text-offwhite hover:bg-ruby/90 disabled:opacity-50">{submitting ? 'Wird heruntergeladen...' : 'Download starten'}</button>
              </div>
            </form>
            <p className="mt-4 text-[11px] text-anthracite/50 text-center">Mit der Eingabe deiner E-Mail stimmst du zu, dass wir deine Daten zur Kontaktaufnahme speichern dürfen.</p>
          </div>
        </div>
      )}
    </>
  )
}
