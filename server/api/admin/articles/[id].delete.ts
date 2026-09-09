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

  const { data: article } = await supabase.from('articles').select('status').eq('id', id).maybeSingle()
  if (!article) {
    throw createError({ statusCode: 404, statusMessage: 'Article not found' })
  }

  const force = getQuery(event).force === 'true'
  if (article.status === 'published' && !force) {
    throw createError({ statusCode: 409, statusMessage: 'Published article — archive it first, or pass ?force=true to delete anyway' })
  }

  const { error } = await supabase.from('articles').delete().eq('id', id)
  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Could not delete article' })
  }

  setResponseStatus(event, 204)
  return null
})
