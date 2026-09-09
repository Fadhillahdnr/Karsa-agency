<script setup lang="ts">
import type { UpdateFormValue } from '../../../components/admin/UpdateForm.vue'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const route = useRoute()
const id = route.params.id as string
const { authFetch } = useAdminAuth()

const initialFormValue = ref<UpdateFormValue | undefined>(undefined)
const loading = ref(true)
const submitting = ref(false)
const errorMessage = ref('')

async function loadUpdate() {
  loading.value = true
  try {
    const data = await authFetch<Record<string, unknown>>(`/api/admin/updates/${id}`)
    initialFormValue.value = {
      slug: data.slug as string,
      status: data.status as UpdateFormValue['status'],
      translations: data.translations as UpdateFormValue['translations'],
    }
  }
  catch {
    errorMessage.value = 'Could not load this update.'
  }
  finally {
    loading.value = false
  }
}

async function handleSubmit(value: UpdateFormValue) {
  submitting.value = true
  errorMessage.value = ''
  try {
    await authFetch(`/api/admin/updates/${id}`, { method: 'PATCH', body: value })
    await navigateTo('/admin/updates')
  }
  catch (error) {
    errorMessage.value = extractErrorMessage(error, 'Could not update this entry.')
  }
  finally {
    submitting.value = false
  }
}

onMounted(loadUpdate)
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium">
      Edit update
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
      <UpdateForm
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
      {{ errorMessage || 'Update not found.' }}
    </p>
  </div>
</template>
