<script setup lang="ts">
import type { PackageApiItem } from '../../../server/api/packages/index.get'

const { t, locale } = useI18n()

const { data: packages } = await useAsyncData(`packages-listing-${locale.value}`, () =>
  $fetch<PackageApiItem[]>('/api/packages', { query: { locale: locale.value } }),
)

function priceLabel(pkg: PackageApiItem) {
  if (pkg.priceType === 'custom' || pkg.price == null) return t('packagesIndex.custom')
  const formatted = `${pkg.currency} ${pkg.price.toLocaleString(locale.value)}`
  if (pkg.priceType === 'starting_from') return `${t('packagesIndex.startingFrom')} ${formatted}`
  if (pkg.priceType === 'monthly') return `${formatted}${t('packagesIndex.monthly')}`
  return formatted
}

useSeoMeta({
  title: t('packagesIndex.title'),
  description: t('packagesIndex.metaDescription'),
})
</script>

<template>
  <div>
    <BaseSection
      tight
      class="pt-32"
    >
      <BaseHeading
        :eyebrow="t('packagesIndex.eyebrow')"
        size="display-2"
        as="h1"
      >
        {{ t('packagesIndex.title') }}
      </BaseHeading>
      <p class="mt-6 max-w-xl text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
        {{ t('packagesIndex.description') }}
      </p>
    </BaseSection>

    <BaseSection
      tight
      class="border-t border-[var(--color-border)]"
    >
      <p
        v-if="!packages?.length"
        class="max-w-md text-[var(--color-text-muted)]"
      >
        {{ t('packagesIndex.empty') }}
      </p>

      <div
        v-else
        class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <article
          v-for="pkg in packages"
          :key="pkg.slug"
          class="relative flex flex-col rounded-[var(--radius-lg)] border p-8"
          :class="pkg.featured ? 'border-[var(--color-accent)]' : 'border-[var(--color-border)]'"
        >
          <span
            v-if="pkg.badge"
            class="absolute top-6 right-6 rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-medium text-[var(--color-on-accent)]"
          >
            {{ pkg.badge }}
          </span>

          <p class="text-eyebrow">
            {{ pkg.category }}
          </p>
          <h2 class="mt-3 font-display text-2xl font-medium">
            {{ pkg.title }}
          </h2>
          <p
            v-if="pkg.summary"
            class="mt-3 text-sm text-[var(--color-text-muted)]"
          >
            {{ pkg.summary }}
          </p>

          <p class="mt-6 font-display text-xl font-medium">
            {{ priceLabel(pkg) }}
          </p>
          <p
            v-if="pkg.priceNote"
            class="mt-1 text-xs text-[var(--color-text-muted)]"
          >
            {{ pkg.priceNote }}
          </p>

          <ul
            v-if="pkg.items.length"
            class="mt-6 flex flex-col gap-2.5 border-t border-[var(--color-border)] pt-6"
          >
            <li
              v-for="item in pkg.items"
              :key="item.label"
              class="flex items-start gap-2.5 text-sm"
              :class="item.isHighlight ? 'font-medium text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'"
            >
              <span
                aria-hidden="true"
                class="mt-1 text-[var(--color-accent)]"
              >—</span>{{ item.label }}
            </li>
          </ul>

          <div class="mt-8">
            <BaseButton
              to="/start-a-project"
              variant="secondary"
            >
              {{ pkg.ctaLabel || t('startAProject.eyebrow') }} ↗
            </BaseButton>
          </div>
        </article>
      </div>
    </BaseSection>

    <FinalCTA />
  </div>
</template>
