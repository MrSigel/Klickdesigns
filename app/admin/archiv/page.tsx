'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { deleteLog } from './actions'

type ActivityLog = {
  id: string
  area: string
  entity_type: string | null
  entity_id: string | null
  action: string
  message: string | null
  metadata: any | null
  created_at: string
}

const AREAS = [
  'dashboard', 'anfragen', 'kunden', 'angebot', 'rechnung',
  'akquise', 'suchen', 'social_media', 'referenzen', 'einstellungen', 'system'
] as const

const ACTIONS = [
  'created', 'updated', 'deleted', 'archived', 'email_sent',
  'pdf_created', 'status_changed', 'uploaded', 'converted', 'other'
] as const

const areaLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  anfragen: 'Anfragen',
  kunden: 'Kunden',
  angebot: 'Angebot',
  rechnung: 'Rechnung',
  akquise: 'Akquise',
  suchen: 'Suchen',
  social_media: 'Social Media',
  referenzen: 'Referenzen',
  einstellungen: 'Einstellungen',
  system: 'System',
}

const actionLabels: Record<string, string> = {
  created: 'Erstellt',
  updated: 'Aktualisiert',
  deleted: 'Gelöscht',
  archived: 'Archiviert',
  email_sent: 'E-Mail gesendet',
  pdf_created: 'PDF erstellt',
  status_changed: 'Status geändert',
  uploaded: 'Hochgeladen',
  converted: 'Umgewandelt',
  other: 'Sonstiges',
}

export default function AdminArchiv() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [areaFilter, setAreaFilter] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClient()

  const loadLogs = async () => {
    setLoading(true)
    setError('')

    let query = supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(300)

    if (areaFilter) {
      query = query.eq('area', areaFilter)
    }
    if (actionFilter) {
      query = query.eq('action', actionFilter)
    }
    if (dateFrom) {
      query = query.gte('created_at', new Date(dateFrom).toISOString())
    }
    if (dateTo) {
      // include end of day
      const end = new Date(dateTo)
      end.setHours(23, 59, 59, 999)
      query = query.lte('created_at', end.toISOString())
    }

    const { data, error: fetchErr } = await query

    if (fetchErr) {
      setError('Fehler beim Laden der Logs.')
      setLogs([])
    } else {
      let filtered = (data || []) as ActivityLog[]

      if (search.trim()) {
        const s = search.toLowerCase().trim()
        filtered = filtered.filter((l) =>
          (l.message && l.message.toLowerCase().includes(s)) ||
          (l.entity_type && l.entity_type.toLowerCase().includes(s)) ||
          (l.area && l.area.toLowerCase().includes(s))
        )
      }

      setLogs(filtered)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadLogs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaFilter, actionFilter, search, dateFrom, dateTo])

  const clearFilters = () => {
    setAreaFilter('')
    setActionFilter('')
    setSearch('')
    setDateFrom('')
    setDateTo('')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Diesen Log-Eintrag endgültig löschen? Es gibt keine Wiederherstellung.')) {
      return
    }
    setError('')
    setSuccess('')
    const result = await deleteLog(id)
    if (result?.error) {
      setError('Löschen fehlgeschlagen: ' + result.error)
    } else {
      setSuccess('Eintrag gelöscht.')
      setTimeout(() => setSuccess(''), 2000)
      await loadLogs()
    }
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('de-DE', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })

  const getEntityLabel = (log: ActivityLog) => {
    if (!log.entity_type) return '—'
    const shortId = log.entity_id ? log.entity_id.slice(0, 8) : ''
    return shortId ? `${log.entity_type} · ${shortId}` : log.entity_type
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-[28px] font-bold tracking-[-0.035em] text-anthracite">
          Archiv
        </h1>
        <p className="mt-1 text-[15px] text-anthracite/70">
          Wichtige Änderungen und Aktivitäten nachvollziehen.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl border border-anthracite/10 bg-white p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs text-anthracite/70 mb-1">Bereich</label>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="rounded-md border border-anthracite/15 bg-white px-3 py-2 text-sm outline-none focus:border-ruby/40"
            >
              <option value="">Alle</option>
              {AREAS.map((a) => (
                <option key={a} value={a}>{areaLabels[a] || a}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-anthracite/70 mb-1">Aktion</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="rounded-md border border-anthracite/15 bg-white px-3 py-2 text-sm outline-none focus:border-ruby/40"
            >
              <option value="">Alle</option>
              {ACTIONS.map((a) => (
                <option key={a} value={a}>{actionLabels[a] || a}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-anthracite/70 mb-1">Von</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="rounded-md border border-anthracite/15 bg-white px-3 py-2 text-sm outline-none focus:border-ruby/40"
            />
          </div>

          <div>
            <label className="block text-xs text-anthracite/70 mb-1">Bis</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="rounded-md border border-anthracite/15 bg-white px-3 py-2 text-sm outline-none focus:border-ruby/40"
            />
          </div>

          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs text-anthracite/70 mb-1">Suche (Nachricht / Entity / Bereich)</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Suchbegriff..."
              className="w-full rounded-md border border-anthracite/15 bg-white px-3 py-2 text-sm outline-none focus:border-ruby/40"
            />
          </div>

          <button
            onClick={clearFilters}
            className="mt-6 rounded-md border border-anthracite/15 px-3 py-2 text-sm hover:bg-anthracite/5"
          >
            Filter zurücksetzen
          </button>
        </div>
      </div>

      {error && <div className="mb-4 rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
      {success && <div className="mb-4 rounded bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">{success}</div>}

      {loading ? (
        <div className="py-10 text-center text-anthracite/50 text-sm">Lade...</div>
      ) : logs.length === 0 ? (
        <div className="rounded-xl border border-anthracite/10 bg-white p-8 text-center">
          <p className="text-anthracite/70">Noch keine Änderungen protokolliert.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-anthracite/10 bg-white">
          <table className="min-w-full divide-y divide-anthracite/10 text-sm">
            <thead>
              <tr className="text-left text-anthracite/60">
                <th className="px-4 py-3 font-medium">Bereich</th>
                <th className="px-4 py-3 font-medium">Aktion</th>
                <th className="px-4 py-3 font-medium">Nachricht</th>
                <th className="px-4 py-3 font-medium">Bezug</th>
                <th className="px-4 py-3 font-medium">Zeit</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-anthracite/10">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-anthracite/5 align-top">
                  <td className="px-4 py-3">
                    <span className="inline-block rounded bg-anthracite/5 px-2 py-0.5 text-xs text-anthracite/80">
                      {areaLabels[log.area] || log.area}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded border border-anthracite/15 px-2 py-0.5 text-xs text-anthracite/80">
                      {actionLabels[log.action] || log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-anthracite/80 max-w-[420px]">
                    {log.message || '—'}
                  </td>
                  <td className="px-4 py-3 text-anthracite/60 text-xs font-mono">
                    {getEntityLabel(log)}
                  </td>
                  <td className="px-4 py-3 text-anthracite/60 whitespace-nowrap text-xs">
                    {formatDate(log.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(log.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Löschen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-xs text-anthracite/50">
        Neueste zuerst. Daten werden direkt aus Supabase geladen. Keine automatische Löschung aktiv.
      </div>
    </div>
  )
}
