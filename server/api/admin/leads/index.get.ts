import { requireAdminUser } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import { leadStatuses } from '../../../validation/lead'

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const query = getQuery(event)
  const status = typeof query.status === 'string' ? query.status : undefined
  const search = typeof query.search === 'string' ? query.search.trim() : undefined

  let request = supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (status && (leadStatuses as readonly string[]).includes(status)) {
    request = request.eq('status', status)
  }

  if (search) {
    const escaped = search.replace(/[%,]/g, '')
    request = request.or(
      `name.ilike.%${escaped}%,email.ilike.%${escaped}%,company.ilike.%${escaped}%,reference_id.ilike.%${escaped}%`,
    )
  }

  const { data, error } = await request

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data
})
