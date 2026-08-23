<script setup lang="ts">
const { site } = useKarsaConfig()
const { track } = useAnalytics()
</script>

<template>
  <section class="relative flex min-h-[92vh] items-center overflow-hidden pt-24">
    <div
      class="pointer-events-none absolute inset-0 -z-10"
      aria-hidden="true"
    >
      <LazyKarsaCanvas />
    </div>

    <BaseContainer class="relative">
      <p class="text-eyebrow mb-6">
        Digital Product &amp; Software Studio
      </p>

      <h1 class="font-display text-[length:var(--text-display-1)] font-medium uppercase leading-[0.95] tracking-tight">
        Dari Karsa<br>
        <span class="text-[var(--color-accent)]">Menjadi Karya.</span>
      </h1>

      <p class="mt-8 max-w-xl text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
        {{ site.taglineEn }}
      </p>

      <p class="mt-4 text-sm text-[var(--color-text-muted)]">
        {{ site.location }} — {{ site.availability }}
      </p>

      <div class="mt-10 flex flex-wrap gap-4">
        <BaseButton
          to="/work"
          variant="secondary"
          @click="track('cta_view_work')"
        >
          Explore Work
        </BaseButton>
        <BaseButton
          to="/start-a-project"
          variant="primary"
          @click="track('cta_start_project')"
        >
          Start a Project ↗
        </BaseButton>
      </div>
    </BaseContainer>
  </section>
</template>
