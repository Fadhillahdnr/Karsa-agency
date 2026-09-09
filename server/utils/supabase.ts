import { createClient } from '@supabase/supabase-js'

// `type` aliases, not `interface`: supabase-js's insert<Row extends
// Relation['Insert']> conditional generic silently resolves named
// interfaces to `never` here (verified in isolation), while structurally
// identical `type` object shapes infer correctly.
export type LeadRow = {
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
  live_url: string | null
  github_url: string | null
  order_index: number
  published: boolean
  created_at: string
  updated_at: string
}

export type ProjectInsert = Omit<ProjectRow, 'id' | 'created_at' | 'updated_at'>
export type ProjectUpdate = Partial<ProjectInsert>

export type MediaAssetRow = {
  id: string
  provider: 'cloudinary' | 'external'
  public_id: string | null
  resource_type: 'image' | 'video' | 'document' | 'external_video'
  url: string
  secure_url: string | null
  thumbnail_url: string | null
  alt_text: string | null
  caption: string | null
  width: number | null
  height: number | null
  duration: number | null
  format: string | null
  bytes: number | null
  folder: string | null
  rights_status: string | null
  credit: string | null
  source: string | null
  created_by: string | null
  created_at: string
}

export type MediaAssetInsert = Omit<MediaAssetRow, 'id' | 'created_at'>
export type MediaAssetUpdate = Partial<Pick<MediaAssetRow, 'alt_text' | 'caption' | 'rights_status' | 'credit' | 'source'>>

export type AdminRole = 'super_admin' | 'content_editor' | 'sales' | 'viewer'

export type AdminProfileRow = {
  user_id: string
  display_name: string
  role: AdminRole
  avatar_url: string | null
  is_active: boolean
  last_seen_at: string | null
  created_at: string
  updated_at: string
}

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
      admin_profiles: {
        Row: AdminProfileRow
        Insert: Omit<AdminProfileRow, 'created_at' | 'updated_at'>
        Update: Partial<Omit<AdminProfileRow, 'user_id'>>
        Relationships: []
      }
      media_assets: {
        Row: MediaAssetRow
        Insert: MediaAssetInsert
        Update: MediaAssetUpdate
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
