import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { CompanyUpdateRow } from '../../../utils/supabase'

type ListRow = CompanyUpdateRow & { company_update_translations: { locale: string, title: string }[] }

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const { data, error } = await supabase
    .from('company_updates')
    .select('*, company_update_translations(locale, title)')
    .order('created_at', { ascending: false })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Could not load updates' })
  }

  return (data as unknown as ListRow[]).map((row) => {
    const { company_update_translations, ...base } = row
    const enTitle = company_update_translations.find(t => t.locale === 'en')?.title
    const idTitle = company_update_translations.find(t => t.locale === 'id')?.title
    return { ...base, title: enTitle || idTitle || base.slug }
  })
})
