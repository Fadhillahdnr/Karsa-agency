<script setup lang="ts">
import type { CompanyUpdateRow } from '../../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

type ListItem = CompanyUpdateRow & { title: string }

const { authFetch } = useAdminAuth()
const toast = useToast()
const { confirm } = useConfirm()

const updates = ref<ListItem[]>([])
const loading = ref(true)
const errorMessage = ref('')

async function loadUpdates() {
  loading.value = true
  errorMessage.value = ''
  try {
    updates.value = await authFetch<ListItem[]>('/api/admin/updates')
  }
  catch {
    errorMessage.value = 'Could not load updates.'
  }
  finally {
    loading.value = false
  }
}

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
  <div>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="font-display text-2xl font-medium">
          Updates
        </h1>
        <p class="mt-1 text-sm text-[var(--color-text-muted)]">
          Project launches, agency news, and milestones shown on /updates.
        </p>
      </div>
      <BaseButton
        to="/admin/updates/new"
        variant="primary"
      >
        <AdminIcon
          name="plus"
          :size="16"
        /> New update
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
      v-else-if="!updates.length"
      class="mt-6"
      icon="edit"
      title="No updates yet"
      description="Share a real project launch, collaboration, or milestone."
    >
      <template #action>
        <BaseButton
          to="/admin/updates/new"
          variant="secondary"
        >
          New update
        </BaseButton>
      </template>
    </EmptyState>

    <ul
      v-else
      class="mt-6 flex flex-col gap-2"
    >
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
  </div>
</template>
