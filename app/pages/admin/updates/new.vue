<script setup lang="ts">
import type { UpdateFormValue } from '../../../components/admin/UpdateForm.vue'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { authFetch } = useAdminAuth()
const submitting = ref(false)
const errorMessage = ref('')

async function handleSubmit(value: UpdateFormValue) {
  submitting.value = true
  errorMessage.value = ''
  try {
    const created = await authFetch<{ id: string }>('/api/admin/updates', { method: 'POST', body: value })
    await navigateTo(`/admin/updates/${created.id}`)
  }
  catch (error) {
    errorMessage.value = extractErrorMessage(error, 'Could not create update.')
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium">
      New update
    </h1>
    <div class="mt-8 max-w-4xl">
      <UpdateForm
        :submitting="submitting"
        :error-message="errorMessage"
        submit-label="Create update"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>
