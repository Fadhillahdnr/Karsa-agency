import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import { splitList } from '../../../utils/text-list'
import type { ServiceTranslationRow, ServiceFaqRow } from '../../../utils/supabase'

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

  const [{ data: service, error: serviceError }, { data: translations }, { data: faqs }] = await Promise.all([
    supabase.from('services').select('*').eq('id', id).maybeSingle(),
    supabase.from('service_translations').select('*').eq('service_id', id),
    supabase.from('service_faqs').select('*').eq('service_id', id).order('order_index'),
  ])

  if (serviceError || !service) {
    throw createError({ statusCode: 404, statusMessage: 'Service not found' })
  }

  function translationFor(locale: 'en' | 'id') {
    const t = (translations as ServiceTranslationRow[] | null)?.find(row => row.locale === locale)
    return {
      title: t?.title ?? '',
      shortTitle: t?.short_title ?? '',
      eyebrow: t?.eyebrow ?? '',
      summary: t?.summary ?? '',
      intro: splitList(t?.intro ?? null),
      whoItsFor: splitList(t?.who_its_for ?? null),
      problems: splitList(t?.problems ?? null),
      deliverables: splitList(t?.deliverables ?? null),
      included: splitList(t?.included ?? null),
      excluded: splitList(t?.excluded ?? null),
      process: t?.process ?? '',
      ctaLabel: t?.cta_label ?? '',
      seoTitle: t?.seo_title ?? '',
      seoDescription: t?.seo_description ?? '',
    }
  }

  function faqsFor(locale: 'en' | 'id') {
    return ((faqs as ServiceFaqRow[] | null) ?? [])
      .filter(faq => faq.locale === locale)
      .map(faq => ({ question: faq.question, answer: faq.answer }))
  }

  return {
    ...service,
    translations: { en: translationFor('en'), id: translationFor('id') },
    faqs: { en: faqsFor('en'), id: faqsFor('id') },
  }
})
