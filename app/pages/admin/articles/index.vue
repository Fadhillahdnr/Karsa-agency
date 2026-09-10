<script setup lang="ts">
import type { ArticleRow } from '../../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

type ListItem = ArticleRow & { title: string }

const { authFetch } = useAdminAuth()
const toast = useToast()
const { confirm } = useConfirm()

const { items: articles, loading, error: errorMessage, load: loadArticles } = useAdminList<ListItem>(
  () => authFetch<ListItem[]>('/api/admin/articles'),
  'Could not load articles.',
)

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
  <AdminListPage
    title="Insights"
    description="Editorial articles shown on /insights."
    new-to="/admin/articles/new"
    new-label="New article"
    :loading="loading"
    :error="errorMessage"
    :empty="!articles.length"
    empty-icon="edit"
    empty-title="No articles yet"
    empty-description="Write real, useful articles — not filler. See the master prompt's suggested topics."
    :skeleton-count="3"
  >
    <ul class="mt-6 flex flex-col gap-2">
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
  </AdminListPage>
</template>
