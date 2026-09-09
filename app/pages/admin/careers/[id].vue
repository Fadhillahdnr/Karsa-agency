<script setup lang="ts">
import type { CareerFormValue } from '../../../components/admin/CareerForm.vue'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const route = useRoute()
const id = route.params.id as string
const { authFetch } = useAdminAuth()

const initialFormValue = ref<CareerFormValue | undefined>(undefined)
const loading = ref(true)
const submitting = ref(false)
const errorMessage = ref('')

function linesToArray(text: string) {
  return text.split('\n').map(line => line.trim()).filter(Boolean)
}

function arrayToLines(items: string[]) {
  return items.join('\n')
}

function toBody(value: CareerFormValue) {
  const { translations, ...rest } = value
  return {
    ...rest,
    translations: {
      en: {
        title: translations.en.title,
        summary: translations.en.summary,
        responsibilities: linesToArray(translations.en.responsibilitiesText),
        requirements: linesToArray(translations.en.requirementsText),
        niceToHave: linesToArray(translations.en.niceToHaveText),
        seoTitle: translations.en.seoTitle,
        seoDescription: translations.en.seoDescription,
      },
      id: {
        title: translations.id.title,
        summary: translations.id.summary,
        responsibilities: linesToArray(translations.id.responsibilitiesText),
        requirements: linesToArray(translations.id.requirementsText),
        niceToHave: linesToArray(translations.id.niceToHaveText),
        seoTitle: translations.id.seoTitle,
        seoDescription: translations.id.seoDescription,
      },
    },
  }
}

async function loadCareer() {
  loading.value = true
  try {
    const data = await authFetch<Record<string, unknown>>(`/api/admin/careers/${id}`)
    const translations = data.translations as Record<'en' | 'id', {
      title: string
      summary: string
      responsibilities: string[]
      requirements: string[]
      niceToHave: string[]
      seoTitle: string
      seoDescription: string
    }>

    initialFormValue.value = {
      slug: data.slug as string,
      department: (data.department as string | null) ?? '',
      employmentType: (data.employment_type as string | null) ?? '',
      location: (data.location as string | null) ?? '',
      workMode: (data.work_mode as string | null) ?? '',
      applicationUrl: (data.application_url as string | null) ?? '',
      applicationEmail: (data.application_email as string | null) ?? '',
      orderIndex: data.order_index as number,
      status: data.status as CareerFormValue['status'],
      closingAt: (data.closing_at as string | null) ?? null,
      translations: {
        en: {
          title: translations.en.title,
          summary: translations.en.summary,
          responsibilitiesText: arrayToLines(translations.en.responsibilities),
          requirementsText: arrayToLines(translations.en.requirements),
          niceToHaveText: arrayToLines(translations.en.niceToHave),
          seoTitle: translations.en.seoTitle,
          seoDescription: translations.en.seoDescription,
        },
        id: {
          title: translations.id.title,
          summary: translations.id.summary,
          responsibilitiesText: arrayToLines(translations.id.responsibilities),
          requirementsText: arrayToLines(translations.id.requirements),
          niceToHaveText: arrayToLines(translations.id.niceToHave),
          seoTitle: translations.id.seoTitle,
          seoDescription: translations.id.seoDescription,
        },
      },
    }
  }
  catch {
    errorMessage.value = 'Could not load this career listing.'
  }
  finally {
    loading.value = false
  }
}

async function handleSubmit(value: CareerFormValue) {
  submitting.value = true
  errorMessage.value = ''
  try {
    await authFetch(`/api/admin/careers/${id}`, { method: 'PATCH', body: toBody(value) })
    await navigateTo('/admin/careers')
  }
  catch (error) {
    errorMessage.value = extractErrorMessage(error, 'Could not update career listing.')
  }
  finally {
    submitting.value = false
  }
}

onMounted(loadCareer)
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium">
      Edit career listing
    </h1>

    <p
      v-if="loading"
      class="mt-8 text-sm text-[var(--color-text-muted)]"
    >
      Loading…
    </p>

    <div
      v-else-if="initialFormValue"
      class="mt-8 max-w-4xl"
    >
      <CareerForm
        :initial="initialFormValue"
        :submitting="submitting"
        :error-message="errorMessage"
        submit-label="Save changes"
        @submit="handleSubmit"
      />
    </div>

    <p
      v-else
      class="mt-8 text-sm text-[var(--color-danger)]"
    >
      {{ errorMessage || 'Career listing not found.' }}
    </p>
  </div>
</template>
