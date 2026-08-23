import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceRoleKey) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (see .env).')
  process.exit(1)
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// Placeholder entries for exercising the `/admin` panel and `/work` listing
// locally. Cover reuses the existing aanaya asset since no other placeholder
// images are checked in — swap for real covers before using in production.
const projects = [
  {
    slug: 'nimbus-crm',
    title: 'Nimbus CRM',
    year: 2026,
    type: 'Internal Concept',
    category: 'SaaS',
    services: ['UI/UX Design', 'Web Development'],
    description: 'An internal concept exploring a lightweight CRM built for small studio teams.',
    cover: '/images/work/aanaya/cover.svg',
    featured: false,
    challenge: 'Small studios outgrow spreadsheets but find most CRMs too heavy for their workflow.',
    approach: 'Scoped the concept to three views — pipeline, contacts, and follow-ups — and nothing else.',
    outcome: 'A working prototype that validated the scoped-down approach before any client work started.',
    order_index: 10,
    published: true,
  },
  {
    slug: 'lumen-portfolio-kit',
    title: 'Lumen Portfolio Kit',
    year: 2025,
    type: 'Experimental Work',
    category: 'Design System',
    services: ['UI/UX Design'],
    description: 'A small experimental component kit for fast-turnaround portfolio sites.',
    cover: '/images/work/aanaya/cover.svg',
    featured: false,
    challenge: 'Rebuilding the same portfolio layout primitives for every quick engagement was wasted effort.',
    approach: 'Extracted the recurring layout, typography, and motion patterns into a reusable Figma + code kit.',
    outcome: 'Cut portfolio-site turnaround time and became the base for two independent projects since.',
    order_index: 20,
    published: true,
  },
]

const { data, error } = await supabase
  .from('projects')
  .upsert(projects, { onConflict: 'slug' })
  .select('slug')

if (error) {
  console.error('Failed to seed projects:', error.message)
  process.exit(1)
}

console.log(`Seeded ${data.length} project(s): ${data.map(project => project.slug).join(', ')}`)
