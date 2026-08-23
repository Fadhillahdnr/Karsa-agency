import type { Session, User } from '@supabase/supabase-js'

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

  async function init() {
    if (initialized.value || !$supabase) return
    initialized.value = true

    const { data } = await $supabase.auth.getSession()
    session.value = data.session

    $supabase.auth.onAuthStateChange((_event, next) => {
      session.value = next
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
    return { error: null }
  }

  async function logout() {
    await $supabase?.auth.signOut()
    session.value = null
  }

  const user = computed<User | null>(() => session.value?.user ?? null)
  const isAuthenticated = computed(() => !!session.value)

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
    isAuthenticated,
    init,
    login,
    logout,
    authFetch,
  }
}
