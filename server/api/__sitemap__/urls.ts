import type { SitemapUrlInput } from '#sitemap/types'
import { getSupabaseClient } from '../../utils/supabase'

// Locales this site actually serves — 'id' is the unprefixed default
// (strategy: prefix_except_default in nuxt.config.ts), 'en' is under /en.
const LOCALE_PREFIXES = ['', '/en'] as const

function urlsFor(path: string, lastmod?: string | null): SitemapUrlInput[] {
  return LOCALE_PREFIXES.map(prefix => ({
    loc: `${prefix}${path}`,
    lastmod: lastmod ?? undefined,
  }))
}

/**
 * Dynamic sitemap sources (§72) — published-only rows from every
 * DB-backed content type with its own detail route. Static/file-based
 * routes (home, /services, /packages, /work, /insights, etc.) are already
 * covered by Nuxt Sitemap's built-in app-route source; this only adds the
 * slugs those index pages link to.
 */
export default defineSitemapEventHandler(async () => {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const now = new Date().toISOString()

  const [services, projects, articles, updates, careers, portfolio] = await Promise.all([
    supabase.from('services').select('slug, updated_at').eq('status', 'published'),
    supabase.from('projects').select('slug, updated_at').eq('published', true),
    supabase.from('articles').select('slug, updated_at').eq('status', 'published').lte('published_at', now),
    supabase.from('company_updates').select('slug, updated_at').eq('status', 'published').lte('published_at', now),
    supabase.from('careers').select('slug, updated_at').eq('status', 'published').lte('published_at', now)
      .or(`closing_at.is.null,closing_at.gte.${now}`),
    supabase.from('portfolio_collections').select('slug, discipline, updated_at')
      .eq('status', 'published').eq('permission_to_show', true).lte('published_at', now),
  ])

  const urls: SitemapUrlInput[] = []

  for (const row of services.data ?? []) urls.push(...urlsFor(`/services/${row.slug}`, row.updated_at))
  for (const row of projects.data ?? []) urls.push(...urlsFor(`/work/${row.slug}`, row.updated_at))
  for (const row of articles.data ?? []) urls.push(...urlsFor(`/insights/${row.slug}`, row.updated_at))
  for (const row of updates.data ?? []) urls.push(...urlsFor(`/updates/${row.slug}`, row.updated_at))
  for (const row of careers.data ?? []) urls.push(...urlsFor(`/careers/${row.slug}`, row.updated_at))
  for (const row of (portfolio.data ?? []) as { slug: string, discipline: string, updated_at: string }[]) {
    urls.push(...urlsFor(`/${row.discipline}/${row.slug}`, row.updated_at))
  }

  return urls
})
