<script setup lang="ts">
import type { ArticleApiItem } from '../../../server/api/articles/index.get'

const { t, locale } = useI18n()
const localePath = useLocalePath()

const { data: articles } = await useAsyncData(`home-insights-${locale.value}`, () =>
  $fetch<ArticleApiItem[]>('/api/articles', { query: { locale: locale.value } }),
)

const latest = computed(() => (articles.value ?? []).slice(0, 3))
</script>

<template>
  <BaseSection v-if="latest.length">
    <div class="flex items-center justify-between">
      <p class="text-eyebrow">
        {{ t('insightsIndex.eyebrow') }}
      </p>
      <NuxtLink
        :to="localePath('/insights')"
        class="text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-strong)]"
      >
        {{ t('selectedWork.viewAll') }} →
      </NuxtLink>
    </div>
    <div class="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
      <NuxtLink
        v-for="article in latest"
        :key="article.slug"
        :to="localePath(article.path)"
        class="group"
      >
        <p
          v-if="article.category"
          class="text-xs text-[var(--color-text-muted)] uppercase"
        >
          {{ article.category }}
        </p>
        <h3 class="mt-2 font-display text-lg font-medium group-hover:text-[var(--color-accent)]">
          {{ article.title }}
        </h3>
      </NuxtLink>
    </div>
  </BaseSection>
</template>
