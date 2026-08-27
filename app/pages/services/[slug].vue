<script setup lang="ts">
const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const path = `/services/${route.params.slug}`
const servicesCollection = computed(() => locale.value === 'id' ? 'servicesId' : 'services')
const workCollection = computed(() => locale.value === 'id' ? 'workId' : 'work')

const { data: service } = await useAsyncData(`service-${route.params.slug}-${locale.value}`, () =>
  queryCollection(servicesCollection.value).path(path).first(),
)

if (!service.value) {
  throw createError({ statusCode: 404, statusMessage: 'Service not found', fatal: true })
}

const { data: relatedWork } = await useAsyncData(`service-related-work-${route.params.slug}-${locale.value}`, async () => {
  const all = await queryCollection(workCollection.value).order('order', 'ASC').all()
  const matched = all.filter(item => item.services.includes(service.value!.title))
  return matched.length ? matched : all.slice(0, 2)
})

useSeoMeta({
  title: service.value?.title,
  description: service.value?.summary,
  ogTitle: service.value?.title,
  ogDescription: service.value?.summary,
})

useSchemaOrg([
  defineService({
    name: service.value!.title,
    description: service.value!.summary,
    serviceType: service.value!.title,
    provider: { '@type': 'Organization', 'name': 'Karsa Studio' },
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'Services', item: '/services' },
      { name: service.value!.title },
    ],
  }),
])

const { track } = useAnalytics()
onMounted(() => track('service_view', { service: route.params.slug as string }))

// Stable English identifiers matching content.config.ts's `pillar` enum —
// `service.pillar` itself is never translated (see services/index.vue).
const pillarKeys = ['Design', 'Build', 'Grow'] as const
const pillarsData = useTmList<{ name: string }[]>('servicesPillars.pillars')
const pillarLabel = computed(() => {
  const index = pillarKeys.indexOf(service.value!.pillar as typeof pillarKeys[number])
  return pillarsData.value[index]?.name ?? service.value!.pillar
})
</script>

<template>
  <div v-if="service">
    <BaseSection
      tight
      class="pt-32"
    >
      <p class="text-eyebrow">
        {{ pillarLabel }}
      </p>
      <BaseHeading
        size="display-2"
        as="h1"
        class="mt-4"
      >
        {{ service.title }}
      </BaseHeading>
      <p class="mt-6 max-w-xl text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
        {{ service.summary }}
      </p>
      <div class="mt-10">
        <BaseButton to="/start-a-project">
          {{ t('serviceDetail.start') }} ↗
        </BaseButton>
      </div>
    </BaseSection>

    <BaseSection
      tight
      class="grid grid-cols-1 gap-12 border-t border-[var(--color-border)] pt-16 md:grid-cols-2"
    >
      <div>
        <p class="text-eyebrow mb-4">
          {{ t('serviceDetail.whoItsFor') }}
        </p>
        <ul class="flex flex-col gap-3">
          <li
            v-for="item in service.whoItsFor"
            :key="item"
            class="flex items-start gap-3 text-sm text-[var(--color-text-muted)]"
          >
            <span
              aria-hidden="true"
              class="mt-1 text-[var(--color-accent)]"
            >—</span>{{ item }}
          </li>
        </ul>
      </div>
      <div>
        <p class="text-eyebrow mb-4">
          {{ t('serviceDetail.businessProblems') }}
        </p>
        <ul class="flex flex-col gap-3">
          <li
            v-for="item in service.problems"
            :key="item"
            class="flex items-start gap-3 text-sm text-[var(--color-text-muted)]"
          >
            <span
              aria-hidden="true"
              class="mt-1 text-[var(--color-accent)]"
            >—</span>{{ item }}
          </li>
        </ul>
      </div>
    </BaseSection>

    <BaseSection
      tight
      narrow
    >
      <div class="prose prose-invert max-w-none prose-headings:font-display prose-headings:font-medium prose-p:text-[var(--color-text-muted)] prose-li:text-[var(--color-text-muted)]">
        <ContentRenderer :value="service" />
      </div>
    </BaseSection>

    <BaseSection
      tight
      class="border-t border-[var(--color-border)]"
    >
      <p class="text-eyebrow mb-6">
        {{ t('serviceDetail.deliverables') }}
      </p>
      <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <li
          v-for="item in service.deliverables"
          :key="item"
          class="rounded-[var(--radius-md)] border border-[var(--color-border)] p-5 text-sm text-[var(--color-text-muted)]"
        >
          {{ item }}
        </li>
      </ul>
    </BaseSection>

    <BaseSection
      v-if="relatedWork?.length"
      tight
      class="border-t border-[var(--color-border)]"
    >
      <p class="text-eyebrow mb-6">
        {{ t('serviceDetail.relatedWork') }}
      </p>
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <NuxtLink
          v-for="project in relatedWork"
          :key="project.path"
          :to="localePath(project.path)"
          class="group"
        >
          <div class="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)]">
            <NuxtImg
              :src="project.cover"
              :alt="`${project.title} project cover`"
              width="1200"
              height="750"
              loading="lazy"
              class="aspect-[16/10] w-full object-cover transition-transform duration-[var(--duration-slow)] group-hover:scale-[1.03]"
            />
          </div>
          <p class="mt-4 font-display text-xl font-medium">
            {{ project.title }}
          </p>
        </NuxtLink>
      </div>
    </BaseSection>

    <BaseSection
      v-if="service.faq?.length"
      tight
      class="border-t border-[var(--color-border)]"
    >
      <p class="text-eyebrow mb-6">
        {{ t('serviceDetail.faq') }}
      </p>
      <div class="flex flex-col divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
        <details
          v-for="item in service.faq"
          :key="item.question"
          class="group py-6"
        >
          <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-medium">
            {{ item.question }}
            <span
              aria-hidden="true"
              class="text-[var(--color-text-muted)] transition-transform duration-[var(--duration-base)] group-open:rotate-45"
            >+</span>
          </summary>
          <p class="mt-4 text-sm text-[var(--color-text-muted)]">
            {{ item.answer }}
          </p>
        </details>
      </div>
    </BaseSection>

    <FinalCTA />
  </div>
</template>
