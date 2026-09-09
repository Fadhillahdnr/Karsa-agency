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

  const { data: collection } = await supabase.from('portfolio_collections').select('status').eq('id', id).maybeSingle()
  if (!collection) {
    throw createError({ statusCode: 404, statusMessage: 'Collection not found' })
  }

  const force = getQuery(event).force === 'true'
  if (collection.status === 'published' && !force) {
    throw createError({ statusCode: 409, statusMessage: 'Published collection — archive it first, or pass ?force=true to delete anyway' })
  }

  const { error } = await supabase.from('portfolio_collections').delete().eq('id', id)
  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Could not delete collection' })
  }

  setResponseStatus(event, 204)
  return null
})
