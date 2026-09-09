<script setup lang="ts">
interface DisciplineNote {
  name: string
  description: string
}

const { t } = useI18n()
const { karsaMethod } = useKarsaConfig()
const disciplines = useTmList<DisciplineNote[]>('process.disciplines')

useSeoMeta({
  title: t('process.eyebrow'),
  description: t('process.metaDescription'),
})
</script>

<template>
  <div>
    <BaseSection
      tight
      class="pt-32"
    >
      <BaseHeading
        :eyebrow="t('process.eyebrow')"
        size="display-2"
        as="h1"
      >
        {{ t('process.title') }}
      </BaseHeading>
      <p class="mt-6 max-w-xl text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
        {{ t('process.subtitle') }}
      </p>
    </BaseSection>

    <BaseSection
      tight
      class="border-t border-[var(--color-border)]"
    >
      <ol class="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="stage in karsaMethod"
          :key="stage.step"
          class="bg-[var(--color-bg)] p-8"
        >
          <p class="font-display text-sm text-[var(--color-accent)]">
            {{ stage.step }}
          </p>
          <h2 class="mt-3 font-display text-xl font-medium uppercase tracking-tight">
            {{ stage.name }}
          </h2>
          <p class="mt-3 text-sm text-[var(--color-text-muted)]">
            {{ stage.description }}
          </p>
        </li>
      </ol>
    </BaseSection>

    <BaseSection
      tight
      class="border-t border-[var(--color-border)]"
    >
      <BaseHeading
        :eyebrow="t('process.disciplinesEyebrow')"
        size="h1"
      >
        {{ t('process.disciplinesTitle') }}
      </BaseHeading>
      <div class="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
        <div
          v-for="item in disciplines"
          :key="item.name"
        >
          <h3 class="font-display text-lg font-medium uppercase tracking-tight text-[var(--color-accent)]">
            {{ item.name }}
          </h3>
          <p class="mt-2 text-sm text-[var(--color-text-muted)]">
            {{ item.description }}
          </p>
        </div>
      </div>
    </BaseSection>

    <FinalCTA />
  </div>
</template>
