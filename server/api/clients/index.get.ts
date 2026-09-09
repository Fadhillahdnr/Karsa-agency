import { getSupabaseClient } from '../../utils/supabase'

export type ClientApiItem = {
  slug: string
  name: string
  logoUrl: string | null
  websiteUrl: string | null
  industry: string | null
  featured: boolean
}

type Row = {
  slug: string
  name: string
  website_url: string | null
  industry: string | null
  featured: boolean
  logo: { secure_url: string | null, url: string } | null
}

/** Published clients with explicit permission_to_show only — never rendered otherwise (§15). */
export default defineEventHandler(async (): Promise<ClientApiItem[]> => {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('clients')
    .select('slug, name, website_url, industry, featured, logo:media_assets!clients_logo_media_id_fkey(secure_url, url)')
    .eq('status', 'published')
    .eq('permission_to_show', true)
    .order('order_index', { ascending: true })

  if (error || !data) return []

  return (data as unknown as Row[]).map(client => ({
    slug: client.slug,
    name: client.name,
    logoUrl: client.logo ? (client.logo.secure_url || client.logo.url) : null,
    websiteUrl: client.website_url,
    industry: client.industry,
    featured: client.featured,
  }))
})
