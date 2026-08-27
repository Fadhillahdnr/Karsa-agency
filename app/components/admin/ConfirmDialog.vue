<script setup lang="ts">
const { state, answer } = useConfirm()
const dialogRef = ref<HTMLElement | null>(null)

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    answer(false)
    return
  }

  if (event.key !== 'Tab' || !dialogRef.value) return

  const focusable = dialogRef.value.querySelectorAll<HTMLElement>('button:not([disabled])')
  if (focusable.length === 0) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (!first || !last) return

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  }
  else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(() => state.value.open, async (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeydown)
    await nextTick()
    dialogRef.value?.querySelector<HTMLElement>('[data-confirm-cancel]')?.focus()
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
    <Transition name="confirm-backdrop">
      <div
        v-if="state.open"
        class="fixed inset-0 z-[110] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
        @click.self="answer(false)"
      >
        <Transition
          name="confirm-panel"
          appear
        >
          <div
            ref="dialogRef"
            role="alertdialog"
            aria-modal="true"
            :aria-label="state.title"
            class="w-full max-w-sm rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 shadow-[var(--shadow-lg)]"
          >
            <div
              v-if="state.danger"
              class="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-danger)]/10 text-[var(--color-danger)]"
            >
              <AdminIcon name="alert" />
            </div>
            <h2 class="font-display text-lg font-medium">
              {{ state.title }}
            </h2>
            <p
              v-if="state.description"
              class="mt-2 text-sm text-[var(--color-text-muted)]"
            >
              {{ state.description }}
            </p>
            <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                data-confirm-cancel
                class="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--color-border)] px-5 text-sm font-medium hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                @click="answer(false)"
              >
                {{ state.cancelLabel }}
              </button>
              <button
                type="button"
                class="inline-flex min-h-[44px] items-center justify-center rounded-full px-5 text-sm font-medium transition-colors"
                :class="state.danger
                  ? 'bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger)]/85'
                  : 'bg-[var(--color-accent)] text-[var(--color-on-accent)] hover:bg-[var(--color-accent-strong)]'"
                @click="answer(true)"
              >
                {{ state.confirmLabel }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.confirm-backdrop-enter-active,
.confirm-backdrop-leave-active {
  transition: opacity var(--duration-base) var(--ease-out);
}
.confirm-backdrop-enter-from,
.confirm-backdrop-leave-to {
  opacity: 0;
}

.confirm-panel-enter-active,
.confirm-panel-leave-active {
  transition: all var(--duration-base) var(--ease-out);
}
.confirm-panel-enter-from,
.confirm-panel-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
}
</style>
