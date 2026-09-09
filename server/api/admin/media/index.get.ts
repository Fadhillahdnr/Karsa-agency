import { requireAdmin } from '../../../utils/require-admin'
import type { MediaAssetRow } from '../../../utils/supabase'
import { getSupabaseClient } from '../../../utils/supabase'

const PAGE_SIZE = 40
const RESOURCE_TYPES = ['image', 'video', 'document', 'external_video'] as const satisfies readonly MediaAssetRow['resource_type'][]

/** Lists media assets, newest first. Supports ?search= and ?type=image|video|document|external_video. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const supabase = getSupabaseClient()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase not configured' })
  }

  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const rawType = typeof query.type === 'string' ? query.type : ''
  const type = (RESOURCE_TYPES as readonly string[]).includes(rawType) ? rawType as MediaAssetRow['resource_type'] : null
  const page = Math.max(1, Number(query.page) || 1)

  let builder = supabase
    .from('media_assets')
    .select('*')
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  if (search) {
    builder = builder.or(`alt_text.ilike.%${search}%,caption.ilike.%${search}%,folder.ilike.%${search}%`)
  }
  if (type) {
    builder = builder.eq('resource_type', type)
  }

  const { data, error } = await builder
  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Could not load media' })
  }

  return data
})
