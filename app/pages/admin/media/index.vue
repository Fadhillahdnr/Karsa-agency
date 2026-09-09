<script setup lang="ts">
import type { MediaAssetRow } from '../../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { authFetch } = useAdminAuth()
const toast = useToast()
const { confirm } = useConfirm()

const assets = ref<MediaAssetRow[]>([])
const loading = ref(true)
const errorMessage = ref('')
const search = ref('')
const typeFilter = ref<'' | MediaAssetRow['resource_type']>('')
const uploading = ref(false)
const selected = ref<MediaAssetRow | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

let searchDebounce: ReturnType<typeof setTimeout> | null = null

const typeTabs: { label: string, value: '' | MediaAssetRow['resource_type'] }[] = [
  { label: 'All', value: '' },
  { label: 'Images', value: 'image' },
  { label: 'Videos', value: 'video' },
  { label: 'Documents', value: 'document' },
]

async function loadAssets() {
  loading.value = true
  errorMessage.value = ''
  try {
    const query = new URLSearchParams()
    if (search.value.trim()) query.set('search', search.value.trim())
    if (typeFilter.value) query.set('type', typeFilter.value)
    assets.value = await authFetch<MediaAssetRow[]>(`/api/admin/media?${query.toString()}`)
  }
  catch {
    errorMessage.value = 'Could not load media.'
  }
  finally {
    loading.value = false
  }
}

watch(typeFilter, loadAssets)
watch(search, () => {
  if (searchDebounce) clearTimeout(searchDebounce)
  searchDebounce = setTimeout(loadAssets, 350)
})

function triggerUpload() {
  fileInput.value?.click()
}

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    const created = await authFetch<MediaAssetRow>('/api/admin/media', { method: 'POST', body: formData })
    assets.value = [created, ...assets.value]
    toast.success('Media uploaded.')
  }
  catch {
    toast.error('Upload failed.')
  }
  finally {
    uploading.value = false
  }
}

async function saveAltText(asset: MediaAssetRow, altText: string) {
  try {
    const updated = await authFetch<MediaAssetRow>(`/api/admin/media/${asset.id}`, {
      method: 'PATCH',
      body: { altText },
    })
    const index = assets.value.findIndex(a => a.id === asset.id)
    if (index !== -1) assets.value[index] = updated
    if (selected.value?.id === asset.id) selected.value = updated
    toast.success('Alt text saved.')
  }
  catch {
    toast.error('Could not save alt text.')
  }
}

async function deleteAsset(asset: MediaAssetRow) {
  const ok = await confirm({
    title: 'Delete this media asset?',
    description: 'This removes it from the media library. Content that referenced it will fall back gracefully rather than break.',
    confirmLabel: 'Delete',
    danger: true,
  })
  if (!ok) return

  try {
    await authFetch(`/api/admin/media/${asset.id}`, { method: 'DELETE' })
    assets.value = assets.value.filter(a => a.id !== asset.id)
    if (selected.value?.id === asset.id) selected.value = null
    toast.success('Media asset deleted.')
  }
  catch {
    toast.error('Could not delete media asset.')
  }
}

function copyUrl(asset: MediaAssetRow) {
  navigator.clipboard.writeText(asset.secure_url || asset.url)
  toast.success('URL copied.')
}

onMounted(loadAssets)
</script>

<template>
  <div>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="font-display text-2xl font-medium">
          Media Library
        </h1>
        <p class="mt-1 text-sm text-[var(--color-text-muted)]">
          Images, videos, and documents used across the site.
        </p>
      </div>
      <BaseButton
        variant="primary"
        :disabled="uploading"
        @click="triggerUpload"
      >
        <AdminIcon
          :name="uploading ? 'spinner' : 'upload'"
          :size="16"
        />
        {{ uploading ? 'Uploading…' : 'Upload' }}
      </BaseButton>
      <input
        ref="fileInput"
        type="file"
        accept="image/*,video/*,application/pdf"
        class="hidden"
        @change="handleFileChange"
      >
    </div>

    <div class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative w-full sm:max-w-xs">
        <AdminIcon
          name="search"
          :size="16"
          class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--color-text-muted)]"
        />
        <input
          v-model="search"
          type="search"
          placeholder="Search alt text, caption, folder…"
          class="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 pr-4 pl-9 text-sm focus-visible:border-[var(--color-accent)]"
        >
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tab in typeTabs"
          :key="tab.value"
          type="button"
          class="min-h-[36px] rounded-full border px-3.5 text-xs font-medium transition-colors"
          :class="typeFilter === tab.value
            ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
            : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'"
          @click="typeFilter = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>
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
      class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
    >
      <SkeletonBlock
        v-for="i in 10"
        :key="i"
        height="9rem"
        rounded="var(--radius-md)"
      />
    </div>

    <EmptyState
      v-else-if="!assets.length"
      class="mt-6"
      icon="image"
      title="No media yet"
      description="Upload your first image, video, or document to start the library."
    />

    <div
      v-else
      class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
    >
      <button
        v-for="asset in assets"
        :key="asset.id"
        type="button"
        class="group relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-left"
        @click="selected = asset"
      >
        <img
          v-if="asset.resource_type === 'image'"
          :src="asset.secure_url || asset.url"
          :alt="asset.alt_text || ''"
          class="h-full w-full object-cover"
          loading="lazy"
        >
        <img
          v-else-if="asset.resource_type === 'video' && asset.thumbnail_url"
          :src="asset.thumbnail_url"
          alt=""
          class="h-full w-full object-cover"
          loading="lazy"
        >
        <div
          v-else
          class="flex h-full w-full items-center justify-center text-[var(--color-text-muted)]"
        >
          <AdminIcon
            :name="asset.resource_type === 'video' ? 'external-link' : 'image'"
            :size="28"
          />
        </div>

        <span
          v-if="!asset.alt_text && asset.resource_type === 'image'"
          class="absolute top-2 left-2 rounded-full bg-[var(--color-danger)] px-2 py-0.5 text-[10px] font-medium text-white"
        >
          No alt text
        </span>

        <span class="absolute inset-x-0 bottom-0 truncate bg-black/60 px-2 py-1 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100">
          {{ asset.alt_text || asset.public_id || 'Untitled' }}
        </span>
      </button>
    </div>

    <!-- Detail panel -->
    <div
      v-if="selected"
      class="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center"
      @click.self="selected = null"
    >
      <div class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:rounded-[var(--radius-lg)]">
        <div class="flex items-start justify-between gap-4">
          <h2 class="font-display text-lg font-medium">
            Media details
          </h2>
          <button
            type="button"
            class="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            aria-label="Close"
            @click="selected = null"
          >
            <AdminIcon name="close" />
          </button>
        </div>

        <img
          v-if="selected.resource_type === 'image'"
          :src="selected.secure_url || selected.url"
          :alt="selected.alt_text || ''"
          class="mt-4 max-h-64 w-full rounded-[var(--radius-md)] object-contain"
        >

        <dl class="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-[var(--color-text-muted)]">
          <dt>Type</dt>
          <dd>{{ selected.resource_type }}</dd>
          <dt v-if="selected.width">
            Dimensions
          </dt>
          <dd v-if="selected.width">
            {{ selected.width }}×{{ selected.height }}
          </dd>
          <dt v-if="selected.bytes">
            Size
          </dt>
          <dd v-if="selected.bytes">
            {{ Math.round(selected.bytes / 1024) }} KB
          </dd>
        </dl>

        <label class="mt-4 block text-xs font-medium text-[var(--color-text-muted)]">
          Alt text
          <input
            :value="selected.alt_text || ''"
            type="text"
            class="mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus-visible:border-[var(--color-accent)]"
            placeholder="Describe this image for accessibility"
            @change="saveAltText(selected!, ($event.target as HTMLInputElement).value)"
          >
        </label>

        <div class="mt-6 flex flex-wrap gap-2">
          <BaseButton
            variant="secondary"
            @click="copyUrl(selected)"
          >
            <AdminIcon
              name="copy"
              :size="16"
            /> Copy URL
          </BaseButton>
          <BaseButton
            variant="ghost"
            @click="deleteAsset(selected)"
          >
            <AdminIcon
              name="trash"
              :size="16"
            /> Delete
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
