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
  ],

  components: [{ path: '~/components', pathPrefix: false }],
  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
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
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://karsastudio.com',
    name: 'Karsa Studio',
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
    turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY || '',
    resendApiKey: process.env.RESEND_API_KEY || '',
    resendFromEmail: process.env.RESEND_FROM_EMAIL || '',
    karsaInquiryEmail: process.env.KARSA_INQUIRY_EMAIL || '',
    supabaseUrl: process.env.SUPABASE_URL || '',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://karsastudio.com',
      turnstileSiteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY || '',
      gaMeasurementId: process.env.NUXT_PUBLIC_GA_MEASUREMENT_ID || '',
    },
  },

  routeRules: {
    '/privacy': { prerender: true },
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

  image: {
    format: ['webp', 'avif'],
  },
})
