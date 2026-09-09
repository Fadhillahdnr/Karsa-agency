import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import { packageSchema } from '../../../validation/package'

export default defineEventHandler(async (event) => {
  await requireAdmin(event, ['super_admin', 'content_editor'])

  const body = await readBody(event)
  const parsed = packageSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: { fieldErrors: parsed.error.flatten().fieldErrors } })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const input = parsed.data

  const { data: pkg, error: insertError } = await supabase
    .from('packages')
    .insert({
      slug: input.slug,
      category: input.category,
      price_type: input.priceType,
      price: input.price ?? null,
      currency: input.currency,
      badge: input.badge || null,
      featured: input.featured,
      order_index: input.orderIndex,
      status: input.status,
      published_at: input.status === 'published' ? new Date().toISOString() : (input.publishedAt ?? null),
    })
    .select('*')
    .single()

  if (insertError || !pkg) {
    if (insertError?.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'A package with this slug already exists' })
    }
    throw createError({ statusCode: 500, statusMessage: 'Could not create package' })
  }

  const translationRows = (['en', 'id'] as const).map(locale => ({
    package_id: pkg.id,
    locale,
    title: input.translations[locale].title,
    summary: input.translations[locale].summary || null,
    price_note: input.translations[locale].priceNote || null,
    recommended_for: input.translations[locale].recommendedFor || null,
    duration_note: input.translations[locale].durationNote || null,
    revision_note: input.translations[locale].revisionNote || null,
    cta_label: input.translations[locale].ctaLabel || null,
    seo_title: input.translations[locale].seoTitle || null,
    seo_description: input.translations[locale].seoDescription || null,
  }))

  await supabase.from('package_translations').insert(translationRows)

  if (input.items.length) {
    await supabase.from('package_items').insert(
      input.items.map((item, index) => ({
        package_id: pkg.id,
        label: item.label,
        description: item.description || null,
        is_highlight: item.isHighlight,
        order_index: index,
      })),
    )
  }

  if (input.serviceIds.length) {
    await supabase.from('package_service_links').insert(
      input.serviceIds.map(serviceId => ({ package_id: pkg.id, service_id: serviceId })),
    )
  }

  setResponseStatus(event, 201)
  return pkg
})
