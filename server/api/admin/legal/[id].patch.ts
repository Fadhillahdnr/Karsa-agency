import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { LegalPageTranslationUpsert } from '../../../utils/supabase'
import { legalPageUpdateSchema } from '../../../validation/legal-page'

export default defineEventHandler(async (event) => {
  const { user } = await requireAdmin(event, ['super_admin', 'content_editor'])

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const body = await readBody(event)
  const parsed = legalPageUpdateSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: { fieldErrors: parsed.error.flatten().fieldErrors } })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const input = parsed.data

  const { data: legalPage, error: updateError } = await supabase
    .from('legal_pages')
    .update({ updated_by: user.id })
    .eq('id', id)
    .select('*')
    .single()

  if (updateError || !legalPage) {
    throw createError({ statusCode: 404, statusMessage: 'Legal page not found' })
  }

  for (const locale of ['en', 'id'] as const) {
    const t = input.translations[locale]
    if (!t) continue

    const row: Partial<LegalPageTranslationUpsert> & { legal_page_id: string, locale: 'en' | 'id' } = { legal_page_id: id, locale }
    if (t.title !== undefined) row.title = t.title
    if (t.content !== undefined) row.content = t.content
    if (t.seoDescription !== undefined) row.seo_description = t.seoDescription || null

    await supabase.from('legal_page_translations').upsert(
      row as unknown as LegalPageTranslationUpsert,
      { onConflict: 'legal_page_id,locale' },
    )
  }

  return legalPage
})
