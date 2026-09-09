import { getSupabaseClient } from '../../utils/supabase'
import type { Locale } from '../../utils/supabase'

export type CareerApiItem = {
  path: string
  slug: string
  department: string | null
  employmentType: string | null
  location: string | null
  workMode: string | null
  publishedAt: string | null
  closingAt: string | null
  title: string
  summary: string | null
}

type Row = {
  slug: string
  department: string | null
  employment_type: string | null
  location: string | null
  work_mode: string | null
  published_at: string | null
  closing_at: string | null
  career_translations: { locale: string, title: string, summary: string | null }[]
}

// Open roles only: published, past publish date, and not past its closing
// date (or no closing date set at all).
export default defineEventHandler(async (event): Promise<CareerApiItem[]> => {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const query = getQuery(event)
  const locale: Locale = query.locale === 'id' ? 'id' : 'en'
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('careers')
    .select('slug, department, employment_type, location, work_mode, published_at, closing_at, career_translations!inner(locale, title, summary)')
    .eq('status', 'published')
    .lte('published_at', now)
    .or(`closing_at.is.null,closing_at.gte.${now}`)
    .eq('career_translations.locale', locale)
    .order('order_index', { ascending: true })

  if (error || !data) return []

  return (data as unknown as Row[]).map((row) => {
    const t = row.career_translations[0]
    return {
      path: `/careers/${row.slug}`,
      slug: row.slug,
      department: row.department,
      employmentType: row.employment_type,
      location: row.location,
      workMode: row.work_mode,
      publishedAt: row.published_at,
      closingAt: row.closing_at,
      title: t?.title ?? row.slug,
      summary: t?.summary ?? null,
    }
  })
})
