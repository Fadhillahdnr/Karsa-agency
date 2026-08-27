<script setup lang="ts">
import type { WorkApiItem } from '../../../server/api/work/index.get'

const { t, locale } = useI18n()
const localePath = useLocalePath()

const { data: projects } = await useAsyncData(`work-listing-${locale.value}`, async () => {
  const [contentItems, dbItems] = await Promise.all([
    queryCollection(locale.value === 'id' ? 'workId' : 'work').order('order', 'ASC').all(),
    $fetch<WorkApiItem[]>('/api/work').catch(() => []),
  ])

  return [...contentItems, ...dbItems].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
})

useSeoMeta({
  title: t('workIndex.title'),
  description: t('workIndex.description'),
})
</script>

<template>
  <div>
    <BaseSection
      tight
      class="pt-32"
    >
      <BaseHeading
        :eyebrow="t('workIndex.eyebrow')"
        size="display-2"
        as="h1"
      >
        {{ t('workIndex.title') }}
      </BaseHeading>
      <p class="mt-6 max-w-xl text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
        {{ t('workIndex.description') }}
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
            :to="localePath(project.path)"
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
                {{ t('common.viewCaseStudy') }} <span aria-hidden="true">↗</span>
              </span>
            </div>
          </NuxtLink>
        </TextReveal>
      </div>

      <p
        v-else
        class="max-w-md text-[var(--color-text-muted)]"
      >
        {{ t('workIndex.empty') }}
      </p>
    </BaseSection>

    <FinalCTA />
  </div>
</template>
