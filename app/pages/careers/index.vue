<script setup lang="ts">
import type { CareerApiItem } from '../../../server/api/careers/index.get'

const { t, locale } = useI18n()
const localePath = useLocalePath()

const { data: careers } = await useAsyncData(`careers-listing-${locale.value}`, () =>
  $fetch<CareerApiItem[]>('/api/careers', { query: { locale: locale.value } }),
)

useSeoMeta({
  title: t('careersIndex.title'),
  description: t('careersIndex.metaDescription'),
})
</script>

<template>
  <div>
    <BaseSection
      tight
      class="pt-32"
    >
      <BaseHeading
        :eyebrow="t('careersIndex.eyebrow')"
        size="display-2"
        as="h1"
      >
        {{ t('careersIndex.title') }}
      </BaseHeading>
      <p class="mt-6 max-w-xl text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
        {{ t('careersIndex.description') }}
      </p>
    </BaseSection>

    <BaseSection
      tight
      class="border-t border-[var(--color-border)]"
    >
      <p
        v-if="!careers?.length"
        class="max-w-md text-[var(--color-text-muted)]"
      >
        {{ t('careersIndex.empty') }}
      </p>

      <ul
        v-else
        class="flex flex-col divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]"
      >
        <li
          v-for="career in careers"
          :key="career.slug"
        >
          <NuxtLink
            :to="localePath(career.path)"
            class="group flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 class="font-display text-xl font-medium group-hover:text-[var(--color-accent)]">
                {{ career.title }}
              </h2>
              <p class="mt-1 text-sm text-[var(--color-text-muted)]">
                {{ [career.department, career.location, career.workMode, career.employmentType].filter(Boolean).join(' · ') }}
              </p>
            </div>
            <span class="text-sm font-medium text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)]">
              {{ t('careersIndex.viewRole') }} →
            </span>
          </NuxtLink>
        </li>
      </ul>
    </BaseSection>

    <FinalCTA />
  </div>
</template>
