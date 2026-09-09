import { getSupabaseClient } from '../../utils/supabase'
import type { Locale } from '../../utils/supabase'

export type ServiceApiItem = {
  path: string
  slug: string
  category: string
  featured: boolean
  order: number
  title: string
  eyebrow: string | null
  summary: string | null
}

/**
 * Published services only, DB-driven (see supabase/migrations/0008_create_services.sql
 * and scripts/seed-services.mjs) — replaces content/services/*.md as the
 * production source per master prompt §59.
 */
export default defineEventHandler(async (event): Promise<ServiceApiItem[]> => {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const query = getQuery(event)
  const locale: Locale = query.locale === 'id' ? 'id' : 'en'

  const { data, error } = await supabase
    .from('services')
    .select('slug, category, featured, order_index, service_translations!inner(locale, title, eyebrow, summary)')
    .eq('status', 'published')
    .eq('service_translations.locale', locale)
    .order('category', { ascending: true })
    .order('order_index', { ascending: true })

  if (error || !data) return []

  type Row = { slug: string, category: string, featured: boolean, order_index: number, service_translations: { locale: string, title: string, eyebrow: string | null, summary: string | null }[] }

  return (data as unknown as Row[]).map((service) => {
    const t = service.service_translations[0]
    return {
      path: `/services/${service.slug}`,
      slug: service.slug,
      category: service.category,
      featured: service.featured,
      order: service.order_index,
      title: t?.title ?? service.slug,
      eyebrow: t?.eyebrow ?? null,
      summary: t?.summary ?? null,
    }
  })
})
