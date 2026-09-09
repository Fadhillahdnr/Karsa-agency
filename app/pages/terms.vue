<script setup lang="ts">
import type { LegalPageApiItem } from '../../server/api/legal/[slug].get'

const { t, locale } = useI18n()

const { data: page } = await useAsyncData(`legal-terms-${locale.value}`, () =>
  $fetch<LegalPageApiItem | null>('/api/legal/terms', { query: { locale: locale.value } }),
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  title: page.value.title,
  description: page.value.seoDescription || undefined,
})
</script>

<template>
  <div v-if="page">
    <BaseSection
      tight
      narrow
      class="pt-32"
    >
      <BaseHeading
        :eyebrow="t('nav.legal')"
        size="display-2"
        as="h1"
      >
        {{ page.title }}
      </BaseHeading>

      <!-- eslint-disable vue/no-v-html -- sanitized server-side in server/utils/render-rich-text.ts before this ever reaches the client -->
      <div
        class="prose prose-invert mt-12 max-w-none prose-headings:font-display prose-headings:font-medium prose-p:text-[var(--color-text-muted)] prose-li:text-[var(--color-text-muted)]"
        v-html="page.contentHtml"
      />
      <!-- eslint-enable vue/no-v-html -->
    </BaseSection>
  </div>
</template>
