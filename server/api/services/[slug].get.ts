import { getSupabaseClient } from '../../utils/supabase'
import type { Locale, ServiceRow } from '../../utils/supabase'
import { splitList } from '../../utils/text-list'

type ServiceWithCover = ServiceRow & { cover: { secure_url: string | null, url: string } | null }

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
  coverImageUrl: string | null
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
    .select('*, cover:media_assets!services_cover_media_id_fkey(secure_url, url)')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error || !service) return null

  const row = service as unknown as ServiceWithCover

  const [{ data: translation }, { data: faqs }] = await Promise.all([
    supabase.from('service_translations').select('*').eq('service_id', row.id).eq('locale', locale).maybeSingle(),
    supabase.from('service_faqs').select('question, answer').eq('service_id', row.id).eq('locale', locale).order('order_index'),
  ])

  if (!translation) return null

  return {
    path: `/services/${row.slug}`,
    slug: row.slug,
    category: row.category,
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
    showPrice: row.show_price,
    priceType: row.price_type,
    startingPrice: row.starting_price,
    currency: row.currency,
    faqs: faqs ?? [],
    coverImageUrl: row.cover ? (row.cover.secure_url || row.cover.url) : null,
  }
})
