import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { LegalPageTranslationRow } from '../../../utils/supabase'

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

  const [{ data: legalPage, error }, { data: translations }] = await Promise.all([
    supabase.from('legal_pages').select('*').eq('id', id).maybeSingle(),
    supabase.from('legal_page_translations').select('*').eq('legal_page_id', id),
  ])

  if (error || !legalPage) {
    throw createError({ statusCode: 404, statusMessage: 'Legal page not found' })
  }

  function translationFor(locale: 'en' | 'id') {
    const t = (translations as LegalPageTranslationRow[] | null)?.find(row => row.locale === locale)
    return {
      title: t?.title ?? '',
      content: t?.content ?? {},
      seoDescription: t?.seo_description ?? '',
    }
  }

  return {
    ...legalPage,
    translations: { en: translationFor('en'), id: translationFor('id') },
  }
})
