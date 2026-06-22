'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCustomer(formData: FormData) {
  const supabase = await createClient()

  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const phone = (formData.get('phone') as string)?.trim() || null
  const customer_type = (formData.get('customer_type') as string) || null
  const company = (formData.get('company') as string)?.trim() || null
  const source = (formData.get('source') as string) || null
  const status = (formData.get('status') as string) || 'interessent'
  const notes = (formData.get('notes') as string)?.trim() || null

  if (!name || !email) {
    return { error: 'Name und E-Mail sind erforderlich.' }
  }

  const { error } = await supabase.from('customers').insert({
    name,
    email,
    phone,
    customer_type,
    company,
    source,
    status,
    notes,
  })

  if (error) {
    console.error('Create customer error:', error)
    return { error: 'Fehler beim Anlegen des Kunden. ' + error.message }
  }

  revalidatePath('/admin/kunden')
  return { success: true }
}
