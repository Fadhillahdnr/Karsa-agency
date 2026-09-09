<script setup lang="ts">
import type { ServiceFormValue } from '../../../components/admin/ServiceForm.vue'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const route = useRoute()
const id = route.params.id as string

const { authFetch } = useAdminAuth()

const initialFormValue = ref<ServiceFormValue | undefined>(undefined)
const loading = ref(true)
const submitting = ref(false)
const errorMessage = ref('')

async function loadService() {
  loading.value = true
  try {
    const data = await authFetch<Record<string, unknown>>(`/api/admin/services/${id}`)
    initialFormValue.value = {
      slug: data.slug as string,
      category: data.category as ServiceFormValue['category'],
      featured: data.featured as boolean,
      showPrice: data.show_price as boolean,
      priceType: data.price_type as ServiceFormValue['priceType'],
      startingPrice: data.starting_price as number | null,
      currency: data.currency as string,
      orderIndex: data.order_index as number,
      status: data.status as ServiceFormValue['status'],
      translations: data.translations as ServiceFormValue['translations'],
      faqs: data.faqs as ServiceFormValue['faqs'],
    }
  }
  catch {
    errorMessage.value = 'Could not load this service.'
  }
  finally {
    loading.value = false
  }
}

async function handleSubmit(value: ServiceFormValue) {
  submitting.value = true
  errorMessage.value = ''

  try {
    await authFetch(`/api/admin/services/${id}`, { method: 'PATCH', body: value })
    await navigateTo('/admin/services')
  }
  catch (error) {
    errorMessage.value = extractErrorMessage(error, 'Could not update service.')
  }
  finally {
    submitting.value = false
  }
}

onMounted(loadService)
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium">
      Edit service
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
      <ServiceForm
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
      {{ errorMessage || 'Service not found.' }}
    </p>
  </div>
</template>
