import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { ServiceUpdate, ServiceTranslationUpsert } from '../../../utils/supabase'
import { serviceUpdateSchema } from '../../../validation/service'
import { joinList } from '../../../utils/text-list'

export default defineEventHandler(async (event) => {
  const { user } = await requireAdmin(event, ['super_admin', 'content_editor'])

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const body = await readBody(event)
  const parsed = serviceUpdateSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: { fieldErrors: parsed.error.flatten().fieldErrors } })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const input = parsed.data
  const baseUpdate: ServiceUpdate = { updated_by: user.id }

  if (input.slug !== undefined) baseUpdate.slug = input.slug
  if (input.category !== undefined) baseUpdate.category = input.category
  if (input.parentId !== undefined) baseUpdate.parent_id = input.parentId
  if (input.coverMediaId !== undefined) baseUpdate.cover_media_id = input.coverMediaId
  if (input.featured !== undefined) baseUpdate.featured = input.featured
  if (input.showPrice !== undefined) baseUpdate.show_price = input.showPrice
  if (input.priceType !== undefined) baseUpdate.price_type = input.priceType
  if (input.startingPrice !== undefined) baseUpdate.starting_price = input.startingPrice
  if (input.currency !== undefined) baseUpdate.currency = input.currency
  if (input.orderIndex !== undefined) baseUpdate.order_index = input.orderIndex
  if (input.status !== undefined) {
    baseUpdate.status = input.status
    if (input.status === 'published') baseUpdate.published_at = new Date().toISOString()
  }
  if (input.publishedAt !== undefined) baseUpdate.published_at = input.publishedAt

  const { data: service, error: updateError } = await supabase
    .from('services')
    .update(baseUpdate)
    .eq('id', id)
    .select('*')
    .single()

  if (updateError || !service) {
    if (updateError?.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'A service with this slug already exists' })
    }
    throw createError({ statusCode: 404, statusMessage: 'Service not found' })
  }

  if (input.translations) {
    for (const locale of ['en', 'id'] as const) {
      const t = input.translations[locale]
      if (!t) continue

      const row: Partial<ServiceTranslationUpsert> & { service_id: string, locale: 'en' | 'id' } = { service_id: id, locale }
      if (t.title !== undefined) row.title = t.title
      if (t.shortTitle !== undefined) row.short_title = t.shortTitle || null
      if (t.eyebrow !== undefined) row.eyebrow = t.eyebrow || null
      if (t.summary !== undefined) row.summary = t.summary || null
      if (t.intro !== undefined) row.intro = joinList(t.intro)
      if (t.whoItsFor !== undefined) row.who_its_for = joinList(t.whoItsFor)
      if (t.problems !== undefined) row.problems = joinList(t.problems)
      if (t.deliverables !== undefined) row.deliverables = joinList(t.deliverables)
      if (t.included !== undefined) row.included = joinList(t.included)
      if (t.excluded !== undefined) row.excluded = joinList(t.excluded)
      if (t.process !== undefined) row.process = t.process || null
      if (t.ctaLabel !== undefined) row.cta_label = t.ctaLabel || null
      if (t.seoTitle !== undefined) row.seo_title = t.seoTitle || null
      if (t.seoDescription !== undefined) row.seo_description = t.seoDescription || null

      // Translation rows are created alongside the service at POST time, so
      // this is always an update in practice — upsert only as a safety net.
      // Cast: this row is a partial patch of columns, sent via upsert whose
      // ON CONFLICT DO UPDATE only touches the columns present here — the
      // strict Insert type (which requires `title`) doesn't fit a partial
      // update, but at runtime the target row always already exists (created
      // alongside the service at POST time), so absent columns are preserved.
      await supabase.from('service_translations').upsert(row as unknown as ServiceTranslationUpsert, { onConflict: 'service_id,locale' })
    }
  }

  if (input.faqs) {
    for (const locale of ['en', 'id'] as const) {
      const faqs = input.faqs[locale]
      if (faqs === undefined) continue

      await supabase.from('service_faqs').delete().eq('service_id', id).eq('locale', locale)
      if (faqs.length) {
        await supabase.from('service_faqs').insert(
          faqs.map((faq, index) => ({ service_id: id, locale, question: faq.question, answer: faq.answer, order_index: index })),
        )
      }
    }
  }

  return service
})
