import { requireAdmin } from '../../utils/require-admin'

/** Returns the signed-in admin's profile/role, for client-side RBAC (sidebar visibility, etc). */
export default defineEventHandler(async (event) => {
  const { user, profile } = await requireAdmin(event)

  return {
    id: user.id,
    email: user.email,
    displayName: profile.display_name,
    role: profile.role,
  }
})
