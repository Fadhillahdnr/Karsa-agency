import { getSupabaseClient } from '../../utils/supabase'

export type WorkApiItem = {
  path: string
  slug: string
  title: string
  year: number
  type: string
  category: string
  services: string[]
  description: string
  cover: string
  featured: boolean
  order: number
  challenge: string | null
  approach: string | null
  outcome: string | null
}

/**
 * Published, admin-uploaded projects (stored in Supabase). Merged with the
 * file-based `content/work/*.md` collection client-side — see
 * app/pages/work/index.vue — so existing case studies keep working
 * untouched while new ones can be added via /admin without a redeploy.
 */
export default defineEventHandler(async (): Promise<WorkApiItem[]> => {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('order_index', { ascending: true })

  if (error || !data) return []

  return data.map(project => ({
    path: `/work/${project.slug}`,
    slug: project.slug,
    title: project.title,
    year: project.year,
    type: project.type,
    category: project.category,
    services: project.services,
    description: project.description,
    cover: project.cover,
    featured: project.featured,
    order: project.order_index,
    challenge: project.challenge,
    approach: project.approach,
    outcome: project.outcome,
  }))
})
