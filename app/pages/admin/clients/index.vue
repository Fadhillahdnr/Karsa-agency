<script setup lang="ts">
import type { ClientRow } from '../../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { authFetch } = useAdminAuth()
const toast = useToast()
const { confirm } = useConfirm()

const clients = ref<ClientRow[]>([])
const loading = ref(true)
const errorMessage = ref('')

async function loadClients() {
  loading.value = true
  errorMessage.value = ''
  try {
    clients.value = await authFetch<ClientRow[]>('/api/admin/clients')
  }
  catch {
    errorMessage.value = 'Could not load clients.'
  }
  finally {
    loading.value = false
  }
}

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
  <div>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="font-display text-2xl font-medium">
          Clients
        </h1>
        <p class="mt-1 text-sm text-[var(--color-text-muted)]">
          Only shown publicly when permission_to_show is granted.
        </p>
      </div>
      <BaseButton
        to="/admin/clients/new"
        variant="primary"
      >
        <AdminIcon
          name="plus"
          :size="16"
        /> New client
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
      v-else-if="!clients.length"
      class="mt-6"
      icon="building"
      title="No clients yet"
      description="Add clients you have explicit permission to name publicly."
    >
      <template #action>
        <BaseButton
          to="/admin/clients/new"
          variant="secondary"
        >
          New client
        </BaseButton>
      </template>
    </EmptyState>

    <ul
      v-else
      class="mt-6 flex flex-col gap-2"
    >
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
  </div>
</template>
