import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import { serviceSchema } from '../../../validation/service'
import { joinList } from '../../../utils/text-list'

export default defineEventHandler(async (event) => {
  const { user } = await requireAdmin(event, ['super_admin', 'content_editor'])

  const body = await readBody(event)
  const parsed = serviceSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: { fieldErrors: parsed.error.flatten().fieldErrors } })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const input = parsed.data

  const { data: service, error: insertError } = await supabase
    .from('services')
    .insert({
      slug: input.slug,
      category: input.category,
      parent_id: input.parentId ?? null,
      cover_media_id: input.coverMediaId ?? null,
      featured: input.featured,
      show_price: input.showPrice,
      price_type: input.priceType ?? null,
      starting_price: input.startingPrice ?? null,
      currency: input.currency,
      order_index: input.orderIndex,
      status: input.status,
      published_at: input.status === 'published' ? new Date().toISOString() : (input.publishedAt ?? null),
      created_by: user.id,
      updated_by: user.id,
    })
    .select('*')
    .single()

  if (insertError || !service) {
    if (insertError?.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'A service with this slug already exists' })
    }
    throw createError({ statusCode: 500, statusMessage: 'Could not create service' })
  }

  const translationRows = (['en', 'id'] as const).map(locale => ({
    service_id: service.id,
    locale,
    title: input.translations[locale].title,
    short_title: input.translations[locale].shortTitle || null,
    eyebrow: input.translations[locale].eyebrow || null,
    summary: input.translations[locale].summary || null,
    intro: joinList(input.translations[locale].intro),
    who_its_for: joinList(input.translations[locale].whoItsFor),
    problems: joinList(input.translations[locale].problems),
    deliverables: joinList(input.translations[locale].deliverables),
    included: joinList(input.translations[locale].included),
    excluded: joinList(input.translations[locale].excluded),
    process: input.translations[locale].process || null,
    cta_label: input.translations[locale].ctaLabel || null,
    seo_title: input.translations[locale].seoTitle || null,
    seo_description: input.translations[locale].seoDescription || null,
  }))

  const { error: translationError } = await supabase.from('service_translations').insert(translationRows)
  if (translationError) {
    throw createError({ statusCode: 500, statusMessage: 'Service created but translations failed to save' })
  }

  const faqRows = (['en', 'id'] as const).flatMap(locale =>
    input.faqs[locale].map((faq, index) => ({
      service_id: service.id,
      locale,
      question: faq.question,
      answer: faq.answer,
      order_index: index,
    })),
  )

  if (faqRows.length) {
    const { error: faqError } = await supabase.from('service_faqs').insert(faqRows)
    if (faqError) {
      throw createError({ statusCode: 500, statusMessage: 'Service created but FAQs failed to save' })
    }
  }

  setResponseStatus(event, 201)
  return service
})
