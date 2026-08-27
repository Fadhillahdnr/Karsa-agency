<script setup lang="ts">
export interface ProjectFormValue {
  slug: string
  title: string
  year: number
  type: 'Independent Project' | 'Internal Concept' | 'Experimental Work'
  category: string
  servicesText: string
  description: string
  cover: string
  featured: boolean
  challenge: string
  approach: string
  outcome: string
  order: number
  published: boolean
}

const props = withDefaults(defineProps<{
  initial?: Partial<ProjectFormValue>
  submitting?: boolean
  submitLabel?: string
  errorMessage?: string
}>(), {
  initial: undefined,
  submitting: false,
  submitLabel: 'Save project',
  errorMessage: '',
})

const emit = defineEmits<{
  submit: [value: ProjectFormValue]
}>()

const form = reactive<ProjectFormValue>({
  slug: props.initial?.slug ?? '',
  title: props.initial?.title ?? '',
  year: props.initial?.year ?? new Date().getFullYear(),
  type: props.initial?.type ?? 'Independent Project',
  category: props.initial?.category ?? '',
  servicesText: props.initial?.servicesText ?? '',
  description: props.initial?.description ?? '',
  cover: props.initial?.cover ?? '',
  featured: props.initial?.featured ?? false,
  challenge: props.initial?.challenge ?? '',
  approach: props.initial?.approach ?? '',
  outcome: props.initial?.outcome ?? '',
  order: props.initial?.order ?? 0,
  published: props.initial?.published ?? true,
})

const typeOptions: ProjectFormValue['type'][] = ['Independent Project', 'Internal Concept', 'Experimental Work']

const { authFetch } = useAdminAuth()
const uploading = ref(false)
const uploadError = ref('')
const dragActive = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const coverIsVideo = ref(/\.(mp4|webm|mov|ogg)($|\?)/i.test(props.initial?.cover ?? ''))

const touched = reactive<Record<string, boolean>>({})
const attemptedSubmit = ref(false)

function markTouched(field: string) {
  touched[field] = true
}

const errors = computed(() => ({
  title: form.title.trim().length < 2 ? 'Title is required.' : '',
  slug: !form.slug.trim()
    ? 'Slug is required.'
    : !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug.trim())
        ? 'Use lowercase letters, numbers, and hyphens only.'
        : '',
  category: form.category.trim().length < 2 ? 'Category is required.' : '',
  servicesText: form.servicesText.split(',').map(s => s.trim()).filter(Boolean).length === 0
    ? 'Add at least one service.'
    : '',
  description: form.description.trim().length < 10
    ? 'Write at least 10 characters.'
    : form.description.length > 500
      ? 'Keep it under 500 characters.'
      : '',
  cover: !form.cover ? 'Upload a cover image.' : '',
  year: !Number.isInteger(form.year) || form.year < 2000 || form.year > 2100 ? 'Enter a valid year.' : '',
}))

const isValid = computed(() => Object.values(errors.value).every(message => !message))

function shouldShowError(field: keyof typeof errors.value) {
  return (touched[field] || attemptedSubmit.value) && !!errors.value[field]
}

async function uploadFile(file: File) {
  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
    uploadError.value = 'Please upload an image or video file.'
    return
  }

  uploading.value = true
  uploadError.value = ''

  const body = new FormData()
  body.append('file', file)

  try {
    const result = await authFetch<{ url: string, resourceType: string }>('/api/admin/upload', {
      method: 'POST',
      body,
    })
    form.cover = result.url
    coverIsVideo.value = result.resourceType === 'video'
    touched.cover = true
  }
  catch (error) {
    uploadError.value = extractErrorMessage(error, 'Upload failed.')
  }
  finally {
    uploading.value = false
  }
}

function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) uploadFile(file)
}

function handleDrop(event: DragEvent) {
  dragActive.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) uploadFile(file)
}

function removeCover() {
  form.cover = ''
  coverIsVideo.value = false
  touched.cover = true
  if (fileInput.value) fileInput.value.value = ''
}

function handleSubmit() {
  attemptedSubmit.value = true
  if (!isValid.value) return
  emit('submit', { ...form })
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
      <div class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            for="project-title"
            class="mb-2 block text-sm font-medium"
          >Title <span aria-hidden="true">*</span></label>
          <input
            id="project-title"
            v-model="form.title"
            type="text"
            class="w-full rounded-[var(--radius-md)] border bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
            :class="shouldShowError('title') ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]'"
            :aria-invalid="shouldShowError('title')"
            :aria-describedby="shouldShowError('title') ? 'project-title-error' : undefined"
            @blur="markTouched('title')"
          >
          <p
            v-if="shouldShowError('title')"
            id="project-title-error"
            class="mt-1.5 text-xs text-[var(--color-danger)]"
          >
            {{ errors.title }}
          </p>
        </div>

        <div>
          <label
            for="project-slug"
            class="mb-2 block text-sm font-medium"
          >Slug <span aria-hidden="true">*</span></label>
          <input
            id="project-slug"
            v-model="form.slug"
            type="text"
            placeholder="e.g. aanaya"
            class="w-full rounded-[var(--radius-md)] border bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
            :class="shouldShowError('slug') ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]'"
            :aria-invalid="shouldShowError('slug')"
            :aria-describedby="shouldShowError('slug') ? 'project-slug-error' : 'project-slug-hint'"
            @blur="markTouched('slug')"
          >
          <p
            v-if="shouldShowError('slug')"
            id="project-slug-error"
            class="mt-1.5 text-xs text-[var(--color-danger)]"
          >
            {{ errors.slug }}
          </p>
          <p
            v-else
            id="project-slug-hint"
            class="mt-1.5 text-xs text-[var(--color-text-muted)]"
          >
            Becomes the URL: /work/{{ form.slug || '<slug>' }}
          </p>
        </div>

        <div>
          <label
            for="project-year"
            class="mb-2 block text-sm font-medium"
          >Year <span aria-hidden="true">*</span></label>
          <input
            id="project-year"
            v-model.number="form.year"
            type="number"
            inputmode="numeric"
            class="w-full rounded-[var(--radius-md)] border bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
            :class="shouldShowError('year') ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]'"
            @blur="markTouched('year')"
          >
          <p
            v-if="shouldShowError('year')"
            class="mt-1.5 text-xs text-[var(--color-danger)]"
          >
            {{ errors.year }}
          </p>
        </div>

        <div>
          <label
            for="project-type"
            class="mb-2 block text-sm font-medium"
          >Type <span aria-hidden="true">*</span></label>
          <select
            id="project-type"
            v-model="form.type"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          >
            <option
              v-for="option in typeOptions"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </div>

        <div>
          <label
            for="project-category"
            class="mb-2 block text-sm font-medium"
          >Category <span aria-hidden="true">*</span></label>
          <input
            id="project-category"
            v-model="form.category"
            type="text"
            placeholder="e.g. E-Commerce"
            class="w-full rounded-[var(--radius-md)] border bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
            :class="shouldShowError('category') ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]'"
            @blur="markTouched('category')"
          >
          <p
            v-if="shouldShowError('category')"
            class="mt-1.5 text-xs text-[var(--color-danger)]"
          >
            {{ errors.category }}
          </p>
        </div>

        <div>
          <label
            for="project-services"
            class="mb-2 block text-sm font-medium"
          >Services <span aria-hidden="true">*</span></label>
          <input
            id="project-services"
            v-model="form.servicesText"
            type="text"
            placeholder="UI/UX Design, Web Development"
            class="w-full rounded-[var(--radius-md)] border bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
            :class="shouldShowError('servicesText') ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]'"
            @blur="markTouched('servicesText')"
          >
          <p
            v-if="shouldShowError('servicesText')"
            class="mt-1.5 text-xs text-[var(--color-danger)]"
          >
            {{ errors.servicesText }}
          </p>
          <p
            v-else
            class="mt-1.5 text-xs text-[var(--color-text-muted)]"
          >
            Comma-separated.
          </p>
        </div>

        <div>
          <label
            for="project-order"
            class="mb-2 block text-sm font-medium"
          >Order</label>
          <input
            id="project-order"
            v-model.number="form.order"
            type="number"
            inputmode="numeric"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          >
          <p class="mt-1.5 text-xs text-[var(--color-text-muted)]">
            Lower numbers appear first on /work.
          </p>
        </div>

        <div class="flex flex-col justify-end gap-3 pb-1">
          <label class="flex min-h-[24px] items-center gap-2 text-sm font-medium">
            <input
              v-model="form.featured"
              type="checkbox"
              class="h-4 w-4 rounded border-[var(--color-border)]"
            >
            Featured on homepage
          </label>
          <label class="flex min-h-[24px] items-center gap-2 text-sm font-medium">
            <input
              v-model="form.published"
              type="checkbox"
              class="h-4 w-4 rounded border-[var(--color-border)]"
            >
            Published
          </label>
        </div>
      </div>

      <div class="mt-5">
        <label
          for="project-description"
          class="mb-2 block text-sm font-medium"
        >Description <span aria-hidden="true">*</span></label>
        <textarea
          id="project-description"
          v-model="form.description"
          rows="3"
          class="w-full rounded-[var(--radius-md)] border bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          :class="shouldShowError('description') ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]'"
          @blur="markTouched('description')"
        />
        <div class="mt-1.5 flex items-center justify-between text-xs">
          <p :class="shouldShowError('description') ? 'text-[var(--color-danger)]' : 'text-[var(--color-text-muted)]'">
            {{ shouldShowError('description') ? errors.description : 'One-sentence summary shown in listings.' }}
          </p>
          <p class="shrink-0 text-[var(--color-text-muted)]">
            {{ form.description.length }}/500
          </p>
        </div>
      </div>
    </section>

    <section class="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
      <h2 class="font-display text-base font-medium">
        Cover image or video
      </h2>

      <div
        class="mt-5 flex flex-col items-center gap-4 rounded-[var(--radius-md)] border-2 border-dashed p-6 text-center transition-colors sm:flex-row sm:text-left"
        :class="dragActive ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5' : 'border-[var(--color-border)]'"
        @dragover.prevent="dragActive = true"
        @dragleave.prevent="dragActive = false"
        @drop.prevent="handleDrop"
      >
        <div
          v-if="form.cover"
          class="relative h-24 w-40 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-bg)]"
        >
          <video
            v-if="coverIsVideo"
            :src="form.cover"
            muted
            loop
            autoplay
            playsinline
            class="h-full w-full object-cover"
          />
          <img
            v-else
            :src="form.cover"
            alt="Cover preview"
            class="h-full w-full object-cover"
          >
          <button
            type="button"
            class="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
            aria-label="Remove cover image"
            @click="removeCover"
          >
            <AdminIcon
              name="close"
              :size="14"
            />
          </button>
        </div>
        <div
          v-else
          class="flex h-24 w-40 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-bg)] text-[var(--color-text-muted)]"
        >
          <AdminIcon
            name="image"
            :size="24"
          />
        </div>

        <div class="flex-1">
          <p class="text-sm font-medium">
            Drag and drop an image or video, or
            <button
              type="button"
              class="text-[var(--color-accent)] underline-offset-2 hover:underline"
              @click="fileInput?.click()"
            >
              browse files
            </button>
          </p>
          <p class="mt-1 text-xs text-[var(--color-text-muted)]">
            Image or video. Uploaded to Cloudinary.
          </p>
          <input
            ref="fileInput"
            type="file"
            accept="image/*,video/*"
            class="sr-only"
            @change="handleFileChange"
          >
          <p
            v-if="uploading"
            class="mt-2 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]"
          >
            <AdminIcon
              name="spinner"
              :size="14"
            /> Uploading…
          </p>
          <p
            v-if="uploadError"
            class="mt-2 text-xs text-[var(--color-danger)]"
          >
            {{ uploadError }}
          </p>
          <p
            v-if="shouldShowError('cover') && !uploading"
            class="mt-2 text-xs text-[var(--color-danger)]"
          >
            {{ errors.cover }}
          </p>
        </div>
      </div>
    </section>

    <section class="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
      <h2 class="font-display text-base font-medium">
        Case study content
      </h2>
      <p class="mt-1 text-xs text-[var(--color-text-muted)]">
        Optional. Shown on the project detail page.
      </p>
      <div class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <label
            for="project-challenge"
            class="mb-2 block text-sm font-medium"
          >Challenge</label>
          <textarea
            id="project-challenge"
            v-model="form.challenge"
            rows="5"
            maxlength="2000"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          />
        </div>
        <div>
          <label
            for="project-approach"
            class="mb-2 block text-sm font-medium"
          >Approach</label>
          <textarea
            id="project-approach"
            v-model="form.approach"
            rows="5"
            maxlength="2000"
            class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
          />
        </div>
        <div>
          <label
            for="project-outcome"
            class="mb-2 block text-sm font-medium"
          >Outcome</label>
          <textarea
            id="project-outcome"
            v-model="form.outcome"
            rows="5"
            maxlength="2000"
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
        Please fix the highlighted fields.
      </p>
      <span v-else />
      <BaseButton
        type="submit"
        variant="primary"
        :disabled="submitting || uploading"
      >
        {{ submitting ? 'Saving…' : submitLabel }}
      </BaseButton>
    </div>
  </form>
</template>
