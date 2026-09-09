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

  const { data: pkg } = await supabase.from('packages').select('status').eq('id', id).maybeSingle()
  if (!pkg) {
    throw createError({ statusCode: 404, statusMessage: 'Package not found' })
  }

  const force = getQuery(event).force === 'true'
  if (pkg.status === 'published' && !force) {
    throw createError({ statusCode: 409, statusMessage: 'Published package — archive it first, or pass ?force=true to delete anyway' })
  }

  const { error } = await supabase.from('packages').delete().eq('id', id)
  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Could not delete package' })
  }

  setResponseStatus(event, 204)
  return null
})
