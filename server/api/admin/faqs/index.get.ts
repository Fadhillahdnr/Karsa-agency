import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { FaqRow } from '../../../utils/supabase'

type ListRow = FaqRow & { faq_translations: { locale: string, question: string }[] }

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const { data, error } = await supabase
    .from('faqs')
    .select('*, faq_translations(locale, question)')
    .order('order_index', { ascending: true })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Could not load FAQs' })
  }

  return (data as unknown as ListRow[]).map((row) => {
    const { faq_translations, ...base } = row
    const enQ = faq_translations.find(t => t.locale === 'en')?.question
    const idQ = faq_translations.find(t => t.locale === 'id')?.question
    return { ...base, question: enQ || idQ || '(no question yet)' }
  })
})
