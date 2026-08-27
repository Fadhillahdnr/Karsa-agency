<script setup lang="ts">
import type { ProjectRow } from '../../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { authFetch } = useAdminAuth()
const toast = useToast()
const { confirm } = useConfirm()

const projects = ref<ProjectRow[]>([])
const loading = ref(true)
const errorMessage = ref('')
const deletingId = ref<string | null>(null)
const search = ref('')
const statusFilter = ref<'all' | 'published' | 'draft'>('all')

const filterTabs: { label: string, value: typeof statusFilter.value }[] = [
  { label: 'All', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
]

async function loadProjects() {
  loading.value = true
  errorMessage.value = ''
  try {
    projects.value = await authFetch<ProjectRow[]>('/api/admin/projects')
  }
  catch {
    errorMessage.value = 'Could not load projects.'
  }
  finally {
    loading.value = false
  }
}

const filteredProjects = computed(() => {
  return projects.value.filter((project) => {
    if (statusFilter.value === 'published' && !project.published) return false
    if (statusFilter.value === 'draft' && project.published) return false

    if (search.value.trim()) {
      const query = search.value.trim().toLowerCase()
      return (
        project.title.toLowerCase().includes(query)
        || project.category.toLowerCase().includes(query)
        || project.slug.toLowerCase().includes(query)
      )
    }

    return true
  })
})

async function togglePublished(project: ProjectRow) {
  const next = !project.published
  project.published = next
  try {
    await authFetch(`/api/admin/projects/${project.id}`, {
      method: 'PATCH',
      body: { published: next },
    })
    toast.success(next ? `"${project.title}" is now published.` : `"${project.title}" moved to drafts.`)
  }
  catch {
    project.published = !next
    toast.error('Could not update publish state.')
  }
}

async function deleteProject(project: ProjectRow) {
  const confirmed = await confirm({
    title: `Delete "${project.title}"?`,
    description: 'This removes the project permanently, including its cover image reference. This can\'t be undone.',
    confirmLabel: 'Delete',
    danger: true,
  })
  if (!confirmed) return

  deletingId.value = project.id
  try {
    await authFetch(`/api/admin/projects/${project.id}`, { method: 'DELETE' })
    projects.value = projects.value.filter(p => p.id !== project.id)
    toast.success(`"${project.title}" deleted.`)
  }
  catch {
    toast.error('Could not delete project.')
  }
  finally {
    deletingId.value = null
  }
}

onMounted(loadProjects)
</script>

<template>
  <div>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="font-display text-2xl font-medium">
          Projects
        </h1>
        <p class="mt-1 text-sm text-[var(--color-text-muted)]">
          Work shown on /work, managed without a redeploy.
        </p>
      </div>
      <BaseButton
        to="/admin/projects/new"
        variant="primary"
      >
        <AdminIcon
          name="plus"
          :size="16"
        />
        New project
      </BaseButton>
    </div>

    <div class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative w-full sm:max-w-xs">
        <AdminIcon
          name="search"
          :size="16"
          class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--color-text-muted)]"
        />
        <input
          v-model="search"
          type="search"
          placeholder="Search title, category, slug…"
          class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 pr-4 pl-9 text-sm focus-visible:border-[var(--color-accent)]"
        >
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="tab in filterTabs"
          :key="tab.value"
          type="button"
          class="min-h-[36px] rounded-full border px-3.5 text-xs font-medium transition-colors"
          :class="statusFilter === tab.value
            ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
            : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'"
          @click="statusFilter = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>
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
        height="4.5rem"
        rounded="var(--radius-md)"
      />
    </div>

    <EmptyState
      v-else-if="!projects.length"
      class="mt-6"
      icon="projects"
      title="No projects yet"
      description="Create your first project to see it here and on /work."
    >
      <template #action>
        <BaseButton
          to="/admin/projects/new"
          variant="primary"
        >
          Create project
        </BaseButton>
      </template>
    </EmptyState>

    <EmptyState
      v-else-if="!filteredProjects.length"
      class="mt-6"
      icon="search"
      title="No projects match your search"
      description="Try a different keyword or clear the filters."
    />

    <template v-else>
      <!-- Mobile: cards -->
      <ul class="mt-6 flex flex-col gap-3 lg:hidden">
        <li
          v-for="project in filteredProjects"
          :key="project.id"
          class="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="truncate font-medium">
                {{ project.title }}
              </p>
              <p class="truncate text-sm text-[var(--color-text-muted)]">
                {{ project.category }} · {{ project.year }}
              </p>
            </div>
            <button
              type="button"
              class="shrink-0 rounded-full border px-3 py-1 text-xs font-medium"
              :class="project.published
                ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                : 'border-[var(--color-border)] text-[var(--color-text-muted)]'"
              @click="togglePublished(project)"
            >
              {{ project.published ? 'Published' : 'Draft' }}
            </button>
          </div>
          <div class="mt-4 flex items-center gap-4 border-t border-[var(--color-border)] pt-3">
            <NuxtLink
              :to="`/admin/projects/${project.id}`"
              class="flex items-center gap-1.5 text-sm font-medium hover:text-[var(--color-accent)]"
            >
              <AdminIcon
                name="edit"
                :size="14"
              /> Edit
            </NuxtLink>
            <button
              type="button"
              class="flex items-center gap-1.5 text-sm font-medium text-[var(--color-danger)] disabled:opacity-50"
              :disabled="deletingId === project.id"
              @click="deleteProject(project)"
            >
              <AdminIcon
                name="trash"
                :size="14"
              /> Delete
            </button>
          </div>
        </li>
      </ul>

      <!-- Desktop: table -->
      <div class="mt-6 hidden overflow-x-auto lg:block">
        <table class="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr class="border-b border-[var(--color-border)] text-left text-[var(--color-text-muted)]">
              <th class="py-3 pr-4 font-medium">
                Title
              </th>
              <th class="py-3 pr-4 font-medium">
                Category
              </th>
              <th class="py-3 pr-4 font-medium">
                Year
              </th>
              <th class="py-3 pr-4 font-medium">
                Published
              </th>
              <th class="py-3 pr-4 font-medium" />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="project in filteredProjects"
              :key="project.id"
              class="border-b border-[var(--color-border)] last:border-0"
            >
              <td class="py-3 pr-4">
                {{ project.title }}
              </td>
              <td class="py-3 pr-4 text-[var(--color-text-muted)]">
                {{ project.category }}
              </td>
              <td class="py-3 pr-4 text-[var(--color-text-muted)]">
                {{ project.year }}
              </td>
              <td class="py-3 pr-4">
                <button
                  type="button"
                  class="rounded-full border px-3 py-1 text-xs font-medium"
                  :class="project.published
                    ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                    : 'border-[var(--color-border)] text-[var(--color-text-muted)]'"
                  @click="togglePublished(project)"
                >
                  {{ project.published ? 'Published' : 'Draft' }}
                </button>
              </td>
              <td class="py-3 pr-4 text-right">
                <div class="flex justify-end gap-3">
                  <NuxtLink
                    :to="`/admin/projects/${project.id}`"
                    class="text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-accent)]"
                  >
                    Edit
                  </NuxtLink>
                  <button
                    type="button"
                    class="text-sm font-medium text-[var(--color-danger)] disabled:opacity-50"
                    :disabled="deletingId === project.id"
                    @click="deleteProject(project)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>
