<script setup lang="ts">
import type { ServiceRow } from '../../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

type ServiceListItem = ServiceRow & { title: string }

const { authFetch } = useAdminAuth()
const toast = useToast()
const { confirm } = useConfirm()
const categoryFilter = ref<'all' | ServiceRow['category']>('all')

const categoryTabs: { label: string, value: 'all' | ServiceRow['category'] }[] = [
  { label: 'All', value: 'all' },
  { label: 'Web', value: 'web' },
  { label: 'Design', value: 'design' },
  { label: 'Photo', value: 'photo' },
  { label: 'Film', value: 'film' },
  { label: 'Integrated', value: 'integrated' },
]

const { items: services, loading, error: errorMessage, load: loadServices } = useAdminList<ServiceListItem>(
  () => authFetch<ServiceListItem[]>('/api/admin/services'),
  'Could not load services.',
)

const filtered = computed(() =>
  categoryFilter.value === 'all' ? services.value : services.value.filter(s => s.category === categoryFilter.value),
)

async function deleteService(service: ServiceListItem) {
  const ok = await confirm({
    title: `Delete "${service.title}"?`,
    description: service.status === 'published'
      ? 'This service is published — consider archiving it instead so the URL can redirect. Deleting removes it permanently.'
      : 'This permanently removes the service and its translations.',
    confirmLabel: 'Delete',
    danger: true,
  })
  if (!ok) return

  try {
    await authFetch(`/api/admin/services/${service.id}${service.status === 'published' ? '?force=true' : ''}`, { method: 'DELETE' })
    services.value = services.value.filter(s => s.id !== service.id)
    toast.success(`Deleted "${service.title}".`)
  }
  catch {
    toast.error('Could not delete service.')
  }
}

onMounted(loadServices)
</script>

<template>
  <AdminListPage
    title="Services"
    description="Website, design, photography, and film offerings shown on /services."
    new-to="/admin/services/new"
    new-label="New service"
    :loading="loading"
    :error="errorMessage"
    :empty="!filtered.length"
    empty-icon="projects"
    empty-title="No services yet"
    empty-description="Create the first service to publish it on /services."
    :skeleton-count="4"
  >
    <template #filters>
      <div class="mt-6 flex flex-wrap gap-2">
        <button
          v-for="tab in categoryTabs"
          :key="tab.value"
          type="button"
          class="min-h-[36px] rounded-full border px-3.5 text-xs font-medium uppercase transition-colors"
          :class="categoryFilter === tab.value
            ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
            : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'"
          @click="categoryFilter = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>
    </template>

    <ul class="mt-6 flex flex-col gap-2">
      <li
        v-for="service in filtered"
        :key="service.id"
        class="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
      >
        <NuxtLink
          :to="`/admin/services/${service.id}`"
          class="min-w-0 flex-1"
        >
          <p class="truncate font-medium">
            {{ service.title }}
          </p>
          <p class="truncate text-xs text-[var(--color-text-muted)] uppercase">
            {{ service.category }} · /services/{{ service.slug }}
          </p>
        </NuxtLink>
        <StatusBadge
          :label="service.status"
          :tone="service.status === 'published' ? 'accent' : service.status === 'archived' ? 'neutral' : 'warning'"
        />
        <button
          type="button"
          class="text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"
          aria-label="Delete service"
          @click="deleteService(service)"
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
