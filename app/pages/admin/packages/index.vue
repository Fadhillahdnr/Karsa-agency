<script setup lang="ts">
import type { PackageRow } from '../../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

type PackageListItem = PackageRow & { title: string }

const { authFetch } = useAdminAuth()
const toast = useToast()
const { confirm } = useConfirm()

const { items: packages, loading, error: errorMessage, load: loadPackages } = useAdminList<PackageListItem>(
  () => authFetch<PackageListItem[]>('/api/admin/packages'),
  'Could not load packages.',
)

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
  <AdminListPage
    title="Packages"
    description="Pricing tiers shown on /packages. Only real, owner-approved pricing."
    new-to="/admin/packages/new"
    new-label="New package"
    :loading="loading"
    :error="errorMessage"
    :empty="!packages.length"
    empty-icon="projects"
    empty-title="No packages yet"
    empty-description="Create a package once real, owner-approved pricing is ready — never publish placeholder prices."
    :skeleton-count="3"
  >
    <ul class="mt-6 flex flex-col gap-2">
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
  </AdminListPage>
</template>
