<script setup lang="ts">
import type { TestimonialApiItem } from '../../../server/api/testimonials/index.get'

const { t, locale } = useI18n()

const { data: testimonials } = await useAsyncData(`home-testimonials-${locale.value}`, () =>
  $fetch<TestimonialApiItem[]>('/api/testimonials'),
)

const featured = computed(() => {
  const list = testimonials.value ?? []
  return list.find(item => item.featured) ?? list[0] ?? null
})
</script>

<template>
  <BaseSection v-if="featured">
    <p class="text-eyebrow mb-8">
      {{ t('testimonialsSection.eyebrow') }}
    </p>
    <blockquote class="max-w-3xl font-display text-[length:var(--text-display-2)] leading-[1.15] font-medium">
      “{{ featured.quote }}”
    </blockquote>
    <div class="mt-8 flex items-center gap-3">
      <img
        v-if="featured.avatarUrl"
        :src="featured.avatarUrl"
        :alt="featured.personName"
        class="h-12 w-12 rounded-full object-cover"
      >
      <div>
        <p class="font-medium">
          {{ featured.personName }}
        </p>
        <p
          v-if="featured.personRole || featured.company"
          class="text-sm text-[var(--color-text-muted)]"
        >
          {{ [featured.personRole, featured.company].filter(Boolean).join(' · ') }}
        </p>
      </div>
    </div>
  </BaseSection>
</template>
