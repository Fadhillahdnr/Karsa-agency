import { createClient } from '@supabase/supabase-js'
import { legacyServiceSlugs, packages, services, validatePricingData } from './pricing-data.mjs'

const url = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const servicesOnly = process.argv.includes('--services-only')
const dryRun = process.argv.includes('--dry-run')

validatePricingData()

if (dryRun) {
  console.log(`Dry run: ${services.length} services and ${packages.length} packages validated from the pricing source.`)
  process.exit(0)
}

if (!url || !serviceRoleKey) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (see .env).')
  process.exit(1)
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

function fail(message, error) {
  console.error(message, error?.message ?? error)
  process.exit(1)
}

const serviceIds = new Map()
const publishedAt = new Date().toISOString()

for (const service of services) {
  const { data: row, error } = await supabase
    .from('services')
    .upsert({
      slug: service.slug,
      category: service.category,
      featured: service.featured,
      show_price: service.showPrice,
      price_type: service.priceType,
      starting_price: service.startingPrice,
      currency: 'IDR',
      order_index: service.orderIndex,
      status: 'published',
      published_at: publishedAt,
    }, { onConflict: 'slug' })
    .select('id')
    .single()

  if (error || !row) fail(`Failed to seed service "${service.slug}":`, error)
  serviceIds.set(service.slug, row.id)

  const translations = Object.entries(service.translations).map(([locale, value]) => ({
    service_id: row.id,
    locale,
    title: value.title,
    eyebrow: value.eyebrow,
    summary: value.summary,
    intro: value.intro.join('\n'),
    who_its_for: value.whoItsFor.join('\n'),
    problems: value.problems.join('\n'),
    deliverables: value.deliverables.join('\n'),
    included: value.included.join('\n'),
    excluded: value.excluded.join('\n'),
    process: value.process,
    cta_label: locale === 'id' ? 'Mulai Proyek' : 'Start a Project',
    seo_title: `${value.title} - Karsa Agency`,
    seo_description: value.summary,
  }))

  const { error: translationError } = await supabase
    .from('service_translations')
    .upsert(translations, { onConflict: 'service_id,locale' })
  if (translationError) fail(`Failed to seed translations for "${service.slug}":`, translationError)

  const { error: faqDeleteError } = await supabase.from('service_faqs').delete().eq('service_id', row.id)
  if (faqDeleteError) fail(`Failed to reset FAQs for "${service.slug}":`, faqDeleteError)
}

const { error: archiveError } = await supabase
  .from('services')
  .update({ status: 'archived', published_at: null, featured: false })
  .in('slug', legacyServiceSlugs)
if (archiveError) fail('Failed to archive legacy service rows:', archiveError)

console.log(`Seeded ${services.length} services and archived ${legacyServiceSlugs.length} legacy service slugs.`)

if (!servicesOnly) {
  for (const packageData of packages) {
    const { data: row, error } = await supabase
      .from('packages')
      .upsert({
        slug: packageData.slug,
        category: packageData.category,
        price_type: packageData.priceType,
        price: packageData.price,
        currency: 'IDR',
        badge: packageData.badge,
        featured: packageData.featured,
        order_index: packageData.orderIndex,
        status: 'published',
        published_at: publishedAt,
      }, { onConflict: 'slug' })
      .select('id')
      .single()

    if (error || !row) fail(`Failed to seed package "${packageData.slug}":`, error)

    const translations = Object.entries(packageData.translations).map(([locale, value]) => ({
      package_id: row.id,
      locale,
      title: value.title,
      summary: value.summary,
      price_note: value.priceNote,
      recommended_for: value.recommendedFor,
      duration_note: value.durationNote,
      revision_note: value.revisionNote,
      cta_label: value.ctaLabel,
      seo_title: `${value.title} - Karsa Agency`,
      seo_description: value.summary,
    }))

    const { error: translationError } = await supabase
      .from('package_translations')
      .upsert(translations, { onConflict: 'package_id,locale' })
    if (translationError) fail(`Failed to seed translations for "${packageData.slug}":`, translationError)

    const resets = await Promise.all([
      supabase.from('package_items').delete().eq('package_id', row.id),
      supabase.from('package_service_links').delete().eq('package_id', row.id),
    ])
    const resetError = resets.find(result => result.error)?.error
    if (resetError) fail(`Failed to reset relations for "${packageData.slug}":`, resetError)

    const { error: itemError } = await supabase.from('package_items').insert(
      packageData.items.map((label, orderIndex) => ({
        package_id: row.id,
        label,
        description: null,
        is_highlight: orderIndex === 0,
        order_index: orderIndex,
      })),
    )
    if (itemError) fail(`Failed to seed items for "${packageData.slug}":`, itemError)

    const links = packageData.serviceSlugs.map((slug) => {
      const serviceId = serviceIds.get(slug)
      if (!serviceId) fail(`Package "${packageData.slug}" references unknown service "${slug}".`)
      return { package_id: row.id, service_id: serviceId }
    })
    const { error: linkError } = await supabase.from('package_service_links').insert(links)
    if (linkError) fail(`Failed to link services for "${packageData.slug}":`, linkError)
  }

  console.log(`Seeded ${packages.length} packages with translations, items, and service links.`)
}

const [{ data: serviceCheck, error: serviceCheckError }, { data: packageCheck, error: packageCheckError }] = await Promise.all([
  supabase.from('services').select('slug, status').in('slug', services.map(service => service.slug)),
  servicesOnly
    ? Promise.resolve({ data: [], error: null })
    : supabase.from('packages').select('slug, status').in('slug', packages.map(packageData => packageData.slug)),
])

if (serviceCheckError || packageCheckError) fail('Verification query failed:', serviceCheckError ?? packageCheckError)
if (serviceCheck.length !== services.length || (!servicesOnly && packageCheck.length !== packages.length)) {
  fail('Verification count mismatch after seeding.', {
    message: `Expected ${services.length}/${packages.length}; received ${serviceCheck.length}/${packageCheck.length}.`,
  })
}

console.log('Verification passed: all managed rows exist in Supabase.')
