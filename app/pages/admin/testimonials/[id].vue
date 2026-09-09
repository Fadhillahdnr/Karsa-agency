<script setup lang="ts">
import type { TestimonialRow } from '../../../../server/utils/supabase'
import type { TestimonialFormValue } from '../../../components/admin/TestimonialForm.vue'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const route = useRoute()
const id = route.params.id as string
const { authFetch } = useAdminAuth()

const initialFormValue = ref<TestimonialFormValue | undefined>(undefined)
const loading = ref(true)
const submitting = ref(false)
const errorMessage = ref('')

async function loadTestimonial() {
  loading.value = true
  try {
    const data = await authFetch<TestimonialRow>(`/api/admin/testimonials/${id}`)
    initialFormValue.value = {
      quote: data.quote,
      personName: data.person_name,
      personRole: data.person_role ?? '',
      company: data.company ?? '',
      source: data.source ?? '',
      sourceUrl: data.source_url ?? '',
      permissionToShow: data.permission_to_show,
      featured: data.featured,
      orderIndex: data.order_index,
      status: data.status,
    }
  }
  catch {
    errorMessage.value = 'Could not load this testimonial.'
  }
  finally {
    loading.value = false
  }
}

async function handleSubmit(value: TestimonialFormValue) {
  submitting.value = true
  errorMessage.value = ''
  try {
    await authFetch(`/api/admin/testimonials/${id}`, { method: 'PATCH', body: value })
    await navigateTo('/admin/testimonials')
  }
  catch (error) {
    errorMessage.value = extractErrorMessage(error, 'Could not update testimonial.')
  }
  finally {
    submitting.value = false
  }
}

onMounted(loadTestimonial)
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium">
      Edit testimonial
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
      <TestimonialForm
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
      {{ errorMessage || 'Testimonial not found.' }}
    </p>
  </div>
</template>
