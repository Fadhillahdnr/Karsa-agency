<script setup lang="ts">
import type { PackageApiItem } from '../../../server/api/packages/index.get'

const { t, locale } = useI18n()
const { track } = useAnalytics()
const localePath = useLocalePath()

interface AddOnItem { name: string, price: string }
interface TermItem { label: string, value: string }

const addOns = useTmList<AddOnItem[]>('packagesIndex.addOns.items')
const terms = useTmList<TermItem[]>('packagesIndex.terms.items')

const { data: packages } = await useAsyncData(`packages-listing-${locale.value}`, () =>
  $fetch<PackageApiItem[]>('/api/packages', { query: { locale: locale.value } }),
)

onMounted(() => {
  for (const pkg of packages.value ?? []) track('package_view', { package: pkg.slug })
})

const categoryOrder = ['solo', 'combo', 'maintenance'] as const
const packageGroups = computed(() => categoryOrder
  .map(category => ({
    category,
    packages: packages.value?.filter(pkg => pkg.category === category) ?? [],
  }))
  .filter(group => group.packages.length > 0))

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
        class="flex flex-col gap-16"
      >
        <section
          v-for="group in packageGroups"
          :key="group.category"
        >
          <div class="mb-8 max-w-2xl">
            <p class="text-eyebrow">
              {{ t(`packagesIndex.groups.${group.category}.eyebrow`) }}
            </p>
            <h2 class="mt-3 font-display text-3xl font-medium sm:text-4xl">
              {{ t(`packagesIndex.groups.${group.category}.title`) }}
            </h2>
            <p class="mt-3 text-sm text-[var(--color-text-muted)]">
              {{ t(`packagesIndex.groups.${group.category}.description`) }}
            </p>
          </div>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <article
              v-for="pkg in group.packages"
              :key="pkg.slug"
              class="relative flex min-w-0 flex-col rounded-[var(--radius-lg)] border p-6 sm:p-8"
              :class="pkg.featured ? 'border-[var(--color-accent)]' : 'border-[var(--color-border)]'"
            >
              <span
                v-if="pkg.badge"
                class="mb-4 w-fit rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-medium text-[var(--color-on-accent)]"
              >
                {{ pkg.badge }}
              </span>

              <h3 class="font-display text-2xl font-medium">
                {{ pkg.title }}
              </h3>
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
                class="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]"
              >
                {{ pkg.priceNote }}
              </p>

              <p
                v-if="pkg.recommendedFor"
                class="mt-6 border-t border-[var(--color-border)] pt-5 text-sm text-[var(--color-text-muted)]"
              >
                <strong class="mb-1 block text-xs tracking-wider text-[var(--color-text)] uppercase">{{ t('packagesIndex.recommendedFor') }}</strong>
                {{ pkg.recommendedFor }}
              </p>

              <ul
                v-if="pkg.items.length"
                class="mt-5 flex flex-col gap-2.5"
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
                  >—</span>
                  <span>{{ item.label }}</span>
                </li>
              </ul>

              <dl
                v-if="pkg.durationNote || pkg.revisionNote"
                class="mt-6 space-y-3 border-t border-[var(--color-border)] pt-5 text-xs text-[var(--color-text-muted)]"
              >
                <div v-if="pkg.durationNote">
                  <dt class="font-medium text-[var(--color-text)]">
                    {{ t('packagesIndex.duration') }}
                  </dt>
                  <dd class="mt-1">
                    {{ pkg.durationNote }}
                  </dd>
                </div>
                <div v-if="pkg.revisionNote">
                  <dt class="font-medium text-[var(--color-text)]">
                    {{ t('packagesIndex.scopeNote') }}
                  </dt>
                  <dd class="mt-1">
                    {{ pkg.revisionNote }}
                  </dd>
                </div>
              </dl>

              <div class="mt-auto pt-8">
                <BaseButton
                  :to="localePath('/start-a-project')"
                  variant="secondary"
                  @click="track('package_cta_click', { package: pkg.slug })"
                >
                  {{ pkg.ctaLabel || t('startAProject.eyebrow') }} ↗
                </BaseButton>
              </div>
            </article>
          </div>
        </section>
      </div>
    </BaseSection>

    <BaseSection
      tight
      class="border-t border-[var(--color-border)]"
    >
      <BaseHeading
        :eyebrow="t('packagesIndex.addOns.eyebrow')"
        size="h1"
      >
        {{ t('packagesIndex.addOns.title') }}
      </BaseHeading>
      <p class="mt-4 max-w-2xl text-sm text-[var(--color-text-muted)]">
        {{ t('packagesIndex.addOns.description') }}
      </p>
      <dl class="mt-10 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
        <div
          v-for="item in addOns"
          :key="item.name"
          class="grid gap-2 py-4 text-sm sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-8"
        >
          <dt>{{ item.name }}</dt>
          <dd class="font-medium text-[var(--color-text)] sm:text-right">
            {{ item.price }}
          </dd>
        </div>
      </dl>
    </BaseSection>

    <BaseSection
      tight
      class="border-t border-[var(--color-border)]"
    >
      <BaseHeading
        :eyebrow="t('packagesIndex.terms.eyebrow')"
        size="h1"
      >
        {{ t('packagesIndex.terms.title') }}
      </BaseHeading>
      <dl class="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-border)] md:grid-cols-2">
        <div
          v-for="item in terms"
          :key="item.label"
          class="bg-[var(--color-bg)] p-6"
        >
          <dt class="text-eyebrow">
            {{ item.label }}
          </dt>
          <dd class="mt-3 text-sm text-[var(--color-text-muted)]">
            {{ item.value }}
          </dd>
        </div>
      </dl>
      <p class="mt-8 max-w-3xl rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-sm text-[var(--color-text-muted)]">
        {{ t('packagesIndex.terms.launchNote') }}
      </p>
    </BaseSection>

    <FinalCTA />
  </div>
</template>
