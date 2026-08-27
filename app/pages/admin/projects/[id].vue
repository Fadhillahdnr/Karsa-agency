<script setup lang="ts">
import type { ProjectRow } from '../../../../server/utils/supabase'
import type { ProjectFormValue } from '../../../components/admin/ProjectForm.vue'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const route = useRoute()
const id = route.params.id as string

const { authFetch } = useAdminAuth()

const project = ref<ProjectRow | null>(null)
const loading = ref(true)
const submitting = ref(false)
const errorMessage = ref('')

const initialFormValue = computed<ProjectFormValue | undefined>(() => {
  if (!project.value) return undefined
  return {
    slug: project.value.slug,
    title: project.value.title,
    year: project.value.year,
    type: project.value.type,
    category: project.value.category,
    servicesText: project.value.services.join(', '),
    description: project.value.description,
    cover: project.value.cover,
    featured: project.value.featured,
    challenge: project.value.challenge ?? '',
    approach: project.value.approach ?? '',
    outcome: project.value.outcome ?? '',
    order: project.value.order_index,
    published: project.value.published,
  }
})

async function loadProject() {
  loading.value = true
  try {
    project.value = await authFetch<ProjectRow>(`/api/admin/projects/${id}`)
  }
  catch {
    errorMessage.value = 'Could not load this project.'
  }
  finally {
    loading.value = false
  }
}

async function handleSubmit(value: ProjectFormValue) {
  submitting.value = true
  errorMessage.value = ''

  try {
    await authFetch(`/api/admin/projects/${id}`, {
      method: 'PATCH',
      body: {
        slug: value.slug,
        title: value.title,
        year: value.year,
        type: value.type,
        category: value.category,
        services: value.servicesText.split(',').map(s => s.trim()).filter(Boolean),
        description: value.description,
        cover: value.cover,
        featured: value.featured,
        challenge: value.challenge,
        approach: value.approach,
        outcome: value.outcome,
        order: value.order,
        published: value.published,
      },
    })
    await navigateTo('/admin/projects')
  }
  catch (error) {
    errorMessage.value = extractErrorMessage(error, 'Could not update project.')
  }
  finally {
    submitting.value = false
  }
}

onMounted(loadProject)
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium">
      Edit project
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
      <ProjectForm
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
      {{ errorMessage || 'Project not found.' }}
    </p>
  </div>
</template>
