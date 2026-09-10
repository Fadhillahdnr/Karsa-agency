<script setup lang="ts">
import type { PageSectionRow } from '../../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { authFetch } = useAdminAuth()
const toast = useToast()

const sections = ref<PageSectionRow[]>([])
const loading = ref(true)
const errorMessage = ref('')
const savingId = ref<string | null>(null)
const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const labels: Record<string, string> = {
  hero: 'Hero',
  client_logos: 'Client Logos',
  brand_statement: 'Brand Statement',
  service_grid: 'Services + Capabilities',
  integrated_package: 'Full Presence',
  featured_work: 'Selected Work',
  why_karsa: 'Why Karsa',
  process: 'Process + Delivery Trust',
  testimonials: 'Testimonials',
  insights: 'Insights (not built yet — Milestone 07)',
  updates: 'Updates (not built yet — Milestone 07)',
  faq: 'FAQ (not built yet — Milestone 07)',
  cta: 'Final CTA',
}

async function loadSections() {
  loading.value = true
  errorMessage.value = ''
  try {
    sections.value = await authFetch<PageSectionRow[]>('/api/admin/content/home')
  }
  catch {
    errorMessage.value = 'Could not load homepage sections.'
  }
  finally {
    loading.value = false
  }
}

async function patchSection(section: PageSectionRow, body: Record<string, unknown>) {
  savingId.value = section.id
  try {
    const updated = await authFetch<PageSectionRow>(`/api/admin/content/home/sections/${section.id}`, {
      method: 'PATCH',
      body,
    })
    const index = sections.value.findIndex(s => s.id === section.id)
    if (index !== -1) sections.value[index] = updated
  }
  catch {
    toast.error('Could not save change.')
  }
  finally {
    savingId.value = null
  }
}

function toggleEnabled(section: PageSectionRow) {
  patchSection(section, { enabled: !section.enabled })
}

function setTheme(section: PageSectionRow, theme: string) {
  patchSection(section, { themeVariant: theme })
}

async function persistOrder(previous: PageSectionRow[]) {
  const changed = sections.value
    .map((section, index) => ({ section, index }))
    .filter(({ section, index }) => previous.find(p => p.id === section.id)?.order_index !== index)

  sections.value = sections.value.map((section, index) => ({ ...section, order_index: index }))

  await Promise.all(
    changed.map(({ section, index }) => patchSection(section, { orderIndex: index })),
  )
}

async function moveSection(index: number, direction: -1 | 1) {
  const target = index + direction
  if (target < 0 || target >= sections.value.length) return

  const previous = sections.value
  const reordered = [...sections.value]
  const [moved] = reordered.splice(index, 1)
  reordered.splice(target, 0, moved!)
  sections.value = reordered

  await persistOrder(previous)
}

function onDragStart(index: number, event: DragEvent) {
  draggedIndex.value = index
  event.dataTransfer?.setData('text/plain', String(index))
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
}

function onDragOver(index: number, event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
  dragOverIndex.value = index
}

async function onDrop(index: number) {
  const from = draggedIndex.value
  draggedIndex.value = null
  dragOverIndex.value = null
  if (from === null || from === index) return

  const previous = sections.value
  const reordered = [...sections.value]
  const [moved] = reordered.splice(from, 1)
  reordered.splice(index, 0, moved!)
  sections.value = reordered

  await persistOrder(previous)
}

function onDragEnd() {
  draggedIndex.value = null
  dragOverIndex.value = null
}

onMounted(loadSections)
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium">
      Homepage
    </h1>
    <p class="mt-1 text-sm text-[var(--color-text-muted)]">
      Reorder, show/hide, and pick a background theme for each homepage section. Content itself is still edited in each module (Services, Packages, Clients, etc).
    </p>

    <p
      v-if="errorMessage"
      role="alert"
      class="mt-6 rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[var(--color-danger)]/10 p-4 text-sm"
    >
      {{ errorMessage }}
    </p>

    <div
      v-if="loading"
      class="mt-6 flex flex-col gap-3"
    >
      <SkeletonBlock
        v-for="i in 8"
        :key="i"
        height="3.5rem"
        rounded="var(--radius-md)"
      />
    </div>

    <ul
      v-else
      class="mt-6 flex flex-col gap-2"
    >
      <li
        v-for="(section, index) in sections"
        :key="section.id"
        draggable="true"
        class="flex flex-wrap items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors"
        :class="{
          'opacity-50': !section.enabled,
          'opacity-40': draggedIndex === index,
          'border-[var(--color-accent)]': dragOverIndex === index && draggedIndex !== index,
        }"
        @dragstart="onDragStart(index, $event)"
        @dragover="onDragOver(index, $event)"
        @drop="onDrop(index)"
        @dragend="onDragEnd"
      >
        <span
          class="cursor-grab select-none text-[var(--color-text-muted)] active:cursor-grabbing"
          aria-hidden="true"
          title="Drag to reorder"
        >
          ⠿
        </span>

        <div class="flex items-center gap-1">
          <button
            type="button"
            class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-30"
            :disabled="index === 0 || savingId !== null"
            aria-label="Move up"
            @click="moveSection(index, -1)"
          >
            ↑
          </button>
          <button
            type="button"
            class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-30"
            :disabled="index === sections.length - 1 || savingId !== null"
            aria-label="Move down"
            @click="moveSection(index, 1)"
          >
            ↓
          </button>
        </div>

        <p class="min-w-0 flex-1 truncate font-medium">
          {{ labels[section.section_key] ?? section.section_key }}
        </p>

        <select
          class="rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-1 text-xs font-medium capitalize"
          :value="section.theme_variant ?? 'auto'"
          :disabled="savingId === section.id"
          @change="setTheme(section, ($event.target as HTMLSelectElement).value)"
        >
          <option
            v-for="theme in ['light', 'dark', 'neutral', 'auto']"
            :key="theme"
            :value="theme"
          >
            {{ theme }}
          </option>
        </select>

        <button
          type="button"
          class="min-h-[36px] rounded-full border px-3.5 text-xs font-medium transition-colors"
          :class="section.enabled
            ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
            : 'border-[var(--color-border)] text-[var(--color-text-muted)]'"
          :disabled="savingId === section.id"
          @click="toggleEnabled(section)"
        >
          {{ section.enabled ? 'Enabled' : 'Disabled' }}
        </button>
      </li>
    </ul>
  </div>
</template>
