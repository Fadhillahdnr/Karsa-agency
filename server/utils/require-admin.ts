import type { H3Event } from 'h3'
import { getSupabaseClient } from './supabase'

/**
 * Verifies the bearer token from an authenticated admin request against
 * Supabase Auth. Any signed-in Supabase user counts as admin — there is no
 * separate roles table; access to the /admin UI itself is what's gated
 * (see app/middleware/admin-auth.ts), and admin accounts are provisioned
 * manually in the Supabase dashboard, not via self-signup.
 */
export async function requireAdminUser(event: H3Event) {
  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  return data.user
}
