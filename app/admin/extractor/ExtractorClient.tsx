'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type ExtractedContact = {
  id: string
  website: string | null
  email: string | null
  created_at: string
  updated_at: string
}

type DraftContact = {
  website: string | null
  email: string | null
}

type SaveResult = {
  saved: number
  duplicates: number
  ignored: number
}

const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
const URL_REGEX = /\b(?:https?:\/\/|www\.)[^\s<>"']+/gi
const DOMAIN_REGEX = /(?:^|[\s(])((?:[a-z0-9-]+\.)+[a-z]{2,})(?=$|[\s),.;:!?])/gi
const TRAILING_CHARS = /[),.;:!?]+$/g

function cleanToken(value: string) {
  return value.trim().replace(/^mailto:/i, '').replace(TRAILING_CHARS, '')
}

function normalizeEmail(value: string) {
  const email = cleanToken(value).toLowerCase()
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email) ? email : null
}

function normalizeWebsite(value: string) {
  let raw = cleanToken(value).toLowerCase()
  if (!raw || raw.includes('@')) return null
  raw = raw.replace(/^https?:\/\//, '').replace(/^www\./, '')
  raw = raw.split('/')[0].split('?')[0].split('#')[0]

  if (!/^(?:[a-z0-9-]+\.)+[a-z]{2,}$/.test(raw)) return null
  if (raw.length > 253 || raw.split('.').some((part) => part.length === 0 || part.length > 63)) return null

  return raw
}

function uniqueValues(values: Array<string | null>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))))
}

function contactKey(contact: DraftContact) {
  return `${contact.website || ''}|${contact.email || ''}`
}

function extractFromText(text: string) {
  const contacts: DraftContact[] = []
  let ignored = 0
  const seen = new Set<string>()
  const blocks = text.split(/\n\s*\n/g)

  const addContact = (contact: DraftContact) => {
    if (!contact.website && !contact.email) {
      ignored += 1
      return
    }
    const key = contactKey(contact)
    if (seen.has(key)) return
    seen.add(key)
    contacts.push(contact)
  }

  for (const block of blocks) {
    const blockEmails = new Set<string>()
    const blockWebsites = new Set<string>()
    const pairedEmails = new Set<string>()
    const pairedWebsites = new Set<string>()

    for (const line of block.split(/\r?\n/g)) {
      const emails = uniqueValues(Array.from(line.matchAll(EMAIL_REGEX), (match) => normalizeEmail(match[0])))
      const lineWithoutEmails = line.replace(EMAIL_REGEX, ' ')
      const urlWebsites = uniqueValues(Array.from(lineWithoutEmails.matchAll(URL_REGEX), (match) => normalizeWebsite(match[0])))
      const domainWebsites = uniqueValues(Array.from(lineWithoutEmails.matchAll(DOMAIN_REGEX), (match) => normalizeWebsite(match[1])))
      const websites = uniqueValues([...urlWebsites, ...domainWebsites])

      emails.forEach((email) => blockEmails.add(email))
      websites.forEach((website) => blockWebsites.add(website))

      if (emails.length > 0 && websites.length > 0) {
        for (const email of emails) {
          for (const website of websites) {
            addContact({ website, email })
            pairedEmails.add(email)
            pairedWebsites.add(website)
          }
        }
      }
    }

    const remainingEmails = Array.from(blockEmails).filter((email) => !pairedEmails.has(email))
    const remainingWebsites = Array.from(blockWebsites).filter((website) => !pairedWebsites.has(website))

    if (remainingEmails.length > 0 && remainingWebsites.length === 1) {
      remainingEmails.forEach((email) => addContact({ website: remainingWebsites[0], email }))
    } else if (remainingWebsites.length > 0 && remainingEmails.length === 1) {
      remainingWebsites.forEach((website) => addContact({ website, email: remainingEmails[0] }))
    } else {
      remainingEmails.forEach((email) => addContact({ website: null, email }))
      remainingWebsites.forEach((website) => addContact({ website, email: null }))
    }
  }

  return { contacts, ignored }
}

function toCsvValue(value: string | null) {
  return `"${(value || '').replace(/"/g, '""')}"`
}

function downloadCsv(rows: ExtractedContact[]) {
  const csv = [
    'website;email',
    ...rows.map((row) => `${toCsvValue(row.website)};${toCsvValue(row.email)}`),
  ].join('\r\n')
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'klick-extractor-kontakte.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function ExtractorClient() {
  const supabase = createClient()
  const [input, setInput] = useState('')
  const [contacts, setContacts] = useState<ExtractedContact[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ website: '', email: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadContacts = async () => {
    setLoading(true)
    const { data, error: loadError } = await supabase
      .from('extracted_contacts')
      .select('id, website, email, created_at, updated_at')
      .order('created_at', { ascending: false })
      .range(0, 9999)

    if (loadError) {
      console.error('Load extracted contacts error:', loadError)
      setError('Einträge konnten nicht geladen werden.')
    } else {
      setContacts((data || []) as ExtractedContact[])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadContacts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const visibleContacts = useMemo(() => {
    const term = search.trim().toLowerCase()
    return contacts.filter((contact) => {
      if (filter === 'email' && !contact.email) return false
      if (filter === 'website' && !contact.website) return false
      if (filter === 'complete' && (!contact.email || !contact.website)) return false
      if (!term) return true
      return [contact.website, contact.email].some((value) => value?.toLowerCase().includes(term))
    })
  }, [contacts, search, filter])

  const handleExtract = async () => {
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const extracted = extractFromText(input)
      if (extracted.contacts.length === 0) {
        setMessage(`0 neue Einträge gespeichert · 0 Duplikate übersprungen · ${extracted.ignored} ungültige Treffer ignoriert`)
        setSaving(false)
        return
      }

      const existingKeys = new Set(contacts.map(contactKey))
      const existingEmails = new Set(contacts.map((contact) => contact.email).filter(Boolean))
      let duplicates = 0

      const candidates = extracted.contacts.filter((contact) => {
        const key = contactKey(contact)
        const duplicate = existingKeys.has(key) || (!!contact.email && existingEmails.has(contact.email))
        if (duplicate) {
          duplicates += 1
          return false
        }
        existingKeys.add(key)
        if (contact.email) existingEmails.add(contact.email)
        return true
      })

      let saved = 0
      for (const contact of candidates) {
        const { error: insertError } = await supabase.from('extracted_contacts').insert({
            website: contact.website,
            email: contact.email,
            source: 'admin_extractor',
          })

        if (insertError) {
          if (insertError.code === '23505') {
            duplicates += 1
            continue
          }
          console.error('Save extracted contacts error:', insertError)
          setError('Einträge konnten nicht gespeichert werden.')
          setSaving(false)
          return
        }

        saved += 1
      }

      const result: SaveResult = {
        saved,
        duplicates,
        ignored: extracted.ignored,
      }
      setMessage(`${result.saved} neue Einträge gespeichert · ${result.duplicates} Duplikate übersprungen · ${result.ignored} ungültige Treffer ignoriert`)
      await loadContacts()
    } catch (submitError) {
      console.error('Extractor submit error:', submitError)
      setError('Die Eingabe konnte nicht verarbeitet werden.')
    }

    setSaving(false)
  }

  const startEdit = (contact: ExtractedContact) => {
    setEditingId(contact.id)
    setEditForm({ website: contact.website || '', email: contact.email || '' })
    setError('')
    setMessage('')
  }

  const saveEdit = async (id: string) => {
    const website = normalizeWebsite(editForm.website) || null
    const email = normalizeEmail(editForm.email) || null

    if (!website && !email) {
      setError('Bitte Website oder E-Mail angeben.')
      return
    }

    const duplicate = contacts.some((contact) => {
      if (contact.id === id) return false
      return contactKey(contact) === contactKey({ website, email }) || (!!email && contact.email === email)
    })

    if (duplicate) {
      setError('Dieser Eintrag ist bereits vorhanden.')
      return
    }

    const { error: updateError } = await supabase
      .from('extracted_contacts')
      .update({ website, email })
      .eq('id', id)

    if (updateError) {
      console.error('Update extracted contact error:', updateError)
      setError('Eintrag konnte nicht gespeichert werden.')
      return
    }

    setEditingId(null)
    setMessage('Eintrag gespeichert.')
    await loadContacts()
  }

  const deleteContact = async (id: string) => {
    if (!window.confirm('Eintrag wirklich löschen?')) return

    const { error: deleteError } = await supabase.from('extracted_contacts').delete().eq('id', id)
    if (deleteError) {
      console.error('Delete extracted contact error:', deleteError)
      setError('Eintrag konnte nicht gelöscht werden.')
      return
    }

    setMessage('Eintrag gelöscht.')
    await loadContacts()
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-anthracite/10 bg-white p-6">
        <label className="block text-sm font-medium text-anthracite" htmlFor="extractor-input">
          Eingabe
        </label>
        <textarea
          id="extractor-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Text hier einfügen..."
          rows={10}
          className="mt-3 w-full rounded-md border border-anthracite/15 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-ruby/40"
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExtract}
            disabled={saving || !input.trim()}
            className="rounded-md bg-ruby px-5 py-2.5 text-sm font-semibold text-offwhite hover:bg-ruby/90 disabled:opacity-50"
          >
            {saving ? 'Speichert...' : 'Daten extrahieren & speichern'}
          </button>
          <button
            type="button"
            onClick={() => setInput('')}
            className="rounded-md border border-anthracite/20 px-5 py-2.5 text-sm font-semibold hover:bg-anthracite/5"
          >
            Eingabe leeren
          </button>
        </div>

        <p className="mt-4 rounded-md border border-sand/60 bg-sand/20 px-3 py-2 text-sm text-anthracite/75">
          Es werden nur Website und E-Mail gespeichert. Bitte nutze die Funktion nur für Daten, für die eine rechtmäßige Verarbeitung vorliegt.
        </p>

        {message && <div className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{message}</div>}
        {error && <div className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
      </div>

      <div>
        <div className="mb-4 flex flex-wrap gap-3">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Suche Website oder E-Mail..."
            className="min-w-[220px] flex-1 rounded-md border border-anthracite/15 bg-white px-3 py-2 text-sm"
          />
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-md border border-anthracite/15 bg-white px-3 py-2 text-sm"
          >
            <option value="all">Alle</option>
            <option value="email">Nur mit E-Mail</option>
            <option value="website">Nur mit Website</option>
            <option value="complete">Vollständig</option>
          </select>
          <button
            type="button"
            onClick={loadContacts}
            className="rounded-md border border-anthracite/20 px-4 py-2 text-sm font-semibold hover:bg-anthracite/5"
          >
            Neu laden
          </button>
          <button
            type="button"
            onClick={() => downloadCsv(visibleContacts)}
            disabled={visibleContacts.length === 0}
            className="rounded-md border border-ruby px-4 py-2 text-sm font-semibold text-ruby hover:bg-ruby/5 disabled:opacity-50"
          >
            Tabelle herunterladen
          </button>
        </div>

        {loading ? (
          <div className="rounded-xl border border-anthracite/10 bg-white p-8 text-center text-anthracite/60">
            Lade...
          </div>
        ) : visibleContacts.length === 0 ? (
          <div className="rounded-xl border border-anthracite/10 bg-white p-8 text-center">
            <p className="text-anthracite/70">Noch keine gespeicherten Einträge vorhanden.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-anthracite/10 bg-white">
            <table className="min-w-full divide-y divide-anthracite/10 text-sm">
              <thead className="bg-offwhite/60">
                <tr className="text-left text-anthracite/60">
                  <th className="px-4 py-3 font-medium">Website</th>
                  <th className="px-4 py-3 font-medium">E-Mail</th>
                  <th className="px-4 py-3 font-medium">Erstellt am</th>
                  <th className="px-4 py-3 font-medium text-right">Aktion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-anthracite/10">
                {visibleContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-anthracite/5">
                    <td className="px-4 py-3">
                      {editingId === contact.id ? (
                        <input
                          value={editForm.website}
                          onChange={(event) => setEditForm({ ...editForm, website: event.target.value })}
                          className="w-full min-w-[180px] rounded border border-anthracite/15 px-2 py-1"
                        />
                      ) : (
                        contact.website || '—'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === contact.id ? (
                        <input
                          value={editForm.email}
                          onChange={(event) => setEditForm({ ...editForm, email: event.target.value })}
                          className="w-full min-w-[220px] rounded border border-anthracite/15 px-2 py-1"
                        />
                      ) : (
                        contact.email || '—'
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-anthracite/60">
                      {new Date(contact.created_at).toLocaleDateString('de-DE')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        {editingId === contact.id ? (
                          <>
                            <button onClick={() => saveEdit(contact.id)} className="rounded border border-ruby px-2 py-1 text-xs text-ruby hover:bg-ruby/5">
                              Speichern
                            </button>
                            <button onClick={() => setEditingId(null)} className="rounded border border-anthracite/15 px-2 py-1 text-xs hover:bg-anthracite/5">
                              Abbrechen
                            </button>
                          </>
                        ) : (
                          <button onClick={() => startEdit(contact)} className="rounded border border-anthracite/15 px-2 py-1 text-xs hover:border-ruby/40">
                            Bearbeiten
                          </button>
                        )}
                        <button onClick={() => deleteContact(contact.id)} className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50">
                          Löschen
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
