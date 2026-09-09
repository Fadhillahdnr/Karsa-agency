<script setup lang="ts">
import type { ArticleApiItem } from '../../../server/api/articles/index.get'

const { t, locale } = useI18n()
const localePath = useLocalePath()

const { data: articles } = await useAsyncData(`insights-listing-${locale.value}`, () =>
  $fetch<ArticleApiItem[]>('/api/articles', { query: { locale: locale.value } }),
)

useSeoMeta({
  title: t('insightsIndex.title'),
  description: t('insightsIndex.metaDescription'),
})
</script>

<template>
  <div>
    <BaseSection
      tight
      class="pt-32"
    >
      <BaseHeading
        :eyebrow="t('insightsIndex.eyebrow')"
        size="display-2"
        as="h1"
      >
        {{ t('insightsIndex.title') }}
      </BaseHeading>
    </BaseSection>

    <BaseSection
      tight
      class="border-t border-[var(--color-border)]"
    >
      <p
        v-if="!articles?.length"
        class="max-w-md text-[var(--color-text-muted)]"
      >
        {{ t('insightsIndex.empty') }}
      </p>

      <div
        v-else
        class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3"
      >
        <NuxtLink
          v-for="article in articles"
          :key="article.slug"
          :to="localePath(article.path)"
          class="group"
        >
          <p
            v-if="article.category"
            class="text-eyebrow"
          >
            {{ article.category }}
          </p>
          <h2 class="mt-2 font-display text-xl font-medium group-hover:text-[var(--color-accent)]">
            {{ article.title }}
          </h2>
          <p
            v-if="article.excerpt"
            class="mt-2 text-sm text-[var(--color-text-muted)]"
          >
            {{ article.excerpt }}
          </p>
          <p
            v-if="article.readingTime"
            class="mt-3 text-xs text-[var(--color-text-muted)]"
          >
            {{ t('insightsIndex.readingTime', { minutes: article.readingTime }) }}
          </p>
        </NuxtLink>
      </div>
    </BaseSection>

    <FinalCTA />
  </div>
</template>
