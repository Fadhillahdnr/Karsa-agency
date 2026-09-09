<script setup lang="ts">
import type { PortfolioFormValue } from '../../../../components/admin/PortfolioForm.vue'
import type { ClientRow } from '../../../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const route = useRoute()
const discipline = route.params.discipline as 'design' | 'photography' | 'videography'
const disciplineLabel = discipline.charAt(0).toUpperCase() + discipline.slice(1)

const { authFetch } = useAdminAuth()
const submitting = ref(false)
const errorMessage = ref('')
const availableClients = ref<{ id: string, name: string }[]>([])

async function loadClients() {
  try {
    const clients = await authFetch<ClientRow[]>('/api/admin/clients')
    availableClients.value = clients.map(c => ({ id: c.id, name: c.name }))
  }
  catch {
    // Non-fatal — client linking is optional.
  }
}

async function handleSubmit(value: PortfolioFormValue) {
  submitting.value = true
  errorMessage.value = ''
  try {
    const created = await authFetch<{ id: string }>('/api/admin/portfolio', {
      method: 'POST',
      body: { ...value, discipline },
    })
    await navigateTo(`/admin/portfolio/${discipline}/${created.id}`)
  }
  catch (error) {
    errorMessage.value = extractErrorMessage(error, 'Could not create collection.')
  }
  finally {
    submitting.value = false
  }
}

onMounted(loadClients)
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium">
      New {{ disciplineLabel }} collection
    </h1>
    <div class="mt-8 max-w-4xl">
      <PortfolioForm
        :discipline="discipline"
        :submitting="submitting"
        :error-message="errorMessage"
        :available-clients="availableClients"
        submit-label="Create collection"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>
