<script setup lang="ts">
interface TranslationValue {
  title: string
  summary: string
  priceNote: string
  recommendedFor: string
  durationNote: string
  revisionNote: string
  ctaLabel: string
  seoTitle: string
  seoDescription: string
}

interface ItemValue {
  label: string
  description: string
  isHighlight: boolean
}

export interface PackageFormValue {
  slug: string
  category: 'solo' | 'combo' | 'signature' | 'maintenance'
  priceType: 'fixed' | 'starting_from' | 'custom' | 'monthly'
  price: number | null
  currency: string
  badge: string
  featured: boolean
  orderIndex: number
  status: 'draft' | 'scheduled' | 'published' | 'archived'
  serviceIds: string[]
  items: ItemValue[]
  translations: { en: TranslationValue, id: TranslationValue }
}

function emptyTranslation(): TranslationValue {
  return { title: '', summary: '', priceNote: '', recommendedFor: '', durationNote: '', revisionNote: '', ctaLabel: '', seoTitle: '', seoDescription: '' }
}

const props = withDefaults(defineProps<{
  initial?: Partial<PackageFormValue>
  submitting?: boolean
  submitLabel?: string
  errorMessage?: string
  availableServices?: { id: string, title: string }[]
}>(), {
  initial: undefined,
  submitting: false,
  submitLabel: 'Save package',
  errorMessage: '',
  availableServices: () => [],
})

const emit = defineEmits<{ submit: [value: PackageFormValue] }>()

const form = reactive<PackageFormValue>({
  slug: props.initial?.slug ?? '',
  category: props.initial?.category ?? 'solo',
  priceType: props.initial?.priceType ?? 'starting_from',
  price: props.initial?.price ?? null,
  currency: props.initial?.currency ?? 'IDR',
  badge: props.initial?.badge ?? '',
  featured: props.initial?.featured ?? false,
  orderIndex: props.initial?.orderIndex ?? 0,
  status: props.initial?.status ?? 'draft',
  serviceIds: props.initial?.serviceIds ? [...props.initial.serviceIds] : [],
  items: props.initial?.items ? props.initial.items.map(item => ({ ...item })) : [],
  translations: {
    en: { ...emptyTranslation(), ...props.initial?.translations?.en },
    id: { ...emptyTranslation(), ...props.initial?.translations?.id },
  },
})

const activeLocale = ref<'en' | 'id'>('en')
const categoryOptions: PackageFormValue['category'][] = ['solo', 'combo', 'signature', 'maintenance']
const statusOptions: PackageFormValue['status'][] = ['draft', 'scheduled', 'published', 'archived']
const attemptedSubmit = ref(false)

const isValid = computed(() =>
  !!form.slug.trim() && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug.trim())
  && form.translations.en.title.trim().length > 0
  && form.translations.id.title.trim().length > 0,
)

function addItem() {
  form.items.push({ label: '', description: '', isHighlight: false })
}
function removeItem(index: number) {
  form.items.splice(index, 1)
}

function toggleService(serviceId: string) {
  const index = form.serviceIds.indexOf(serviceId)
  if (index === -1) form.serviceIds.push(serviceId)
  else form.serviceIds.splice(index, 1)
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
          <label class="mb-2 block text-sm font-medium">Slug <span aria-hidden="true">*</span></label>
          <input
            v-model="form.slug"
            type="text"
            placeholder="e.g. full-presence"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          >
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Category</label>
          <select
            v-model="form.category"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm capitalize focus-visible:border-[var(--color-accent)]"
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

        <div>
          <label class="mb-2 block text-sm font-medium">Price type</label>
          <select
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
          <label class="mb-2 block text-sm font-medium">Price</label>
          <input
            v-model.number="form.price"
            type="number"
            :disabled="form.priceType === 'custom'"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)] disabled:opacity-50"
          >
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Currency</label>
          <input
            v-model="form.currency"
            type="text"
            maxlength="3"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm uppercase focus-visible:border-[var(--color-accent)]"
          >
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium">Badge</label>
          <input
            v-model="form.badge"
            type="text"
            placeholder="e.g. Most Popular"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          >
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
          Featured
        </label>
      </div>
    </section>

    <section
      v-if="availableServices.length"
      class="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6"
    >
      <h2 class="font-display text-base font-medium">
        Included services
      </h2>
      <div class="mt-4 flex flex-wrap gap-2">
        <button
          v-for="service in availableServices"
          :key="service.id"
          type="button"
          class="min-h-[36px] rounded-full border px-3.5 text-xs font-medium transition-colors"
          :class="form.serviceIds.includes(service.id)
            ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
            : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'"
          @click="toggleService(service.id)"
        >
          {{ service.title }}
        </button>
      </div>
    </section>

    <section class="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
      <div class="flex items-center justify-between">
        <h2 class="font-display text-base font-medium">
          What's included
        </h2>
        <button
          type="button"
          class="text-xs font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-strong)]"
          @click="addItem"
        >
          + Add item
        </button>
      </div>
      <div
        v-for="(item, index) in form.items"
        :key="index"
        class="mt-3 flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] p-3"
      >
        <div class="flex-1">
          <input
            v-model="item.label"
            type="text"
            placeholder="Item label"
            class="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm focus-visible:border-[var(--color-accent)]"
          >
          <input
            v-model="item.description"
            type="text"
            placeholder="Description (optional)"
            class="mt-2 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm focus-visible:border-[var(--color-accent)]"
          >
        </div>
        <label class="mt-2 flex items-center gap-1.5 text-xs whitespace-nowrap">
          <input
            v-model="item.isHighlight"
            type="checkbox"
            class="h-4 w-4 rounded border-[var(--color-border)]"
          >
          Highlight
        </label>
        <button
          type="button"
          class="mt-1.5 shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"
          aria-label="Remove item"
          @click="removeItem(index)"
        >
          <AdminIcon
            name="trash"
            :size="16"
          />
        </button>
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
          <label class="mb-2 block text-sm font-medium">Summary</label>
          <textarea
            v-model="form.translations[locale].summary"
            rows="2"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          />
        </div>
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium">Price note</label>
            <input
              v-model="form.translations[locale].priceNote"
              type="text"
              placeholder="e.g. Karsa Launch Pricing — introductory rate"
              class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
            >
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium">Recommended for</label>
            <input
              v-model="form.translations[locale].recommendedFor"
              type="text"
              class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
            >
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium">Duration note</label>
            <input
              v-model="form.translations[locale].durationNote"
              type="text"
              class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
            >
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium">Revision note</label>
            <input
              v-model="form.translations[locale].revisionNote"
              type="text"
              class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
            >
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
