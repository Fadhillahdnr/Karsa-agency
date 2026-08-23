export interface NavLink {
  label: string
  to: string
}

export const siteConfig = {
  name: 'Karsa Studio',
  legalName: 'Karsa Studio',
  title: 'Digital Product & Software Studio',
  tagline: 'Dari Karsa Menjadi Karya.',
  taglineEn: 'Turning Vision Into Meaningful Digital Experiences.',
  description:
    'Karsa Studio is a digital product & software studio helping businesses design, build, and grow websites, e-commerce, web applications, and custom software.',
  location: 'Indonesia',
  availability: 'Available for selected projects',

  // TODO: business input — populate once official channels are confirmed.
  // Any field left empty is hidden gracefully in the UI (see useKarsaConfig).
  email: '',
  whatsapp: '',
  instagram: '',
  linkedin: '',
} as const

export const navLinks: NavLink[] = [
  { label: 'Work', to: '/work' },
  { label: 'Services', to: '/services' },
  { label: 'Studio', to: '/studio' },
]

export const primaryCta: NavLink = { label: 'Start a Project', to: '/start-a-project' }

export const servicePillars = ['Design', 'Build', 'Grow'] as const

export const karsaMethod = [
  {
    step: '01',
    name: 'Understand',
    description: 'Business, user, problem, and goals.',
  },
  {
    step: '02',
    name: 'Define',
    description: 'Requirement, scope, assumptions, dependencies, and risk.',
  },
  {
    step: '03',
    name: 'Design',
    description: 'Flow, interaction, and interface.',
  },
  {
    step: '04',
    name: 'Build',
    description: 'Engineering and integration.',
  },
  {
    step: '05',
    name: 'Validate',
    description: 'QA, UAT, and acceptance.',
  },
  {
    step: '06',
    name: 'Grow',
    description: 'Warranty, maintenance, and optimization.',
  },
] as const

export const deliveryStages = [
  'Discovery',
  'Scope & Proposal',
  'Design',
  'Development',
  'QA & UAT',
  'Launch',
  'Warranty',
  'Continuous Support',
] as const
