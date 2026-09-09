<script setup lang="ts">
import type { ArticleDetailApiItem } from '../../../server/api/articles/[slug].get'

const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const slug = route.params.slug as string

const { data: article } = await useAsyncData(`insight-${slug}-${locale.value}`, () =>
  $fetch<ArticleDetailApiItem | null>(`/api/articles/${slug}`, { query: { locale: locale.value } }),
)

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })
}

useSeoMeta({
  title: article.value.seoTitle || article.value.title,
  description: article.value.seoDescription || article.value.excerpt || undefined,
  ogTitle: article.value.title,
  ogDescription: article.value.excerpt || undefined,
  ogImage: article.value.ogImageUrl || undefined,
})

if (article.value.canonicalUrl) {
  useHead({ link: [{ rel: 'canonical', href: article.value.canonicalUrl }] })
}

useSchemaOrg([
  defineArticle({
    headline: article.value.title,
    description: article.value.excerpt || undefined,
    datePublished: article.value.publishedAt || undefined,
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'Insights', item: '/insights' },
      { name: article.value.title },
    ],
  }),
])

const { track } = useAnalytics()
onMounted(() => track('insight_view', { insight: slug }))
</script>

<template>
  <div v-if="article">
    <BaseSection
      tight
      class="pt-32"
    >
      <p
        v-if="article.category"
        class="text-eyebrow"
      >
        {{ article.category }}
      </p>
      <BaseHeading
        size="display-2"
        as="h1"
        class="mt-4"
      >
        {{ article.title }}
      </BaseHeading>
      <p class="mt-6 flex flex-wrap gap-3 text-sm text-[var(--color-text-muted)]">
        <span v-if="article.author">{{ article.author }}</span>
        <span v-if="article.readingTime">{{ t('insightsIndex.readingTime', { minutes: article.readingTime }) }}</span>
      </p>
    </BaseSection>

    <BaseSection
      tight
      narrow
      class="border-t border-[var(--color-border)]"
    >
      <!-- eslint-disable vue/no-v-html -- sanitized server-side in server/utils/render-rich-text.ts before this ever reaches the client -->
      <div
        class="prose prose-invert max-w-none prose-headings:font-display prose-headings:font-medium prose-p:text-[var(--color-text-muted)] prose-li:text-[var(--color-text-muted)]"
        v-html="article.contentHtml"
      />
      <!-- eslint-enable vue/no-v-html -->
    </BaseSection>

    <div class="border-t border-[var(--color-border)] pt-6 pb-16">
      <BaseContainer>
        <NuxtLink
          :to="localePath('/insights')"
          class="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
        >
          ← {{ t('insightsIndex.backToInsights') }}
        </NuxtLink>
      </BaseContainer>
    </div>

    <FinalCTA />
  </div>
</template>
