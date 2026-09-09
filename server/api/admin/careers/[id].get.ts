import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { CareerTranslationRow } from '../../../utils/supabase'

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

  const [{ data: career, error }, { data: translations }] = await Promise.all([
    supabase.from('careers').select('*').eq('id', id).maybeSingle(),
    supabase.from('career_translations').select('*').eq('career_id', id),
  ])

  if (error || !career) {
    throw createError({ statusCode: 404, statusMessage: 'Career listing not found' })
  }

  function translationFor(locale: 'en' | 'id') {
    const t = (translations as CareerTranslationRow[] | null)?.find(row => row.locale === locale)
    return {
      title: t?.title ?? '',
      summary: t?.summary ?? '',
      responsibilities: t?.responsibilities ?? [],
      requirements: t?.requirements ?? [],
      niceToHave: t?.nice_to_have ?? [],
      seoTitle: t?.seo_title ?? '',
      seoDescription: t?.seo_description ?? '',
    }
  }

  return {
    ...career,
    translations: { en: translationFor('en'), id: translationFor('id') },
  }
})
