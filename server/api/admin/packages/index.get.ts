import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { PackageRow } from '../../../utils/supabase'

type PackageListRow = PackageRow & { package_translations: { locale: string, title: string }[] }

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const { data, error } = await supabase
    .from('packages')
    .select('*, package_translations(locale, title)')
    .order('category', { ascending: true })
    .order('order_index', { ascending: true })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Could not load packages' })
  }

  return (data as unknown as PackageListRow[]).map((pkg) => {
    const { package_translations, ...base } = pkg
    const enTitle = package_translations.find(t => t.locale === 'en')?.title
    const idTitle = package_translations.find(t => t.locale === 'id')?.title
    return { ...base, title: enTitle || idTitle || base.slug }
  })
})
