import { getSupabaseClient } from '../../utils/supabase'
import type { Locale, PortfolioDiscipline } from '../../utils/supabase'

export type WorkApiItem = {
  path: string
  slug: string
  title: string
  year: number | null
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
  liveUrl: string | null
  githubUrl: string | null
}

const DISCIPLINE_LABEL: Record<PortfolioDiscipline, string> = {
  design: 'Design',
  photography: 'Photography',
  videography: 'Videography',
}

type EvidenceRow = {
  slug: string
  discipline: PortfolioDiscipline
  category: string | null
  featured: boolean
  project_id: string | null
  order_index: number
  published_at: string | null
  portfolio_collection_translations: { title: string, summary: string | null }[]
  cover: { secure_url: string | null, url: string } | null
}

/**
 * Published, admin-uploaded projects (stored in Supabase) plus published,
 * permission-cleared Design/Photography/Videography evidence (§13A.4:
 * "/work remains the cross-disciplinary portfolio/case-study index ... do
 * not duplicate content manually") — merged with the file-based
 * `content/work/*.md` collection client-side, see app/pages/work/index.vue.
 * Evidence collections already linked to a listed project (project_id) are
 * skipped here since that project already has its own /work/[slug] entry.
 */
export default defineEventHandler(async (event): Promise<WorkApiItem[]> => {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const query = getQuery(event)
  const locale: Locale = query.locale === 'id' ? 'id' : 'en'

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('order_index', { ascending: true })

  if (error || !projects) return []

  const projectIds = new Set(projects.map(p => p.id))

  const { data: evidence } = await supabase
    .from('portfolio_collections')
    .select('slug, discipline, category, featured, project_id, order_index, published_at, portfolio_collection_translations!inner(title, summary), cover:media_assets!portfolio_collections_cover_media_id_fkey(secure_url, url)')
    .eq('status', 'published')
    .eq('permission_to_show', true)
    .lte('published_at', new Date().toISOString())
    .eq('portfolio_collection_translations.locale', locale)
    .order('order_index', { ascending: true })

  const projectItems: WorkApiItem[] = projects.map(project => ({
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
    liveUrl: project.live_url,
    githubUrl: project.github_url,
  }))

  const evidenceItems: WorkApiItem[] = ((evidence ?? []) as unknown as EvidenceRow[])
    .filter(row => !row.project_id || !projectIds.has(row.project_id))
    .filter(row => row.cover?.secure_url || row.cover?.url)
    .map((row, index) => {
      const t = row.portfolio_collection_translations[0]
      return {
        path: `/${row.discipline}/${row.slug}`,
        slug: row.slug,
        title: t?.title ?? row.slug,
        year: row.published_at ? new Date(row.published_at).getFullYear() : null,
        type: DISCIPLINE_LABEL[row.discipline],
        category: row.category ?? DISCIPLINE_LABEL[row.discipline],
        services: [],
        description: t?.summary ?? '',
        cover: (row.cover!.secure_url || row.cover!.url) as string,
        featured: row.featured,
        // Evidence has its own order_index namespace (used within /design,
        // /photography, /videography) — not comparable to the curated
        // `order_index` on `projects`/content/work, so it's appended after
        // those rather than interleaved.
        order: 1000 + index,
        challenge: null,
        approach: null,
        outcome: null,
        liveUrl: null,
        githubUrl: null,
      }
    })

  return [...projectItems, ...evidenceItems]
})
