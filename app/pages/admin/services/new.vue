<script setup lang="ts">
import type { ServiceFormValue } from '../../../components/admin/ServiceForm.vue'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { authFetch } = useAdminAuth()
const submitting = ref(false)
const errorMessage = ref('')

async function handleSubmit(value: ServiceFormValue) {
  submitting.value = true
  errorMessage.value = ''

  try {
    const created = await authFetch<{ id: string }>('/api/admin/services', {
      method: 'POST',
      body: value,
    })
    await navigateTo(`/admin/services/${created.id}`)
  }
  catch (error) {
    errorMessage.value = extractErrorMessage(error, 'Could not create service.')
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium">
      New service
    </h1>

    <div class="mt-8 max-w-4xl">
      <ServiceForm
        :submitting="submitting"
        :error-message="errorMessage"
        submit-label="Create service"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>
