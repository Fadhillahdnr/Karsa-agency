import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import { portfolioCollectionSchema } from '../../../validation/portfolio'

export default defineEventHandler(async (event) => {
  const { user } = await requireAdmin(event, ['super_admin', 'content_editor'])

  const body = await readBody(event)
  const parsed = portfolioCollectionSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: { fieldErrors: parsed.error.flatten().fieldErrors } })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const input = parsed.data

  const { data: collection, error: insertError } = await supabase
    .from('portfolio_collections')
    .insert({
      slug: input.slug,
      discipline: input.discipline,
      category: input.category || null,
      client_id: input.clientId ?? null,
      project_id: input.projectId ?? null,
      cover_media_id: input.coverMediaId ?? null,
      featured: input.featured,
      permission_to_show: input.permissionToShow,
      order_index: input.orderIndex,
      status: input.status,
      published_at: input.status === 'published' ? new Date().toISOString() : (input.publishedAt ?? null),
      created_by: user.id,
      updated_by: user.id,
    })
    .select('*')
    .single()

  if (insertError || !collection) {
    if (insertError?.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'A collection with this slug already exists' })
    }
    throw createError({ statusCode: 500, statusMessage: 'Could not create collection' })
  }

  const translationRows = (['en', 'id'] as const).map(locale => ({
    collection_id: collection.id,
    locale,
    title: input.translations[locale].title,
    summary: input.translations[locale].summary || null,
    description: input.translations[locale].description || null,
    credits: input.translations[locale].credits || null,
    seo_title: input.translations[locale].seoTitle || null,
    seo_description: input.translations[locale].seoDescription || null,
  }))

  await supabase.from('portfolio_collection_translations').insert(translationRows)

  if (input.items.length) {
    await supabase.from('portfolio_items').insert(
      input.items.map((item, index) => ({
        collection_id: collection.id,
        media_id: item.mediaId ?? null,
        item_type: item.itemType,
        external_url: item.externalUrl || null,
        poster_media_id: item.posterMediaId ?? null,
        caption: item.caption || null,
        alt_text: item.altText || null,
        duration: item.duration ?? null,
        aspect_ratio: item.aspectRatio || null,
        featured: item.featured,
        order_index: index,
        metadata: {},
      })),
    )
  }

  setResponseStatus(event, 201)
  return collection
})
