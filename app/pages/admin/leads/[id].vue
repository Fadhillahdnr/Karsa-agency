<script setup lang="ts">
import type { LeadRow } from '../../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const route = useRoute()
const id = route.params.id as string

const { authFetch } = useAdminAuth()
const toast = useToast()

const lead = ref<LeadRow | null>(null)
const loading = ref(true)
const errorMessage = ref('')
const updatingStatus = ref(false)

async function loadLead() {
  loading.value = true
  errorMessage.value = ''
  try {
    lead.value = await authFetch<LeadRow>(`/api/admin/leads/${id}`)
  }
  catch {
    errorMessage.value = 'Could not load this lead.'
  }
  finally {
    loading.value = false
  }
}

async function setStatus(status: LeadStatus) {
  if (!lead.value || lead.value.status === status) return
  const previous = lead.value.status
  updatingStatus.value = true
  lead.value.status = status
  try {
    await authFetch(`/api/admin/leads/${id}`, { method: 'PATCH', body: { status } })
    toast.success(`Status updated to ${leadStatusLabel[status]}.`)
  }
  catch {
    lead.value.status = previous
    toast.error('Could not update status.')
  }
  finally {
    updatingStatus.value = false
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

const detailFields = computed(() => {
  if (!lead.value) return []
  return [
    { label: 'Email', value: lead.value.email, href: `mailto:${lead.value.email}` },
    { label: 'Phone', value: lead.value.phone, href: lead.value.phone ? `tel:${lead.value.phone}` : undefined },
    { label: 'Company', value: lead.value.company },
    { label: 'Service', value: lead.value.service },
    { label: 'Budget range', value: lead.value.budget_range },
    { label: 'Timeline', value: lead.value.timeline },
    { label: 'Referral source', value: lead.value.referral_source },
    { label: 'Submitted via', value: lead.value.source },
  ].filter(field => field.value)
})

onMounted(loadLead)
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
        <div class="lg:col-span-2">
          <h2 class="text-sm font-medium text-[var(--color-text-muted)]">
            Project description
          </h2>
          <p class="mt-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-sm whitespace-pre-wrap">
            {{ lead.project_description }}
          </p>
        </div>

        <div>
          <h2 class="text-sm font-medium text-[var(--color-text-muted)]">
            Contact details
          </h2>
          <dl class="mt-3 flex flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
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
          </dl>

          <a
            :href="`mailto:${lead.email}?subject=${encodeURIComponent(`Re: ${lead.reference_id}`)}`"
            class="mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-5 text-sm font-medium text-[var(--color-on-accent)] transition-colors hover:bg-[var(--color-accent-strong)]"
          >
            <AdminIcon
              name="mail"
              :size="16"
            />
            Reply by email
          </a>
        </div>
      </div>
    </template>
  </div>
</template>
