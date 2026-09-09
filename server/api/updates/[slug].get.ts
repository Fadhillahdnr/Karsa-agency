import { getSupabaseClient } from '../../utils/supabase'
import type { Locale } from '../../utils/supabase'
import { renderRichText } from '../../utils/render-rich-text'

export type CompanyUpdateDetailApiItem = {
  path: string
  slug: string
  publishedAt: string | null
  title: string
  excerpt: string | null
  contentHtml: string
  seoTitle: string | null
  seoDescription: string | null
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
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .maybeSingle()

  if (error || !update) return null

  const { data: translation } = await supabase
    .from('company_update_translations')
    .select('*')
    .eq('update_id', update.id)
    .eq('locale', locale)
    .maybeSingle()

  if (!translation) return null

  return {
    path: `/updates/${update.slug}`,
    slug: update.slug,
    publishedAt: update.published_at,
    title: translation.title,
    excerpt: translation.excerpt,
    contentHtml: renderRichText(translation.content as unknown as Parameters<typeof renderRichText>[0]),
    seoTitle: translation.seo_title,
    seoDescription: translation.seo_description,
  }
})
