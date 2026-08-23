import { requireAdminUser } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('order_index', { ascending: true })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data
})
