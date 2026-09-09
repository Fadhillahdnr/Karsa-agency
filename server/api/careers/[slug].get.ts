import { getSupabaseClient } from '../../utils/supabase'
import type { Locale } from '../../utils/supabase'

export type CareerDetailApiItem = {
  path: string
  slug: string
  department: string | null
  employmentType: string | null
  location: string | null
  workMode: string | null
  applicationUrl: string | null
  applicationEmail: string | null
  publishedAt: string | null
  closingAt: string | null
  title: string
  summary: string | null
  responsibilities: string[]
  requirements: string[]
  niceToHave: string[]
  seoTitle: string | null
  seoDescription: string | null
}

export default defineEventHandler(async (event): Promise<CareerDetailApiItem | null> => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) return null

  const supabase = getSupabaseClient()
  if (!supabase) return null

  const query = getQuery(event)
  const locale: Locale = query.locale === 'id' ? 'id' : 'en'
  const now = new Date().toISOString()

  const { data: career, error } = await supabase
    .from('careers')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .lte('published_at', now)
    .or(`closing_at.is.null,closing_at.gte.${now}`)
    .maybeSingle()

  if (error || !career) return null

  const { data: translation } = await supabase
    .from('career_translations')
    .select('*')
    .eq('career_id', career.id)
    .eq('locale', locale)
    .maybeSingle()

  if (!translation) return null

  return {
    path: `/careers/${career.slug}`,
    slug: career.slug,
    department: career.department,
    employmentType: career.employment_type,
    location: career.location,
    workMode: career.work_mode,
    applicationUrl: career.application_url,
    applicationEmail: career.application_email,
    publishedAt: career.published_at,
    closingAt: career.closing_at,
    title: translation.title,
    summary: translation.summary,
    responsibilities: translation.responsibilities,
    requirements: translation.requirements,
    niceToHave: translation.nice_to_have,
    seoTitle: translation.seo_title,
    seoDescription: translation.seo_description,
  }
})
