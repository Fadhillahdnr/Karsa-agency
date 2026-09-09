<script setup lang="ts">
import type { TestimonialRow } from '../../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { authFetch } = useAdminAuth()
const toast = useToast()
const { confirm } = useConfirm()

const testimonials = ref<TestimonialRow[]>([])
const loading = ref(true)
const errorMessage = ref('')

async function loadTestimonials() {
  loading.value = true
  errorMessage.value = ''
  try {
    testimonials.value = await authFetch<TestimonialRow[]>('/api/admin/testimonials')
  }
  catch {
    errorMessage.value = 'Could not load testimonials.'
  }
  finally {
    loading.value = false
  }
}

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
  <div>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="font-display text-2xl font-medium">
          Testimonials
        </h1>
        <p class="mt-1 text-sm text-[var(--color-text-muted)]">
          Only shown publicly when permission_to_show is granted.
        </p>
      </div>
      <BaseButton
        to="/admin/testimonials/new"
        variant="primary"
      >
        <AdminIcon
          name="plus"
          :size="16"
        /> New testimonial
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
        v-for="i in 3"
        :key="i"
        height="4.5rem"
        rounded="var(--radius-md)"
      />
    </div>

    <EmptyState
      v-else-if="!testimonials.length"
      class="mt-6"
      icon="mail"
      title="No testimonials yet"
      description="Add your first verified testimonial once you have permission to publish it."
    >
      <template #action>
        <BaseButton
          to="/admin/testimonials/new"
          variant="secondary"
        >
          New testimonial
        </BaseButton>
      </template>
    </EmptyState>

    <ul
      v-else
      class="mt-6 flex flex-col gap-2"
    >
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
  </div>
</template>
