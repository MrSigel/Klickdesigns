'use client'

import { useState } from 'react'
import { createCustomer } from './actions'

export function AddCustomerModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(false)

    const result = await createCustomer(formData)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(true)
      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
        window.location.reload()
      }, 900)
    }
    setLoading(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center rounded-md bg-ruby px-4 py-2 text-sm font-semibold text-offwhite hover:bg-ruby/90"
      >
        + Neuer Kunde
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-anthracite/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-anthracite/10 bg-white p-6 shadow-xl">
            <h3 className="font-display text-xl font-semibold text-anthracite mb-4">Neuen Kunden anlegen</h3>

            {error && <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>}
            {success && <div className="mb-4 rounded bg-green-50 p-3 text-sm text-green-600">Kunde erfolgreich angelegt.</div>}

            <form action={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-anthracite/70">Name *</label>
                  <input name="name" required className="mt-1 w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-anthracite/70">E-Mail *</label>
                  <input type="email" name="email" required className="mt-1 w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-anthracite/70">Telefon</label>
                  <input name="phone" className="mt-1 w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-anthracite/70">Firma</label>
                  <input name="company" className="mt-1 w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-anthracite/70">Kundentyp</label>
                  <select name="customer_type" className="mt-1 w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm">
                    <option value="">Bitte wählen</option>
                    <option value="unternehmen">Unternehmen</option>
                    <option value="verein">Verein</option>
                    <option value="creator">Creator</option>
                    <option value="privatkunde">Privatkunde</option>
                    <option value="shop">Shop</option>
                    <option value="sonstiges">Sonstiges</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-anthracite/70">Quelle</label>
                  <select name="source" className="mt-1 w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm">
                    <option value="">Bitte wählen</option>
                    <option value="website">Website</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="social_media">Social Media</option>
                    <option value="lokal">Lokal</option>
                    <option value="empfehlung">Weiterempfehlung</option>
                    <option value="google">Google</option>
                    <option value="sonstiges">Sonstiges</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-anthracite/70">Status</label>
                  <select name="status" defaultValue="interessent" className="mt-1 w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm">
                    <option value="interessent">Interessent</option>
                    <option value="kunde">Kunde</option>
                    <option value="stammkunde">Stammkunde</option>
                    <option value="archiviert">Archiviert</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-anthracite/70">Notizen</label>
                  <input name="notes" className="mt-1 w-full rounded-md border border-anthracite/15 px-3 py-2 text-sm" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 rounded-md border border-anthracite/20 py-2.5 text-sm hover:bg-anthracite/5">
                  Abbrechen
                </button>
                <button type="submit" disabled={loading} className="flex-1 rounded-md bg-ruby py-2.5 text-sm font-semibold text-offwhite disabled:opacity-60">
                  {loading ? 'Speichern...' : 'Kunden anlegen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
