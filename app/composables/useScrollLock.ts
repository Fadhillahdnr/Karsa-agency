/**
 * Shared lock count for the admin app-shell's scrollable content pane.
 *
 * Module-level state (not inside the composable function) so every caller
 * — the mobile sidebar drawer, ConfirmDialog, etc. — shares one counter.
 * A counter (not a boolean) so two overlays open at once don't let the
 * first close() call re-enable scrolling while the second is still open.
 */
const lockCount = ref(0)

export function useScrollLock() {
  function lock() {
    lockCount.value += 1
  }

  function unlock() {
    lockCount.value = Math.max(0, lockCount.value - 1)
  }

  const isLocked = computed(() => lockCount.value > 0)

  return { lock, unlock, isLocked }
}
