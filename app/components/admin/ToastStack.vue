<script setup lang="ts">
const { toasts, dismiss } = useToast()

const iconByVariant = {
  success: 'check',
  error: 'alert',
  info: 'alert',
} as const

const toneClass = {
  success: 'border-[var(--color-accent)]/40 text-[var(--color-accent)]',
  error: 'border-[var(--color-danger)]/40 text-[var(--color-danger)]',
  info: 'border-[var(--color-border)] text-[var(--color-text)]',
} as const
</script>

<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
      aria-live="polite"
    >
      <TransitionGroup
        name="toast"
        tag="div"
        class="flex w-full max-w-sm flex-col gap-2"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          role="status"
          class="pointer-events-auto flex items-start gap-3 rounded-[var(--radius-md)] border bg-[var(--color-surface-raised)] p-4 text-sm shadow-[var(--shadow-lg)]"
          :class="toneClass[toast.variant]"
        >
          <AdminIcon
            :name="iconByVariant[toast.variant]"
            :size="18"
            class="mt-0.5 shrink-0"
          />
          <p class="flex-1 text-[var(--color-text)]">
            {{ toast.message }}
          </p>
          <button
            type="button"
            class="shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            aria-label="Dismiss notification"
            @click="dismiss(toast.id)"
          >
            <AdminIcon
              name="close"
              :size="16"
            />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all var(--duration-base) var(--ease-out);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.toast-leave-active {
  position: absolute;
}
</style>
