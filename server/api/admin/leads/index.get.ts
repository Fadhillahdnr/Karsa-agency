import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { LeadPriority } from '../../../utils/supabase'
import { leadStatuses, leadPriorities } from '../../../validation/lead'

export default defineEventHandler(async (event) => {
  await requireAdmin(event, ['super_admin', 'sales', 'viewer'])

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const query = getQuery(event)
  const status = typeof query.status === 'string' ? query.status : undefined
  const search = typeof query.search === 'string' ? query.search.trim() : undefined
  const service = typeof query.service === 'string' ? query.service : undefined
  const priority = typeof query.priority === 'string' ? query.priority : undefined
  const assignedTo = typeof query.assignedTo === 'string' ? query.assignedTo : undefined
  const from = typeof query.from === 'string' ? query.from : undefined
  const to = typeof query.to === 'string' ? query.to : undefined

  let request = supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (status && (leadStatuses as readonly string[]).includes(status)) {
    request = request.eq('status', status)
  }

  if (service) request = request.eq('service', service)
  if (priority && (leadPriorities as readonly string[]).includes(priority)) {
    request = request.eq('priority', priority as LeadPriority)
  }
  if (assignedTo) request = request.eq('assigned_to', assignedTo)
  if (from) request = request.gte('created_at', from)
  if (to) request = request.lte('created_at', to)

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
