<script setup lang="ts">
const { data: projects } = await useAsyncData('home-selected-work', () =>
  queryCollection('work').order('order', 'ASC').limit(3).all(),
)
</script>

<template>
  <BaseSection id="selected-work">
    <div class="flex flex-wrap items-end justify-between gap-6">
      <BaseHeading
        eyebrow="Selected Work"
        size="h1"
      >
        Work we can stand behind.
      </BaseHeading>
      <BaseLink
        to="/work"
        show-arrow
      >
        View all work
      </BaseLink>
    </div>

    <div
      v-if="projects?.length"
      class="mt-16 flex flex-col gap-16 md:gap-24"
    >
      <TextReveal
        v-for="(project, index) in projects"
        :key="project.path"
        as="article"
        :delay="index * 0.05"
      >
        <NuxtLink
          :to="project.path"
          class="group grid grid-cols-1 gap-6 md:grid-cols-2 md:items-center md:gap-12"
        >
          <div class="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)]">
            <NuxtImg
              :src="project.cover"
              :alt="`${project.title} project cover`"
              width="1600"
              height="1000"
              loading="lazy"
              class="aspect-[16/10] w-full object-cover transition-transform duration-[var(--duration-slow)] group-hover:scale-[1.03]"
            />
          </div>
          <div>
            <p class="font-display text-sm text-[var(--color-text-muted)]">
              {{ String(index + 1).padStart(2, '0') }} / {{ project.type }}
            </p>
            <h3 class="mt-3 font-display text-3xl font-medium">
              {{ project.title }}
            </h3>
            <p class="mt-2 text-sm text-[var(--color-text-muted)]">
              {{ project.category }}
            </p>
            <p class="mt-4 max-w-md text-[length:var(--text-body)] text-[var(--color-text-muted)]">
              {{ project.description }}
            </p>
            <p class="mt-4 text-sm text-[var(--color-text-muted)]">
              {{ project.services.join(' · ') }}
            </p>
            <span class="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
              View Case Study <span aria-hidden="true">↗</span>
            </span>
          </div>
        </NuxtLink>
      </TextReveal>
    </div>

    <p
      v-else
      class="mt-16 max-w-md text-[var(--color-text-muted)]"
    >
      Case studies are being prepared. In the meantime, get in touch to see work in progress.
    </p>
  </BaseSection>
</template>
