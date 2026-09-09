<script setup lang="ts">
import type { PackageRow } from '../../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

type PackageListItem = PackageRow & { title: string }

const { authFetch } = useAdminAuth()
const toast = useToast()
const { confirm } = useConfirm()

const packages = ref<PackageListItem[]>([])
const loading = ref(true)
const errorMessage = ref('')

async function loadPackages() {
  loading.value = true
  errorMessage.value = ''
  try {
    packages.value = await authFetch<PackageListItem[]>('/api/admin/packages')
  }
  catch {
    errorMessage.value = 'Could not load packages.'
  }
  finally {
    loading.value = false
  }
}

async function deletePackage(pkg: PackageListItem) {
  const ok = await confirm({
    title: `Delete "${pkg.title}"?`,
    description: pkg.status === 'published'
      ? 'This package is published — consider archiving it instead. Deleting removes it permanently.'
      : 'This permanently removes the package.',
    confirmLabel: 'Delete',
    danger: true,
  })
  if (!ok) return

  try {
    await authFetch(`/api/admin/packages/${pkg.id}${pkg.status === 'published' ? '?force=true' : ''}`, { method: 'DELETE' })
    packages.value = packages.value.filter(p => p.id !== pkg.id)
    toast.success(`Deleted "${pkg.title}".`)
  }
  catch {
    toast.error('Could not delete package.')
  }
}

onMounted(loadPackages)
</script>

<template>
  <div>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="font-display text-2xl font-medium">
          Packages
        </h1>
        <p class="mt-1 text-sm text-[var(--color-text-muted)]">
          Pricing tiers shown on /packages. Only real, owner-approved pricing.
        </p>
      </div>
      <BaseButton
        to="/admin/packages/new"
        variant="primary"
      >
        <AdminIcon
          name="plus"
          :size="16"
        /> New package
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
      v-else-if="!packages.length"
      class="mt-6"
      icon="projects"
      title="No packages yet"
      description="Create a package once real, owner-approved pricing is ready — never publish placeholder prices."
    >
      <template #action>
        <BaseButton
          to="/admin/packages/new"
          variant="secondary"
        >
          New package
        </BaseButton>
      </template>
    </EmptyState>

    <ul
      v-else
      class="mt-6 flex flex-col gap-2"
    >
      <li
        v-for="pkg in packages"
        :key="pkg.id"
        class="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
      >
        <NuxtLink
          :to="`/admin/packages/${pkg.id}`"
          class="min-w-0 flex-1"
        >
          <p class="truncate font-medium">
            {{ pkg.title }}
          </p>
          <p class="truncate text-xs text-[var(--color-text-muted)] uppercase">
            {{ pkg.category }} · /packages/{{ pkg.slug }}
          </p>
        </NuxtLink>
        <StatusBadge
          :label="pkg.status"
          :tone="pkg.status === 'published' ? 'accent' : pkg.status === 'archived' ? 'neutral' : 'warning'"
        />
        <button
          type="button"
          class="text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"
          aria-label="Delete package"
          @click="deletePackage(pkg)"
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
