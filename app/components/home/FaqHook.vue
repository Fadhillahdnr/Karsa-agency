<script setup lang="ts">
import type { FaqApiItem } from '../../../server/api/faqs/index.get'

const { t, locale } = useI18n()
const localePath = useLocalePath()

const { data: faqs } = await useAsyncData(`home-faq-${locale.value}`, () =>
  $fetch<FaqApiItem[]>('/api/faqs', { query: { locale: locale.value } }),
)

const featured = computed(() => {
  const list = faqs.value ?? []
  const marked = list.filter(f => f.featured)
  return (marked.length ? marked : list).slice(0, 4)
})
</script>

<template>
  <BaseSection v-if="featured.length">
    <div class="flex items-center justify-between">
      <p class="text-eyebrow">
        {{ t('faqIndex.eyebrow') }}
      </p>
      <NuxtLink
        :to="localePath('/faq')"
        class="text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-strong)]"
      >
        {{ t('selectedWork.viewAll') }} →
      </NuxtLink>
    </div>
    <div class="mt-8 flex flex-col divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
      <details
        v-for="faq in featured"
        :key="faq.question"
        class="group py-6"
      >
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-medium">
          {{ faq.question }}
          <span
            aria-hidden="true"
            class="shrink-0 text-[var(--color-text-muted)] transition-transform duration-[var(--duration-base)] group-open:rotate-45"
          >+</span>
        </summary>
        <p class="mt-4 text-sm text-[var(--color-text-muted)]">
          {{ faq.answer }}
        </p>
      </details>
    </div>
  </BaseSection>
</template>
