import { createClient } from '@supabase/supabase-js'

/**
 * Browser-only Supabase client using the public anon key. Used exclusively
 * by the /admin panel for Supabase Auth (login) and direct Storage uploads
 * (cover images) — the anon key is safe to expose because both are gated
 * by RLS/auth policies, not by keeping the key secret.
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const supabase = config.public.supabaseUrl && config.public.supabaseAnonKey
    ? createClient(config.public.supabaseUrl, config.public.supabaseAnonKey, {
        auth: { persistSession: true, autoRefreshToken: true },
      })
    : null

  return { provide: { supabase } }
})
