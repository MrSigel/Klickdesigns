import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Counts - safe fallbacks
  const [
    { count: customersCount = 0 },
    { count: inquiriesCount = 0 },
    { count: offersCount = 0 },
    { count: invoicesCount = 0 },
  ] = await Promise.all([
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }),
    supabase.from('offers').select('*', { count: 'exact', head: true }),
    supabase.from('invoices').select('*', { count: 'exact', head: true }),
  ])

  // Today important: new inquiries + recent customers
  const { data: newInquiriesRaw } = await supabase
    .from('inquiries')
    .select('id, message, created_at, customers(name)')
    .eq('status', 'new')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: recentCustomersRaw } = await supabase
    .from('customers')
    .select('id, name, email, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  const newInquiries = newInquiriesRaw || []
  const recentCustomers = recentCustomersRaw || []

  // Additional stats for overview
  const { count: openInquiries = 0 } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .in('status', ['new', 'viewed', 'in_progress'])

  const { count: openInvoices = 0 } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .neq('status', 'paid')

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-[28px] font-bold tracking-[-0.035em] text-anthracite">
          Dashboard
        </h1>
        <p className="mt-1 text-[15px] text-anthracite/70">
          Schneller Überblick über Klickdesigns.
        </p>
      </div>

      {/* Top counts */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { label: 'Kunden', count: customersCount },
          { label: 'Anfragen', count: inquiriesCount },
          { label: 'Angebote', count: offersCount },
          { label: 'Rechnungen', count: invoicesCount },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-anthracite/10 bg-white p-6"
          >
            <div className="text-sm font-medium text-anthracite/70">{item.label}</div>
            <div className="mt-2 text-3xl font-semibold text-anthracite tabular-nums">{item.count}</div>
          </div>
        ))}
      </div>

      {/* Heute wichtig */}
      <div className="mb-8">
        <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-anthracite mb-4">
          Heute wichtig
        </h2>

        {newInquiries.length === 0 && recentCustomers.length === 0 ? (
          <div className="rounded-xl border border-anthracite/10 bg-white p-6 text-anthracite/70 text-sm">
            Heute gibt es noch keine neuen Einträge.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {/* New inquiries */}
            <div className="rounded-xl border border-anthracite/10 bg-white p-6">
              <div className="text-sm font-medium text-anthracite/70 mb-3">Neue Anfragen</div>
              {newInquiries.length > 0 ? (
                <ul className="space-y-3 text-sm">
                  {newInquiries.map((inq: any) => (
                    <li key={inq.id} className="text-anthracite/80">
                      {inq.customers?.name ? `${inq.customers.name}: ` : ''}
                      {inq.message?.slice(0, 80)}{inq.message?.length > 80 ? '…' : ''}
                      <span className="block text-[11px] text-anthracite/50 mt-0.5">
                        {new Date(inq.created_at).toLocaleDateString('de-DE')}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-anthracite/60 text-sm">Keine neuen Anfragen.</div>
              )}
            </div>

            {/* Recent customers */}
            <div className="rounded-xl border border-anthracite/10 bg-white p-6">
              <div className="text-sm font-medium text-anthracite/70 mb-3">Neue Kunden</div>
              {recentCustomers.length > 0 ? (
                <ul className="space-y-3 text-sm">
                  {recentCustomers.map((c: any) => (
                    <li key={c.id} className="text-anthracite/80">
                      {c.name || c.email}
                      <span className="block text-[11px] text-anthracite/50 mt-0.5">
                        {new Date(c.created_at).toLocaleDateString('de-DE')}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-anthracite/60 text-sm">Keine neuen Kunden.</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Schnellaktionen */}
      <div className="mb-8">
        <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-anthracite mb-4">
          Schnellaktionen
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/referenzen"
            className="rounded-xl border border-anthracite/10 bg-white p-5 hover:border-ruby/30 transition text-anthracite/90 hover:text-anthracite"
          >
            <div className="font-medium">Neue Referenz</div>
            <div className="text-xs mt-1 text-anthracite/55">Referenz hinzufügen</div>
          </Link>
          <Link
            href="/admin/akquise"
            className="rounded-xl border border-anthracite/10 bg-white p-5 hover:border-ruby/30 transition text-anthracite/90 hover:text-anthracite"
          >
            <div className="font-medium">Neue Akquise</div>
            <div className="text-xs mt-1 text-anthracite/55">Akquise erfassen</div>
          </Link>
          <Link
            href="/admin/profil"
            className="rounded-xl border border-anthracite/10 bg-white p-5 hover:border-ruby/30 transition text-anthracite/90 hover:text-anthracite"
          >
            <div className="font-medium">Neue Notiz</div>
            <div className="text-xs mt-1 text-anthracite/55">Notiz anlegen</div>
          </Link>
        </div>
      </div>

      {/* Statistikbereich */}
      <div>
        <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-anthracite mb-4">
          Übersicht
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Anfragen gesamt', value: inquiriesCount },
            { label: 'Offene Anfragen', value: openInquiries },
            { label: 'Kunden gesamt', value: customersCount },
            { label: 'Offene Rechnungen', value: openInvoices },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-anthracite/10 bg-white p-6"
            >
              <div className="text-sm text-anthracite/70">{stat.label}</div>
              <div className="mt-2 text-3xl font-semibold text-anthracite tabular-nums">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
