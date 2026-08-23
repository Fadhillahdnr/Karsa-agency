import { getSupabaseClient } from '../../utils/supabase'
import type { WorkApiItem } from './index.get'

export default defineEventHandler(async (event): Promise<WorkApiItem | null> => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) return null

  const supabase = getSupabaseClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !data) return null

  return {
    path: `/work/${data.slug}`,
    slug: data.slug,
    title: data.title,
    year: data.year,
    type: data.type,
    category: data.category,
    services: data.services,
    description: data.description,
    cover: data.cover,
    featured: data.featured,
    order: data.order_index,
    challenge: data.challenge,
    approach: data.approach,
    outcome: data.outcome,
  }
})
