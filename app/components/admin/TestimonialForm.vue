<script setup lang="ts">
export interface TestimonialFormValue {
  quote: string
  personName: string
  personRole: string
  company: string
  source: string
  sourceUrl: string
  permissionToShow: boolean
  featured: boolean
  orderIndex: number
  status: 'draft' | 'published' | 'archived'
}

const props = withDefaults(defineProps<{
  initial?: Partial<TestimonialFormValue>
  submitting?: boolean
  submitLabel?: string
  errorMessage?: string
}>(), {
  initial: undefined,
  submitting: false,
  submitLabel: 'Save testimonial',
  errorMessage: '',
})

const emit = defineEmits<{ submit: [value: TestimonialFormValue] }>()

const form = reactive<TestimonialFormValue>({
  quote: props.initial?.quote ?? '',
  personName: props.initial?.personName ?? '',
  personRole: props.initial?.personRole ?? '',
  company: props.initial?.company ?? '',
  source: props.initial?.source ?? '',
  sourceUrl: props.initial?.sourceUrl ?? '',
  permissionToShow: props.initial?.permissionToShow ?? false,
  featured: props.initial?.featured ?? false,
  orderIndex: props.initial?.orderIndex ?? 0,
  status: props.initial?.status ?? 'draft',
})

const attemptedSubmit = ref(false)
const isValid = computed(() => form.quote.trim().length >= 10 && form.personName.trim().length > 1)

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
      Never publish a testimonial without permission — check "Permission to show" only once you have it (§16).
    </p>

    <section class="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
      <div>
        <label class="mb-2 block text-sm font-medium">Quote <span aria-hidden="true">*</span></label>
        <textarea
          v-model="form.quote"
          rows="4"
          class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
        />
      </div>

      <div class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label class="mb-2 block text-sm font-medium">Person name <span aria-hidden="true">*</span></label>
          <input
            v-model="form.personName"
            type="text"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          >
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Role</label>
          <input
            v-model="form.personRole"
            type="text"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          >
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Company</label>
          <input
            v-model="form.company"
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
          <label class="mb-2 block text-sm font-medium">Source</label>
          <input
            v-model="form.source"
            type="text"
            placeholder="e.g. Email, WhatsApp, Google Review"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          >
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Source URL</label>
          <input
            v-model="form.sourceUrl"
            type="url"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          >
        </div>
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
        Quote (10+ characters) and person name are required.
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
