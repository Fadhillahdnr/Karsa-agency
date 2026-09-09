import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { CareerUpdate, CareerTranslationUpsert } from '../../../utils/supabase'
import { careerUpdateSchema } from '../../../validation/career'

export default defineEventHandler(async (event) => {
  const { user } = await requireAdmin(event, ['super_admin', 'content_editor'])

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const body = await readBody(event)
  const parsed = careerUpdateSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: { fieldErrors: parsed.error.flatten().fieldErrors } })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const input = parsed.data
  const update: CareerUpdate = { updated_by: user.id }

  if (input.slug !== undefined) update.slug = input.slug
  if (input.department !== undefined) update.department = input.department || null
  if (input.employmentType !== undefined) update.employment_type = input.employmentType || null
  if (input.location !== undefined) update.location = input.location || null
  if (input.workMode !== undefined) update.work_mode = input.workMode || null
  if (input.applicationUrl !== undefined) update.application_url = input.applicationUrl || null
  if (input.applicationEmail !== undefined) update.application_email = input.applicationEmail || null
  if (input.orderIndex !== undefined) update.order_index = input.orderIndex
  if (input.closingAt !== undefined) update.closing_at = input.closingAt
  if (input.status !== undefined) {
    update.status = input.status
    if (input.status === 'published') update.published_at = new Date().toISOString()
  }
  if (input.publishedAt !== undefined) update.published_at = input.publishedAt

  const { data: career, error: updateError } = await supabase
    .from('careers')
    .update(update)
    .eq('id', id)
    .select('*')
    .single()

  if (updateError || !career) {
    if (updateError?.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'A career listing with this slug already exists' })
    }
    throw createError({ statusCode: 404, statusMessage: 'Career listing not found' })
  }

  if (input.translations) {
    for (const locale of ['en', 'id'] as const) {
      const t = input.translations[locale]
      if (!t) continue

      const row: Partial<CareerTranslationUpsert> & { career_id: string, locale: 'en' | 'id' } = { career_id: id, locale }
      if (t.title !== undefined) row.title = t.title
      if (t.summary !== undefined) row.summary = t.summary || null
      if (t.responsibilities !== undefined) row.responsibilities = t.responsibilities
      if (t.requirements !== undefined) row.requirements = t.requirements
      if (t.niceToHave !== undefined) row.nice_to_have = t.niceToHave
      if (t.seoTitle !== undefined) row.seo_title = t.seoTitle || null
      if (t.seoDescription !== undefined) row.seo_description = t.seoDescription || null

      await supabase.from('career_translations').upsert(
        row as unknown as CareerTranslationUpsert,
        { onConflict: 'career_id,locale' },
      )
    }
  }

  return career
})
