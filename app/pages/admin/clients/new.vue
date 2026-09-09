<script setup lang="ts">
import type { ClientFormValue } from '../../../components/admin/ClientForm.vue'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { authFetch } = useAdminAuth()
const submitting = ref(false)
const errorMessage = ref('')

async function handleSubmit(value: ClientFormValue) {
  submitting.value = true
  errorMessage.value = ''
  try {
    const created = await authFetch<{ id: string }>('/api/admin/clients', { method: 'POST', body: value })
    await navigateTo(`/admin/clients/${created.id}`)
  }
  catch (error) {
    errorMessage.value = extractErrorMessage(error, 'Could not create client.')
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium">
      New client
    </h1>
    <div class="mt-8 max-w-3xl">
      <ClientForm
        :submitting="submitting"
        :error-message="errorMessage"
        submit-label="Create client"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>
