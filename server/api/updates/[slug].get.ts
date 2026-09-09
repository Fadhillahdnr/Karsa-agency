import { getSupabaseClient } from '../../utils/supabase'
import type { CompanyUpdateRow, Locale } from '../../utils/supabase'
import { renderRichText } from '../../utils/render-rich-text'

type CompanyUpdateWithCover = CompanyUpdateRow & { cover: { secure_url: string | null, url: string } | null }

export type CompanyUpdateDetailApiItem = {
  path: string
  slug: string
  publishedAt: string | null
  title: string
  excerpt: string | null
  contentHtml: string
  seoTitle: string | null
  seoDescription: string | null
  ogImageUrl: string | null
}

export default defineEventHandler(async (event): Promise<CompanyUpdateDetailApiItem | null> => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) return null

  const supabase = getSupabaseClient()
  if (!supabase) return null

  const query = getQuery(event)
  const locale: Locale = query.locale === 'id' ? 'id' : 'en'

  const { data: update, error } = await supabase
    .from('company_updates')
    .select('*, cover:media_assets!company_updates_cover_media_id_fkey(secure_url, url)')
    .eq('slug', slug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .maybeSingle()

  if (error || !update) return null

  const row = update as unknown as CompanyUpdateWithCover

  const { data: translation } = await supabase
    .from('company_update_translations')
    .select('*')
    .eq('update_id', row.id)
    .eq('locale', locale)
    .maybeSingle()

  if (!translation) return null

  return {
    path: `/updates/${row.slug}`,
    slug: row.slug,
    publishedAt: row.published_at,
    title: translation.title,
    excerpt: translation.excerpt,
    contentHtml: renderRichText(translation.content as unknown as Parameters<typeof renderRichText>[0]),
    seoTitle: translation.seo_title,
    seoDescription: translation.seo_description,
    ogImageUrl: row.cover ? (row.cover.secure_url || row.cover.url) : null,
  }
})
