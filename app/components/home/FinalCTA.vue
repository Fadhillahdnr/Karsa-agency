<script setup lang="ts">
const { contactChannels } = useKarsaConfig()
const secondaryChannel = computed(() => contactChannels.value[0])
const { track } = useAnalytics()
const { t } = useI18n()
</script>

<template>
  <BaseSection
    id="final-cta"
    tight
  >
    <TextReveal>
      <h2 class="font-display text-[length:var(--text-display-2)] font-medium uppercase leading-[1.02] tracking-tight">
        {{ t('finalCta.titleLine1') }}<br>
        {{ t('finalCta.titleLine1b') }}
      </h2>
      <p class="mt-4 font-display text-[length:var(--text-display-2)] font-medium uppercase leading-[1.02] tracking-tight text-[var(--color-text-muted)]">
        {{ t('finalCta.titleLine2') }}<br>
        {{ t('finalCta.titleLine2b') }}
      </p>
    </TextReveal>

    <div class="mt-10 flex flex-wrap gap-4">
      <BaseButton
        to="/start-a-project"
        variant="primary"
        @click="track('cta_start_project')"
      >
        {{ t('finalCta.start') }} ↗
      </BaseButton>
      <BaseButton
        v-if="secondaryChannel"
        :href="secondaryChannel.href"
        variant="secondary"
        external
      >
        {{ t('finalCta.talk') }}
      </BaseButton>
    </div>
  </BaseSection>
</template>
