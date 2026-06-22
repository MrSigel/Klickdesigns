'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.replace('/admin')
      }
    }
    checkSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-anthracite/20 bg-white">
            <span className="font-display text-xl font-semibold text-anthracite">K</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-[-0.04em] text-anthracite">
            Klickdesigns Admin
          </h1>
          <p className="mt-2 text-[15px] text-anthracite/70">
            Bitte anmelden, um fortzufahren.
          </p>
        </div>

        <div className="rounded-2xl border border-anthracite/10 bg-white p-8 shadow-[0_20px_60px_-30px_rgba(31,27,27,0.35)]">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-[13px] font-semibold tracking-[0.01em] text-anthracite/75">
                E-Mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="briefing-input mt-2 w-full"
                placeholder="admin@klickdesigns.de"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[13px] font-semibold tracking-[0.01em] text-anthracite/75">
                Passwort
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="briefing-input mt-2 w-full"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="rounded-lg border border-ruby/30 bg-ruby/5 px-4 py-3 text-sm text-ruby">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="group mt-2 flex h-12 w-full items-center justify-center rounded-md bg-ruby text-[15px] font-semibold text-offwhite shadow-[0_10px_30px_-15px_rgba(153,0,0,0.65)] transition-all hover:-translate-y-px hover:bg-ruby/95 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Anmelden …' : 'Anmelden'}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-[12px] text-anthracite/50">
          Nur für autorisierte Administratoren.
        </p>
      </div>
    </div>
  )
}
