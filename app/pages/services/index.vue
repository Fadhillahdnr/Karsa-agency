<script setup lang="ts">
const { data: services } = await useAsyncData('services-listing', () =>
  queryCollection('services').order('order', 'ASC').all(),
)

const pillars = ['Design', 'Build', 'Grow'] as const

useSeoMeta({
  title: 'Services',
  description: 'UI/UX design, web development, e-commerce, web applications, custom software, and ongoing maintenance from Karsa Studio.',
})
</script>

<template>
  <div>
    <BaseSection
      tight
      class="pt-32"
    >
      <BaseHeading
        eyebrow="Services"
        size="display-2"
        as="h1"
      >
        Design, build, and grow — under one roof.
      </BaseHeading>
      <p class="mt-6 max-w-xl text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
        Every engagement sits under one of three pillars, moved through the Karsa Method from understanding to growth.
      </p>
    </BaseSection>

    <BaseSection
      v-for="pillar in pillars"
      :key="pillar"
      tight
      class="pt-0"
    >
      <p class="text-eyebrow mb-6">
        {{ pillar }}
      </p>
      <div class="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-border)] sm:grid-cols-2">
        <NuxtLink
          v-for="service in services?.filter((s) => s.pillar === pillar)"
          :key="service.path"
          :to="service.path"
          class="group bg-[var(--color-bg)] p-8 transition-colors duration-[var(--duration-base)] hover:bg-[var(--color-accent-soft)]"
        >
          <h2 class="font-display text-2xl font-medium">
            {{ service.title }}
          </h2>
          <p class="mt-3 text-sm text-[var(--color-text-muted)]">
            {{ service.summary }}
          </p>
          <span class="mt-6 inline-flex items-center gap-1.5 text-sm font-medium group-hover:text-[var(--color-accent)]">
            Learn more <span aria-hidden="true">↗</span>
          </span>
        </NuxtLink>
      </div>
    </BaseSection>

    <FinalCTA />
  </div>
</template>
