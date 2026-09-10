<script setup lang="ts">
const props = defineProps<{
  items: { url: string, alt: string, caption?: string | null }[]
  modelValue: number | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

const { t } = useI18n()

const isOpen = computed(() => props.modelValue !== null)
const current = computed(() => (props.modelValue !== null ? props.items[props.modelValue] : undefined))

function close() {
  emit('update:modelValue', null)
}

function step(direction: -1 | 1) {
  if (props.modelValue === null || props.items.length === 0) return
  const next = (props.modelValue + direction + props.items.length) % props.items.length
  emit('update:modelValue', next)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
  else if (event.key === 'ArrowLeft') step(-1)
  else if (event.key === 'ArrowRight') step(1)
}

let touchStartX = 0
function handleTouchStart(event: TouchEvent) {
  touchStartX = event.changedTouches[0]?.clientX ?? 0
}
function handleTouchEnd(event: TouchEvent) {
  const deltaX = (event.changedTouches[0]?.clientX ?? 0) - touchStartX
  if (Math.abs(deltaX) < 40) return
  step(deltaX > 0 ? -1 : 1)
}

watch(isOpen, (open) => {
  if (open) {
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeydown)
  }
  else {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox-backdrop">
      <div
        v-if="isOpen && current"
        role="dialog"
        aria-modal="true"
        class="fixed inset-0 z-[110] flex flex-col bg-black/95"
        @click.self="close"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
      >
        <div class="flex items-center justify-between p-4 text-white/80">
          <p
            v-if="items.length > 1"
            class="text-sm"
          >
            {{ t('portfolio.lightbox.counter', { current: (modelValue ?? 0) + 1, total: items.length }) }}
          </p>
          <span v-else />
          <button
            type="button"
            class="ml-auto flex h-10 w-10 items-center justify-center rounded-full text-2xl leading-none hover:bg-white/10"
            :aria-label="t('portfolio.lightbox.close')"
            @click="close"
          >
            ×
          </button>
        </div>

        <div class="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-4">
          <button
            v-if="items.length > 1"
            type="button"
            class="absolute left-2 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-2xl text-white hover:bg-black/60 sm:left-6"
            :aria-label="t('portfolio.lightbox.previous')"
            @click="step(-1)"
          >
            ‹
          </button>

          <img
            :src="current.url"
            :alt="current.alt"
            class="max-h-full max-w-full object-contain"
          >

          <button
            v-if="items.length > 1"
            type="button"
            class="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-2xl text-white hover:bg-black/60 sm:right-6"
            :aria-label="t('portfolio.lightbox.next')"
            @click="step(1)"
          >
            ›
          </button>
        </div>

        <p
          v-if="current.caption"
          class="px-4 pb-6 text-center text-sm text-white/70"
        >
          {{ current.caption }}
        </p>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lightbox-backdrop-enter-active,
.lightbox-backdrop-leave-active {
  transition: opacity var(--duration-base) var(--ease-out);
}
.lightbox-backdrop-enter-from,
.lightbox-backdrop-leave-to {
  opacity: 0;
}
</style>
