import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import { articleSchema } from '../../../validation/article'
import { estimateReadingTime } from '../../../utils/reading-time'

export default defineEventHandler(async (event) => {
  const { user } = await requireAdmin(event, ['super_admin', 'content_editor'])

  const body = await readBody(event)
  const parsed = articleSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: { fieldErrors: parsed.error.flatten().fieldErrors } })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const input = parsed.data
  const readingTime = input.readingTime ?? estimateReadingTime(input.translations.en.content)

  const { data: article, error: insertError } = await supabase
    .from('articles')
    .insert({
      slug: input.slug,
      cover_media_id: input.coverMediaId ?? null,
      author: input.author || null,
      category: input.category ?? null,
      tags: input.tags,
      featured: input.featured,
      status: input.status,
      published_at: input.status === 'published' ? new Date().toISOString() : (input.publishedAt ?? null),
      reading_time: readingTime,
      canonical_url: input.canonicalUrl || null,
      og_media_id: input.ogMediaId ?? null,
      created_by: user.id,
      updated_by: user.id,
    })
    .select('*')
    .single()

  if (insertError || !article) {
    if (insertError?.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'An article with this slug already exists' })
    }
    throw createError({ statusCode: 500, statusMessage: 'Could not create article' })
  }

  const translationRows = (['en', 'id'] as const).map(locale => ({
    article_id: article.id,
    locale,
    title: input.translations[locale].title,
    excerpt: input.translations[locale].excerpt || null,
    content: input.translations[locale].content,
    seo_title: input.translations[locale].seoTitle || null,
    seo_description: input.translations[locale].seoDescription || null,
  }))

  await supabase.from('article_translations').insert(translationRows)

  setResponseStatus(event, 201)
  return article
})
