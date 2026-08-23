<script setup lang="ts">
const { contactChannels } = useKarsaConfig()
const secondaryChannel = computed(() => contactChannels.value[0])
const { track } = useAnalytics()
</script>

<template>
  <BaseSection
    id="final-cta"
    tight
  >
    <TextReveal>
      <h2 class="font-display text-[length:var(--text-display-2)] font-medium uppercase leading-[1.02] tracking-tight">
        Have a Karsa<br>
        in mind?
      </h2>
      <p class="mt-4 font-display text-[length:var(--text-display-2)] font-medium uppercase leading-[1.02] tracking-tight text-[var(--color-text-muted)]">
        Let's turn it<br>
        into a Karya.
      </p>
    </TextReveal>

    <div class="mt-10 flex flex-wrap gap-4">
      <BaseButton
        to="/start-a-project"
        variant="primary"
        @click="track('cta_start_project')"
      >
        Start a Project ↗
      </BaseButton>
      <BaseButton
        v-if="secondaryChannel"
        :href="secondaryChannel.href"
        variant="secondary"
        external
      >
        Talk to Karsa
      </BaseButton>
    </div>
  </BaseSection>
</template>
