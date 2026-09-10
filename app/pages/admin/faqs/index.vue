<script setup lang="ts">
import type { FaqRow } from '../../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

type ListItem = FaqRow & { question: string }

const { authFetch } = useAdminAuth()
const toast = useToast()
const { confirm } = useConfirm()

const { items: faqs, loading, error: errorMessage, load: loadFaqs } = useAdminList<ListItem>(
  () => authFetch<ListItem[]>('/api/admin/faqs'),
  'Could not load FAQs.',
)

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
  <AdminListPage
    title="FAQ"
    description="Shown on /faq, ordered by the number below."
    new-to="/admin/faqs/new"
    new-label="New FAQ"
    :loading="loading"
    :error="errorMessage"
    :empty="!faqs.length"
    empty-icon="mail"
    empty-title="No FAQs yet"
    empty-description="Cover price, timeline, revisions, ownership, and other common questions."
    :skeleton-count="4"
  >
    <ul class="mt-6 flex flex-col gap-2">
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
  </AdminListPage>
</template>
