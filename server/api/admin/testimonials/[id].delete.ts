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

  const { error } = await supabase.from('testimonials').delete().eq('id', id)
  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Could not delete testimonial' })
  }

  setResponseStatus(event, 204)
  return null
})
