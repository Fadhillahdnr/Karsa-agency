<script setup lang="ts">
import type { CompanyUpdateRow } from '../../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

type ListItem = CompanyUpdateRow & { title: string }

const { authFetch } = useAdminAuth()
const toast = useToast()
const { confirm } = useConfirm()

const { items: updates, loading, error: errorMessage, load: loadUpdates } = useAdminList<ListItem>(
  () => authFetch<ListItem[]>('/api/admin/updates'),
  'Could not load updates.',
)

async function deleteUpdate(item: ListItem) {
  const ok = await confirm({
    title: `Delete "${item.title}"?`,
    description: item.status === 'published'
      ? 'This is published — consider archiving instead. Deleting removes it permanently.'
      : 'This permanently removes the update.',
    confirmLabel: 'Delete',
    danger: true,
  })
  if (!ok) return

  try {
    await authFetch(`/api/admin/updates/${item.id}${item.status === 'published' ? '?force=true' : ''}`, { method: 'DELETE' })
    updates.value = updates.value.filter(u => u.id !== item.id)
    toast.success(`Deleted "${item.title}".`)
  }
  catch {
    toast.error('Could not delete update.')
  }
}

onMounted(loadUpdates)
</script>

<template>
  <AdminListPage
    title="Updates"
    description="Project launches, agency news, and milestones shown on /updates."
    new-to="/admin/updates/new"
    new-label="New update"
    :loading="loading"
    :error="errorMessage"
    :empty="!updates.length"
    empty-icon="edit"
    empty-title="No updates yet"
    empty-description="Share a real project launch, collaboration, or milestone."
    :skeleton-count="3"
  >
    <ul class="mt-6 flex flex-col gap-2">
      <li
        v-for="item in updates"
        :key="item.id"
        class="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
      >
        <NuxtLink
          :to="`/admin/updates/${item.id}`"
          class="min-w-0 flex-1 truncate font-medium"
        >
          {{ item.title }}
        </NuxtLink>
        <StatusBadge
          :label="item.status"
          :tone="item.status === 'published' ? 'accent' : item.status === 'archived' ? 'neutral' : 'warning'"
        />
        <button
          type="button"
          class="text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"
          aria-label="Delete update"
          @click="deleteUpdate(item)"
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
