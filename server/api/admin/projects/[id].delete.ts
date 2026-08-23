import { requireAdminUser } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing project id' })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const { error } = await supabase.from('projects').delete().eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  setResponseStatus(event, 204)
  return null
})
