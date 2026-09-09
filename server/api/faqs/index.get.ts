import { getSupabaseClient } from '../../utils/supabase'
import type { Locale } from '../../utils/supabase'

export type FaqApiItem = {
  category: string | null
  featured: boolean
  question: string
  answer: string
}

type Row = {
  category: string | null
  featured: boolean
  faq_translations: { locale: string, question: string, answer: string }[]
}

export default defineEventHandler(async (event): Promise<FaqApiItem[]> => {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const query = getQuery(event)
  const locale: Locale = query.locale === 'id' ? 'id' : 'en'

  const { data, error } = await supabase
    .from('faqs')
    .select('category, featured, faq_translations!inner(locale, question, answer)')
    .eq('status', 'published')
    .eq('faq_translations.locale', locale)
    .order('order_index', { ascending: true })

  if (error || !data) return []

  return (data as unknown as Row[]).map((row) => {
    const t = row.faq_translations[0]
    return {
      category: row.category,
      featured: row.featured,
      question: t?.question ?? '',
      answer: t?.answer ?? '',
    }
  })
})
