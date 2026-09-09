<script setup lang="ts">
import type { ArticleFormValue } from '../../../components/admin/ArticleForm.vue'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { authFetch } = useAdminAuth()
const submitting = ref(false)
const errorMessage = ref('')

async function handleSubmit(value: ArticleFormValue) {
  submitting.value = true
  errorMessage.value = ''
  try {
    const { tagsText, ...rest } = value
    const created = await authFetch<{ id: string }>('/api/admin/articles', {
      method: 'POST',
      body: { ...rest, tags: tagsText.split(',').map(t => t.trim()).filter(Boolean) },
    })
    await navigateTo(`/admin/articles/${created.id}`)
  }
  catch (error) {
    errorMessage.value = extractErrorMessage(error, 'Could not create article.')
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium">
      New article
    </h1>
    <div class="mt-8 max-w-4xl">
      <ArticleForm
        :submitting="submitting"
        :error-message="errorMessage"
        submit-label="Create article"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>
