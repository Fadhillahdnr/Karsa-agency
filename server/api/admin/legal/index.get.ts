import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { LegalPageRow } from '../../../utils/supabase'

type ListRow = LegalPageRow & { legal_page_translations: { locale: string, title: string }[] }

// Legal pages are a fixed 3-slug set seeded by migration — this list is
// edit-only, no create/delete (see server/validation/legal-page.ts).
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const { data, error } = await supabase
    .from('legal_pages')
    .select('*, legal_page_translations(locale, title)')
    .order('slug', { ascending: true })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Could not load legal pages' })
  }

  return (data as unknown as ListRow[]).map((row) => {
    const { legal_page_translations, ...base } = row
    const enTitle = legal_page_translations.find(t => t.locale === 'en')?.title
    const idTitle = legal_page_translations.find(t => t.locale === 'id')?.title
    return { ...base, title: enTitle || idTitle || base.slug }
  })
})
