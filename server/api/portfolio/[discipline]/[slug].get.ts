import { getSupabaseClient } from '../../../utils/supabase'
import type { Locale, PortfolioDiscipline, PortfolioItemRow } from '../../../utils/supabase'

export type PortfolioDetailItem = {
  path: string
  slug: string
  category: string | null
  title: string
  summary: string | null
  description: string | null
  credits: string | null
  seoTitle: string | null
  seoDescription: string | null
  items: {
    itemType: string
    url: string | null
    posterUrl: string | null
    externalUrl: string | null
    caption: string | null
    altText: string | null
    duration: number | null
    aspectRatio: string | null
    featured: boolean
  }[]
}

const DISCIPLINES: readonly PortfolioDiscipline[] = ['design', 'photography', 'videography']

export default defineEventHandler(async (event): Promise<PortfolioDetailItem | null> => {
  const discipline = getRouterParam(event, 'discipline') as PortfolioDiscipline
  const slug = getRouterParam(event, 'slug')
  if (!DISCIPLINES.includes(discipline) || !slug) return null

  const supabase = getSupabaseClient()
  if (!supabase) return null

  const query = getQuery(event)
  const locale: Locale = query.locale === 'id' ? 'id' : 'en'

  const { data: collection, error } = await supabase
    .from('portfolio_collections')
    .select('id, slug, category')
    .eq('discipline', discipline)
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('permission_to_show', true)
    .lte('published_at', new Date().toISOString())
    .maybeSingle()

  if (error || !collection) return null

  const [{ data: translation }, { data: itemRows }] = await Promise.all([
    supabase.from('portfolio_collection_translations').select('*').eq('collection_id', collection.id).eq('locale', locale).maybeSingle(),
    supabase
      .from('portfolio_items')
      .select('*, media:media_assets!portfolio_items_media_id_fkey(secure_url, url), poster:media_assets!portfolio_items_poster_media_id_fkey(secure_url, url)')
      .eq('collection_id', collection.id)
      .order('order_index'),
  ])

  if (!translation) return null

  type ItemRow = PortfolioItemRow & {
    media: { secure_url: string | null, url: string } | null
    poster: { secure_url: string | null, url: string } | null
  }

  return {
    path: `/${discipline}/${collection.slug}`,
    slug: collection.slug,
    category: collection.category,
    title: translation.title,
    summary: translation.summary,
    description: translation.description,
    credits: translation.credits,
    seoTitle: translation.seo_title,
    seoDescription: translation.seo_description,
    items: ((itemRows as unknown as ItemRow[]) ?? []).map(item => ({
      itemType: item.item_type,
      url: item.media ? (item.media.secure_url || item.media.url) : null,
      posterUrl: item.poster ? (item.poster.secure_url || item.poster.url) : null,
      externalUrl: item.external_url,
      caption: item.caption,
      altText: item.alt_text,
      duration: item.duration,
      aspectRatio: item.aspect_ratio,
      featured: item.featured,
    })),
  }
})
