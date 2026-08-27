<script setup lang="ts">
import type { WorkApiItem } from '../../../server/api/work/index.get'

const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const slug = route.params.slug as string
const path = `/work/${slug}`
const workCollection = computed(() => locale.value === 'id' ? 'workId' : 'work')

const { data: project } = await useAsyncData(`work-${slug}-${locale.value}`, async () => {
  const fromContent = await queryCollection(workCollection.value).path(path).first()
  if (fromContent) return fromContent
  return $fetch<WorkApiItem | null>(`/api/work/${slug}`).catch(() => null)
})

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

const { data: nextProject } = await useAsyncData(`work-next-${slug}-${locale.value}`, async () => {
  const [contentItems, dbItems] = await Promise.all([
    queryCollection(workCollection.value).order('order', 'ASC').all(),
    $fetch<WorkApiItem[]>('/api/work').catch(() => []),
  ])
  const all = [...contentItems, ...dbItems].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const currentIndex = all.findIndex(item => item.path === path)
  if (currentIndex === -1) return null
  return all[(currentIndex + 1) % all.length]
})

useSeoMeta({
  title: project.value?.title,
  description: project.value?.description,
  ogTitle: project.value?.title,
  ogDescription: project.value?.description,
  ogImage: project.value?.cover,
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Work', item: '/work' },
      { name: project.value!.title },
    ],
  }),
])

const { track } = useAnalytics()
onMounted(() => track('project_view', { project: route.params.slug as string }))
</script>

<template>
  <div v-if="project">
    <BaseSection
      tight
      class="pt-32"
    >
      <p class="text-eyebrow">
        {{ project.type }} · {{ project.category }} · {{ project.year }}
      </p>
      <BaseHeading
        size="display-2"
        as="h1"
        class="mt-4"
      >
        {{ project.title }}
      </BaseHeading>
      <p class="mt-6 max-w-xl text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
        {{ project.description }}
      </p>
      <div
        v-if="project.liveUrl || project.githubUrl"
        class="mt-6 flex flex-wrap gap-3"
      >
        <BaseButton
          v-if="project.liveUrl"
          :href="project.liveUrl"
          external
          variant="primary"
        >
          {{ t('workDetail.liveDemo') }}
        </BaseButton>
        <BaseButton
          v-if="project.githubUrl"
          :href="project.githubUrl"
          external
          variant="secondary"
        >
          {{ t('workDetail.viewCode') }}
        </BaseButton>
      </div>
    </BaseSection>

    <BaseSection
      tight
      class="pt-0"
    >
      <div class="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)]">
        <NuxtImg
          :src="project.cover"
          :alt="`${project.title} project cover`"
          width="1920"
          height="1200"
          class="aspect-[16/10] w-full object-cover"
        />
      </div>
    </BaseSection>

    <BaseSection
      v-if="'body' in project"
      tight
      narrow
    >
      <div class="prose prose-invert max-w-none prose-headings:font-display prose-headings:font-medium prose-p:text-[var(--color-text-muted)]">
        <ContentRenderer :value="project" />
      </div>
    </BaseSection>

    <BaseSection
      tight
      narrow
      class="grid grid-cols-1 gap-10 sm:grid-cols-3"
    >
      <div v-if="project.challenge">
        <p class="text-eyebrow mb-3">
          {{ t('workDetail.challenge') }}
        </p>
        <p class="text-sm text-[var(--color-text-muted)]">
          {{ project.challenge }}
        </p>
      </div>
      <div v-if="project.approach">
        <p class="text-eyebrow mb-3">
          {{ t('workDetail.approach') }}
        </p>
        <p class="text-sm text-[var(--color-text-muted)]">
          {{ project.approach }}
        </p>
      </div>
      <div v-if="project.outcome">
        <p class="text-eyebrow mb-3">
          {{ t('workDetail.outcome') }}
        </p>
        <p class="text-sm text-[var(--color-text-muted)]">
          {{ project.outcome }}
        </p>
      </div>
    </BaseSection>

    <BaseSection
      tight
      narrow
    >
      <p class="text-eyebrow mb-4">
        {{ t('workDetail.services') }}
      </p>
      <ul class="flex flex-wrap gap-3">
        <li
          v-for="service in project.services"
          :key="service"
          class="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm"
        >
          {{ service }}
        </li>
      </ul>
    </BaseSection>

    <BaseSection
      v-if="nextProject"
      tight
      class="border-t border-[var(--color-border)]"
    >
      <p class="text-eyebrow mb-4">
        {{ t('workDetail.nextProject') }}
      </p>
      <NuxtLink
        :to="localePath(nextProject.path)"
        class="group flex items-center justify-between gap-4"
      >
        <span class="font-display text-3xl font-medium md:text-5xl">{{ nextProject.title }}</span>
        <span
          aria-hidden="true"
          class="text-3xl transition-transform duration-[var(--duration-base)] group-hover:translate-x-2"
        >→</span>
      </NuxtLink>
    </BaseSection>

    <FinalCTA />
  </div>
</template>
