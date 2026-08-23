<script setup lang="ts">
import type { ProjectFormValue } from '../../../components/admin/ProjectForm.vue'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { authFetch } = useAdminAuth()
const submitting = ref(false)
const errorMessage = ref('')

async function handleSubmit(value: ProjectFormValue) {
  submitting.value = true
  errorMessage.value = ''

  try {
    await authFetch('/api/admin/projects', {
      method: 'POST',
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
    const data = (error as { data?: { statusMessage?: string } })?.data
    errorMessage.value = data?.statusMessage || 'Could not create project.'
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium">
      New project
    </h1>
    <div class="mt-8 max-w-3xl">
      <ProjectForm
        :submitting="submitting"
        :error-message="errorMessage"
        submit-label="Create project"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>
