import { getSupabaseClient } from '../../../utils/supabase'
import type { Locale, PortfolioDiscipline } from '../../../utils/supabase'

export type PortfolioListItem = {
  path: string
  slug: string
  category: string | null
  featured: boolean
  title: string
  summary: string | null
  coverUrl: string | null
}

const DISCIPLINES: readonly PortfolioDiscipline[] = ['design', 'photography', 'videography']

type Row = {
  slug: string
  category: string | null
  featured: boolean
  portfolio_collection_translations: { locale: string, title: string, summary: string | null }[]
  cover: { secure_url: string | null, url: string } | null
}

/**
 * Published, permission-cleared evidence for one discipline (§13A.5:
 * permission_to_show = true AND status = published AND published_at <= now).
 */
export default defineEventHandler(async (event): Promise<PortfolioListItem[]> => {
  const discipline = getRouterParam(event, 'discipline') as PortfolioDiscipline
  if (!DISCIPLINES.includes(discipline)) return []

  const supabase = getSupabaseClient()
  if (!supabase) return []

  const query = getQuery(event)
  const locale: Locale = query.locale === 'id' ? 'id' : 'en'

  const { data, error } = await supabase
    .from('portfolio_collections')
    .select('slug, category, featured, portfolio_collection_translations!inner(locale, title, summary), cover:media_assets!portfolio_collections_cover_media_id_fkey(secure_url, url)')
    .eq('discipline', discipline)
    .eq('status', 'published')
    .eq('permission_to_show', true)
    .lte('published_at', new Date().toISOString())
    .eq('portfolio_collection_translations.locale', locale)
    .order('order_index', { ascending: true })

  if (error || !data) return []

  return (data as unknown as Row[]).map((row) => {
    const t = row.portfolio_collection_translations[0]
    return {
      path: `/${discipline}/${row.slug}`,
      slug: row.slug,
      category: row.category,
      featured: row.featured,
      title: t?.title ?? row.slug,
      summary: t?.summary ?? null,
      coverUrl: row.cover ? (row.cover.secure_url || row.cover.url) : null,
    }
  })
})
