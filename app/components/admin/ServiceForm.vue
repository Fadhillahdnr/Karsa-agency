<script setup lang="ts">
interface TranslationValue {
  title: string
  shortTitle: string
  eyebrow: string
  summary: string
  intro: string[]
  whoItsFor: string[]
  problems: string[]
  deliverables: string[]
  included: string[]
  excluded: string[]
  process: string
  ctaLabel: string
  seoTitle: string
  seoDescription: string
}

interface FaqValue {
  question: string
  answer: string
}

export interface ServiceFormValue {
  slug: string
  category: 'web' | 'design' | 'photo' | 'film' | 'integrated'
  featured: boolean
  showPrice: boolean
  priceType: 'fixed' | 'starting_from' | 'custom' | 'monthly' | null
  startingPrice: number | null
  currency: string
  orderIndex: number
  status: 'draft' | 'scheduled' | 'published' | 'archived'
  translations: { en: TranslationValue, id: TranslationValue }
  faqs: { en: FaqValue[], id: FaqValue[] }
}

function emptyTranslation(): TranslationValue {
  return {
    title: '',
    shortTitle: '',
    eyebrow: '',
    summary: '',
    intro: [],
    whoItsFor: [],
    problems: [],
    deliverables: [],
    included: [],
    excluded: [],
    process: '',
    ctaLabel: '',
    seoTitle: '',
    seoDescription: '',
  }
}

const props = withDefaults(defineProps<{
  initial?: Partial<ServiceFormValue>
  submitting?: boolean
  submitLabel?: string
  errorMessage?: string
}>(), {
  initial: undefined,
  submitting: false,
  submitLabel: 'Save service',
  errorMessage: '',
})

const emit = defineEmits<{ submit: [value: ServiceFormValue] }>()

const form = reactive<ServiceFormValue>({
  slug: props.initial?.slug ?? '',
  category: props.initial?.category ?? 'web',
  featured: props.initial?.featured ?? false,
  showPrice: props.initial?.showPrice ?? false,
  priceType: props.initial?.priceType ?? null,
  startingPrice: props.initial?.startingPrice ?? null,
  currency: props.initial?.currency ?? 'IDR',
  orderIndex: props.initial?.orderIndex ?? 0,
  status: props.initial?.status ?? 'draft',
  translations: {
    en: { ...emptyTranslation(), ...props.initial?.translations?.en },
    id: { ...emptyTranslation(), ...props.initial?.translations?.id },
  },
  faqs: {
    en: props.initial?.faqs?.en ? [...props.initial.faqs.en] : [],
    id: props.initial?.faqs?.id ? [...props.initial.faqs.id] : [],
  },
})

const activeLocale = ref<'en' | 'id'>('en')
const categoryOptions: ServiceFormValue['category'][] = ['web', 'design', 'photo', 'film', 'integrated']
const statusOptions: ServiceFormValue['status'][] = ['draft', 'scheduled', 'published', 'archived']
const attemptedSubmit = ref(false)

const localeCompleteness = computed(() => ({
  en: form.translations.en.title.trim().length > 0 && form.translations.en.summary.trim().length > 0,
  id: form.translations.id.title.trim().length > 0 && form.translations.id.summary.trim().length > 0,
}))

const isValid = computed(() =>
  !!form.slug.trim() && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug.trim())
  && form.translations.en.title.trim().length > 0
  && form.translations.id.title.trim().length > 0,
)

function listToText(items: string[]) {
  return items.join('\n')
}
function textToList(value: string) {
  return value.split('\n').map(line => line.trim()).filter(Boolean)
}

function addFaq(locale: 'en' | 'id') {
  form.faqs[locale].push({ question: '', answer: '' })
}
function removeFaq(locale: 'en' | 'id', index: number) {
  form.faqs[locale].splice(index, 1)
}

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
      <h2 class="font-display text-base font-medium">
        Basic information
      </h2>
      <div class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label
            for="service-slug"
            class="mb-2 block text-sm font-medium"
          >Slug <span aria-hidden="true">*</span></label>
          <input
            id="service-slug"
            v-model="form.slug"
            type="text"
            placeholder="e.g. brand-identity"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          >
          <p class="mt-1.5 text-xs text-[var(--color-text-muted)]">
            /services/{{ form.slug || '<slug>' }}
          </p>
        </div>

        <div>
          <label
            for="service-category"
            class="mb-2 block text-sm font-medium"
          >Category</label>
          <select
            id="service-category"
            v-model="form.category"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm uppercase focus-visible:border-[var(--color-accent)]"
          >
            <option
              v-for="option in categoryOptions"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </div>

        <div>
          <label
            for="service-status"
            class="mb-2 block text-sm font-medium"
          >Status</label>
          <select
            id="service-status"
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

        <div>
          <label
            for="service-order"
            class="mb-2 block text-sm font-medium"
          >Order</label>
          <input
            id="service-order"
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

        <label class="flex min-h-[24px] items-center gap-2 self-end pb-1 text-sm font-medium">
          <input
            v-model="form.showPrice"
            type="checkbox"
            class="h-4 w-4 rounded border-[var(--color-border)]"
          >
          Show starting price publicly
        </label>
      </div>

      <div
        v-if="form.showPrice"
        class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3"
      >
        <div>
          <label
            for="service-price-type"
            class="mb-2 block text-sm font-medium"
          >Price type</label>
          <select
            id="service-price-type"
            v-model="form.priceType"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm capitalize focus-visible:border-[var(--color-accent)]"
          >
            <option
              v-for="option in ['fixed', 'starting_from', 'custom', 'monthly']"
              :key="option"
              :value="option"
            >
              {{ option.replace('_', ' ') }}
            </option>
          </select>
        </div>
        <div>
          <label
            for="service-price"
            class="mb-2 block text-sm font-medium"
          >Starting price</label>
          <input
            id="service-price"
            v-model.number="form.startingPrice"
            type="number"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          >
        </div>
        <div>
          <label
            for="service-currency"
            class="mb-2 block text-sm font-medium"
          >Currency</label>
          <input
            id="service-currency"
            v-model="form.currency"
            type="text"
            maxlength="3"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm uppercase focus-visible:border-[var(--color-accent)]"
          >
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
            class="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
            :class="activeLocale === locale
              ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'"
            @click="activeLocale = locale"
          >
            {{ locale === 'en' ? 'English' : 'Bahasa Indonesia' }}
            <span
              class="h-1.5 w-1.5 rounded-full"
              :class="localeCompleteness[locale] ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'"
              :aria-label="localeCompleteness[locale] ? 'Complete' : 'Incomplete'"
            />
          </button>
        </div>
      </div>

      <div
        v-for="locale in (['en', 'id'] as const)"
        v-show="activeLocale === locale"
        :key="locale"
        class="mt-5 flex flex-col gap-5"
      >
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium">Title <span aria-hidden="true">*</span></label>
            <input
              v-model="form.translations[locale].title"
              type="text"
              class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
            >
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium">Eyebrow</label>
            <input
              v-model="form.translations[locale].eyebrow"
              type="text"
              class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
            >
          </div>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium">Summary</label>
          <textarea
            :value="form.translations[locale].summary"
            rows="2"
            maxlength="500"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
            @input="form.translations[locale].summary = ($event.target as HTMLTextAreaElement).value"
          />
        </div>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div
            v-for="field in (['whoItsFor', 'problems', 'deliverables', 'intro'] as const)"
            :key="field"
          >
            <label class="mb-2 block text-sm font-medium capitalize">
              {{ field === 'whoItsFor' ? "Who it's for" : field === 'intro' ? 'What Karsa can build' : field }}
            </label>
            <textarea
              :value="listToText(form.translations[locale][field])"
              rows="4"
              placeholder="One item per line"
              class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
              @input="form.translations[locale][field] = textToList(($event.target as HTMLTextAreaElement).value)"
            />
          </div>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium">Process</label>
          <textarea
            :value="form.translations[locale].process"
            rows="3"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
            @input="form.translations[locale].process = ($event.target as HTMLTextAreaElement).value"
          />
        </div>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium">SEO title</label>
            <input
              v-model="form.translations[locale].seoTitle"
              type="text"
              class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
            >
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium">SEO description</label>
            <input
              v-model="form.translations[locale].seoDescription"
              type="text"
              class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
            >
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">FAQ</label>
            <button
              type="button"
              class="text-xs font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-strong)]"
              @click="addFaq(locale)"
            >
              + Add question
            </button>
          </div>
          <div
            v-for="(faq, index) in form.faqs[locale]"
            :key="index"
            class="mt-3 flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] p-4"
          >
            <div class="flex items-start gap-2">
              <input
                v-model="faq.question"
                type="text"
                placeholder="Question"
                class="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm focus-visible:border-[var(--color-accent)]"
              >
              <button
                type="button"
                class="mt-1 shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"
                aria-label="Remove question"
                @click="removeFaq(locale, index)"
              >
                <AdminIcon
                  name="trash"
                  :size="16"
                />
              </button>
            </div>
            <textarea
              v-model="faq.answer"
              rows="2"
              placeholder="Answer"
              class="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm focus-visible:border-[var(--color-accent)]"
            />
          </div>
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
