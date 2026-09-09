import type { Session, User } from '@supabase/supabase-js'
import type { AdminRole } from '../../server/utils/supabase'

export interface AdminProfile {
  id: string
  email: string | undefined
  displayName: string
  role: AdminRole
}

/**
 * Thin wrapper around the Supabase browser client for the /admin panel.
 * Session state is shared app-wide via useState so the login page, the
 * route middleware, and the dashboard pages all see the same signed-in
 * state without re-fetching it.
 */
export function useAdminAuth() {
  const { $supabase } = useNuxtApp()
  const session = useState<Session | null>('admin-session', () => null)
  const initialized = useState('admin-session-initialized', () => false)
  const profile = useState<AdminProfile | null>('admin-profile', () => null)

  async function loadProfile() {
    if (!session.value) {
      profile.value = null
      return
    }
    try {
      profile.value = await authFetch<AdminProfile>('/api/admin/me')
    }
    catch {
      // Signed in with Supabase Auth but no admin_profiles row (or
      // inactive) — treat as not a usable admin session. The route
      // middleware's isAuthenticated check still lets them reach
      // /admin/login; server routes independently enforce this via
      // requireAdmin, this just keeps the sidebar/UI honest too.
      profile.value = null
    }
  }

  async function init() {
    if (initialized.value || !$supabase) return
    initialized.value = true

    const { data } = await $supabase.auth.getSession()
    session.value = data.session
    await loadProfile()

    $supabase.auth.onAuthStateChange((_event, next) => {
      session.value = next
      void loadProfile()
    })
  }

  async function login(email: string, password: string) {
    if (!$supabase) {
      return { error: 'Admin login is not configured on this deployment.' }
    }

    const { data, error } = await $supabase.auth.signInWithPassword({ email, password })
    if (error) {
      return { error: error.message }
    }

    session.value = data.session
    await loadProfile()
    return { error: null }
  }

  async function logout() {
    await $supabase?.auth.signOut()
    session.value = null
    profile.value = null
  }

  const user = computed<User | null>(() => session.value?.user ?? null)
  const isAuthenticated = computed(() => !!session.value)
  // UX-only signal for hiding nav/UI the user's role doesn't need — never
  // a security boundary. Every admin API route enforces role server-side
  // via requireAdmin() independently of what the client believes.
  const role = computed<AdminRole | null>(() => profile.value?.role ?? null)
  const isAdmin = computed(() => !!profile.value)

  function hasRole(...roles: AdminRole[]) {
    return !!role.value && roles.includes(role.value)
  }

  async function authFetch<T>(url: string, options: Parameters<typeof $fetch>[1] = {}) {
    const token = session.value?.access_token
    return $fetch<T>(url, {
      ...options,
      headers: {
        ...(options.headers as Record<string, string> | undefined),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
  }

  return {
    session,
    user,
    profile,
    role,
    isAuthenticated,
    isAdmin,
    hasRole,
    init,
    login,
    logout,
    authFetch,
  }
}
