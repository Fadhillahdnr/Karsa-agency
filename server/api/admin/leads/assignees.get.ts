import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'

// Minimal admin list for the lead assignee selector — not full user
// management (that's its own future milestone, §27 "Users & Roles").
export default defineEventHandler(async (event) => {
  await requireAdmin(event, ['super_admin', 'sales', 'viewer'])

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const { data, error } = await supabase
    .from('admin_profiles')
    .select('user_id, display_name, role')
    .in('role', ['super_admin', 'sales'])
    .eq('is_active', true)
    .order('display_name', { ascending: true })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data
})
