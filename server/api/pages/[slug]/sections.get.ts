import { getSupabaseClient } from '../../../utils/supabase'
import type { PageSectionComponentType } from '../../../utils/supabase'

export type PublicPageSection = {
  sectionKey: string
  componentType: PageSectionComponentType
  themeVariant: string | null
}

/** Enabled sections, in order, for a published page — used to drive dynamic homepage rendering. */
export default defineEventHandler(async (event): Promise<PublicPageSection[]> => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) return []

  const supabase = getSupabaseClient()
  if (!supabase) return []

  const { data: page } = await supabase
    .from('pages')
    .select('id')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (!page) return []

  const { data, error } = await supabase
    .from('page_sections')
    .select('section_key, component_type, theme_variant')
    .eq('page_id', page.id)
    .eq('enabled', true)
    .order('order_index', { ascending: true })

  if (error || !data) return []

  return data.map(row => ({
    sectionKey: row.section_key,
    componentType: row.component_type,
    themeVariant: row.theme_variant,
  }))
})
