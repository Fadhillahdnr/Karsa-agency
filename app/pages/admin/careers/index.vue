<script setup lang="ts">
import type { CareerRow } from '../../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

type ListItem = CareerRow & { title: string }

const { authFetch } = useAdminAuth()
const toast = useToast()
const { confirm } = useConfirm()

const careers = ref<ListItem[]>([])
const loading = ref(true)
const errorMessage = ref('')

async function loadCareers() {
  loading.value = true
  errorMessage.value = ''
  try {
    careers.value = await authFetch<ListItem[]>('/api/admin/careers')
  }
  catch {
    errorMessage.value = 'Could not load career listings.'
  }
  finally {
    loading.value = false
  }
}

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
  <div>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="font-display text-2xl font-medium">
          Careers
        </h1>
        <p class="mt-1 text-sm text-[var(--color-text-muted)]">
          Shown on /careers, ordered by the number below.
        </p>
      </div>
      <BaseButton
        to="/admin/careers/new"
        variant="primary"
      >
        <AdminIcon
          name="plus"
          :size="16"
        /> New listing
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
        v-for="i in 4"
        :key="i"
        height="3.5rem"
        rounded="var(--radius-md)"
      />
    </div>

    <EmptyState
      v-else-if="!careers.length"
      class="mt-6"
      icon="building"
      title="No open roles yet"
      description="Add a listing when a role opens — /careers shows an honest empty state until then."
    >
      <template #action>
        <BaseButton
          to="/admin/careers/new"
          variant="secondary"
        >
          New listing
        </BaseButton>
      </template>
    </EmptyState>

    <ul
      v-else
      class="mt-6 flex flex-col gap-2"
    >
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
  </div>
</template>
