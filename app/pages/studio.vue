<script setup lang="ts">
const values = [
  { name: 'Thoughtful', description: 'Every decision is made deliberately, not by default or convention.' },
  { name: 'Modern', description: 'Current tools and practices, applied without chasing trends for their own sake.' },
  { name: 'Professional', description: 'Clear communication, realistic scope, and follow-through on what\'s agreed.' },
  { name: 'Honest', description: 'No inflated claims, no fabricated portfolio, no promises we can\'t keep.' },
  { name: 'Human', description: 'Software is built for people — that stays the starting point, not an afterthought.' },
]

useSeoMeta({
  title: 'Studio',
  description: 'Karsa Studio\'s philosophy, positioning, and working principles as a digital product & software studio.',
})
</script>

<template>
  <div>
    <BaseSection
      tight
      class="pt-32"
    >
      <BaseHeading
        eyebrow="Studio"
        size="display-2"
        as="h1"
      >
        Karsa is the beginning.<br>
        Karya is the result.
      </BaseHeading>
      <p class="mt-6 max-w-xl text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
        Karsa Studio is the space in between — where a business intention becomes a working digital product.
      </p>
    </BaseSection>

    <BaseSection
      tight
      class="border-t border-[var(--color-border)]"
    >
      <TextReveal class="max-w-3xl">
        <BaseHeading size="h1">
          Design-driven. Technology-backed. Business-focused.
        </BaseHeading>
        <p class="mt-6 text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
          Karsa Studio helps businesses build, improve, and digitalize products and processes through a combination
          of business understanding, thoughtful design, and reliable technology. Business explains why something
          is built. Design shapes how people use and feel it. Technology makes sure it works — reliably,
          maintainably, and ready to grow.
        </p>
      </TextReveal>
    </BaseSection>

    <BaseSection
      tight
      class="border-t border-[var(--color-border)]"
    >
      <BaseHeading
        eyebrow="Working Principles"
        size="h1"
      >
        How we approach every project.
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
        eyebrow="Process"
        size="h1"
      >
        The Karsa Method.
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
