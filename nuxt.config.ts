import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/eslint',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    'nuxt-schema-org',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
  ],

  components: [{ path: '~/components', pathPrefix: false }],
  devtools: { enabled: true },

  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/brand/favicon.svg' }],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  css: ['~/assets/css/main.css'],

  vue: {
    compilerOptions: {
      isCustomElement: tag => tag.startsWith('Tres') && tag !== 'TresCanvas',
    },
  },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://karsa-agency.vercel.app',
    name: 'Karsa Agency',
  },

  // Light/dark/system theme (see app/assets/css/tokens.css for the token
  // values). `dataValue` writes `data-theme="light|dark"` on <html>, which
  // is what tokens.css keys off of — not Tailwind's `.dark` class strategy,
  // to match this repo's existing CSS-custom-property token system.
  colorMode: {
    preference: 'system',
    fallback: 'light',
    dataValue: 'theme',
    classSuffix: '',
    storageKey: 'karsa-color-mode',
  },

  content: {
    build: {
      markdown: {
        toc: { depth: 2 },
      },
    },
  },

  runtimeConfig: {
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
    turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY || '',
    resendApiKey: process.env.RESEND_API_KEY || '',
    resendFromEmail: process.env.RESEND_FROM_EMAIL || '',
    karsaInquiryEmail: process.env.KARSA_INQUIRY_EMAIL || '',
    supabaseUrl: process.env.SUPABASE_URL || '',
    public: {
      // Same fallback domain as `site.url`/`i18n.baseUrl` above — these three
      // all read NUXT_PUBLIC_SITE_URL and must never disagree when it's
      // unset, since absolute URLs (og:image, sitemap, schema.org) are built
      // from whichever one a given call site happens to use.
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://karsa-agency.vercel.app',
      turnstileSiteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY || '',
      gaMeasurementId: process.env.NUXT_PUBLIC_GA_MEASUREMENT_ID || '',
      // Anon key is safe to expose: it only authenticates against Supabase
      // Auth (admin login) and Storage upload policies, both RLS-gated.
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || '',
    },
  },

  routeRules: {
    '/privacy': { prerender: true },
    // /studio was renamed to /about (Karsa Agency repositioning, see
    // app/pages/about.vue). Redirect both locale forms — 'id' is the
    // unprefixed default locale (see i18n config below), 'en' is prefixed —
    // to preserve any indexed/bookmarked /studio links. Old /id/studio
    // links are handled generically by server/middleware/
    // legacy-id-prefix-redirect.ts (redirects to /studio first, which then
    // hits this rule).
    '/studio': { redirect: { to: '/about', statusCode: 301 } },
    '/en/studio': { redirect: { to: '/en/about', statusCode: 301 } },
    // Admin panel is behind Supabase Auth and rendered client-only — no
    // point prerendering/indexing an auth-gated dashboard. The admin panel
    // is intentionally not localized (see i18n config below), but
    // prefix_except_default still generates a /en/admin/** alias for every
    // page, so both forms need this rule.
    '/admin/**': { ssr: false, robots: false },
    '/en/admin/**': { ssr: false, robots: false },
    // Server API routes are never meant to be crawled — disallow the
    // whole /api/** tree explicitly for certainty (§73 singles out
    // /api/admin, which this also covers).
    '/api/**': { robots: false },
  },

  experimental: {
    payloadExtraction: true,
  },
  compatibilityDate: '2025-07-15',

  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        },
      },
    },
  },

  vite: {
    plugins: [tailwindcss()],
    // Docker Desktop's bind mounts don't reliably forward native fsevents
    // from the macOS/Windows host into the Linux container, so Vite's
    // watcher never sees file changes there. Polling works everywhere but
    // costs CPU, so it's opt-in via CHOKIDAR_USEPOLLING (set by
    // docker-compose.yml) rather than always-on for native host dev.
    server: {
      watch: process.env.CHOKIDAR_USEPOLLING === 'true'
        ? { usePolling: true, interval: 100 }
        : undefined,
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  i18n: {
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://karsa-agency.vercel.app',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'id', language: 'id-ID', name: 'Indonesia', file: 'id.json' },
    ],
    // §11/master-prompt default-locale: 'id' serves at the bare path,
    // 'en' is prefixed at /en/... — was 'en' as default (Milestone 01-11
    // deliberately deferred flipping this, see the CMS revamp progress
    // memory) until Milestone 13 swapped it, paired with
    // server/middleware/legacy-id-prefix-redirect.ts so old /id/** URLs
    // 301 instead of 404.
    defaultLocale: 'id',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'karsa_locale',
      redirectOn: 'root',
    },
  },

  image: {
    format: ['webp', 'avif'],
  },

  // §73 — without this, routeRules' `robots: false` (below) only sets the
  // X-Robots-Tag header per-page; it never turns into an actual
  // robots.txt Disallow line, which is what "/admin -> disallow" means.
  robots: {
    disallowNonIndexableRoutes: true,
  },

  // §72 — file-based routes (home, /services, /packages, /work, etc.) are
  // discovered automatically; this adds the DB-backed detail slugs those
  // index pages link to (services/work/insights/updates/careers/
  // design+photography+videography), published-only, EN+ID both.
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    autoLastmod: true,
  },
})
