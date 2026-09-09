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

// Migrates the real service content that used to live in
// content/services/*.md (Nuxt Content) into the DB per master prompt §59.
// custom-software and web-application are old "digital product & software
// studio" positioning that doesn't fit the WEB/DESIGN/PHOTO/FILM taxonomy
// (§60) — kept as real rows (content preserved, nothing fabricated) but
// left unpublished rather than deleted, per explicit product decision
// 2026-09-09.
const services = [
  {
    slug: 'web-development',
    category: 'web',
    featured: true,
    order_index: 1,
    status: 'published',
    en: {
      title: 'Web Development',
      summary: 'Company websites and marketing sites built to load fast, rank well, and hold up as the business grows.',
      whoItsFor: [
        'Businesses that need a credible, professional web presence',
        'Teams replacing a slow or outdated website',
        'Companies that need a site their team can actually maintain',
      ],
      problems: [
        'The current website is slow, hard to update, or not mobile-friendly',
        'The site doesn\'t reflect the business clearly to new visitors',
        'Content changes require a developer for every small edit',
      ],
      deliverables: [
        'Responsive, production-ready website',
        'Content structure that\'s editable without touching code',
        'Technical SEO baseline (metadata, sitemap, structured data)',
        'Deployment and handover documentation',
      ],
      intro: [
        'Company profile and marketing websites',
        'Landing pages for specific campaigns or products',
        'Multi-page content sites with structured, editable content',
        'Performance and SEO optimization for existing sites',
      ],
      process: 'Every website follows the same Karsa Method: understanding the business first, then defining scope, designing the interface, building it, validating through QA, and supporting it after launch.',
      faqs: [
        { question: 'Can you work with our existing brand identity?', answer: 'Yes. We design and build within an existing brand system where one exists, rather than replacing it.' },
        { question: 'Will we be able to update content ourselves?', answer: 'Yes — content is structured so common updates don\'t require a developer for every change.' },
      ],
    },
    id: {
      title: 'Pengembangan Web',
      summary: 'Website perusahaan dan marketing yang dibangun agar cepat dimuat, mudah ditemukan, dan tetap kokoh seiring bisnis berkembang.',
      whoItsFor: [
        'Bisnis yang butuh kehadiran web yang kredibel dan profesional',
        'Tim yang mengganti website lama atau lambat',
        'Perusahaan yang butuh situs yang benar-benar bisa dirawat timnya sendiri',
      ],
      problems: [
        'Website saat ini lambat, sulit diperbarui, atau tidak mobile-friendly',
        'Situs tidak menyampaikan gambaran bisnis dengan jelas ke pengunjung baru',
        'Perubahan konten selalu butuh developer untuk hal sekecil apa pun',
      ],
      deliverables: [
        'Website responsif yang siap produksi',
        'Struktur konten yang bisa diedit tanpa menyentuh kode',
        'Baseline SEO teknis (metadata, sitemap, structured data)',
        'Dokumentasi deployment dan serah terima',
      ],
      intro: [
        'Website company profile dan marketing',
        'Landing page untuk kampanye atau produk tertentu',
        'Situs konten multi-halaman dengan konten yang terstruktur dan bisa diedit',
        'Optimasi performa dan SEO untuk situs yang sudah ada',
      ],
      process: 'Setiap website mengikuti Metode Karsa yang sama: memahami bisnis terlebih dahulu, lalu menentukan ruang lingkup, mendesain antarmuka, membangunnya, memvalidasi melalui QA, dan mendukungnya setelah rilis.',
      faqs: [
        { question: 'Bisakah kalian bekerja dengan identitas brand kami yang sudah ada?', answer: 'Ya. Kami mendesain dan membangun mengikuti sistem brand yang sudah ada, bukan menggantinya.' },
        { question: 'Apakah kami bisa memperbarui konten sendiri?', answer: 'Ya — konten distrukturkan sehingga pembaruan umum tidak membutuhkan developer di setiap perubahan.' },
      ],
    },
  },
  {
    slug: 'ecommerce',
    category: 'web',
    featured: false,
    order_index: 4,
    status: 'published',
    en: {
      title: 'E-Commerce',
      summary: 'Storefronts built around a clear path from product discovery to checkout, without unnecessary complexity.',
      whoItsFor: [
        'Businesses launching their first online store',
        'Brands outgrowing a template-based storefront',
        'Teams that need commerce integrated with existing operations',
      ],
      problems: [
        'Checkout drop-off is high and hard to diagnose',
        'The storefront can\'t reflect real inventory or pricing logic',
        'Product catalog management is manual and error-prone',
      ],
      deliverables: [
        'Storefront design and build (catalog, cart, checkout)',
        'Payment and shipping integration',
        'Product and inventory data structure',
        'Post-launch support plan',
      ],
      intro: [
        'Custom storefronts for direct-to-consumer brands',
        'Headless commerce builds integrated with existing systems',
        'Checkout and payment flow optimization',
        'Product catalog and inventory structuring',
      ],
      process: 'Commerce projects follow the Karsa Method with extra emphasis on Define — payment, inventory, and fulfillment constraints are scoped clearly before design begins, so the build doesn\'t stall on integration surprises later.',
      faqs: [
        { question: 'Can you integrate with our existing payment provider?', answer: 'In most cases yes — we scope integration requirements during discovery before committing to an approach.' },
        { question: 'Do you build on a platform or from scratch?', answer: 'Depends on scope. Some projects fit a headless commerce platform, others are better as a custom build — we recommend based on your requirements, not a default.' },
      ],
    },
    id: {
      title: 'E-Commerce',
      summary: 'Storefront yang dibangun dengan alur jelas dari penemuan produk hingga checkout, tanpa kompleksitas yang tidak perlu.',
      whoItsFor: [
        'Bisnis yang meluncurkan toko online pertama mereka',
        'Brand yang sudah melampaui kemampuan storefront berbasis template',
        'Tim yang butuh commerce terintegrasi dengan operasional yang sudah berjalan',
      ],
      problems: [
        'Drop-off saat checkout tinggi dan sulit didiagnosis',
        'Storefront tidak bisa merefleksikan stok atau logika harga yang sebenarnya',
        'Pengelolaan katalog produk masih manual dan rawan kesalahan',
      ],
      deliverables: [
        'Desain dan pembangunan storefront (katalog, keranjang, checkout)',
        'Integrasi pembayaran dan pengiriman',
        'Struktur data produk dan inventaris',
        'Rencana dukungan pasca-rilis',
      ],
      intro: [
        'Storefront custom untuk brand direct-to-consumer',
        'Pembangunan commerce headless yang terintegrasi dengan sistem yang ada',
        'Optimasi alur checkout dan pembayaran',
        'Penataan katalog produk dan inventaris',
      ],
      process: 'Proyek commerce mengikuti Metode Karsa dengan penekanan ekstra pada tahap Menentukan — batasan pembayaran, inventaris, dan fulfillment ditentukan dengan jelas sebelum desain dimulai, sehingga pembangunan tidak terhenti karena kejutan integrasi di kemudian hari.',
      faqs: [
        { question: 'Bisakah kalian mengintegrasikan payment provider yang sudah kami pakai?', answer: 'Dalam sebagian besar kasus, bisa — kami menentukan kebutuhan integrasi selama tahap discovery sebelum berkomitmen pada satu pendekatan.' },
        { question: 'Apakah kalian membangun di atas platform atau dari nol?', answer: 'Tergantung ruang lingkup. Beberapa proyek cocok dengan platform commerce headless, yang lain lebih baik dibangun custom — kami akan merekomendasikan berdasarkan kebutuhanmu, bukan default.' },
      ],
    },
  },
  {
    slug: 'maintenance-support',
    category: 'web',
    featured: false,
    order_index: 7,
    status: 'published',
    en: {
      title: 'Maintenance & Support',
      summary: 'Ongoing care for a product after launch — fixes, updates, and improvements handled by people who understand how it was built.',
      whoItsFor: [
        'Businesses with a live product and no dedicated technical team',
        'Teams that inherited a product built by someone else',
        'Companies that need steady, incremental improvement over time',
      ],
      problems: [
        'Bugs and issues go unaddressed after the original team moves on',
        'Dependencies and security patches fall behind over time',
        'There\'s no plan for improving the product after launch',
      ],
      deliverables: [
        'Defined response process for issues and fixes',
        'Regular dependency and security updates',
        'Ongoing performance and technical SEO monitoring',
        'Scoped continuous development for new features',
      ],
      intro: [
        'Ongoing bug fixes and technical maintenance',
        'Dependency, security, and platform updates',
        'Performance monitoring and optimization',
        'Incremental feature development after launch',
      ],
      process: 'Maintenance sits in the Support stage of the Karsa Method — the product has already shipped, so this stage focuses on keeping it reliable and steadily improving it based on real usage.',
      faqs: [
        { question: 'Do you support products Karsa didn\'t originally build?', answer: 'In many cases yes — we review the existing codebase first to confirm it\'s something we can responsibly maintain.' },
        { question: 'Is there a fixed response time?', answer: 'Response expectations are agreed per engagement rather than promised as a blanket guarantee — this is confirmed during scoping, not assumed upfront.' },
      ],
    },
    id: {
      title: 'Maintenance & Support',
      summary: 'Perawatan berkelanjutan untuk produk setelah rilis — perbaikan, pembaruan, dan peningkatan yang ditangani oleh orang yang memahami cara produk itu dibangun.',
      whoItsFor: [
        'Bisnis dengan produk yang sudah live tanpa tim teknis khusus',
        'Tim yang mewarisi produk yang dibangun pihak lain',
        'Perusahaan yang butuh peningkatan bertahap secara konsisten',
      ],
      problems: [
        'Bug dan masalah tidak tertangani setelah tim awal berpindah',
        'Dependency dan patch keamanan makin tertinggal seiring waktu',
        'Tidak ada rencana untuk meningkatkan produk setelah rilis',
      ],
      deliverables: [
        'Proses respons yang jelas untuk masalah dan perbaikan',
        'Pembaruan dependency dan keamanan secara berkala',
        'Pemantauan performa dan SEO teknis berkelanjutan',
        'Pengembangan fitur baru dengan ruang lingkup yang jelas',
      ],
      intro: [
        'Perbaikan bug dan maintenance teknis berkelanjutan',
        'Pembaruan dependency, keamanan, dan platform',
        'Pemantauan dan optimasi performa',
        'Pengembangan fitur bertahap setelah rilis',
      ],
      process: 'Maintenance berada di tahap Dukung dalam Metode Karsa — produk sudah dirilis, sehingga tahap ini fokus menjaga keandalannya dan meningkatkannya secara bertahap berdasarkan penggunaan nyata.',
      faqs: [
        { question: 'Apakah kalian mendukung produk yang bukan Karsa bangun sejak awal?', answer: 'Dalam banyak kasus, bisa — kami meninjau codebase yang ada terlebih dahulu untuk memastikan ini sesuatu yang bisa kami rawat secara bertanggung jawab.' },
        { question: 'Apakah ada waktu respons yang tetap?', answer: 'Ekspektasi respons disepakati per proyek, bukan dijanjikan sebagai jaminan umum — ini dipastikan saat penentuan ruang lingkup, bukan diasumsikan di awal.' },
      ],
    },
  },
  {
    slug: 'ui-ux-design',
    category: 'design',
    featured: true,
    order_index: 7,
    status: 'published',
    en: {
      title: 'UI/UX Design',
      summary: 'Interfaces and product experiences designed around how people actually make decisions — not just how a screen looks.',
      whoItsFor: [
        'Startups shaping a product for the first time',
        'Businesses replacing an interface that has become hard to use',
        'Teams that need a design system before scaling further',
      ],
      problems: [
        'Users abandon flows before completing key actions',
        'The product looks inconsistent across screens and features',
        'Design decisions rely on opinion instead of a documented system',
      ],
      deliverables: [
        'Research synthesis and user flows',
        'Wireframes and interactive prototypes',
        'UI design files with a documented design system',
        'Developer-ready specs and handoff assets',
      ],
      intro: [
        'Product and marketing website interfaces',
        'Design systems and reusable component libraries',
        'Interactive prototypes for testing before development',
        'Redesigns of existing products with a documented rationale',
      ],
      process: 'Design work follows the Karsa Method: understanding the business and user context first, defining scope and flows, then designing interfaces that are validated before a single line of production code is written.',
      faqs: [
        { question: 'Do you design without building the product too?', answer: 'Yes — design and build can run as separate engagements, or together as one continuous process. We\'ll recommend what fits your timeline.' },
        { question: 'What tools do you design in?', answer: 'Figma, for both interface design and prototyping, with assets handed off in developer-ready formats.' },
      ],
    },
    id: {
      title: 'Desain UI/UX',
      summary: 'Antarmuka dan pengalaman produk yang dirancang berdasarkan bagaimana orang benar-benar mengambil keputusan — bukan sekadar tampilan layar.',
      whoItsFor: [
        'Startup yang sedang membentuk produk untuk pertama kali',
        'Bisnis yang mengganti antarmuka yang sudah sulit digunakan',
        'Tim yang butuh design system sebelum berkembang lebih jauh',
      ],
      problems: [
        'Pengguna meninggalkan alur sebelum menyelesaikan aksi penting',
        'Produk terlihat tidak konsisten di berbagai layar dan fitur',
        'Keputusan desain bergantung pada opini, bukan sistem yang terdokumentasi',
      ],
      deliverables: [
        'Sintesis riset dan user flow',
        'Wireframe dan prototipe interaktif',
        'File desain UI dengan design system yang terdokumentasi',
        'Spesifikasi dan aset handoff siap developer',
      ],
      intro: [
        'Antarmuka website produk dan marketing',
        'Design system dan library komponen yang bisa dipakai ulang',
        'Prototipe interaktif untuk pengujian sebelum pengembangan',
        'Redesign produk yang sudah ada dengan alasan yang terdokumentasi',
      ],
      process: 'Pekerjaan desain mengikuti Metode Karsa: memahami konteks bisnis dan pengguna terlebih dahulu, menentukan ruang lingkup dan alur, lalu mendesain antarmuka yang divalidasi sebelum satu baris kode produksi pun ditulis.',
      faqs: [
        { question: 'Apakah kalian mendesain tanpa ikut membangun produknya?', answer: 'Ya — desain dan pembangunan bisa berjalan sebagai proyek terpisah, atau bersama sebagai satu proses berkelanjutan. Kami akan merekomendasikan yang paling sesuai dengan timeline kamu.' },
        { question: 'Tools apa yang digunakan untuk desain?', answer: 'Figma, untuk desain antarmuka maupun prototyping, dengan aset yang diserahkan dalam format siap developer.' },
      ],
    },
  },
  {
    slug: 'custom-software',
    category: 'web',
    featured: false,
    order_index: 90,
    status: 'draft',
    en: {
      title: 'Custom Software',
      summary: 'Software built around a specific business process, when off-the-shelf tools stop fitting the way the business actually runs.',
      whoItsFor: ['Corporates with a process that doesn\'t fit standard software', 'Businesses replacing multiple disconnected tools', 'Teams that need software to integrate with existing systems'],
      problems: ['Off-the-shelf software forces the team to work around its limitations', 'Data lives in too many disconnected tools', 'A critical process has no proper system behind it at all'],
      deliverables: ['Requirements and system design documentation', 'Custom-built software matched to the process', 'Integration with existing tools and data sources', 'Handover and maintenance plan'],
      intro: [],
      process: null,
      faqs: [{ question: 'How do you scope a custom software project?', answer: 'Through a discovery phase focused on the actual process, constraints, and existing systems — scope is defined before any commitment on cost or timeline.' }],
    },
    id: null,
  },
  {
    slug: 'web-application',
    category: 'web',
    featured: false,
    order_index: 91,
    status: 'draft',
    en: {
      title: 'Web Application',
      summary: 'Dashboards, portals, and internal tools built for the workflows your team actually has — not a generic template.',
      whoItsFor: ['Startups building a product MVP', 'Companies digitalizing a manual internal process', 'Teams that need a dashboard or portal tied to existing data'],
      problems: ['A manual process (spreadsheets, email, paper) is slowing the team down', 'An existing internal tool is unreliable or hard to extend', 'There\'s no single place to see the data that matters'],
      deliverables: ['Application architecture and data model', 'Working web application (frontend and backend)', 'Authentication and role-based access where needed', 'Documentation for future development'],
      intro: [],
      process: null,
      faqs: [{ question: 'Do you build MVPs for early-stage startups?', answer: 'Yes. We scope MVPs tightly around the core workflow that needs validating, not every feature that might eventually matter.' }],
    },
    id: null,
  },
]

let seededCount = 0

for (const service of services) {
  const { data: row, error: upsertError } = await supabase
    .from('services')
    .upsert({
      slug: service.slug,
      category: service.category,
      featured: service.featured,
      order_index: service.order_index,
      status: service.status,
      published_at: service.status === 'published' ? new Date().toISOString() : null,
    }, { onConflict: 'slug' })
    .select('id')
    .single()

  if (upsertError || !row) {
    console.error(`Failed to seed service "${service.slug}":`, upsertError?.message)
    process.exit(1)
  }

  const translations = ['en', 'id']
    .map(locale => ({ locale, t: service[locale] }))
    .filter(entry => entry.t !== null)
    .map(({ locale, t }) => ({
      service_id: row.id,
      locale,
      title: t.title,
      summary: t.summary,
      who_its_for: t.whoItsFor.join('\n'),
      problems: t.problems.join('\n'),
      deliverables: t.deliverables.join('\n'),
      intro: t.intro.join('\n'),
      process: t.process,
    }))

  const { error: translationError } = await supabase
    .from('service_translations')
    .upsert(translations, { onConflict: 'service_id,locale' })

  if (translationError) {
    console.error(`Failed to seed translations for "${service.slug}":`, translationError.message)
    process.exit(1)
  }

  // FAQs have no natural unique key to upsert on, so this re-seeds them
  // fresh each run (delete then insert) — safe since they're fully
  // derived from this script's data, not admin-edited yet.
  await supabase.from('service_faqs').delete().eq('service_id', row.id)

  const faqRows = ['en', 'id']
    .flatMap(locale => (service[locale]?.faqs ?? []).map((faq, index) => ({
      service_id: row.id,
      locale,
      question: faq.question,
      answer: faq.answer,
      order_index: index,
    })))

  if (faqRows.length) {
    const { error: faqError } = await supabase.from('service_faqs').insert(faqRows)
    if (faqError) {
      console.error(`Failed to seed FAQs for "${service.slug}":`, faqError.message)
      process.exit(1)
    }
  }

  seededCount++
  console.log(`Seeded service "${service.slug}" (${service.status}).`)
}

console.log(`Done — seeded ${seededCount} service(s).`)
