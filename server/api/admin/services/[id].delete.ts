import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'

/**
 * Hard-deletes a service. Published services require ?force=true — the
 * admin UI should steer editors toward archiving (PATCH status=archived)
 * instead, per master prompt §54 ("prefer archive over hard delete for
 * published content"), but a super_admin can still force it here.
 */
export default defineEventHandler(async (event) => {
  await requireAdmin(event, ['super_admin'])

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const { data: service } = await supabase.from('services').select('status').eq('id', id).maybeSingle()
  if (!service) {
    throw createError({ statusCode: 404, statusMessage: 'Service not found' })
  }

  const force = getQuery(event).force === 'true'
  if (service.status === 'published' && !force) {
    throw createError({ statusCode: 409, statusMessage: 'Published service — archive it first, or pass ?force=true to delete anyway' })
  }

  const { error } = await supabase.from('services').delete().eq('id', id)
  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Could not delete service' })
  }

  setResponseStatus(event, 204)
  return null
})
