<script setup lang="ts">
export interface ClientFormValue {
  name: string
  slug: string
  websiteUrl: string
  industry: string
  description: string
  featured: boolean
  permissionToShow: boolean
  orderIndex: number
  status: 'draft' | 'published' | 'archived'
}

const props = withDefaults(defineProps<{
  initial?: Partial<ClientFormValue>
  submitting?: boolean
  submitLabel?: string
  errorMessage?: string
}>(), {
  initial: undefined,
  submitting: false,
  submitLabel: 'Save client',
  errorMessage: '',
})

const emit = defineEmits<{ submit: [value: ClientFormValue] }>()

const form = reactive<ClientFormValue>({
  name: props.initial?.name ?? '',
  slug: props.initial?.slug ?? '',
  websiteUrl: props.initial?.websiteUrl ?? '',
  industry: props.initial?.industry ?? '',
  description: props.initial?.description ?? '',
  featured: props.initial?.featured ?? false,
  permissionToShow: props.initial?.permissionToShow ?? false,
  orderIndex: props.initial?.orderIndex ?? 0,
  status: props.initial?.status ?? 'draft',
})

const attemptedSubmit = ref(false)
const isValid = computed(() => form.name.trim().length > 1 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug.trim()))

function handleSubmit() {
  attemptedSubmit.value = true
  if (!isValid.value) return
  emit('submit', { ...form })
}
</script>

<template>
  <form
    class="flex flex-col gap-6"
    novalidate
    @submit.prevent="handleSubmit"
  >
    <div
      v-if="errorMessage"
      role="alert"
      class="rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[var(--color-danger)]/10 p-4 text-sm"
    >
      {{ errorMessage }}
    </div>

    <p
      v-if="!form.permissionToShow"
      class="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-xs text-[var(--color-text-muted)]"
    >
      Not shown publicly until "Permission to show" is checked below — logos/client names are never displayed without explicit permission (§107).
    </p>

    <section class="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label class="mb-2 block text-sm font-medium">Name <span aria-hidden="true">*</span></label>
          <input
            v-model="form.name"
            type="text"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          >
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Slug <span aria-hidden="true">*</span></label>
          <input
            v-model="form.slug"
            type="text"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          >
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Website URL</label>
          <input
            v-model="form.websiteUrl"
            type="url"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          >
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Industry</label>
          <input
            v-model="form.industry"
            type="text"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          >
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Status</label>
          <select
            v-model="form.status"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm capitalize focus-visible:border-[var(--color-accent)]"
          >
            <option
              v-for="option in (['draft', 'published', 'archived'] as const)"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Order</label>
          <input
            v-model.number="form.orderIndex"
            type="number"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          >
        </div>
      </div>

      <div class="mt-5">
        <label class="mb-2 block text-sm font-medium">Description</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
        />
      </div>

      <div class="mt-5 flex flex-wrap gap-6">
        <label class="flex min-h-[24px] items-center gap-2 text-sm font-medium">
          <input
            v-model="form.featured"
            type="checkbox"
            class="h-4 w-4 rounded border-[var(--color-border)]"
          >
          Featured
        </label>
        <label class="flex min-h-[24px] items-center gap-2 text-sm font-medium">
          <input
            v-model="form.permissionToShow"
            type="checkbox"
            class="h-4 w-4 rounded border-[var(--color-border)]"
          >
          Permission to show publicly
        </label>
      </div>
    </section>

    <div class="sticky bottom-0 z-20 -mx-4 flex items-center justify-between gap-4 border-t border-[var(--color-border)] bg-[var(--color-bg)]/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
      <p
        v-if="attemptedSubmit && !isValid"
        class="text-xs text-[var(--color-danger)]"
      >
        Name and a valid slug are required.
      </p>
      <span v-else />
      <BaseButton
        type="submit"
        variant="primary"
        :disabled="submitting"
      >
        {{ submitting ? 'Saving…' : submitLabel }}
      </BaseButton>
    </div>
  </form>
</template>
