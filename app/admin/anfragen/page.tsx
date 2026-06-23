import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

type Inquiry = {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  project_name: string | null
  service_type: string | null
  existing_material: string | null
  message: string
  status: string
  priority: string
  source: string | null
  created_at: string
}

async function getInquiries(params: { search?: string; status?: string; service?: string; priority?: string }) {
  const supabase = await createClient()

  let query = supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (params.search) {
    const s = `%${params.search}%`
    query = query.or(`name.ilike.${s},email.ilike.${s},company.ilike.${s},project_name.ilike.${s},message.ilike.${s}`)
  }
  if (params.status) {
    query = query.eq('status', params.status)
  }
  if (params.service) {
    query = query.eq('service_type', params.service)
  }
  if (params.priority) {
    query = query.eq('priority', params.priority)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching inquiries:', error)
    return []
  }

  return (data || []) as Inquiry[]
}

export default async function AdminAnfragen({ searchParams }: { searchParams: Promise<{ search?: string; status?: string; service?: string; priority?: string }> }) {
  const params = await searchParams
  const inquiries = await getInquiries(params)

  const statusOptions = [
    {value: 'new', label: 'Neu'},
    {value: 'viewed', label: 'Gesehen'},
    {value: 'in_progress', label: 'In Bearbeitung'},
    {value: 'waiting_for_customer', label: 'Warte auf Kunden'},
    {value: 'offer_sent', label: 'Angebot gesendet'},
    {value: 'completed', label: 'Abgeschlossen'},
    {value: 'archived', label: 'Archiviert'},
  ]
  const serviceOptions = [
    {value: 'logo_sprint', label: 'Logo-Sprint'},
    {value: 'logo_vectorization', label: 'Logo-Vektorisierung'},
    {value: 'design_finalization', label: 'Design-Finalisierung'},
    {value: 'business_presence', label: 'Business-Auftritt'},
    {value: 'sticker_design', label: 'Sticker-Design'},
    {value: 'social_media_design', label: 'Social-Media-Design'},
    {value: 'flyer_design', label: 'Flyer-Design'},
    {value: 'other', label: 'Sonstiges'},
  ]
  const priorityOptions = [
    {value: 'low', label: 'Niedrig'},
    {value: 'normal', label: 'Normal'},
    {value: 'high', label: 'Hoch'},
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-[28px] font-bold tracking-[-0.035em] text-anthracite">
          Anfragen
        </h1>
        <p className="mt-1 text-[15px] text-anthracite/70">
          Neue Website-Anfragen prüfen, bearbeiten und weiterverarbeiten.
        </p>
      </div>

      {/* Filters */}
      <form method="get" className="mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          name="search"
          defaultValue={params.search}
          placeholder="Suche Name/E-Mail/Firma..."
          className="rounded-md border border-anthracite/15 bg-white px-3 py-2 text-sm w-64"
        />
        <select name="status" defaultValue={params.status} className="rounded-md border border-anthracite/15 bg-white px-3 py-2 text-sm">
          <option value="">Alle Status</option>
          {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select name="service" defaultValue={params.service} className="rounded-md border border-anthracite/15 bg-white px-3 py-2 text-sm">
          <option value="">Alle Leistungen</option>
          {serviceOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select name="priority" defaultValue={params.priority} className="rounded-md border border-anthracite/15 bg-white px-3 py-2 text-sm">
          <option value="">Alle Prioritäten</option>
          {priorityOptions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        <button type="submit" className="rounded-md border border-anthracite/20 px-4 py-2 text-sm hover:bg-anthracite/5">Filtern</button>
        <Link href="/admin/anfragen" className="rounded-md border border-anthracite/20 px-4 py-2 text-sm hover:bg-anthracite/5">Zurücksetzen</Link>
      </form>

      {inquiries.length === 0 ? (
        <div className="rounded-xl border border-anthracite/10 bg-white p-8 text-center">
          <p className="text-anthracite/70">Noch keine Anfragen vorhanden.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-anthracite/10 bg-white">
          <table className="min-w-full text-sm divide-y divide-anthracite/10">
            <thead className="bg-offwhite/50">
              <tr className="text-left text-anthracite/70">
                <th className="px-4 py-3">Name / E-Mail</th>
                <th className="px-4 py-3">Leistung</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Priorität</th>
                <th className="px-4 py-3">Quelle</th>
                <th className="px-4 py-3">Eingegangen</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-anthracite/10">
              {inquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-anthracite/5">
                  <td className="px-4 py-3">
                    <div className="font-medium">{inq.name}</div>
                    <div className="text-xs text-anthracite/60">{inq.email}</div>
                    {inq.phone && <div className="text-xs text-anthracite/60">{inq.phone}</div>}
                  </td>
                  <td className="px-4 py-3 text-anthracite/80">{inq.service_type || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-xs rounded ${inq.status === 'new' ? 'bg-ruby/10 text-ruby' : 'bg-anthracite/10'}`}>
                      {statusOptions.find(s => s.value === inq.status)?.label || inq.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-anthracite/80">{inq.priority}</td>
                  <td className="px-4 py-3 text-anthracite/80">{inq.source || 'website'}</td>
                  <td className="px-4 py-3 text-xs text-anthracite/60">{new Date(inq.created_at).toLocaleDateString('de-DE')}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/anfragen/${inq.id}`} className="text-sm text-ruby hover:underline">Details</Link>
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
