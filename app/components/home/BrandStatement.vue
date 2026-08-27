<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <BaseSection tight>
    <TextReveal
      as="p"
      class="max-w-3xl font-display text-[length:var(--text-display-2)] font-medium leading-[1.1]"
    >
      {{ t('brandStatement.line1') }}
    </TextReveal>
    <TextReveal
      as="p"
      :delay="0.1"
      class="mt-8 max-w-3xl font-display text-[length:var(--text-display-2)] font-medium leading-[1.1] text-[var(--color-text-muted)]"
    >
      {{ t('brandStatement.line2Muted') }}
      <span class="text-[var(--color-text)]">{{ t('brandStatement.line2Highlight') }}</span>
    </TextReveal>
  </BaseSection>
</template>
