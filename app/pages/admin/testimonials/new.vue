<script setup lang="ts">
import type { TestimonialFormValue } from '../../../components/admin/TestimonialForm.vue'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { authFetch } = useAdminAuth()
const submitting = ref(false)
const errorMessage = ref('')

async function handleSubmit(value: TestimonialFormValue) {
  submitting.value = true
  errorMessage.value = ''
  try {
    const created = await authFetch<{ id: string }>('/api/admin/testimonials', { method: 'POST', body: value })
    await navigateTo(`/admin/testimonials/${created.id}`)
  }
  catch (error) {
    errorMessage.value = extractErrorMessage(error, 'Could not create testimonial.')
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium">
      New testimonial
    </h1>
    <div class="mt-8 max-w-3xl">
      <TestimonialForm
        :submitting="submitting"
        :error-message="errorMessage"
        submit-label="Create testimonial"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>
