<script setup lang="ts">
const { t } = useI18n()
const { deliveryStages } = useKarsaConfig()
const trustElements = useTmList<string[]>('deliveryTrust.trust')
</script>

<template>
  <BaseSection id="delivery">
    <BaseHeading
      :eyebrow="t('deliveryTrust.eyebrow')"
      size="h1"
    >
      {{ t('deliveryTrust.title') }}
    </BaseHeading>

    <ol class="mt-16 flex flex-wrap gap-x-3 gap-y-4">
      <li
        v-for="(stage, i) in deliveryStages"
        :key="stage"
        class="flex items-center gap-3"
      >
        <span class="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium">
          {{ stage }}
        </span>
        <span
          v-if="i < deliveryStages.length - 1"
          aria-hidden="true"
          class="text-[var(--color-text-muted)]"
        >→</span>
      </li>
    </ol>

    <ul class="mt-16 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-[var(--color-border)] pt-10 sm:grid-cols-2">
      <li
        v-for="item in trustElements"
        :key="item"
        class="flex items-start gap-3 text-sm text-[var(--color-text-muted)]"
      >
        <span
          aria-hidden="true"
          class="mt-1 text-[var(--color-accent)]"
        >—</span>
        {{ item }}
      </li>
    </ul>
  </BaseSection>
</template>
