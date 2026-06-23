'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { checkWebsite, saveAsLead, deleteSearchResult } from './actions'

type SearchResult = {
  id: string
  website_url: string
  company_name: string | null
  found_email: string | null
  found_phone: string | null
  found_social_url: string | null
  contact_page_url: string | null
  impressum_url: string | null
  privacy_url: string | null
  detected_logo_url: string | null
  detected_problem: string | null
  design_score: number | null
  recommended_service: string | null
  scan_status: string
  saved_as_lead: boolean
  acquisition_lead_id: string | null
  error_message: string | null
  created_at: string
}

export default function AdminSuchen() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentResult, setCurrentResult] = useState<any>(null)
  const [history, setHistory] = useState<SearchResult[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [savedFilter, setSavedFilter] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClient()

  const loadHistory = async () => {
    let query = supabase
      .from('search_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (search) {
      const s = `%${search}%`
      query = query.or(`website_url.ilike.${s},company_name.ilike.${s},found_email.ilike.${s}`)
    }
    if (statusFilter) query = query.eq('scan_status', statusFilter)
    if (savedFilter === 'true') query = query.eq('saved_as_lead', true)
    if (savedFilter === 'false') query = query.eq('saved_as_lead', false)

    const { data } = await query
    setHistory((data || []) as SearchResult[])
  }

  useEffect(() => {
    loadHistory()
  }, [search, statusFilter, savedFilter])

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return
    setLoading(true)
    setError('')
    setSuccess('')
    setCurrentResult(null)

    const res = await checkWebsite(url)
    if (res?.error) {
      setError(res.error)
    } else if (res?.result) {
      setCurrentResult(res.result)
      setSuccess('Website geprüft.')
    }
    setLoading(false)
    await loadHistory()
  }

  const handleSaveLead = async (resultId?: string) => {
    const id = resultId || currentResult?.searchId
    if (!id) return
    setError('')
    setSuccess('')

    const res = await saveAsLead(id)
    if (res?.error) {
      setError(res.error)
    } else {
      setSuccess(res.message || 'Als Akquise-Lead gespeichert.')
      setCurrentResult(null)
      await loadHistory()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Eintrag löschen?')) return
    await deleteSearchResult(id)
    await loadHistory()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-[28px] font-bold tracking-[-0.035em] text-anthracite">
          Suchen
        </h1>
        <p className="mt-1 text-[15px] text-anthracite/70">
          Websites prüfen, Kontaktinformationen finden und passende Leads erkennen.
        </p>
      </div>

      {/* Check form */}
      <div className="mb-8 rounded-xl border border-anthracite/10 bg-white p-6">
        <form onSubmit={handleCheck} className="flex gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://beispiel.de"
            required
            className="flex-1 rounded-md border border-anthracite/15 px-4 py-2.5 text-sm focus:border-ruby/50"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-ruby px-6 py-2.5 text-sm font-semibold text-offwhite hover:bg-ruby/90 disabled:opacity-60"
          >
            {loading ? 'Prüfe...' : 'Website prüfen'}
          </button>
        </form>

        {error && <div className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
        {success && <div className="mt-3 text-sm text-green-600 bg-green-50 p-2 rounded">{success}</div>}

        {currentResult && (
          <div className="mt-6 border-t border-anthracite/10 pt-4">
            <h3 className="font-semibold mb-2">Ergebnis</h3>
            <div className="text-sm space-y-1 text-anthracite/80">
              <div><strong>Website:</strong> {currentResult.website_url}</div>
              {currentResult.company_name && <div><strong>Firma:</strong> {currentResult.company_name}</div>}
              {currentResult.found_email && <div><strong>E-Mail:</strong> {currentResult.found_email}</div>}
              {currentResult.found_phone && <div><strong>Telefon:</strong> {currentResult.found_phone}</div>}
              {currentResult.found_social_url && <div><strong>Social:</strong> {currentResult.found_social_url}</div>}
              {currentResult.contact_page_url && <div><strong>Kontaktseite:</strong> {currentResult.contact_page_url}</div>}
              {currentResult.impressum_url && <div><strong>Impressum:</strong> {currentResult.impressum_url}</div>}
              {currentResult.privacy_url && <div><strong>Datenschutz:</strong> {currentResult.privacy_url}</div>}
              {currentResult.detected_logo_url && <div><strong>Logo:</strong> {currentResult.detected_logo_url}</div>}
              {currentResult.detected_problem && (
                <div className="text-amber-600"><strong>Mögliches Problem:</strong> {currentResult.detected_problem} (Score: {currentResult.design_score})</div>
              )}
              {currentResult.recommended_service && <div><strong>Empfohlene Leistung:</strong> {currentResult.recommended_service}</div>}
            </div>

            <button
              onClick={() => handleSaveLead()}
              className="mt-4 rounded-md border border-ruby px-4 py-2 text-sm text-ruby hover:bg-ruby/5"
            >
              Als Akquise-Lead speichern
            </button>
          </div>
        )}
      </div>

      {/* History */}
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Suche Website/E-Mail..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border border-anthracite/15 px-3 py-2 text-sm flex-1 min-w-[200px]"
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-md border border-anthracite/15 px-3 py-2 text-sm">
          <option value="">Alle Status</option>
          <option value="pending">pending</option>
          <option value="completed">completed</option>
          <option value="failed">failed</option>
        </select>
        <select value={savedFilter} onChange={e => setSavedFilter(e.target.value)} className="rounded-md border border-anthracite/15 px-3 py-2 text-sm">
          <option value="">Alle gespeichert</option>
          <option value="true">gespeichert</option>
          <option value="false">nicht gespeichert</option>
        </select>
      </div>

      {history.length === 0 ? (
        <div className="rounded-xl border border-anthracite/10 bg-white p-8 text-center">
          <p className="text-anthracite/70">Noch keine Suchergebnisse vorhanden.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-anthracite/10 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-offwhite/50">
              <tr className="text-left text-anthracite/70">
                <th className="px-4 py-3">Website</th>
                <th className="px-4 py-3">E-Mail / Kontakt</th>
                <th className="px-4 py-3">Problem / Empfohlen</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Als Lead</th>
                <th className="px-4 py-3">Erstellt</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-anthracite/10">
              {history.map((r) => (
                <tr key={r.id} className="hover:bg-anthracite/5">
                  <td className="px-4 py-3 font-medium text-anthracite">{r.website_url}</td>
                  <td className="px-4 py-3 text-anthracite/80 text-xs">
                    {r.found_email}<br />{r.contact_page_url || r.impressum_url}
                  </td>
                  <td className="px-4 py-3 text-anthracite/80 text-xs">
                    {r.detected_problem || '—'}<br />
                    {r.recommended_service || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded ${r.scan_status === 'completed' ? 'bg-green-100 text-green-700' : r.scan_status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {r.scan_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {r.saved_as_lead ? '✓' : '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-anthracite/60">{new Date(r.created_at).toLocaleDateString('de-DE')}</td>
                  <td className="px-4 py-3 text-right text-xs space-x-2">
                    {!r.saved_as_lead && (
                      <button onClick={() => handleSaveLead(r.id)} className="text-ruby hover:underline">Als Lead</button>
                    )}
                    <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:underline">Löschen</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
