<script setup lang="ts">
interface Value {
  name: string
  description: string
}

const { t } = useI18n()
const { karsaMethod } = useKarsaConfig()
const values = useTmList<Value[]>('about.values')

useSeoMeta({
  title: t('about.eyebrow'),
  description: t('about.metaDescription'),
})
</script>

<template>
  <div>
    <BaseSection
      tight
      class="pt-32"
    >
      <BaseHeading
        :eyebrow="t('about.eyebrow')"
        size="display-2"
        as="h1"
      >
        {{ t('about.heroTitleLine1') }}<br>
        {{ t('about.heroTitleLine2') }}
      </BaseHeading>
      <p class="mt-6 max-w-xl text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
        {{ t('about.heroSubtitle') }}
      </p>
    </BaseSection>

    <BaseSection
      tight
      class="border-t border-[var(--color-border)]"
    >
      <TextReveal class="max-w-3xl">
        <BaseHeading size="h1">
          {{ t('about.philosophyTitle') }}
        </BaseHeading>
        <p class="mt-6 text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
          {{ t('about.philosophyBody') }}
        </p>
      </TextReveal>
    </BaseSection>

    <BaseSection
      tight
      class="border-t border-[var(--color-border)]"
    >
      <BaseHeading
        :eyebrow="t('about.principlesEyebrow')"
        size="h1"
      >
        {{ t('about.principlesTitle') }}
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
        :eyebrow="t('about.processEyebrow')"
        size="h1"
      >
        {{ t('about.processTitle') }}
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
