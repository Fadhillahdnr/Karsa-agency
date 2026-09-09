<script setup lang="ts">
import type { PackageFormValue } from '../../../components/admin/PackageForm.vue'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const route = useRoute()
const id = route.params.id as string

const { authFetch } = useAdminAuth()

const initialFormValue = ref<PackageFormValue | undefined>(undefined)
const availableServices = ref<{ id: string, title: string }[]>([])
const loading = ref(true)
const submitting = ref(false)
const errorMessage = ref('')

async function loadPackage() {
  loading.value = true
  try {
    const [data, services] = await Promise.all([
      authFetch<Record<string, unknown>>(`/api/admin/packages/${id}`),
      authFetch<{ id: string, title: string }[]>('/api/admin/services').catch(() => []),
    ])
    availableServices.value = services.map(s => ({ id: s.id, title: s.title }))
    initialFormValue.value = {
      slug: data.slug as string,
      category: data.category as PackageFormValue['category'],
      priceType: data.price_type as PackageFormValue['priceType'],
      price: data.price as number | null,
      currency: data.currency as string,
      badge: (data.badge as string | null) ?? '',
      featured: data.featured as boolean,
      orderIndex: data.order_index as number,
      status: data.status as PackageFormValue['status'],
      serviceIds: data.serviceIds as string[],
      items: data.items as PackageFormValue['items'],
      translations: data.translations as PackageFormValue['translations'],
    }
  }
  catch {
    errorMessage.value = 'Could not load this package.'
  }
  finally {
    loading.value = false
  }
}

async function handleSubmit(value: PackageFormValue) {
  submitting.value = true
  errorMessage.value = ''

  try {
    await authFetch(`/api/admin/packages/${id}`, { method: 'PATCH', body: value })
    await navigateTo('/admin/packages')
  }
  catch (error) {
    errorMessage.value = extractErrorMessage(error, 'Could not update package.')
  }
  finally {
    submitting.value = false
  }
}

onMounted(loadPackage)
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium">
      Edit package
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
      <PackageForm
        :initial="initialFormValue"
        :submitting="submitting"
        :error-message="errorMessage"
        :available-services="availableServices"
        submit-label="Save changes"
        @submit="handleSubmit"
      />
    </div>

    <p
      v-else
      class="mt-8 text-sm text-[var(--color-danger)]"
    >
      {{ errorMessage || 'Package not found.' }}
    </p>
  </div>
</template>
