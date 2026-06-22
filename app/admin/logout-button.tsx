'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-md border border-anthracite/20 px-4 py-1.5 text-[13px] font-medium text-anthracite transition hover:border-ruby/40 hover:text-ruby"
    >
      Abmelden
    </button>
  )
}
