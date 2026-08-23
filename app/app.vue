<script setup lang="ts">
const { site } = useKarsaConfig()

useHead({
  titleTemplate: title => (title ? `${title} — ${site.name}` : `${site.name} — ${site.title}`),
  htmlAttrs: { lang: 'en' },
})

useSeoMeta({
  ogSiteName: site.name,
  twitterCard: 'summary_large_image',
})

useSchemaOrg([
  defineOrganization({
    name: site.name,
    description: site.description,
    url: useRuntimeConfig().public.siteUrl,
    logo: '/brand/karsa-mark.svg',
  }),
  defineWebSite({
    name: site.name,
    description: site.description,
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
