<script setup lang="ts">
import type { CompanyUpdateApiItem } from '../../../server/api/updates/index.get'

const { t, locale } = useI18n()
const localePath = useLocalePath()

const { data: updates } = await useAsyncData(`updates-listing-${locale.value}`, () =>
  $fetch<CompanyUpdateApiItem[]>('/api/updates', { query: { locale: locale.value } }),
)

useSeoMeta({
  title: t('updatesIndex.title'),
  description: t('updatesIndex.metaDescription'),
})
</script>

<template>
  <div>
    <BaseSection
      tight
      class="pt-32"
    >
      <BaseHeading
        :eyebrow="t('updatesIndex.eyebrow')"
        size="display-2"
        as="h1"
      >
        {{ t('updatesIndex.title') }}
      </BaseHeading>
    </BaseSection>

    <BaseSection
      tight
      class="border-t border-[var(--color-border)]"
    >
      <p
        v-if="!updates?.length"
        class="max-w-md text-[var(--color-text-muted)]"
      >
        {{ t('updatesIndex.empty') }}
      </p>

      <div
        v-else
        class="flex flex-col divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]"
      >
        <NuxtLink
          v-for="update in updates"
          :key="update.slug"
          :to="localePath(update.path)"
          class="group flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
        >
          <h2 class="font-display text-xl font-medium group-hover:text-[var(--color-accent)]">
            {{ update.title }}
          </h2>
          <time
            v-if="update.publishedAt"
            class="shrink-0 text-sm text-[var(--color-text-muted)]"
            :datetime="update.publishedAt"
          >
            {{ new Date(update.publishedAt).toLocaleDateString(locale) }}
          </time>
        </NuxtLink>
      </div>
    </BaseSection>

    <FinalCTA />
  </div>
</template>
