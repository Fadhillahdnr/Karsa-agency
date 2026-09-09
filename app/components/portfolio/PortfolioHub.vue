<script setup lang="ts">
import type { PortfolioListItem } from '../../../server/api/portfolio/[discipline]/index.get'

const props = defineProps<{
  discipline: 'design' | 'photography' | 'videography'
}>()

const { t, locale } = useI18n()
const localePath = useLocalePath()

const { data: items } = await useAsyncData(`portfolio-${props.discipline}-${locale.value}`, () =>
  $fetch<PortfolioListItem[]>(`/api/portfolio/${props.discipline}`, { query: { locale: locale.value } }),
)

useSeoMeta({
  title: t(`portfolio.${props.discipline}.title`),
  description: t(`portfolio.${props.discipline}.metaDescription`),
})
</script>

<template>
  <div>
    <BaseSection
      tight
      class="pt-32"
    >
      <BaseHeading
        :eyebrow="t(`portfolio.${discipline}.eyebrow`)"
        size="display-2"
        as="h1"
      >
        {{ t(`portfolio.${discipline}.title`) }}
      </BaseHeading>
      <p class="mt-6 max-w-xl text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
        {{ t(`portfolio.${discipline}.description`) }}
      </p>
    </BaseSection>

    <BaseSection
      tight
      class="border-t border-[var(--color-border)]"
    >
      <p
        v-if="!items?.length"
        class="max-w-md text-[var(--color-text-muted)]"
      >
        {{ t(`portfolio.${discipline}.empty`) }}
      </p>

      <div
        v-else
        class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        <NuxtLink
          v-for="item in items"
          :key="item.slug"
          :to="localePath(item.path)"
          class="group"
        >
          <div class="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)]">
            <img
              v-if="item.coverUrl"
              :src="item.coverUrl"
              :alt="item.title"
              loading="lazy"
              class="aspect-[4/3] w-full object-cover transition-transform duration-[var(--duration-slow)] group-hover:scale-[1.03]"
            >
            <div
              v-else
              class="aspect-[4/3] w-full bg-[var(--color-surface-raised)]"
              aria-hidden="true"
            />
          </div>
          <p
            v-if="item.category"
            class="mt-4 text-eyebrow"
          >
            {{ item.category }}
          </p>
          <p class="mt-1 font-display text-xl font-medium">
            {{ item.title }}
          </p>
          <p
            v-if="item.summary"
            class="mt-1 text-sm text-[var(--color-text-muted)]"
          >
            {{ item.summary }}
          </p>
        </NuxtLink>
      </div>
    </BaseSection>

    <FinalCTA />
  </div>
</template>
