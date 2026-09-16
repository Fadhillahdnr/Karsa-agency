// Canonical CMS seed data transcribed from
// docs/Karsa_Agency_Creative_Services_Launch_Pricing.pdf (2026 edition).
// Keep prices and scope aligned with that client-facing source document.

const launchPriceNote = {
  id: 'Karsa Launch Pricing 2026 - harga perkenalan untuk selected early-partner projects; final scope dikunci setelah discovery.',
  en: 'Karsa Launch Pricing 2026 - introductory pricing for selected early-partner projects; final scope is confirmed after discovery.',
}

export const services = [
  {
    slug: 'website', category: 'web', featured: true, orderIndex: 1,
    showPrice: true, priceType: 'starting_from', startingPrice: 2500000,
    translations: {
      id: {
        title: 'Website', eyebrow: 'Build a digital home that works for your business.',
        summary: 'Landing page, company profile, e-commerce, dan custom web yang responsive, terarah, dan siap digunakan bisnis.',
        intro: ['Landing page', 'Business website', 'E-commerce basic', 'Custom web / system'],
        whoItsFor: ['Campaign atau personal brand yang membutuhkan satu halaman fokus', 'Bisnis yang membutuhkan company profile profesional', 'Bisnis yang mulai menjual produk secara online', 'Tim yang membutuhkan dashboard, portal, booking flow, atau workflow khusus'],
        problems: ['Informasi bisnis belum tersusun jelas secara online', 'Website lama tidak responsive atau sulit diarahkan ke aksi utama', 'Alur commerce atau workflow khusus belum didukung sistem yang tepat'],
        deliverables: ['Strategy dan struktur informasi', 'Custom UI/UX dan development responsive', 'Basic SEO, QA, dan deployment', 'Handover sesuai scope'],
        included: ['Responsive layout', 'CTA terarah', 'Basic SEO setup', 'QA dan deployment/handover sesuai scope'],
        excluded: ['Domain dan hosting/cloud', 'Paid plugins dan premium licenses', 'Payment provider fees', 'Third-party services kecuali tertulis di quotation'],
        process: 'Discovery, scope dan quotation, creative/development, review dan QA/UAT, lalu final delivery serta handover.',
      },
      en: {
        title: 'Website', eyebrow: 'Build a digital home that works for your business.',
        summary: 'Responsive, focused landing pages, company profiles, e-commerce sites, and custom web systems built for real business use.',
        intro: ['Landing pages', 'Business websites', 'Basic e-commerce', 'Custom web / systems'],
        whoItsFor: ['Campaigns or personal brands that need one focused page', 'Businesses that need a professional company profile', 'Businesses starting to sell products online', 'Teams that need a dashboard, portal, booking flow, or custom workflow'],
        problems: ['Business information is not clearly structured online', 'The current website is not responsive or does not guide visitors to a primary action', 'Commerce or custom workflows are not supported by the right system'],
        deliverables: ['Strategy and information structure', 'Custom UI/UX and responsive development', 'Basic SEO, QA, and deployment', 'Scope-appropriate handover'],
        included: ['Responsive layout', 'Focused calls to action', 'Basic SEO setup', 'QA and deployment/handover as scoped'],
        excluded: ['Domain and hosting/cloud', 'Paid plugins and premium licences', 'Payment-provider fees', 'Third-party services unless stated in the quotation'],
        process: 'Discovery, scope and quotation, creative/development, review and QA/UAT, followed by final delivery and handover.',
      },
    },
  },
  {
    slug: 'design', category: 'design', featured: true, orderIndex: 2,
    showPrice: true, priceType: 'starting_from', startingPrice: 1250000,
    translations: {
      id: {
        title: 'Design', eyebrow: 'Create a visual language people remember.',
        summary: 'Logo, brand identity, social media, campaign, dan marketing visual yang dirancang sebagai satu sistem yang konsisten.',
        intro: ['Logo Essentials', 'Brand Identity', 'Social Media Starter', 'Campaign / Marketing Design'],
        whoItsFor: ['Brand baru yang membutuhkan identitas awal', 'Bisnis yang ingin merapikan sistem visual', 'Tim yang membutuhkan template social media berkelanjutan', 'Campaign, event, launch, atau promosi dengan satu visual direction'],
        problems: ['Identitas belum terlihat profesional atau konsisten', 'Aset visual berbeda-beda di setiap touchpoint', 'Tim kesulitan melanjutkan konten karena tidak memiliki sistem layout'],
        deliverables: ['Concept dan visual direction', 'Logo atau visual system sesuai paket', 'Digital-ready export dan editable files sesuai scope', 'Brand consistency dan handover'],
        included: ['Creative brief', 'Visual direction', 'Revision allowance sesuai paket', 'Final export dan source handover sesuai scope'],
        excluded: ['Printing', 'Stock/premium assets', 'Paid font licences', 'Complex illustration dan full copywriting'],
        process: 'Brief dan referensi dikunci saat discovery, konsep dikembangkan menjadi sistem, feedback dikonsolidasikan, lalu final assets diserahkan.',
      },
      en: {
        title: 'Design', eyebrow: 'Create a visual language people remember.',
        summary: 'Logos, brand identities, social media systems, campaigns, and marketing visuals designed as one consistent system.',
        intro: ['Logo Essentials', 'Brand Identity', 'Social Media Starter', 'Campaign / Marketing Design'],
        whoItsFor: ['New brands that need a foundational identity', 'Businesses that want a more coherent visual system', 'Teams that need reusable social-media templates', 'Campaigns, events, launches, or promotions that need one visual direction'],
        problems: ['The identity does not yet look professional or consistent', 'Visual assets vary across touchpoints', 'The team cannot sustain content because there is no layout system'],
        deliverables: ['Concept and visual direction', 'A logo or visual system according to the package', 'Digital-ready exports and editable files as scoped', 'Brand consistency and handover'],
        included: ['Creative brief', 'Visual direction', 'Package-specific revision allowance', 'Final exports and source handover as scoped'],
        excluded: ['Printing', 'Stock/premium assets', 'Paid font licences', 'Complex illustration and full copywriting'],
        process: 'The brief and references are confirmed during discovery, concepts are developed into a system, feedback is consolidated, and final assets are handed over.',
      },
    },
  },
  {
    slug: 'photography', category: 'photo', featured: true, orderIndex: 3,
    showPrice: true, priceType: 'starting_from', startingPrice: 1500000,
    translations: {
      id: {
        title: 'Photography', eyebrow: 'Turn the real business into visual trust.',
        summary: 'Fotografi produk, profil perusahaan, workspace, interior, campaign, dan event dengan output high-resolution serta web-ready.',
        intro: ['Product Essential', 'Brand Session', 'Campaign Full Day', 'Event / Corporate Documentation'],
        whoItsFor: ['Bisnis yang membutuhkan foto produk siap jual', 'Perusahaan yang ingin mendokumentasikan tim, layanan, dan workspace', 'Brand yang menjalankan campaign atau product launch', 'Penyelenggara event dan kegiatan corporate'],
        problems: ['Visual bisnis belum terasa autentik dan profesional', 'Produk atau layanan belum memiliki aset foto yang konsisten', 'Dokumentasi campaign dan event tidak memiliki shot direction yang jelas'],
        deliverables: ['Creative direction dan shot list sesuai paket', 'Sesi pemotretan serta seleksi', 'Basic color correction/retouch', 'High-resolution dan web-ready export'],
        included: ['Shooting', 'Selection', 'Basic color correction', 'Online delivery sesuai scope'],
        excluded: ['RAW/unselected files', 'Studio/lokasi khusus, talent/model, MUA, dan custom props', 'Permits, overtime, dan out-of-area transport', 'Extra camera, special lighting, dan drone'],
        process: 'Brief, lokasi, reference, dan shot list dikunci sebelum produksi; setelah shooting, Karsa melakukan seleksi, editing, review, dan online delivery.',
      },
      en: {
        title: 'Photography', eyebrow: 'Turn the real business into visual trust.',
        summary: 'Product, company-profile, workspace, interior, campaign, and event photography delivered in high-resolution and web-ready formats.',
        intro: ['Product Essential', 'Brand Session', 'Campaign Full Day', 'Event / Corporate Documentation'],
        whoItsFor: ['Businesses that need sales-ready product photography', 'Companies documenting their team, services, and workspace', 'Brands running a campaign or product launch', 'Event and corporate-activity organisers'],
        problems: ['The business lacks authentic, professional visual assets', 'Products or services do not have a consistent photo library', 'Campaign and event documentation lacks a clear shot direction'],
        deliverables: ['Package-appropriate creative direction and shot list', 'Photography session and selection', 'Basic colour correction/retouching', 'High-resolution and web-ready exports'],
        included: ['Shooting', 'Selection', 'Basic colour correction', 'Online delivery as scoped'],
        excluded: ['RAW/unselected files', 'Special studio/location, talent/model, MUA, and custom props', 'Permits, overtime, and out-of-area transport', 'Extra cameras, special lighting, and drone'],
        process: 'The brief, location, references, and shot list are confirmed before production; after shooting, Karsa handles selection, editing, review, and online delivery.',
      },
    },
  },
  {
    slug: 'videography-editing', category: 'film', featured: true, orderIndex: 4,
    showPrice: true, priceType: 'starting_from', startingPrice: 1250000,
    translations: {
      id: {
        title: 'Videography + Editing', eyebrow: 'Bring the brand to life through motion.',
        summary: 'Reels, company profile, campaign video, event highlight, dan editing-only dengan durasi produksi serta output yang dikunci sejak awal.',
        intro: ['Reel / Short Video Essential', 'Business Profile Video', 'Campaign / Brand Video', 'Event Highlight Video', 'Editing-only'],
        whoItsFor: ['Bisnis yang membutuhkan short-form video untuk media sosial', 'Perusahaan yang ingin memperkenalkan profil dan layanan', 'Brand dengan campaign atau launch story', 'Event yang membutuhkan highlight dan vertical snippets'],
        problems: ['Konten motion belum memiliki arah visual dan pesan yang jelas', 'Output video tidak konsisten antar-channel', 'Proses shooting, editing, dan revisi belum memiliki batas scope'],
        deliverables: ['Concept, script/shot-list, atau storyboard sesuai paket', 'Shooting dan direction', 'Editing, color, audio, serta titles/subtitles sesuai scope', 'Final export dalam format yang disepakati'],
        included: ['Production planning', 'Shooting sesuai batas jam paket', 'Editing dan color', 'Revision allowance serta final export'],
        excluded: ['Extra output dan raw footage', 'Multicam dan complex motion graphics', 'Voice-over, talent/model, overtime, dan drone', 'Special production requirements'],
        process: 'Konsep dan output dikunci sebelum produksi, shooting mengikuti shot list, lalu edit direview dalam putaran yang disepakati sebelum final delivery.',
      },
      en: {
        title: 'Videography + Editing', eyebrow: 'Bring the brand to life through motion.',
        summary: 'Reels, company-profile films, campaign videos, event highlights, and editing-only work with production time and outputs confirmed upfront.',
        intro: ['Reel / Short Video Essential', 'Business Profile Video', 'Campaign / Brand Video', 'Event Highlight Video', 'Editing-only'],
        whoItsFor: ['Businesses that need short-form social video', 'Companies introducing their profile and services', 'Brands with a campaign or launch story', 'Events that need a highlight and vertical snippets'],
        problems: ['Motion content lacks a clear visual direction and message', 'Video output is inconsistent across channels', 'Shooting, editing, and revision work has no clear scope boundary'],
        deliverables: ['Package-appropriate concept, script/shot list, or storyboard', 'Shooting and direction', 'Editing, colour, audio, and titles/subtitles as scoped', 'Final exports in agreed formats'],
        included: ['Production planning', 'Shooting within the package-hour limit', 'Editing and colour', 'Revision allowance and final export'],
        excluded: ['Extra outputs and raw footage', 'Multicam and complex motion graphics', 'Voice-over, talent/model, overtime, and drone', 'Special production requirements'],
        process: 'The concept and outputs are confirmed before production, shooting follows the shot list, and the edit is reviewed within the agreed rounds before final delivery.',
      },
    },
  },
]

function pkg({ slug, category = 'solo', price, priceType = 'starting_from', badge = '', featured = false, orderIndex, services: serviceSlugs, id, en, items }) {
  return {
    slug, category, price, priceType, badge, featured, orderIndex, serviceSlugs, items,
    translations: {
      id: { ...id, priceNote: launchPriceNote.id, ctaLabel: 'Mulai Proyek' },
      en: { ...en, priceNote: launchPriceNote.en, ctaLabel: 'Start a Project' },
    },
  }
}

export const packages = [
  pkg({
    slug: 'landing-page', price: 2500000, orderIndex: 1, services: ['website'], badge: 'STARTER',
    id: { title: 'Landing Page', summary: 'Untuk campaign, personal brand, produk, atau bisnis yang membutuhkan satu halaman fokus.', recommendedFor: 'Campaign, personal brand, produk, atau bisnis dengan satu CTA utama.', durationNote: '', revisionNote: '1 putaran revisi; bug teknis dalam approved scope ditangani selama 14 hari setelah handover.' },
    en: { title: 'Landing Page', summary: 'For a campaign, personal brand, product, or business that needs one focused page.', recommendedFor: 'Campaigns, personal brands, products, or businesses with one primary CTA.', durationNote: '', revisionNote: '1 revision round; technical bugs within the approved scope are covered for 14 days after handover.' },
    items: ['1 custom landing page (up to 6 main sections)', 'Responsive desktop-mobile layout', 'WhatsApp / CTA and contact / Maps', 'Basic SEO, QA, deployment, and handover'],
  }),
  pkg({
    slug: 'business-website', price: 4500000, orderIndex: 2, services: ['website'], badge: 'RECOMMENDED', featured: true,
    id: { title: 'Business Website', summary: 'Untuk company profile profesional dan bisnis yang membutuhkan informasi lebih lengkap.', recommendedFor: 'Company profile profesional hingga 5 halaman.', durationNote: '', revisionNote: '2 putaran revisi; bug teknis dalam approved scope ditangani selama 14 hari setelah handover.' },
    en: { title: 'Business Website', summary: 'For a professional company profile and businesses that need more complete information.', recommendedFor: 'A professional company-profile website with up to 5 pages.', durationNote: '', revisionNote: '2 revision rounds; technical bugs within the approved scope are covered for 14 days after handover.' },
    items: ['Up to 5 pages', 'Custom UI layout and responsive development', 'Contact form and analytics basics', 'Basic technical SEO, QA, deployment, and handover'],
  }),
  pkg({
    slug: 'e-commerce-basic', price: 7500000, orderIndex: 3, services: ['website'], badge: 'COMMERCE',
    id: { title: 'E-Commerce Basic', summary: 'Untuk bisnis yang ingin mulai menjual produk secara online dengan alur commerce dasar.', recommendedFor: 'Toko online awal dengan katalog hingga 20 produk.', durationNote: '', revisionNote: '2 putaran revisi; bug implementasi dalam scope ditangani selama 14 hari.' },
    en: { title: 'E-Commerce Basic', summary: 'For businesses starting to sell products online with a foundational commerce flow.', recommendedFor: 'An initial online store with a catalogue of up to 20 products.', durationNote: '', revisionNote: '2 revision rounds; implementation bugs within scope are covered for 14 days.' },
    items: ['Up to 20 products', 'Catalogue, cart, and checkout', 'Basic payment/shipping setup', 'Responsive UI, transaction QA, deployment, and handover'],
  }),
  pkg({
    slug: 'custom-web-system', price: 10000000, orderIndex: 4, services: ['website'], badge: 'CUSTOM',
    id: { title: 'Custom Web / System', summary: 'Untuk dashboard, portal, booking flow, web application, internal tools, atau kebutuhan logic/integrasi khusus.', recommendedFor: 'Workflow, role, modul, dan integrasi khusus yang tidak cocok dengan paket standar.', durationNote: 'Timeline mengikuti requirement dan acceptance criteria final.', revisionNote: 'QA/UAT dan warranty mengikuti acceptance criteria pada quotation.' },
    en: { title: 'Custom Web / System', summary: 'For dashboards, portals, booking flows, web applications, internal tools, or custom logic and integrations.', recommendedFor: 'Custom workflows, roles, modules, and integrations beyond a standard website package.', durationNote: 'Timeline follows the final requirements and acceptance criteria.', revisionNote: 'QA/UAT and warranty follow the acceptance criteria in the quotation.' },
    items: ['Requirement mapping and role/workflow definition', 'Custom interface and development', 'API/integration as scoped', 'QA/UAT, deployment, and core documentation'],
  }),

  pkg({
    slug: 'logo-essentials', price: 1250000, orderIndex: 10, services: ['design'], badge: 'IDENTITY',
    id: { title: 'Logo Essentials', summary: 'Paket identitas awal untuk bisnis yang membutuhkan logo yang lebih serius dan siap dipakai.', recommendedFor: 'Bisnis baru yang membutuhkan fondasi logo profesional.', durationNote: '', revisionNote: '2 putaran revisi terarah; pendaftaran atau kepastian hukum merek tidak termasuk.' },
    en: { title: 'Logo Essentials', summary: 'A foundational identity package for businesses that need a more serious, ready-to-use logo.', recommendedFor: 'New businesses that need a professional logo foundation.', durationNote: '', revisionNote: '2 directed revision rounds; trademark registration or legal clearance is not included.' },
    items: ['2 concept directions', '1 final logo with colour and monochrome versions', 'PNG, JPG, PDF, and SVG exports', 'Basic usage note'],
  }),
  pkg({
    slug: 'brand-identity', price: 2500000, orderIndex: 11, services: ['design'], badge: 'RECOMMENDED', featured: true,
    id: { title: 'Brand Identity', summary: 'Sistem visual yang lebih lengkap untuk menjaga konsistensi di berbagai touchpoint.', recommendedFor: 'Brand yang membutuhkan identitas visual lengkap dan konsisten.', durationNote: '', revisionNote: '2 putaran revisi; aset berlisensi akan diinformasikan.' },
    en: { title: 'Brand Identity', summary: 'A more complete visual system for maintaining consistency across touchpoints.', recommendedFor: 'Brands that need a complete and consistent visual identity.', durationNote: '', revisionNote: '2 revision rounds; licensed assets will be disclosed.' },
    items: ['Logo system', 'Colour palette and typography', 'Graphic direction and profile/social assets', 'Mini brand guideline'],
  }),
  pkg({
    slug: 'social-media-starter', price: 1500000, orderIndex: 12, services: ['design'], badge: 'CONTENT',
    id: { title: 'Social Media Starter', summary: 'Untuk bisnis yang ingin feed dan story terlihat lebih konsisten serta mudah dilanjutkan.', recommendedFor: 'Tim yang membutuhkan sistem template social media yang dapat diedit.', durationNote: '', revisionNote: '2 putaran revisi; performa engagement tidak dapat dijamin.' },
    en: { title: 'Social Media Starter', summary: 'For businesses that want more consistent feed and story visuals that are easy to continue.', recommendedFor: 'Teams that need an editable social-media template system.', durationNote: '', revisionNote: '2 revision rounds; engagement performance cannot be guaranteed.' },
    items: ['1 visual direction', '6 feed templates', '3 story templates', 'Editable files and a short usage guide'],
  }),
  pkg({
    slug: 'campaign-marketing-design', price: 2000000, orderIndex: 13, services: ['design'], badge: 'CAMPAIGN',
    id: { title: 'Campaign / Marketing Design', summary: 'Untuk promo, event, launch, menu, poster, brochure, atau campaign dengan satu visual direction.', recommendedFor: 'Campaign yang membutuhkan key visual dan beberapa ukuran turunan.', durationNote: '', revisionNote: '2 putaran revisi; printing dan adaptation di luar paket dihitung terpisah.' },
    en: { title: 'Campaign / Marketing Design', summary: 'For promotions, events, launches, menus, posters, brochures, or campaigns with one visual direction.', recommendedFor: 'Campaigns that need a key visual and several size adaptations.', durationNote: '', revisionNote: '2 revision rounds; printing and adaptations outside the package are priced separately.' },
    items: ['1 key visual', 'Up to 5 adaptations', 'Digital-ready exports', 'Source-file handover as licensing allows'],
  }),

  pkg({
    slug: 'product-essential', price: 1500000, orderIndex: 20, services: ['photography'], badge: 'PRODUCT',
    id: { title: 'Product Essential', summary: 'Pemotretan produk dasar di satu lokasi agar produk terlihat profesional dan siap jual.', recommendedFor: 'Produk seperti kopi, skincare, makanan, atau barang retail.', durationNote: 'Maksimal 6 jam pemotretan di 1 lokasi.', revisionNote: 'Basic retouch; koreksi file dilakukan bila terdapat kesalahan export.' },
    en: { title: 'Product Essential', summary: 'A foundational one-location product shoot to make products look professional and sales-ready.', recommendedFor: 'Products such as coffee, skincare, food, or retail goods.', durationNote: 'Up to 6 shooting hours at 1 location.', revisionNote: 'Basic retouching; files are corrected if there is an export error.' },
    items: ['Up to 10 products/items', '15 edited photos', 'Basic retouching', 'High-resolution and web-ready online delivery'],
  }),
  pkg({
    slug: 'brand-session', price: 2500000, orderIndex: 21, services: ['photography'], badge: 'RECOMMENDED', featured: true,
    id: { title: 'Brand Session', summary: 'Sesi foto full day untuk profil perusahaan, suasana kerja, tim, layanan, atau interior.', recommendedFor: 'Company profile, team-workspace, service, dan interior coverage.', durationNote: 'Maksimal 8 jam pemotretan di 1 lokasi.', revisionNote: 'Basic retouch; kondisi lokasi, kesiapan talent, dan force majeure dikecualikan.' },
    en: { title: 'Brand Session', summary: 'A full-day session documenting a company profile, workspace, team, services, or interior.', recommendedFor: 'Company-profile, team-workspace, service, and interior coverage.', durationNote: 'Up to 8 shooting hours at 1 location.', revisionNote: 'Basic retouching; location conditions, talent readiness, and force majeure are excluded.' },
    items: ['25 edited photos', 'People and environment coverage', 'Basic retouching', 'High-resolution and web-ready online delivery'],
  }),
  pkg({
    slug: 'campaign-full-day', price: 4000000, orderIndex: 22, services: ['photography'], badge: 'CAMPAIGN',
    id: { title: 'Campaign Full Day', summary: 'Sesi foto full day dengan pengarahan khusus untuk kampanye, peluncuran produk, atau promosi brand.', recommendedFor: 'Campaign dan product launch dengan beberapa setup.', durationNote: 'Maksimal 8 jam pemotretan, multiple setups dalam 1 lokasi.', revisionNote: 'Reshoot karena perubahan brief dikenakan biaya baru.' },
    en: { title: 'Campaign Full Day', summary: 'A full-day directed shoot for a campaign, product launch, or focused brand promotion.', recommendedFor: 'Campaigns and product launches with multiple setups.', durationNote: 'Up to 8 shooting hours with multiple setups at 1 location.', revisionNote: 'A reshoot caused by a changed brief is priced as new work.' },
    items: ['Creative direction and moodboard/shot list', '40 edited photos', 'Advanced selection and retouching', 'High-resolution and web-ready online delivery'],
  }),
  pkg({
    slug: 'event-corporate-documentation', price: 3000000, orderIndex: 23, services: ['photography'], badge: 'EVENT',
    id: { title: 'Event / Corporate Documentation', summary: 'Untuk seminar, gathering, activation, opening, dan dokumentasi kegiatan perusahaan.', recommendedFor: 'Event dan kegiatan perusahaan hingga 4 jam.', durationNote: 'Hingga 4 jam dokumentasi.', revisionNote: 'Key moments pada rundown diprioritaskan selama akses tersedia.' },
    en: { title: 'Event / Corporate Documentation', summary: 'For seminars, gatherings, activations, openings, and corporate-event documentation.', recommendedFor: 'Events and corporate activities lasting up to 4 hours.', durationNote: 'Up to 4 documentation hours.', revisionNote: 'Key moments in the run sheet are prioritised while access is available.' },
    items: ['40-60 edited photos', 'Candid and key-moment coverage', 'Basic colour correction', 'High-resolution, web-ready files, and online gallery'],
  }),

  pkg({
    slug: 'reel-short-video-essential', price: 1250000, orderIndex: 30, services: ['videography-editing'], badge: 'SOCIAL',
    id: { title: 'Reel / Short Video Essential', summary: 'Konten video vertikal untuk Reels, TikTok, product showcase, dan kebutuhan media sosial bisnis.', recommendedFor: 'Short-form vertical content untuk media sosial.', durationNote: 'Maksimal 6 jam shooting.', revisionNote: '1 putaran revisi; musik mengikuti library royalty-free/licensed yang tersedia.' },
    en: { title: 'Reel / Short Video Essential', summary: 'Vertical video content for Reels, TikTok, product showcases, and business social media.', recommendedFor: 'Short-form vertical social content.', durationNote: 'Up to 6 shooting hours.', revisionNote: '1 revision round; music is subject to the available royalty-free/licensed library.' },
    items: ['2-3 vertical videos', '30-60 seconds per video', 'Basic shot direction, edit, and colour', 'Licensed/basic music and simple titles'],
  }),
  pkg({
    slug: 'business-profile-video', price: 2500000, orderIndex: 31, services: ['videography-editing'], badge: 'RECOMMENDED', featured: true,
    id: { title: 'Business Profile Video', summary: 'Video sinematik untuk memperkenalkan profil perusahaan, layanan, workspace, tim, atau founder.', recommendedFor: 'Company profile, service, workspace, team, atau founder story.', durationNote: 'Maksimal 8 jam shooting; video utama 2-3 menit.', revisionNote: '2 putaran revisi; final file diuji untuk playback, audio, subtitle, dan resolusi.' },
    en: { title: 'Business Profile Video', summary: 'A cinematic introduction to a company profile, services, workspace, team, or founder.', recommendedFor: 'A company profile, service, workspace, team, or founder story.', durationNote: 'Up to 8 shooting hours; one 2-3 minute main film.', revisionNote: '2 revision rounds; the final file is tested for playback, audio, subtitles, and resolution.' },
    items: ['Script/shot-list support', 'B-roll and simple interview', 'Edit, colour, and audio clean-up', 'Subtitles and publication-ready final file'],
  }),
  pkg({
    slug: 'campaign-brand-video', price: 4500000, orderIndex: 32, services: ['videography-editing'], badge: 'CAMPAIGN',
    id: { title: 'Campaign / Brand Video', summary: 'Video kampanye dengan jalan cerita dan storyboard untuk launch, promosi, atau brand story.', recommendedFor: 'Launch, promotion, dan brand story dengan editing lebih kompleks.', durationNote: 'Maksimal 8 jam shooting; video utama 60-90 detik.', revisionNote: '2 putaran revisi; perubahan cerita setelah shooting menjadi Change Request.' },
    en: { title: 'Campaign / Brand Video', summary: 'A campaign film with a story and storyboard for a launch, promotion, or brand narrative.', recommendedFor: 'Launches, promotions, and brand stories that need a more complex edit.', durationNote: 'Up to 8 shooting hours; one 60-90 second main film.', revisionNote: '2 revision rounds; story changes after shooting become a Change Request.' },
    items: ['Storyboard and shot list', '1 main video (60-90 seconds)', '2 short videos/cutdowns', 'Advanced edit, colour, sound, and titles/subtitles'],
  }),
  pkg({
    slug: 'event-highlight-video', price: 3000000, orderIndex: 33, services: ['videography-editing'], badge: 'EVENT',
    id: { title: 'Event Highlight Video', summary: 'Untuk event, gathering, opening, seminar, activation, dan corporate documentation dalam format motion.', recommendedFor: 'Event atau corporate activity yang membutuhkan highlight dan snippets.', durationNote: 'Hingga 4 jam shooting; highlight 60-120 detik.', revisionNote: '1 putaran revisi; seluruh file final diuji untuk playback, audio, dan resolusi.' },
    en: { title: 'Event Highlight Video', summary: 'For events, gatherings, openings, seminars, activations, and corporate documentation in motion.', recommendedFor: 'Events or corporate activities that need a highlight and snippets.', durationNote: 'Up to 4 shooting hours; a 60-120 second highlight.', revisionNote: '1 revision round; all final files are tested for playback, audio, and resolution.' },
    items: ['1 highlight video (60-120 seconds)', '2 short vertical snippets', 'Edit, colour, music, and simple titles', 'Publication-ready digital exports'],
  }),

  pkg({
    slug: 'brand-starter', category: 'combo', price: 3500000, orderIndex: 100, services: ['design', 'photography'], badge: 'DESIGN + PHOTO',
    id: { title: 'Brand Starter', summary: 'Logo Essentials dan mini product/brand photo session dalam satu creative direction.', recommendedFor: 'Bisnis yang baru membangun identitas awal.', durationNote: '', revisionNote: 'Deliverable mengikuti scope final dan melewati pengecekan file sebelum handover.' },
    en: { title: 'Brand Starter', summary: 'Logo Essentials and a mini product/brand photo session under one creative direction.', recommendedFor: 'Businesses building their initial identity.', durationNote: '', revisionNote: 'Deliverables follow the final scope and pass file checks before handover.' },
    items: ['Logo system basics', 'Colour and typography direction', 'Mini guideline', '15 edited product/brand photos'],
  }),
  pkg({
    slug: 'digital-presence', category: 'combo', price: 5500000, orderIndex: 101, services: ['website', 'design'], badge: 'WEB + DESIGN',
    id: { title: 'Digital Presence', summary: 'Business Website hingga 5 halaman dan Logo Essentials/visual identity dasar dalam satu alur produksi.', recommendedFor: 'Bisnis yang ingin mulai tampil profesional online.', durationNote: '', revisionNote: 'Fungsi utama diuji dan bug teknis website dalam scope ditangani selama 14 hari.' },
    en: { title: 'Digital Presence', summary: 'A Business Website of up to 5 pages and Logo Essentials/basic visual identity in one production flow.', recommendedFor: 'Businesses starting to present themselves professionally online.', durationNote: '', revisionNote: 'Core functions are tested and in-scope website bugs are covered for 14 days.' },
    items: ['Business Website up to 5 pages', 'Basic SEO, CTA, and contact flow', 'Final logo and colour-typography direction', 'Core identity files'],
  }),
  pkg({
    slug: 'web-visual', category: 'combo', price: 5500000, orderIndex: 102, services: ['website', 'photography'], badge: 'WEB + PHOTO',
    id: { title: 'Web Visual', summary: 'Business Website dan mini brand/product photo session agar website memakai visual bisnis yang autentik.', recommendedFor: 'Bisnis yang membutuhkan website serta aset foto autentik.', durationNote: '', revisionNote: 'Foto dioptimalkan untuk website; fungsi utama diuji dan bug teknis ditangani selama 14 hari.' },
    en: { title: 'Web Visual', summary: 'A Business Website and mini brand/product photo session so the website uses authentic business visuals.', recommendedFor: 'Businesses that need a website with authentic photo assets.', durationNote: '', revisionNote: 'Photos are optimised for the website; core functions are tested and technical bugs are covered for 14 days.' },
    items: ['Business Website up to 5 pages', 'Visual planning', '15-25 edited photos as scoped', 'Website-optimised image delivery'],
  }),
  pkg({
    slug: 'content-starter', category: 'combo', price: 5900000, orderIndex: 103, services: ['design', 'photography', 'videography-editing'], badge: 'DESIGN + PHOTO + VIDEO',
    id: { title: 'Content Starter', summary: 'Social Media Starter, mini brand photo session, dan short-form video dalam satu hari produksi terencana.', recommendedFor: 'Brand yang membutuhkan starter content lintas format.', durationNote: 'Produksi terencana dalam satu hari sesuai scope.', revisionNote: 'Seluruh aset memakai satu visual direction; performa konten tidak dijamin.' },
    en: { title: 'Content Starter', summary: 'Social Media Starter, a mini brand photo session, and short-form video in one planned production day.', recommendedFor: 'Brands that need starter content across multiple formats.', durationNote: 'One planned production day as scoped.', revisionNote: 'All assets use one visual direction; content performance is not guaranteed.' },
    items: ['9 social-media templates', '15 edited photos', '2-3 vertical videos (30-60 seconds)', 'Platform-ready delivery'],
  }),
  pkg({
    slug: 'full-presence', category: 'combo', price: 7500000, orderIndex: 104, services: ['website', 'design', 'photography'], badge: 'WEB + DESIGN + PHOTO',
    id: { title: 'Full Presence', summary: 'Business Website, Brand Identity essentials, dan Brand Session dalam satu creative direction.', recommendedFor: 'Bisnis yang ingin website, identity, dan photography terasa konsisten sejak awal.', durationNote: '', revisionNote: 'Website diuji serta mendapat 14 hari technical bug warranty dalam scope.' },
    en: { title: 'Full Presence', summary: 'A Business Website, Brand Identity essentials, and Brand Session under one creative direction.', recommendedFor: 'Businesses that want website, identity, and photography to feel consistent from day one.', durationNote: '', revisionNote: 'The website is tested and includes a 14-day in-scope technical bug warranty.' },
    items: ['Business Website up to 5 pages', 'Basic identity system and mini guideline', '25 edited brand photos', 'One coordinated creative direction'],
  }),
  pkg({
    slug: 'full-presence-motion', category: 'combo', price: 9900000, orderIndex: 105, services: ['website', 'design', 'photography', 'videography-editing'], badge: 'WEB + DESIGN + PHOTO + VIDEO', featured: true,
    id: { title: 'Full Presence Motion', summary: 'Business Website, Brand Identity, Brand Session, serta Business Profile/Reel Video yang diproduksi terintegrasi.', recommendedFor: 'Paket paling lengkap untuk presence awal.', durationNote: '', revisionNote: 'Seluruh touchpoint memakai satu creative direction; technical bug warranty website berlaku 14 hari.' },
    en: { title: 'Full Presence Motion', summary: 'A Business Website, Brand Identity, Brand Session, and Business Profile/Reel Video produced as one system.', recommendedFor: 'The most complete package for an initial brand presence.', durationNote: '', revisionNote: 'Every touchpoint uses one creative direction; the website technical bug warranty lasts 14 days.' },
    items: ['Business Website up to 5 pages', 'Identity system and mini guideline', '25 edited photos', '1 profile video (2-3 minutes) or 2-3 Reels as scoped'],
  }),
  pkg({
    slug: 'commerce-complete', category: 'combo', price: 12500000, orderIndex: 106, services: ['website', 'design', 'photography', 'videography-editing'], badge: 'E-COMMERCE + CREATIVE',
    id: { title: 'Commerce Complete', summary: 'E-Commerce Basic, identity essentials, product photography, dan launch/Reel video dalam satu production plan.', recommendedFor: 'Brand yang meluncurkan toko online beserta aset kreatif awal.', durationNote: '', revisionNote: 'Alur commerce dalam scope diuji; layanan provider pihak ketiga dikecualikan.' },
    en: { title: 'Commerce Complete', summary: 'E-Commerce Basic, identity essentials, product photography, and launch/Reel video in one production plan.', recommendedFor: 'Brands launching an online store with its initial creative assets.', durationNote: '', revisionNote: 'The in-scope commerce flow is tested; third-party provider services are excluded.' },
    items: ['Online store with up to 20 products', 'Basic identity system', '15 edited product photos', '2-3 vertical launch videos'],
  }),

  pkg({
    slug: 'website-care-basic', category: 'maintenance', priceType: 'monthly', price: 500000, orderIndex: 200, services: ['website'], badge: 'MONTHLY',
    id: { title: 'Website Care Basic', summary: 'Untuk website yang sudah launch dan membutuhkan technical upkeep ringan.', recommendedFor: 'Website dengan kebutuhan monitoring dan update minor.', durationNote: 'Alokasi maksimal 1 support hour per bulan.', revisionNote: 'Request ditangani sesuai antrean dan jam paket; fitur baru berada di luar scope.' },
    en: { title: 'Website Care Basic', summary: 'For a launched website that needs light technical upkeep.', recommendedFor: 'Websites that need monitoring and minor updates.', durationNote: 'Up to 1 support hour per month.', revisionNote: 'Requests follow the queue and package hours; new features are outside scope.' },
    items: ['Basic monitoring', 'Minor updates', 'Bug support', 'Work notes and completion confirmation'],
  }),
  pkg({
    slug: 'website-care-plus', category: 'maintenance', priceType: 'monthly', price: 1000000, orderIndex: 201, services: ['website'], badge: 'MONTHLY',
    id: { title: 'Website Care Plus', summary: 'Untuk bisnis yang membutuhkan maintenance lebih aktif dan minor improvements.', recommendedFor: 'Website aktif dengan update konten minor dan priority support.', durationNote: 'Alokasi maksimal 3 support hours per bulan.', revisionNote: 'Request dikonfirmasi scope dan estimasinya; sisa jam tidak otomatis terakumulasi.' },
    en: { title: 'Website Care Plus', summary: 'For businesses that need more active maintenance and minor improvements.', recommendedFor: 'Active websites with minor content updates and priority support.', durationNote: 'Up to 3 support hours per month.', revisionNote: 'Each request has its scope and estimate confirmed; unused hours do not automatically roll over.' },
    items: ['Monitoring and backup', 'Minor content updates', 'Priority support', 'Monthly work summary'],
  }),
  pkg({
    slug: 'creative-care', category: 'maintenance', priceType: 'monthly', price: 1500000, orderIndex: 202, services: ['website', 'design'], badge: 'MONTHLY', featured: true,
    id: { title: 'Creative Care', summary: 'Untuk kebutuhan minor website dan ongoing design/content support.', recommendedFor: 'Bisnis yang membutuhkan upkeep website dan adaptation kreatif bulanan.', durationNote: 'Alokasi maksimal 5 support/creative hours per bulan.', revisionNote: 'Foto/video production, campaign baru, dan pekerjaan di luar alokasi menjadi quotation terpisah.' },
    en: { title: 'Creative Care', summary: 'For minor website needs and ongoing design/content support.', recommendedFor: 'Businesses that need website upkeep and monthly creative adaptations.', durationNote: 'Up to 5 support/creative hours per month.', revisionNote: 'Photo/video production, new campaigns, and work beyond the allocation receive a separate quotation.' },
    items: ['Website upkeep', 'Minor design requests', 'Content adaptation', 'Priority-based monthly delivery'],
  }),
]

export const managedServiceSlugs = services.map(service => service.slug)
export const legacyServiceSlugs = [
  'web-development', 'ecommerce', 'maintenance-support', 'ui-ux-design', 'custom-software', 'web-application',
]

export function validatePricingData() {
  const serviceSlugs = new Set(services.map(service => service.slug))
  const packageSlugs = new Set(packages.map(packageData => packageData.slug))

  if (serviceSlugs.size !== services.length) throw new Error('Duplicate service slug in pricing data.')
  if (packageSlugs.size !== packages.length) throw new Error('Duplicate package slug in pricing data.')

  for (const packageData of packages) {
    if (!Number.isFinite(packageData.price) || packageData.price < 0) {
      throw new Error(`Invalid price for package "${packageData.slug}".`)
    }
    if (packageData.items.length === 0 || packageData.items.length > 30) {
      throw new Error(`Package "${packageData.slug}" must contain between 1 and 30 items.`)
    }
    for (const serviceSlug of packageData.serviceSlugs) {
      if (!serviceSlugs.has(serviceSlug)) {
        throw new Error(`Package "${packageData.slug}" references unknown service "${serviceSlug}".`)
      }
    }
    for (const [locale, translation] of Object.entries(packageData.translations)) {
      if (!translation.title || translation.title.length > 150) throw new Error(`Invalid ${locale} title for "${packageData.slug}".`)
      if (translation.summary.length > 500) throw new Error(`Invalid ${locale} summary for "${packageData.slug}".`)
      if (translation.priceNote.length > 200) throw new Error(`Invalid ${locale} price note for "${packageData.slug}".`)
      if (translation.recommendedFor.length > 300) throw new Error(`Invalid ${locale} recommendation for "${packageData.slug}".`)
      if (translation.durationNote.length > 150) throw new Error(`Invalid ${locale} duration note for "${packageData.slug}".`)
      if (translation.revisionNote.length > 150) throw new Error(`Invalid ${locale} revision note for "${packageData.slug}".`)
    }
  }
}
