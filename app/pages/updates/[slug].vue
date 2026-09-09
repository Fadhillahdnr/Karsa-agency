<script setup lang="ts">
import type { CompanyUpdateDetailApiItem } from '../../../server/api/updates/[slug].get'

const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const slug = route.params.slug as string

const { data: update } = await useAsyncData(`update-${slug}-${locale.value}`, () =>
  $fetch<CompanyUpdateDetailApiItem | null>(`/api/updates/${slug}`, { query: { locale: locale.value } }),
)

if (!update.value) {
  throw createError({ statusCode: 404, statusMessage: 'Update not found', fatal: true })
}

useSeoMeta({
  title: update.value.seoTitle || update.value.title,
  description: update.value.seoDescription || update.value.excerpt || undefined,
  ogTitle: update.value.title,
  ogDescription: update.value.excerpt || undefined,
})
</script>

<template>
  <div v-if="update">
    <BaseSection
      tight
      class="pt-32"
    >
      <BaseHeading
        size="display-2"
        as="h1"
      >
        {{ update.title }}
      </BaseHeading>
      <time
        v-if="update.publishedAt"
        class="mt-4 block text-sm text-[var(--color-text-muted)]"
        :datetime="update.publishedAt"
      >
        {{ new Date(update.publishedAt).toLocaleDateString(locale) }}
      </time>
    </BaseSection>

    <BaseSection
      tight
      narrow
      class="border-t border-[var(--color-border)]"
    >
      <!-- eslint-disable vue/no-v-html -- sanitized server-side in server/utils/render-rich-text.ts before this ever reaches the client -->
      <div
        class="prose prose-invert max-w-none prose-headings:font-display prose-headings:font-medium prose-p:text-[var(--color-text-muted)] prose-li:text-[var(--color-text-muted)]"
        v-html="update.contentHtml"
      />
      <!-- eslint-enable vue/no-v-html -->
    </BaseSection>

    <div class="border-t border-[var(--color-border)] pt-6 pb-16">
      <BaseContainer>
        <NuxtLink
          :to="localePath('/updates')"
          class="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
        >
          ← {{ t('updatesIndex.backToUpdates') }}
        </NuxtLink>
      </BaseContainer>
    </div>

    <FinalCTA />
  </div>
</template>
