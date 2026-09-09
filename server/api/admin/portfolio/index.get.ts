import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'
import type { PortfolioCollectionRow, PortfolioDiscipline } from '../../../utils/supabase'

const DISCIPLINES: readonly PortfolioDiscipline[] = ['design', 'photography', 'videography']

type ListRow = PortfolioCollectionRow & { portfolio_collection_translations: { locale: string, title: string }[] }

/** Lists portfolio collections, optionally filtered by ?discipline=design|photography|videography. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const query = getQuery(event)
  const discipline = typeof query.discipline === 'string' && (DISCIPLINES as readonly string[]).includes(query.discipline)
    ? query.discipline as PortfolioDiscipline
    : null

  let builder = supabase
    .from('portfolio_collections')
    .select('*, portfolio_collection_translations(locale, title)')
    .order('order_index', { ascending: true })

  if (discipline) {
    builder = builder.eq('discipline', discipline)
  }

  const { data, error } = await builder
  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Could not load portfolio collections' })
  }

  return (data as unknown as ListRow[]).map((row) => {
    const { portfolio_collection_translations, ...base } = row
    const enTitle = portfolio_collection_translations.find(t => t.locale === 'en')?.title
    const idTitle = portfolio_collection_translations.find(t => t.locale === 'id')?.title
    return { ...base, title: enTitle || idTitle || base.slug }
  })
})
