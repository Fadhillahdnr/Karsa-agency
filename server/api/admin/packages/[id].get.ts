import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { PackageTranslationRow } from '../../../utils/supabase'

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

  const [{ data: pkg, error: pkgError }, { data: translations }, { data: items }, { data: links }] = await Promise.all([
    supabase.from('packages').select('*').eq('id', id).maybeSingle(),
    supabase.from('package_translations').select('*').eq('package_id', id),
    supabase.from('package_items').select('*').eq('package_id', id).order('order_index'),
    supabase.from('package_service_links').select('service_id').eq('package_id', id),
  ])

  if (pkgError || !pkg) {
    throw createError({ statusCode: 404, statusMessage: 'Package not found' })
  }

  function translationFor(locale: 'en' | 'id') {
    const t = (translations as PackageTranslationRow[] | null)?.find(row => row.locale === locale)
    return {
      title: t?.title ?? '',
      summary: t?.summary ?? '',
      priceNote: t?.price_note ?? '',
      recommendedFor: t?.recommended_for ?? '',
      durationNote: t?.duration_note ?? '',
      revisionNote: t?.revision_note ?? '',
      ctaLabel: t?.cta_label ?? '',
      seoTitle: t?.seo_title ?? '',
      seoDescription: t?.seo_description ?? '',
    }
  }

  return {
    ...pkg,
    translations: { en: translationFor('en'), id: translationFor('id') },
    items: (items ?? []).map(item => ({ label: item.label, description: item.description, isHighlight: item.is_highlight })),
    serviceIds: (links ?? []).map(link => link.service_id),
  }
})
