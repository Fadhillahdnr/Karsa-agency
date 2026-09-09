<script setup lang="ts">
import type { PortfolioCollectionRow } from '../../../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

type Row = PortfolioCollectionRow & { title: string }

const route = useRoute()
const discipline = computed(() => route.params.discipline as 'design' | 'photography' | 'videography')
const disciplineLabel = computed(() => discipline.value.charAt(0).toUpperCase() + discipline.value.slice(1))

const { authFetch } = useAdminAuth()
const toast = useToast()
const { confirm } = useConfirm()

const collections = ref<Row[]>([])
const loading = ref(true)
const errorMessage = ref('')

async function loadCollections() {
  loading.value = true
  errorMessage.value = ''
  try {
    collections.value = await authFetch<Row[]>(`/api/admin/portfolio?discipline=${discipline.value}`)
  }
  catch {
    errorMessage.value = 'Could not load portfolio collections.'
  }
  finally {
    loading.value = false
  }
}

async function deleteCollection(item: Row) {
  const ok = await confirm({
    title: `Delete "${item.title}"?`,
    description: item.status === 'published'
      ? 'This is published — consider archiving instead. Deleting removes it permanently.'
      : 'This permanently removes the collection and its media items.',
    confirmLabel: 'Delete',
    danger: true,
  })
  if (!ok) return

  try {
    await authFetch(`/api/admin/portfolio/${item.id}${item.status === 'published' ? '?force=true' : ''}`, { method: 'DELETE' })
    collections.value = collections.value.filter(c => c.id !== item.id)
    toast.success(`Deleted "${item.title}".`)
  }
  catch {
    toast.error('Could not delete collection.')
  }
}

watch(discipline, loadCollections)
onMounted(loadCollections)
</script>

<template>
  <div>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="font-display text-2xl font-medium">
          {{ disciplineLabel }} Portfolio
        </h1>
        <p class="mt-1 text-sm text-[var(--color-text-muted)]">
          Evidence shown on /{{ discipline }} — managed here, never hard-coded.
        </p>
      </div>
      <BaseButton
        :to="`/admin/portfolio/${discipline}/new`"
        variant="primary"
      >
        <AdminIcon
          name="plus"
          :size="16"
        /> New collection
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
      v-else-if="!collections.length"
      class="mt-6"
      icon="image"
      title="No collections yet"
      description="Upload real, permission-cleared work to populate this hub."
    >
      <template #action>
        <BaseButton
          :to="`/admin/portfolio/${discipline}/new`"
          variant="secondary"
        >
          New collection
        </BaseButton>
      </template>
    </EmptyState>

    <ul
      v-else
      class="mt-6 flex flex-col gap-2"
    >
      <li
        v-for="item in collections"
        :key="item.id"
        class="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
      >
        <NuxtLink
          :to="`/admin/portfolio/${discipline}/${item.id}`"
          class="min-w-0 flex-1"
        >
          <p class="truncate font-medium">
            {{ item.title }}
          </p>
          <p class="truncate text-xs text-[var(--color-text-muted)]">
            {{ item.category || '—' }} · /{{ discipline }}/{{ item.slug }}
          </p>
        </NuxtLink>
        <StatusBadge
          v-if="!item.permission_to_show"
          label="No permission"
          tone="warning"
        />
        <StatusBadge
          :label="item.status"
          :tone="item.status === 'published' ? 'accent' : item.status === 'archived' ? 'neutral' : 'warning'"
        />
        <button
          type="button"
          class="text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"
          aria-label="Delete collection"
          @click="deleteCollection(item)"
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
