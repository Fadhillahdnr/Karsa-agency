<script setup lang="ts">
interface Pillar {
  name: string
  description: string
}

const { t } = useI18n()
const pillars = useTmList<Pillar[]>('whyKarsa.pillars')
</script>

<template>
  <BaseSection id="why-karsa">
    <BaseHeading
      :eyebrow="t('whyKarsa.eyebrow')"
      size="h1"
    >
      {{ t('whyKarsa.title') }}
    </BaseHeading>

    <div class="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
      <TextReveal
        v-for="(pillar, i) in pillars"
        :key="pillar.name"
        :delay="i * 0.08"
      >
        <h3 class="font-display text-xl font-medium uppercase tracking-tight text-[var(--color-accent)]">
          {{ pillar.name }}
        </h3>
        <p class="mt-3 text-[var(--color-text-muted)]">
          {{ pillar.description }}
        </p>
      </TextReveal>
    </div>

    <p class="mt-20 border-t border-[var(--color-border)] pt-10 font-display text-2xl font-medium uppercase tracking-tight">
      {{ t('whyKarsa.footer') }}
    </p>
  </BaseSection>
</template>
