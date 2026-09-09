import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { ArticleUpdate, ArticleTranslationUpsert } from '../../../utils/supabase'
import { articleUpdateSchema } from '../../../validation/article'
import { estimateReadingTime } from '../../../utils/reading-time'

export default defineEventHandler(async (event) => {
  const { user } = await requireAdmin(event, ['super_admin', 'content_editor'])

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const body = await readBody(event)
  const parsed = articleUpdateSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: { fieldErrors: parsed.error.flatten().fieldErrors } })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const input = parsed.data
  const update: ArticleUpdate = { updated_by: user.id }

  if (input.slug !== undefined) update.slug = input.slug
  if (input.coverMediaId !== undefined) update.cover_media_id = input.coverMediaId
  if (input.author !== undefined) update.author = input.author || null
  if (input.category !== undefined) update.category = input.category
  if (input.tags !== undefined) update.tags = input.tags
  if (input.featured !== undefined) update.featured = input.featured
  if (input.canonicalUrl !== undefined) update.canonical_url = input.canonicalUrl || null
  if (input.ogMediaId !== undefined) update.og_media_id = input.ogMediaId
  if (input.status !== undefined) {
    update.status = input.status
    if (input.status === 'published') update.published_at = new Date().toISOString()
  }
  if (input.publishedAt !== undefined) update.published_at = input.publishedAt
  if (input.readingTime !== undefined) {
    update.reading_time = input.readingTime ?? (input.translations?.en?.content ? estimateReadingTime(input.translations.en.content) : undefined)
  }

  const { data: article, error: updateError } = await supabase
    .from('articles')
    .update(update)
    .eq('id', id)
    .select('*')
    .single()

  if (updateError || !article) {
    if (updateError?.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'An article with this slug already exists' })
    }
    throw createError({ statusCode: 404, statusMessage: 'Article not found' })
  }

  if (input.translations) {
    for (const locale of ['en', 'id'] as const) {
      const t = input.translations[locale]
      if (!t) continue

      const row: Partial<ArticleTranslationUpsert> & { article_id: string, locale: 'en' | 'id' } = { article_id: id, locale }
      if (t.title !== undefined) row.title = t.title
      if (t.excerpt !== undefined) row.excerpt = t.excerpt || null
      if (t.content !== undefined) row.content = t.content
      if (t.seoTitle !== undefined) row.seo_title = t.seoTitle || null
      if (t.seoDescription !== undefined) row.seo_description = t.seoDescription || null

      await supabase.from('article_translations').upsert(
        row as unknown as ArticleTranslationUpsert,
        { onConflict: 'article_id,locale' },
      )
    }
  }

  return article
})
