<script setup lang="ts">
import type { FaqRow } from '../../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

type ListItem = FaqRow & { question: string }

const { authFetch } = useAdminAuth()
const toast = useToast()
const { confirm } = useConfirm()

const faqs = ref<ListItem[]>([])
const loading = ref(true)
const errorMessage = ref('')

async function loadFaqs() {
  loading.value = true
  errorMessage.value = ''
  try {
    faqs.value = await authFetch<ListItem[]>('/api/admin/faqs')
  }
  catch {
    errorMessage.value = 'Could not load FAQs.'
  }
  finally {
    loading.value = false
  }
}

async function deleteFaq(item: ListItem) {
  const ok = await confirm({
    title: 'Delete this FAQ?',
    description: 'This permanently removes the question and answer.',
    confirmLabel: 'Delete',
    danger: true,
  })
  if (!ok) return

  try {
    await authFetch(`/api/admin/faqs/${item.id}`, { method: 'DELETE' })
    faqs.value = faqs.value.filter(f => f.id !== item.id)
    toast.success('FAQ deleted.')
  }
  catch {
    toast.error('Could not delete FAQ.')
  }
}

onMounted(loadFaqs)
</script>

<template>
  <div>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="font-display text-2xl font-medium">
          FAQ
        </h1>
        <p class="mt-1 text-sm text-[var(--color-text-muted)]">
          Shown on /faq, ordered by the number below.
        </p>
      </div>
      <BaseButton
        to="/admin/faqs/new"
        variant="primary"
      >
        <AdminIcon
          name="plus"
          :size="16"
        /> New FAQ
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
      v-else-if="!faqs.length"
      class="mt-6"
      icon="mail"
      title="No FAQs yet"
      description="Cover price, timeline, revisions, ownership, and other common questions."
    >
      <template #action>
        <BaseButton
          to="/admin/faqs/new"
          variant="secondary"
        >
          New FAQ
        </BaseButton>
      </template>
    </EmptyState>

    <ul
      v-else
      class="mt-6 flex flex-col gap-2"
    >
      <li
        v-for="item in faqs"
        :key="item.id"
        class="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
      >
        <NuxtLink
          :to="`/admin/faqs/${item.id}`"
          class="min-w-0 flex-1"
        >
          <p class="truncate font-medium">
            {{ item.question }}
          </p>
          <p
            v-if="item.category"
            class="truncate text-xs text-[var(--color-text-muted)]"
          >
            {{ item.category }}
          </p>
        </NuxtLink>
        <StatusBadge
          :label="item.status"
          :tone="item.status === 'published' ? 'accent' : item.status === 'archived' ? 'neutral' : 'warning'"
        />
        <button
          type="button"
          class="text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"
          aria-label="Delete FAQ"
          @click="deleteFaq(item)"
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
