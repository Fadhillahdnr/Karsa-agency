import { getSupabaseClient } from '../../utils/supabase'
import type { Locale } from '../../utils/supabase'

export type PackageApiItem = {
  slug: string
  category: string
  priceType: string
  price: number | null
  currency: string
  badge: string | null
  featured: boolean
  title: string
  summary: string | null
  priceNote: string | null
  recommendedFor: string | null
  durationNote: string | null
  revisionNote: string | null
  ctaLabel: string | null
  items: { label: string, description: string | null, isHighlight: boolean }[]
}

/** Published packages only. Empty until real, owner-approved pricing exists — never seeded with placeholders (§13). */
export default defineEventHandler(async (event): Promise<PackageApiItem[]> => {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const query = getQuery(event)
  const locale: Locale = query.locale === 'id' ? 'id' : 'en'

  const { data, error } = await supabase
    .from('packages')
    .select('id, slug, category, price_type, price, currency, badge, featured, order_index, package_translations!inner(locale, title, summary, price_note, recommended_for, duration_note, revision_note, cta_label), package_items(label, description, is_highlight, order_index)')
    .eq('status', 'published')
    .eq('package_translations.locale', locale)
    .order('category', { ascending: true })
    .order('order_index', { ascending: true })

  if (error || !data) return []

  type Row = {
    slug: string
    category: string
    price_type: string
    price: number | null
    currency: string
    badge: string | null
    featured: boolean
    package_translations: { locale: string, title: string, summary: string | null, price_note: string | null, recommended_for: string | null, duration_note: string | null, revision_note: string | null, cta_label: string | null }[]
    package_items: { label: string, description: string | null, is_highlight: boolean, order_index: number }[]
  }

  return (data as unknown as Row[]).map((pkg) => {
    const t = pkg.package_translations[0]
    const items = [...pkg.package_items].sort((a, b) => a.order_index - b.order_index)
    return {
      slug: pkg.slug,
      category: pkg.category,
      priceType: pkg.price_type,
      price: pkg.price,
      currency: pkg.currency,
      badge: pkg.badge,
      featured: pkg.featured,
      title: t?.title ?? pkg.slug,
      summary: t?.summary ?? null,
      priceNote: t?.price_note ?? null,
      recommendedFor: t?.recommended_for ?? null,
      durationNote: t?.duration_note ?? null,
      revisionNote: t?.revision_note ?? null,
      ctaLabel: t?.cta_label ?? null,
      items: items.map(item => ({ label: item.label, description: item.description, isHighlight: item.is_highlight })),
    }
  })
})
