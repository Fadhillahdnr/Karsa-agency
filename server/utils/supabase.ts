import { createClient } from '@supabase/supabase-js'

// `type` aliases, not `interface`: supabase-js's insert<Row extends
// Relation['Insert']> conditional generic silently resolves named
// interfaces to `never` here (verified in isolation), while structurally
// identical `type` object shapes infer correctly.
type LeadRow = {
  id: string
  reference_id: string
  name: string
  company: string | null
  email: string
  phone: string | null
  service: string
  budget_range: string | null
  timeline: string | null
  project_description: string
  referral_source: string | null
  status: string
  source: string
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

type LeadInsert = Omit<LeadRow, 'id' | 'status' | 'metadata' | 'created_at' | 'updated_at'>
  & Partial<Pick<LeadRow, 'status' | 'metadata'>>

export type ProjectRow = {
  id: string
  slug: string
  title: string
  year: number
  type: 'Independent Project' | 'Internal Concept' | 'Experimental Work'
  category: string
  services: string[]
  description: string
  cover: string
  featured: boolean
  challenge: string | null
  approach: string | null
  outcome: string | null
  order_index: number
  published: boolean
  created_at: string
  updated_at: string
}

export type ProjectInsert = Omit<ProjectRow, 'id' | 'created_at' | 'updated_at'>
export type ProjectUpdate = Partial<ProjectInsert>

type Database = {
  public: {
    Tables: {
      leads: {
        Row: LeadRow
        Insert: LeadInsert
        Update: Partial<LeadRow>
        Relationships: []
      }
      projects: {
        Row: ProjectRow
        Insert: ProjectInsert
        Update: ProjectUpdate
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

let client: ReturnType<typeof createClient<Database>> | null = null

/**
 * Server-only Supabase client using the service role key. Returns null when
 * Supabase isn't configured yet so callers can fail gracefully instead of
 * crashing the request (see TODO: business input in .env.example).
 */
export function getSupabaseClient() {
  const config = useRuntimeConfig()

  if (!config.supabaseUrl || !config.supabaseServiceRoleKey) {
    return null
  }

  if (!client) {
    client = createClient<Database>(config.supabaseUrl, config.supabaseServiceRoleKey, {
      auth: { persistSession: false },
    })
  }

  return client
}
