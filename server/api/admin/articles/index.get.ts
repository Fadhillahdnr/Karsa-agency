import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { ArticleRow } from '../../../utils/supabase'

type ListRow = ArticleRow & { article_translations: { locale: string, title: string }[] }

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const { data, error } = await supabase
    .from('articles')
    .select('*, article_translations(locale, title)')
    .order('created_at', { ascending: false })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Could not load articles' })
  }

  return (data as unknown as ListRow[]).map((row) => {
    const { article_translations, ...base } = row
    const enTitle = article_translations.find(t => t.locale === 'en')?.title
    const idTitle = article_translations.find(t => t.locale === 'id')?.title
    return { ...base, title: enTitle || idTitle || base.slug }
  })
})
