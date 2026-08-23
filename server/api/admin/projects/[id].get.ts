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

  const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()

  if (error) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found' })
  }

  return data
})
