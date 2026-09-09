<script setup lang="ts">
import type { ClientRow } from '../../../../server/utils/supabase'
import type { ClientFormValue } from '../../../components/admin/ClientForm.vue'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const route = useRoute()
const id = route.params.id as string
const { authFetch } = useAdminAuth()

const initialFormValue = ref<ClientFormValue | undefined>(undefined)
const loading = ref(true)
const submitting = ref(false)
const errorMessage = ref('')

async function loadClient() {
  loading.value = true
  try {
    const data = await authFetch<ClientRow>(`/api/admin/clients/${id}`)
    initialFormValue.value = {
      name: data.name,
      slug: data.slug,
      websiteUrl: data.website_url ?? '',
      industry: data.industry ?? '',
      description: data.description ?? '',
      featured: data.featured,
      permissionToShow: data.permission_to_show,
      orderIndex: data.order_index,
      status: data.status,
    }
  }
  catch {
    errorMessage.value = 'Could not load this client.'
  }
  finally {
    loading.value = false
  }
}

async function handleSubmit(value: ClientFormValue) {
  submitting.value = true
  errorMessage.value = ''
  try {
    await authFetch(`/api/admin/clients/${id}`, { method: 'PATCH', body: value })
    await navigateTo('/admin/clients')
  }
  catch (error) {
    errorMessage.value = extractErrorMessage(error, 'Could not update client.')
  }
  finally {
    submitting.value = false
  }
}

onMounted(loadClient)
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium">
      Edit client
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
      <ClientForm
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
      {{ errorMessage || 'Client not found.' }}
    </p>
  </div>
</template>
