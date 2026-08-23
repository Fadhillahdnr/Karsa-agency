<script setup lang="ts">
const pillars = [
  {
    name: 'Design-Driven.',
    description: 'Digital experiences that are thoughtful, clear, and enjoyable to use.',
  },
  {
    name: 'Technology-Backed.',
    description: 'Systems designed to be maintainable, reliable, and ready to evolve.',
  },
  {
    name: 'Business-Focused.',
    description: 'Every decision starts with the problem the product needs to solve.',
  },
]
</script>

<template>
  <BaseSection id="why-karsa">
    <BaseHeading
      eyebrow="Why Karsa"
      size="h1"
    >
      Three principles behind every project.
    </BaseHeading>

    <div class="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
      <TextReveal
        v-for="(pillar, i) in pillars"
        :key="pillar.name"
        :delay="i * 0.08"
      >
        <h3 class="font-display text-xl font-medium uppercase tracking-tight text-[var(--color-accent)]">
          {{ pillar.name }}
        </h3>
        <p class="mt-3 text-[var(--color-text-muted)]">
          {{ pillar.description }}
        </p>
      </TextReveal>
    </div>

    <p class="mt-20 border-t border-[var(--color-border)] pt-10 font-display text-2xl font-medium uppercase tracking-tight">
      Clear Scope. Clear Process. Clear Investment.
    </p>
  </BaseSection>
</template>
