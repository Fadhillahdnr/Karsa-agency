import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { FaqTranslationRow } from '../../../utils/supabase'

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

  const [{ data: faq, error }, { data: translations }] = await Promise.all([
    supabase.from('faqs').select('*').eq('id', id).maybeSingle(),
    supabase.from('faq_translations').select('*').eq('faq_id', id),
  ])

  if (error || !faq) {
    throw createError({ statusCode: 404, statusMessage: 'FAQ not found' })
  }

  function translationFor(locale: 'en' | 'id') {
    const t = (translations as FaqTranslationRow[] | null)?.find(row => row.locale === locale)
    return { question: t?.question ?? '', answer: t?.answer ?? '' }
  }

  return {
    ...faq,
    translations: { en: translationFor('en'), id: translationFor('id') },
  }
})
