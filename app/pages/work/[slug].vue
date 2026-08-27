<script setup lang="ts">
import gsap from 'gsap'
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

const narrativeItems = computed(() => {
  if (!project.value) return []
  return [
    { key: 'challenge', label: t('workDetail.challenge'), value: project.value.challenge },
    { key: 'approach', label: t('workDetail.approach'), value: project.value.approach },
    { key: 'outcome', label: t('workDetail.outcome'), value: project.value.outcome },
  ].filter((item): item is { key: string, label: string, value: string } => !!item.value)
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

const coverImgRef = ref<HTMLElement | null>(null)
const { prefersReduced } = useReducedMotion()

useGsapContext(() => {
  if (!coverImgRef.value || prefersReduced.value) return

  gsap.to(coverImgRef.value, {
    yPercent: 8,
    ease: 'none',
    scrollTrigger: {
      trigger: coverImgRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
})
</script>

<template>
  <div v-if="project">
    <BaseSection
      tight
      class="pt-28 pb-0"
    >
      <NuxtLink
        :to="localePath('/work')"
        class="group inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-text)]"
      >
        <span
          aria-hidden="true"
          class="inline-block transition-transform duration-[var(--duration-fast)] group-hover:-translate-x-0.5"
        >←</span>
        {{ t('workDetail.backToWork') }}
      </NuxtLink>
    </BaseSection>

    <BaseSection
      tight
      class="pt-6"
    >
      <TextReveal>
        <BaseHeading
          :eyebrow="`${project.type} · ${project.category} · ${project.year}`"
          size="display-1"
          as="h1"
        >
          {{ project.title }}
        </BaseHeading>
        <p class="mt-6 max-w-xl text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
          {{ project.description }}
        </p>
      </TextReveal>
      <TextReveal
        v-if="project.liveUrl || project.githubUrl"
        :delay="0.1"
        class="mt-8 flex flex-wrap gap-3"
      >
        <BaseButton
          v-if="project.liveUrl"
          :href="project.liveUrl"
          external
          variant="primary"
        >
          {{ t('workDetail.liveDemo') }} ↗
        </BaseButton>
        <BaseButton
          v-if="project.githubUrl"
          :href="project.githubUrl"
          external
          variant="secondary"
        >
          {{ t('workDetail.viewCode') }}
        </BaseButton>
      </TextReveal>
    </BaseSection>

    <BaseSection
      tight
      class="pt-0"
    >
      <TextReveal :delay="0.15">
        <div class="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)]">
          <div
            ref="coverImgRef"
            class="aspect-[16/10] w-full scale-[1.15] will-change-transform"
          >
            <NuxtImg
              :src="project.cover"
              :alt="`${project.title} project cover`"
              width="1920"
              height="1200"
              class="h-full w-full object-cover"
            />
          </div>
        </div>
      </TextReveal>
    </BaseSection>

    <BaseSection
      v-if="'body' in project"
      tight
      narrow
    >
      <TextReveal>
        <div class="prose prose-invert max-w-none prose-headings:font-display prose-headings:font-medium prose-p:text-[var(--color-text-muted)]">
          <ContentRenderer :value="project" />
        </div>
      </TextReveal>
    </BaseSection>

    <BaseSection
      v-if="narrativeItems.length"
      tight
      narrow
    >
      <div class="flex flex-col divide-y divide-[var(--color-border)]">
        <TextReveal
          v-for="(item, index) in narrativeItems"
          :key="item.key"
          as="div"
          :delay="Math.min(index * 0.08, 0.3)"
          class="grid grid-cols-1 gap-4 py-10 first:pt-0 last:pb-0 md:grid-cols-[160px_1fr] md:gap-10"
        >
          <p class="font-display text-sm text-[var(--color-text-muted)]">
            {{ String(index + 1).padStart(2, '0') }}
          </p>
          <div>
            <p class="text-eyebrow mb-3">
              {{ item.label }}
            </p>
            <p class="max-w-2xl text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
              {{ item.value }}
            </p>
          </div>
        </TextReveal>
      </div>
    </BaseSection>

    <BaseSection
      tight
      narrow
    >
      <TextReveal>
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
      </TextReveal>
    </BaseSection>

    <BaseSection
      v-if="nextProject"
      tight
      class="border-t border-[var(--color-border)]"
    >
      <TextReveal>
        <p class="text-eyebrow mb-6">
          {{ t('workDetail.nextProject') }}
        </p>
        <NuxtLink
          :to="localePath(nextProject.path)"
          class="group grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12"
        >
          <div class="order-2 md:order-1">
            <span class="block font-display text-4xl font-medium md:text-6xl">{{ nextProject.title }}</span>
            <span class="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)]">
              {{ t('common.viewCaseStudy') }}
              <span
                aria-hidden="true"
                class="transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1"
              >→</span>
            </span>
          </div>
          <div class="order-1 overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)] md:order-2">
            <NuxtImg
              :src="nextProject.cover"
              :alt="`${nextProject.title} project cover`"
              width="1200"
              height="750"
              loading="lazy"
              class="aspect-[16/10] w-full object-cover transition-transform duration-[var(--duration-slow)] group-hover:scale-[1.03]"
            />
          </div>
        </NuxtLink>
      </TextReveal>
    </BaseSection>

    <FinalCTA />
  </div>
</template>
