import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { PortfolioCollectionTranslationRow, PortfolioItemRow } from '../../../utils/supabase'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const [{ data: collection, error: collectionError }, { data: translations }, { data: items }] = await Promise.all([
    supabase.from('portfolio_collections').select('*').eq('id', id).maybeSingle(),
    supabase.from('portfolio_collection_translations').select('*').eq('collection_id', id),
    supabase.from('portfolio_items').select('*').eq('collection_id', id).order('order_index'),
  ])

  if (collectionError || !collection) {
    throw createError({ statusCode: 404, statusMessage: 'Collection not found' })
  }

  function translationFor(locale: 'en' | 'id') {
    const t = (translations as PortfolioCollectionTranslationRow[] | null)?.find(row => row.locale === locale)
    return {
      title: t?.title ?? '',
      summary: t?.summary ?? '',
      description: t?.description ?? '',
      credits: t?.credits ?? '',
      seoTitle: t?.seo_title ?? '',
      seoDescription: t?.seo_description ?? '',
    }
  }

  return {
    ...collection,
    translations: { en: translationFor('en'), id: translationFor('id') },
    items: ((items as PortfolioItemRow[] | null) ?? []).map(item => ({
      id: item.id,
      mediaId: item.media_id,
      itemType: item.item_type,
      externalUrl: item.external_url,
      posterMediaId: item.poster_media_id,
      caption: item.caption,
      altText: item.alt_text,
      duration: item.duration,
      aspectRatio: item.aspect_ratio,
      featured: item.featured,
    })),
  }
})
