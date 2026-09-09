import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { CompanyUpdateUpdate, CompanyUpdateTranslationUpsert } from '../../../utils/supabase'
import { companyUpdateUpdateSchema } from '../../../validation/company-update'

export default defineEventHandler(async (event) => {
  const { user } = await requireAdmin(event, ['super_admin', 'content_editor'])

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const body = await readBody(event)
  const parsed = companyUpdateUpdateSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: { fieldErrors: parsed.error.flatten().fieldErrors } })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const input = parsed.data
  const update: CompanyUpdateUpdate = { updated_by: user.id }

  if (input.slug !== undefined) update.slug = input.slug
  if (input.coverMediaId !== undefined) update.cover_media_id = input.coverMediaId
  if (input.status !== undefined) {
    update.status = input.status
    if (input.status === 'published') update.published_at = new Date().toISOString()
  }
  if (input.publishedAt !== undefined) update.published_at = input.publishedAt

  const { data: row, error: updateError } = await supabase
    .from('company_updates')
    .update(update)
    .eq('id', id)
    .select('*')
    .single()

  if (updateError || !row) {
    if (updateError?.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'An update with this slug already exists' })
    }
    throw createError({ statusCode: 404, statusMessage: 'Update not found' })
  }

  if (input.translations) {
    for (const locale of ['en', 'id'] as const) {
      const t = input.translations[locale]
      if (!t) continue

      const translationRow: Partial<CompanyUpdateTranslationUpsert> & { update_id: string, locale: 'en' | 'id' } = { update_id: id, locale }
      if (t.title !== undefined) translationRow.title = t.title
      if (t.excerpt !== undefined) translationRow.excerpt = t.excerpt || null
      if (t.content !== undefined) translationRow.content = t.content
      if (t.seoTitle !== undefined) translationRow.seo_title = t.seoTitle || null
      if (t.seoDescription !== undefined) translationRow.seo_description = t.seoDescription || null

      await supabase.from('company_update_translations').upsert(
        translationRow as unknown as CompanyUpdateTranslationUpsert,
        { onConflict: 'update_id,locale' },
      )
    }
  }

  return row
})
