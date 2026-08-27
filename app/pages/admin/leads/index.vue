<script setup lang="ts">
import type { LeadRow } from '../../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { authFetch } = useAdminAuth()
const toast = useToast()

const leads = ref<LeadRow[]>([])
const loading = ref(true)
const errorMessage = ref('')
const search = ref('')
const statusFilter = ref<'all' | LeadStatus>('all')

let searchDebounce: ReturnType<typeof setTimeout> | null = null

const filterTabs: { label: string, value: 'all' | LeadStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Won', value: 'won' },
  { label: 'Archived', value: 'archived' },
]

async function loadLeads() {
  loading.value = true
  errorMessage.value = ''
  try {
    const query = new URLSearchParams()
    if (statusFilter.value !== 'all') query.set('status', statusFilter.value)
    if (search.value.trim()) query.set('search', search.value.trim())

    leads.value = await authFetch<LeadRow[]>(`/api/admin/leads?${query.toString()}`)
  }
  catch {
    errorMessage.value = 'Could not load leads.'
  }
  finally {
    loading.value = false
  }
}

watch(statusFilter, loadLeads)

watch(search, () => {
  if (searchDebounce) clearTimeout(searchDebounce)
  searchDebounce = setTimeout(loadLeads, 350)
})

async function setStatus(lead: LeadRow, status: LeadStatus) {
  const previous = lead.status
  lead.status = status
  try {
    await authFetch(`/api/admin/leads/${lead.id}`, { method: 'PATCH', body: { status } })
    toast.success(`Marked "${lead.name}" as ${leadStatusLabel[status]}.`)
  }
  catch {
    lead.status = previous
    toast.error('Could not update lead status.')
  }
}

onMounted(loadLeads)
</script>

<template>
  <div>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="font-display text-2xl font-medium">
          Leads
        </h1>
        <p class="mt-1 text-sm text-[var(--color-text-muted)]">
          Project inquiries submitted through the website.
        </p>
      </div>
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
          placeholder="Search name, email, company…"
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
      v-else-if="!leads.length"
      class="mt-6"
      icon="leads"
      title="No leads found"
      description="Inquiries submitted from the Start a Project form will show up here."
    />

    <template v-else>
      <!-- Mobile: cards -->
      <ul class="mt-6 flex flex-col gap-3 lg:hidden">
        <li
          v-for="lead in leads"
          :key="lead.id"
          class="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
        >
          <NuxtLink
            :to="`/admin/leads/${lead.id}`"
            class="flex items-start justify-between gap-3"
          >
            <div class="min-w-0">
              <p class="truncate font-medium">
                {{ lead.name }}
              </p>
              <p class="truncate text-sm text-[var(--color-text-muted)]">
                {{ lead.company || lead.email }}
              </p>
            </div>
            <StatusBadge
              :label="leadStatusLabel[lead.status as LeadStatus]"
              :tone="leadStatusTone[lead.status as LeadStatus]"
            />
          </NuxtLink>
          <div class="mt-3 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
            <span>{{ lead.service }}</span>
            <span>{{ formatRelativeDate(lead.created_at) }}</span>
          </div>
        </li>
      </ul>

      <!-- Desktop: table -->
      <div class="mt-6 hidden overflow-x-auto lg:block">
        <table class="w-full min-w-[820px] border-collapse text-sm">
          <thead>
            <tr class="border-b border-[var(--color-border)] text-left text-[var(--color-text-muted)]">
              <th class="py-3 pr-4 font-medium">
                Name
              </th>
              <th class="py-3 pr-4 font-medium">
                Service
              </th>
              <th class="py-3 pr-4 font-medium">
                Budget
              </th>
              <th class="py-3 pr-4 font-medium">
                Submitted
              </th>
              <th class="py-3 pr-4 font-medium">
                Status
              </th>
              <th class="py-3 pr-4 font-medium" />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="lead in leads"
              :key="lead.id"
              class="border-b border-[var(--color-border)] last:border-0"
            >
              <td class="py-3 pr-4">
                <NuxtLink
                  :to="`/admin/leads/${lead.id}`"
                  class="font-medium hover:text-[var(--color-accent)]"
                >
                  {{ lead.name }}
                </NuxtLink>
                <p class="text-xs text-[var(--color-text-muted)]">
                  {{ lead.company || lead.email }}
                </p>
              </td>
              <td class="py-3 pr-4 text-[var(--color-text-muted)]">
                {{ lead.service }}
              </td>
              <td class="py-3 pr-4 text-[var(--color-text-muted)]">
                {{ lead.budget_range || '—' }}
              </td>
              <td class="py-3 pr-4 text-[var(--color-text-muted)]">
                {{ formatRelativeDate(lead.created_at) }}
              </td>
              <td class="py-3 pr-4">
                <select
                  class="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-xs font-medium"
                  :value="lead.status"
                  @change="setStatus(lead, ($event.target as HTMLSelectElement).value as LeadStatus)"
                >
                  <option
                    v-for="status in leadStatuses"
                    :key="status"
                    :value="status"
                  >
                    {{ leadStatusLabel[status] }}
                  </option>
                </select>
              </td>
              <td class="py-3 pr-4 text-right">
                <NuxtLink
                  :to="`/admin/leads/${lead.id}`"
                  class="text-sm font-medium hover:text-[var(--color-accent)]"
                >
                  View
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>
