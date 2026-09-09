<script setup lang="ts">
import type { CompanyUpdateApiItem } from '../../../server/api/updates/index.get'

const { t, locale } = useI18n()
const localePath = useLocalePath()

const { data: updates } = await useAsyncData(`home-updates-${locale.value}`, () =>
  $fetch<CompanyUpdateApiItem[]>('/api/updates', { query: { locale: locale.value } }),
)

const latest = computed(() => (updates.value ?? [])[0] ?? null)
</script>

<template>
  <BaseSection v-if="latest">
    <p class="text-eyebrow">
      {{ t('updatesIndex.eyebrow') }}
    </p>
    <NuxtLink
      :to="localePath(latest.path)"
      class="group mt-4 block"
    >
      <h3 class="font-display text-2xl font-medium group-hover:text-[var(--color-accent)]">
        {{ latest.title }}
      </h3>
      <p
        v-if="latest.excerpt"
        class="mt-2 max-w-xl text-sm text-[var(--color-text-muted)]"
      >
        {{ latest.excerpt }}
      </p>
    </NuxtLink>
  </BaseSection>
</template>
