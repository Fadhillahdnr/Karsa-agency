<script setup lang="ts">
interface Pillar {
  index: string
  name: string
  items: string[]
}

const { t } = useI18n()
const pillars = useTmList<Pillar[]>('servicesPillars.pillars')
</script>

<template>
  <BaseSection id="what-we-do">
    <BaseHeading
      :eyebrow="t('servicesPillars.eyebrow')"
      size="h1"
    >
      {{ t('servicesPillars.title') }}
    </BaseHeading>

    <div class="mt-16 grid grid-cols-1 divide-y divide-[var(--color-border)] border-t border-[var(--color-border)] md:grid-cols-3 md:divide-x md:divide-y-0">
      <TextReveal
        v-for="(pillar, i) in pillars"
        :key="pillar.name"
        as="article"
        :delay="i * 0.08"
        class="group px-0 py-10 transition-colors duration-[var(--duration-base)] md:px-8 md:first:pl-0 hover:bg-[var(--color-accent-soft)]"
      >
        <p class="font-display text-sm text-[var(--color-text-muted)]">
          {{ pillar.index }}
        </p>
        <h3 class="mt-3 font-display text-2xl font-medium uppercase">
          {{ pillar.name }}
        </h3>
        <ul class="mt-6 flex flex-col gap-2">
          <li
            v-for="item in pillar.items"
            :key="item"
            class="text-sm text-[var(--color-text-muted)] transition-colors duration-[var(--duration-base)] group-hover:text-[var(--color-text)]"
          >
            {{ item }}
          </li>
        </ul>
      </TextReveal>
    </div>
  </BaseSection>
</template>
