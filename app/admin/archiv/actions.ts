'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type LogActivityParams = {
  area: string
  action: string
  message?: string | null
  entity_type?: string | null
  entity_id?: string | null
  metadata?: Record<string, any> | null
}

export async function logActivity(params: LogActivityParams) {
  const supabase = await createClient()

  try {
    await supabase.from('activity_logs').insert({
      area: params.area,
      action: params.action,
      message: params.message || null,
      entity_type: params.entity_type || null,
      entity_id: params.entity_id || null,
      metadata: params.metadata || null,
    })
  } catch {
    // never throw from logging helper
  }
}

export async function deleteLog(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('activity_logs').delete().eq('id', id)
  if (error) {
    return { error: error.message }
  }
  revalidatePath('/admin/archiv')
  return { success: true }
}
