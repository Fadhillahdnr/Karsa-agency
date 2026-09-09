<script setup lang="ts">
import type { ServiceDetailApiItem } from '../../../server/api/services/[slug].get'
import type { WorkApiItem } from '../../../server/api/work/index.get'

const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const slug = route.params.slug as string

const { data: service } = await useAsyncData(`service-${slug}-${locale.value}`, () =>
  $fetch<ServiceDetailApiItem | null>(`/api/services/${slug}`, { query: { locale: locale.value } }),
)

if (!service.value) {
  throw createError({ statusCode: 404, statusMessage: 'Service not found', fatal: true })
}

const { data: relatedWork } = await useAsyncData(`service-related-work-${slug}`, async () => {
  const all = await $fetch<WorkApiItem[]>('/api/work')
  const matched = all.filter(item => item.services.some(s => s.toLowerCase() === service.value!.title.toLowerCase()))
  return matched.length ? matched.slice(0, 2) : all.slice(0, 2)
})

useSeoMeta({
  title: service.value.seoTitle || service.value.title,
  description: service.value.seoDescription || service.value.summary || undefined,
  ogTitle: service.value.title,
  ogDescription: service.value.summary || undefined,
})

useSchemaOrg([
  defineService({
    name: service.value.title,
    description: service.value.summary || undefined,
    serviceType: service.value.title,
    provider: { '@type': 'Organization', 'name': 'Karsa Agency' },
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'Services', item: '/services' },
      { name: service.value.title },
    ],
  }),
])

const { track } = useAnalytics()
onMounted(() => track('service_view', { service: slug }))
</script>

<template>
  <div v-if="service">
    <BaseSection
      tight
      class="pt-32"
    >
      <p class="text-eyebrow">
        {{ t(`servicesIndex.categories.${service.category}`) }}
      </p>
      <BaseHeading
        size="display-2"
        as="h1"
        class="mt-4"
      >
        {{ service.title }}
      </BaseHeading>
      <p
        v-if="service.summary"
        class="mt-6 max-w-xl text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]"
      >
        {{ service.summary }}
      </p>
      <p
        v-if="service.showPrice && service.startingPrice"
        class="mt-4 text-sm text-[var(--color-text-muted)]"
      >
        {{ service.priceType === 'starting_from' ? t('packagesIndex.startingFrom') : '' }}
        {{ service.currency }} {{ service.startingPrice.toLocaleString(locale) }}
        {{ service.priceType === 'monthly' ? t('packagesIndex.monthly') : '' }}
      </p>
      <div class="mt-10">
        <BaseButton to="/start-a-project">
          {{ t('serviceDetail.start') }} ↗
        </BaseButton>
      </div>
    </BaseSection>

    <BaseSection
      v-if="service.whoItsFor.length || service.problems.length"
      tight
      class="grid grid-cols-1 gap-12 border-t border-[var(--color-border)] pt-16 md:grid-cols-2"
    >
      <div v-if="service.whoItsFor.length">
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
      <div v-if="service.problems.length">
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
      v-if="service.intro.length || service.process"
      tight
      narrow
      class="border-t border-[var(--color-border)]"
    >
      <div
        v-if="service.intro.length"
        class="prose prose-invert max-w-none prose-headings:font-display prose-headings:font-medium prose-p:text-[var(--color-text-muted)] prose-li:text-[var(--color-text-muted)]"
      >
        <ul>
          <li
            v-for="item in service.intro"
            :key="item"
          >
            {{ item }}
          </li>
        </ul>
      </div>
      <p
        v-if="service.process"
        class="mt-8 text-sm text-[var(--color-text-muted)]"
      >
        {{ service.process }}
      </p>
    </BaseSection>

    <BaseSection
      v-if="service.deliverables.length"
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
      v-if="service.faqs.length"
      tight
      class="border-t border-[var(--color-border)]"
    >
      <p class="text-eyebrow mb-6">
        {{ t('serviceDetail.faq') }}
      </p>
      <div class="flex flex-col divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
        <details
          v-for="item in service.faqs"
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
