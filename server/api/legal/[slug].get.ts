import { getSupabaseClient } from '../../utils/supabase'
import type { Locale, LegalPageSlug } from '../../utils/supabase'
import { renderRichText } from '../../utils/render-rich-text'

export type LegalPageApiItem = {
  slug: LegalPageSlug
  title: string
  contentHtml: string
  seoDescription: string | null
  updatedAt: string
}

const VALID_SLUGS: LegalPageSlug[] = ['privacy', 'terms', 'terms-of-service']

export default defineEventHandler(async (event): Promise<LegalPageApiItem | null> => {
  const rawSlug = getRouterParam(event, 'slug')
  if (!rawSlug || !VALID_SLUGS.includes(rawSlug as LegalPageSlug)) return null
  const slug = rawSlug as LegalPageSlug

  const supabase = getSupabaseClient()
  if (!supabase) return null

  const query = getQuery(event)
  const locale: Locale = query.locale === 'id' ? 'id' : 'en'

  const { data: legalPage, error } = await supabase
    .from('legal_pages')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error || !legalPage) return null

  const { data: translation } = await supabase
    .from('legal_page_translations')
    .select('*')
    .eq('legal_page_id', legalPage.id)
    .eq('locale', locale)
    .maybeSingle()

  if (!translation) return null

  return {
    slug: legalPage.slug,
    title: translation.title,
    contentHtml: renderRichText(translation.content as unknown as Parameters<typeof renderRichText>[0]),
    seoDescription: translation.seo_description,
    updatedAt: legalPage.updated_at,
  }
})
