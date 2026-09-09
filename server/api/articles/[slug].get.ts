import { getSupabaseClient } from '../../utils/supabase'
import type { ArticleCategory, Locale } from '../../utils/supabase'
import { renderRichText } from '../../utils/render-rich-text'

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
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .maybeSingle()

  if (error || !article) return null

  const { data: translation } = await supabase
    .from('article_translations')
    .select('*')
    .eq('article_id', article.id)
    .eq('locale', locale)
    .maybeSingle()

  if (!translation) return null

  return {
    path: `/insights/${article.slug}`,
    slug: article.slug,
    category: article.category,
    tags: article.tags,
    author: article.author,
    readingTime: article.reading_time,
    publishedAt: article.published_at,
    title: translation.title,
    excerpt: translation.excerpt,
    contentHtml: renderRichText(translation.content as unknown as Parameters<typeof renderRichText>[0]),
    seoTitle: translation.seo_title,
    seoDescription: translation.seo_description,
    canonicalUrl: article.canonical_url,
  }
})
