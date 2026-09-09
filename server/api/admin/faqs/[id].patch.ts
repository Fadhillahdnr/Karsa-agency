import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { FaqUpdate, FaqTranslationUpsert } from '../../../utils/supabase'
import { faqUpdateSchema } from '../../../validation/faq'

export default defineEventHandler(async (event) => {
  await requireAdmin(event, ['super_admin', 'content_editor'])

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const body = await readBody(event)
  const parsed = faqUpdateSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: { fieldErrors: parsed.error.flatten().fieldErrors } })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const input = parsed.data
  const update: FaqUpdate = {}

  if (input.category !== undefined) update.category = input.category || null
  if (input.relatedService !== undefined) update.related_service = input.relatedService
  if (input.orderIndex !== undefined) update.order_index = input.orderIndex
  if (input.featured !== undefined) update.featured = input.featured
  if (input.status !== undefined) update.status = input.status

  const { data: faq, error: updateError } = await supabase
    .from('faqs')
    .update(update)
    .eq('id', id)
    .select('*')
    .single()

  if (updateError || !faq) {
    throw createError({ statusCode: 404, statusMessage: 'FAQ not found' })
  }

  if (input.translations) {
    for (const locale of ['en', 'id'] as const) {
      const t = input.translations[locale]
      if (!t) continue

      const row: Partial<FaqTranslationUpsert> & { faq_id: string, locale: 'en' | 'id' } = { faq_id: id, locale }
      if (t.question !== undefined) row.question = t.question
      if (t.answer !== undefined) row.answer = t.answer

      await supabase.from('faq_translations').upsert(
        row as unknown as FaqTranslationUpsert,
        { onConflict: 'faq_id,locale' },
      )
    }
  }

  return faq
})
