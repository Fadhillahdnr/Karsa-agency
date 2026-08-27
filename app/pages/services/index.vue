<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { data: services } = await useAsyncData(`services-listing-${locale.value}`, () =>
  queryCollection(locale.value === 'id' ? 'servicesId' : 'services').order('order', 'ASC').all(),
)

// Stable English identifiers matching content.config.ts's `pillar` enum —
// content frontmatter is filtered against these regardless of locale.
const pillarKeys = ['Design', 'Build', 'Grow'] as const
const pillarsData = useTmList<{ name: string }[]>('servicesPillars.pillars')
const pillarLabels = computed(() => pillarsData.value.map(p => p.name))

useSeoMeta({
  title: t('servicesIndex.title'),
  description: t('servicesIndex.metaDescription'),
})
</script>

<template>
  <div>
    <BaseSection
      tight
      class="pt-32"
    >
      <BaseHeading
        :eyebrow="t('servicesIndex.eyebrow')"
        size="display-2"
        as="h1"
      >
        {{ t('servicesIndex.title') }}
      </BaseHeading>
      <p class="mt-6 max-w-xl text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
        {{ t('servicesIndex.description') }}
      </p>
    </BaseSection>

    <BaseSection
      v-for="(pillar, i) in pillarKeys"
      :key="pillar"
      tight
      class="pt-0"
    >
      <p class="text-eyebrow mb-6">
        {{ pillarLabels[i] }}
      </p>
      <div class="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-border)] sm:grid-cols-2">
        <NuxtLink
          v-for="service in services?.filter((s) => s.pillar === pillar)"
          :key="service.path"
          :to="localePath(service.path)"
          class="group bg-[var(--color-bg)] p-8 transition-colors duration-[var(--duration-base)] hover:bg-[var(--color-accent-soft)]"
        >
          <h2 class="font-display text-2xl font-medium">
            {{ service.title }}
          </h2>
          <p class="mt-3 text-sm text-[var(--color-text-muted)]">
            {{ service.summary }}
          </p>
          <span class="mt-6 inline-flex items-center gap-1.5 text-sm font-medium group-hover:text-[var(--color-accent)]">
            {{ t('common.learnMore') }} <span aria-hidden="true">↗</span>
          </span>
        </NuxtLink>
      </div>
    </BaseSection>

    <FinalCTA />
  </div>
</template>
