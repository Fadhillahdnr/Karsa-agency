import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'

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

  const { data: update } = await supabase.from('company_updates').select('status').eq('id', id).maybeSingle()
  if (!update) {
    throw createError({ statusCode: 404, statusMessage: 'Update not found' })
  }

  const force = getQuery(event).force === 'true'
  if (update.status === 'published' && !force) {
    throw createError({ statusCode: 409, statusMessage: 'Published update — archive it first, or pass ?force=true to delete anyway' })
  }

  const { error } = await supabase.from('company_updates').delete().eq('id', id)
  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Could not delete update' })
  }

  setResponseStatus(event, 204)
  return null
})
