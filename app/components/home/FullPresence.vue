<script setup lang="ts">
import type { PackageApiItem } from '../../../server/api/packages/index.get'

const { t, locale } = useI18n()
const localePath = useLocalePath()

const { data: packages } = await useAsyncData(`home-full-presence-${locale.value}`, () =>
  $fetch<PackageApiItem[]>('/api/packages', { query: { locale: locale.value } }),
)

// "Full Presence" surfaces the featured integrated package, if one exists —
// price/content always from the DB, never hard-coded (§10.5).
const featured = computed(() => packages.value?.find(pkg => pkg.category === 'combo' || pkg.category === 'signature') ?? null)

function priceLabel(pkg: PackageApiItem) {
  if (pkg.priceType === 'custom' || pkg.price == null) return t('packagesIndex.custom')
  const formatted = `${pkg.currency} ${pkg.price.toLocaleString(locale.value)}`
  if (pkg.priceType === 'starting_from') return `${t('packagesIndex.startingFrom')} ${formatted}`
  if (pkg.priceType === 'monthly') return `${formatted}${t('packagesIndex.monthly')}`
  return formatted
}
</script>

<template>
  <BaseSection v-if="featured">
    <p class="text-eyebrow">
      {{ t('fullPresence.eyebrow') }}
    </p>
    <BaseHeading
      size="h1"
      class="mt-4"
    >
      {{ featured.title }}
    </BaseHeading>
    <p
      v-if="featured.summary"
      class="mt-4 max-w-xl text-[var(--color-text-muted)]"
    >
      {{ featured.summary }}
    </p>

    <p class="mt-8 font-display text-2xl font-medium">
      {{ priceLabel(featured) }}
    </p>

    <ul
      v-if="featured.items.length"
      class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      <li
        v-for="item in featured.items"
        :key="item.label"
        class="flex items-start gap-2.5 text-sm text-[var(--color-text-muted)]"
      >
        <span
          aria-hidden="true"
          class="mt-1 text-[var(--color-accent)]"
        >—</span>{{ item.label }}
      </li>
    </ul>

    <div class="mt-8">
      <BaseButton :to="localePath('/start-a-project')">
        {{ featured.ctaLabel || t('startAProject.eyebrow') }} ↗
      </BaseButton>
    </div>
  </BaseSection>
</template>
