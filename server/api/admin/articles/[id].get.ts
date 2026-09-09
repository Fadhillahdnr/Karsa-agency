import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { ArticleTranslationRow } from '../../../utils/supabase'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const [{ data: article, error }, { data: translations }] = await Promise.all([
    supabase.from('articles').select('*').eq('id', id).maybeSingle(),
    supabase.from('article_translations').select('*').eq('article_id', id),
  ])

  if (error || !article) {
    throw createError({ statusCode: 404, statusMessage: 'Article not found' })
  }

  function translationFor(locale: 'en' | 'id') {
    const t = (translations as ArticleTranslationRow[] | null)?.find(row => row.locale === locale)
    return {
      title: t?.title ?? '',
      excerpt: t?.excerpt ?? '',
      content: t?.content ?? {},
      seoTitle: t?.seo_title ?? '',
      seoDescription: t?.seo_description ?? '',
    }
  }

  return {
    ...article,
    translations: { en: translationFor('en'), id: translationFor('id') },
  }
})
