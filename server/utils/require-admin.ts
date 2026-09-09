import type { H3Event } from 'h3'
import type { User } from '@supabase/supabase-js'
import type { AdminProfileRow, AdminRole } from './supabase'
import { getSupabaseClient } from './supabase'

export interface AdminContext {
  user: User
  profile: AdminProfileRow
}

/**
 * Verifies the bearer token against Supabase Auth, then requires an active
 * `admin_profiles` row for that user — a signed-in Supabase user is no
 * longer sufficient on its own (see supabase/migrations/0005_create_admin_profiles.sql).
 * Pass `allowedRoles` to additionally restrict to specific roles; omit it
 * to just require any active admin, regardless of role.
 */
export async function requireAdmin(event: H3Event, allowedRoles?: AdminRole[]): Promise<AdminContext> {
  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const { data: userData, error: userError } = await supabase.auth.getUser(token)
  if (userError || !userData.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const { data: profile, error: profileError } = await supabase
    .from('admin_profiles')
    .select('*')
    .eq('user_id', userData.user.id)
    .maybeSingle()

  if (profileError || !profile || !profile.is_active) {
    throw createError({ statusCode: 403, statusMessage: 'Not an active admin' })
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Insufficient role' })
  }

  // Fire-and-forget: supabase-js resolves query errors on the result object
  // rather than rejecting, so this never produces an unhandled rejection.
  void supabase
    .from('admin_profiles')
    .update({ last_seen_at: new Date().toISOString() })
    .eq('user_id', profile.user_id)

  return { user: userData.user, profile }
}

/** Back-compat alias: any active admin, regardless of role. */
export async function requireAdminUser(event: H3Event): Promise<User> {
  const { user } = await requireAdmin(event)
  return user
}
