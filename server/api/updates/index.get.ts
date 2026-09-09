import { getSupabaseClient } from '../../utils/supabase'
import type { Locale } from '../../utils/supabase'

export type CompanyUpdateApiItem = {
  path: string
  slug: string
  publishedAt: string | null
  title: string
  excerpt: string | null
}

type Row = {
  slug: string
  published_at: string | null
  company_update_translations: { locale: string, title: string, excerpt: string | null }[]
}

export default defineEventHandler(async (event): Promise<CompanyUpdateApiItem[]> => {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const query = getQuery(event)
  const locale: Locale = query.locale === 'id' ? 'id' : 'en'

  const { data, error } = await supabase
    .from('company_updates')
    .select('slug, published_at, company_update_translations!inner(locale, title, excerpt)')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .eq('company_update_translations.locale', locale)
    .order('published_at', { ascending: false })

  if (error || !data) return []

  return (data as unknown as Row[]).map((row) => {
    const t = row.company_update_translations[0]
    return {
      path: `/updates/${row.slug}`,
      slug: row.slug,
      publishedAt: row.published_at,
      title: t?.title ?? row.slug,
      excerpt: t?.excerpt ?? null,
    }
  })
})
