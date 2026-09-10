<script setup lang="ts">
import type { CareerRow } from '../../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

type ListItem = CareerRow & { title: string }

const { authFetch } = useAdminAuth()
const toast = useToast()
const { confirm } = useConfirm()

const { items: careers, loading, error: errorMessage, load: loadCareers } = useAdminList<ListItem>(
  () => authFetch<ListItem[]>('/api/admin/careers'),
  'Could not load career listings.',
)

async function deleteCareer(item: ListItem) {
  const ok = await confirm({
    title: 'Delete this listing?',
    description: 'This permanently removes the career listing.',
    confirmLabel: 'Delete',
    danger: true,
  })
  if (!ok) return

  try {
    await authFetch(`/api/admin/careers/${item.id}`, { method: 'DELETE' })
    careers.value = careers.value.filter(c => c.id !== item.id)
    toast.success('Career listing deleted.')
  }
  catch {
    toast.error('Could not delete this listing. Published listings need ?force to delete — archive it first instead.')
  }
}

onMounted(loadCareers)
</script>

<template>
  <AdminListPage
    title="Careers"
    description="Shown on /careers, ordered by the number below."
    new-to="/admin/careers/new"
    new-label="New listing"
    :loading="loading"
    :error="errorMessage"
    :empty="!careers.length"
    empty-icon="building"
    empty-title="No open roles yet"
    empty-description="Add a listing when a role opens — /careers shows an honest empty state until then."
    :skeleton-count="4"
  >
    <ul class="mt-6 flex flex-col gap-2">
      <li
        v-for="item in careers"
        :key="item.id"
        class="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
      >
        <NuxtLink
          :to="`/admin/careers/${item.id}`"
          class="min-w-0 flex-1"
        >
          <p class="truncate font-medium">
            {{ item.title }}
          </p>
          <p class="truncate text-xs text-[var(--color-text-muted)]">
            {{ [item.department, item.location, item.work_mode].filter(Boolean).join(' · ') || item.slug }}
          </p>
        </NuxtLink>
        <StatusBadge
          :label="item.status"
          :tone="item.status === 'published' ? 'accent' : item.status === 'archived' ? 'neutral' : 'warning'"
        />
        <button
          type="button"
          class="text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"
          aria-label="Delete listing"
          @click="deleteCareer(item)"
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
