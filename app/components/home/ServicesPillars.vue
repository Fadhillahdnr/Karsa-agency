<script setup lang="ts">
const pillars = [
  {
    index: '01',
    name: 'Design',
    items: ['UI/UX Design', 'Product Design', 'Prototype', 'Design Systems', 'Digital Brand Experience'],
  },
  {
    index: '02',
    name: 'Build',
    items: [
      'Websites',
      'E-Commerce',
      'Web Applications',
      'Custom Software',
      'Internal Systems',
      'Dashboards & Portals',
      'API & Integrations',
    ],
  },
  {
    index: '03',
    name: 'Grow',
    items: ['Maintenance & Support', 'Performance Optimization', 'Analytics', 'Technical SEO', 'Continuous Development'],
  },
]
</script>

<template>
  <BaseSection id="what-we-do">
    <BaseHeading
      eyebrow="What We Do"
      size="h1"
    >
      Design, build, and grow&nbsp;— under one roof.
    </BaseHeading>

    <div class="mt-16 grid grid-cols-1 divide-y divide-[var(--color-border)] border-t border-[var(--color-border)] md:grid-cols-3 md:divide-x md:divide-y-0">
      <TextReveal
        v-for="(pillar, i) in pillars"
        :key="pillar.name"
        as="article"
        :delay="i * 0.08"
        class="group px-0 py-10 transition-colors duration-[var(--duration-base)] md:px-8 md:first:pl-0 hover:bg-[var(--color-accent-soft)]"
      >
        <p class="font-display text-sm text-[var(--color-text-muted)]">
          {{ pillar.index }}
        </p>
        <h3 class="mt-3 font-display text-2xl font-medium uppercase">
          {{ pillar.name }}
        </h3>
        <ul class="mt-6 flex flex-col gap-2">
          <li
            v-for="item in pillar.items"
            :key="item"
            class="text-sm text-[var(--color-text-muted)] transition-colors duration-[var(--duration-base)] group-hover:text-[var(--color-text)]"
          >
            {{ item }}
          </li>
        </ul>
      </TextReveal>
    </div>
  </BaseSection>
</template>
