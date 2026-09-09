<script setup lang="ts">
import type { ArticleFormValue } from '../../../components/admin/ArticleForm.vue'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const route = useRoute()
const id = route.params.id as string
const { authFetch } = useAdminAuth()

const initialFormValue = ref<ArticleFormValue | undefined>(undefined)
const loading = ref(true)
const submitting = ref(false)
const errorMessage = ref('')

async function loadArticle() {
  loading.value = true
  try {
    const data = await authFetch<Record<string, unknown>>(`/api/admin/articles/${id}`)
    initialFormValue.value = {
      slug: data.slug as string,
      author: (data.author as string | null) ?? '',
      category: data.category as ArticleFormValue['category'],
      tagsText: (data.tags as string[]).join(', '),
      featured: data.featured as boolean,
      status: data.status as ArticleFormValue['status'],
      translations: data.translations as ArticleFormValue['translations'],
    }
  }
  catch {
    errorMessage.value = 'Could not load this article.'
  }
  finally {
    loading.value = false
  }
}

async function handleSubmit(value: ArticleFormValue) {
  submitting.value = true
  errorMessage.value = ''
  try {
    const { tagsText, ...rest } = value
    await authFetch(`/api/admin/articles/${id}`, {
      method: 'PATCH',
      body: { ...rest, tags: tagsText.split(',').map(t => t.trim()).filter(Boolean) },
    })
    await navigateTo('/admin/articles')
  }
  catch (error) {
    errorMessage.value = extractErrorMessage(error, 'Could not update article.')
  }
  finally {
    submitting.value = false
  }
}

onMounted(loadArticle)
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium">
      Edit article
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
      <ArticleForm
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
      {{ errorMessage || 'Article not found.' }}
    </p>
  </div>
</template>
