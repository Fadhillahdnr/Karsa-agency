<script setup lang="ts">
const { t } = useI18n()
const capabilities = useTmList<string[]>('capabilities.items')
</script>

<template>
  <BaseSection
    id="capabilities"
    tight
    bleed
  >
    <BaseContainer>
      <BaseHeading
        :eyebrow="t('capabilities.eyebrow')"
        size="h1"
      >
        {{ t('capabilities.title') }}
      </BaseHeading>
    </BaseContainer>

    <div class="mt-16">
      <ScrollMarquee
        aria-label="Karsa Studio capabilities"
        :speed="30"
      >
        <span
          v-for="capability in capabilities"
          :key="capability"
          class="font-display text-3xl font-medium text-[var(--color-text-muted)] md:text-5xl"
        >
          {{ capability }}
        </span>
      </ScrollMarquee>
    </div>
  </BaseSection>
</template>
