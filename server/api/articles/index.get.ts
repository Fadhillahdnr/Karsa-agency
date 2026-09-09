import { getSupabaseClient } from '../../utils/supabase'
import type { ArticleCategory, Locale } from '../../utils/supabase'

export type ArticleApiItem = {
  path: string
  slug: string
  category: ArticleCategory | null
  tags: string[]
  featured: boolean
  author: string | null
  readingTime: number | null
  publishedAt: string | null
  title: string
  excerpt: string | null
}

type Row = {
  slug: string
  category: ArticleCategory | null
  tags: string[]
  featured: boolean
  author: string | null
  reading_time: number | null
  published_at: string | null
  article_translations: { locale: string, title: string, excerpt: string | null }[]
}

/** Published articles only, newest first. Optional ?category= and ?tag= filters. */
export default defineEventHandler(async (event): Promise<ArticleApiItem[]> => {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const query = getQuery(event)
  const locale: Locale = query.locale === 'id' ? 'id' : 'en'

  let builder = supabase
    .from('articles')
    .select('slug, category, tags, featured, author, reading_time, published_at, article_translations!inner(locale, title, excerpt)')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .eq('article_translations.locale', locale)
    .order('published_at', { ascending: false })

  if (typeof query.category === 'string') builder = builder.eq('category', query.category as ArticleCategory)
  if (typeof query.tag === 'string') builder = builder.contains('tags', [query.tag])

  const { data, error } = await builder
  if (error || !data) return []

  return (data as unknown as Row[]).map((row) => {
    const t = row.article_translations[0]
    return {
      path: `/insights/${row.slug}`,
      slug: row.slug,
      category: row.category,
      tags: row.tags,
      featured: row.featured,
      author: row.author,
      readingTime: row.reading_time,
      publishedAt: row.published_at,
      title: t?.title ?? row.slug,
      excerpt: t?.excerpt ?? null,
    }
  })
})
