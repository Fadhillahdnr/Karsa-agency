import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { PortfolioCollectionUpdate, PortfolioCollectionTranslationUpsert } from '../../../utils/supabase'
import { portfolioCollectionUpdateSchema } from '../../../validation/portfolio'

export default defineEventHandler(async (event) => {
  const { user } = await requireAdmin(event, ['super_admin', 'content_editor'])

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const body = await readBody(event)
  const parsed = portfolioCollectionUpdateSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: { fieldErrors: parsed.error.flatten().fieldErrors } })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const input = parsed.data
  const update: PortfolioCollectionUpdate = { updated_by: user.id }

  if (input.slug !== undefined) update.slug = input.slug
  if (input.discipline !== undefined) update.discipline = input.discipline
  if (input.category !== undefined) update.category = input.category || null
  if (input.clientId !== undefined) update.client_id = input.clientId
  if (input.projectId !== undefined) update.project_id = input.projectId
  if (input.coverMediaId !== undefined) update.cover_media_id = input.coverMediaId
  if (input.featured !== undefined) update.featured = input.featured
  if (input.permissionToShow !== undefined) update.permission_to_show = input.permissionToShow
  if (input.orderIndex !== undefined) update.order_index = input.orderIndex
  if (input.status !== undefined) {
    update.status = input.status
    if (input.status === 'published') update.published_at = new Date().toISOString()
  }
  if (input.publishedAt !== undefined) update.published_at = input.publishedAt

  const { data: collection, error: updateError } = await supabase
    .from('portfolio_collections')
    .update(update)
    .eq('id', id)
    .select('*')
    .single()

  if (updateError || !collection) {
    if (updateError?.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'A collection with this slug already exists' })
    }
    throw createError({ statusCode: 404, statusMessage: 'Collection not found' })
  }

  if (input.translations) {
    for (const locale of ['en', 'id'] as const) {
      const t = input.translations[locale]
      if (!t) continue

      const row: Partial<PortfolioCollectionTranslationUpsert> & { collection_id: string, locale: 'en' | 'id' } = { collection_id: id, locale }
      if (t.title !== undefined) row.title = t.title
      if (t.summary !== undefined) row.summary = t.summary || null
      if (t.description !== undefined) row.description = t.description || null
      if (t.credits !== undefined) row.credits = t.credits || null
      if (t.seoTitle !== undefined) row.seo_title = t.seoTitle || null
      if (t.seoDescription !== undefined) row.seo_description = t.seoDescription || null

      await supabase.from('portfolio_collection_translations').upsert(
        row as unknown as PortfolioCollectionTranslationUpsert,
        { onConflict: 'collection_id,locale' },
      )
    }
  }

  if (input.items !== undefined) {
    await supabase.from('portfolio_items').delete().eq('collection_id', id)
    if (input.items.length) {
      await supabase.from('portfolio_items').insert(
        input.items.map((item, index) => ({
          collection_id: id,
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
  }

  return collection
})
