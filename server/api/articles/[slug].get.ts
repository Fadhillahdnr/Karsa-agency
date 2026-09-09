import { getSupabaseClient } from '../../utils/supabase'
import type { ArticleCategory, ArticleRow, Locale } from '../../utils/supabase'
import { renderRichText } from '../../utils/render-rich-text'

type ArticleWithMedia = ArticleRow & {
  og_media: { secure_url: string | null, url: string } | null
  cover_media: { secure_url: string | null, url: string } | null
}

export type ArticleDetailApiItem = {
  path: string
  slug: string
  category: ArticleCategory | null
  tags: string[]
  author: string | null
  readingTime: number | null
  publishedAt: string | null
  title: string
  excerpt: string | null
  contentHtml: string
  seoTitle: string | null
  seoDescription: string | null
  canonicalUrl: string | null
  ogImageUrl: string | null
}

export default defineEventHandler(async (event): Promise<ArticleDetailApiItem | null> => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) return null

  const supabase = getSupabaseClient()
  if (!supabase) return null

  const query = getQuery(event)
  const locale: Locale = query.locale === 'id' ? 'id' : 'en'

  const { data: article, error } = await supabase
    .from('articles')
    .select('*, og_media:media_assets!articles_og_media_id_fkey(secure_url, url), cover_media:media_assets!articles_cover_media_id_fkey(secure_url, url)')
    .eq('slug', slug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .maybeSingle()

  if (error || !article) return null

  const row = article as unknown as ArticleWithMedia
  const ogImage = row.og_media ?? row.cover_media
  const ogImageUrl = ogImage ? (ogImage.secure_url || ogImage.url) : null

  const { data: translation } = await supabase
    .from('article_translations')
    .select('*')
    .eq('article_id', row.id)
    .eq('locale', locale)
    .maybeSingle()

  if (!translation) return null

  return {
    path: `/insights/${row.slug}`,
    slug: row.slug,
    category: row.category,
    tags: row.tags,
    author: row.author,
    readingTime: row.reading_time,
    publishedAt: row.published_at,
    title: translation.title,
    excerpt: translation.excerpt,
    contentHtml: renderRichText(translation.content as unknown as Parameters<typeof renderRichText>[0]),
    seoTitle: translation.seo_title,
    seoDescription: translation.seo_description,
    canonicalUrl: row.canonical_url,
    ogImageUrl,
  }
})
