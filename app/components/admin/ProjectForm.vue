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

const { $supabase } = useNuxtApp()
const uploading = ref(false)
const uploadError = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

async function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file || !$supabase) return

  uploading.value = true
  uploadError.value = ''

  const extension = file.name.split('.').pop() || 'jpg'
  const path = `${crypto.randomUUID()}.${extension}`

  const { error } = await $supabase.storage.from('project-covers').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) {
    uploadError.value = `Upload failed: ${error.message}`
    uploading.value = false
    return
  }

  const { data } = $supabase.storage.from('project-covers').getPublicUrl(path)
  form.cover = data.publicUrl
  uploading.value = false
}

function handleSubmit() {
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

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label
          for="project-title"
          class="mb-2 block text-sm font-medium"
        >Title <span aria-hidden="true">*</span></label>
        <input
          id="project-title"
          v-model="form.title"
          type="text"
          required
          class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
        >
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
          required
          placeholder="e.g. aanaya"
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
        >
        <p class="mt-2 text-xs text-[var(--color-text-muted)]">
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
          required
          class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
        >
      </div>

      <div>
        <label
          for="project-type"
          class="mb-2 block text-sm font-medium"
        >Type <span aria-hidden="true">*</span></label>
        <select
          id="project-type"
          v-model="form.type"
          class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
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
          required
          placeholder="e.g. E-Commerce"
          class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
        >
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
          required
          placeholder="UI/UX Design, Web Development"
          class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
        >
        <p class="mt-2 text-xs text-[var(--color-text-muted)]">
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
          class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
        >
        <p class="mt-2 text-xs text-[var(--color-text-muted)]">
          Lower numbers appear first on /work.
        </p>
      </div>

      <div class="flex flex-col justify-end gap-3 pb-3">
        <label class="flex items-center gap-2 text-sm font-medium">
          <input
            v-model="form.featured"
            type="checkbox"
            class="h-4 w-4 rounded border-[var(--color-border)]"
          >
          Featured
        </label>
        <label class="flex items-center gap-2 text-sm font-medium">
          <input
            v-model="form.published"
            type="checkbox"
            class="h-4 w-4 rounded border-[var(--color-border)]"
          >
          Published
        </label>
      </div>
    </div>

    <div>
      <label
        for="project-description"
        class="mb-2 block text-sm font-medium"
      >Description <span aria-hidden="true">*</span></label>
      <textarea
        id="project-description"
        v-model="form.description"
        rows="3"
        required
        class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
      />
    </div>

    <div>
      <label class="mb-2 block text-sm font-medium">Cover image <span aria-hidden="true">*</span></label>
      <div class="flex items-center gap-4">
        <div
          v-if="form.cover"
          class="h-20 w-32 overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-surface)]"
        >
          <img
            :src="form.cover"
            alt="Cover preview"
            class="h-full w-full object-cover"
          >
        </div>
        <div>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="text-sm"
            @change="handleFileChange"
          >
          <p
            v-if="uploading"
            class="mt-2 text-xs text-[var(--color-text-muted)]"
          >
            Uploading…
          </p>
          <p
            v-if="uploadError"
            class="mt-2 text-xs text-[var(--color-danger)]"
          >
            {{ uploadError }}
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div>
        <label
          for="project-challenge"
          class="mb-2 block text-sm font-medium"
        >Challenge</label>
        <textarea
          id="project-challenge"
          v-model="form.challenge"
          rows="4"
          class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
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
          rows="4"
          class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
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
          rows="4"
          class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm focus-visible:border-[var(--color-accent)]"
        />
      </div>
    </div>

    <div>
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
