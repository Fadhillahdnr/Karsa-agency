export interface NavLink {
  label: string
  to: string
}

// Non-translatable identity/config. All user-facing copy (nav labels, site
// title/description/tagline, method steps, delivery stages) lives in
// i18n/locales/*.json and is read via useKarsaConfig() instead — see there.
export const siteConfig = {
  name: 'Karsa Studio',
  legalName: 'Karsa Studio',
  location: 'Indonesia',

  // TODO: business input — populate once official channels are confirmed.
  // Any field left empty is hidden gracefully in the UI (see useKarsaConfig).
  email: '',
  whatsapp: '',
  instagram: '',
  linkedin: '',
} as const

// Route paths are intentionally identical across locales (no per-locale URL
// translation) — only the displayed label changes, sourced from i18n.
export const navRoutes = ['/work', '/services', '/studio'] as const
export const primaryCtaRoute = '/start-a-project'
