'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import AdminSidebarClock from './AdminSidebarClock'

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/anfragen', label: 'Anfragen' },
  { href: '/admin/kunden', label: 'Kunden' },
  { href: '/admin/angebot', label: 'Angebot' },
  { href: '/admin/rechnung', label: 'Rechnung' },
  { href: '/admin/akquise', label: 'Akquise' },
  { href: '/admin/suchen', label: 'Suchen' },
  { href: '/admin/social-media', label: 'Social Media' },
  { href: '/admin/referenzen', label: 'Referenzen' },
  { href: '/admin/archiv', label: 'Archiv' },
  { href: '/admin/einstellungen', label: 'Einstellungen' },
  { href: '/admin/profil', label: 'Profil' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)
  const close = () => setIsOpen(false)

  const handleLogout = async () => {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 border-b border-anthracite/10 bg-white px-4 py-3 md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/brand/klickdesigns-mark.svg"
              alt="Klickdesigns"
              width={28}
              height={28}
              className="h-7 w-7"
            />
            <span className="font-display text-sm font-semibold tracking-tight text-anthracite">Klickdesigns</span>
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

      {/* Sidebar - fixed full height, fixed width */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-anthracite/10 bg-white transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Top fixed header */}
        <div className="flex h-16 items-center border-b border-anthracite/10 px-6">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/klickdesigns-mark.svg"
              alt="Klickdesigns"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <div>
              <div className="font-display text-[15px] font-semibold tracking-[-0.015em] text-anthracite">
                Klickdesigns
              </div>
              <div className="text-[10px] text-anthracite/50">Adminbereich</div>
            </div>
          </div>
        </div>

        {/* Middle scrollable nav - takes remaining space */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 text-sm">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={`mb-0.5 flex items-center rounded-md px-3 py-[9px] transition-all ${
                  isActive
                    ? 'bg-anthracite/5 text-anthracite border-l-2 border-ruby pl-[11px]'
                    : 'text-anthracite/80 hover:bg-anthracite/5 hover:text-anthracite pl-3'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom fixed area */}
        <div className="border-t border-anthracite/10 px-5 py-5 text-center">
          {/* Subtle animated accent */}
          <div className="mb-3 flex justify-center">
            <div className="h-px w-6 bg-gradient-to-r from-ruby/40 to-transparent">
              <div className="h-px w-6 animate-[pulse_4s_ease-in-out_infinite] bg-ruby/30" />
            </div>
          </div>

          <AdminSidebarClock />

          <Link
            href="/"
            className="mt-4 block w-full rounded-md border border-ruby px-4 py-2 text-center text-[13px] font-medium text-anthracite transition hover:bg-ruby/5"
          >
            Zur Startseite
          </Link>
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
