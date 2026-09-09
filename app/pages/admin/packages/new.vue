<script setup lang="ts">
import type { PackageFormValue } from '../../../components/admin/PackageForm.vue'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { authFetch } = useAdminAuth()
const submitting = ref(false)
const errorMessage = ref('')
const availableServices = ref<{ id: string, title: string }[]>([])

async function loadServices() {
  try {
    const services = await authFetch<{ id: string, title: string }[]>('/api/admin/services')
    availableServices.value = services.map(s => ({ id: s.id, title: s.title }))
  }
  catch {
    // Non-fatal — service linking is optional, form still works without it.
  }
}

async function handleSubmit(value: PackageFormValue) {
  submitting.value = true
  errorMessage.value = ''

  try {
    const created = await authFetch<{ id: string }>('/api/admin/packages', {
      method: 'POST',
      body: value,
    })
    await navigateTo(`/admin/packages/${created.id}`)
  }
  catch (error) {
    errorMessage.value = extractErrorMessage(error, 'Could not create package.')
  }
  finally {
    submitting.value = false
  }
}

onMounted(loadServices)
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium">
      New package
    </h1>

    <div class="mt-8 max-w-4xl">
      <PackageForm
        :submitting="submitting"
        :error-message="errorMessage"
        :available-services="availableServices"
        submit-label="Create package"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>
