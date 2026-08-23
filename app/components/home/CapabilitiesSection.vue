<script setup lang="ts">
const capabilities = [
  'Digital Experiences',
  'Web Development',
  'E-Commerce',
  'Web Applications',
  'Custom Software',
  'Internal Systems',
  'Dashboards & Portals',
  'API & Integrations',
  'UI/UX Design',
  'Product Strategy',
  'Maintenance & Support',
]
</script>

<template>
  <BaseSection
    id="capabilities"
    tight
    bleed
  >
    <BaseContainer>
      <BaseHeading
        eyebrow="Capabilities"
        size="h1"
      >
        Everything a digital product needs to work.
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
