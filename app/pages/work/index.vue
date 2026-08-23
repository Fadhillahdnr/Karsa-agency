<script setup lang="ts">
const { data: projects } = await useAsyncData('work-listing', () =>
  queryCollection('work').order('order', 'ASC').all(),
)

useSeoMeta({
  title: 'Work',
  description: 'Selected work from Karsa Studio — independent projects, internal concepts, and experimental builds.',
})
</script>

<template>
  <div>
    <BaseSection
      tight
      class="pt-32"
    >
      <BaseHeading
        eyebrow="Work"
        size="display-2"
        as="h1"
      >
        Work we can stand behind.
      </BaseHeading>
      <p class="mt-6 max-w-xl text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
        A collection of independent projects, internal concepts, and experimental work — labeled honestly, not padded with clients we haven't worked with.
      </p>
    </BaseSection>

    <BaseSection
      tight
      class="pt-0"
    >
      <div
        v-if="projects?.length"
        class="flex flex-col gap-16 md:gap-24"
      >
        <TextReveal
          v-for="(project, index) in projects"
          :key="project.path"
          as="article"
          :delay="Math.min(index * 0.05, 0.3)"
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
              <h2 class="mt-3 font-display text-3xl font-medium">
                {{ project.title }}
              </h2>
              <p class="mt-2 text-sm text-[var(--color-text-muted)]">
                {{ project.category }} · {{ project.year }}
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
        class="max-w-md text-[var(--color-text-muted)]"
      >
        Case studies are being prepared. Get in touch to see work in progress.
      </p>
    </BaseSection>

    <FinalCTA />
  </div>
</template>
