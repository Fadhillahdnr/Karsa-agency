<script setup lang="ts">
const { t } = useI18n()
const { karsaMethod } = useKarsaConfig()
</script>

<template>
  <BaseSection id="karsa-method">
    <BaseHeading
      :eyebrow="t('karsaMethod.eyebrow')"
      size="h1"
    >
      {{ t('karsaMethod.title') }}
    </BaseHeading>

    <ol class="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
      <TextReveal
        v-for="(stage, i) in karsaMethod"
        :key="stage.step"
        as="li"
        :delay="i * 0.05"
        class="bg-[var(--color-bg)] p-8"
      >
        <p class="font-display text-sm text-[var(--color-accent)]">
          {{ stage.step }}
        </p>
        <h3 class="mt-3 font-display text-xl font-medium uppercase tracking-tight">
          {{ stage.name }}
        </h3>
        <p class="mt-3 text-sm text-[var(--color-text-muted)]">
          {{ stage.description }}
        </p>
      </TextReveal>
    </ol>
  </BaseSection>
</template>
