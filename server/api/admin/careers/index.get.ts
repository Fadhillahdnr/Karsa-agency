import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { CareerRow } from '../../../utils/supabase'

type ListRow = CareerRow & { career_translations: { locale: string, title: string }[] }

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const { data, error } = await supabase
    .from('careers')
    .select('*, career_translations(locale, title)')
    .order('order_index', { ascending: true })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Could not load careers' })
  }

  return (data as unknown as ListRow[]).map((row) => {
    const { career_translations, ...base } = row
    const enTitle = career_translations.find(t => t.locale === 'en')?.title
    const idTitle = career_translations.find(t => t.locale === 'id')?.title
    return { ...base, title: enTitle || idTitle || base.slug }
  })
})
