import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { PackageUpdate, PackageTranslationUpsert } from '../../../utils/supabase'
import { packageUpdateSchema } from '../../../validation/package'

export default defineEventHandler(async (event) => {
  await requireAdmin(event, ['super_admin', 'content_editor'])

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const body = await readBody(event)
  const parsed = packageUpdateSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: { fieldErrors: parsed.error.flatten().fieldErrors } })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const input = parsed.data
  const baseUpdate: PackageUpdate = {}

  if (input.slug !== undefined) baseUpdate.slug = input.slug
  if (input.category !== undefined) baseUpdate.category = input.category
  if (input.priceType !== undefined) baseUpdate.price_type = input.priceType
  if (input.price !== undefined) baseUpdate.price = input.price
  if (input.currency !== undefined) baseUpdate.currency = input.currency
  if (input.badge !== undefined) baseUpdate.badge = input.badge || null
  if (input.featured !== undefined) baseUpdate.featured = input.featured
  if (input.orderIndex !== undefined) baseUpdate.order_index = input.orderIndex
  if (input.status !== undefined) {
    baseUpdate.status = input.status
    if (input.status === 'published') baseUpdate.published_at = new Date().toISOString()
  }
  if (input.publishedAt !== undefined) baseUpdate.published_at = input.publishedAt

  const { data: pkg, error: updateError } = await supabase
    .from('packages')
    .update(baseUpdate)
    .eq('id', id)
    .select('*')
    .single()

  if (updateError || !pkg) {
    if (updateError?.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'A package with this slug already exists' })
    }
    throw createError({ statusCode: 404, statusMessage: 'Package not found' })
  }

  if (input.translations) {
    for (const locale of ['en', 'id'] as const) {
      const t = input.translations[locale]
      if (!t) continue

      const row: Partial<PackageTranslationUpsert> & { package_id: string, locale: 'en' | 'id' } = { package_id: id, locale }
      if (t.title !== undefined) row.title = t.title
      if (t.summary !== undefined) row.summary = t.summary || null
      if (t.priceNote !== undefined) row.price_note = t.priceNote || null
      if (t.recommendedFor !== undefined) row.recommended_for = t.recommendedFor || null
      if (t.durationNote !== undefined) row.duration_note = t.durationNote || null
      if (t.revisionNote !== undefined) row.revision_note = t.revisionNote || null
      if (t.ctaLabel !== undefined) row.cta_label = t.ctaLabel || null
      if (t.seoTitle !== undefined) row.seo_title = t.seoTitle || null
      if (t.seoDescription !== undefined) row.seo_description = t.seoDescription || null

      // See the equivalent comment in services/[id].patch.ts — same reasoning.
      await supabase.from('package_translations').upsert(row as unknown as PackageTranslationUpsert, { onConflict: 'package_id,locale' })
    }
  }

  if (input.items !== undefined) {
    await supabase.from('package_items').delete().eq('package_id', id)
    if (input.items.length) {
      await supabase.from('package_items').insert(
        input.items.map((item, index) => ({
          package_id: id,
          label: item.label,
          description: item.description || null,
          is_highlight: item.isHighlight,
          order_index: index,
        })),
      )
    }
  }

  if (input.serviceIds !== undefined) {
    await supabase.from('package_service_links').delete().eq('package_id', id)
    if (input.serviceIds.length) {
      await supabase.from('package_service_links').insert(
        input.serviceIds.map(serviceId => ({ package_id: id, service_id: serviceId })),
      )
    }
  }

  return pkg
})
