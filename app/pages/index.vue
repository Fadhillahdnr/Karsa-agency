<script setup lang="ts">
import type { PublicPageSection } from '../../server/api/pages/[slug]/sections.get'
import type { PageSectionComponentType } from '../../server/utils/supabase'

const { site } = useKarsaConfig()

useSeoMeta({
  title: () => site.value.title,
  description: () => site.value.description,
  ogTitle: () => `${site.value.name} — ${site.value.title}`,
  ogDescription: () => site.value.description,
})

// Section order/visibility is admin-managed (see /admin/content/home,
// master prompt §33/§50) — DeliveryTrust/CapabilitiesSection ride along
// inside the process/service_grid slots (see ServiceGridSection.vue,
// ProcessSection.vue) since they aren't their own approved component_type.
const componentMap: Record<PageSectionComponentType, ReturnType<typeof resolveComponent>> = {
  hero: resolveComponent('HeroSection'),
  client_logos: resolveComponent('ClientLogos'),
  brand_statement: resolveComponent('BrandStatement'),
  service_grid: resolveComponent('ServiceGridSection'),
  integrated_package: resolveComponent('FullPresence'),
  featured_work: resolveComponent('SelectedWork'),
  why_karsa: resolveComponent('WhyKarsa'),
  process: resolveComponent('ProcessSection'),
  testimonials: resolveComponent('TestimonialsSection'),
  insights: resolveComponent('InsightsHook'),
  updates: resolveComponent('UpdatesHook'),
  faq: resolveComponent('FaqHook'),
  cta: resolveComponent('FinalCTA'),
}

// Fallback order if the 'home' page_sections rows are ever missing
// (fresh database, migration not yet seeded) — never render a blank page.
const fallbackSections: PublicPageSection[] = [
  { sectionKey: 'hero', componentType: 'hero', themeVariant: null },
  { sectionKey: 'brand_statement', componentType: 'brand_statement', themeVariant: null },
  { sectionKey: 'service_grid', componentType: 'service_grid', themeVariant: null },
  { sectionKey: 'featured_work', componentType: 'featured_work', themeVariant: null },
  { sectionKey: 'why_karsa', componentType: 'why_karsa', themeVariant: null },
  { sectionKey: 'process', componentType: 'process', themeVariant: null },
  { sectionKey: 'cta', componentType: 'cta', themeVariant: null },
]

const { data: sections } = await useAsyncData('home-sections', () =>
  $fetch<PublicPageSection[]>('/api/pages/home/sections'),
)

const activeSections = computed(() => sections.value?.length ? sections.value : fallbackSections)

const forcedThemes = new Set(['light', 'dark', 'neutral'])

/** 'auto' (or unset) means "inherit the site-wide theme" — no override attribute. */
function themeAttr(themeVariant: string | null) {
  return themeVariant && forcedThemes.has(themeVariant) ? themeVariant : undefined
}
</script>

<template>
  <div>
    <component
      :is="componentMap[section.componentType]"
      v-for="section in activeSections"
      :key="section.sectionKey"
      :data-theme="themeAttr(section.themeVariant)"
      class="bg-[var(--color-bg)]"
    />
  </div>
</template>
