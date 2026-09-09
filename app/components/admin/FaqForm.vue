<script setup lang="ts">
interface TranslationValue {
  question: string
  answer: string
}

export interface FaqFormValue {
  category: string
  orderIndex: number
  featured: boolean
  status: 'draft' | 'published' | 'archived'
  translations: { en: TranslationValue, id: TranslationValue }
}

const props = withDefaults(defineProps<{
  initial?: Partial<FaqFormValue>
  submitting?: boolean
  submitLabel?: string
  errorMessage?: string
}>(), {
  initial: undefined,
  submitting: false,
  submitLabel: 'Save FAQ',
  errorMessage: '',
})

const emit = defineEmits<{ submit: [value: FaqFormValue] }>()

const form = reactive<FaqFormValue>({
  category: props.initial?.category ?? '',
  orderIndex: props.initial?.orderIndex ?? 0,
  featured: props.initial?.featured ?? false,
  status: props.initial?.status ?? 'draft',
  translations: {
    en: { question: '', answer: '', ...props.initial?.translations?.en },
    id: { question: '', answer: '', ...props.initial?.translations?.id },
  },
})

const activeLocale = ref<'en' | 'id'>('en')
const attemptedSubmit = ref(false)
const isValid = computed(() =>
  form.translations.en.question.trim().length > 1 && form.translations.en.answer.trim().length > 1
  && form.translations.id.question.trim().length > 1 && form.translations.id.answer.trim().length > 1,
)

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

    <section class="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label class="mb-2 block text-sm font-medium">Category</label>
          <input
            v-model="form.category"
            type="text"
            placeholder="e.g. Pricing"
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
        <label class="flex min-h-[24px] items-center gap-2 self-end pb-1 text-sm font-medium">
          <input
            v-model="form.featured"
            type="checkbox"
            class="h-4 w-4 rounded border-[var(--color-border)]"
          >
          Featured on homepage
        </label>
      </div>
    </section>

    <section class="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
      <div class="flex items-center justify-between">
        <h2 class="font-display text-base font-medium">
          Question &amp; Answer
        </h2>
        <div
          class="flex gap-1 rounded-full border border-[var(--color-border)] p-1"
          role="tablist"
        >
          <button
            v-for="locale in (['en', 'id'] as const)"
            :key="locale"
            type="button"
            role="tab"
            :aria-selected="activeLocale === locale"
            class="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
            :class="activeLocale === locale
              ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'"
            @click="activeLocale = locale"
          >
            {{ locale === 'en' ? 'English' : 'Bahasa Indonesia' }}
          </button>
        </div>
      </div>

      <div
        v-for="locale in (['en', 'id'] as const)"
        v-show="activeLocale === locale"
        :key="locale"
        class="mt-5 flex flex-col gap-4"
      >
        <div>
          <label class="mb-2 block text-sm font-medium">Question <span aria-hidden="true">*</span></label>
          <input
            v-model="form.translations[locale].question"
            type="text"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          >
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Answer <span aria-hidden="true">*</span></label>
          <textarea
            v-model="form.translations[locale].answer"
            rows="4"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          />
        </div>
      </div>
    </section>

    <div class="sticky bottom-0 z-20 -mx-4 flex items-center justify-between gap-4 border-t border-[var(--color-border)] bg-[var(--color-bg)]/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
      <p
        v-if="attemptedSubmit && !isValid"
        class="text-xs text-[var(--color-danger)]"
      >
        Both languages need a question and answer.
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
