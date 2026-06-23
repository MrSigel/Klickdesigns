'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { sendAkquiseEmail } from './actions'

type Lead = {
  id: string
  company_name: string
  website_url: string | null
  email: string | null
  phone: string | null
  social_url: string | null
  source: string | null
  detected_problem: string | null
  recommended_service: string | null
  status: string
  do_not_contact: boolean
  contacted_at: string | null
  last_email_sent_at: string | null
  converted_customer_id: string | null
  notes: string | null
  created_at: string
}

type Customer = {
  id: string
  name: string
  email: string
}

export default function AdminAkquise() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [recommendedFilter, setRecommendedFilter] = useState('')
  const [doNotContactFilter, setDoNotContactFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [formData, setFormData] = useState<any>({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClient()

  const loadLeads = async () => {
    setLoading(true)
    let query = supabase
      .from('acquisition_leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (search) {
      const s = `%${search}%`
      query = query.or(`company_name.ilike.${s},website_url.ilike.${s},email.ilike.${s},phone.ilike.${s},detected_problem.ilike.${s}`)
    }
    if (statusFilter) query = query.eq('status', statusFilter)
    if (sourceFilter) query = query.eq('source', sourceFilter)
    if (recommendedFilter) query = query.eq('recommended_service', recommendedFilter)
    if (doNotContactFilter === 'true') query = query.eq('do_not_contact', true)
    if (doNotContactFilter === 'false') query = query.eq('do_not_contact', false)

    const { data, error } = await query
    if (error) {
      console.error(error)
      setLeads([])
    } else {
      setLeads(data || [])
    }
    setLoading(false)
  }

  const loadCustomers = async () => {
    const { data } = await supabase.from('customers').select('id, name, email').order('name').limit(200)
    setCustomers(data || [])
  }

  useEffect(() => {
    loadLeads()
    loadCustomers()
  }, [search, statusFilter, sourceFilter, recommendedFilter, doNotContactFilter])

  const openModal = (lead?: Lead) => {
    setEditingLead(lead || null)
    setFormData(lead || {
      company_name: '',
      website_url: '',
      email: '',
      phone: '',
      social_url: '',
      source: '',
      detected_problem: '',
      recommended_service: '',
      status: 'open',
      do_not_contact: false,
      notes: ''
    })
    setModalOpen(true)
    setError('')
    setSuccess('')
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingLead(null)
    setError('')
    setSuccess('')
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      if (editingLead) {
        const { error } = await supabase
          .from('acquisition_leads')
          .update(formData)
          .eq('id', editingLead.id)
        if (error) throw error
        setSuccess('Lead aktualisiert.')
      } else {
        const { error } = await supabase.from('acquisition_leads').insert(formData)
        if (error) throw error
        setSuccess('Lead angelegt.')
      }
      await loadLeads()
      setTimeout(() => closeModal(), 1000)
    } catch (err: any) {
      setError(err.message || 'Fehler beim Speichern.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Lead wirklich löschen?')) return
    await supabase.from('acquisition_leads').delete().eq('id', id)
    await loadLeads()
  }

  const handleArchive = async (id: string) => {
    await supabase.from('acquisition_leads').update({ status: 'archived' }).eq('id', id)
    await loadLeads()
  }

  const handleConvertToCustomer = async (lead: Lead) => {
    if (!lead.email) {
      alert('E-Mail erforderlich für Kunde.')
      return
    }
    if (lead.converted_customer_id) {
      alert('Bereits zu Kunde umgewandelt.')
      return
    }

    // check existing customer by email
    const { data: existing } = await supabase
      .from('customers')
      .select('id')
      .eq('email', lead.email)
      .maybeSingle()

    let customerId = existing?.id

    if (!customerId) {
      const { data: newCust, error } = await supabase.from('customers').insert({
        name: lead.company_name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company_name,
        source: lead.source,
        status: 'interessent',
        notes: lead.notes || lead.detected_problem
      }).select('id').single()

      if (error || !newCust) {
        alert('Fehler beim Erstellen des Kunden: ' + (error?.message || ''))
        return
      }
      customerId = newCust.id
    }

    await supabase
      .from('acquisition_leads')
      .update({ converted_customer_id: customerId, status: 'done' })
      .eq('id', lead.id)

    await loadLeads()
    alert('Lead zu Kunde umgewandelt.')
  }

  const handleSendEmail = async (lead: Lead) => {
    if (lead.do_not_contact) {
      alert('Dieser Lead darf nicht kontaktiert werden.')
      return
    }
    if (!lead.email) {
      alert('Keine E-Mail vorhanden.')
      return
    }

    const result = await sendAkquiseEmail(lead.id, lead.email, lead.company_name)
    if (result?.error) {
      alert('Fehler: ' + result.error)
    } else {
      alert('E-Mail gesendet (falls SMTP konfiguriert).')
      await loadLeads()
    }
  }

  const handleDoNotContact = async (lead: Lead, value: boolean) => {
    await supabase.from('acquisition_leads').update({ do_not_contact: value }).eq('id', lead.id)
    await loadLeads()
  }

  const filteredLeads = leads.filter(l => {
    if (doNotContactFilter && l.do_not_contact !== (doNotContactFilter === 'true')) return false
    return true
  })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-[28px] font-bold tracking-[-0.035em] text-anthracite">
            Akquise
          </h1>
          <p className="mt-1 text-[15px] text-anthracite/70">
            Potenzielle Kunden sammeln, bewerten und kontaktieren.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center rounded-md bg-ruby px-4 py-2 text-sm font-semibold text-offwhite hover:bg-ruby/90"
        >
          + Neuer Lead
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
        <input
          type="text"
          placeholder="Suche Firma/Website/E-Mail..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border border-anthracite/15 bg-white px-3 py-2 text-sm"
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-md border border-anthracite/15 bg-white px-3 py-2 text-sm">
          <option value="">Alle Status</option>
          <option value="open">open</option>
          <option value="done">done</option>
          <option value="archived">archived</option>
        </select>
        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className="rounded-md border border-anthracite/15 bg-white px-3 py-2 text-sm">
          <option value="">Alle Quellen</option>
          {['website','facebook','instagram','social_media','lokal','empfehlung','google','verein','creator','shop','sonstiges'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={recommendedFilter} onChange={e => setRecommendedFilter(e.target.value)} className="rounded-md border border-anthracite/15 bg-white px-3 py-2 text-sm">
          <option value="">Alle empfohlenen Leistungen</option>
          {['logo_sprint','logo_vectorization','design_finalization','business_presence','sticker_design','social_media_design','flyer_design','other'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={doNotContactFilter} onChange={e => setDoNotContactFilter(e.target.value)} className="rounded-md border border-anthracite/15 bg-white px-3 py-2 text-sm">
          <option value="">Alle Kontakt-Status</option>
          <option value="false">Kontakt erlaubt</option>
          <option value="true">Nicht kontaktieren</option>
        </select>
      </div>

      {loading ? (
        <div className="p-8 text-center text-anthracite/60">Lade...</div>
      ) : filteredLeads.length === 0 ? (
        <div className="rounded-xl border border-anthracite/10 bg-white p-8 text-center">
          <p className="text-anthracite/70">Noch keine Akquise-Leads vorhanden.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-anthracite/10 bg-white">
          <table className="min-w-full text-sm divide-y divide-anthracite/10">
            <thead className="bg-offwhite/50">
              <tr className="text-left text-anthracite/70">
                <th className="px-4 py-3">Firma</th>
                <th className="px-4 py-3">Website / Social</th>
                <th className="px-4 py-3">Kontakt</th>
                <th className="px-4 py-3">Quelle / Empfohlen</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Nicht kontaktieren</th>
                <th className="px-4 py-3">Erstellt</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-anthracite/10">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-anthracite/5">
                  <td className="px-4 py-3 font-medium text-anthracite">{lead.company_name}</td>
                  <td className="px-4 py-3 text-anthracite/80 text-xs">
                    {lead.website_url && <a href={lead.website_url} target="_blank" className="text-ruby hover:underline block truncate max-w-[180px]">{lead.website_url}</a>}
                    {lead.social_url && <a href={lead.social_url} target="_blank" className="text-ruby hover:underline block truncate max-w-[180px]">{lead.social_url}</a>}
                  </td>
                  <td className="px-4 py-3 text-anthracite/80 text-xs">
                    {lead.email && <div>{lead.email}</div>}
                    {lead.phone && <div>{lead.phone}</div>}
                  </td>
                  <td className="px-4 py-3 text-anthracite/80 text-xs">
                    {lead.source || '—'}<br />
                    {lead.recommended_service || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-xs rounded ${lead.status === 'open' ? 'bg-blue-100 text-blue-700' : lead.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={lead.do_not_contact}
                      onChange={(e) => handleDoNotContact(lead, e.target.checked)}
                      className="accent-ruby"
                    />
                  </td>
                  <td className="px-4 py-3 text-xs text-anthracite/60">
                    {new Date(lead.created_at).toLocaleDateString('de-DE')}
                  </td>
                  <td className="px-4 py-3 text-right space-x-1 text-xs">
                    <button onClick={() => openModal(lead)} className="px-2 py-1 border border-anthracite/15 rounded hover:border-ruby/40">Bearbeiten</button>
                    <button onClick={() => handleSendEmail(lead)} disabled={lead.do_not_contact || !lead.email} className="px-2 py-1 border border-anthracite/15 rounded hover:border-ruby/40 disabled:opacity-50">E-Mail</button>
                    <button onClick={() => handleConvertToCustomer(lead)} disabled={!!lead.converted_customer_id || lead.do_not_contact} className="px-2 py-1 border border-anthracite/15 rounded hover:border-ruby/40 disabled:opacity-50">Zu Kunde</button>
                    <button onClick={() => handleArchive(lead.id)} className="px-2 py-1 border border-anthracite/15 rounded hover:border-ruby/40">Archiv</button>
                    <button onClick={() => handleDelete(lead.id)} className="px-2 py-1 border border-red-200 text-red-600 rounded hover:bg-red-50">Löschen</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for add/edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-anthracite/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-anthracite/10 bg-white p-6 shadow-xl">
            <h3 className="font-display text-xl font-semibold mb-4">{editingLead ? 'Lead bearbeiten' : 'Neuer Lead'}</h3>

            {error && <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
            {success && <div className="mb-3 text-sm text-green-600 bg-green-50 p-2 rounded">{success}</div>}

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-anthracite/70 text-xs mb-1">Firma *</label>
                <input required value={formData.company_name || ''} onChange={e => setFormData({...formData, company_name: e.target.value})} className="w-full rounded border border-anthracite/15 px-3 py-2" />
              </div>
              <div>
                <label className="block text-anthracite/70 text-xs mb-1">Website</label>
                <input value={formData.website_url || ''} onChange={e => setFormData({...formData, website_url: e.target.value})} className="w-full rounded border border-anthracite/15 px-3 py-2" />
              </div>
              <div>
                <label className="block text-anthracite/70 text-xs mb-1">E-Mail</label>
                <input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full rounded border border-anthracite/15 px-3 py-2" />
              </div>
              <div>
                <label className="block text-anthracite/70 text-xs mb-1">Telefon</label>
                <input value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full rounded border border-anthracite/15 px-3 py-2" />
              </div>
              <div>
                <label className="block text-anthracite/70 text-xs mb-1">Social URL</label>
                <input value={formData.social_url || ''} onChange={e => setFormData({...formData, social_url: e.target.value})} className="w-full rounded border border-anthracite/15 px-3 py-2" />
              </div>
              <div>
                <label className="block text-anthracite/70 text-xs mb-1">Quelle</label>
                <select value={formData.source || ''} onChange={e => setFormData({...formData, source: e.target.value})} className="w-full rounded border border-anthracite/15 px-3 py-2">
                  <option value="">—</option>
                  {['website','facebook','instagram','social_media','lokal','empfehlung','google','verein','creator','shop','sonstiges'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-anthracite/70 text-xs mb-1">Erkanntes Designproblem</label>
                <textarea value={formData.detected_problem || ''} onChange={e => setFormData({...formData, detected_problem: e.target.value})} className="w-full rounded border border-anthracite/15 px-3 py-2" rows={2} />
              </div>
              <div>
                <label className="block text-anthracite/70 text-xs mb-1">Empfohlene Leistung</label>
                <select value={formData.recommended_service || ''} onChange={e => setFormData({...formData, recommended_service: e.target.value})} className="w-full rounded border border-anthracite/15 px-3 py-2">
                  <option value="">—</option>
                  {['logo_sprint','logo_vectorization','design_finalization','business_presence','sticker_design','social_media_design','flyer_design','other'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-anthracite/70 text-xs mb-1">Status</label>
                <select value={formData.status || 'open'} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full rounded border border-anthracite/15 px-3 py-2">
                  <option value="open">open</option>
                  <option value="done">done</option>
                  <option value="archived">archived</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-anthracite/70 text-xs mb-1">Notizen</label>
                <textarea value={formData.notes || ''} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full rounded border border-anthracite/15 px-3 py-2" rows={3} />
              </div>
              <div className="md:col-span-2 flex items-center gap-2">
                <input type="checkbox" checked={formData.do_not_contact || false} onChange={e => setFormData({...formData, do_not_contact: e.target.checked})} id="dnc" />
                <label htmlFor="dnc" className="text-sm">Nicht mehr kontaktieren</label>
              </div>

              <div className="md:col-span-2 flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 rounded-md border border-anthracite/20 py-2 text-sm hover:bg-anthracite/5">Abbrechen</button>
                <button type="submit" className="flex-1 rounded-md bg-ruby py-2 text-sm font-semibold text-offwhite">Speichern</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
