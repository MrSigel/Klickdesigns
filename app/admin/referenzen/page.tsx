'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type PortfolioReference = {
  id: string
  title: string
  slug: string | null
  description: string | null
  category: string | null
  media_type: 'image' | 'video' | 'pdf'
  media_path: string
  media_url: string | null
  thumbnail_path: string | null
  alt_text: string | null
  external_url: string | null
  link_label: string | null
  is_visible: boolean
  is_featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

const MEDIA_TYPES = ['image', 'video', 'pdf'] as const

export default function AdminReferenzen() {
  const [refs, setRefs] = useState<PortfolioReference[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<PortfolioReference | null>(null)
  const [form, setForm] = useState<any>({})
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [removeMedia, setRemoveMedia] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClient()

  const loadRefs = async () => {
    const { data, error } = await supabase
      .from('portfolio_references')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    if (!error && data) setRefs(data as PortfolioReference[])
  }

  const loadAll = async () => {
    setLoading(true)
    await loadRefs()
    setLoading(false)
  }

  useEffect(() => {
    loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showMessage = (msg: string, isError = false) => {
    if (isError) {
      setError(msg)
      setSuccess('')
    } else {
      setSuccess(msg)
      setError('')
    }
    setTimeout(() => {
      setError('')
      setSuccess('')
    }, 2400)
  }

  const openNew = () => {
    setEditing(null)
    setForm({
      title: '',
      slug: '',
      description: '',
      category: '',
      media_type: 'image',
      alt_text: '',
      external_url: '',
      link_label: '',
      is_visible: true,
      is_featured: false,
      sort_order: 0,
    })
    setPendingFile(null)
    setPreviewUrl(null)
    setRemoveMedia(false)
    setModalOpen(true)
    setError('')
    setSuccess('')
  }

  const openEdit = (ref: PortfolioReference) => {
    setEditing(ref)
    setForm({
      title: ref.title || '',
      slug: ref.slug || '',
      description: ref.description || '',
      category: ref.category || '',
      media_type: ref.media_type || 'image',
      alt_text: ref.alt_text || '',
      external_url: ref.external_url || '',
      link_label: ref.link_label || '',
      is_visible: ref.is_visible,
      is_featured: ref.is_featured,
      sort_order: ref.sort_order ?? 0,
    })
    setPendingFile(null)
    setPreviewUrl(null)
    setRemoveMedia(false)
    setModalOpen(true)
    setError('')
    setSuccess('')
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
    setPendingFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setRemoveMedia(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const okTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'application/pdf']
    const ext = file.name.toLowerCase().split('.').pop() || ''
    const isAllowed = okTypes.includes(file.type) || ['jpg','jpeg','png','webp','mp4','webm','pdf'].includes(ext)
    if (!isAllowed) {
      showMessage('Erlaubte Dateien: JPG, PNG, WEBP, MP4, WEBM, PDF', true)
      return
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPendingFile(file)
    setRemoveMedia(false)
    if (file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file))
    } else {
      setPreviewUrl(null)
    }
  }

  const clearPendingMedia = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPendingFile(null)
    setPreviewUrl(null)
    setRemoveMedia(true)
  }

  const getMediaPublicUrl = (path: string) => {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!base) return ''
    return `${base}/storage/v1/object/public/portfolio-media/${path}`
  }

  const uploadMedia = async (file: File): Promise<{ path: string; type: 'image' | 'video' | 'pdf' } | null> => {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 40) || 'file'
    const fileName = `ref-${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`
    const path = `portfolio-media/${fileName}`
    const { error } = await supabase.storage.from('portfolio-media').upload(path, file, { upsert: false })
    if (error) {
      console.error('Storage upload error', error)
      return null
    }
    let mType: 'image' | 'video' | 'pdf' = 'image'
    if (file.type.startsWith('video/') || ['mp4','webm'].includes(ext)) mType = 'video'
    else if (file.type === 'application/pdf' || ext === 'pdf') mType = 'pdf'
    return { path, type: mType }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.title?.trim()) {
      setError('Titel ist erforderlich.')
      return
    }

    try {
      let mediaPath = editing?.media_path || null
      let mediaType = editing?.media_type || 'image'

      if (pendingFile) {
        const uploaded = await uploadMedia(pendingFile)
        if (uploaded) {
          // optionally delete old if different
          if (editing && editing.media_path && editing.media_path !== uploaded.path) {
            try { await supabase.storage.from('portfolio-media').remove([editing.media_path]) } catch {}
          }
          mediaPath = uploaded.path
          mediaType = uploaded.type
          await logActivity(editing?.id || 'new', 'media_uploaded', `Medium hochgeladen für: ${form.title}`)
        } else {
          setError('Upload fehlgeschlagen. Bitte erneut versuchen.')
          return
        }
      } else if (removeMedia && editing) {
        // keep previous or clear? do not allow empty media
        if (!editing.media_path) {
          setError('Ein Medium ist erforderlich.')
          return
        }
        // keep existing
      }

      if (!mediaPath) {
        setError('Ein Medium (Bild/Video/PDF) ist erforderlich.')
        return
      }

      const payload: any = {
        title: form.title.trim(),
        slug: form.slug?.trim() || null,
        description: form.description?.trim() || null,
        category: form.category?.trim() || null,
        media_type: mediaType,
        media_path: mediaPath,
        media_url: null,
        thumbnail_path: null,
        alt_text: form.alt_text?.trim() || null,
        external_url: form.external_url?.trim() || null,
        link_label: form.link_label?.trim() || null,
        is_visible: !!form.is_visible,
        is_featured: !!form.is_featured,
        sort_order: Number(form.sort_order) || 0,
      }

      if (editing) {
        const { error } = await supabase.from('portfolio_references').update(payload).eq('id', editing.id)
        if (error) throw error
        await logActivity(editing.id, 'updated', `Referenz bearbeitet: ${payload.title}`)
        showMessage('Referenz aktualisiert.')
      } else {
        const { data, error } = await supabase.from('portfolio_references').insert(payload).select('id').single()
        if (error) throw error
        if (data) await logActivity(data.id, 'created', `Referenz erstellt: ${payload.title}`)
        showMessage('Referenz gespeichert.')
      }

      await loadRefs()
      setTimeout(() => closeModal(), 900)
    } catch (err: any) {
      setError(err.message || 'Fehler beim Speichern.')
    }
  }

  const handleDelete = async (ref: PortfolioReference) => {
    if (!confirm(`Referenz „${ref.title}“ wirklich löschen?`)) return
    try {
      // optional: remove file
      try { await supabase.storage.from('portfolio-media').remove([ref.media_path]) } catch {}
      await supabase.from('portfolio_references').delete().eq('id', ref.id)
      await logActivity(ref.id, 'deleted', `Referenz gelöscht: ${ref.title}`)
      await loadRefs()
    } catch (e: any) {
      showMessage('Löschen fehlgeschlagen: ' + (e?.message || ''), true)
    }
  }

  const toggleVisible = async (ref: PortfolioReference) => {
    const newVal = !ref.is_visible
    await supabase.from('portfolio_references').update({ is_visible: newVal }).eq('id', ref.id)
    await logActivity(ref.id, 'visibility_changed', `Referenz ${newVal ? 'sichtbar' : 'unsichtbar'}: ${ref.title}`)
    await loadRefs()
  }

  const toggleFeatured = async (ref: PortfolioReference) => {
    const newVal = !ref.is_featured
    await supabase.from('portfolio_references').update({ is_featured: newVal }).eq('id', ref.id)
    await logActivity(ref.id, 'featured_changed', `Referenz ${newVal ? 'hervorgehoben' : 'nicht hervorgehoben'}: ${ref.title}`)
    await loadRefs()
  }

  const updateSort = async (ref: PortfolioReference, newOrder: number) => {
    await supabase.from('portfolio_references').update({ sort_order: newOrder }).eq('id', ref.id)
    await loadRefs()
  }

  const logActivity = async (entityId: string, action: string, message: string) => {
    try {
      await supabase.from('activity_logs').insert({
        entity_type: 'portfolio_reference',
        entity_id: entityId || null,
        action,
        message,
      })
    } catch {}
  }

  const openExternal = (url: string | null) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  const renderPreview = (ref: PortfolioReference) => {
    const url = getMediaPublicUrl(ref.media_path)
    if (ref.media_type === 'image') {
      return (
        <img src={url} alt={ref.alt_text || ref.title} className="h-12 w-16 rounded object-cover border border-anthracite/10 bg-offwhite" />
      )
    }
    if (ref.media_type === 'video') {
      return (
        <div className="flex h-12 w-16 items-center justify-center rounded border border-anthracite/10 bg-anthracite/5 text-[10px] text-anthracite/60">VIDEO</div>
      )
    }
    return (
      <div className="flex h-12 w-16 items-center justify-center rounded border border-anthracite/10 bg-red-50 text-[10px] font-semibold text-red-700">PDF</div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-[28px] font-bold tracking-[-0.035em] text-anthracite">
          Referenzen
        </h1>
        <p className="mt-1 text-[15px] text-anthracite/70">
          Portfolio-Arbeiten verwalten und auf der Landingpage anzeigen.
        </p>
      </div>

      <div className="mb-6">
        <button
          onClick={openNew}
          className="inline-flex items-center rounded-md bg-ruby px-4 py-2 text-sm font-semibold text-offwhite hover:bg-ruby/90"
        >
          + Neue Referenz
        </button>
      </div>

      {error && <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
      {success && <div className="mb-4 rounded-md bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">{success}</div>}

      {loading ? (
        <div className="py-12 text-center text-anthracite/50">Lade...</div>
      ) : refs.length === 0 ? (
        <div className="rounded-xl border border-anthracite/10 bg-white p-8 text-center">
          <p className="text-anthracite/70">Noch keine Referenzen vorhanden.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-anthracite/10 bg-white">
          <table className="min-w-full divide-y divide-anthracite/10 text-sm">
            <thead>
              <tr className="text-left text-anthracite/60">
                <th className="px-4 py-3">Vorschau</th>
                <th className="px-4 py-3">Titel</th>
                <th className="px-4 py-3">Kategorie</th>
                <th className="px-4 py-3">Typ</th>
                <th className="px-4 py-3">Sichtbar</th>
                <th className="px-4 py-3">Hervorgehoben</th>
                <th className="px-4 py-3">Sort.</th>
                <th className="px-4 py-3">Link</th>
                <th className="px-4 py-3">Erstellt</th>
                <th className="px-4 py-3 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-anthracite/10">
              {refs.map((r) => (
                <tr key={r.id} className="hover:bg-anthracite/5">
                  <td className="px-4 py-3">{renderPreview(r)}</td>
                  <td className="px-4 py-3 font-medium text-anthracite max-w-[220px] truncate">{r.title}</td>
                  <td className="px-4 py-3 text-anthracite/70">{r.category || '—'}</td>
                  <td className="px-4 py-3 uppercase tracking-[0.5px] text-xs text-anthracite/60">{r.media_type}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleVisible(r)}
                      className={`inline-flex items-center rounded px-2 py-0.5 text-xs border ${r.is_visible ? 'border-green-200 text-green-700 bg-green-50' : 'border-anthracite/15 text-anthracite/60'}`}
                    >
                      {r.is_visible ? 'Sichtbar' : 'Ausgeblendet'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleFeatured(r)}
                      className={`inline-flex items-center rounded px-2 py-0.5 text-xs border ${r.is_featured ? 'border-ruby/40 text-ruby bg-ruby/5' : 'border-anthracite/15 text-anthracite/60'}`}
                    >
                      {r.is_featured ? 'Ja' : 'Nein'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      defaultValue={r.sort_order}
                      onBlur={(e) => {
                        const v = parseInt(e.target.value, 10)
                        if (!isNaN(v) && v !== r.sort_order) updateSort(r, v)
                      }}
                      className="w-16 rounded border border-anthracite/15 px-2 py-0.5 text-xs"
                    />
                  </td>
                  <td className="px-4 py-3">
                    {r.external_url ? (
                      <button onClick={() => openExternal(r.external_url)} className="text-ruby hover:underline text-xs">Öffnen</button>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-anthracite/50">{new Date(r.created_at).toLocaleDateString('de-DE')}</td>
                  <td className="px-4 py-3 text-right space-x-1 text-xs">
                    <button onClick={() => openEdit(r)} className="rounded border border-anthracite/15 px-2 py-1 hover:border-ruby/40">Bearbeiten</button>
                    <button onClick={() => handleDelete(r)} className="rounded border border-red-200 px-2 py-1 text-red-600 hover:bg-red-50">Löschen</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-anthracite/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-anthracite/10 bg-white p-6 shadow-xl">
            <h3 className="font-display text-xl font-semibold mb-4">
              {editing ? 'Referenz bearbeiten' : 'Neue Referenz'}
            </h3>

            {error && <div className="mb-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block text-anthracite/70 text-xs mb-1">Titel *</label>
                <input
                  required
                  value={form.title || ''}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-md border border-anthracite/15 px-3 py-2 focus:border-ruby/40 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-anthracite/70 text-xs mb-1">Kategorie</label>
                  <input
                    value={form.category || ''}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-md border border-anthracite/15 px-3 py-2 focus:border-ruby/40 outline-none"
                    placeholder="z. B. Logo, Social, Print"
                  />
                </div>
                <div>
                  <label className="block text-anthracite/70 text-xs mb-1">Sortierung</label>
                  <input
                    type="number"
                    value={form.sort_order ?? 0}
                    onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-md border border-anthracite/15 px-3 py-2 focus:border-ruby/40 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-anthracite/70 text-xs mb-1">Beschreibung</label>
                <textarea
                  rows={3}
                  value={form.description || ''}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-md border border-anthracite/15 px-3 py-2 focus:border-ruby/40 outline-none"
                />
              </div>

              <div>
                <label className="block text-anthracite/70 text-xs mb-1">Medium hochladen (Bild, Video oder PDF) *</label>
                <input type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,application/pdf" onChange={handleFileSelect} />
                {pendingFile && (
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <span>{pendingFile.name}</span>
                    <button type="button" onClick={clearPendingMedia} className="text-red-600 underline">entfernen</button>
                  </div>
                )}
                {!pendingFile && editing?.media_path && !removeMedia && (
                  <div className="mt-1 text-xs text-anthracite/70 flex items-center gap-2">
                    Aktuell: {editing.media_path.split('/').pop()}
                    <button type="button" onClick={clearPendingMedia} className="text-red-600 underline">ersetzen / entfernen</button>
                  </div>
                )}
                {previewUrl && <img src={previewUrl} alt="preview" className="mt-2 h-20 w-auto rounded border" />}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-anthracite/70 text-xs mb-1">Alt-Text</label>
                  <input
                    value={form.alt_text || ''}
                    onChange={(e) => setForm({ ...form, alt_text: e.target.value })}
                    className="w-full rounded-md border border-anthracite/15 px-3 py-2 focus:border-ruby/40 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-anthracite/70 text-xs mb-1">Link-Label</label>
                  <input
                    value={form.link_label || ''}
                    onChange={(e) => setForm({ ...form, link_label: e.target.value })}
                    className="w-full rounded-md border border-anthracite/15 px-3 py-2 focus:border-ruby/40 outline-none"
                    placeholder="Projekt ansehen"
                  />
                </div>
              </div>

              <div>
                <label className="block text-anthracite/70 text-xs mb-1">Externer Link</label>
                <input
                  type="url"
                  value={form.external_url || ''}
                  onChange={(e) => setForm({ ...form, external_url: e.target.value })}
                  className="w-full rounded-md border border-anthracite/15 px-3 py-2 focus:border-ruby/40 outline-none"
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!form.is_visible} onChange={(e) => setForm({ ...form, is_visible: e.target.checked })} />
                  Sichtbar auf Landingpage
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
                  Hervorgehoben
                </label>
              </div>

              <div className="flex gap-3 pt-3">
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
