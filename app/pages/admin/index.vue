<script setup lang="ts">
import type { LeadRow, ProjectRow } from '../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { authFetch } = useAdminAuth()

const projects = ref<ProjectRow[]>([])
const leads = ref<LeadRow[]>([])
const loading = ref(true)
const errorMessage = ref('')

async function loadOverview() {
  loading.value = true
  errorMessage.value = ''
  try {
    const [projectsResult, leadsResult] = await Promise.all([
      authFetch<ProjectRow[]>('/api/admin/projects'),
      authFetch<LeadRow[]>('/api/admin/leads'),
    ])
    projects.value = projectsResult
    leads.value = leadsResult
  }
  catch {
    errorMessage.value = 'Could not load dashboard data.'
  }
  finally {
    loading.value = false
  }
}

const publishedCount = computed(() => projects.value.filter(p => p.published).length)
const draftCount = computed(() => projects.value.filter(p => !p.published).length)
const newLeadsCount = computed(() => leads.value.filter(l => l.status === 'new').length)
const recentLeads = computed(() => leads.value.slice(0, 5))

onMounted(loadOverview)
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium">
      Dashboard
    </h1>
    <p class="mt-1 text-sm text-[var(--color-text-muted)]">
      Overview of work projects and incoming leads.
    </p>

    <p
      v-if="errorMessage"
      role="alert"
      class="mt-6 rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[var(--color-danger)]/10 p-4 text-sm"
    >
      {{ errorMessage }}
    </p>

    <div
      v-if="loading"
      class="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4"
    >
      <SkeletonBlock
        v-for="i in 4"
        :key="i"
        height="6.5rem"
        rounded="var(--radius-md)"
      />
    </div>

    <template v-else>
      <div class="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total projects"
          :value="projects.length"
          icon="projects"
          to="/admin/projects"
        />
        <StatCard
          label="Published"
          :value="publishedCount"
          icon="check"
        />
        <StatCard
          label="Drafts"
          :value="draftCount"
          icon="edit"
        />
        <StatCard
          label="New leads"
          :value="newLeadsCount"
          icon="leads"
          hint="Awaiting first contact"
          to="/admin/leads"
        />
      </div>

      <div class="mt-10 flex items-center justify-between">
        <h2 class="font-display text-lg font-medium">
          Recent leads
        </h2>
        <NuxtLink
          to="/admin/leads"
          class="text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-strong)]"
        >
          View all →
        </NuxtLink>
      </div>

      <EmptyState
        v-if="!recentLeads.length"
        class="mt-4"
        icon="leads"
        title="No leads yet"
        description="New project inquiries will appear here as they come in."
      />

      <ul
        v-else
        class="mt-4 flex flex-col gap-3"
      >
        <li
          v-for="lead in recentLeads"
          :key="lead.id"
        >
          <NuxtLink
            :to="`/admin/leads/${lead.id}`"
            class="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-accent)]/50"
          >
            <div class="min-w-0">
              <p class="truncate font-medium">
                {{ lead.name }}
              </p>
              <p class="truncate text-sm text-[var(--color-text-muted)]">
                {{ lead.service }} · {{ formatRelativeDate(lead.created_at) }}
              </p>
            </div>
            <StatusBadge
              :label="leadStatusLabel[lead.status as LeadStatus]"
              :tone="leadStatusTone[lead.status as LeadStatus]"
            />
          </NuxtLink>
        </li>
      </ul>

      <div class="mt-10 flex flex-wrap gap-3">
        <BaseButton
          to="/admin/projects/new"
          variant="primary"
        >
          New project
        </BaseButton>
        <BaseButton
          to="/admin/leads"
          variant="secondary"
        >
          Review leads
        </BaseButton>
      </div>
    </template>
  </div>
</template>
