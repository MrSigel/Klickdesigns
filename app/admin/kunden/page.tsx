import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { AddCustomerModal } from './AddCustomerModal'
import { revalidatePath } from 'next/cache'
import { ConfirmSubmitButton } from '../components/ConfirmSubmitButton'

type Customer = {
  id: string
  name: string
  email: string
  phone: string | null
  customer_type: string | null
  company: string | null
  source: string | null
  status: string
  notes: string | null
  created_at: string
}

async function getCustomers(search: string) {
  const supabase = await createClient()

  let query = supabase
    .from('customers')
    .select('id, name, email, phone, customer_type, company, source, status, notes, created_at')
    .order('created_at', { ascending: false })

  if (search) {
    const like = `%${search}%`
    query = query.or(`name.ilike.${like},email.ilike.${like},company.ilike.${like}`)
  }

  const { data, error } = await query.limit(100)

  if (error) {
    console.error('Error fetching customers:', error)
    return []
  }

  return (data || []) as Customer[]
}

async function deleteCustomer(formData: FormData) {
  'use server'

  const supabase = await createClient()
  const id = formData.get('id') as string
  if (!id) return

  await supabase.from('customers').delete().eq('id', id)
  revalidatePath('/admin/kunden')
}

export default async function AdminKunden({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const params = await searchParams
  const search = params.search || ''

  const customers = await getCustomers(search)

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-[28px] font-bold tracking-[-0.035em] text-anthracite">
          Kunden
        </h1>
        <p className="mt-1 text-[15px] text-anthracite/70">
          Kunden, Interessenten und Kontakte verwalten.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form method="get" className="flex-1">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Suche nach Name, E-Mail oder Firma..."
            className="w-full rounded-md border border-anthracite/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-ruby/40"
          />
        </form>

        <AddCustomerModal />
      </div>

      {customers.length === 0 ? (
        <div className="rounded-xl border border-anthracite/10 bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-anthracite/20">
            <span className="text-anthracite/40">👥</span>
          </div>
          <p className="text-anthracite/70">Noch keine Kunden vorhanden.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-anthracite/10 bg-white">
          <table className="min-w-full divide-y divide-anthracite/10 text-sm">
            <thead>
              <tr className="text-left text-anthracite/60">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">E-Mail</th>
                <th className="px-6 py-3 font-medium">Telefon</th>
                <th className="px-6 py-3 font-medium">Typ</th>
                <th className="px-6 py-3 font-medium">Quelle</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Erstellt</th>
                <th className="px-6 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-anthracite/10">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-anthracite/5">
                  <td className="px-6 py-4 font-medium text-anthracite">
                    <Link href={`/admin/kunden/${customer.id}`} className="hover:underline">
                      {customer.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-anthracite/80">{customer.email}</td>
                  <td className="px-6 py-4 text-anthracite/80">{customer.phone || '—'}</td>
                  <td className="px-6 py-4 text-anthracite/80">{customer.customer_type || '—'}</td>
                  <td className="px-6 py-4 text-anthracite/80">{customer.source || '—'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-anthracite/10 px-2.5 py-0.5 text-xs text-anthracite">
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-anthracite/60 text-xs">
                    {new Date(customer.created_at).toLocaleDateString('de-DE')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/kunden/${customer.id}`}
                        className="rounded-md border border-anthracite/15 px-3 py-1 text-xs hover:border-ruby/40"
                      >
                        Details
                      </Link>
                      <form action={deleteCustomer}>
                        <input type="hidden" name="id" value={customer.id} />
                        <ConfirmSubmitButton
                          message="Kunde wirklich löschen?"
                          className="rounded-md border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                        >
                          Löschen
                        </ConfirmSubmitButton>
                      </form>
                    </div>
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
