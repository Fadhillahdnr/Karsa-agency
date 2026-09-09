<script setup lang="ts">
type Discipline = 'design' | 'photography' | 'videography'
type ItemType = 'image' | 'mockup' | 'video' | 'external_video' | 'before' | 'after' | 'document'

interface TranslationValue {
  title: string
  summary: string
  description: string
  credits: string
  seoTitle: string
  seoDescription: string
}

interface ItemValue {
  mediaId: string | null
  mediaUrl?: string
  itemType: ItemType
  externalUrl: string
  posterMediaId: string | null
  posterUrl?: string
  caption: string
  altText: string
  duration: number | null
  aspectRatio: string
  featured: boolean
}

export interface PortfolioFormValue {
  slug: string
  discipline: Discipline
  category: string
  clientId: string | null
  projectId: string | null
  coverMediaId: string | null
  coverUrl?: string
  featured: boolean
  permissionToShow: boolean
  orderIndex: number
  status: 'draft' | 'scheduled' | 'published' | 'archived'
  translations: { en: TranslationValue, id: TranslationValue }
  items: ItemValue[]
}

function emptyTranslation(): TranslationValue {
  return { title: '', summary: '', description: '', credits: '', seoTitle: '', seoDescription: '' }
}

const defaultItemType: Record<Discipline, ItemType> = {
  design: 'mockup',
  photography: 'image',
  videography: 'video',
}

const props = withDefaults(defineProps<{
  discipline: Discipline
  initial?: Partial<PortfolioFormValue>
  submitting?: boolean
  submitLabel?: string
  errorMessage?: string
  availableClients?: { id: string, name: string }[]
}>(), {
  initial: undefined,
  submitting: false,
  submitLabel: 'Save',
  errorMessage: '',
  availableClients: () => [],
})

const emit = defineEmits<{ submit: [value: PortfolioFormValue] }>()

const form = reactive<PortfolioFormValue>({
  slug: props.initial?.slug ?? '',
  discipline: props.discipline,
  category: props.initial?.category ?? '',
  clientId: props.initial?.clientId ?? null,
  projectId: props.initial?.projectId ?? null,
  coverMediaId: props.initial?.coverMediaId ?? null,
  coverUrl: props.initial?.coverUrl,
  featured: props.initial?.featured ?? false,
  permissionToShow: props.initial?.permissionToShow ?? false,
  orderIndex: props.initial?.orderIndex ?? 0,
  status: props.initial?.status ?? 'draft',
  translations: {
    en: { ...emptyTranslation(), ...props.initial?.translations?.en },
    id: { ...emptyTranslation(), ...props.initial?.translations?.id },
  },
  items: props.initial?.items ? props.initial.items.map(item => ({ ...item })) : [],
})

const { authFetch } = useAdminAuth()
const activeLocale = ref<'en' | 'id'>('en')
const attemptedSubmit = ref(false)
const coverUploading = ref(false)
const itemUploading = ref<number | null>(null)

const isValid = computed(() =>
  !!form.slug.trim() && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug.trim())
  && form.translations.en.title.trim().length > 0
  && form.translations.id.title.trim().length > 0,
)

const itemTypeOptions: Record<Discipline, ItemType[]> = {
  design: ['mockup', 'image', 'before', 'after', 'document'],
  photography: ['image', 'before', 'after'],
  videography: ['video', 'external_video'],
}

async function uploadFile(file: File): Promise<{ id: string, url: string } | null> {
  const body = new FormData()
  body.append('file', file)
  try {
    const result = await authFetch<{ id: string, secure_url: string | null, url: string }>('/api/admin/media', {
      method: 'POST',
      body,
    })
    return { id: result.id, url: result.secure_url || result.url }
  }
  catch {
    return null
  }
}

async function handleCoverUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  coverUploading.value = true
  const uploaded = await uploadFile(file)
  if (uploaded) {
    form.coverMediaId = uploaded.id
    form.coverUrl = uploaded.url
  }
  coverUploading.value = false
}

function addItem() {
  form.items.push({
    mediaId: null,
    itemType: defaultItemType[props.discipline],
    externalUrl: '',
    posterMediaId: null,
    caption: '',
    altText: '',
    duration: null,
    aspectRatio: '',
    featured: false,
  })
}

function removeItem(index: number) {
  form.items.splice(index, 1)
}

function moveItem(index: number, direction: -1 | 1) {
  const target = index + direction
  if (target < 0 || target >= form.items.length) return
  const [item] = form.items.splice(index, 1)
  form.items.splice(target, 0, item!)
}

async function handleItemMediaUpload(event: Event, index: number) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  itemUploading.value = index
  const uploaded = await uploadFile(file)
  if (uploaded) {
    form.items[index]!.mediaId = uploaded.id
    form.items[index]!.mediaUrl = uploaded.url
  }
  itemUploading.value = null
}

async function handleItemPosterUpload(event: Event, index: number) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  itemUploading.value = index
  const uploaded = await uploadFile(file)
  if (uploaded) {
    form.items[index]!.posterMediaId = uploaded.id
    form.items[index]!.posterUrl = uploaded.url
  }
  itemUploading.value = null
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

    <p
      v-if="!form.permissionToShow"
      class="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-xs text-[var(--color-text-muted)]"
    >
      Not shown publicly until "Permission to show" is checked — evidence needs explicit permission regardless of status (§13A.5).
    </p>

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
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          >
          <p class="mt-1.5 text-xs text-[var(--color-text-muted)]">
            /{{ discipline }}/{{ form.slug || '<slug>' }}
          </p>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Category</label>
          <input
            v-model="form.category"
            type="text"
            placeholder="e.g. Brand Identity"
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
              v-for="option in (['draft', 'scheduled', 'published', 'archived'] as const)"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </div>
        <div v-if="availableClients.length">
          <label class="mb-2 block text-sm font-medium">Client</label>
          <select
            v-model="form.clientId"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          >
            <option :value="null">
              —
            </option>
            <option
              v-for="client in availableClients"
              :key="client.id"
              :value="client.id"
            >
              {{ client.name }}
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
        <div class="flex flex-col justify-end gap-3 pb-1">
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
            Permission to show
          </label>
        </div>
      </div>

      <div class="mt-5">
        <label class="mb-2 block text-sm font-medium">Cover image</label>
        <div class="flex items-center gap-4">
          <div class="flex h-20 w-32 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-bg)]">
            <img
              v-if="form.coverUrl"
              :src="form.coverUrl"
              alt=""
              class="h-full w-full object-cover"
            >
            <AdminIcon
              v-else
              name="image"
              :size="20"
              class="text-[var(--color-text-muted)]"
            />
          </div>
          <label class="text-sm font-medium text-[var(--color-accent)]">
            {{ coverUploading ? 'Uploading…' : 'Upload cover' }}
            <input
              type="file"
              accept="image/*"
              class="sr-only"
              :disabled="coverUploading"
              @change="handleCoverUpload"
            >
          </label>
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
          <label class="mb-2 block text-sm font-medium">Summary</label>
          <textarea
            v-model="form.translations[locale].summary"
            rows="2"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          />
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Description</label>
          <textarea
            v-model="form.translations[locale].description"
            rows="4"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          />
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Credits</label>
          <input
            v-model="form.translations[locale].credits"
            type="text"
            placeholder="e.g. Photography: Jane Doe"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          >
        </div>
      </div>
    </section>

    <section class="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
      <div class="flex items-center justify-between">
        <h2 class="font-display text-base font-medium">
          Media items
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
        class="mt-4 flex flex-col gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] p-4 sm:flex-row"
      >
        <div class="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-sm)] bg-[var(--color-surface)]">
          <img
            v-if="item.mediaUrl && item.itemType !== 'video' && item.itemType !== 'external_video'"
            :src="item.mediaUrl"
            alt=""
            class="h-full w-full object-cover"
          >
          <img
            v-else-if="item.posterUrl"
            :src="item.posterUrl"
            alt=""
            class="h-full w-full object-cover"
          >
          <AdminIcon
            v-else
            name="image"
            :size="20"
            class="text-[var(--color-text-muted)]"
          />
        </div>

        <div class="flex-1">
          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <select
              v-model="item.itemType"
              class="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm capitalize focus-visible:border-[var(--color-accent)]"
            >
              <option
                v-for="type in itemTypeOptions[discipline]"
                :key="type"
                :value="type"
              >
                {{ type.replace('_', ' ') }}
              </option>
            </select>

            <label
              v-if="item.itemType !== 'external_video'"
              class="flex items-center gap-2 text-xs font-medium text-[var(--color-accent)]"
            >
              {{ itemUploading === index ? 'Uploading…' : (item.mediaUrl ? 'Replace file' : 'Upload file') }}
              <input
                type="file"
                :accept="item.itemType === 'video' ? 'video/*' : 'image/*'"
                class="sr-only"
                :disabled="itemUploading === index"
                @change="handleItemMediaUpload($event, index)"
              >
            </label>

            <input
              v-if="item.itemType === 'external_video'"
              v-model="item.externalUrl"
              type="url"
              placeholder="YouTube or Vimeo URL"
              class="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm sm:col-span-2 focus-visible:border-[var(--color-accent)]"
            >

            <label
              v-if="item.itemType === 'video' || item.itemType === 'external_video'"
              class="flex items-center gap-2 text-xs font-medium text-[var(--color-accent)]"
            >
              {{ item.posterUrl ? 'Replace poster' : 'Upload poster' }}
              <input
                type="file"
                accept="image/*"
                class="sr-only"
                @change="handleItemPosterUpload($event, index)"
              >
            </label>
          </div>

          <input
            v-model="item.caption"
            type="text"
            placeholder="Caption"
            class="mt-2 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm focus-visible:border-[var(--color-accent)]"
          >
          <input
            v-model="item.altText"
            type="text"
            placeholder="Alt text (accessibility)"
            class="mt-2 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm focus-visible:border-[var(--color-accent)]"
          >

          <div class="mt-2 flex items-center justify-between">
            <label class="flex items-center gap-1.5 text-xs">
              <input
                v-model="item.featured"
                type="checkbox"
                class="h-4 w-4 rounded border-[var(--color-border)]"
              >
              Featured
            </label>
            <div class="flex items-center gap-1">
              <button
                type="button"
                class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-30"
                :disabled="index === 0"
                aria-label="Move up"
                @click="moveItem(index, -1)"
              >
                ↑
              </button>
              <button
                type="button"
                class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-30"
                :disabled="index === form.items.length - 1"
                aria-label="Move down"
                @click="moveItem(index, 1)"
              >
                ↓
              </button>
              <button
                type="button"
                class="ml-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"
                aria-label="Remove item"
                @click="removeItem(index)"
              >
                <AdminIcon
                  name="trash"
                  :size="16"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <p
        v-if="!form.items.length"
        class="mt-4 text-sm text-[var(--color-text-muted)]"
      >
        No media items yet.
      </p>
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
