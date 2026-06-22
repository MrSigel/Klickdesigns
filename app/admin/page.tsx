import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './logout-button'

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check admin access via profile role or ADMIN_EMAIL
  const adminEmail = process.env.ADMIN_EMAIL

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isAdmin =
    profile?.role === 'admin' ||
    (adminEmail && user.email?.toLowerCase() === adminEmail.toLowerCase())

  if (!isAdmin) {
    // Not admin: sign out and redirect
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-offwhite">
      <div className="border-b border-anthracite/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-anthracite/30 bg-anthracite text-[13px] font-semibold text-offwhite">
              K
            </div>
            <div>
              <div className="font-display text-lg font-semibold tracking-[-0.02em] text-anthracite">
                Klickdesigns Admin
              </div>
              <div className="text-[11px] text-anthracite/50">Interne Verwaltung</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="font-mono text-[12px] text-anthracite/60">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10">
          <h1 className="font-display text-[32px] font-bold tracking-[-0.04em] text-anthracite">
            Klickdesigns Admin
          </h1>
          <p className="mt-2 max-w-md text-[15px] leading-relaxed text-anthracite/70">
            Der Adminbereich ist vorbereitet.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: 'Anfragen' },
            { label: 'Kunden' },
            { label: 'Projekte' },
            { label: 'Dateien' },
            { label: 'Einstellungen' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-anthracite/10 bg-white p-6 shadow-[0_12px_40px_-20px_rgba(31,27,27,0.2)]"
            >
              <div className="font-semibold text-anthracite">{item.label}</div>
              <div className="mt-6 text-[13px] leading-relaxed text-anthracite/55">
                Bereich wird vorbereitet.
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-[12px] text-anthracite/50">
          Angemeldet als {user.email}
        </div>
      </div>
    </div>
  )
}
