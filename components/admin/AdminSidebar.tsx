'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/kunden', label: 'Kunden' },
  { href: '/admin/angebot', label: 'Angebot' },
  { href: '/admin/rechnung', label: 'Rechnung' },
  { href: '/admin/akquise', label: 'Akquise' },
  { href: '/admin/suchen', label: 'Suchen' },
  { href: '/admin/social-media', label: 'Social Media' },
  { href: '/admin/archiv', label: 'Archiv' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)
  const close = () => setIsOpen(false)

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 border-b border-anthracite/10 bg-white px-4 py-3 md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-anthracite/30 bg-anthracite text-xs font-semibold text-offwhite">
              K
            </div>
            <span className="font-display text-sm font-semibold tracking-tight text-anthracite">Admin</span>
          </div>
          <button
            onClick={toggle}
            className="rounded-md border border-anthracite/15 p-2 text-anthracite"
            aria-label="Navigation umschalten"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 border-r border-anthracite/10 bg-white transition-transform md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:flex md:flex-col`}
      >
        <div className="flex h-14 items-center border-b border-anthracite/10 px-4 md:h-[60px]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-anthracite/30 bg-anthracite text-xs font-semibold text-offwhite">
              K
            </div>
            <span className="font-display text-[15px] font-semibold tracking-[-0.015em] text-anthracite">
              Klickdesigns
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 text-sm">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={`mx-2 mb-0.5 flex items-center rounded-md px-3 py-2.5 transition-colors ${
                  isActive
                    ? 'bg-anthracite text-offwhite'
                    : 'text-anthracite/85 hover:bg-anthracite/5 hover:text-anthracite'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-anthracite/10 p-3">
          <button
            onClick={async () => {
              const { createClient } = await import('@/lib/supabase/client')
              const supabase = createClient()
              await supabase.auth.signOut()
              window.location.href = '/login'
            }}
            className="w-full rounded-md border border-anthracite/15 px-3 py-1.5 text-left text-xs text-anthracite/70 transition hover:bg-anthracite/5 hover:text-anthracite"
          >
            Abmelden
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-anthracite/40 md:hidden"
          onClick={close}
        />
      )}
    </>
  )
}
