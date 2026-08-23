<script setup lang="ts">
import type { ProjectRow } from '../../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { authFetch } = useAdminAuth()

const projects = ref<ProjectRow[]>([])
const loading = ref(true)
const errorMessage = ref('')
const deletingId = ref<string | null>(null)

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

async function togglePublished(project: ProjectRow) {
  const next = !project.published
  project.published = next
  try {
    await authFetch(`/api/admin/projects/${project.id}`, {
      method: 'PATCH',
      body: { published: next },
    })
  }
  catch {
    project.published = !next
    errorMessage.value = 'Could not update publish state.'
  }
}

async function deleteProject(project: ProjectRow) {
  if (!confirm(`Delete "${project.title}"? This can't be undone.`)) return

  deletingId.value = project.id
  try {
    await authFetch(`/api/admin/projects/${project.id}`, { method: 'DELETE' })
    projects.value = projects.value.filter(p => p.id !== project.id)
  }
  catch {
    errorMessage.value = 'Could not delete project.'
  }
  finally {
    deletingId.value = null
  }
}

onMounted(loadProjects)
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="font-display text-2xl font-medium">
        Projects
      </h1>
      <BaseButton
        to="/admin/projects/new"
        variant="primary"
      >
        New project
      </BaseButton>
    </div>

    <p
      v-if="errorMessage"
      role="alert"
      class="mt-6 rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[var(--color-danger)]/10 p-4 text-sm"
    >
      {{ errorMessage }}
    </p>

    <p
      v-if="loading"
      class="mt-8 text-sm text-[var(--color-text-muted)]"
    >
      Loading…
    </p>

    <div
      v-else-if="!projects.length"
      class="mt-8 text-sm text-[var(--color-text-muted)]"
    >
      No projects yet. Create your first one.
    </div>

    <div
      v-else
      class="mt-8 overflow-x-auto"
    >
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
            v-for="project in projects"
            :key="project.id"
            class="border-b border-[var(--color-border)]"
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
  </div>
</template>
