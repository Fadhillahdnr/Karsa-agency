<script setup lang="ts">
import type { ServiceRow } from '../../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

type ServiceListItem = ServiceRow & { title: string }

const { authFetch } = useAdminAuth()
const toast = useToast()
const { confirm } = useConfirm()

const services = ref<ServiceListItem[]>([])
const loading = ref(true)
const errorMessage = ref('')
const categoryFilter = ref<'all' | ServiceRow['category']>('all')

const categoryTabs: { label: string, value: 'all' | ServiceRow['category'] }[] = [
  { label: 'All', value: 'all' },
  { label: 'Web', value: 'web' },
  { label: 'Design', value: 'design' },
  { label: 'Photo', value: 'photo' },
  { label: 'Film', value: 'film' },
  { label: 'Integrated', value: 'integrated' },
]

const filtered = computed(() =>
  categoryFilter.value === 'all' ? services.value : services.value.filter(s => s.category === categoryFilter.value),
)

async function loadServices() {
  loading.value = true
  errorMessage.value = ''
  try {
    services.value = await authFetch<ServiceListItem[]>('/api/admin/services')
  }
  catch {
    errorMessage.value = 'Could not load services.'
  }
  finally {
    loading.value = false
  }
}

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
  <div>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="font-display text-2xl font-medium">
          Services
        </h1>
        <p class="mt-1 text-sm text-[var(--color-text-muted)]">
          Website, design, photography, and film offerings shown on /services.
        </p>
      </div>
      <BaseButton
        to="/admin/services/new"
        variant="primary"
      >
        <AdminIcon
          name="plus"
          :size="16"
        /> New service
      </BaseButton>
    </div>

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
        v-for="i in 4"
        :key="i"
        height="3.5rem"
        rounded="var(--radius-md)"
      />
    </div>

    <EmptyState
      v-else-if="!filtered.length"
      class="mt-6"
      icon="projects"
      title="No services yet"
      description="Create the first service to publish it on /services."
    >
      <template #action>
        <BaseButton
          to="/admin/services/new"
          variant="secondary"
        >
          New service
        </BaseButton>
      </template>
    </EmptyState>

    <ul
      v-else
      class="mt-6 flex flex-col gap-2"
    >
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
  </div>
</template>
