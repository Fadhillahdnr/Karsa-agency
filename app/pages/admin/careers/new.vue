<script setup lang="ts">
import type { CareerFormValue } from '../../../components/admin/CareerForm.vue'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { authFetch } = useAdminAuth()
const submitting = ref(false)
const errorMessage = ref('')

function linesToArray(text: string) {
  return text.split('\n').map(line => line.trim()).filter(Boolean)
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

async function handleSubmit(value: CareerFormValue) {
  submitting.value = true
  errorMessage.value = ''
  try {
    const created = await authFetch<{ id: string }>('/api/admin/careers', {
      method: 'POST',
      body: toBody(value),
    })
    await navigateTo(`/admin/careers/${created.id}`)
  }
  catch (error) {
    errorMessage.value = extractErrorMessage(error, 'Could not create career listing.')
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium">
      New career listing
    </h1>
    <div class="mt-8 max-w-4xl">
      <CareerForm
        :submitting="submitting"
        :error-message="errorMessage"
        submit-label="Create listing"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>
