'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type SocialPost = {
  id: string
  title: string
  platform: 'facebook' | 'instagram' | 'tiktok'
  category: string | null
  post_text: string
  hashtags: string | null
  cta: string | null
  target_url: string | null
  media_path: string | null
  media_type: string | null
  planned_for: string | null
  is_done: boolean
  done_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

type SocialTemplate = {
  id: string
  title: string
  category: string | null
  platform: string | null
  subject_hint: string | null
  template_text: string
  hashtags: string | null
  cta: string | null
  is_active: boolean
  created_at: string
}

const PLATFORM_OPTIONS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
] as const

export default function AdminSocialMedia() {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [templates, setTemplates] = useState<SocialTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'posts' | 'templates' | 'calendar'>('posts')

  const [postModalOpen, setPostModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null)
  const [postForm, setPostForm] = useState<any>({})
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [removeMedia, setRemoveMedia] = useState(false)

  const [templateModalOpen, setTemplateModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<SocialTemplate | null>(null)
  const [templateForm, setTemplateForm] = useState<any>({})

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClient()

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from('social_posts')
      .select('*')
      .order('planned_for', { ascending: true, nullsFirst: true })
      .order('created_at', { ascending: false })
    if (!error && data) setPosts(data as SocialPost[])
  }

  const loadTemplates = async () => {
    const { data, error } = await supabase
      .from('social_templates')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setTemplates(data as SocialTemplate[])
  }

  const loadAll = async () => {
    setLoading(true)
    await Promise.all([loadPosts(), loadTemplates()])
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
      setSuccess('')
      setError('')
    }, 2200)
  }

  // ---------- POSTS ----------

  const openNewPost = () => {
    setEditingPost(null)
    setPostForm({
      title: '',
      platform: 'instagram',
      category: '',
      post_text: '',
      hashtags: '',
      cta: '',
      target_url: '',
      planned_for: '',
      notes: '',
    })
    setPendingFile(null)
    setPreviewUrl(null)
    setRemoveMedia(false)
    setPostModalOpen(true)
    setError('')
    setSuccess('')
  }

  const openEditPost = (post: SocialPost) => {
    setEditingPost(post)
    setPostForm({
      title: post.title || '',
      platform: post.platform || 'instagram',
      category: post.category || '',
      post_text: post.post_text || '',
      hashtags: post.hashtags || '',
      cta: post.cta || '',
      target_url: post.target_url || '',
      planned_for: post.planned_for ? toDateTimeLocal(post.planned_for) : '',
      notes: post.notes || '',
    })
    setPendingFile(null)
    setPreviewUrl(null)
    setRemoveMedia(false)
    setPostModalOpen(true)
    setError('')
    setSuccess('')
  }

  const closePostModal = () => {
    setPostModalOpen(false)
    setEditingPost(null)
    setPendingFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setRemoveMedia(false)
  }

  function toDateTimeLocal(iso: string) {
    const d = new Date(iso)
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      showMessage('Nur Bilder oder Videos erlaubt.', true)
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

  const uploadMedia = async (file: File): Promise<{ path: string; type: string } | null> => {
    const ext = file.name.split('.').pop() || 'bin'
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const path = `social-media/${fileName}`
    const { error } = await supabase.storage.from('social-media').upload(path, file, { upsert: false })
    if (error) {
      console.error('Upload error', error)
      return null
    }
    const mediaType = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'other'
    return { path, type: mediaType }
  }

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!postForm.title?.trim() || !postForm.post_text?.trim()) {
      setError('Titel und Post-Text sind erforderlich.')
      return
    }

    try {
      let mediaPath: string | null = editingPost?.media_path || null
      let mediaType: string | null = editingPost?.media_type || null

      if (pendingFile) {
        const uploaded = await uploadMedia(pendingFile)
        if (uploaded) {
          mediaPath = uploaded.path
          mediaType = uploaded.type
        } else {
          showMessage('Media-Upload fehlgeschlagen. Beitrag ohne Medium gespeichert.', true)
        }
      } else if (removeMedia) {
        mediaPath = null
        mediaType = null
      }

      const planned = postForm.planned_for
        ? new Date(postForm.planned_for).toISOString()
        : null

      const payload = {
        title: postForm.title.trim(),
        platform: postForm.platform,
        category: postForm.category?.trim() || null,
        post_text: postForm.post_text.trim(),
        hashtags: postForm.hashtags?.trim() || null,
        cta: postForm.cta?.trim() || null,
        target_url: postForm.target_url?.trim() || null,
        media_path: mediaPath,
        media_type: mediaType,
        planned_for: planned,
        notes: postForm.notes?.trim() || null,
      }

      if (editingPost) {
        const { error } = await supabase.from('social_posts').update(payload).eq('id', editingPost.id)
        if (error) throw error
        await logActivity(editingPost.id, 'updated', `Social Post aktualisiert: ${payload.title}`)
        showMessage('Beitrag aktualisiert.')
      } else {
        const { data, error } = await supabase.from('social_posts').insert(payload).select('id').single()
        if (error) throw error
        if (data) await logActivity(data.id, 'created', `Social Post erstellt: ${payload.title}`)
        showMessage('Beitrag gespeichert.')
      }

      await loadPosts()
      setTimeout(() => closePostModal(), 900)
    } catch (err: any) {
      setError(err.message || 'Fehler beim Speichern.')
    }
  }

  const handleDeletePost = async (id: string, title: string) => {
    if (!confirm('Beitrag wirklich löschen?')) return
    await supabase.from('social_posts').delete().eq('id', id)
    await logActivity(id, 'deleted', `Social Post gelöscht: ${title}`)
    await loadPosts()
  }

  const handleToggleDone = async (post: SocialPost) => {
    const newDone = !post.is_done
    const payload: any = {
      is_done: newDone,
      done_at: newDone ? new Date().toISOString() : null,
    }
    await supabase.from('social_posts').update(payload).eq('id', post.id)
    await logActivity(post.id, newDone ? 'marked_done' : 'unmarked', `Social Post ${newDone ? 'erledigt' : 'nicht erledigt'}: ${post.title}`)
    await loadPosts()
  }

  const copyPostText = async (post: SocialPost) => {
    const parts: string[] = [post.post_text]
    if (post.hashtags) parts.push(post.hashtags)
    if (post.cta) parts.push(post.cta)
    if (post.target_url) parts.push(post.target_url)
    const text = parts.filter(Boolean).join('\n\n').trim()

    try {
      await navigator.clipboard.writeText(text)
      showMessage('Text kopiert.')
    } catch {
      // Fallback
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
        showMessage('Text kopiert.')
      } catch {
        prompt('Kopieren nicht möglich. Bitte manuell kopieren:', text)
      }
      document.body.removeChild(ta)
    }
  }

  // ---------- TEMPLATES ----------

  const openNewTemplate = () => {
    setEditingTemplate(null)
    setTemplateForm({
      title: '',
      category: '',
      platform: '',
      subject_hint: '',
      template_text: '',
      hashtags: '',
      cta: '',
      is_active: true,
    })
    setTemplateModalOpen(true)
    setError('')
    setSuccess('')
  }

  const openEditTemplate = (tpl: SocialTemplate) => {
    setEditingTemplate(tpl)
    setTemplateForm({
      title: tpl.title || '',
      category: tpl.category || '',
      platform: tpl.platform || '',
      subject_hint: tpl.subject_hint || '',
      template_text: tpl.template_text || '',
      hashtags: tpl.hashtags || '',
      cta: tpl.cta || '',
      is_active: tpl.is_active,
    })
    setTemplateModalOpen(true)
    setError('')
    setSuccess('')
  }

  const closeTemplateModal = () => {
    setTemplateModalOpen(false)
    setEditingTemplate(null)
  }

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!templateForm.title?.trim() || !templateForm.template_text?.trim()) {
      setError('Titel und Vorlagentext sind erforderlich.')
      return
    }

    try {
      const payload = {
        title: templateForm.title.trim(),
        category: templateForm.category?.trim() || null,
        platform: templateForm.platform || null,
        subject_hint: templateForm.subject_hint?.trim() || null,
        template_text: templateForm.template_text.trim(),
        hashtags: templateForm.hashtags?.trim() || null,
        cta: templateForm.cta?.trim() || null,
        is_active: !!templateForm.is_active,
      }

      if (editingTemplate) {
        const { error } = await supabase.from('social_templates').update(payload).eq('id', editingTemplate.id)
        if (error) throw error
        await logActivity(editingTemplate.id, 'updated', `Social Template aktualisiert: ${payload.title}`, 'social_template')
        showMessage('Vorlage aktualisiert.')
      } else {
        const { data, error } = await supabase.from('social_templates').insert(payload).select('id').single()
        if (error) throw error
        if (data) await logActivity(data.id, 'created', `Social Template erstellt: ${payload.title}`, 'social_template')
        showMessage('Vorlage gespeichert.')
      }

      await loadTemplates()
      setTimeout(() => closeTemplateModal(), 900)
    } catch (err: any) {
      setError(err.message || 'Fehler beim Speichern.')
    }
  }

  const handleDeleteTemplate = async (id: string, title: string) => {
    if (!confirm('Vorlage wirklich löschen?')) return
    await supabase.from('social_templates').delete().eq('id', id)
    await logActivity(id, 'deleted', `Social Template gelöscht: ${title}`, 'social_template')
    await loadTemplates()
  }

  const handleToggleActive = async (tpl: SocialTemplate) => {
    const newActive = !tpl.is_active
    await supabase.from('social_templates').update({ is_active: newActive }).eq('id', tpl.id)
    await logActivity(tpl.id, newActive ? 'activated' : 'deactivated', `Social Template ${newActive ? 'aktiviert' : 'deaktiviert'}: ${tpl.title}`, 'social_template')
    await loadTemplates()
  }

  const applyTemplateToPost = (tpl: SocialTemplate) => {
    setEditingPost(null)
    setPostForm({
      title: tpl.title || '',
      platform: tpl.platform || 'instagram',
      category: tpl.category || '',
      post_text: tpl.template_text || '',
      hashtags: tpl.hashtags || '',
      cta: tpl.cta || '',
      target_url: '',
      planned_for: '',
      notes: tpl.subject_hint ? `Thema: ${tpl.subject_hint}` : '',
    })
    setPendingFile(null)
    setPreviewUrl(null)
    setRemoveMedia(false)
    setPostModalOpen(true)
    setTemplateModalOpen(false)
    setError('')
    setSuccess('')
  }

  // ---------- CALENDAR GROUPS ----------

  const getCalendarGroups = () => {
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfWeek = new Date(startOfToday)
    endOfWeek.setDate(endOfWeek.getDate() + 7)

    const today: SocialPost[] = []
    const thisWeek: SocialPost[] = []
    const later: SocialPost[] = []
    const noDate: SocialPost[] = []

    posts.forEach((p) => {
      if (!p.planned_for) {
        noDate.push(p)
        return
      }
      const d = new Date(p.planned_for)
      if (d >= startOfToday && d < new Date(startOfToday.getTime() + 86400000)) {
        today.push(p)
      } else if (d >= startOfToday && d < endOfWeek) {
        thisWeek.push(p)
      } else if (d >= endOfWeek) {
        later.push(p)
      } else {
        noDate.push(p)
      }
    })

    return { today, thisWeek, later, noDate }
  }

  const calendarGroups = getCalendarGroups()

  // ---------- ACTIVITY LOG ----------

  const logActivity = async (entityId: string, action: string, message: string, type = 'social_post') => {
    try {
      await supabase.from('activity_logs').insert({
        entity_type: type,
        entity_id: entityId,
        action,
        message,
      })
    } catch {
      // ignore log errors
    }
  }

  // ---------- RENDER ----------

  const renderPostCard = (post: SocialPost) => {
    const plat = PLATFORM_OPTIONS.find((p) => p.value === post.platform)
    const plannedLabel = post.planned_for
      ? new Date(post.planned_for).toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' })
      : 'Ohne Datum'

    return (
      <div key={post.id} className="rounded-xl border border-anthracite/10 bg-white p-5 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-semibold text-anthracite text-[15px]">{post.title}</div>
            <div className="mt-1 flex items-center gap-2 text-xs">
              <span className="inline-block rounded border border-anthracite/15 px-1.5 py-0.5 text-anthracite/70">{plat?.label}</span>
              {post.category && <span className="text-anthracite/50">{post.category}</span>}
              {post.is_done && <span className="inline-block rounded bg-green-100 px-1.5 py-0.5 text-green-700">Erledigt</span>}
            </div>
          </div>
          <div className="text-right text-xs text-anthracite/50 whitespace-nowrap">{plannedLabel}</div>
        </div>

        <div className="mt-3 text-sm text-anthracite/80 line-clamp-3 whitespace-pre-line">{post.post_text}</div>

        {(post.hashtags || post.cta || post.target_url) && (
          <div className="mt-3 space-y-1 text-xs text-anthracite/60">
            {post.hashtags && <div>{post.hashtags}</div>}
            {post.cta && <div>{post.cta}</div>}
            {post.target_url && <div className="truncate text-ruby/80">{post.target_url}</div>}
          </div>
        )}

        {post.media_path && (
          <div className="mt-2 text-[11px] text-anthracite/50">Media: {post.media_path.split('/').pop()}</div>
        )}

        {post.notes && <div className="mt-2 text-xs italic text-anthracite/50">Notizen: {post.notes}</div>}

        <div className="mt-auto pt-4 flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => copyPostText(post)}
            className="rounded-md border border-anthracite/15 px-3 py-1 hover:border-ruby/40 hover:text-ruby"
          >
            Text kopieren
          </button>
          <button
            onClick={() => openEditPost(post)}
            className="rounded-md border border-anthracite/15 px-3 py-1 hover:border-ruby/40"
          >
            Bearbeiten
          </button>
          <button
            onClick={() => handleToggleDone(post)}
            className="rounded-md border border-anthracite/15 px-3 py-1 hover:border-ruby/40"
          >
            {post.is_done ? 'Rückgängig' : 'Als erledigt'}
          </button>
          <button
            onClick={() => handleDeletePost(post.id, post.title)}
            className="rounded-md border border-red-200 px-3 py-1 text-red-600 hover:bg-red-50"
          >
            Löschen
          </button>
        </div>
      </div>
    )
  }

  const renderTemplateCard = (tpl: SocialTemplate) => {
    const plat = PLATFORM_OPTIONS.find((p) => p.value === tpl.platform)
    return (
      <div key={tpl.id} className="rounded-xl border border-anthracite/10 bg-white p-5 flex flex-col">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-semibold text-anthracite">{tpl.title}</div>
            <div className="text-xs text-anthracite/50 mt-0.5">
              {tpl.category || '—'} {plat ? `• ${plat.label}` : ''}
            </div>
          </div>
          <div>
            <button
              onClick={() => handleToggleActive(tpl)}
              className={`text-xs px-2 py-0.5 rounded border ${tpl.is_active ? 'border-green-200 text-green-700' : 'border-anthracite/20 text-anthracite/50'}`}
            >
              {tpl.is_active ? 'Aktiv' : 'Inaktiv'}
            </button>
          </div>
        </div>

        <div className="mt-3 text-sm text-anthracite/80 line-clamp-3 whitespace-pre-line">{tpl.template_text}</div>

        {(tpl.hashtags || tpl.cta) && (
          <div className="mt-2 text-xs text-anthracite/60">
            {tpl.hashtags && <div>{tpl.hashtags}</div>}
            {tpl.cta && <div>{tpl.cta}</div>}
          </div>
        )}

        <div className="mt-auto pt-4 flex gap-2 text-xs">
          <button
            onClick={() => applyTemplateToPost(tpl)}
            className="rounded-md border border-anthracite/15 px-3 py-1 hover:border-ruby/40 hover:text-ruby"
          >
            In Beitrag übernehmen
          </button>
          <button
            onClick={() => openEditTemplate(tpl)}
            className="rounded-md border border-anthracite/15 px-3 py-1 hover:border-ruby/40"
          >
            Bearbeiten
          </button>
          <button
            onClick={() => handleDeleteTemplate(tpl.id, tpl.title)}
            className="rounded-md border border-red-200 px-3 py-1 text-red-600 hover:bg-red-50"
          >
            Löschen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-[28px] font-bold tracking-[-0.035em] text-anthracite">
          Social Media
        </h1>
        <p className="mt-1 text-[15px] text-anthracite/70">
          Beiträge planen, Vorlagen speichern und Inhalte vorbereiten.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={openNewPost}
          className="inline-flex items-center rounded-md bg-ruby px-4 py-2 text-sm font-semibold text-offwhite hover:bg-ruby/90"
        >
          + Neuer Beitrag
        </button>
        <button
          onClick={openNewTemplate}
          className="inline-flex items-center rounded-md border border-anthracite/15 px-4 py-2 text-sm font-semibold hover:bg-anthracite/5"
        >
          + Neue Vorlage
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 border-b border-anthracite/10 text-sm">
        {[
          { key: 'posts', label: 'Geplante Beiträge' },
          { key: 'templates', label: 'Vorlagen/Textbausteine' },
          { key: 'calendar', label: 'Kalender' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`px-4 py-2 -mb-px border-b-2 transition ${
              activeTab === t.key
                ? 'border-ruby text-anthracite font-medium'
                : 'border-transparent text-anthracite/60 hover:text-anthracite'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
      {success && <div className="mb-4 rounded-md bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">{success}</div>}

      {loading ? (
        <div className="py-12 text-center text-anthracite/50 text-sm">Lade...</div>
      ) : (
        <>
          {/* POSTS TAB */}
          {activeTab === 'posts' && (
            <>
              {posts.length === 0 ? (
                <div className="rounded-xl border border-anthracite/10 bg-white p-8 text-center">
                  <p className="text-anthracite/70">Noch keine Social-Media-Beiträge geplant.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {posts.map((p) => renderPostCard(p))}
                </div>
              )}
            </>
          )}

          {/* TEMPLATES TAB */}
          {activeTab === 'templates' && (
            <>
              {templates.length === 0 ? (
                <div className="rounded-xl border border-anthracite/10 bg-white p-8 text-center">
                  <p className="text-anthracite/70">Noch keine Vorlagen gespeichert.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((t) => renderTemplateCard(t))}
                </div>
              )}
            </>
          )}

          {/* CALENDAR TAB */}
          {activeTab === 'calendar' && (
            <div className="space-y-8">
              {[
                { label: 'Heute', items: calendarGroups.today },
                { label: 'Diese Woche', items: calendarGroups.thisWeek },
                { label: 'Später', items: calendarGroups.later },
                { label: 'Ohne Datum', items: calendarGroups.noDate },
              ].map((g) => (
                <div key={g.label}>
                  <div className="mb-3 text-sm font-medium text-anthracite/70">{g.label}</div>
                  {g.items.length === 0 ? (
                    <div className="text-sm text-anthracite/50">—</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {g.items.map((p) => (
                        <div key={p.id} className="rounded-lg border border-anthracite/10 bg-white p-4 text-sm">
                          <div className="flex justify-between">
                            <div className="font-medium text-anthracite">{p.title}</div>
                            <div className="text-xs text-anthracite/50">{PLATFORM_OPTIONS.find((x) => x.value === p.platform)?.label}</div>
                          </div>
                          <div className="mt-1 text-anthracite/70 line-clamp-2">{p.post_text}</div>
                          <div className="mt-3 flex gap-2 text-xs">
                            <button onClick={() => copyPostText(p)} className="border border-anthracite/15 rounded px-2 py-0.5 hover:border-ruby/40">Kopieren</button>
                            <button onClick={() => openEditPost(p)} className="border border-anthracite/15 rounded px-2 py-0.5 hover:border-ruby/40">Bearbeiten</button>
                            <button onClick={() => handleToggleDone(p)} className="border border-anthracite/15 rounded px-2 py-0.5 hover:border-ruby/40">{p.is_done ? 'Rückgängig' : 'Erledigt'}</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* POST MODAL */}
      {postModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-anthracite/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-anthracite/10 bg-white p-6 shadow-xl">
            <h3 className="font-display text-xl font-semibold mb-4">
              {editingPost ? 'Beitrag bearbeiten' : 'Neuer Beitrag'}
            </h3>

            {error && <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

            <form onSubmit={handleSavePost} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-anthracite/70 text-xs mb-1">Titel *</label>
                  <input
                    required
                    value={postForm.title || ''}
                    onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                    className="w-full rounded-md border border-anthracite/15 bg-white px-3 py-2 outline-none focus:border-ruby/40"
                  />
                </div>
                <div>
                  <label className="block text-anthracite/70 text-xs mb-1">Plattform *</label>
                  <select
                    value={postForm.platform || 'instagram'}
                    onChange={(e) => setPostForm({ ...postForm, platform: e.target.value })}
                    className="w-full rounded-md border border-anthracite/15 bg-white px-3 py-2 outline-none focus:border-ruby/40"
                  >
                    {PLATFORM_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-anthracite/70 text-xs mb-1">Kategorie</label>
                <input
                  value={postForm.category || ''}
                  onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
                  placeholder="z. B. Produktvorstellung"
                  className="w-full rounded-md border border-anthracite/15 bg-white px-3 py-2 outline-none focus:border-ruby/40"
                />
              </div>

              <div>
                <label className="block text-anthracite/70 text-xs mb-1">Post-Text *</label>
                <textarea
                  required
                  rows={5}
                  value={postForm.post_text || ''}
                  onChange={(e) => setPostForm({ ...postForm, post_text: e.target.value })}
                  className="w-full rounded-md border border-anthracite/15 bg-white px-3 py-2 outline-none focus:border-ruby/40 font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-anthracite/70 text-xs mb-1">Hashtags</label>
                  <input
                    value={postForm.hashtags || ''}
                    onChange={(e) => setPostForm({ ...postForm, hashtags: e.target.value })}
                    placeholder="#design #logo"
                    className="w-full rounded-md border border-anthracite/15 bg-white px-3 py-2 outline-none focus:border-ruby/40"
                  />
                </div>
                <div>
                  <label className="block text-anthracite/70 text-xs mb-1">CTA</label>
                  <input
                    value={postForm.cta || ''}
                    onChange={(e) => setPostForm({ ...postForm, cta: e.target.value })}
                    placeholder="Jetzt kontaktieren"
                    className="w-full rounded-md border border-anthracite/15 bg-white px-3 py-2 outline-none focus:border-ruby/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-anthracite/70 text-xs mb-1">Link</label>
                <input
                  type="url"
                  value={postForm.target_url || ''}
                  onChange={(e) => setPostForm({ ...postForm, target_url: e.target.value })}
                  className="w-full rounded-md border border-anthracite/15 bg-white px-3 py-2 outline-none focus:border-ruby/40"
                />
              </div>

              <div>
                <label className="block text-anthracite/70 text-xs mb-1">Geplantes Datum / Uhrzeit</label>
                <input
                  type="datetime-local"
                  value={postForm.planned_for || ''}
                  onChange={(e) => setPostForm({ ...postForm, planned_for: e.target.value })}
                  className="w-full rounded-md border border-anthracite/15 bg-white px-3 py-2 outline-none focus:border-ruby/40"
                />
              </div>

              <div>
                <label className="block text-anthracite/70 text-xs mb-1">Medien (Bild oder Video)</label>
                <input type="file" accept="image/*,video/*" onChange={handleFileSelect} className="text-sm" />
                {(pendingFile || (editingPost?.media_path && !removeMedia)) && (
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    {previewUrl ? (
                      <img src={previewUrl} alt="preview" className="h-12 w-12 rounded object-cover border" />
                    ) : editingPost?.media_path ? (
                      <span className="text-anthracite/70">{editingPost.media_path.split('/').pop()}</span>
                    ) : (
                      <span className="text-anthracite/70">{pendingFile?.name}</span>
                    )}
                    <button type="button" onClick={clearPendingMedia} className="text-red-600 underline">entfernen</button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-anthracite/70 text-xs mb-1">Notizen</label>
                <textarea
                  rows={2}
                  value={postForm.notes || ''}
                  onChange={(e) => setPostForm({ ...postForm, notes: e.target.value })}
                  className="w-full rounded-md border border-anthracite/15 bg-white px-3 py-2 outline-none focus:border-ruby/40"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closePostModal} className="flex-1 rounded-md border border-anthracite/20 py-2 text-sm hover:bg-anthracite/5">
                  Abbrechen
                </button>
                <button type="submit" className="flex-1 rounded-md bg-ruby py-2 text-sm font-semibold text-offwhite hover:bg-ruby/90">
                  {editingPost ? 'Aktualisieren' : 'Speichern'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEMPLATE MODAL */}
      {templateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-anthracite/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-anthracite/10 bg-white p-6 shadow-xl">
            <h3 className="font-display text-xl font-semibold mb-4">
              {editingTemplate ? 'Vorlage bearbeiten' : 'Neue Vorlage'}
            </h3>

            {error && <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

            <form onSubmit={handleSaveTemplate} className="space-y-4 text-sm">
              <div>
                <label className="block text-anthracite/70 text-xs mb-1">Titel *</label>
                <input
                  required
                  value={templateForm.title || ''}
                  onChange={(e) => setTemplateForm({ ...templateForm, title: e.target.value })}
                  className="w-full rounded-md border border-anthracite/15 bg-white px-3 py-2 outline-none focus:border-ruby/40"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-anthracite/70 text-xs mb-1">Kategorie</label>
                  <input
                    value={templateForm.category || ''}
                    onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })}
                    className="w-full rounded-md border border-anthracite/15 bg-white px-3 py-2 outline-none focus:border-ruby/40"
                  />
                </div>
                <div>
                  <label className="block text-anthracite/70 text-xs mb-1">Plattform</label>
                  <select
                    value={templateForm.platform || ''}
                    onChange={(e) => setTemplateForm({ ...templateForm, platform: e.target.value })}
                    className="w-full rounded-md border border-anthracite/15 bg-white px-3 py-2 outline-none focus:border-ruby/40"
                  >
                    <option value="">—</option>
                    {PLATFORM_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-anthracite/70 text-xs mb-1">Themenhinweis</label>
                <input
                  value={templateForm.subject_hint || ''}
                  onChange={(e) => setTemplateForm({ ...templateForm, subject_hint: e.target.value })}
                  className="w-full rounded-md border border-anthracite/15 bg-white px-3 py-2 outline-none focus:border-ruby/40"
                />
              </div>

              <div>
                <label className="block text-anthracite/70 text-xs mb-1">Vorlagentext *</label>
                <textarea
                  required
                  rows={5}
                  value={templateForm.template_text || ''}
                  onChange={(e) => setTemplateForm({ ...templateForm, template_text: e.target.value })}
                  className="w-full rounded-md border border-anthracite/15 bg-white px-3 py-2 outline-none focus:border-ruby/40 font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-anthracite/70 text-xs mb-1">Hashtags</label>
                  <input
                    value={templateForm.hashtags || ''}
                    onChange={(e) => setTemplateForm({ ...templateForm, hashtags: e.target.value })}
                    className="w-full rounded-md border border-anthracite/15 bg-white px-3 py-2 outline-none focus:border-ruby/40"
                  />
                </div>
                <div>
                  <label className="block text-anthracite/70 text-xs mb-1">CTA</label>
                  <input
                    value={templateForm.cta || ''}
                    onChange={(e) => setTemplateForm({ ...templateForm, cta: e.target.value })}
                    className="w-full rounded-md border border-anthracite/15 bg-white px-3 py-2 outline-none focus:border-ruby/40"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={!!templateForm.is_active}
                  onChange={(e) => setTemplateForm({ ...templateForm, is_active: e.target.checked })}
                />
                <label htmlFor="active" className="text-sm">Aktiv</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeTemplateModal} className="flex-1 rounded-md border border-anthracite/20 py-2 text-sm hover:bg-anthracite/5">
                  Abbrechen
                </button>
                <button type="submit" className="flex-1 rounded-md bg-ruby py-2 text-sm font-semibold text-offwhite hover:bg-ruby/90">
                  {editingTemplate ? 'Aktualisieren' : 'Speichern'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
