export interface ConfirmOptions {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}

interface ConfirmState extends ConfirmOptions {
  open: boolean
  resolve: ((value: boolean) => void) | null
}

/**
 * Global confirm-dialog state shared across the /admin panel via useState.
 * ConfirmDialog.vue (mounted once in the admin layout) renders it;
 * `confirm()` returns a promise so call sites can `await` the answer
 * instead of dealing with a native window.confirm() (unstyled, blocking,
 * and untestable).
 */
export function useConfirm() {
  const state = useState<ConfirmState>('admin-confirm', () => ({
    open: false,
    title: '',
    description: '',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    danger: false,
    resolve: null,
  }))

  function confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      state.value = {
        open: true,
        confirmLabel: 'Confirm',
        cancelLabel: 'Cancel',
        danger: false,
        ...options,
        resolve,
      }
    })
  }

  function answer(value: boolean) {
    state.value.resolve?.(value)
    state.value = { ...state.value, open: false, resolve: null }
  }

  return { state, confirm, answer }
}
