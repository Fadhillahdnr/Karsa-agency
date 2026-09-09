<script setup lang="ts">
import type { PortfolioFormValue } from '../../../../components/admin/PortfolioForm.vue'
import type { ClientRow } from '../../../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const route = useRoute()
const discipline = route.params.discipline as 'design' | 'photography' | 'videography'
const disciplineLabel = discipline.charAt(0).toUpperCase() + discipline.slice(1)
const id = route.params.id as string

const { authFetch } = useAdminAuth()

const initialFormValue = ref<PortfolioFormValue | undefined>(undefined)
const availableClients = ref<{ id: string, name: string }[]>([])
const loading = ref(true)
const submitting = ref(false)
const errorMessage = ref('')

async function loadCollection() {
  loading.value = true
  try {
    const [data, clients] = await Promise.all([
      authFetch<Record<string, unknown>>(`/api/admin/portfolio/${id}`),
      authFetch<ClientRow[]>('/api/admin/clients').catch(() => []),
    ])
    availableClients.value = clients.map(c => ({ id: c.id, name: c.name }))
    initialFormValue.value = {
      slug: data.slug as string,
      discipline,
      category: (data.category as string | null) ?? '',
      clientId: data.client_id as string | null,
      projectId: data.project_id as string | null,
      coverMediaId: data.cover_media_id as string | null,
      featured: data.featured as boolean,
      permissionToShow: data.permission_to_show as boolean,
      orderIndex: data.order_index as number,
      status: data.status as PortfolioFormValue['status'],
      translations: data.translations as PortfolioFormValue['translations'],
      items: data.items as PortfolioFormValue['items'],
    }
  }
  catch {
    errorMessage.value = 'Could not load this collection.'
  }
  finally {
    loading.value = false
  }
}

async function handleSubmit(value: PortfolioFormValue) {
  submitting.value = true
  errorMessage.value = ''
  try {
    await authFetch(`/api/admin/portfolio/${id}`, { method: 'PATCH', body: value })
    await navigateTo(`/admin/portfolio/${discipline}`)
  }
  catch (error) {
    errorMessage.value = extractErrorMessage(error, 'Could not update collection.')
  }
  finally {
    submitting.value = false
  }
}

onMounted(loadCollection)
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium">
      Edit {{ disciplineLabel }} collection
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
      <PortfolioForm
        :discipline="discipline"
        :initial="initialFormValue"
        :submitting="submitting"
        :error-message="errorMessage"
        :available-clients="availableClients"
        submit-label="Save changes"
        @submit="handleSubmit"
      />
    </div>

    <p
      v-else
      class="mt-8 text-sm text-[var(--color-danger)]"
    >
      {{ errorMessage || 'Collection not found.' }}
    </p>
  </div>
</template>
