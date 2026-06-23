'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminProfil() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('admin')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClient()
  const router = useRouter()

  const loadProfile = async () => {
    setLoading(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setEmail(user.email || '')

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', user.id)
        .single()

      if (profile) {
        setFullName(profile.full_name || '')
        setRole(profile.role || 'admin')
      }
    } catch (e: any) {
      setError('Fehler beim Laden des Profils.')
    }
    setLoading(false)
  }

  useEffect(() => {
    loadProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Nicht eingeloggt')

      const { error: updateErr } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim() || null })
        .eq('id', user.id)

      if (updateErr) throw updateErr

      // log
      try {
        await supabase.from('activity_logs').insert({
          area: 'einstellungen',
          action: 'updated',
          message: 'Profil aktualisiert',
        })
      } catch {}

      setSuccess('Profil gespeichert.')
      setTimeout(() => setSuccess(''), 2000)
    } catch (e: any) {
      setError(e.message || 'Fehler beim Speichern.')
    }
    setSaving(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-[28px] font-bold tracking-[-0.035em] text-anthracite">Profil</h1>
        <p className="mt-1 text-[15px] text-anthracite/70">Lade...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-[28px] font-bold tracking-[-0.035em] text-anthracite">
          Profil
        </h1>
        <p className="mt-1 text-[15px] text-anthracite/70">
          Ihre Admin-Daten verwalten.
        </p>
      </div>

      {error && <div className="mb-4 rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
      {success && <div className="mb-4 rounded bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">{success}</div>}

      <div className="max-w-xl space-y-6">
        <div className="rounded-xl border border-anthracite/10 bg-white p-6">
          <div className="mb-4">
            <label className="block text-xs uppercase tracking-[0.08em] text-anthracite/60 mb-1">E-Mail</label>
            <div className="text-anthracite font-medium">{email || '—'}</div>
          </div>

          <div className="mb-4">
            <label className="block text-xs uppercase tracking-[0.08em] text-anthracite/60 mb-1">Rolle</label>
            <div className="text-anthracite font-medium">{role}</div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.08em] text-anthracite/60 mb-1">Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Vollständiger Name"
              className="w-full rounded-md border border-anthracite/15 bg-white px-3 py-2 text-sm outline-none focus:border-ruby/40"
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-ruby px-4 py-2 text-sm font-semibold text-offwhite hover:bg-ruby/90 disabled:opacity-60"
            >
              {saving ? 'Speichern...' : 'Name speichern'}
            </button>
            <button
              onClick={handleLogout}
              className="rounded-md border border-anthracite/15 px-4 py-2 text-sm hover:bg-anthracite/5"
            >
              Abmelden
            </button>
          </div>
        </div>

        <p className="text-xs text-anthracite/50">
          Login und Rechte werden über Supabase Auth und <code>profiles.role = &apos;admin&apos;</code> gesteuert.
          Keine Passwort-Änderung hier – nutzen Sie ggf. die Supabase Auth-Funktionen.
        </p>
      </div>
    </div>
  )
}
