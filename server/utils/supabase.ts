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

export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived'
export type ServiceCategory = 'web' | 'design' | 'photo' | 'film' | 'integrated'
export type Locale = 'en' | 'id'

export type ServiceRow = {
  id: string
  slug: string
  parent_id: string | null
  category: ServiceCategory
  cover_media_id: string | null
  featured: boolean
  show_price: boolean
  price_type: 'fixed' | 'starting_from' | 'custom' | 'monthly' | null
  starting_price: number | null
  currency: string
  order_index: number
  status: ContentStatus
  published_at: string | null
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

export type ServiceInsert = Omit<ServiceRow, 'id' | 'created_at' | 'updated_at' | 'currency'> & { currency?: string }
export type ServiceUpdate = Partial<Omit<ServiceRow, 'id' | 'created_at' | 'updated_at'>>

export type ServiceTranslationRow = {
  id: string
  service_id: string
  locale: Locale
  title: string
  short_title: string | null
  eyebrow: string | null
  summary: string | null
  intro: string | null
  who_its_for: string | null
  problems: string | null
  deliverables: string | null
  included: string | null
  excluded: string | null
  process: string | null
  cta_label: string | null
  seo_title: string | null
  seo_description: string | null
}

export type ServiceTranslationUpsert = Omit<ServiceTranslationRow, 'id'>

export type ServiceFaqRow = {
  id: string
  service_id: string
  locale: Locale
  question: string
  answer: string
  order_index: number
}

export type PackageRow = {
  id: string
  slug: string
  category: 'solo' | 'combo' | 'signature' | 'maintenance'
  price_type: 'fixed' | 'starting_from' | 'custom' | 'monthly'
  price: number | null
  currency: string
  badge: string | null
  featured: boolean
  order_index: number
  status: ContentStatus
  published_at: string | null
  created_at: string
  updated_at: string
}

export type PackageInsert = Omit<PackageRow, 'id' | 'created_at' | 'updated_at' | 'currency'> & { currency?: string }
export type PackageUpdate = Partial<Omit<PackageRow, 'id' | 'created_at' | 'updated_at'>>

export type PackageTranslationRow = {
  id: string
  package_id: string
  locale: Locale
  title: string
  summary: string | null
  price_note: string | null
  recommended_for: string | null
  duration_note: string | null
  revision_note: string | null
  cta_label: string | null
  seo_title: string | null
  seo_description: string | null
}

export type PackageTranslationUpsert = Omit<PackageTranslationRow, 'id'>

export type PackageItemRow = {
  id: string
  package_id: string
  label: string
  description: string | null
  is_highlight: boolean
  order_index: number
}

export type PageSectionComponentType
  = | 'hero' | 'client_logos' | 'brand_statement' | 'service_grid' | 'featured_work'
    | 'integrated_package' | 'why_karsa' | 'process' | 'testimonials' | 'insights'
    | 'updates' | 'faq' | 'cta'

export type PageRow = {
  id: string
  slug: string
  status: ContentStatus
  published_at: string | null
  show_in_navigation: boolean
  indexable: boolean
  created_at: string
  updated_at: string
}

export type PageSectionRow = {
  id: string
  page_id: string
  section_key: string
  component_type: PageSectionComponentType
  enabled: boolean
  order_index: number
  theme_variant: 'light' | 'dark' | 'neutral' | 'auto' | null
  content: Record<string, unknown>
  settings: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type PageSectionUpdate = Partial<Pick<PageSectionRow, 'enabled' | 'order_index' | 'theme_variant' | 'content' | 'settings'>>

export type ArticleCategory = 'Website' | 'Design' | 'Photography' | 'Video' | 'Branding' | 'Business' | 'Creative Process'

export type ArticleRow = {
  id: string
  slug: string
  cover_media_id: string | null
  author: string | null
  category: ArticleCategory | null
  tags: string[]
  featured: boolean
  status: ContentStatus
  published_at: string | null
  reading_time: number | null
  canonical_url: string | null
  og_media_id: string | null
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

export type ArticleInsert = Omit<ArticleRow, 'id' | 'created_at' | 'updated_at'>
export type ArticleUpdate = Partial<ArticleInsert>

export type ArticleTranslationRow = {
  id: string
  article_id: string
  locale: Locale
  title: string
  excerpt: string | null
  content: Record<string, unknown>
  seo_title: string | null
  seo_description: string | null
}

export type ArticleTranslationUpsert = Omit<ArticleTranslationRow, 'id'>

export type CompanyUpdateRow = {
  id: string
  slug: string
  cover_media_id: string | null
  status: ContentStatus
  published_at: string | null
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

export type CompanyUpdateInsert = Omit<CompanyUpdateRow, 'id' | 'created_at' | 'updated_at'>
export type CompanyUpdateUpdate = Partial<CompanyUpdateInsert>

export type CompanyUpdateTranslationRow = {
  id: string
  update_id: string
  locale: Locale
  title: string
  excerpt: string | null
  content: Record<string, unknown>
  seo_title: string | null
  seo_description: string | null
}

export type CompanyUpdateTranslationUpsert = Omit<CompanyUpdateTranslationRow, 'id'>

export type FaqRow = {
  id: string
  category: string | null
  related_service: string | null
  order_index: number
  featured: boolean
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
}

export type FaqInsert = Omit<FaqRow, 'id' | 'created_at' | 'updated_at'>
export type FaqUpdate = Partial<FaqInsert>

export type FaqTranslationRow = {
  id: string
  faq_id: string
  locale: Locale
  question: string
  answer: string
}

export type FaqTranslationUpsert = Omit<FaqTranslationRow, 'id'>

export type ClientRow = {
  id: string
  name: string
  slug: string
  logo_media_id: string | null
  website_url: string | null
  industry: string | null
  description: string | null
  featured: boolean
  permission_to_show: boolean
  order_index: number
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
}

export type ClientInsert = Omit<ClientRow, 'id' | 'created_at' | 'updated_at'>
export type ClientUpdate = Partial<ClientInsert>

export type TestimonialRow = {
  id: string
  quote: string
  person_name: string
  person_role: string | null
  company: string | null
  client_id: string | null
  project_id: string | null
  avatar_media_id: string | null
  source: string | null
  source_url: string | null
  permission_to_show: boolean
  featured: boolean
  order_index: number
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
}

export type TestimonialInsert = Omit<TestimonialRow, 'id' | 'created_at' | 'updated_at'>
export type TestimonialUpdate = Partial<TestimonialInsert>

export type PortfolioDiscipline = 'design' | 'photography' | 'videography'

export type PortfolioCollectionRow = {
  id: string
  slug: string
  discipline: PortfolioDiscipline
  category: string | null
  client_id: string | null
  project_id: string | null
  cover_media_id: string | null
  featured: boolean
  permission_to_show: boolean
  order_index: number
  status: ContentStatus
  published_at: string | null
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

export type PortfolioCollectionInsert = Omit<PortfolioCollectionRow, 'id' | 'created_at' | 'updated_at'>
export type PortfolioCollectionUpdate = Partial<PortfolioCollectionInsert>

export type PortfolioCollectionTranslationRow = {
  id: string
  collection_id: string
  locale: Locale
  title: string
  summary: string | null
  description: string | null
  credits: string | null
  seo_title: string | null
  seo_description: string | null
}

export type PortfolioCollectionTranslationUpsert = Omit<PortfolioCollectionTranslationRow, 'id'>

export type PortfolioItemType = 'image' | 'mockup' | 'video' | 'external_video' | 'before' | 'after' | 'document'

export type PortfolioItemRow = {
  id: string
  collection_id: string
  media_id: string | null
  item_type: PortfolioItemType
  external_url: string | null
  poster_media_id: string | null
  caption: string | null
  alt_text: string | null
  duration: number | null
  aspect_ratio: string | null
  featured: boolean
  order_index: number
  metadata: Record<string, unknown>
  created_at: string
}

export type PortfolioItemInsert = Omit<PortfolioItemRow, 'id' | 'created_at'>

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
      services: {
        Row: ServiceRow
        Insert: ServiceInsert
        Update: ServiceUpdate
        Relationships: []
      }
      service_translations: {
        Row: ServiceTranslationRow
        Insert: ServiceTranslationUpsert
        Update: Partial<ServiceTranslationUpsert>
        Relationships: []
      }
      service_faqs: {
        Row: ServiceFaqRow
        Insert: Omit<ServiceFaqRow, 'id'>
        Update: Partial<Omit<ServiceFaqRow, 'id'>>
        Relationships: []
      }
      packages: {
        Row: PackageRow
        Insert: PackageInsert
        Update: PackageUpdate
        Relationships: []
      }
      package_translations: {
        Row: PackageTranslationRow
        Insert: PackageTranslationUpsert
        Update: Partial<PackageTranslationUpsert>
        Relationships: []
      }
      package_items: {
        Row: PackageItemRow
        Insert: Omit<PackageItemRow, 'id'>
        Update: Partial<Omit<PackageItemRow, 'id'>>
        Relationships: []
      }
      package_service_links: {
        Row: { package_id: string, service_id: string }
        Insert: { package_id: string, service_id: string }
        Update: { package_id?: string, service_id?: string }
        Relationships: []
      }
      clients: {
        Row: ClientRow
        Insert: ClientInsert
        Update: ClientUpdate
        Relationships: []
      }
      testimonials: {
        Row: TestimonialRow
        Insert: TestimonialInsert
        Update: TestimonialUpdate
        Relationships: []
      }
      portfolio_collections: {
        Row: PortfolioCollectionRow
        Insert: PortfolioCollectionInsert
        Update: PortfolioCollectionUpdate
        Relationships: []
      }
      portfolio_collection_translations: {
        Row: PortfolioCollectionTranslationRow
        Insert: PortfolioCollectionTranslationUpsert
        Update: Partial<PortfolioCollectionTranslationUpsert>
        Relationships: []
      }
      portfolio_items: {
        Row: PortfolioItemRow
        Insert: PortfolioItemInsert
        Update: Partial<PortfolioItemInsert>
        Relationships: []
      }
      pages: {
        Row: PageRow
        Insert: Omit<PageRow, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<PageRow, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      page_sections: {
        Row: PageSectionRow
        Insert: Omit<PageSectionRow, 'id' | 'created_at' | 'updated_at'>
        Update: PageSectionUpdate
        Relationships: []
      }
      articles: {
        Row: ArticleRow
        Insert: ArticleInsert
        Update: ArticleUpdate
        Relationships: []
      }
      article_translations: {
        Row: ArticleTranslationRow
        Insert: ArticleTranslationUpsert
        Update: Partial<ArticleTranslationUpsert>
        Relationships: []
      }
      company_updates: {
        Row: CompanyUpdateRow
        Insert: CompanyUpdateInsert
        Update: CompanyUpdateUpdate
        Relationships: []
      }
      company_update_translations: {
        Row: CompanyUpdateTranslationRow
        Insert: CompanyUpdateTranslationUpsert
        Update: Partial<CompanyUpdateTranslationUpsert>
        Relationships: []
      }
      faqs: {
        Row: FaqRow
        Insert: FaqInsert
        Update: FaqUpdate
        Relationships: []
      }
      faq_translations: {
        Row: FaqTranslationRow
        Insert: FaqTranslationUpsert
        Update: Partial<FaqTranslationUpsert>
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
