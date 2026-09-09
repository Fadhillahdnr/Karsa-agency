<script setup lang="ts">
import type { ArticleRow } from '../../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

type ListItem = ArticleRow & { title: string }

const { authFetch } = useAdminAuth()
const toast = useToast()
const { confirm } = useConfirm()

const articles = ref<ListItem[]>([])
const loading = ref(true)
const errorMessage = ref('')

async function loadArticles() {
  loading.value = true
  errorMessage.value = ''
  try {
    articles.value = await authFetch<ListItem[]>('/api/admin/articles')
  }
  catch {
    errorMessage.value = 'Could not load articles.'
  }
  finally {
    loading.value = false
  }
}

async function deleteArticle(item: ListItem) {
  const ok = await confirm({
    title: `Delete "${item.title}"?`,
    description: item.status === 'published'
      ? 'This is published — consider archiving instead. Deleting removes it permanently.'
      : 'This permanently removes the article.',
    confirmLabel: 'Delete',
    danger: true,
  })
  if (!ok) return

  try {
    await authFetch(`/api/admin/articles/${item.id}${item.status === 'published' ? '?force=true' : ''}`, { method: 'DELETE' })
    articles.value = articles.value.filter(a => a.id !== item.id)
    toast.success(`Deleted "${item.title}".`)
  }
  catch {
    toast.error('Could not delete article.')
  }
}

onMounted(loadArticles)
</script>

<template>
  <div>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="font-display text-2xl font-medium">
          Insights
        </h1>
        <p class="mt-1 text-sm text-[var(--color-text-muted)]">
          Editorial articles shown on /insights.
        </p>
      </div>
      <BaseButton
        to="/admin/articles/new"
        variant="primary"
      >
        <AdminIcon
          name="plus"
          :size="16"
        /> New article
      </BaseButton>
    </div>

    <p
      v-if="errorMessage"
      role="alert"
      class="mt-6 rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[var(--color-danger)]/10 p-4 text-sm"
    >
      {{ errorMessage }}
    </p>

    <div
      v-if="loading"
      class="mt-6 flex flex-col gap-3"
    >
      <SkeletonBlock
        v-for="i in 3"
        :key="i"
        height="3.5rem"
        rounded="var(--radius-md)"
      />
    </div>

    <EmptyState
      v-else-if="!articles.length"
      class="mt-6"
      icon="edit"
      title="No articles yet"
      description="Write real, useful articles — not filler. See the master prompt's suggested topics."
    >
      <template #action>
        <BaseButton
          to="/admin/articles/new"
          variant="secondary"
        >
          New article
        </BaseButton>
      </template>
    </EmptyState>

    <ul
      v-else
      class="mt-6 flex flex-col gap-2"
    >
      <li
        v-for="item in articles"
        :key="item.id"
        class="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
      >
        <NuxtLink
          :to="`/admin/articles/${item.id}`"
          class="min-w-0 flex-1"
        >
          <p class="truncate font-medium">
            {{ item.title }}
          </p>
          <p class="truncate text-xs text-[var(--color-text-muted)]">
            {{ item.category || '—' }}<span v-if="item.reading_time"> · {{ item.reading_time }} min read</span>
          </p>
        </NuxtLink>
        <StatusBadge
          :label="item.status"
          :tone="item.status === 'published' ? 'accent' : item.status === 'archived' ? 'neutral' : 'warning'"
        />
        <button
          type="button"
          class="text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"
          aria-label="Delete article"
          @click="deleteArticle(item)"
        >
          <AdminIcon
            name="trash"
            :size="16"
          />
        </button>
      </li>
    </ul>
  </div>
</template>
