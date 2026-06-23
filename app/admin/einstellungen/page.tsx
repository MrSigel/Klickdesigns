'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Tab = 'company' | 'pdf' | 'email' | 'website' | 'security'

const TABS: { key: Tab; label: string }[] = [
  { key: 'company', label: 'Unternehmensdaten' },
  { key: 'pdf', label: 'PDF & Rechnungen' },
  { key: 'email', label: 'E-Mail' },
  { key: 'website', label: 'Website' },
  { key: 'security', label: 'Sicherheit' },
]

const SETTING_KEYS = {
  company: 'company_profile',
  billing: 'billing_settings',
  email: 'email_settings',
  website: 'website_settings',
}

export default function AdminEinstellungen() {
  const [activeTab, setActiveTab] = useState<Tab>('company')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [userRole, setUserRole] = useState('admin')

  const [company, setCompany] = useState({
    brand_name: '',
    operator: '',
    legal_form: '',
    street: '',
    postal_code: '',
    city: '',
    country: '',
    email: '',
    phone: '',
    website_url: '',
  })

  const [billing, setBilling] = useState({
    payment_due_days: '',
    payment_terms: '',
    small_business_notice_enabled: false,
    small_business_notice_text: '',
    pdf_footer: '',
    bank_holder: '',
    bank_iban: '',
    bank_bic: '',
    bank_name: '',
  })

  const [emailSettings, setEmailSettings] = useState({
    sender_name: '',
    reply_to: '',
    signature: '',
    footer: '',
    offer_email_hint: '',
    invoice_email_hint: '',
    inquiry_confirmation_hint: '',
  })

  const [website, setWebsite] = useState({
    site_title: '',
    meta_description: '',
    contact_cta: '',
    references_enabled: true,
    contact_form_enabled: true,
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClient()

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || '')
        const { data: prof } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (prof) setUserRole(prof.role || 'admin')
      }

      const { data: settings } = await supabase.from('settings').select('setting_key, setting_value')

      if (settings) {
        const map = Object.fromEntries(settings.map(s => [s.setting_key, s.setting_value || {}]))

        if (map[SETTING_KEYS.company]) setCompany(map[SETTING_KEYS.company] as any)
        if (map[SETTING_KEYS.billing]) setBilling(map[SETTING_KEYS.billing] as any)
        if (map[SETTING_KEYS.email]) setEmailSettings(map[SETTING_KEYS.email] as any)
        if (map[SETTING_KEYS.website]) setWebsite(map[SETTING_KEYS.website] as any)
      }
    } catch (e: any) {
      setError('Fehler beim Laden der Einstellungen.')
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const logChange = async (msg: string) => {
    try {
      await supabase.from('activity_logs').insert({
        area: 'einstellungen',
        action: 'updated',
        message: msg,
      })
    } catch {}
  }

  const showMsg = (msg: string, isErr = false) => {
    if (isErr) setError(msg)
    else setSuccess(msg)
    setTimeout(() => {
      setError('')
      setSuccess('')
    }, 2200)
  }

  const saveCompany = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          setting_key: SETTING_KEYS.company,
          setting_value: company,
          description: 'Unternehmens- und Kontaktdaten',
          is_public: false,
        }, { onConflict: 'setting_key' })
      if (error) throw error
      await logChange('Unternehmensdaten geändert')
      showMsg('Unternehmensdaten gespeichert.')
    } catch (e: any) {
      showMsg(e.message || 'Fehler beim Speichern.', true)
    }
    setSaving(false)
  }

  const saveBilling = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          setting_key: SETTING_KEYS.billing,
          setting_value: billing,
          description: 'PDF, Rechnungen, Zahlung und Kleinunternehmer',
          is_public: false,
        }, { onConflict: 'setting_key' })
      if (error) throw error
      await logChange('PDF- und Rechnungseinstellungen geändert')
      showMsg('PDF & Rechnungen gespeichert.')
    } catch (e: any) {
      showMsg(e.message || 'Fehler beim Speichern.', true)
    }
    setSaving(false)
  }

  const saveEmail = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          setting_key: SETTING_KEYS.email,
          setting_value: emailSettings,
          description: 'E-Mail Texte, Signatur und Hinweise',
          is_public: false,
        }, { onConflict: 'setting_key' })
      if (error) throw error
      await logChange('E-Mail-Einstellungen geändert')
      showMsg('E-Mail-Einstellungen gespeichert.')
    } catch (e: any) {
      showMsg(e.message || 'Fehler beim Speichern.', true)
    }
    setSaving(false)
  }

  const saveWebsite = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          setting_key: SETTING_KEYS.website,
          setting_value: website,
          description: 'Website allgemeine Einstellungen',
          is_public: false,
        }, { onConflict: 'setting_key' })
      if (error) throw error
      await logChange('Website-Einstellungen geändert')
      showMsg('Website-Einstellungen gespeichert.')
    } catch (e: any) {
      showMsg(e.message || 'Fehler beim Speichern.', true)
    }
    setSaving(false)
  }

  const updateCompany = (k: keyof typeof company, v: string) => setCompany({ ...company, [k]: v })
  const updateBilling = (k: keyof typeof billing, v: any) => setBilling({ ...billing, [k]: v })
  const updateEmail = (k: keyof typeof emailSettings, v: string) => setEmailSettings({ ...emailSettings, [k]: v })
  const updateWebsite = (k: keyof typeof website, v: any) => setWebsite({ ...website, [k]: v })

  const renderTabContent = () => {
    if (activeTab === 'company') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Markenname" value={company.brand_name} onChange={(v) => updateCompany('brand_name', v)} />
            <Field label="Betreiber / Inhaber" value={company.operator} onChange={(v) => updateCompany('operator', v)} />
            <Field label="Geschäftsform" value={company.legal_form} onChange={(v) => updateCompany('legal_form', v)} />
            <Field label="Straße / Hausnummer" value={company.street} onChange={(v) => updateCompany('street', v)} />
            <Field label="PLZ" value={company.postal_code} onChange={(v) => updateCompany('postal_code', v)} />
            <Field label="Ort" value={company.city} onChange={(v) => updateCompany('city', v)} />
            <Field label="Land" value={company.country} onChange={(v) => updateCompany('country', v)} />
            <Field label="E-Mail" type="email" value={company.email} onChange={(v) => updateCompany('email', v)} />
            <Field label="Telefon" value={company.phone} onChange={(v) => updateCompany('phone', v)} />
            <Field label="Website-URL" value={company.website_url} onChange={(v) => updateCompany('website_url', v)} />
          </div>
          <button onClick={saveCompany} disabled={saving} className="mt-2 rounded-md bg-ruby px-4 py-2 text-sm font-semibold text-offwhite hover:bg-ruby/90 disabled:opacity-60">
            {saving ? 'Speichern...' : 'Unternehmensdaten speichern'}
          </button>
        </div>
      )
    }

    if (activeTab === 'pdf') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Standard-Zahlungsfrist (Tage)" value={billing.payment_due_days} onChange={(v) => updateBilling('payment_due_days', v)} />
            <div className="md:col-span-2">
              <Field label="Standard-Zahlungsbedingungen" value={billing.payment_terms} onChange={(v) => updateBilling('payment_terms', v)} />
            </div>
            <div className="md:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="klein"
                checked={billing.small_business_notice_enabled}
                onChange={(e) => updateBilling('small_business_notice_enabled', e.target.checked)}
                className="accent-ruby"
              />
              <label htmlFor="klein" className="text-sm">Kleinunternehmer-Hinweis aktiv</label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-anthracite/70 mb-1">Kleinunternehmer-Hinweis Text</label>
              <textarea
                value={billing.small_business_notice_text}
                onChange={(e) => updateBilling('small_business_notice_text', e.target.value)}
                rows={2}
                className="w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm focus:border-ruby/40 outline-none"
                placeholder="z. B. Gemäß § 19 UStG wird keine Umsatzsteuer ausgewiesen."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-anthracite/70 mb-1">PDF-Footer Text</label>
              <textarea
                value={billing.pdf_footer}
                onChange={(e) => updateBilling('pdf_footer', e.target.value)}
                rows={2}
                className="w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm focus:border-ruby/40 outline-none"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-anthracite/10">
            <div className="text-sm font-medium mb-3">Bankdaten (optional)</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Kontoinhaber" value={billing.bank_holder} onChange={(v) => updateBilling('bank_holder', v)} />
              <Field label="IBAN" value={billing.bank_iban} onChange={(v) => updateBilling('bank_iban', v)} />
              <Field label="BIC" value={billing.bank_bic} onChange={(v) => updateBilling('bank_bic', v)} />
              <Field label="Bankname" value={billing.bank_name} onChange={(v) => updateBilling('bank_name', v)} />
            </div>
          </div>

          <button onClick={saveBilling} disabled={saving} className="mt-2 rounded-md bg-ruby px-4 py-2 text-sm font-semibold text-offwhite hover:bg-ruby/90 disabled:opacity-60">
            {saving ? 'Speichern...' : 'PDF & Rechnungen speichern'}
          </button>
          <p className="text-xs text-anthracite/50">Keine Bankdaten oder Steuerdaten werden erfunden. Nur vom Nutzer eingegebene Werte werden gespeichert.</p>
        </div>
      )
    }

    if (activeTab === 'email') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Standard-Absendername" value={emailSettings.sender_name} onChange={(v) => updateEmail('sender_name', v)} />
            <Field label="Antwortadresse" type="email" value={emailSettings.reply_to} onChange={(v) => updateEmail('reply_to', v)} />
          </div>
          <div>
            <label className="block text-xs text-anthracite/70 mb-1">Standard-Signatur</label>
            <textarea value={emailSettings.signature} onChange={(e) => updateEmail('signature', e.target.value)} rows={3} className="w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm focus:border-ruby/40 outline-none font-mono" />
          </div>
          <div>
            <label className="block text-xs text-anthracite/70 mb-1">Standard-Footer</label>
            <textarea value={emailSettings.footer} onChange={(e) => updateEmail('footer', e.target.value)} rows={2} className="w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm focus:border-ruby/40 outline-none" />
          </div>
          <div>
            <label className="block text-xs text-anthracite/70 mb-1">Hinweistext für Angebot-E-Mails</label>
            <textarea value={emailSettings.offer_email_hint} onChange={(e) => updateEmail('offer_email_hint', e.target.value)} rows={2} className="w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm focus:border-ruby/40 outline-none" />
          </div>
          <div>
            <label className="block text-xs text-anthracite/70 mb-1">Hinweistext für Rechnung-E-Mails</label>
            <textarea value={emailSettings.invoice_email_hint} onChange={(e) => updateEmail('invoice_email_hint', e.target.value)} rows={2} className="w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm focus:border-ruby/40 outline-none" />
          </div>
          <div>
            <label className="block text-xs text-anthracite/70 mb-1">Hinweistext für Anfrage-Bestätigung</label>
            <textarea value={emailSettings.inquiry_confirmation_hint} onChange={(e) => updateEmail('inquiry_confirmation_hint', e.target.value)} rows={2} className="w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm focus:border-ruby/40 outline-none" />
          </div>

          <div className="rounded border border-anthracite/10 bg-offwhite/40 p-3 text-xs text-anthracite/70">
            SMTP-Zugangsdaten (Host, Port, User, Passwort etc.) werden ausschließlich über Umgebungsvariablen verwaltet und sind hier weder sichtbar noch editierbar.
          </div>

          <button onClick={saveEmail} disabled={saving} className="mt-2 rounded-md bg-ruby px-4 py-2 text-sm font-semibold text-offwhite hover:bg-ruby/90 disabled:opacity-60">
            {saving ? 'Speichern...' : 'E-Mail-Einstellungen speichern'}
          </button>
        </div>
      )
    }

    if (activeTab === 'website') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Seitentitel" value={website.site_title} onChange={(v) => updateWebsite('site_title', v)} />
            <div className="md:col-span-2">
              <label className="block text-xs text-anthracite/70 mb-1">Meta-Beschreibung</label>
              <textarea value={website.meta_description} onChange={(e) => updateWebsite('meta_description', e.target.value)} rows={2} className="w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm focus:border-ruby/40 outline-none" />
            </div>
            <Field label="Kontakt-CTA Text" value={website.contact_cta} onChange={(v) => updateWebsite('contact_cta', v)} />
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" id="ref" checked={website.references_enabled} onChange={(e) => updateWebsite('references_enabled', e.target.checked)} className="accent-ruby" />
              <label htmlFor="ref" className="text-sm">Referenzen-Abschnitt aktiv</label>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" id="form" checked={website.contact_form_enabled} onChange={(e) => updateWebsite('contact_form_enabled', e.target.checked)} className="accent-ruby" />
              <label htmlFor="form" className="text-sm">Anfrageformular aktiv</label>
            </div>
          </div>

          <button onClick={saveWebsite} disabled={saving} className="mt-2 rounded-md bg-ruby px-4 py-2 text-sm font-semibold text-offwhite hover:bg-ruby/90 disabled:opacity-60">
            {saving ? 'Speichern...' : 'Website-Einstellungen speichern'}
          </button>
          <p className="text-xs text-anthracite/50">Diese Einstellungen sind vorbereitet für spätere Nutzung. Keine bestehenden Landingpage-Inhalte werden hier überschrieben.</p>
        </div>
      )
    }

    // security
    return (
      <div className="max-w-xl rounded-xl border border-anthracite/10 bg-white p-6 space-y-4">
        <div>
          <div className="text-xs uppercase tracking-[0.08em] text-anthracite/60 mb-1">Eingeloggte Admin-E-Mail</div>
          <div className="font-medium text-anthracite">{userEmail || '—'}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.08em] text-anthracite/60 mb-1">Rolle</div>
          <div className="font-medium text-anthracite">{userRole}</div>
        </div>

        <div className="pt-4 border-t border-anthracite/10 text-sm text-anthracite/70">
          Admin-Zugriff wird über Supabase Auth und <code className="font-mono text-xs">profiles.role = &apos;admin&apos;</code> gesteuert. Keine eigenen Passwörter oder User-Verwaltung im Dashboard.
        </div>

        <a href="/admin/profil" className="inline-block rounded-md border border-anthracite/15 px-4 py-2 text-sm hover:bg-anthracite/5">
          Zum vollständigen Profil →
        </a>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-[28px] font-bold tracking-[-0.035em] text-anthracite">
          Einstellungen
        </h1>
        <p className="mt-1 text-[15px] text-anthracite/70">
          Zentrale Angaben für Klickdesigns, PDFs und E-Mails verwalten.
        </p>
      </div>

      {error && <div className="mb-4 rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
      {success && <div className="mb-4 rounded bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">{success}</div>}

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-1 border-b border-anthracite/10 text-sm">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 -mb-px border-b-2 transition ${activeTab === t.key ? 'border-ruby text-anthracite font-medium' : 'border-transparent text-anthracite/60 hover:text-anthracite'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-8 text-anthracite/50">Lade Einstellungen...</div>
      ) : (
        <div className="rounded-xl border border-anthracite/10 bg-white p-6">
          {renderTabContent()}
        </div>
      )}

      <p className="mt-6 text-xs text-anthracite/50">Alle Änderungen werden direkt in Supabase gespeichert. Leere Felder sind erlaubt.</p>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-xs text-anthracite/70 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-anthracite/15 bg-white px-3 py-2 text-sm outline-none focus:border-ruby/40"
      />
    </div>
  )
}
