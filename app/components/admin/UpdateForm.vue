<script setup lang="ts">
import type { JSONContent } from '@tiptap/vue-3'

interface TranslationValue {
  title: string
  excerpt: string
  content: JSONContent
  seoTitle: string
  seoDescription: string
}

export interface UpdateFormValue {
  slug: string
  status: 'draft' | 'scheduled' | 'published' | 'archived'
  translations: { en: TranslationValue, id: TranslationValue }
}

function emptyTranslation(): TranslationValue {
  return { title: '', excerpt: '', content: {}, seoTitle: '', seoDescription: '' }
}

const props = withDefaults(defineProps<{
  initial?: Partial<UpdateFormValue>
  submitting?: boolean
  submitLabel?: string
  errorMessage?: string
}>(), {
  initial: undefined,
  submitting: false,
  submitLabel: 'Save update',
  errorMessage: '',
})

const emit = defineEmits<{ submit: [value: UpdateFormValue] }>()

const statusOptions: UpdateFormValue['status'][] = ['draft', 'scheduled', 'published', 'archived']

const form = reactive<UpdateFormValue>({
  slug: props.initial?.slug ?? '',
  status: props.initial?.status ?? 'draft',
  translations: {
    en: { ...emptyTranslation(), ...props.initial?.translations?.en },
    id: { ...emptyTranslation(), ...props.initial?.translations?.id },
  },
})

const activeLocale = ref<'en' | 'id'>('en')
const attemptedSubmit = ref(false)
const isValid = computed(() =>
  !!form.slug.trim() && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug.trim())
  && form.translations.en.title.trim().length > 0
  && form.translations.id.title.trim().length > 0,
)

function handleSubmit() {
  attemptedSubmit.value = true
  if (!isValid.value) return
  emit('submit', JSON.parse(JSON.stringify(form)))
}
</script>

<template>
  <form
    class="flex flex-col gap-8"
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
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label class="mb-2 block text-sm font-medium">Slug <span aria-hidden="true">*</span></label>
          <input
            v-model="form.slug"
            type="text"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          >
          <p class="mt-1.5 text-xs text-[var(--color-text-muted)]">
            /updates/{{ form.slug || '<slug>' }}
          </p>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Status</label>
          <select
            v-model="form.status"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm capitalize focus-visible:border-[var(--color-accent)]"
          >
            <option
              v-for="option in statusOptions"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </div>
      </div>
    </section>

    <section class="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
      <div class="flex items-center justify-between">
        <h2 class="font-display text-base font-medium">
          Content
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
        class="mt-5 flex flex-col gap-5"
      >
        <div>
          <label class="mb-2 block text-sm font-medium">Title <span aria-hidden="true">*</span></label>
          <input
            v-model="form.translations[locale].title"
            type="text"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          >
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Excerpt</label>
          <textarea
            v-model="form.translations[locale].excerpt"
            rows="2"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          />
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Body</label>
          <RichTextEditor v-model="form.translations[locale].content" />
        </div>
      </div>
    </section>

    <div class="sticky bottom-0 z-20 -mx-4 flex items-center justify-between gap-4 border-t border-[var(--color-border)] bg-[var(--color-bg)]/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
      <p
        v-if="attemptedSubmit && !isValid"
        class="text-xs text-[var(--color-danger)]"
      >
        Slug and both language titles are required.
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
