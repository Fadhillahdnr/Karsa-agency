import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import { faqSchema } from '../../../validation/faq'

export default defineEventHandler(async (event) => {
  await requireAdmin(event, ['super_admin', 'content_editor'])

  const body = await readBody(event)
  const parsed = faqSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: { fieldErrors: parsed.error.flatten().fieldErrors } })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const input = parsed.data

  const { data: faq, error: insertError } = await supabase
    .from('faqs')
    .insert({
      category: input.category || null,
      related_service: input.relatedService ?? null,
      order_index: input.orderIndex,
      featured: input.featured,
      status: input.status,
    })
    .select('*')
    .single()

  if (insertError || !faq) {
    throw createError({ statusCode: 500, statusMessage: 'Could not create FAQ' })
  }

  const translationRows = (['en', 'id'] as const).map(locale => ({
    faq_id: faq.id,
    locale,
    question: input.translations[locale].question,
    answer: input.translations[locale].answer,
  }))

  await supabase.from('faq_translations').insert(translationRows)

  setResponseStatus(event, 201)
  return faq
})
