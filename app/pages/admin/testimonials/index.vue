<script setup lang="ts">
import type { TestimonialRow } from '../../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { authFetch } = useAdminAuth()
const toast = useToast()
const { confirm } = useConfirm()

const { items: testimonials, loading, error: errorMessage, load: loadTestimonials } = useAdminList<TestimonialRow>(
  () => authFetch<TestimonialRow[]>('/api/admin/testimonials'),
  'Could not load testimonials.',
)

async function deleteTestimonial(item: TestimonialRow) {
  const ok = await confirm({
    title: `Delete testimonial from "${item.person_name}"?`,
    description: 'This permanently removes the testimonial.',
    confirmLabel: 'Delete',
    danger: true,
  })
  if (!ok) return

  try {
    await authFetch(`/api/admin/testimonials/${item.id}`, { method: 'DELETE' })
    testimonials.value = testimonials.value.filter(t => t.id !== item.id)
    toast.success('Testimonial deleted.')
  }
  catch {
    toast.error('Could not delete testimonial.')
  }
}

onMounted(loadTestimonials)
</script>

<template>
  <AdminListPage
    title="Testimonials"
    description="Only shown publicly when permission_to_show is granted."
    new-to="/admin/testimonials/new"
    new-label="New testimonial"
    :loading="loading"
    :error="errorMessage"
    :empty="!testimonials.length"
    empty-icon="mail"
    empty-title="No testimonials yet"
    empty-description="Add your first verified testimonial once you have permission to publish it."
    :skeleton-count="3"
    skeleton-height="4.5rem"
  >
    <ul class="mt-6 flex flex-col gap-2">
      <li
        v-for="item in testimonials"
        :key="item.id"
        class="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
      >
        <NuxtLink
          :to="`/admin/testimonials/${item.id}`"
          class="min-w-0 flex-1"
        >
          <p class="truncate text-sm text-[var(--color-text-muted)] italic">
            "{{ item.quote }}"
          </p>
          <p class="mt-1 truncate text-sm font-medium">
            {{ item.person_name }}<span
              v-if="item.company"
              class="text-[var(--color-text-muted)]"
            > · {{ item.company }}</span>
          </p>
        </NuxtLink>
        <StatusBadge
          v-if="!item.permission_to_show"
          label="No permission"
          tone="warning"
        />
        <StatusBadge
          :label="item.status"
          :tone="item.status === 'published' ? 'accent' : 'neutral'"
        />
        <button
          type="button"
          class="text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"
          aria-label="Delete testimonial"
          @click="deleteTestimonial(item)"
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
