<script setup lang="ts">
import type { FaqFormValue } from '../../../components/admin/FaqForm.vue'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const route = useRoute()
const id = route.params.id as string
const { authFetch } = useAdminAuth()

const initialFormValue = ref<FaqFormValue | undefined>(undefined)
const loading = ref(true)
const submitting = ref(false)
const errorMessage = ref('')

async function loadFaq() {
  loading.value = true
  try {
    const data = await authFetch<Record<string, unknown>>(`/api/admin/faqs/${id}`)
    initialFormValue.value = {
      category: (data.category as string | null) ?? '',
      orderIndex: data.order_index as number,
      featured: data.featured as boolean,
      status: data.status as FaqFormValue['status'],
      translations: data.translations as FaqFormValue['translations'],
    }
  }
  catch {
    errorMessage.value = 'Could not load this FAQ.'
  }
  finally {
    loading.value = false
  }
}

async function handleSubmit(value: FaqFormValue) {
  submitting.value = true
  errorMessage.value = ''
  try {
    await authFetch(`/api/admin/faqs/${id}`, { method: 'PATCH', body: value })
    await navigateTo('/admin/faqs')
  }
  catch (error) {
    errorMessage.value = extractErrorMessage(error, 'Could not update FAQ.')
  }
  finally {
    submitting.value = false
  }
}

onMounted(loadFaq)
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium">
      Edit FAQ
    </h1>

    <p
      v-if="loading"
      class="mt-8 text-sm text-[var(--color-text-muted)]"
    >
      Loading…
    </p>

    <div
      v-else-if="initialFormValue"
      class="mt-8 max-w-3xl"
    >
      <FaqForm
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
      {{ errorMessage || 'FAQ not found.' }}
    </p>
  </div>
</template>
