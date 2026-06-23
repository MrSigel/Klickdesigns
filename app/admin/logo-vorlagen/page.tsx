'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type LogoTemplate = {
  id: string
  title: string
  description: string | null
  png_path: string
  svg_path: string
  is_active: boolean
  created_at: string
}

export default function AdminLogoVorlagen() {
  const [templates, setTemplates] = useState<LogoTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<LogoTemplate | null>(null)
  const [form, setForm] = useState({ title: '', description: '' })
  const [pendingPng, setPendingPng] = useState<File | null>(null)
  const [pendingSvg, setPendingSvg] = useState<File | null>(null)
  const [pngPreview, setPngPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClient()

  const loadTemplates = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('logo_templates')
      .select('*')
      .order('created_at', { ascending: false })
    setTemplates((data || []) as LogoTemplate[])
    setLoading(false)
  }

  useEffect(() => {
    loadTemplates()
  }, [])

  const openNew = () => {
    setEditing(null)
    setForm({ title: '', description: '' })
    setPendingPng(null)
    setPendingSvg(null)
    setPngPreview(null)
    setModalOpen(true)
    setError('')
    setSuccess('')
  }

  const openEdit = (tpl: LogoTemplate) => {
    setEditing(tpl)
    setForm({ title: tpl.title, description: tpl.description || '' })
    setPendingPng(null)
    setPendingSvg(null)
    setPngPreview(null)
    setModalOpen(true)
    setError('')
    setSuccess('')
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
    setPendingPng(null)
    setPendingSvg(null)
    if (pngPreview) URL.revokeObjectURL(pngPreview)
    setPngPreview(null)
  }

  const handlePngSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Nur PNG-Bilder erlaubt.')
      return
    }
    if (pngPreview) URL.revokeObjectURL(pngPreview)
    setPendingPng(file)
    setPngPreview(URL.createObjectURL(file))
  }

  const handleSvgSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.svg')) {
      setError('Nur SVG-Dateien erlaubt.')
      return
    }
    setPendingSvg(file)
  }

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 40) || 'file'
    const fileName = `logo-${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`
    const path = fileName
    const { error } = await supabase.storage.from('logo-vorlagen').upload(path, file, { upsert: false })
    if (error) {
      console.error('Storage upload error', error)
      if (error.message?.toLowerCase().includes('bucket not found')) {
        console.error('Hinweis: Der Bucket "logo-vorlagen" existiert nicht. Bitte in Supabase Dashboard > Storage anlegen (Public). Siehe Kommentare in supabase/logo_vorlagen_schema.sql')
      }
      return null
    }
    return path
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.title.trim()) {
      setError('Titel ist erforderlich.')
      return
    }

    if (!editing && (!pendingPng || !pendingSvg)) {
      setError('PNG und SVG Datei sind erforderlich.')
      return
    }

    try {
      let pngPath = editing?.png_path || null
      let svgPath = editing?.svg_path || null

      if (pendingPng) {
        const uploaded = await uploadFile(pendingPng, 'logo-vorlagen')
        if (!uploaded) {
          setError('PNG Upload fehlgeschlagen. Bucket "logo-vorlagen" fehlt? Bitte anlegen (siehe supabase/logo_vorlagen_schema.sql).')
          return
        }
        pngPath = uploaded
      }

      if (pendingSvg) {
        const uploaded = await uploadFile(pendingSvg, 'logo-vorlagen')
        if (!uploaded) {
          setError('SVG Upload fehlgeschlagen. Bucket "logo-vorlagen" fehlt? Bitte anlegen (siehe supabase/logo_vorlagen_schema.sql).')
          return
        }
        svgPath = uploaded
      }

      if (!pngPath || !svgPath) {
        setError('Beide Dateien sind erforderlich.')
        return
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        png_path: pngPath,
        svg_path: svgPath,
      }

      if (editing) {
        const { error } = await supabase.from('logo_templates').update(payload).eq('id', editing.id)
        if (error) throw error
        setSuccess('Vorlage aktualisiert.')
      } else {
        const { error } = await supabase.from('logo_templates').insert({ ...payload, is_active: true })
        if (error) throw error
        setSuccess('Vorlage gespeichert.')
      }

      await loadTemplates()
      setTimeout(() => closeModal(), 900)
    } catch (err: any) {
      setError(err.message || 'Fehler beim Speichern.')
    }
  }

  const toggleActive = async (tpl: LogoTemplate) => {
    await supabase.from('logo_templates').update({ is_active: !tpl.is_active }).eq('id', tpl.id)
    await loadTemplates()
  }

  const handleDelete = async (tpl: LogoTemplate) => {
    if (!confirm('Vorlage wirklich löschen?')) return
    try {
      await supabase.storage.from('logo-vorlagen').remove([tpl.png_path, tpl.svg_path])
      await supabase.from('logo_templates').delete().eq('id', tpl.id)
      await loadTemplates()
    } catch (e: any) {
      setError('Löschen fehlgeschlagen.')
    }
  }

  const getPreviewUrl = (path: string) => {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL
    return `${base}/storage/v1/object/public/logo-vorlagen/${path}`
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-[28px] font-bold tracking-[-0.035em] text-anthracite">
          Logo Vorlagen
        </h1>
        <p className="mt-1 text-[15px] text-anthracite/70">
          Kostenlose Logo-Vorlagen verwalten und zum Download anbieten.
        </p>
      </div>

      <div className="mb-6">
        <button
          onClick={openNew}
          className="inline-flex items-center rounded-md bg-ruby px-4 py-2 text-sm font-semibold text-offwhite hover:bg-ruby/90"
        >
          + Neue Vorlage
        </button>
      </div>

      {error && <div className="mb-4 rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
      {success && <div className="mb-4 rounded bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">{success}</div>}

      {loading ? (
        <div className="py-12 text-center text-anthracite/50">Lade...</div>
      ) : templates.length === 0 ? (
        <div className="rounded-xl border border-anthracite/10 bg-white p-8 text-center">
          <p className="text-anthracite/70">Noch keine Logo-Vorlagen vorhanden.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((tpl) => (
            <div key={tpl.id} className="rounded-xl border border-anthracite/10 bg-white p-4">
              <div className="aspect-[4/3] bg-offwhite rounded-lg overflow-hidden mb-3 border border-anthracite/10">
                <img
                  src={getPreviewUrl(tpl.png_path)}
                  alt={tpl.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="font-semibold text-anthracite">{tpl.title}</div>
              {tpl.description && <p className="text-sm text-anthracite/70 mt-1 line-clamp-2">{tpl.description}</p>}
              <div className="mt-3 flex items-center justify-between text-xs">
                <button
                  onClick={() => toggleActive(tpl)}
                  className={`px-2 py-1 rounded border ${tpl.is_active ? 'border-green-200 text-green-700' : 'border-anthracite/15 text-anthracite/60'}`}
                >
                  {tpl.is_active ? 'Aktiv' : 'Inaktiv'}
                </button>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(tpl)} className="px-2 py-1 border border-anthracite/15 rounded hover:border-ruby/40">Bearbeiten</button>
                  <button onClick={() => handleDelete(tpl)} className="px-2 py-1 border border-red-200 text-red-600 rounded hover:bg-red-50">Löschen</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-anthracite/50 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-anthracite/10 bg-white p-6 shadow-xl">
            <h3 className="font-display text-xl font-semibold mb-4">
              {editing ? 'Vorlage bearbeiten' : 'Neue Vorlage'}
            </h3>

            {error && <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block text-anthracite/70 text-xs mb-1">Titel *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-md border border-anthracite/15 px-3 py-2 focus:border-ruby/40 outline-none"
                />
              </div>

              <div>
                <label className="block text-anthracite/70 text-xs mb-1">Beschreibung</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full rounded-md border border-anthracite/15 px-3 py-2 focus:border-ruby/40 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-anthracite/70 text-xs mb-1">PNG Datei {editing ? '(optional zum Ersetzen)' : '*'}</label>
                  <input type="file" accept="image/png" onChange={handlePngSelect} className="text-sm" />
                  {pngPreview && (
                    <img src={pngPreview} alt="PNG Vorschau" className="mt-2 max-h-24 border rounded" />
                  )}
                  {editing && !pendingPng && (
                    <div className="text-xs text-anthracite/60 mt-1">Aktuell: {editing.png_path.split('/').pop()}</div>
                  )}
                </div>

                <div>
                  <label className="block text-anthracite/70 text-xs mb-1">SVG Datei {editing ? '(optional zum Ersetzen)' : '*'}</label>
                  <input type="file" accept=".svg" onChange={handleSvgSelect} className="text-sm" />
                  {pendingSvg && <div className="text-xs mt-1 text-green-600">SVG ausgewählt: {pendingSvg.name}</div>}
                  {editing && !pendingSvg && (
                    <div className="text-xs text-anthracite/60 mt-1">Aktuell: {editing.svg_path.split('/').pop()}</div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 rounded-md border border-anthracite/20 py-2 text-sm hover:bg-anthracite/5">
                  Abbrechen
                </button>
                <button type="submit" className="flex-1 rounded-md bg-ruby py-2 text-sm font-semibold text-offwhite hover:bg-ruby/90">
                  {editing ? 'Aktualisieren' : 'Speichern'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
