import { getSupabaseClient } from '../../utils/supabase'
import type { Locale } from '../../utils/supabase'
import { splitList } from '../../utils/text-list'

export type ServiceDetailApiItem = {
  path: string
  slug: string
  category: string
  title: string
  eyebrow: string | null
  summary: string | null
  intro: string[]
  whoItsFor: string[]
  problems: string[]
  deliverables: string[]
  included: string[]
  excluded: string[]
  process: string | null
  ctaLabel: string | null
  seoTitle: string | null
  seoDescription: string | null
  showPrice: boolean
  priceType: string | null
  startingPrice: number | null
  currency: string
  faqs: { question: string, answer: string }[]
}

export default defineEventHandler(async (event): Promise<ServiceDetailApiItem | null> => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) return null

  const supabase = getSupabaseClient()
  if (!supabase) return null

  const query = getQuery(event)
  const locale: Locale = query.locale === 'id' ? 'id' : 'en'

  const { data: service, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error || !service) return null

  const [{ data: translation }, { data: faqs }] = await Promise.all([
    supabase.from('service_translations').select('*').eq('service_id', service.id).eq('locale', locale).maybeSingle(),
    supabase.from('service_faqs').select('question, answer').eq('service_id', service.id).eq('locale', locale).order('order_index'),
  ])

  if (!translation) return null

  return {
    path: `/services/${service.slug}`,
    slug: service.slug,
    category: service.category,
    title: translation.title,
    eyebrow: translation.eyebrow,
    summary: translation.summary,
    intro: splitList(translation.intro),
    whoItsFor: splitList(translation.who_its_for),
    problems: splitList(translation.problems),
    deliverables: splitList(translation.deliverables),
    included: splitList(translation.included),
    excluded: splitList(translation.excluded),
    process: translation.process,
    ctaLabel: translation.cta_label,
    seoTitle: translation.seo_title,
    seoDescription: translation.seo_description,
    showPrice: service.show_price,
    priceType: service.price_type,
    startingPrice: service.starting_price,
    currency: service.currency,
    faqs: faqs ?? [],
  }
})
