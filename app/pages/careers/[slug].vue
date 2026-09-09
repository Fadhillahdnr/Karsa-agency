<script setup lang="ts">
import type { CareerDetailApiItem } from '../../../server/api/careers/[slug].get'

const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { site } = useKarsaConfig()
const slug = route.params.slug as string

const { data: career } = await useAsyncData(`career-${slug}-${locale.value}`, () =>
  $fetch<CareerDetailApiItem | null>(`/api/careers/${slug}`, { query: { locale: locale.value } }),
)

if (!career.value) {
  throw createError({ statusCode: 404, statusMessage: 'Career listing not found', fatal: true })
}

useSeoMeta({
  title: career.value.seoTitle || career.value.title,
  description: career.value.seoDescription || career.value.summary || undefined,
  ogTitle: career.value.title,
  ogDescription: career.value.summary || undefined,
})

const EMPLOYMENT_TYPE_MAP: Record<string, 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'TEMPORARY' | 'INTERN' | 'VOLUNTEER'> = {
  'full-time': 'FULL_TIME',
  'part-time': 'PART_TIME',
  'contract': 'CONTRACTOR',
  'contractor': 'CONTRACTOR',
  'freelance': 'CONTRACTOR',
  'temporary': 'TEMPORARY',
  'internship': 'INTERN',
  'intern': 'INTERN',
  'volunteer': 'VOLUNTEER',
}
const employmentType = career.value.employmentType
  ? EMPLOYMENT_TYPE_MAP[career.value.employmentType.trim().toLowerCase()]
  : undefined

// jobLocation is a discriminated union in the schema.org types (either a
// real Place, or jobLocationType: 'TELECOMMUTE' with a location requirement)
// — branch rather than passing `undefined` into a required field.
useSchemaOrg([
  career.value.location
    ? defineJobPosting({
        title: career.value.title,
        description: career.value.summary || career.value.title,
        datePosted: career.value.publishedAt || new Date().toISOString(),
        validThrough: career.value.closingAt || undefined,
        employmentType,
        hiringOrganization: { name: site.value.name },
        jobLocation: { address: { addressLocality: career.value.location, addressCountry: 'ID' } },
      })
    : defineJobPosting({
        title: career.value.title,
        description: career.value.summary || career.value.title,
        datePosted: career.value.publishedAt || new Date().toISOString(),
        validThrough: career.value.closingAt || undefined,
        employmentType,
        hiringOrganization: { name: site.value.name },
        jobLocationType: 'TELECOMMUTE',
        applicantLocationRequirements: [{ name: 'Indonesia' }],
      }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'Careers', item: '/careers' },
      { name: career.value.title },
    ],
  }),
])
</script>

<template>
  <div v-if="career">
    <BaseSection
      tight
      class="pt-32"
    >
      <p
        v-if="career.department"
        class="text-eyebrow"
      >
        {{ career.department }}
      </p>
      <BaseHeading
        size="display-2"
        as="h1"
        class="mt-4"
      >
        {{ career.title }}
      </BaseHeading>
      <p class="mt-6 flex flex-wrap gap-3 text-sm text-[var(--color-text-muted)]">
        <span v-if="career.employmentType">{{ career.employmentType }}</span>
        <span v-if="career.workMode">{{ career.workMode }}</span>
        <span v-if="career.location">{{ career.location }}</span>
      </p>
    </BaseSection>

    <BaseSection
      tight
      narrow
      class="border-t border-[var(--color-border)]"
    >
      <p
        v-if="career.summary"
        class="text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]"
      >
        {{ career.summary }}
      </p>

      <div
        v-if="career.responsibilities.length"
        class="mt-10"
      >
        <h2 class="font-display text-lg font-medium">
          {{ t('careersIndex.responsibilities') }}
        </h2>
        <ul class="mt-4 flex flex-col gap-2 text-sm text-[var(--color-text-muted)]">
          <li
            v-for="item in career.responsibilities"
            :key="item"
            class="flex gap-2"
          >
            <span aria-hidden="true">—</span>{{ item }}
          </li>
        </ul>
      </div>

      <div
        v-if="career.requirements.length"
        class="mt-10"
      >
        <h2 class="font-display text-lg font-medium">
          {{ t('careersIndex.requirements') }}
        </h2>
        <ul class="mt-4 flex flex-col gap-2 text-sm text-[var(--color-text-muted)]">
          <li
            v-for="item in career.requirements"
            :key="item"
            class="flex gap-2"
          >
            <span aria-hidden="true">—</span>{{ item }}
          </li>
        </ul>
      </div>

      <div
        v-if="career.niceToHave.length"
        class="mt-10"
      >
        <h2 class="font-display text-lg font-medium">
          {{ t('careersIndex.niceToHave') }}
        </h2>
        <ul class="mt-4 flex flex-col gap-2 text-sm text-[var(--color-text-muted)]">
          <li
            v-for="item in career.niceToHave"
            :key="item"
            class="flex gap-2"
          >
            <span aria-hidden="true">—</span>{{ item }}
          </li>
        </ul>
      </div>

      <div
        v-if="career.applicationUrl || career.applicationEmail"
        class="mt-12 flex flex-wrap gap-4"
      >
        <BaseButton
          v-if="career.applicationUrl"
          :href="career.applicationUrl"
          variant="primary"
        >
          {{ t('careersIndex.apply') }}
        </BaseButton>
        <BaseButton
          v-else-if="career.applicationEmail"
          :href="`mailto:${career.applicationEmail}`"
          variant="primary"
        >
          {{ t('careersIndex.apply') }}
        </BaseButton>
      </div>
    </BaseSection>

    <div class="border-t border-[var(--color-border)] pt-6 pb-16">
      <BaseContainer>
        <NuxtLink
          :to="localePath('/careers')"
          class="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
        >
          ← {{ t('careersIndex.backToCareers') }}
        </NuxtLink>
      </BaseContainer>
    </div>

    <FinalCTA />
  </div>
</template>
