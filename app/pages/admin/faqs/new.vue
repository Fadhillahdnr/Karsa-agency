<script setup lang="ts">
import type { FaqFormValue } from '../../../components/admin/FaqForm.vue'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { authFetch } = useAdminAuth()
const submitting = ref(false)
const errorMessage = ref('')

async function handleSubmit(value: FaqFormValue) {
  submitting.value = true
  errorMessage.value = ''
  try {
    await authFetch('/api/admin/faqs', { method: 'POST', body: value })
    await navigateTo('/admin/faqs')
  }
  catch (error) {
    errorMessage.value = extractErrorMessage(error, 'Could not create FAQ.')
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium">
      New FAQ
    </h1>
    <div class="mt-8 max-w-3xl">
      <FaqForm
        :submitting="submitting"
        :error-message="errorMessage"
        submit-label="Create FAQ"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>
