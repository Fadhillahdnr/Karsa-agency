import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { ServiceRow } from '../../../utils/supabase'

type ServiceListRow = ServiceRow & { service_translations: { locale: string, title: string }[] }

/** Lists every service (any status) with its English title, for the admin list view. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const { data, error } = await supabase
    .from('services')
    .select('*, service_translations(locale, title)')
    .order('category', { ascending: true })
    .order('order_index', { ascending: true })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Could not load services' })
  }

  return (data as unknown as ServiceListRow[]).map((service) => {
    const { service_translations, ...base } = service
    const enTitle = service_translations.find(t => t.locale === 'en')?.title
    const idTitle = service_translations.find(t => t.locale === 'id')?.title
    return { ...base, title: enTitle || idTitle || base.slug }
  })
})
