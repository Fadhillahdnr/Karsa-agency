<script setup lang="ts">
import type { LegalPageFormValue } from '../../../components/admin/LegalPageForm.vue'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const route = useRoute()
const id = route.params.id as string
const { authFetch } = useAdminAuth()

const slug = ref('')
const initialFormValue = ref<LegalPageFormValue | undefined>(undefined)
const loading = ref(true)
const submitting = ref(false)
const errorMessage = ref('')

async function loadLegalPage() {
  loading.value = true
  try {
    const data = await authFetch<Record<string, unknown>>(`/api/admin/legal/${id}`)
    slug.value = data.slug as string
    initialFormValue.value = {
      translations: data.translations as LegalPageFormValue['translations'],
    }
  }
  catch {
    errorMessage.value = 'Could not load this legal page.'
  }
  finally {
    loading.value = false
  }
}

async function handleSubmit(value: LegalPageFormValue) {
  submitting.value = true
  errorMessage.value = ''
  try {
    await authFetch(`/api/admin/legal/${id}`, { method: 'PATCH', body: value })
    await navigateTo('/admin/legal')
  }
  catch (error) {
    errorMessage.value = extractErrorMessage(error, 'Could not update this legal page.')
  }
  finally {
    submitting.value = false
  }
}

onMounted(loadLegalPage)
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium">
      Edit /{{ slug }}
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
      <LegalPageForm
        :initial="initialFormValue"
        :submitting="submitting"
        :error-message="errorMessage"
        @submit="handleSubmit"
      />
    </div>

    <p
      v-else
      class="mt-8 text-sm text-[var(--color-danger)]"
    >
      {{ errorMessage || 'Legal page not found.' }}
    </p>
  </div>
</template>
