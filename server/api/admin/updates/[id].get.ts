import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { CompanyUpdateTranslationRow } from '../../../utils/supabase'

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

  const [{ data: update, error }, { data: translations }] = await Promise.all([
    supabase.from('company_updates').select('*').eq('id', id).maybeSingle(),
    supabase.from('company_update_translations').select('*').eq('update_id', id),
  ])

  if (error || !update) {
    throw createError({ statusCode: 404, statusMessage: 'Update not found' })
  }

  function translationFor(locale: 'en' | 'id') {
    const t = (translations as CompanyUpdateTranslationRow[] | null)?.find(row => row.locale === locale)
    return {
      title: t?.title ?? '',
      excerpt: t?.excerpt ?? '',
      content: t?.content ?? {},
      seoTitle: t?.seo_title ?? '',
      seoDescription: t?.seo_description ?? '',
    }
  }

  return {
    ...update,
    translations: { en: translationFor('en'), id: translationFor('id') },
  }
})
