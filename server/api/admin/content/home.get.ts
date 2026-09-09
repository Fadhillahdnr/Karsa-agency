import { requireAdmin } from '../../../utils/require-admin'
import { getSupabaseClient } from '../../../utils/supabase'

/** Returns the homepage's sections in order — creates the 'home' page row if it's somehow missing. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  let { data: page } = await supabase.from('pages').select('id').eq('slug', 'home').maybeSingle()

  if (!page) {
    const { data: created, error: insertError } = await supabase
      .from('pages')
      .insert({ slug: 'home', status: 'published', published_at: new Date().toISOString(), show_in_navigation: false, indexable: true })
      .select('id')
      .single()
    if (insertError || !created) {
      throw createError({ statusCode: 500, statusMessage: 'Could not initialize homepage' })
    }
    page = created
  }

  const { data: sections, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_id', page.id)
    .order('order_index', { ascending: true })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Could not load homepage sections' })
  }

  return sections
})
