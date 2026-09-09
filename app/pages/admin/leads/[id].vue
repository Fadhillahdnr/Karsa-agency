<script setup lang="ts">
import type { LeadRow } from '../../../../server/utils/supabase'
import type { LeadTimelineEntry } from '../../../../server/api/admin/leads/[id]/timeline.get'
import type { PackageApiItem } from '../../../../server/api/packages/index.get'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

type Assignee = { user_id: string, display_name: string, role: string }

const route = useRoute()
const id = route.params.id as string

const { authFetch } = useAdminAuth()
const toast = useToast()

const lead = ref<LeadRow | null>(null)
const timeline = ref<LeadTimelineEntry[]>([])
const assignees = ref<Assignee[]>([])
const packages = ref<PackageApiItem[]>([])
const loading = ref(true)
const errorMessage = ref('')
const updatingStatus = ref(false)
const savingCrmField = ref(false)
const noteText = ref('')
const savingNote = ref(false)

async function loadAll() {
  loading.value = true
  errorMessage.value = ''
  try {
    const [leadData, timelineData, assigneesData, packagesData] = await Promise.all([
      authFetch<LeadRow>(`/api/admin/leads/${id}`),
      authFetch<LeadTimelineEntry[]>(`/api/admin/leads/${id}/timeline`),
      authFetch<Assignee[]>('/api/admin/leads/assignees'),
      $fetch<PackageApiItem[]>('/api/packages', { query: { locale: 'en' } }).catch(() => []),
    ])
    lead.value = leadData
    timeline.value = timelineData
    assignees.value = assigneesData
    packages.value = packagesData
  }
  catch {
    errorMessage.value = 'Could not load this lead.'
  }
  finally {
    loading.value = false
  }
}

async function reloadTimeline() {
  timeline.value = await authFetch<LeadTimelineEntry[]>(`/api/admin/leads/${id}/timeline`)
}

async function setStatus(status: LeadStatus) {
  if (!lead.value || lead.value.status === status) return
  const previous = lead.value.status
  updatingStatus.value = true
  lead.value.status = status
  try {
    await authFetch(`/api/admin/leads/${id}`, { method: 'PATCH', body: { status } })
    toast.success(`Status updated to ${leadStatusLabel[status]}.`)
    await reloadTimeline()
  }
  catch {
    lead.value.status = previous
    toast.error('Could not update status.')
  }
  finally {
    updatingStatus.value = false
  }
}

async function updateCrmField(patch: Record<string, unknown>) {
  if (!lead.value) return
  savingCrmField.value = true
  try {
    const updated = await authFetch<LeadRow>(`/api/admin/leads/${id}`, { method: 'PATCH', body: patch })
    lead.value = updated
    await reloadTimeline()
    toast.success('Lead updated.')
  }
  catch {
    toast.error('Could not update lead.')
  }
  finally {
    savingCrmField.value = false
  }
}

function onPriorityChange(event: Event) {
  updateCrmField({ priority: (event.target as HTMLSelectElement).value })
}

function onAssigneeChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  updateCrmField({ assignedTo: value || null })
}

function onFollowUpChange(event: Event) {
  const value = (event.target as HTMLInputElement).value
  updateCrmField({ nextFollowUpAt: value ? new Date(value).toISOString() : null })
}

function markContactedNow() {
  updateCrmField({ lastContactedAt: new Date().toISOString() })
}

async function addNote() {
  if (!noteText.value.trim()) return
  savingNote.value = true
  try {
    await authFetch(`/api/admin/leads/${id}/notes`, { method: 'POST', body: { note: noteText.value.trim() } })
    noteText.value = ''
    await reloadTimeline()
    toast.success('Note added.')
  }
  catch {
    toast.error('Could not save note.')
  }
  finally {
    savingNote.value = false
  }
}

async function copyReference() {
  if (!lead.value) return
  try {
    await navigator.clipboard.writeText(lead.value.reference_id)
    toast.success('Reference ID copied.')
  }
  catch {
    toast.error('Could not copy to clipboard.')
  }
}

const selectedPackage = computed(() => packages.value.find(p => p.id === lead.value?.selected_package_id) ?? null)

const whatsappHref = computed(() => {
  if (!lead.value?.phone) return null
  const digits = lead.value.phone.replace(/\D/g, '')
  return digits ? `https://wa.me/${digits}` : null
})

const detailFields = computed(() => {
  if (!lead.value) return []
  return [
    { label: 'Email', value: lead.value.email, href: `mailto:${lead.value.email}` },
    { label: 'Phone', value: lead.value.phone, href: lead.value.phone ? `tel:${lead.value.phone}` : undefined },
    { label: 'Company', value: lead.value.company },
    { label: 'Service', value: lead.value.service },
    { label: 'Package', value: selectedPackage.value?.title ?? null },
    { label: 'Budget range', value: lead.value.budget_range },
    { label: 'Timeline', value: lead.value.timeline },
    { label: 'Preferred contact', value: lead.value.preferred_contact },
    { label: 'Referral source', value: lead.value.referral_source },
    { label: 'Submitted via', value: lead.value.source },
    { label: 'Source page', value: lead.value.source_page },
    { label: 'Locale', value: lead.value.locale },
  ].filter(field => field.value)
})

function activityLabel(entry: Extract<LeadTimelineEntry, { kind: 'activity' }>): string {
  switch (entry.activityType) {
    case 'created': return 'Lead created'
    case 'status_changed': return `Status changed from ${entry.metadata.from ?? '—'} to ${entry.metadata.to ?? '—'}`
    case 'note_added': return 'Note added'
    case 'email_sent': return 'Email sent'
    case 'follow_up_set': return entry.metadata.nextFollowUpAt ? 'Follow-up date set' : 'Follow-up date cleared'
    case 'assigned': return 'Lead reassigned'
    default: return entry.activityType
  }
}

onMounted(loadAll)
</script>

<template>
  <div>
    <NuxtLink
      to="/admin/leads"
      class="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
    >
      ← Back to leads
    </NuxtLink>

    <div
      v-if="loading"
      class="mt-6 flex flex-col gap-4"
    >
      <SkeletonBlock
        height="2rem"
        width="16rem"
      />
      <SkeletonBlock
        height="12rem"
        rounded="var(--radius-md)"
      />
    </div>

    <p
      v-else-if="errorMessage || !lead"
      role="alert"
      class="mt-6 rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[var(--color-danger)]/10 p-4 text-sm"
    >
      {{ errorMessage || 'Lead not found.' }}
    </p>

    <template v-else>
      <div class="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 class="font-display text-2xl font-medium">
            {{ lead.name }}
          </h1>
          <button
            type="button"
            class="mt-1 inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            @click="copyReference"
          >
            {{ lead.reference_id }}
            <AdminIcon
              name="copy"
              :size="14"
            />
          </button>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            v-for="status in leadStatuses"
            :key="status"
            type="button"
            :disabled="updatingStatus"
            class="min-h-[36px] rounded-full border px-3.5 text-xs font-medium transition-colors disabled:opacity-50"
            :class="lead.status === status
              ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
              : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'"
            @click="setStatus(status)"
          >
            {{ leadStatusLabel[status] }}
          </button>
        </div>
      </div>

      <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="flex flex-col gap-6 lg:col-span-2">
          <div>
            <h2 class="text-sm font-medium text-[var(--color-text-muted)]">
              Project description
            </h2>
            <p class="mt-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-sm whitespace-pre-wrap">
              {{ lead.project_description }}
            </p>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <h2 class="text-sm font-medium text-[var(--color-text-muted)]">
                Activity & notes
              </h2>
            </div>

            <div class="mt-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <div class="flex gap-2">
                <textarea
                  v-model="noteText"
                  rows="2"
                  placeholder="Add a note…"
                  class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm focus-visible:border-[var(--color-accent)]"
                />
              </div>
              <div class="mt-2 flex justify-end">
                <BaseButton
                  variant="secondary"
                  :disabled="savingNote || !noteText.trim()"
                  @click="addNote"
                >
                  {{ savingNote ? 'Saving…' : 'Add note' }}
                </BaseButton>
              </div>
            </div>

            <ul
              v-if="timeline.length"
              class="mt-4 flex flex-col gap-3"
            >
              <li
                v-for="entry in timeline"
                :key="entry.id"
                class="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
              >
                <template v-if="entry.kind === 'note'">
                  <p class="text-sm whitespace-pre-wrap">
                    {{ entry.note }}
                  </p>
                  <p class="mt-2 text-xs text-[var(--color-text-muted)]">
                    {{ entry.authorName || 'Admin' }} · {{ formatRelativeDate(entry.createdAt) }}
                  </p>
                </template>
                <template v-else>
                  <p class="text-sm text-[var(--color-text-muted)]">
                    {{ activityLabel(entry) }}
                  </p>
                  <p class="mt-2 text-xs text-[var(--color-text-muted)]">
                    {{ entry.actorName || 'System' }} · {{ formatRelativeDate(entry.createdAt) }}
                  </p>
                </template>
              </li>
            </ul>
            <p
              v-else
              class="mt-4 text-sm text-[var(--color-text-muted)]"
            >
              No activity yet.
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-6">
          <dl class="flex flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div
              v-for="field in detailFields"
              :key="field.label"
            >
              <dt class="text-xs text-[var(--color-text-muted)]">
                {{ field.label }}
              </dt>
              <dd class="mt-1 text-sm">
                <a
                  v-if="field.href"
                  :href="field.href"
                  class="hover:text-[var(--color-accent)]"
                >{{ field.value }}</a>
                <span v-else>{{ field.value }}</span>
              </dd>
            </div>
            <div>
              <dt class="text-xs text-[var(--color-text-muted)]">
                Submitted
              </dt>
              <dd class="mt-1 text-sm">
                {{ new Date(lead.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) }}
              </dd>
            </div>
            <div v-if="lead.last_contacted_at">
              <dt class="text-xs text-[var(--color-text-muted)]">
                Last contacted
              </dt>
              <dd class="mt-1 text-sm">
                {{ formatRelativeDate(lead.last_contacted_at) }}
              </dd>
            </div>
          </dl>

          <div class="flex flex-col gap-2">
            <a
              :href="`mailto:${lead.email}?subject=${encodeURIComponent(`Re: ${lead.reference_id}`)}`"
              class="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-5 text-sm font-medium text-[var(--color-on-accent)] transition-colors hover:bg-[var(--color-accent-strong)]"
              @click="markContactedNow"
            >
              <AdminIcon
                name="mail"
                :size="16"
              />
              Reply by email
            </a>
            <a
              v-if="whatsappHref"
              :href="whatsappHref"
              target="_blank"
              rel="noopener"
              class="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-[var(--color-border)] px-5 text-sm font-medium transition-colors hover:border-[var(--color-text-muted)]"
              @click="markContactedNow"
            >
              <AdminIcon
                name="phone"
                :size="16"
              />
              Message on WhatsApp
            </a>
          </div>

          <div class="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h2 class="text-sm font-medium text-[var(--color-text-muted)]">
              Pipeline
            </h2>

            <div class="mt-4">
              <label class="mb-1.5 block text-xs font-medium text-[var(--color-text-muted)]">Priority</label>
              <select
                :value="lead.priority"
                :disabled="savingCrmField"
                class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm"
                @change="onPriorityChange"
              >
                <option
                  v-for="p in leadPriorities"
                  :key="p"
                  :value="p"
                >
                  {{ leadPriorityLabel[p] }}
                </option>
              </select>
            </div>

            <div class="mt-4">
              <label class="mb-1.5 block text-xs font-medium text-[var(--color-text-muted)]">Assigned to</label>
              <select
                :value="lead.assigned_to ?? ''"
                :disabled="savingCrmField"
                class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm"
                @change="onAssigneeChange"
              >
                <option value="">
                  Unassigned
                </option>
                <option
                  v-for="a in assignees"
                  :key="a.user_id"
                  :value="a.user_id"
                >
                  {{ a.display_name }}
                </option>
              </select>
            </div>

            <div class="mt-4">
              <label class="mb-1.5 block text-xs font-medium text-[var(--color-text-muted)]">Next follow-up</label>
              <input
                type="date"
                :value="lead.next_follow_up_at ? lead.next_follow_up_at.slice(0, 10) : ''"
                :disabled="savingCrmField"
                class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm"
                @change="onFollowUpChange"
              >
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
