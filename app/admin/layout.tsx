import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

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
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-offwhite">
      <AdminSidebar />
      <div className="md:pl-[280px]">
        <main className="mx-auto max-w-6xl p-8 md:p-10">{children}</main>
      </div>
    </div>
  )
}
