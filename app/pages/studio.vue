<script setup lang="ts">
interface Value {
  name: string
  description: string
}

const { t } = useI18n()
const { karsaMethod } = useKarsaConfig()
const values = useTmList<Value[]>('studio.values')

useSeoMeta({
  title: t('studio.eyebrow'),
  description: t('studio.metaDescription'),
})
</script>

<template>
  <div>
    <BaseSection
      tight
      class="pt-32"
    >
      <BaseHeading
        :eyebrow="t('studio.eyebrow')"
        size="display-2"
        as="h1"
      >
        {{ t('studio.heroTitleLine1') }}<br>
        {{ t('studio.heroTitleLine2') }}
      </BaseHeading>
      <p class="mt-6 max-w-xl text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
        {{ t('studio.heroSubtitle') }}
      </p>
    </BaseSection>

    <BaseSection
      tight
      class="border-t border-[var(--color-border)]"
    >
      <TextReveal class="max-w-3xl">
        <BaseHeading size="h1">
          {{ t('studio.philosophyTitle') }}
        </BaseHeading>
        <p class="mt-6 text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
          {{ t('studio.philosophyBody') }}
        </p>
      </TextReveal>
    </BaseSection>

    <BaseSection
      tight
      class="border-t border-[var(--color-border)]"
    >
      <BaseHeading
        :eyebrow="t('studio.principlesEyebrow')"
        size="h1"
      >
        {{ t('studio.principlesTitle') }}
      </BaseHeading>
      <div class="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
        <TextReveal
          v-for="(value, i) in values"
          :key="value.name"
          :delay="i * 0.05"
        >
          <h3 class="font-display text-xl font-medium uppercase tracking-tight text-[var(--color-accent)]">
            {{ value.name }}
          </h3>
          <p class="mt-2 text-sm text-[var(--color-text-muted)]">
            {{ value.description }}
          </p>
        </TextReveal>
      </div>
    </BaseSection>

    <BaseSection
      tight
      class="border-t border-[var(--color-border)]"
    >
      <BaseHeading
        :eyebrow="t('studio.processEyebrow')"
        size="h1"
      >
        {{ t('studio.processTitle') }}
      </BaseHeading>
      <ol class="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="stage in karsaMethod"
          :key="stage.step"
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
        </li>
      </ol>
    </BaseSection>

    <FinalCTA />
  </div>
</template>
