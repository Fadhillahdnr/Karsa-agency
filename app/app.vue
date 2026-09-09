<script setup lang="ts">
const { site } = useKarsaConfig()
const i18nHead = useLocaleHead()
const { public: publicConfig } = useRuntimeConfig()
// og:image must be an absolute URL for social crawlers to fetch it — a
// site-relative path silently fails to unfurl on most platforms.
const defaultOgImage = `${publicConfig.siteUrl}/og/default.png`

useHead(() => ({
  titleTemplate: title => (title ? `${title} — ${site.value.name}` : `${site.value.name} — ${site.value.title}`),
  htmlAttrs: i18nHead.value.htmlAttrs,
  link: i18nHead.value.link,
  meta: i18nHead.value.meta,
}))

useSeoMeta({
  ogSiteName: () => site.value.name,
  twitterCard: 'summary_large_image',
  // Site-wide fallback so every page has a social-preview image even
  // without a specific cover (pages with a real cover/og media asset
  // override this with their own ogImage call — see insights/services/
  // work detail pages). public/og/default.png is a minimal wordmark+
  // tagline card built from the real brand tokens (tokens.css) — not a
  // polished marketing asset. TODO: business input — swap in a proper
  // designed 1200x630 card when one exists.
  ogImage: defaultOgImage,
})

useSchemaOrg([
  defineOrganization({
    name: () => site.value.name,
    description: () => site.value.description,
    url: useRuntimeConfig().public.siteUrl,
    logo: '/brand/karsa-mark.svg',
  }),
  defineWebSite({
    name: () => site.value.name,
    description: () => site.value.description,
  }),
])

// Signals client-side hydration completion for e2e tests, which otherwise
// risk clicking before Vue's event listeners attach (SSR already rendered
// the markup, so the DOM exists and looks interactive before it truly is).
const hydrated = ref(false)
onMounted(() => {
  hydrated.value = true
})
</script>

<template>
  <div :data-hydrated="hydrated">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition:
    opacity var(--duration-base) var(--ease-out),
    transform var(--duration-base) var(--ease-out);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
