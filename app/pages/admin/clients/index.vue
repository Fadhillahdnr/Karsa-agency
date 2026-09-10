<script setup lang="ts">
import type { ClientRow } from '../../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { authFetch } = useAdminAuth()
const toast = useToast()
const { confirm } = useConfirm()

const { items: clients, loading, error: errorMessage, load: loadClients } = useAdminList<ClientRow>(
  () => authFetch<ClientRow[]>('/api/admin/clients'),
  'Could not load clients.',
)

async function deleteClient(client: ClientRow) {
  const ok = await confirm({
    title: `Delete "${client.name}"?`,
    description: 'This permanently removes the client record.',
    confirmLabel: 'Delete',
    danger: true,
  })
  if (!ok) return

  try {
    await authFetch(`/api/admin/clients/${client.id}`, { method: 'DELETE' })
    clients.value = clients.value.filter(c => c.id !== client.id)
    toast.success(`Deleted "${client.name}".`)
  }
  catch {
    toast.error('Could not delete client.')
  }
}

onMounted(loadClients)
</script>

<template>
  <AdminListPage
    title="Clients"
    description="Only shown publicly when permission_to_show is granted."
    new-to="/admin/clients/new"
    new-label="New client"
    :loading="loading"
    :error="errorMessage"
    :empty="!clients.length"
    empty-icon="building"
    empty-title="No clients yet"
    empty-description="Add clients you have explicit permission to name publicly."
    :skeleton-count="3"
  >
    <ul class="mt-6 flex flex-col gap-2">
      <li
        v-for="client in clients"
        :key="client.id"
        class="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
      >
        <NuxtLink
          :to="`/admin/clients/${client.id}`"
          class="min-w-0 flex-1"
        >
          <p class="truncate font-medium">
            {{ client.name }}
          </p>
          <p class="truncate text-xs text-[var(--color-text-muted)]">
            {{ client.industry || '—' }}
          </p>
        </NuxtLink>
        <StatusBadge
          v-if="!client.permission_to_show"
          label="No permission"
          tone="warning"
        />
        <StatusBadge
          :label="client.status"
          :tone="client.status === 'published' ? 'accent' : 'neutral'"
        />
        <button
          type="button"
          class="text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"
          aria-label="Delete client"
          @click="deleteClient(client)"
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
