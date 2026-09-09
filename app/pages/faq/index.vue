<script setup lang="ts">
import type { FaqApiItem } from '../../../server/api/faqs/index.get'

const { t, locale } = useI18n()

const { data: faqs } = await useAsyncData(`faq-listing-${locale.value}`, () =>
  $fetch<FaqApiItem[]>('/api/faqs', { query: { locale: locale.value } }),
)

const categories = computed(() => {
  const set = new Set((faqs.value ?? []).map(f => f.category).filter((c): c is string => !!c))
  return Array.from(set)
})

const activeCategory = ref<string | null>(null)

const filtered = computed(() => {
  if (!activeCategory.value) return faqs.value ?? []
  return (faqs.value ?? []).filter(f => f.category === activeCategory.value)
})

useSeoMeta({
  title: t('faqIndex.title'),
  description: t('faqIndex.metaDescription'),
})

// FAQPage schema only when there's real visible content to back it (§71).
watchEffect(() => {
  if (!filtered.value.length) return
  useSchemaOrg(filtered.value.map(faq => defineQuestion({ name: faq.question, acceptedAnswer: faq.answer })))
})
</script>

<template>
  <div>
    <BaseSection
      tight
      class="pt-32"
    >
      <BaseHeading
        :eyebrow="t('faqIndex.eyebrow')"
        size="display-2"
        as="h1"
      >
        {{ t('faqIndex.title') }}
      </BaseHeading>
    </BaseSection>

    <BaseSection
      tight
      class="border-t border-[var(--color-border)]"
    >
      <p
        v-if="!faqs?.length"
        class="max-w-md text-[var(--color-text-muted)]"
      >
        {{ t('faqIndex.empty') }}
      </p>

      <template v-else>
        <div
          v-if="categories.length > 1"
          class="flex flex-wrap gap-2"
        >
          <button
            type="button"
            class="min-h-[36px] rounded-full border px-3.5 text-xs font-medium transition-colors"
            :class="!activeCategory
              ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
              : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'"
            @click="activeCategory = null"
          >
            {{ t('faqIndex.allCategory') }}
          </button>
          <button
            v-for="category in categories"
            :key="category"
            type="button"
            class="min-h-[36px] rounded-full border px-3.5 text-xs font-medium transition-colors"
            :class="activeCategory === category
              ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
              : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'"
            @click="activeCategory = category"
          >
            {{ category }}
          </button>
        </div>

        <div class="mt-8 flex flex-col divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
          <details
            v-for="faq in filtered"
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
      </template>
    </BaseSection>

    <FinalCTA />
  </div>
</template>
